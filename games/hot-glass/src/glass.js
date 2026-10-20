// Molten glass on a blowpipe, as a surface of revolution sampled in N rings along the pipe axis.
//
// Per ring:  V  — glass volume (conserved: glass is incompressible); cross-section A = V / dz
//            ri — cavity (air) radius;  outer radius r = sqrt(ri² + A/π)
//            T  — temperature 0..1 (1 = glory-hole hot, < SET = set solid)
//            sy — droop of the ring centre below the pipe axis (gravity, when the pipe is not turned)
// The piece's length grows as the bubble grows (a bubble expands in every direction), so a round gather
// stays round and a long gather stays long. The last CAP rings are the thick bottom, shaped as a dome.
// Rules come from the material: viscosity falls steeply with heat; thin hot walls inflate fastest
// (hoop stress ~ p·ri/w) and burst; an unturned gather droops; a fast-turned hot lip flares open;
// the steel pipe draws heat out of the neck.

export const N = 72;
export const CAP = 6;              // default length (in rings) of the rounded bottom; each piece sets its own
export const SET = 0.42;          // below this the glass is rigid
export const BURST = 0.09;        // a wall blown thinner than this share of its starting thickness bursts
export const THIN = 0.14;         // ... and this thin earns a warning
const TAIR = 0.08;
// feel constants, tuned with tools/balance.mjs (how fast breath inflates the bubble)
export const TUNE = { blowRate: 36, stressCap: 1.4, flareRate: 38 };
const LMAX = 330;

export const mobility = (T) => (T <= SET ? 0 : Math.exp(7.5 * (Math.min(T, 1) - 1)) * Math.min(1, (T - SET) / 0.08));   // a reheat above 1 glows brighter but is no runnier

export class Gather {
  // len: length of the fresh gather; radius: its fattest radius; neck: radius at the pipe
  // capFrac: share of the length that is the rounded, thick bottom (a ball's is half, a bowl's is open)
  // rise: share of the body over which the gather swells from the neck; round: a round shoulder (balls)
  constructor({ len = 120, radius = 48, neck = 18, capFrac = 0.1, rise = 0.6, round = false, colour = [0.9, 0.97, 0.95] } = {}) {
    this.capN = Math.max(3, Math.round(N * capFrac));
    this.len0 = len; this.len = len;
    this.dz = len / (N - 1);
    this.V = new Float32Array(N);
    this.ri = new Float32Array(N);
    this.T = new Float32Array(N);
    this.sy = new Float32Array(N);
    this.r = new Float32Array(N);
    this.colour = colour;
    this.spin = 0;
    this.angle = 0;
    this.crack = 0;
    this.burst = null;
    for (let i = 0; i < N; i++) {
      const z = i / (N - 1);
      // a honey-like drop: slim at the neck, full body (the bottom dome is shaped in sync())
      const bodyEnd = 1 - this.capN / N;
      const grow = Math.min(1, z / (bodyEnd * rise));
      const shape = round ? Math.sqrt(Math.max(0, 1 - (1 - grow) * (1 - grow))) : grow * grow * (3 - 2 * grow);
      const rr = Math.max(4, neck + (radius - neck) * shape);
      // air channel from the pipe and a small bubble through the body
      const cav = z < 0.05 ? 3 : rr * 0.16;
      this.ri[i] = cav;
      this.V[i] = Math.PI * Math.max(4, rr * rr - cav * cav) * this.dz;
      this.T[i] = 1;
    }
    this.r0 = 1;
    this.sync();
    this.r0 = this.bodyMax();
    // each ring's starting wall: a bubble bursts when breath stretches a wall to a small part of it
    this.w0 = Float32Array.from(this.r, (r, i) => Math.max(1, r - this.ri[i]));
  }

  bodyMax() { let m = 0; for (let i = 0; i < N - this.capN; i++) m = Math.max(m, this.r[i]); return m; }

  sync() {
    const CAP = this.capN, B = N - CAP;
    for (let i = 0; i < B; i++) this.r[i] = Math.sqrt(this.ri[i] * this.ri[i] + this.V[i] / this.dz / Math.PI);
    // rounded bottom: a dome that follows the last body ring (radius Rb) with a thick wall
    const Rb = this.r[B - 1], wb = Math.max(2, this.r[B - 1] - this.ri[B - 1]);
    for (let j = B; j < N; j++) {
      const u = (j - B + 1) / CAP;                 // 0 → 1 toward the very end
      this.r[j] = Math.max(1, Rb * Math.sqrt(Math.max(0, 1 - u * u * (CAP > 4 ? 0.997 : 0.3))));
      // the wall thickens smoothly toward the very bottom (no step where the body meets the dome)
      this.ri[j] = Math.max(0, this.r[j] - wb * (1 + 0.9 * u));
    }
  }

  wall(i) { return this.r[i] - this.ri[i]; }
  stretch(i) { return this.wall(i) / this.w0[i]; }   // 1 = as gathered, small = thin

  // radius at an absolute distance x from the pipe (0 beyond the end)
  radiusAt(x) {
    if (x < 0 || x > this.len) return 0;
    const f = (x / this.len) * (N - 1), i = Math.min(N - 2, Math.floor(f)), t = f - i;
    return this.r[i] * (1 - t) + this.r[i + 1] * t;
  }

  // the bubble grows in length with its girth; rings spread apart (their walls thin accordingly)
  grow(dt) {
    const g = this.bodyMax() / Math.max(1, this.r0);
    const target = Math.min(LMAX, this.len0 * Math.pow(Math.max(1, g), 0.85));
    if (target > this.len) {
      this.len += (target - this.len) * Math.min(1, 4 * dt);
      this.dz = this.len / (N - 1);
    }
  }

  // ---- actions ----------------------------------------------------------
  // pressure: 0..1 breath; returns the ring index with the thinnest wall
  blow(p, dt) {
    if (this.burst) return -1;
    let worst = -1, wmin = 1e9;
    const B = N - this.capN;
    // hoop stress (~ p·ri/w) makes thin, hot places balloon first; a fresh bubble opens slowly, then runs.
    // Viscosity couples neighbours, so the stress field is smoothed along the piece before it acts.
    const s = this._s || (this._s = new Float32Array(N));
    const s2 = this._s2 || (this._s2 = new Float32Array(N));
    for (let i = 0; i < N; i++) {
      const mob = i < 3 || i >= B || this.ri[i] <= 0.5 ? 0 : mobility(this.T[i]);
      const w = Math.max(0.5, this.wall(i));
      s[i] = mob * Math.min(TUNE.stressCap, 0.35 + this.ri[i] / w);
    }
    // the bottom moves with the body's end: extend the edge value so the smoothing does not drag it down
    for (let i = B; i < N; i++) s[i] = s[B - 1];
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < N; i++) s2[i] = (s[Math.max(0, i - 2)] + 2 * s[Math.max(0, i - 1)] + 3 * s[i] + 2 * s[Math.min(N - 1, i + 1)] + s[Math.min(N - 1, i + 2)]) / 9;
      s.set(s2);
    }
    // a bubble grows in proportion to its own size (shape-similar), so the gather's profile is kept
    let riMax = 1;
    for (let i = 3; i < B; i++) riMax = Math.max(riMax, this.ri[i]);
    for (let i = 3; i < B; i++) {
      if (this.ri[i] <= 0.5 || mobility(this.T[i]) <= 0) continue;
      this.ri[i] = Math.min(this.ri[i] + TUNE.blowRate * p * s[i] * (0.2 + 0.8 * this.ri[i] / riMax) * dt, 400);
    }
    this.sync();
    this.grow(dt);
    this.sync();
    // the most stretched wall (relative to how thick it started) is where it will give
    for (let i = 3; i < B; i++) { const w = this.stretch(i); if (w < wmin) { wmin = w; worst = i; } }
    if (worst >= 0 && wmin < BURST && this.T[worst] > SET) this.burst = { i: worst, t: 0 };
    return worst;
  }

  // squeeze at absolute distance x from the pipe down to outer radius rTarget (jacks)
  squeeze(x, rTarget, strength, dt) {
    const c = (x / this.len) * (N - 1);
    let cold = 0;
    for (let i = Math.max(2, Math.floor(c - 4)); i <= Math.min(N - this.capN - 1, Math.ceil(c + 4)); i++) {
      const fall = Math.max(0, 1 - Math.abs(i - c) / 4.5);
      if (fall <= 0) continue;
      const mob = mobility(this.T[i]);
      if (mob <= 0.002) { if (this.r[i] > rTarget + 1) cold += fall; continue; }   // pressing set glass
      const k = Math.min(1, strength * fall * (0.4 + mob * 6) * dt);
      const rNow = this.r[i];
      const rNew = rNow + (Math.min(rNow, rTarget) - rNow) * k;
      const A = this.V[i] / this.dz / Math.PI;
      const ri2 = rNew * rNew - A;
      this.ri[i] = ri2 > 0 ? Math.sqrt(ri2) : 0;
      if (ri2 <= 0) this.V[i] = Math.PI * rNew * rNew * this.dz; // fully closed: extra glass flows away (kept simple)
    }
    this.sync();
    return cold; // >0: tools touched glass that was too cold (risk of a crack)
  }

  // in the glory hole: depth 0..1 = how much of the piece is inside (nose first)
  reheat(depth, dt) {
    for (let i = 0; i < N; i++) {
      const z = i / (N - 1);
      const inside = Math.min(1, Math.max(0, (z - (1 - depth)) / 0.18 + 0.15));
      this.T[i] += (1.08 - this.T[i]) * (1 - Math.exp(-2.6 * inside * dt));
    }
  }

  // ---- physics step -----------------------------------------------------
  step(dt) {
    if (this.burst) { this.burst.t += dt; return; }
    const spinAbs = Math.abs(this.spin);
    this.angle += this.spin * Math.PI * 2 * dt;
    // the pipe keeps rolling on the rails for a couple of seconds after a calm flick; a hard spin
    // needs the hand to keep it up (rail friction grows with speed), so a flare stops when you stop
    this.spin *= Math.exp(-(0.55 + 0.8 * Math.max(0, spinAbs - 1.5)) * dt);
    const turning = Math.min(1, spinAbs / 0.55);
    for (let i = 0; i < N; i++) {
      const T = this.T[i];
      const w = Math.max(0.5, this.wall(i));
      // cooling: thin walls lose heat faster; the steel pipe draws heat out of the neck
      const z = i / (N - 1);
      const neck = z < 0.1 ? 0.45 * (1 - z / 0.1) : 0;
      this.T[i] = Math.min(1.08, T + (TAIR - T) * (1 - Math.exp(-dt * (0.035 + 0.55 / w + neck))));
    }
    // droop: hot glass far from the pipe sags unless the pipe is turned; turning evens the droop out
    for (let i = 1; i < N; i++) {
      const z = (i / (N - 1)) * (this.len / 200);
      const mob = mobility(this.T[i]);
      const lever = z * z * (0.4 + this.r[i] / 120);
      this.sy[i] += 15 * mob * lever * (1 - turning) * dt;
      this.sy[i] *= Math.exp(-turning * 2.2 * mob * 6 * dt);
    }
    for (let i = 1; i < N; i++) this.sy[i] = Math.max(this.sy[i], this.sy[i - 1] * 0.9);
    // flare: a fast-turned, hot end spreads outward (how bowls are opened)
    if (spinAbs > 1.8) {                         // only a hard spin (a calm roll just keeps it straight)
      const f = Math.min(1, (spinAbs - 1.8) / 0.6);   // saturates: "spinning hard" opens it at a steady pace
      const B = N - this.capN;
      for (let i = 4; i < B; i++) {
        const t = i / B;                           // farther from the pipe = more centrifugal pull
        const mob = mobility(this.T[i]);
        this.ri[i] += TUNE.flareRate * f * Math.sqrt(mob) * Math.pow(t, 1.6) * dt;   // the thin rim keeps moving as it cools
      }
    }
    // surface tension: hot neighbours even out the cavity profile a little
    for (let i = 1; i < N - this.capN - 1; i++) {
      const mob = mobility(this.T[i]);
      if (mob <= 0) continue;
      const lap = this.ri[i - 1] + this.ri[i + 1] - 2 * this.ri[i];
      this.ri[i] += lap * Math.min(0.45, 3.5 * mob * dt);
    }
    this.sync();
    this.grow(dt);
    this.sync();
    // burst: a wall stretched too thin
    for (let i = 2; i < N - this.capN; i++) {
      if (this.wall(i) < 0.8 && this.ri[i] > 6) { this.burst = { i, t: 0 }; break; }
    }
  }

  droop() { let m = 0; for (let i = 0; i < N; i++) m = Math.max(m, this.sy[i]); return m; }
}
