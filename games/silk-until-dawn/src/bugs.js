// Night insects. Each kind has one readable behaviour, a value and a way of fighting the silk.

import { clamp, lerp, dist, TAU, angleLerp, rng } from './util.js';

export const KINDS = {
  gnat: {
    name: 'мошка', size: 6.2, speed: 75, value: 1, silk: 2, escape: 7.5, strength: 0.4, wrap: 0.35, mass: 0.15, needs: 1,
  },
  moth: {
    name: 'мотылёк', size: 21.2, speed: 115, value: 7, silk: 8, escape: 5.2, strength: 1, wrap: 0.7, mass: 0.5, needs: 1,
  },
  fly: {
    name: 'муха', size: 13.8, speed: 210, value: 6, silk: 6, escape: 3.0, strength: 1.2, wrap: 0.55, mass: 0.4, needs: 1,
  },
  firefly: {
    name: 'светлячок', size: 13.8, speed: 55, value: 12, silk: 10, escape: 6.0, strength: 0.8, wrap: 0.6, mass: 0.35, needs: 1,
  },
  beetle: {
    name: 'жук', size: 23.8, speed: 125, value: 20, silk: 12, escape: 3.6, strength: 3, wrap: 1.1, mass: 1.6, needs: 3,
  },
  wasp: {
    name: 'оса', size: 20.0, speed: 170, value: 24, silk: 14, escape: 4.0, strength: 2.2, wrap: 1.5, mass: 0.8, needs: 2, danger: true,
  },
};

let uid = 1;

export class Bug {
  constructor(game, kind, x, y, opts = {}) {
    this.g = game;
    this.id = uid++;
    this.kind = kind;
    this.type = KINDS[kind];
    this.x = x; this.y = y;
    this.px = x; this.py = y;
    const a = opts.angle ?? Math.atan2(800 - y, 450 - x);
    this.vx = Math.cos(a) * this.type.speed;
    this.vy = Math.sin(a) * this.type.speed;
    this.heading = a;
    this.t = Math.random() * 10;
    this.r = rng((Math.random() * 1e9) | 0);
    this.stuck = null;
    this.escape = 0;
    this.struggleT = 0;
    this.dead = false;
    this.leaving = false;
    this.life = opts.life ?? 22 + Math.random() * 10;
    this.goal = opts.goal || null;
    this.ignore = null;
    this.ignoreT = 0;
    this.wingPhase = Math.random() * TAU;
    this.beingWrapped = false;
    this.flash = 0;
    this.swarm = opts.swarm || null;
    this.dartT = 0;
    this.blink = Math.random() * 4;
    this.hits = 0;
    this.huntT = 0;
    this.stingCD = 0;
    this.lampBumps = 0;
    this.orbitDir = Math.random() < 0.5 ? -1 : 1;
    // insects either fly in over the right edge or emerge from the dark garden behind the web
    this.appear = opts.fromDepth ? 0 : 1;
  }

  // ---------------------------------------------------------- flight
  steer(dt) {
    const g = this.g, T = this.type, lamp = g.layout.lamp;
    this.t += dt;
    this.life -= dt;
    let ax = 0, ay = 0;
    const toward = (x, y, k) => {
      const dx = x - this.x, dy = y - this.y, d = Math.hypot(dx, dy) || 1;
      ax += (dx / d) * k; ay += (dy / d) * k;
    };
    const wander = (k, f = 1.3) => {
      ax += Math.cos(this.t * f * 2.1 + this.id) * k + Math.sin(this.t * f * 3.7 + this.id * 2) * k * 0.6;
      ay += Math.sin(this.t * f * 1.7 + this.id * 3) * k + Math.cos(this.t * f * 2.9 + this.id) * k * 0.6;
    };
    // leaving: drift away from the web (and fade back into the garden, see update)
    const exit = () => { toward(this.x + (this.x < 500 ? 200 : 400), this.y + (this.y < 800 ? -120 : 160), T.speed * 2.2); };
    if (this.life <= 0) this.leaving = true;

    switch (this.kind) {
      case 'gnat': {
        const s = this.swarm;
        if (s && !this.leaving) {
          toward(s.x + Math.cos(this.t * 2 + this.id) * 30, s.y + Math.sin(this.t * 2.6 + this.id * 2) * 26, T.speed * 4);
        } else exit();
        wander(T.speed * 2.5, 3);
        break;
      }
      case 'moth': {
        if (!this.leaving) {
          // drawn to the lamp; orbit it erratically, bump into the glass
          const dl = dist(this.x, this.y, lamp.x, lamp.y);
          const orbitR = 70 + 40 * Math.sin(this.t * 0.7 + this.id);
          if (dl > orbitR + 60) toward(lamp.x, lamp.y, T.speed * 3.2);
          else {
            const ang = Math.atan2(this.y - lamp.y, this.x - lamp.x) + this.orbitDir * 0.9;
            toward(lamp.x + Math.cos(ang) * orbitR, lamp.y + Math.sin(ang) * orbitR * 1.25, T.speed * 4);
            if (Math.random() < dt * 0.5) this.orbitDir *= -1;
          }
          if (dl < lamp.r + 18) {
            // tink! bounce off the glass
            const nx = (this.x - lamp.x) / (dl || 1), ny = (this.y - lamp.y) / (dl || 1);
            this.vx = nx * T.speed * 1.4; this.vy = ny * T.speed * 1.4;
            this.lampBumps++;
            g.onLampBump(this);
          }
          if (this.lampBumps > 3 + (this.id % 4) && Math.random() < dt * 0.25) this.leaving = true;
        } else exit();
        wander(T.speed * 3.5, 2.2);
        break;
      }
      case 'fly': {
        // dart, hover, dart
        this.dartT -= dt;
        if (this.dartT <= 0 || !this.goal) {
          const b = g.bounds;
          this.goal = this.leaving ? { x: this.x < 450 ? b.x0 - 300 : b.x1 + 300, y: this.y } : { x: lerp(140, 860, this.r()), y: lerp(260, 1340, this.r()) };
          this.dartT = 0.5 + this.r() * 0.9;
          this.pause = this.r() < 0.4 ? 0.25 + this.r() * 0.35 : 0;
        }
        if (this.pause > 0) { this.pause -= dt; this.vx *= 0.85; this.vy *= 0.85; wander(80, 6); break; }
        toward(this.goal.x, this.goal.y, T.speed * 9);
        if (this.r() < dt * 3) this.leaving = this.leaving || this.life < 0;
        break;
      }
      case 'firefly': {
        if (!this.leaving) {
          const gy = this.goal ? this.goal.y : 1000;
          toward(this.goal ? this.goal.x : 450, gy + Math.sin(this.t * 0.8) * 60, T.speed * 1.4);
          if (this.goal && dist(this.x, this.y, this.goal.x, this.goal.y) < 80) this.goal = { x: lerp(160, 860, this.r()), y: lerp(700, 1300, this.r()) };
        } else exit();
        wander(T.speed * 1.4, 0.8);
        break;
      }
      case 'beetle': {
        // heavy, nearly straight flight with slow corrections
        if (this.goal && !this.leaving) toward(this.goal.x, this.goal.y, T.speed * 1.2);
        else exit();
        if (this.goal && dist(this.x, this.y, this.goal.x, this.goal.y) < 60) this.leaving = true;
        wander(T.speed * 0.4, 0.6);
        break;
      }
      case 'wasp': {
        const sp = g.spider;
        this.stingCD -= dt;
        this.huntT += dt;
        const exposed = !sp.hidden && sp.mode !== 'descend';
        if (!this.leaving && exposed && this.huntT > 1.5) {
          // hover at distance, then lunge
          const d = dist(this.x, this.y, sp.x, sp.y);
          if (this.stingCD > 0) toward(sp.x + Math.cos(this.t) * 180, sp.y - 140, T.speed * 3);
          else if (d > 150) toward(sp.x + Math.cos(this.t * 1.3) * 90, sp.y + Math.sin(this.t * 1.1) * 90, T.speed * 3);
          else toward(sp.x, sp.y, T.speed * 7);
          if (d < 20 && this.stingCD <= 0) { g.onSting(this); this.stingCD = 3.5; }
        } else if (!this.leaving) {
          toward(this.goal ? this.goal.x : 450, this.goal ? this.goal.y : 700, T.speed * 2);
          if (this.goal && dist(this.x, this.y, this.goal.x, this.goal.y) < 80) this.goal = { x: lerp(160, 860, this.r()), y: lerp(300, 1300, this.r()) };
          if (!exposed && this.huntT > 9) this.leaving = true;
        } else exit();
        wander(T.speed * 1.2, 2.5);
        break;
      }
    }
    // wind pushes the light ones
    const w = g.windAt(this.x, this.y);
    ax += w.x * (1.4 / (0.4 + T.mass));
    ay += w.y * (1.4 / (0.4 + T.mass));
    this.vx += ax * dt; this.vy += ay * dt;
    // drag toward cruise speed
    const sp = Math.hypot(this.vx, this.vy);
    const max = T.speed * (this.kind === 'fly' ? 1.6 : 1.25);
    if (sp > max) { this.vx *= max / sp; this.vy *= max / sp; }
    this.vx *= Math.pow(0.6, dt); this.vy *= Math.pow(0.6, dt);
    // keep out of the wooden scenery
    if (g.solidAt(this.x + this.vx * dt, this.y + this.vy * dt)) { this.vx *= -0.6; this.vy *= -0.6; }
    if (g.solidAt(this.x, this.y)) { this.vx += (500 - this.x) * 0.5 * dt * 10; this.vy += (800 - this.y) * 0.5 * dt * 10; }
  }

  update(dt) {
    const g = this.g, T = this.type;
    if (!this.stuck) {
      if (this.leaving && (this.leaveT = (this.leaveT || 0) + dt) > 1.0) this.appear -= dt * 1.4;
      else if (this.appear < 1) this.appear = Math.min(1, this.appear + dt * 1.6);
      if (this.appear <= 0) { this.dead = true; return; }
    }
    this.wingPhase += dt * (this.stuck ? 70 : this.kind === 'moth' ? 26 : this.kind === 'beetle' ? 55 : 90);
    this.flash = Math.max(0, this.flash - dt * 3);
    this.blink += dt;
    if (this.stuck) return this.updateStuck(dt);
    this.ignoreT -= dt;
    if (this.ignoreT <= 0) this.ignore = null;
    this.steer(dt);
    this.px = this.x; this.py = this.y;
    const nx = this.x + this.vx * dt, ny = this.y + this.vy * dt;
    // not yet in the web's plane while emerging from (or fading into) the dark
    const hit = this.appear > 0.65 ? g.web.sweep(this.x, this.y, nx, ny, this.ignore) : null;
    this.x = nx; this.y = ny;
    if (Math.abs(this.vx) + Math.abs(this.vy) > 1) this.heading = angleLerp(this.heading, Math.atan2(this.vy, this.vx), 1 - Math.exp(-8 * dt));
    if (hit) g.onBugHitsThread(this, hit);
    // gone?
    const b = g.bounds;
    if (this.leaving && (this.x < b.x0 - 120 || this.x > b.x1 + 120 || this.y < b.y0 - 120 || this.y > b.y1 + 120)) this.dead = true;
  }

  stick(hit, density) {
    const l = hit.link;
    this.stuck = { link: l, t: hit.t };
    this.density = density;
    this.escape = 0;
    this.struggleT = 0.2;
    // the prey hangs on the thread
    l.a.load += this.type.mass * (1 - hit.t);
    l.b.load += this.type.mass * hit.t;
    this.x = lerp(l.a.x, l.b.x, hit.t); this.y = lerp(l.a.y, l.b.y, hit.t);
    this.flash = 1;
  }

  unload() {
    if (!this.stuck) return;
    const l = this.stuck.link;
    l.a.load = Math.max(0, l.a.load - this.type.mass * (1 - this.stuck.t));
    l.b.load = Math.max(0, l.b.load - this.type.mass * this.stuck.t);
  }

  release(tear) {
    const g = this.g;
    const l = this.stuck.link;
    this.unload();
    this.stuck = null;
    this.beingWrapped = false;
    this.ignore = l; this.ignoreT = 0.8;
    this.leaving = true;
    this.life = 0;
    const a = Math.random() * TAU;
    this.vx = Math.cos(a) * this.type.speed; this.vy = -Math.abs(Math.sin(a)) * this.type.speed;
    if (tear && l.alive && !(l.strand && l.strand.strong)) g.web.killLink(l, 'escape');
  }

  updateStuck(dt) {
    const g = this.g, T = this.type;
    const l = this.stuck.link;
    if (!l.alive) { this.release(false); g.onBugFreed(this, 'torn'); return; }
    this.x = lerp(l.a.x, l.b.x, this.stuck.t);
    this.y = lerp(l.a.y, l.b.y, this.stuck.t);
    if (this.beingWrapped || g.state === 'dawn' || g.state === 'result') return;
    // struggle: tug the thread, slowly work free (denser silk holds longer)
    this.struggleT -= dt;
    if (this.struggleT <= 0) {
      this.struggleT = 0.12 + Math.random() * 0.3;
      const k = 1.6 * T.strength;
      const ax = (Math.random() - 0.5) * k, ay = (Math.random() - 0.5) * k;
      g.web.impulse(l.a, ax, ay); g.web.impulse(l.b, ax, ay);
      g.onStruggle(this);
    }
    const hold = 1 + 0.18 * Math.max(0, (this.density || 1) - 1);
    this.escape += (dt / T.escape) / hold * g.escapeK / (this.grace || 1);
    if (this.escape >= 1) {
      this.release(T.strength >= 2 || Math.random() < 0.25);
      g.onBugFreed(this, 'escaped');
    }
  }

  // ---------------------------------------------------------- draw
  draw(ctx, lampK, dawn) {
    const T = this.type;
    const s = T.size;
    const x = this.x, y = this.y;
    const jit = this.stuck && !this.beingWrapped ? (Math.random() - 0.5) * 1.6 : 0;
    ctx.save();
    ctx.translate(x + jit, y + jit * 0.6);
    if (this.appear < 1) { const k = Math.max(0, this.appear); ctx.globalAlpha = k * k; ctx.scale(0.45 + 0.55 * k, 0.45 + 0.55 * k); }
    const head = this.stuck ? this.heading + Math.sin(this.t * 30) * 0.15 : this.heading;
    ctx.rotate(head);
    const flap = Math.sin(this.wingPhase);
    switch (this.kind) {
      case 'gnat': {
        ctx.fillStyle = 'rgba(40,36,30,0.9)';
        ctx.beginPath(); ctx.ellipse(0, 0, s * 0.7, s * 0.35, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = `rgba(230,230,240,${0.3 + 0.2 * lampK})`;
        ctx.beginPath(); ctx.ellipse(-1, 0, s * 0.5, s * (0.6 + 0.4 * flap), 0, 0, TAU); ctx.fill();
        break;
      }
      case 'moth': {
        // dusty wings, catch the lamp light
        const open = 0.55 + 0.45 * Math.abs(flap);
        const warm = lampK;
        const wc = `rgb(${190 + 50 * warm | 0},${170 + 40 * warm | 0},${140 + 20 * warm | 0})`;
        for (const sd of [-1, 1]) {
          ctx.save(); ctx.scale(1, sd * open);
          ctx.fillStyle = wc;
          ctx.beginPath();
          ctx.moveTo(2, 0); ctx.quadraticCurveTo(s * 0.6, s * 1.15, -s * 0.2, s * 1.05); ctx.quadraticCurveTo(-s * 0.5, s * 0.5, -s * 0.15, 0);
          ctx.fill();
          ctx.fillStyle = 'rgba(110,86,60,0.55)';
          ctx.beginPath(); ctx.arc(s * 0.15, s * 0.62, s * 0.13, 0, TAU); ctx.fill();
          ctx.fillStyle = `rgba(170,150,120,0.9)`;
          ctx.beginPath(); ctx.moveTo(-s * 0.1, 0); ctx.quadraticCurveTo(-s * 0.7, s * 0.55, -s * 0.8, s * 0.25); ctx.quadraticCurveTo(-s * 0.6, 0, -s * 0.1, 0); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#6e5840';
        ctx.beginPath(); ctx.ellipse(-2, 0, s * 0.55, s * 0.18, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#5a4630'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s * 0.4, -1); ctx.quadraticCurveTo(s * 0.7, -s * 0.4, s * 0.85, -s * 0.5); ctx.moveTo(s * 0.4, 1); ctx.quadraticCurveTo(s * 0.7, s * 0.4, s * 0.85, s * 0.5); ctx.stroke();
        break;
      }
      case 'fly': {
        ctx.fillStyle = `rgba(220,235,255,${0.25 + 0.25 * Math.abs(flap)})`;
        for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(-s * 0.2, sd * s * 0.55, s * 0.6, s * 0.3, sd * (0.5 + flap * 0.3), 0, TAU); ctx.fill(); }
        const bg = ctx.createLinearGradient(-s, 0, s, 0);
        bg.addColorStop(0, '#1c2a2a'); bg.addColorStop(0.6, '#3c5c4c'); bg.addColorStop(1, '#2a2620');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.ellipse(-s * 0.15, 0, s * 0.65, s * 0.38, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#8a2a1e';
        ctx.beginPath(); ctx.arc(s * 0.55, -s * 0.2, s * 0.2, 0, TAU); ctx.arc(s * 0.55, s * 0.2, s * 0.2, 0, TAU); ctx.fill();
        break;
      }
      case 'firefly': {
        const on = fireflyGlow(this.blink, this.id);
        ctx.fillStyle = 'rgba(200,200,170,0.35)';
        for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(0, sd * s * 0.45, s * 0.5, s * 0.22, sd * (0.4 + flap * 0.3), 0, TAU); ctx.fill(); }
        ctx.fillStyle = '#2e2a1e';
        ctx.beginPath(); ctx.ellipse(s * 0.2, 0, s * 0.45, s * 0.3, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = `rgb(${180 + 60 * on | 0},${200 + 55 * on | 0},${90 + 40 * on | 0})`;
        ctx.beginPath(); ctx.ellipse(-s * 0.35, 0, s * 0.42, s * 0.3, 0, 0, TAU); ctx.fill();
        break;
      }
      case 'beetle': {
        ctx.fillStyle = `rgba(200,210,230,${0.2 + 0.2 * Math.abs(flap)})`;
        if (!this.stuck) for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(-s * 0.1, sd * s * 0.75, s * 0.7, s * 0.3, sd * (0.3 + flap * 0.2), 0, TAU); ctx.fill(); }
        const eg = ctx.createRadialGradient(s * 0.1, -s * 0.2, 1, 0, 0, s);
        eg.addColorStop(0, `rgb(${90 + 80 * lampK | 0},${150 + 60 * lampK | 0},${110 + 30 * lampK | 0})`);
        eg.addColorStop(0.5, '#1f4a3a'); eg.addColorStop(1, '#0c1e18');
        ctx.fillStyle = eg;
        ctx.beginPath(); ctx.ellipse(-s * 0.1, 0, s * 0.75, s * 0.55, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s * 0.35, 0); ctx.lineTo(-s * 0.8, 0); ctx.stroke();
        ctx.fillStyle = '#132a22';
        ctx.beginPath(); ctx.ellipse(s * 0.65, 0, s * 0.28, s * 0.32, 0, 0, TAU); ctx.fill();
        break;
      }
      case 'wasp': {
        ctx.fillStyle = `rgba(230,220,200,${0.25 + 0.25 * Math.abs(flap)})`;
        for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(-s * 0.05, sd * s * 0.55, s * 0.6, s * 0.22, sd * (0.4 + flap * 0.3), 0, TAU); ctx.fill(); }
        // striped abdomen
        ctx.fillStyle = '#e8b030';
        ctx.beginPath(); ctx.ellipse(-s * 0.45, 0, s * 0.55, s * 0.3, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#1a1206';
        for (let i = 0; i < 3; i++) ctx.fillRect(-s * 0.8 + i * s * 0.28, -s * 0.3, s * 0.1, s * 0.6);
        ctx.fillStyle = '#2a1e0a';
        ctx.beginPath(); ctx.ellipse(s * 0.25, 0, s * 0.3, s * 0.22, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#e8b030';
        ctx.beginPath(); ctx.arc(s * 0.6, 0, s * 0.2, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#1a1206'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(-s * 1.2, 0); ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }
}

export function fireflyGlow(t, id) {
  // two quick pulses then a pause, phase-shifted per bug
  const p = (t + id * 0.37) % 2.6;
  const pulse = (c) => Math.max(0, 1 - Math.abs(p - c) / 0.18);
  return Math.max(0.15, pulse(0.3), pulse(0.75));
}
