// All sound is synthesized here (Web Audio). Nothing is loaded from files.
// Threads are tuned strings (Karplus–Strong, D major pentatonic: no wrong notes),
// the night is a bed of synthesized crickets + a slow pad, insects buzz with oscillators.

import { clamp, lerp } from './util.js';

const SCALE = [0, 2, 4, 7, 9]; // major pentatonic degrees
const ROOT = 146.83; // D3

function noteFreq(i) {
  const oct = Math.floor(i / 5), deg = SCALE[((i % 5) + 5) % 5];
  return ROOT * Math.pow(2, oct + deg / 12);
}

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.platformMuted = false;
    try { this.muted = localStorage.getItem('silk.muted') === '1'; } catch (e) { /* storage blocked */ }
    this.last = new Map();
    this.layGrainAt = 0;
  }

  get on() { return !!this.ctx && !this.muted && !this.platformMuted; }

  unlock() {
    if (this.ctx) { this.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC({ latencyHint: 'interactive' });
    this.ctx = ctx;
    this.sr = ctx.sampleRate;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 10; comp.attack.value = 0.004; comp.release.value = 0.25;
    comp.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(comp);
    this.sfx = ctx.createGain(); this.sfx.gain.value = 0.9; this.sfx.connect(this.master);
    this.music = ctx.createGain(); this.music.gain.value = 0.32; this.music.connect(this.master);
    this.amb = ctx.createGain(); this.amb.gain.value = 0.5; this.amb.connect(this.master);
    // shared reverb from generated decaying noise
    this.rev = ctx.createConvolver();
    this.rev.buffer = this.makeIR(1.9);
    this.revIn = ctx.createGain(); this.revIn.gain.value = 0.32;
    this.revIn.connect(this.rev); this.rev.connect(this.master);
    this.music.connect(this.revIn);

    this.noise = this.makeNoise(2);
    this.plucks = [];
    for (let i = 0; i < 16; i++) this.plucks.push(this.makePluck(noteFreq(i), 2.2));
    this.crickets = this.makeCrickets(6);
    this.startAmbience();
    this.startPad();
    this.startBuzz();
    this.resume();
  }

  resume() {
    const c = this.ctx;
    if (c && (c.state === 'suspended' || c.state === 'interrupted')) c.resume().catch(() => {});
  }
  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); }

  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem('silk.muted', m ? '1' : '0'); } catch (e) { /* ignore */ }
    this.applyGain();
  }
  setPlatformMuted(m) { this.platformMuted = m; this.applyGain(); }
  applyGain() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(this.muted || this.platformMuted ? 0 : 0.9, t, 0.05);
  }

  // ------------------------------------------------------------ buffers
  makeNoise(sec) {
    const b = this.ctx.createBuffer(1, Math.floor(this.sr * sec), this.sr);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  makeIR(sec) {
    const n = Math.floor(this.sr * sec);
    const b = this.ctx.createBuffer(2, n, this.sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / this.sr;
        lp += 0.35 * ((Math.random() * 2 - 1) - lp);
        d[i] = lp * Math.exp((-6.9 * t) / sec) * (t < 0.01 ? t / 0.01 : 1);
      }
    }
    return b;
  }

  // Karplus–Strong plucked string, computed directly into a buffer.
  makePluck(freq, sec) {
    const n = Math.floor(this.sr * sec);
    const b = this.ctx.createBuffer(1, n, this.sr);
    const out = b.getChannelData(0);
    const N = Math.max(2, Math.round(this.sr / freq));
    const ring = new Float32Array(N);
    let prev = 0;
    for (let i = 0; i < N; i++) { const w = Math.random() * 2 - 1; prev = prev * 0.55 + w * 0.45; ring[i] = prev; }
    let idx = 0;
    const decay = 0.9975 - Math.min(0.004, freq / 400000);
    for (let i = 0; i < n; i++) {
      const a = ring[idx], c = ring[(idx + 1) % N];
      ring[idx] = (a * 0.5 + c * 0.5) * decay;
      out[i] = a;
      idx = (idx + 1) % N;
    }
    // soften the attack, fade the tail
    const att = Math.floor(this.sr * 0.002);
    for (let i = 0; i < att; i++) out[i] *= i / att;
    const tail = Math.floor(this.sr * 0.3);
    for (let i = 0; i < tail; i++) out[n - 1 - i] *= i / tail;
    let peak = 0;
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
    if (peak > 0) for (let i = 0; i < n; i++) out[i] /= peak;
    return b;
  }

  // A loop of field crickets: trains of ~4.4 kHz pulses, a few voices at different rates.
  makeCrickets(sec) {
    const n = Math.floor(this.sr * sec);
    const b = this.ctx.createBuffer(2, n, this.sr);
    const voices = [
      { f: 4400, rate: 1.6, ch: 0, amp: 0.25, ph: 0.1 }, { f: 4720, rate: 1.25, ch: 1, amp: 0.2, ph: 0.6 },
      { f: 4100, rate: 2.1, ch: 0, amp: 0.12, ph: 0.3 }, { f: 4950, rate: 0.9, ch: 1, amp: 0.1, ph: 0.8 },
    ];
    for (const v of voices) {
      const d = b.getChannelData(v.ch);
      for (let i = 0; i < n; i++) {
        const t = i / this.sr;
        // chirp: 3 pulses at 30 Hz in each period
        const cyc = ((t * v.rate + v.ph) % 1);
        const inChirp = cyc < 0.11 ? 1 : 0;
        const pulse = inChirp ? Math.max(0, Math.sin(Math.PI * ((cyc * 30 * 9) % 1))) : 0;
        d[i] += Math.sin(2 * Math.PI * v.f * t) * pulse * v.amp;
      }
    }
    return b;
  }

  // ------------------------------------------------------------ play helpers
  ok(key, gap) {
    const now = this.ctx.currentTime;
    const l = this.last.get(key) || 0;
    if (now - l < gap) return false;
    this.last.set(key, now);
    return true;
  }

  out(pan, bus = this.sfx, rev = 0) {
    const c = this.ctx;
    const g = c.createGain();
    let node = g;
    if (c.createStereoPanner) {
      const p = c.createStereoPanner(); p.pan.value = clamp(pan, -1, 1);
      g.connect(p); node = p;
    }
    node.connect(bus);
    if (rev > 0) { const s = c.createGain(); s.gain.value = rev; node.connect(s); s.connect(this.revIn); }
    return g;
  }

  panX(x) { return clamp((x - 500) / 450, -0.85, 0.85); }

  buf(buffer, { pan = 0, vol = 1, rate = 1, at = 0, rev = 0.25, bus } = {}) {
    if (!this.on) return null;
    const c = this.ctx;
    const s = c.createBufferSource();
    s.buffer = buffer;
    s.playbackRate.value = rate;
    const g = this.out(pan, bus, rev);
    g.gain.value = vol;
    s.connect(g);
    s.start(c.currentTime + at);
    return { s, g };
  }

  noiseHit({ pan = 0, vol = 0.4, f = 1200, q = 1, dur = 0.12, type = 'bandpass', f2 = null, at = 0, rev = 0.1 } = {}) {
    if (!this.on) return;
    const c = this.ctx, t = c.currentTime + at;
    const s = c.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    const flt = c.createBiquadFilter(); flt.type = type; flt.frequency.value = f; flt.Q.value = q;
    if (f2) flt.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = this.out(pan, this.sfx, rev);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(flt); flt.connect(g);
    s.start(t, Math.random() * 1.5);
    s.stop(t + dur + 0.05);
  }

  tone({ f = 440, type = 'sine', vol = 0.2, dur = 0.2, pan = 0, f2 = null, at = 0, rev = 0.2, attack = 0.005 } = {}) {
    if (!this.on) return;
    const c = this.ctx, t = c.currentTime + at;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = this.out(pan, this.sfx, rev);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); o.start(t); o.stop(t + dur + 0.05);
  }

  // FM bell (CCRMA-style ratio) for the moth hitting the lamp glass and for rewards
  bell(f, { vol = 0.12, dur = 0.6, pan = 0, at = 0, ratio = 1.4, index = 3 } = {}) {
    if (!this.on) return;
    const c = this.ctx, t = c.currentTime + at;
    const car = c.createOscillator(); car.frequency.value = f;
    const mod = c.createOscillator(); mod.frequency.value = f * ratio;
    const mg = c.createGain();
    mg.gain.setValueAtTime(f * index, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + dur * 0.4);
    mod.connect(mg); mg.connect(car.frequency);
    const g = this.out(pan, this.sfx, 0.35);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    car.connect(g); car.start(t); mod.start(t); car.stop(t + dur + 0.05); mod.stop(t + dur + 0.05);
  }

  // ------------------------------------------------------------ game sounds
  noteForLength(len) {
    // longer thread -> lower note; 16 notes over ~70..1100 px
    const k = clamp((Math.log(1100) - Math.log(Math.max(70, len))) / (Math.log(1100) - Math.log(70)), 0, 1);
    return Math.round(k * 13) + 1;
  }

  pluck(len, x, vol = 0.5, rate = 1) {
    if (!this.on || !this.ok('pluck' + Math.round(len / 40), 0.05)) return;
    const i = this.noteForLength(len);
    this.buf(this.plucks[i], { pan: this.panX(x), vol, rate, rev: 0.35 });
  }

  tick(x) { if (this.on && this.ok('tick', 0.08)) this.noiseHit({ pan: this.panX(x), vol: 0.06, f: 3200, q: 4, dur: 0.03 }); }
  go() { if (this.on && this.ok('go', 0.1)) this.noiseHit({ vol: 0.05, f: 900, f2: 2400, q: 3, dur: 0.09 }); }
  ui() { if (this.on) this.tone({ f: 660, type: 'triangle', vol: 0.06, dur: 0.08, rev: 0.1 }); }

  layStart() { if (this.on) this.noiseHit({ vol: 0.08, f: 1800, f2: 4200, q: 6, dur: 0.12 }); }
  layTick(laid) {
    if (!this.on) return;
    const now = this.ctx.currentTime;
    if (now - this.layGrainAt < 0.045) return;
    this.layGrainAt = now;
    const f = 2200 + (laid % 400) * 4;
    this.noiseHit({ vol: 0.035, f, q: 10, dur: 0.05, rev: 0.05 });
  }
  threadDone(len, x) {
    this.pluck(len, x, 0.55);
    if (this.on) this.noiseHit({ pan: this.panX(x), vol: 0.07, f: 600, q: 2, dur: 0.06 });
  }
  hit(len, x, heavy) {
    this.pluck(len, x, heavy ? 0.75 : 0.5, heavy ? 0.995 : 1);
    if (this.on) this.noiseHit({ pan: this.panX(x), vol: heavy ? 0.25 : 0.1, f: heavy ? 220 : 500, q: 1, dur: heavy ? 0.18 : 0.08, type: 'lowpass' });
  }
  struggle(x) { if (this.on && this.ok('str', 0.07)) this.noiseHit({ pan: this.panX(x), vol: 0.05, f: 1500 + Math.random() * 2500, q: 3, dur: 0.05 }); }
  escape(x) {
    if (!this.on) return;
    this.noiseHit({ pan: this.panX(x), vol: 0.18, f: 600, f2: 4000, q: 2, dur: 0.22 });
    this.tone({ f: 330, f2: 220, type: 'triangle', vol: 0.08, dur: 0.3, pan: this.panX(x) });
  }
  snap(len, x) {
    if (!this.on || !this.ok('snap', 0.06)) return;
    this.buf(this.plucks[this.noteForLength(len)], { pan: this.panX(x), vol: 0.5, rate: 1.06, rev: 0.3 });
    this.noiseHit({ pan: this.panX(x), vol: 0.22, f: 3000, f2: 500, q: 1.5, dur: 0.1 });
  }
  wrapTick(x) { if (this.on && this.ok('wrap', 0.09)) this.noiseHit({ pan: this.panX(x), vol: 0.07, f: 2600 + Math.random() * 1600, f2: 1200, q: 2, dur: 0.08 }); }
  eat(value, x) {
    if (!this.on) return;
    const p = this.panX(x);
    for (let i = 0; i < 3; i++) this.noiseHit({ pan: p, vol: 0.12, f: 900 - i * 150, q: 1.5, dur: 0.05, at: i * 0.06, type: 'lowpass' });
    // reward arpeggio climbing the scale; more notes for richer prey
    const n = value >= 20 ? 5 : value >= 10 ? 4 : value >= 6 ? 3 : 2;
    const base = 8;
    for (let i = 0; i < n; i++) this.buf(this.plucks[Math.min(15, base + i * 2)], { pan: p, vol: 0.28, at: 0.12 + i * 0.075, rev: 0.45 });
  }
  lamp(x) { if (this.on && this.ok('lamp', 0.12)) this.bell(1760 + Math.random() * 300, { vol: 0.05, dur: 0.35, pan: this.panX(x), ratio: 3.5, index: 1.5 }); }
  sting() {
    if (!this.on) return;
    this.tone({ f: 180, f2: 90, type: 'sawtooth', vol: 0.18, dur: 0.35, rev: 0.1 });
    this.noiseHit({ vol: 0.25, f: 2500, q: 0.8, dur: 0.15 });
  }
  hide() { if (this.on) this.noiseHit({ vol: 0.08, f: 500, f2: 200, q: 1, dur: 0.2, type: 'lowpass' }); }
  hintChime() { if (this.on) this.bell(1174.7, { vol: 0.05, dur: 0.9, ratio: 2, index: 1.2 }); }
  stuckAlarm() { if (this.on && this.ok('alarm', 0.4)) this.tone({ f: 1318.5, type: 'sine', vol: 0.05, dur: 0.12, rev: 0.3 }); }
  dawnBirds() {
    if (!this.on) return;
    for (let i = 0; i < 9; i++) {
      const at = 0.3 + i * 0.32 + Math.random() * 0.2;
      const f = 2400 + Math.random() * 1600;
      this.tone({ f, f2: f * (Math.random() < 0.5 ? 1.5 : 0.7), type: 'sine', vol: 0.09, dur: 0.12, at, pan: Math.random() * 1.4 - 0.7, rev: 0.4 });
    }
  }
  thunk() { if (this.on) this.tone({ f: 120, f2: 60, type: 'sine', vol: 0.22, dur: 0.25, rev: 0.2 }); }

  // ------------------------------------------------------------ beds
  startAmbience() {
    const c = this.ctx;
    const s = c.createBufferSource(); s.buffer = this.crickets; s.loop = true;
    const g = c.createGain(); g.gain.value = 0.12;
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
    s.connect(hp); hp.connect(g); g.connect(this.amb);
    s.start();
    this.cricketGain = g;
    // night air / wind: looped noise through a lowpass whose cutoff and level follow the wind
    const w = c.createBufferSource(); w.buffer = this.noise; w.loop = true;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400; lp.Q.value = 0.7;
    const wg = c.createGain(); wg.gain.value = 0.05;
    w.connect(lp); lp.connect(wg); wg.connect(this.amb);
    w.start();
    this.windLP = lp; this.windGain = wg;
    // rain bed
    const r = c.createBufferSource(); r.buffer = this.noise; r.loop = true;
    const rh = c.createBiquadFilter(); rh.type = 'bandpass'; rh.frequency.value = 5000; rh.Q.value = 0.4;
    const rg = c.createGain(); rg.gain.value = 0;
    r.connect(rh); rh.connect(rg); rg.connect(this.amb);
    r.start();
    this.rainGain = rg;
  }

  setWind(k) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.windLP.frequency.setTargetAtTime(350 + k * 1400, t, 0.2);
    this.windGain.gain.setTargetAtTime(0.04 + k * 0.32, t, 0.2);
  }
  setRain(k) { if (this.ctx) this.rainGain.gain.setTargetAtTime(k * 0.16, this.ctx.currentTime, 0.4); }
  setNight(k) { if (this.ctx) this.cricketGain.gain.setTargetAtTime(0.12 * k, this.ctx.currentTime, 1); }
  rainDrop(x) { if (this.on && this.ok('drop', 0.03)) this.tone({ f: 2400 + Math.random() * 2400, type: 'sine', vol: 0.025, dur: 0.05, pan: this.panX(x), rev: 0.3 }); }

  // Slow pad: D – Bm – G – A colours, voices glide; intensity adds a high shimmer voice.
  startPad() {
    const c = this.ctx;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.3;
    lp.connect(this.music);
    this.padLP = lp;
    this.padVoices = [];
    for (let i = 0; i < 4; i++) {
      const o = c.createOscillator(); o.type = i === 3 ? 'sine' : 'triangle';
      const g = c.createGain(); g.gain.value = 0;
      const vib = c.createOscillator(); vib.frequency.value = 0.15 + i * 0.07;
      const vg = c.createGain(); vg.gain.value = 1.5;
      vib.connect(vg); vg.connect(o.detune);
      o.connect(g); g.connect(lp);
      o.start(); vib.start();
      this.padVoices.push({ o, g });
    }
    this.chords = [
      [146.83, 220.0, 277.18, 369.99], // Dmaj7 (D A C# F#)
      [123.47, 185.0, 220.0, 293.66],  // Bm7
      [98.0, 146.83, 246.94, 293.66],  // Gmaj7-ish
      [110.0, 164.81, 220.0, 329.63],  // A
    ];
    this.chordI = 0;
    this.padStep = 0;
    this.nextChordAt = c.currentTime + 0.1;
    this.intensity = 0.3;
    this.padTimer = setInterval(() => this.padTick(), 120);
  }

  padTick() {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime;
    if (t + 0.2 < this.nextChordAt) return;
    const at = Math.max(t, this.nextChordAt);
    const ch = this.chords[this.chordI % this.chords.length];
    this.padVoices.forEach((v, i) => {
      v.o.frequency.setTargetAtTime(ch[i] * (i === 3 ? 2 : 1), at, 0.6);
      const lvl = i === 3 ? 0.05 * this.intensity : 0.09;
      v.g.gain.cancelScheduledValues(at);
      v.g.gain.setTargetAtTime(lvl, at, 1.2);
    });
    // sparse music-box notes on a 0.5 s grid, more of them as the night intensifies
    const notes = Math.round(1 + this.intensity * 3);
    for (let k = 0; k < notes; k++) {
      if (Math.random() < 0.55) {
        const slot = Math.floor(Math.random() * 16) * 0.5;
        this.buf(this.plucks[8 + Math.floor(Math.random() * 7)], { vol: 0.07 + 0.05 * this.intensity, at: at - t + slot, bus: this.music, rev: 0.6, pan: Math.random() * 1.2 - 0.6 });
      }
    }
    this.chordI++;
    this.nextChordAt = at + 8;
  }

  setIntensity(k) {
    this.intensity = clamp(k, 0, 1);
    if (this.padLP) this.padLP.frequency.setTargetAtTime(700 + this.intensity * 1100, this.ctx.currentTime, 2);
  }

  duck() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.music.gain.cancelScheduledValues(t);
    this.music.gain.setTargetAtTime(0.16, t, 0.03);
    this.music.gain.setTargetAtTime(0.32, t + 0.25, 0.3);
  }

  // Insect buzz voices: one per loud kind, level follows the nearest flying individual.
  startBuzz() {
    const c = this.ctx;
    const mk = (f, type, lpF, q) => {
      const o = c.createOscillator(); o.type = type; o.frequency.value = f;
      const lfo = c.createOscillator(); lfo.frequency.value = 9 + Math.random() * 6;
      const lg = c.createGain(); lg.gain.value = f * 0.03;
      lfo.connect(lg); lg.connect(o.frequency);
      const lp = c.createBiquadFilter(); lp.type = 'bandpass'; lp.frequency.value = lpF; lp.Q.value = q;
      const g = c.createGain(); g.gain.value = 0;
      const p = c.createStereoPanner ? c.createStereoPanner() : null;
      o.connect(lp); lp.connect(g);
      if (p) { g.connect(p); p.connect(this.sfx); } else g.connect(this.sfx);
      o.start(); lfo.start();
      return { o, g, p, base: f };
    };
    this.buzz = {
      fly: mk(196, 'sawtooth', 900, 1.2),
      wasp: mk(247, 'sawtooth', 1300, 2),
      beetle: mk(92, 'sawtooth', 420, 1.5),
    };
  }

  setBuzz(kind, level, x) {
    const v = this.buzz && this.buzz[kind];
    if (!v) return;
    const t = this.ctx.currentTime;
    v.g.gain.setTargetAtTime(this.on ? level : 0, t, 0.08);
    if (v.p) v.p.pan.setTargetAtTime(this.panX(x), t, 0.08);
  }
}
