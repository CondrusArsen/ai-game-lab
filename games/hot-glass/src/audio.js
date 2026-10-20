// Sound of the hot shop, synthesized with Web Audio (no samples):
// furnace roar (filtered noise), breath (formant-filtered noise), the pipe rolling on the bench rails
// (wooden knocks paced by the spin), glass pings and shatter (inharmonic FM partials), and a soft mallet
// tune in a major pentatonic. Finished pieces ring with a note that depends on their size.

const PENTA = [0, 2, 4, 7, 9];
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// master level: phone speakers need it; the compressor (threshold -16 dB) keeps the peaks in check
const VOL = 1.6;

export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = false;
    try { this.muted = localStorage.getItem('glass.muted') === '1'; } catch (e) { /* storage blocked */ }
    this.platformMuted = false;
    this.lastKnock = 0;
    this.knockPhase = 0;
  }

  get on() { return !!this.ctx && !this.muted && !this.platformMuted; }

  // must be called from a user gesture (pointerup / click)
  unlock() {
    if (this.ctx) { this.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = new AC({ latencyHint: 'interactive' });
    this.ctx = c;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 8; comp.attack.value = 0.003; comp.release.value = 0.2;
    comp.connect(c.destination);
    this.master = c.createGain(); this.master.gain.value = this.muted ? 0 : VOL; this.master.connect(comp);
    this.sfx = c.createGain(); this.sfx.gain.value = 1; this.sfx.connect(this.master);
    this.music = c.createGain(); this.music.gain.value = 0.22; this.music.connect(this.master);
    // small room
    this.verb = c.createConvolver(); this.verb.buffer = this.ir(1.4);
    this.verbIn = c.createGain(); this.verbIn.gain.value = 0.25;
    this.verbIn.connect(this.verb); this.verb.connect(this.master);
    this.music.connect(this.verbIn);
    this.noise = this.makeNoise(2);
    this.startBeds();
    this.startMusic();
    this.resume();
  }
  resume() { const c = this.ctx; if (c && (c.state === 'suspended' || c.state === 'interrupted')) c.resume().catch(() => {}); }
  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); }
  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem('glass.muted', m ? '1' : '0'); } catch (e) { /* ignore */ }
    this.applyGain();
  }
  setPlatformMuted(m) { this.platformMuted = m; this.applyGain(); }
  applyGain() { if (this.ctx) this.master.gain.setTargetAtTime(this.muted || this.platformMuted ? 0 : VOL, this.ctx.currentTime, 0.05); }

  makeNoise(sec) {
    const c = this.ctx, b = c.createBuffer(1, Math.floor(c.sampleRate * sec), c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  ir(sec) {
    const c = this.ctx, n = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let lp = 0;
      for (let i = 0; i < n; i++) { lp += 0.4 * ((Math.random() * 2 - 1) - lp); d[i] = lp * Math.exp(-7 * i / n); }
    }
    return b;
  }

  loopNoise(type, f, q, gain, dest = this.sfx) {
    const c = this.ctx;
    const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const flt = c.createBiquadFilter(); flt.type = type; flt.frequency.value = f; flt.Q.value = q;
    const g = c.createGain(); g.gain.value = gain;
    s.connect(flt); flt.connect(g); g.connect(dest);
    s.start(0, Math.random());
    return { s, flt, g };
  }

  startBeds() {
    // furnace: deep roar + a brighter flutter that rises when the piece is inside
    this.roar = this.loopNoise('lowpass', 320, 0.6, 0.06);
    this.flutter = this.loopNoise('bandpass', 900, 0.7, 0.0);
    const lfo = this.ctx.createOscillator(); lfo.frequency.value = 7.5;
    const lg = this.ctx.createGain(); lg.gain.value = 0.015;
    lfo.connect(lg); lg.connect(this.flutter.g.gain); lfo.start();
    // breath: noise through a vowel-ish formant pair
    this.breath = this.loopNoise('bandpass', 700, 1.4, 0);
    this.breath2 = this.loopNoise('bandpass', 1500, 2.5, 0);
    // sizzle when tools meet hot glass
    this.sizzle = this.loopNoise('highpass', 4200, 0.7, 0);
  }

  set(param, v, tau = 0.06) { if (this.ctx) param.setTargetAtTime(v, this.ctx.currentTime, tau); }

  // continuous state each frame
  frame({ heating, blowing, bubble, squeezing, spin, hot }) {
    if (!this.ctx) return;
    this.set(this.roar.g.gain, heating ? 0.2 : 0.06, 0.2);
    this.set(this.roar.flt.frequency, heating ? 700 : 320, 0.3);
    this.set(this.flutter.g.gain, heating ? 0.05 : 0.0, 0.2);
    this.set(this.breath.g.gain, blowing ? 0.16 : 0, 0.05);
    this.set(this.breath2.g.gain, blowing ? 0.05 : 0, 0.05);
    // the bubble grows: the breath's formant drops (a bigger cavity)
    this.set(this.breath.flt.frequency, 760 - Math.min(400, bubble * 3), 0.2);
    this.set(this.sizzle.g.gain, squeezing ? 0.05 + 0.08 * hot : 0, 0.04);
    // pipe rolling on the rails: one soft knock per half turn
    this.knockPhase += Math.abs(spin) * 2 * (1 / 60);
    if (this.knockPhase >= 1) { this.knockPhase -= 1; this.knock(Math.min(1, Math.abs(spin) / 2)); }
  }

  env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  knock(k) {
    if (!this.on) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(190 + 40 * k, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.06);
    const g = c.createGain(); this.env(g, t, 0.002, 0.05 + 0.06 * k, 0.08);
    o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + 0.12);
  }

  // inharmonic FM partials: a glass ping
  ping(freq, { vol = 0.12, dur = 1.2, at = 0, pan = 0 } = {}) {
    if (!this.on) return;
    const c = this.ctx, t = c.currentTime + at;
    const out = c.createGain(); this.env(out, t, 0.003, vol, dur);
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    if (p) { p.pan.value = pan; out.connect(p); p.connect(this.sfx); p.connect(this.verbIn); } else { out.connect(this.sfx); }
    for (const [ratio, amp] of [[1, 1], [2.76, 0.4], [5.4, 0.18]]) {
      const o = c.createOscillator(); o.frequency.value = freq * ratio;
      const g = c.createGain(); g.gain.value = amp;
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
    }
  }

  noiseHit({ f = 2000, q = 1, vol = 0.2, dur = 0.15, type = 'bandpass', f2 = null, at = 0 } = {}) {
    if (!this.on) return;
    const c = this.ctx, t = c.currentTime + at;
    const s = c.createBufferSource(); s.buffer = this.noise;
    const flt = c.createBiquadFilter(); flt.type = type; flt.frequency.value = f; flt.Q.value = q;
    if (f2) flt.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = c.createGain(); this.env(g, t, 0.003, vol, dur);
    s.connect(flt); flt.connect(g); g.connect(this.sfx);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }

  ui() { this.ping(1568, { vol: 0.04, dur: 0.25 }); }
  heatIn() { this.noiseHit({ f: 400, f2: 1400, q: 0.8, vol: 0.12, dur: 0.4, type: 'lowpass' }); }
  stress() { this.ping(2600 + Math.random() * 1400, { vol: 0.035, dur: 0.4, pan: Math.random() - 0.5 }); }
  crack() {
    this.noiseHit({ f: 3500, q: 0.6, vol: 0.3, dur: 0.08 });
    this.ping(1900, { vol: 0.08, dur: 0.5 });
  }
  burst() {
    if (!this.on) return;
    this.noiseHit({ f: 300, q: 0.5, vol: 0.4, dur: 0.25, type: 'lowpass' });
    this.noiseHit({ f: 5000, q: 0.4, vol: 0.25, dur: 0.35, type: 'highpass' });
    for (let i = 0; i < 14; i++) this.ping(1800 + Math.random() * 3600, { vol: 0.05, dur: 0.3 + Math.random() * 0.5, at: 0.02 + Math.random() * 0.5, pan: Math.random() * 1.6 - 0.8 });
  }
  // a finished piece rings: bigger pieces sing lower
  ring(size, stars) {
    const notes = [84, 81, 79, 76, 74, 72, 69, 67, 64, 62, 60];   // C major pentatonic, high → low
    const note = notes[Math.min(notes.length - 1, Math.round(size / 16))];
    this.ping(midi(note), { vol: 0.16, dur: 2.4 });
    for (let i = 0; i < stars; i++) this.ping(midi(note + 12 + PENTA[(i * 2) % 5]), { vol: 0.07, dur: 1.2, at: 0.35 + i * 0.16 });
  }
  shatterSmall() { for (let i = 0; i < 5; i++) this.ping(2400 + Math.random() * 2000, { vol: 0.04, dur: 0.3, at: Math.random() * 0.2 }); }

  // a calm mallet tune: sparse notes on a 0.5 s grid, a new chord colour every 4 s
  startMusic() {
    const c = this.ctx;
    const roots = [60, 57, 53, 55];
    let bar = 0;
    this.nextAt = c.currentTime + 0.5;
    this.musicTimer = setInterval(() => {
      if (!this.ctx || c.currentTime + 0.2 < this.nextAt) return;
      const at = Math.max(c.currentTime, this.nextAt);
      const root = roots[bar % roots.length];
      for (let i = 0; i < 8; i++) {
        if (Math.random() < (i === 0 ? 1 : 0.3)) {
          const m = root + 12 + PENTA[Math.floor(Math.random() * 5)] + (Math.random() < 0.3 ? 12 : 0);
          this.mallet(midi(i === 0 ? root : m), at + i * 0.5, i === 0 ? 0.08 : 0.05);
        }
      }
      bar++;
      this.nextAt = at + 4;
    }, 150);
  }
  mallet(f, at, vol) {
    if (!this.ctx) return;
    const c = this.ctx;
    const out = c.createGain(); this.env(out, at, 0.004, vol, 1.6);
    out.connect(this.music);
    for (const [r, a] of [[1, 1], [4, 0.25], [10, 0.05]]) {
      const o = c.createOscillator(); o.frequency.value = f * r;
      const g = c.createGain(); g.gain.value = a;
      o.connect(g); g.connect(out); o.start(at); o.stop(at + 1.7);
    }
  }
}
