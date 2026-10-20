// Verlet silk physics + the walk graph the spider moves on.
//
// Everything the spider can stand on is a node (particle) in one graph:
//   * silk particles      (simulated, links are physical threads)
//   * surface particles   (pinned points along branches/posts; joined by walk-only links)
//   * anchors             (pinned points where a thread is glued to a surface)
// Bugs collide only with physical links. Pathfinding runs over all alive links.

import { clamp, segT, segIntersect, Heap, dist } from './util.js';

export const SEG = 15;            // target thread segment length (px)
export const TENSION = 0.94;      // spiders pull new threads taut: rest length = laid length * TENSION
const ITER = 9;                   // constraint iterations per substep (stiffness vs. cost on phones)
const SUB = 2;                    // substeps per frame
const BREAK = 1.55;               // stretch ratio that snaps a thread
const DAMP = 0.992;

export class Web {
  constructor() {
    this.P = [];       // particles
    this.L = [];       // links
    this.strands = [];
    this.gravity = 190;
    this.onBreak = null; // callback(link)
    this.time = 0;
    this.version = 0;    // bumps on topology change (for path cache)
    this.pid = 0; this.lid = 0;
  }

  addParticle(x, y, pinned = false, kind = 'silk') {
    // every field is declared up front so all particles share one hidden class (hot loop below)
    const p = { id: this.pid++, x, y, ox: x, oy: y, inv: pinned ? 0 : 1, mass: 1, w: 1, kind, links: [], alive: true, fx: 0, fy: 0, load: 0, dew: 0, kinematic: false, surface: null, looseT: 0, wx: 0, wy: 0, deg: 0 };
    this.P.push(p);
    return p;
  }

  addLink(a, b, phys = true, rest = null, strand = null) {
    const l = {
      id: this.lid++, a, b, phys, alive: true, strand,
      rest: rest ?? dist(a.x, a.y, b.x, b.y), rest0: 0, strain: 0, born: this.time,
    };
    l.rest0 = l.rest;
    this.L.push(l);
    a.links.push(l); b.links.push(l);
    this.version++;
    return l;
  }

  killLink(l, cause = 'break') {
    if (!l.alive) return;
    l.alive = false;
    this.version++;
    if (this.onBreak) this.onBreak(l, cause);
  }

  // Split a physical link at parameter t, returning the new particle (used to glue a new thread onto an old one).
  splitLink(l, t) {
    const a = l.a, b = l.b;
    const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
    const p = this.addParticle(x, y, false, 'silk');
    p.ox = a.ox + (b.ox - a.ox) * t; p.oy = a.oy + (b.oy - a.oy) * t;
    const r1 = l.rest * t, r2 = l.rest * (1 - t);
    l.alive = false;
    const l1 = this.addLink(a, p, true, r1, l.strand);
    const l2 = this.addLink(p, b, true, r2, l.strand);
    l1.born = l2.born = l.born;
    if (this.onSplit) this.onSplit(l, l1, l2, t);
    return { p, l1, l2 };
  }

  // Glue every place where the given strand crosses another thread into a shared junction node
  // (an orb weaver fastens threads where they cross). Returns the number of junctions made.
  weave(strand) {
    let made = 0;
    for (let guard = 0; guard < 40; guard++) {
      let hit = null;
      outer: for (const la of this.L) {
        if (!la.alive || !la.phys || la.strand !== strand) continue;
        for (const lb of this.L) {
          if (!lb.alive || !lb.phys || lb.strand === strand) continue;
          if (lb.a === la.a || lb.a === la.b || lb.b === la.a || lb.b === la.b) continue;
          if (Math.max(la.a.x, la.b.x) < Math.min(lb.a.x, lb.b.x) || Math.min(la.a.x, la.b.x) > Math.max(lb.a.x, lb.b.x)) continue;
          if (Math.max(la.a.y, la.b.y) < Math.min(lb.a.y, lb.b.y) || Math.min(la.a.y, la.b.y) > Math.max(lb.a.y, lb.b.y)) continue;
          const tb = segIntersect(la.a.x, la.a.y, la.b.x, la.b.y, lb.a.x, lb.a.y, lb.b.x, lb.b.y);
          if (tb < 0) continue;
          const ta = segT(lb.a.x + (lb.b.x - lb.a.x) * tb, lb.a.y + (lb.b.y - lb.a.y) * tb, la.a.x, la.a.y, la.b.x, la.b.y);
          hit = { la, lb, ta, tb };
          break outer;
        }
      }
      if (!hit) break;
      const { la, lb, ta, tb } = hit;
      const { p } = this.splitLink(lb, tb);
      la.alive = false;
      const l1 = this.addLink(la.a, p, true, Math.max(1, la.rest * ta), la.strand);
      const l2 = this.addLink(p, la.b, true, Math.max(1, la.rest * (1 - ta)), la.strand);
      l1.born = l2.born = la.born;
      if (this.onSplit) this.onSplit(la, l1, l2, ta);
      made++;
    }
    return made;
  }

  // Lay a straight thread between two existing particles (used by tests / prebuilt webs).
  chain(a, b, tension = 0.985, strand = null) {
    const d = dist(a.x, a.y, b.x, b.y);
    const n = Math.max(1, Math.round(d / SEG));
    let prev = a;
    const made = [];
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const p = i === n ? b : this.addParticle(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
      const l = this.addLink(prev, p, true, (d / n) * tension, strand);
      made.push(l);
      prev = p;
    }
    return made;
  }

  aliveLinks(p) {
    // prune dead links lazily
    if (p.links.some((l) => !l.alive)) p.links = p.links.filter((l) => l.alive);
    return p.links;
  }

  impulse(p, vx, vy) {
    if (p.inv === 0) return;
    p.ox -= vx; p.oy -= vy;
  }

  step(dt, wind) {
    this.time += dt;
    const h = dt / SUB;
    const g = this.gravity;
    const P = this.P, L = this.L;
    // sample the wind field once per frame, not per substep
    if (wind) for (let i = 0; i < P.length; i++) {
      const p = P[i];
      if (!p.alive || p.inv === 0) continue;
      const w = wind(p.x, p.y); p.wx = w.x; p.wy = w.y;
    }
    for (let s = 0; s < SUB; s++) {
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (!p.alive || p.inv === 0 || p.kinematic) continue;
        const m = p.mass + p.dew * 0.6 + p.load;
        p.w = 1 / m; // heavier points (dew, cocoons, a stuck beetle) resist the threads and sag more
        let vx = (p.x - p.ox) * DAMP, vy = (p.y - p.oy) * DAMP;
        // cap velocity to keep the solver sane when big impulses arrive
        const sp = vx * vx + vy * vy;
        if (sp > 400) { const k = 20 / Math.sqrt(sp); vx *= k; vy *= k; }
        p.ox = p.x; p.oy = p.y;
        // bare silk weighs almost nothing; what hangs on it (prey, dew, husks) makes it sag
        let ax = p.fx / m, ay = g * (0.14 + p.load + p.dew * 0.6) + p.fy / m;
        if (wind) { ax += p.wx / m; ay += p.wy / m; }
        p.x += vx + ax * h * h;
        p.y += vy + ay * h * h;
      }
      for (let it = 0; it < ITER; it++) {
        for (let i = 0; i < L.length; i++) {
          const l = L[i];
          if (!l.alive || !l.phys) continue;
          const a = l.a, b = l.b;
          const wa = a.kinematic || a.inv === 0 ? 0 : a.w || 1, wb = b.kinematic || b.inv === 0 ? 0 : b.w || 1;
          const ws = wa + wb;
          if (ws === 0) continue;
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1e-6;
          // silk only resists stretching (a rope), never compression
          if (d <= l.rest) continue;
          const diff = ((d - l.rest) / d) * 0.95;
          const ox = dx * diff, oy = dy * diff;
          a.x += ox * (wa / ws); a.y += oy * (wa / ws);
          b.x -= ox * (wb / ws); b.y -= oy * (wb / ws);
        }
      }
    }
    // tearing + strain for rendering; slack silk takes up its slack (threads stay taut, like real silk)
    // (take-up only removes slack, it never adds tension; long steady overload slowly creeps, sudden jerks still snap)
    const take = 1 - Math.exp(-3 * dt);
    const creep = 1 - Math.exp(-dt / 4);
    for (let i = 0; i < L.length; i++) {
      const l = L[i];
      if (!l.alive || !l.phys) continue;
      const d = dist(l.a.x, l.a.y, l.b.x, l.b.y);
      if (d < l.rest * 0.985) l.rest = Math.max(l.rest0 * 0.5, l.rest + (d - l.rest) * take);
      else if (d > l.rest * 1.1) l.rest += (d / 1.1 - l.rest) * Math.min(1, creep * (1 + (d / l.rest - 1.1) * 30));
      const r = d / l.rest;
      l.strain = r;
      if (r > BREAK && !l.a.kinematic && !l.b.kinematic) this.killLink(l, 'tear');
    }
    for (let i = 0; i < P.length; i++) { P[i].fx = 0; P[i].fy = 0; }
  }

  // Thread-level slack take-up: a run of silk between two junctions/anchors that hangs in a curve
  // (longer than the straight line between its ends) is shortened back to straight, the way a spider
  // reels in a loose line. Runs carrying prey, dew or the spider keep their (meaningful) sag.
  tighten(dt, busy) {
    // physical degree of every particle, counted once
    for (const p of this.P) p.deg = 0;
    for (const l of this.L) if (l.alive && l.phys) { l.a.deg++; l.b.deg++; }
    const deg = (p) => p.deg;
    const seen = new Set();
    const k = 1 - Math.exp(-2.5 * dt);
    for (const s of this.P) {
      if (!s.alive) continue;
      const ds = deg(s);
      if (ds === 2 || ds === 0) continue;
      for (const first of s.links) {
        if (!first.alive || !first.phys || seen.has(first)) continue;
        // walk the run
        const run = [first];
        let prev = s, cur = first.a === s ? first.b : first.a, ok = true, len = first.rest, geo = dist(s.x, s.y, cur.x, cur.y);
        while (cur.alive && deg(cur) === 2 && cur.inv !== 0) {
          if (cur.load > 0.05 || cur.dew > 0.2 || busy.has(cur)) ok = false;
          let next = null;
          for (const l of cur.links) if (l.alive && l.phys && l !== run[run.length - 1]) { next = l; break; }
          if (!next) break;
          run.push(next);
          const nxt = next.a === cur ? next.b : next.a;
          len += next.rest; geo += dist(cur.x, cur.y, nxt.x, nxt.y);
          prev = cur; cur = nxt;
          if (run.length > 400) break;
        }
        for (const l of run) seen.add(l);
        // dangling (free end) runs hang naturally
        if (!ok || (deg(cur) === 1 && cur.inv !== 0)) continue;
        const straight = dist(s.x, s.y, cur.x, cur.y);
        if (geo < straight * 1.015 || run.length < 2) continue;
        const f = Math.max(0.9, 1 - (1 - straight / geo) * k);
        for (const l of run) l.rest = Math.max(l.rest0 * 0.5, l.rest * f);
        void prev;
      }
    }
  }

  // Remove orphaned silk particles (no alive links) and drop dead entries so they stop costing time.
  compact() {
    for (const p of this.P) {
      if (!p.alive || p.kind !== 'silk' || p.kinematic) continue;
      if (this.aliveLinks(p).length === 0) p.alive = false;
    }
    this.L = this.L.filter((l) => l.alive);
    this.P = this.P.filter((p) => p.alive);
  }

  // ---- queries ----
  nearestLink(x, y, maxD, physOnly = true, list = this.L) {
    let best = null, bd = maxD, bt = 0;
    for (const l of list) {
      if (!l.alive || (physOnly && !l.phys)) continue;
      const t = segT(x, y, l.a.x, l.a.y, l.b.x, l.b.y);
      const px = l.a.x + (l.b.x - l.a.x) * t, py = l.a.y + (l.b.y - l.a.y) * t;
      const d = Math.hypot(px - x, py - y);
      if (d < bd) { bd = d; best = l; bt = t; }
    }
    return best ? { link: best, t: bt, d: bd } : null;
  }

  // First physical link crossed by a moving point (x0,y0)->(x1,y1).
  sweep(x0, y0, x1, y1, ignore) {
    let best = null;
    let bestS = 2;
    for (const l of this.L) {
      if (!l.alive || !l.phys || l === ignore) continue;
      const a = l.a, b = l.b;
      // cheap bbox reject
      if (Math.max(x0, x1) < Math.min(a.x, b.x) - 2 || Math.min(x0, x1) > Math.max(a.x, b.x) + 2) continue;
      if (Math.max(y0, y1) < Math.min(a.y, b.y) - 2 || Math.min(y0, y1) > Math.max(a.y, b.y) + 2) continue;
      const u = segIntersect(x0, y0, x1, y1, a.x, a.y, b.x, b.y);
      if (u < 0) continue;
      // parameter along the mover path, to take the first hit
      const s = segT(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, x0, y0, x1, y1);
      if (s < bestS) { bestS = s; best = { link: l, t: u }; }
    }
    return best;
  }

  // How many distinct threads pass near a point (how "dense" the web is there).
  density(x, y, r) {
    const seen = new Set();
    for (const l of this.L) {
      if (!l.alive || !l.phys) continue;
      const t = segT(x, y, l.a.x, l.a.y, l.b.x, l.b.y);
      const px = l.a.x + (l.b.x - l.a.x) * t, py = l.a.y + (l.b.y - l.a.y) * t;
      if ((px - x) ** 2 + (py - y) ** 2 < r * r) seen.add(l.strand || l);
    }
    return seen.size;
  }

  // Dijkstra from a location {a,b,t} (between two nodes) to a target location.
  // Target: {node} or {link,t}. Returns array of particles to visit, or null.
  path(from, to) {
    const P = this.P;
    const distA = new Map();
    const prev = new Map();
    const heap = new Heap();
    const seed = (p, c) => { if (!distA.has(p.id) || c < distA.get(p.id)) { distA.set(p.id, c); prev.set(p.id, null); heap.push(c, p); } };
    if (from.node) seed(from.node, 0);
    else {
      const len = dist(from.a.x, from.a.y, from.b.x, from.b.y);
      seed(from.a, len * from.t);
      seed(from.b, len * (1 - from.t));
    }
    const targets = new Map();
    if (to.node) targets.set(to.node.id, 0);
    else {
      const len = dist(to.link.a.x, to.link.a.y, to.link.b.x, to.link.b.y);
      targets.set(to.link.a.id, len * to.t);
      targets.set(to.link.b.id, len * (1 - to.t));
    }
    let best = null, bestCost = Infinity;
    while (heap.size) {
      const p = heap.pop();
      const c = distA.get(p.id);
      if (c >= bestCost) break;
      if (targets.has(p.id)) {
        const tc = c + targets.get(p.id);
        if (tc < bestCost) { bestCost = tc; best = p; }
      }
      for (const l of this.aliveLinks(p)) {
        const q = l.a === p ? l.b : l.a;
        if (!q.alive) continue;
        // walking on a surface is a little cheaper than on silk (sturdier footing)
        const w = dist(p.x, p.y, q.x, q.y) * (l.phys ? 1 : 0.9);
        const nc = c + w;
        if (!distA.has(q.id) || nc < distA.get(q.id)) {
          distA.set(q.id, nc); prev.set(q.id, p); heap.push(nc, q);
        }
      }
    }
    if (!best) return null;
    const out = [];
    let p = best;
    while (p) { out.push(p); p = prev.get(p.id); }
    out.reverse();
    return { nodes: out, cost: bestCost };
  }
}
