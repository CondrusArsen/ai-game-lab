// Rules of one night: input -> spider orders, insects, weather, scoring, hints, dawn.

import { Web, SEG } from './web.js';
import { makeLayout, nearestSurface, insideSolid } from './scene.js';
import { Spider } from './spider.js';
import { Bug, KINDS, fireflyGlow } from './bugs.js';
import { FX } from './fx.js';
import { clamp, lerp, dist, TAU, rng, segT, smooth, invLerp } from './util.js';

// short haptic tick on phones; only after the player has touched the page (browsers block it before)
function haptic(ms) {
  try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(ms); } catch (e) { /* ignore */ }
}

export const NIGHT = 200;          // seconds from dusk to dawn
const SILK_PER_PX = 1 / 26;        // silk cost of a thread per pixel
const MIN_THREAD = 46;
const BELLY_PER_CAL = 0.45;         // how much of each catch fills the belly (the rest is just score)

// Night director: what flies when. rates are per second.
const PHASES = [
  // esc: how fast stuck prey works itself free (1 = full speed); early night is forgiving
  { until: 45, name: 'Сумерки', rates: { moth: 0.13, fly: 0.0 }, gnats: 12, cap: 7, intensity: 0.2, esc: 0.55 },
  { until: 95, name: 'Ночь', rates: { moth: 0.17, fly: 0.09 }, gnats: 14, cap: 9, intensity: 0.4, esc: 0.75 },
  { until: 135, name: 'Светлячки', rates: { moth: 0.14, fly: 0.07, firefly: 0.13 }, gnats: 16, cap: 10, intensity: 0.55, esc: 0.9 },
  { until: 165, name: 'Ветер и дождь', rates: { moth: 0.08, fly: 0.05, firefly: 0.05 }, gnats: 0, cap: 8, intensity: 0.6, esc: 1 },
  { until: NIGHT, name: 'Предрассветный рой', rates: { moth: 0.36, fly: 0.12, firefly: 0.04 }, gnats: 9, cap: 14, intensity: 1, esc: 1 },
];
// one-off events
const EVENTS = [
  { t: 78, type: 'gust', dur: 5, k: 1 },
  { t: 106, type: 'bug', kind: 'beetle' },
  { t: 126, type: 'bug', kind: 'beetle' },
  { t: 137, type: 'bug', kind: 'wasp' },
  { t: 140, type: 'rain', dur: 20 },
  { t: 150, type: 'gust', dur: 4, k: 1.25 },
  { t: 172, type: 'bug', kind: 'beetle' },
  { t: 183, type: 'bug', kind: 'wasp' },
  { t: 188, type: 'gust', dur: 3, k: 0.8 },
];

const HINTS = {
  build: 'Проведи <b>от опоры к опоре</b> — паучиха протянет нить',
  more: 'Ещё нити! Насекомые липнут там, где <b>нитей больше</b>',
  tap: 'Добыча влипла! <b>Коснись её</b>, пока не вырвалась',
  belly: 'Наешься до рассвета: заполни <b>сытость</b>',
  silk: 'Шёлк кончился — он <b>восстанавливается</b> сам и от еды',
  beetle: 'Жук! Он пробивает сеть, где <b>меньше трёх нитей</b>',
  wasp: 'Оса охотится на паучиху — коснись <b>сухого листа</b>, чтобы спрятаться',
  wind: 'Ветер! Перетянутые нити <b>краснеют и рвутся</b>',
  rain: 'Дождь утяжеляет нити каплями',
};

export class Game {
  constructor(renderer, audio, hud, platform) {
    this.R = renderer;
    this.audio = audio;
    this.hud = hud;
    this.platform = platform;
    this.state = 'title';
    this.seed = 1 + Math.floor(Math.random() * 100000);
    this.best = 0;
    try { this.best = Number(localStorage.getItem('silk.best') || 0); } catch (e) { /* ignore */ }
    try { this.seenHints = new Set(JSON.parse(localStorage.getItem('silk.hints') || '[]')); } catch (e) { this.seenHints = new Set(); }
    this.setup(this.seed, true);
    this.bindInput();
  }

  // ------------------------------------------------------------ setup
  setup(seed, attract = false) {
    this.seed = seed;
    this.r = rng(seed * 31 + 7);
    this.layout = makeLayout(seed);
    this.R.resize(this.layout);
    this.bounds = this.R.bounds();
    this.web = new Web();
    this.web.onBreak = (l, cause) => this.onBreak(l, cause);
    this.web.onSplit = (old, l1, l2, t) => this.onSplit(old, l1, l2, t);
    this.buildSurfaceGraph();
    this.spider = new Spider(this);
    this.bugs = [];
    this.cocoons = [];
    this.fx = new FX();
    this.nextStrandId = 1;
    this.time = 0;
    this.nightT = 0;
    this.belly = 30;
    this.silk = 100;
    this.score = 0;
    this.dawnMix = 0;
    this.lampFlicker = 1;
    this.phaseI = 0;
    this.events = EVENTS.map((e) => ({ ...e, done: false }));
    this.spawnAcc = {};
    this.gnatT = 4;
    this.gusts = [];
    this.rainT = 0;
    this.started = false;
    this.bugsOn = false;
    this.escapeK = 1;
    this.hitstop = 0;
    this.drag = null;
    this.stats = { caught: {}, escaped: 0, threads: 0, silkLen: 0, longest: 0, snapped: 0, stung: 0 };
    this.hintNow = null;
    this.hintQueue = [];
    this.firstCatchDone = false;
    this.hubCache = null;
    this.ended = false;
    this.attract = attract;
    // the spider starts on a dragline from the beam
    const top = this.web.addParticle(470, 196, true, 'anchor');
    this.linkToSurface(top, this.layout.surfaces[0]);
    this.spider.dragline = { top, len: 0, target: attract ? 420 : 360 };
    this.spider.x = top.x; this.spider.y = top.y + 18;
    if (attract) this.buildAttractWeb();
  }

  buildSurfaceGraph() {
    const web = this.web;
    const inField = (x, y) => x > -40 && x < 1000 && y > 150 && y < 1460;
    this.surfaceNodes = [];
    for (const s of this.layout.surfaces) {
      s.nodes = [];
      let prev = null;
      for (let i = 0; i < s.pts.length - 1; i++) {
        const [ax, ay] = s.pts[i], [bx, by] = s.pts[i + 1];
        const L = Math.hypot(bx - ax, by - ay);
        const n = Math.max(1, Math.round(L / 28));
        for (let k = 0; k < n; k++) {
          const t = k / n;
          const x = lerp(ax, bx, t), y = lerp(ay, by, t);
          if (!inField(x, y)) { prev = null; continue; }
          const p = web.addParticle(x, y, true, 'surface');
          p.surface = s;
          s.nodes.push(p);
          this.surfaceNodes.push(p);
          if (prev) web.addLink(prev, p, false);
          prev = p;
        }
      }
    }
    // corners where surfaces meet
    for (const a of this.surfaceNodes) for (const b of this.surfaceNodes) {
      if (a.id < b.id && a.surface !== b.surface && dist(a.x, a.y, b.x, b.y) < 34) web.addLink(a, b, false);
    }
    // the retreat leaf hangs under the beam
    const R = this.layout.retreat;
    this.retreatNode = web.addParticle(R.x, R.y + 4, true, 'surface');
    this.linkToSurface(this.retreatNode, this.layout.surfaces[0]);
  }

  linkToSurface(p, s) {
    let best = null, bd = 1e9, second = null, sd = 1e9;
    for (const n of s.nodes) {
      const d = dist(n.x, n.y, p.x, p.y);
      if (d < bd) { second = best; sd = bd; best = n; bd = d; }
      else if (d < sd) { second = n; sd = d; }
    }
    if (best) this.web.addLink(p, best, false);
    if (second && sd < 60) this.web.addLink(p, second, false);
  }

  // A pretty pre-built web for the title screen backdrop.
  buildAttractWeb() {
    const web = this.web;
    const hub = web.addParticle(500, 690);
    const ends = [];
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * TAU + 0.3;
      let x = hub.x, y = hub.y;
      for (let k = 0; k < 140; k++) {
        x += Math.cos(a) * 9; y += Math.sin(a) * 9;
        const ns = nearestSurface(this.layout, x, y);
        if (ns.d < 10) { x = ns.x; y = ns.y; break; }
      }
      const e = web.addParticle(x, y, true, 'anchor');
      ends.push(web.chain(hub, e, 0.99, { id: this.nextStrandId++, len: dist(hub.x, hub.y, x, y), strong: true }));
    }
    for (let ring = 2; ring < 12; ring += 1.3) {
      for (let i = 0; i < ends.length; i++) {
        const A = ends[i], B = ends[(i + 1) % ends.length];
        const ia = Math.round(ring), ib = Math.round(ring + 0.6);
        if (ia >= A.length - 1 || ib >= B.length - 1) continue;
        web.chain(A[ia].b, B[ib].b, 0.995, { id: this.nextStrandId++, len: 120 });
      }
    }
  }

  // ------------------------------------------------------------ flow
  start() {
    const seed = 1 + Math.floor(Math.random() * 100000);
    this.setup(seed, false);
    this.state = 'play';
    this.started = true;
    this.hud.show(true);
    this.audio.setNight(1);
    this.platform.gameplayStart();
  }

  pause(on) {
    if (this.state === 'play' && on) { this.state = 'paused'; this.hud.pause(true); this.platform.gameplayStop(); }
    else if (this.state === 'paused' && !on) { this.state = 'play'; this.hud.pause(false); this.platform.gameplayStart(); }
  }

  // ------------------------------------------------------------ update
  update(dt) {
    if (this.state === 'paused') return;
    if (this.hitstop > 0) { this.hitstop -= dt; dt *= 0.08; }
    this.time += dt;
    const playing = this.state === 'play';
    if (playing && this.spider.mode !== 'descend') this.nightT += dt;

    // lamp breathes, dawn creeps in at the end
    this.lampFlicker = 0.95 + 0.05 * Math.sin(this.time * 13) * Math.sin(this.time * 3.7);
    const dawnStart = NIGHT - 14;
    this.dawnMix = this.state === 'dawn' || this.state === 'result' ? Math.min(1, this.dawnMix + dt * 0.35) : playing ? smooth(invLerp(dawnStart, NIGHT + 4, this.nightT)) * 0.55 : 0;
    if (this.state === 'title') this.dawnMix = 0;

    if (playing) this.director(dt);
    else if (this.state === 'title') {
      // backdrop life behind the title: a few moths visit the lamp
      this.titleT = (this.titleT ?? 1.5) - dt;
      if (this.titleT <= 0) { this.titleT = 2.5 + this.r() * 2; if (this.bugs.length < 5) this.spawn(this.r() < 0.8 ? 'moth' : 'fly'); }
    }
    this.updateWeather(dt);

    // economy
    if (playing) {
      // a starving spider is slow and spins little
      this.spider.speedK = this.belly <= 0 ? 0.65 : 1;
      if (this.belly <= 0 && !this.starveHinted) { this.starveHinted = true; this.toast('Паучиха слабеет от голода'); }
      if (this.belly > 5) this.starveHinted = false;
      this.silk = Math.min(100, this.silk + dt * (this.belly <= 0 ? 0.2 : 0.5));
      this.belly = Math.max(0, this.belly - dt * 0.2);
    }

    this.web.step(dt, (x, y) => this.windAt(x, y, true));
    this.spider.update(dt);
    for (const b of this.bugs) b.update(dt);
    this.bugs = this.bugs.filter((b) => !b.dead);
    this.fx.update(dt, (x, y) => this.windAt(x, y));
    this.updateBuzz();
    if (Math.floor(this.time * 2) !== Math.floor((this.time - dt) * 2)) this.web.compact();
    this.retractLoose(dt);
    this.tightenT = (this.tightenT || 0) - dt;
    if (this.tightenT <= 0) {
      this.tightenT = 0.2;
      const sp = this.spider;
      this.web.tighten(0.2, new Set([sp.at?.a, sp.at?.b, sp.order?.last, sp.order?.startP].filter(Boolean)));
    }

    if (playing) {
      this.hud.update(this);
      this.stuckAlarm(dt);
      if (this.nightT >= NIGHT) this.toDawn();
    }
    if (this.state === 'dawn') {
      this.dawnT += dt;
      // dew condenses on every thread
      for (const p of this.web.P) if (p.alive && p.kind === 'silk') p.dew = Math.min(1, p.dew + dt * (0.15 + (p.id % 7) * 0.04));
      if (this.dawnT > 5.5 && !this.ended) this.finish();
    }
  }

  director(dt) {
    if (!this.bugsOn) {
      if (this.stats.threads > 0 || this.nightT > 14) { this.bugsOn = true; this.spawnFirstMoth(); }
      return;
    }
    const t = this.nightT;
    while (this.phaseI < PHASES.length - 1 && t >= PHASES[this.phaseI].until) {
      this.phaseI++;
      this.toast(PHASES[this.phaseI].name);
    }
    const ph = PHASES[this.phaseI];
    this.audio.setIntensity(ph.intensity);
    const flying = this.bugs.filter((b) => !b.stuck).length;
    for (const [kind, rate] of Object.entries(ph.rates)) {
      this.spawnAcc[kind] = (this.spawnAcc[kind] || 0) + rate * dt;
      if (this.spawnAcc[kind] >= 1) {
        this.spawnAcc[kind] -= 1;
        if (flying < ph.cap) this.spawn(kind);
      }
    }
    if (ph.gnats) {
      this.gnatT -= dt;
      if (this.gnatT <= 0) { this.gnatT = ph.gnats * (0.7 + this.r() * 0.6); this.spawnSwarm(); }
    }
    for (const e of this.events) {
      if (e.done || t < e.t) continue;
      e.done = true;
      if (e.type === 'bug') this.spawn(e.kind);
      if (e.type === 'gust') this.gust(e.dur, e.k);
      if (e.type === 'rain') { this.rainT = e.dur; this.hint('rain'); }
    }
  }

  // ------------------------------------------------------------ spawning
  // Where an insect enters. The porch post closes the left side, so insects fly in over the right
  // edge or emerge from the dark garden behind the web (fading in, not yet in the web plane).
  entry(kind) {
    const b = this.bounds, r = this.r;
    if (kind === 'firefly') return { x: lerp(150, 860, r()), y: lerp(1150, 1360, r()), depth: true };
    if (kind === 'wasp' || r() < 0.5) return { x: b.x1 + 50, y: lerp(260, 1340, r()), depth: false };
    // depth: somewhere in the field, but not on top of the spider
    for (let i = 0; i < 8; i++) {
      const p = { x: lerp(130, 880, r()), y: lerp(260, 1350, r()), depth: true };
      if (dist(p.x, p.y, this.spider.x, this.spider.y) > 220) return p;
    }
    return { x: b.x1 + 50, y: lerp(260, 1340, r()), depth: false };
  }

  webCenter() {
    let sx = 0, sy = 0, n = 0;
    for (const l of this.web.L) if (l.alive && l.phys) { sx += l.a.x; sy += l.a.y; n++; }
    return n ? { x: sx / n, y: sy / n } : { x: 500, y: 800 };
  }

  spawn(kind) {
    const p = this.entry(kind);
    const opts = { fromDepth: p.depth };
    if (kind === 'beetle') {
      const c = this.webCenter();
      opts.goal = { x: c.x + (this.r() - 0.5) * 200, y: c.y + (this.r() - 0.5) * 200 };
      // beetles come in over the edge, aimed through the web
      p.x = this.bounds.x1 + 50; p.y = lerp(300, 1300, this.r()); opts.fromDepth = false;
      opts.angle = Math.atan2(opts.goal.y - p.y, opts.goal.x - p.x);
      this.hint('beetle');
    }
    if (kind === 'firefly') opts.goal = { x: lerp(200, 850, this.r()), y: lerp(800, 1250, this.r()) };
    if (kind === 'wasp') { opts.goal = { x: 600, y: 600 }; opts.life = 26; this.hint('wasp'); this.toast('Оса!'); }
    if (kind === 'moth') { const L = this.layout.lamp; opts.angle = Math.atan2(L.y - p.y, L.x - p.x); }
    const b = new Bug(this, kind, p.x, p.y, opts);
    this.bugs.push(b);
    return b;
  }

  spawnFirstMoth() {
    // a gentle first visitor: emerges on the far side of the player's threads and flies through them to the lamp
    const c = this.webCenter();
    const L = this.layout.lamp;
    const ang = Math.atan2(L.y - c.y, L.x - c.x);
    const x = clamp(c.x - Math.cos(ang) * 260, 130, 860), y = clamp(c.y - Math.sin(ang) * 260, 260, 1340);
    const b = new Bug(this, 'moth', x, y, { angle: ang, fromDepth: true });
    b.vx *= 0.6; b.vy *= 0.6;
    this.bugs.push(b);
  }

  spawnSwarm() {
    const b = this.bounds;
    const fromRight = this.r() < 0.5;
    const sw = fromRight
      ? { x: b.x1 + 80, y: lerp(450, 1250, this.r()), vx: -lerp(40, 65, this.r()), vy: lerp(-10, 10, this.r()) }
      : { x: lerp(200, 700, this.r()), y: lerp(500, 1250, this.r()), vx: lerp(30, 55, this.r()), vy: lerp(-12, 12, this.r()) };
    this.swarms = this.swarms || [];
    this.swarms.push(sw);
    const n = 5 + Math.floor(this.r() * 4);
    for (let i = 0; i < n; i++) {
      const g = new Bug(this, 'gnat', sw.x + (this.r() - 0.5) * 60, sw.y + (this.r() - 0.5) * 60, { swarm: sw, life: 34, fromDepth: !fromRight });
      this.bugs.push(g);
    }
  }

  // ------------------------------------------------------------ weather
  gust(dur, k) {
    const dir = this.r() < 0.5 ? -1 : 1;
    this.gusts.push({ t: 0, dur, k, dir });
    this.hint('wind');
    this.toast('Порыв ветра');
  }

  // returns a shared object (called for every silk particle every frame: no allocation)
  windAt(x, y, forSilk = false) {
    const out = this._wind || (this._wind = { x: 0, y: 0 });
    let wx = 6 * Math.sin(this.time * 0.37 + y * 0.004) + 3 * Math.sin(this.time * 1.1 + x * 0.01);
    let wy = 0;
    for (const g of this.gusts) {
      const e = Math.sin(Math.PI * clamp(g.t / g.dur, 0, 1));
      const ripple = 0.7 + 0.3 * Math.sin(this.time * 4 + x * 0.008 + y * 0.004);
      wx += g.dir * g.k * e * ripple * (forSilk ? 170 : 160);
      wy += g.k * e * Math.sin(this.time * 3 + x * 0.01) * (forSilk ? 40 : 30);
    }
    out.x = wx; out.y = wy;
    return out;
  }

  updateWeather(dt) {
    let windK = 0;
    for (const g of this.gusts) {
      g.t += dt;
      const e = Math.sin(Math.PI * clamp(g.t / g.dur, 0, 1));
      windK = Math.max(windK, e * g.k);
      // leaves and dust ride the gust
      if (this.r() < dt * 22 * e) {
        const b = this.bounds;
        const x = g.dir > 0 ? b.x0 - 20 : b.x1 + 20;
        this.fx.add({ x, y: lerp(250, 1400, this.r()), vx: g.dir * 300, vy: lerp(-40, 40, this.r()), life: 4, age: 0, size: 6 + this.r() * 6, col: [90 + this.r() * 60 | 0, 70 + this.r() * 40 | 0, 30], g: 20, drag: 0.4, kind: 'leaf', spin: (this.r() - 0.5) * 12 });
      }
    }
    this.gusts = this.gusts.filter((g) => g.t < g.dur);
    this.windK = windK;
    this.audio.setWind(windK);
    if (this.swarms) {
      for (const s of this.swarms) {
        s.x += s.vx * dt; s.y += s.vy * dt + Math.sin(this.time + s.x * 0.01) * 0.3;
        if (s.x < 170 && s.vx < 0) s.vx = -s.vx; // the post turns them back
      }
      this.swarms = this.swarms.filter((s) => s.x > -300 && s.x < this.bounds.x1 + 300);
    }
    // rain
    if (this.rainT > 0) {
      this.rainT -= dt;
      const k = clamp(Math.min(this.rainT, 3) / 3, 0, 1);
      this.audio.setRain(k);
      const b = this.bounds;
      const n = Math.floor(dt * 140 * k + this.r());
      for (let i = 0; i < n; i++) this.fx.add({ x: lerp(b.x0, b.x1, this.r()), y: b.y0 - 20, vx: -40, vy: 900, life: 2, age: 0, size: 1, col: [200, 210, 240], g: 400, drag: 0, kind: 'drop' });
      // some drops land on the threads: dew weight + a ping
      const alive = this.web.L;
      for (let i = 0; i < Math.floor(dt * 90 * k + this.r()); i++) {
        const l = alive[Math.floor(this.r() * alive.length)];
        if (!l || !l.alive || !l.phys) continue;
        const p = this.r() < 0.5 ? l.a : l.b;
        if (p.inv === 0) continue;
        p.dew = Math.min(1.2, p.dew + 0.25);
        this.web.impulse(p, 0, 1.2);
        if (this.r() < 0.15) this.audio.rainDrop(p.x);
      }
      this.escapeK = PHASES[this.phaseI].esc * 0.8; // wet bugs struggle less effectively
    } else { this.audio.setRain(0); this.escapeK = PHASES[this.phaseI].esc; }
  }

  solidAt(x, y) { return insideSolid(this.layout, x, y); }

  // Broken threads hang loose for a while, then are reeled in from the free end (keeps the web readable).
  retractLoose(dt) {
    this.retractT = (this.retractT || 0) - dt;
    if (this.retractT > 0) return;
    this.retractT = 0.09;
    const sp = this.spider;
    const busy = new Set([sp.at?.a, sp.at?.b]);
    if (sp.order && sp.order.type === 'build') { busy.add(sp.order.last); busy.add(sp.order.startP); }
    for (const p of this.web.P) {
      if (!p.alive || p.inv === 0 || p.kinematic || busy.has(p)) continue;
      const ls = this.web.aliveLinks(p);
      if (ls.length !== 1 || !ls[0].phys) continue;
      p.looseT = (p.looseT || 0) + 0.09;
      if (p.looseT < 8) continue;
      const l = ls[0];
      // anything hanging on this last segment falls off
      for (const c of this.cocoons) if (c.link === l) { c.dead = true; this.fx.burst(p.x, p.y, 3, { col: [230, 225, 215], speed: 30, size: 1.6, life: 0.8, g: 200, add: false }); }
      l.alive = false;
      this.web.version++;
      p.alive = false;
      const q = l.a === p ? l.b : l.a;
      q.looseT = p.looseT;
    }
    this.cocoons = this.cocoons.filter((c) => !c.dead && c.link.alive);
  }

  // ------------------------------------------------------------ web events
  onSplit(old, l1, l2, t) {
    for (const b of this.bugs) {
      if (b.stuck && b.stuck.link === old) {
        if (b.stuck.t <= t) b.stuck = { link: l1, t: t > 0 ? b.stuck.t / t : 0 };
        else b.stuck = { link: l2, t: (b.stuck.t - t) / (1 - t) };
      }
    }
    for (const c of this.cocoons) {
      if (c.link === old) {
        if (c.t <= t) { c.link = l1; c.t = t > 0 ? c.t / t : 0; } else { c.link = l2; c.t = (c.t - t) / (1 - t); }
      }
    }
  }

  onBreak(l, cause) {
    if (cause === 'tear' || cause === 'burst' || cause === 'escape') {
      const x = (l.a.x + l.b.x) / 2, y = (l.a.y + l.b.y) / 2;
      this.audio.snap(l.strand?.len ?? 300, x);
      this.fx.burst(x, y, 6, { col: [255, 230, 200], speed: 60, size: 1.4, life: 0.5, g: 40 });
      if (this.state === 'play') this.stats.snapped++;
      this.fx.shake(cause === 'burst' ? 0.25 : 0.08);
    }
  }

  onBugHitsThread(bug, hit) {
    const T = bug.type;
    const l = hit.link;
    const len = l.strand?.len ?? 300;
    // the impact travels through the web
    const k = 0.012 * (0.5 + T.mass);
    this.web.impulse(l.a, bug.vx * k * (1 - hit.t), bug.vy * k * (1 - hit.t));
    this.web.impulse(l.b, bug.vx * k * hit.t, bug.vy * k * hit.t);
    const dens = this.web.density(bug.x, bug.y, T.size + 18);
    const heavy = T.mass > 1;
    if (dens >= T.needs) {
      bug.stick(hit, dens);
      // the very first catch of a night gets extra time: the player is still learning to tap
      if (!this.firstStuck && this.state === 'play') { this.firstStuck = true; bug.grace = 2.5; }
      this.audio.hit(len, bug.x, heavy);
      this.fx.ring(bug.x, bug.y, [255, 230, 190], 4, 30, 0.45);
      if (bug.kind === 'moth') this.fx.burst(bug.x, bug.y, 10, { col: [255, 220, 170], speed: 50, size: 1.6, life: 1.1, g: 25 });
      if (heavy) { this.fx.shake(0.3); this.hitstop = 0.05; }
      this.spider.listen = 0.6;
      this.spider.listenAng = Math.atan2(bug.y - this.spider.y, bug.x - this.spider.x);
      if (!this.firstCatchDone) { this.hint('tap', true); }
    } else if (l.strand && l.strand.strong) {
      // frame silk holds, but one thread alone cannot stop it: it bounces off and the web shudders
      bug.vx *= -0.5; bug.vy *= -0.5;
      bug.ignore = l; bug.ignoreT = 0.4;
      this.audio.hit(len, bug.x, true);
      this.fx.shake(0.12);
    } else {
      // too sparse here: it bursts through
      this.web.killLink(l, 'burst');
      bug.vx *= 0.7; bug.vy *= 0.7;
      bug.ignore = l; bug.ignoreT = 0.3;
      this.fx.text(bug.x, bug.y - 20, 'прорвал', '#ff9a7a');
    }
  }

  onStruggle(bug) {
    this.audio.struggle(bug.x);
    if (bug.kind === 'moth' && this.r() < 0.5) this.fx.burst(bug.x, bug.y, 2, { col: [255, 215, 160], speed: 30, size: 1.2, life: 0.9, g: 20 });
  }

  onBugFreed(bug, reason) {
    if (reason === 'escaped') {
      this.audio.escape(bug.x);
      this.fx.text(bug.x, bug.y - 18, 'сорвалась', '#c8d4ff');
      if (this.state === 'play') this.stats.escaped++;
    }
  }

  onLampBump(bug) {
    this.audio.lamp(bug.x);
    if (this.r() < 0.5) this.fx.burst(bug.x, bug.y, 3, { col: [255, 230, 180], speed: 40, size: 1.3, life: 0.6, g: 30 });
  }

  onWrapStart(bug) {
    this.audio.go();
    this.fx.ring(bug.x, bug.y, [255, 255, 255], 6, 26, 0.35);
  }

  onWrapTick(bug, dt, k) {
    this.audio.wrapTick(bug.x);
    if (this.r() < dt * 30) this.fx.burst(bug.x, bug.y, 1, { col: [240, 240, 255], speed: 40, size: 1.2, life: 0.4, g: 0 });
    if (bug.kind === 'wasp' && this.r() < dt * 0.55) {
      bug.beingWrapped = false;
      this.onSting(bug, true);
    }
  }

  onEat(bug) {
    const T = bug.type;
    bug.unload();
    const l = bug.stuck.link;
    bug.dead = true;
    this.cocoons.push({ link: l, t: bug.stuck.t, size: T.size * 0.75, kind: bug.kind });
    l.a.load += 0.12; l.b.load += 0.12;
    if (this.state === 'play') {
      this.belly = Math.min(140, this.belly + T.value * BELLY_PER_CAL);
      this.silk = Math.min(100, this.silk + T.silk);
      this.score += T.value;
      this.stats.caught[bug.kind] = (this.stats.caught[bug.kind] || 0) + 1;
      this.hud.flash('belly');
      this.platform.moment(bug.kind === 'beetle' ? 'Жук в сети' : bug.kind === 'wasp' ? 'Оса поймана' : 'Первая добыча');
    }
    this.audio.eat(T.value, bug.x);
    this.audio.duck();
    this.fx.text(bug.x, bug.y - 22, '+' + T.value, '#ffd59a', T.value >= 12);
    this.fx.ring(bug.x, bug.y, [255, 210, 140], 6, 52, 0.55);
    this.fx.burst(bug.x, bug.y, 14, { col: [255, 230, 190], speed: 90, size: 1.8, life: 0.7, g: 20 });
    this.hitstop = Math.max(this.hitstop, 0.035);
    haptic(12);
    if (!this.firstCatchDone) { this.firstCatchDone = true; this.hint('belly', true); }
    if (this.belly >= 100 && !this.fullAnnounced && this.state === 'play') {
      this.fullAnnounced = true;
      this.toast('Сыта! Дальше — на рекорд');
      this.platform.moment('Сытая ночь');
    }
  }

  onSting(wasp, duringWrap = false) {
    const sp = this.spider;
    if (sp.hidden || sp.mode === 'descend' || sp.mode === 'stun') return;
    sp.stung(2.4);
    this.belly = Math.max(0, this.belly - 8);
    this.stats.stung++;
    this.audio.sting();
    this.fx.shake(0.55);
    this.fx.ring(sp.x, sp.y, [255, 90, 60], 8, 60, 0.5);
    this.fx.text(sp.x, sp.y - 30, 'ужалила! −8', '#ff8a6a');
    this.hud.flash('belly');
    if (duringWrap) wasp.escape = Math.max(wasp.escape, 0.5);
  }

  onSpiderLanded() {
    if (this.state === 'play') this.hint('build', true);
  }

  onThreadDone(order, link) {
    const len = order.laid;
    const knots = this.web.weave(order.strand);
    if (knots) this.fx.burst(this.spider.x, this.spider.y, 2, { col: [255, 240, 210], speed: 20, size: 1, life: 0.5, g: 0 });
    this.stats.threads++;
    this.stats.silkLen += len;
    this.stats.longest = Math.max(this.stats.longest, len);
    this.audio.threadDone(order.strand.len, this.spider.x);
    this.fx.burst(this.spider.x, this.spider.y, 6, { col: [255, 245, 220], speed: 50, size: 1.2, life: 0.6, g: 10 });
    if (this.stats.threads === 1) { this.hint('more', true); this.platform.moment('Первая нить'); }
    this.hubCache = null;
  }

  planFailed(order, why) {
    this.silk = Math.min(100, this.silk + order.cost);
    this.toast(why === 'path' ? 'Туда не пройти' : 'Опора исчезла');
  }

  toastNoPath() { this.toast('Туда не пройти — нужна нить'); }

  // ------------------------------------------------------------ attach points
  resolveAttach(x, y, radius) {
    const nl = this.web.nearestLink(x, y, radius, true);
    const ns = nearestSurface(this.layout, x, y);
    let best = null;
    if (nl) {
      const px = lerp(nl.link.a.x, nl.link.b.x, nl.t), py = lerp(nl.link.a.y, nl.link.b.y, nl.t);
      best = { type: 'silk', link: nl.link, t: nl.t, x: px, y: py, d: nl.d * 0.8 };
    }
    if (ns) {
      const d = Math.max(0, ns.d - ns.s.r);
      // surfaces are visually thick: anything inside the wood counts
      const inside = insideSolid(this.layout, x, y);
      if ((d <= radius || inside) && (!best || d < best.d)) {
        // anchor on the glue line, so threads leave the surface face
        if (ns.y > 1500 || ns.y < 150) return best;
        best = { type: 'surf', s: ns.s, x: ns.x, y: ns.y, d };
      }
    }
    return best;
  }

  materialize(a) {
    const web = this.web;
    if (a.type === 'silk') {
      let link = a.link, t = a.t;
      if (!link || !link.alive) {
        const nl = web.nearestLink(a.x, a.y, 34, true);
        if (!nl) {
          const alt = this.resolveAttach(a.x, a.y, 40);
          if (!alt || alt.type !== 'surf') return null;
          return this.materialize(alt);
        }
        link = nl.link; t = nl.t;
      }
      if (t < 0.15 && link.a.alive) return link.a;
      if (t > 0.85 && link.b.alive) return link.b;
      return web.splitLink(link, t).p;
    }
    const p = web.addParticle(a.x, a.y, true, 'anchor');
    this.linkToSurface(p, a.s);
    return p;
  }

  findHub() {
    if (this.hubCache && this.hubCache.ver === this.web.version) return this.hubCache.p;
    let best = null, score = -1;
    const c = this.webCenter();
    for (const p of this.web.P) {
      if (!p.alive || p.kind === 'surface' || p.inv === 0) continue;
      const deg = this.web.aliveLinks(p).filter((l) => l.phys).length;
      if (deg < 3) continue;
      const s = deg * 100 - dist(p.x, p.y, c.x, c.y) * 0.2;
      if (s > score) { score = s; best = p; }
    }
    this.hubCache = { ver: this.web.version, p: best };
    return best;
  }

  // ------------------------------------------------------------ input
  bindInput() {
    const cv = this.R.cv;
    let active = null;
    const pt = (e) => this.R.toWorld(e.clientX, e.clientY);
    cv.addEventListener('pointerdown', (e) => {
      this.audio.unlock();
      if (this.state !== 'play' || active !== null) return;
      active = e.pointerId;
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      const w = pt(e);
      const rad = this.R.cssToWorld(30);
      this.drag = { x0: w.x, y0: w.y, x: w.x, y: w.y, start: this.resolveAttach(w.x, w.y, rad), end: null, moved: false, sx: e.clientX, sy: e.clientY };
    });
    cv.addEventListener('pointermove', (e) => {
      if (e.pointerId !== active || !this.drag) return;
      const d = this.drag;
      const w = pt(e);
      d.x = w.x; d.y = w.y;
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 10) d.moved = true;
      if (d.moved) {
        const prevEnd = d.end;
        d.end = this.resolveAttach(w.x, w.y, this.R.cssToWorld(30));
        if (d.end && (!prevEnd || Math.hypot(prevEnd.x - d.end.x, prevEnd.y - d.end.y) > 25)) haptic(4);
      }
    });
    const up = (e) => {
      if (e.pointerId !== active) return;
      active = null;
      const d = this.drag;
      this.drag = null;
      if (!d || this.state !== 'play') return;
      if (!d.moved) this.tap(d.x0, d.y0);
      else this.tryPlan(d);
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', (e) => { if (e.pointerId === active) { active = null; this.drag = null; } });
  }

  tap(x, y) {
    // 1) stuck prey under the finger
    const rad = this.R.cssToWorld(44);
    let best = null, bd = rad;
    for (const b of this.bugs) {
      if (!b.stuck || b.beingWrapped) continue;
      const d = dist(b.x, b.y, x, y);
      if (d < bd) { bd = d; best = b; }
    }
    if (best) {
      this.spider.command({ type: 'eat', bug: best }, true);
      this.fx.ring(best.x, best.y, [255, 240, 200], 30, 8, 0.3);
      this.audio.ui();
      return;
    }
    // 2) the retreat leaf
    const R = this.layout.retreat;
    if (dist(x, y, R.x, R.y) < R.r + this.R.cssToWorld(20)) {
      this.spider.command({ type: 'move', node: this.retreatNode, hide: true }, true);
      this.fx.ring(R.x, R.y, [255, 230, 190], 40, 10, 0.35);
      return;
    }
    // 3) somewhere on the web / a surface: walk there
    const a = this.resolveAttach(x, y, this.R.cssToWorld(26));
    if (a) {
      if (a.type === 'silk') this.spider.command({ type: 'move', link: a.link, t: a.t }, true);
      else {
        const s = a.s;
        let n = null, nd = 1e9;
        for (const p of s.nodes) { const d = dist(p.x, p.y, a.x, a.y); if (d < nd) { nd = d; n = p; } }
        if (n) this.spider.command({ type: 'move', node: n }, true);
      }
      this.fx.ring(a.x, a.y, [200, 220, 255], 22, 6, 0.3);
    }
  }

  tryPlan(d) {
    const s = d.start, e = d.end;
    if (!s) { this.toast('Начни нить от ветки, балки или другой нити'); this.fx.text(d.x0, d.y0, '✕', '#ff8a6a'); return; }
    if (!e) { this.toast('Закончи нить на опоре или на нити'); this.fx.text(d.x, d.y, '✕', '#ff8a6a'); return; }
    const len = dist(s.x, s.y, e.x, e.y);
    if (len < MIN_THREAD) return;
    if (s.type === 'surf' && e.type === 'surf' && s.s === e.s && len < 160) { this.toast('Слишком близко на одной опоре'); return; }
    const cost = len * SILK_PER_PX;
    if (cost > this.silk) { this.toast('Не хватает шёлка'); this.hint('silk'); this.hud.flash('silk'); this.audio.thunk(); return; }
    this.silk -= cost;
    const order = { type: 'build', start: s, end: e, cost };
    this.spider.command(order, false);
    this.audio.ui();
    this.fx.ring(e.x, e.y, [255, 245, 220], 22, 6, 0.3);
  }

  // ------------------------------------------------------------ hints
  hint(key, force = false) {
    if (this.state !== 'play') return;
    if (this.seenHints.has(key) && !force) return;
    if (this.seenHints.has(key) && force && this.stats.threads > 1 && key === 'build') return;
    this.seenHints.add(key);
    try { localStorage.setItem('silk.hints', JSON.stringify([...this.seenHints])); } catch (e) { /* ignore */ }
    this.hud.hint(HINTS[key], key === 'build' || key === 'tap');
    this.hintKey = key;
    this.audio.hintChime();
  }

  toast(s) { this.hud.toast(s); }

  stuckAlarm(dt) {
    // a soft "ting" when something is about to break free
    for (const b of this.bugs) if (b.stuck && !b.beingWrapped && b.escape > 0.7) { this.audio.stuckAlarm(); break; }
    if (this.hintKey === 'build' && this.stats.threads > 0) { this.hud.hint(null); this.hintKey = null; }
    if (this.hintKey === 'tap' && this.firstCatchDone) { this.hud.hint(null); this.hintKey = null; }
  }

  updateBuzz() {
    if (!this.audio.ctx) return;
    for (const kind of ['fly', 'wasp', 'beetle']) {
      let best = null, bd = 1e9;
      for (const b of this.bugs) {
        if (b.kind !== kind || b.stuck) continue;
        const d = dist(b.x, b.y, 500, 800);
        if (d < bd) { bd = d; best = b; }
      }
      const lvl = best ? clamp(1 - bd / 900, 0, 1) * (kind === 'beetle' ? 0.11 : kind === 'wasp' ? 0.09 : 0.05) : 0;
      this.audio.setBuzz(kind, this.state === 'play' || this.state === 'title' ? lvl : 0, best ? best.x : 500);
    }
  }

  // ------------------------------------------------------------ end
  toDawn() {
    this.state = 'dawn';
    this.dawnT = 0;
    this.hud.hint(null);
    this.toast('Рассвет');
    for (const b of this.bugs) if (!b.stuck) { b.leaving = true; b.life = 0; }
    this.audio.dawnBirds();
    this.audio.setNight(0.2);
    this.audio.setIntensity(0.1);
    this.platform.gameplayStop();
  }

  finish() {
    this.ended = true;
    this.state = 'result';
    const full = this.belly >= 100;
    const newBest = this.score > this.best;
    if (newBest) { this.best = this.score; try { localStorage.setItem('silk.best', String(this.best)); } catch (e) { /* ignore */ } }
    this.platform.saveBest(this.best);
    this.hud.result(this, { full, newBest });
  }

  // ------------------------------------------------------------ drawing (world space)
  drawWorld(ctx, R) {
    const lamp = this.layout.lamp;
    const lampK = (1 - this.dawnMix) * this.lampFlicker;
    // dew beads (rain, and dawn)
    const beads = new Path2D(), shine = new Path2D();
    let any = false;
    for (const p of this.web.P) {
      if (!p.alive || p.dew < 0.22 || p.kind !== 'silk') continue;
      const r = 1.1 + p.dew * 1.9;
      beads.moveTo(p.x + r, p.y + 1); beads.arc(p.x, p.y + 1, r, 0, TAU);
      shine.moveTo(p.x + 0.7, p.y); shine.arc(p.x - 0.5, p.y + 0.2, r * 0.45, 0, TAU);
      any = true;
    }
    if (any) {
      ctx.fillStyle = `rgba(190,205,230,${0.35 + this.dawnMix * 0.25})`; ctx.fill(beads);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.dawnMix > 0.3 ? 'rgba(255,225,180,0.9)' : 'rgba(255,220,170,0.75)'; ctx.fill(shine);
      ctx.globalCompositeOperation = 'source-over';
    }
    // wrapped husks
    for (const c of this.cocoons) {
      if (!c.link.alive) continue;
      const x = lerp(c.link.a.x, c.link.b.x, c.t), y = lerp(c.link.a.y, c.link.b.y, c.t);
      const ang = Math.atan2(c.link.b.y - c.link.a.y, c.link.b.x - c.link.a.x);
      ctx.save(); ctx.translate(x, y + c.size * 0.5); ctx.rotate(Math.PI / 2 + Math.sin(this.time + c.t * 10) * 0.08);
      const g = ctx.createLinearGradient(-c.size, 0, c.size, 0);
      g.addColorStop(0, 'rgba(150,145,140,0.95)'); g.addColorStop(0.5, 'rgba(235,230,220,0.95)'); g.addColorStop(1, 'rgba(140,135,130,0.95)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(0, 0, c.size * 0.75, c.size * 0.42, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(120,115,110,0.6)'; ctx.lineWidth = 0.8;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * c.size * 0.25 - 3, -c.size * 0.4); ctx.lineTo(i * c.size * 0.25 + 3, c.size * 0.4); ctx.stroke(); }
      ctx.restore();
      void ang;
    }
    // fireflies glow (stuck ones light up the web around them)
    ctx.globalCompositeOperation = 'lighter';
    for (const b of this.bugs) {
      if (b.kind !== 'firefly') continue;
      const on = fireflyGlow(b.blink, b.id);
      R.sprite(b.x, b.y, 26 + 70 * on, [190, 255, 110], 0.18 + 0.5 * on);
    }
    // stuck bugs pulse so they are easy to find on a phone
    for (const b of this.bugs) {
      if (!b.stuck || b.beingWrapped) continue;
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 6 + b.id);
      R.sprite(b.x, b.y, b.type.size * 2.6 + 10, b.type.danger ? [255, 120, 70] : [255, 225, 160], 0.12 + 0.18 * pulse);
    }
    ctx.globalCompositeOperation = 'source-over';
    // insects
    for (const b of this.bugs) b.draw(ctx, clamp(lampK * (1.2 - dist(b.x, b.y, lamp.x, lamp.y) / 900), 0, 1), this.dawnMix);
    // escape timers (not at dawn: the night is over, what is caught stays caught)
    for (const b of this.bugs) {
      if (!b.stuck || b.beingWrapped || this.state === 'dawn' || this.state === 'result') continue;
      const r = b.type.size + 10;
      const k = clamp(b.escape, 0, 1);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = k > 0.7 ? `rgba(255,110,80,${0.8 + 0.2 * Math.sin(this.time * 20)})` : 'rgba(255,240,215,0.85)';
      ctx.beginPath(); ctx.arc(b.x, b.y, r, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - k)); ctx.stroke();
    }
    // spider
    this.spider.draw(ctx, lamp, this.dawnMix);
    this.fx.draw(ctx);
  }

  drawOverlay(ctx, R) {
    if (this.state !== 'play') return;
    const plans = [];
    if (this.spider.order && this.spider.order.type === 'build') plans.push(this.spider.order);
    for (const o of this.spider.queue) if (o.type === 'build') plans.push(o);
    ctx.lineCap = 'round';
    const lw = R.cssToWorld(1.6);
    for (const o of plans) {
      if (o.stage === 'lay') {
        ctx.setLineDash([R.cssToWorld(3), R.cssToWorld(7)]);
        ctx.strokeStyle = 'rgba(255,240,215,0.45)'; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(this.spider.x, this.spider.y); ctx.lineTo(o.end.x, o.end.y); ctx.stroke();
      } else {
        ctx.setLineDash([R.cssToWorld(5), R.cssToWorld(7)]);
        ctx.strokeStyle = 'rgba(255,240,215,0.5)'; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(o.start.x, o.start.y); ctx.lineTo(o.end.x, o.end.y); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,240,215,0.75)';
      ctx.beginPath(); ctx.arc(o.end.x, o.end.y, R.cssToWorld(3.2), 0, TAU); ctx.fill();
    }
    const d = this.drag;
    if (d && d.moved) {
      const s = d.start, e = d.end;
      const sx = s ? s.x : d.x0, sy = s ? s.y : d.y0;
      const ex = e ? e.x : d.x, ey = e ? e.y : d.y;
      const len = dist(sx, sy, ex, ey);
      const cost = len * SILK_PER_PX;
      const ok = s && e && cost <= this.silk && len >= MIN_THREAD;
      ctx.setLineDash([R.cssToWorld(6), R.cssToWorld(6)]);
      ctx.lineWidth = R.cssToWorld(2.2);
      ctx.strokeStyle = ok ? 'rgba(255,244,225,0.9)' : 'rgba(255,120,90,0.85)';
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.setLineDash([]);
      const ring = (x, y, good) => {
        ctx.lineWidth = R.cssToWorld(2);
        ctx.strokeStyle = good ? 'rgba(255,244,225,0.95)' : 'rgba(255,120,90,0.9)';
        ctx.beginPath(); ctx.arc(x, y, R.cssToWorld(good ? 12 : 9), 0, TAU); ctx.stroke();
      };
      ring(sx, sy, !!s);
      ring(ex, ey, !!e);
      // cost label above the finger
      ctx.font = `600 ${R.cssToWorld(13)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = ok ? 'rgba(255,244,225,0.95)' : 'rgba(255,140,110,0.95)';
      const lx = (sx + ex) / 2, ly = (sy + ey) / 2 - R.cssToWorld(14);
      ctx.fillText(cost > this.silk ? 'мало шёлка' : `−${Math.ceil(cost)} шёлка`, lx, ly);
    }
    // hint hand for the very first thread
    if (this.hintKey === 'build' && this.stats.threads === 0 && !this.drag && this.spider.mode !== 'descend' && !this.spider.order && this.spider.queue.length === 0) {
      const t = (this.time % 2.4) / 2.4;
      const a = { x: 96, y: 640 }, b = { x: lerp(560, 640, 0.5), y: this.layout.stems[0].pts[6][1] };
      const k = smooth(clamp((t - 0.1) / 0.6, 0, 1));
      const x = lerp(a.x, b.x, k), y = lerp(a.y, b.y, k);
      ctx.setLineDash([R.cssToWorld(5), R.cssToWorld(6)]);
      ctx.strokeStyle = `rgba(255,240,215,${0.6 * (1 - Math.max(0, (t - 0.8) / 0.2))})`;
      ctx.lineWidth = R.cssToWorld(2);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(x, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(255,240,215,${0.85 * (1 - Math.max(0, (t - 0.8) / 0.2))})`;
      ctx.beginPath(); ctx.arc(x, y, R.cssToWorld(13), 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,190,110,0.8)'; ctx.lineWidth = R.cssToWorld(2);
      ctx.beginPath(); ctx.arc(a.x, a.y, R.cssToWorld(16 + 6 * Math.sin(this.time * 6)), 0, TAU); ctx.stroke();
    }
  }

  shake() { return this.fx.offset(this.R.view.pw); }
}
