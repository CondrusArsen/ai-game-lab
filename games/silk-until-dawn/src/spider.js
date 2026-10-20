// The garden cross spider: moves over the web graph, lays threads, wraps prey.
// Body is drawn dorsally (we look at the web plane); 8 legs with two-bone IK plant their feet on threads.

import { SEG, TENSION } from './web.js';
import { clamp, lerp, dist, angleLerp, wrapAngle, TAU, segT, easeOutBack, damp } from './util.js';

const WALK = 460;      // px/s along silk (surfaces are faster, see walkTo)
const LAY = 330;       // px/s while laying a new thread
// creature scale: tuned so the spider reads at ~45 css px on a 375 px wide phone
export const S = 1.3;
const FEMUR = 25 * S, TIBIA = 27 * S;
// leg rest offsets in body frame: [forward, side] (side < 0 = left)
const REST = [[36, -24], [16, -38], [-5, -39], [-25, -29]].map(([f, s]) => [f * S, s * S]);
const GROUP = [0, 1, 0, 1]; // tetrapod gait: L1,L3 with R2,R4

export class Spider {
  constructor(game) {
    this.g = game;
    this.x = 450; this.y = 250;
    this.heading = Math.PI / 2;     // head-down, as orb weavers rest
    this.at = null;                 // {a,b,t}: graph location
    this.mode = 'descend';
    this.queue = [];                // pending orders
    this.order = null;
    this.path = null;
    this.speedK = 1;
    this.crouch = 0;                // anticipation squash
    this.listen = 0;                // turned toward a vibration
    this.listenAng = 0;
    this.gulp = 0;
    this.stun = 0;
    this.hidden = false;
    this.idleT = 0;
    this.pluckT = 2;
    this.wrapT = 0;
    this.time = 0;
    this.abd = 1;                   // abdomen scale (belly)
    this.legs = [];
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 4; i++) {
        this.legs.push({ side, i, fx: this.x, fy: this.y, ax: null, sx: 0, sy: 0, tx: 0, ty: 0, step: 1, group: side < 0 ? GROUP[i] : 1 - GROUP[i], attach: null });
      }
    }
    this.gaitPhase = 0;
    this.dragline = null;
  }

  pos() { return { x: this.x, y: this.y }; }

  // ------------------------------------------------------------ orders
  busy() { return !!this.order || this.mode === 'wrap' || this.mode === 'stun' || this.mode === 'descend'; }

  command(order, urgent = false) {
    if (urgent) {
      // prey first: interrupt a walk, but never a half-laid thread
      if (this.order && this.order.type === 'build' && this.order.stage === 'lay') { this.queue.unshift(order); return; }
      if (this.order && this.order.type === 'build') this.queue.unshift(this.order);
      this.queue.unshift(order);
      this.order = null;
      this.path = null;
    } else {
      this.queue.push(order);
    }
  }

  cancelPlans() { this.queue = this.queue.filter((o) => o.type !== 'build'); }

  // ------------------------------------------------------------ helpers
  locPos(at) {
    return { x: lerp(at.a.x, at.b.x, at.t), y: lerp(at.a.y, at.b.y, at.t) };
  }

  setAtNode(p) { this.at = { a: p, b: p, t: 0 }; }

  supportAlive() {
    const at = this.at;
    if (!at) return false;
    if (!at.a.alive || !at.b.alive) return false;
    if (at.a === at.b) return true;
    return at.a.links.some((l) => l.alive && (l.a === at.b || l.b === at.b));
  }

  // try to get onto the graph from a free position
  regrab() {
    const web = this.g.web;
    let best = null, bd = 1e9;
    for (const p of web.P) {
      if (!p.alive || p.kinematic) continue;
      if (web.aliveLinks(p).length === 0) continue;
      const d = dist(p.x, p.y, this.x, this.y);
      if (d < bd) { bd = d; best = p; }
    }
    if (best) {
      this.setAtNode(best);
      this.fallFrom = { x: this.x, y: this.y, t: 0 };
    }
  }

  // ------------------------------------------------------------ update
  update(dt) {
    this.time += dt;
    const g = this.g;
    this.crouch = damp(this.crouch, 0, 10, dt);
    this.gulp = Math.max(0, this.gulp - dt * 1.6);
    this.listen = Math.max(0, this.listen - dt);
    const belly = g.belly / 100;
    this.abd = damp(this.abd, 0.82 + belly * 0.5 + this.gulp * 0.25, 6, dt);

    if (this.mode === 'descend') return this.updateDescend(dt);
    if (this.mode === 'stun') {
      this.stun -= dt;
      this.followSupport();
      if (this.stun <= 0) this.mode = 'idle';
      this.updateLegs(dt, 0);
      return;
    }
    if (this.mode === 'wrap') return this.updateWrap(dt);

    if (!this.supportAlive()) {
      if (this.order && this.order.type === 'build' && this.order.stage === 'lay') { /* in the air on purpose */ }
      else { this.regrab(); this.path = null; if (this.order) this.order.stage = null; }
    }

    if (!this.order && this.queue.length) this.startOrder(this.queue.shift());
    let moving = false;
    if (this.order) moving = this.runOrder(dt);
    else this.idle(dt);
    this.snack(dt);

    if (this.fallFrom) {
      // quick scramble back along a safety line after the floor vanished
      this.fallFrom.t += dt * 3;
      if (this.fallFrom.t >= 1) this.fallFrom = null;
    }
    this.updateLegs(dt, moving ? 1 : 0);
  }

  updateDescend(dt) {
    // intro: lowering on a dragline from the beam, swaying; then the dragline becomes a real thread
    const d = this.dragline;
    if (!d) return;
    d.len = Math.min(d.target, d.len + dt * 210 * (d.len < d.target * 0.8 ? 1 : 0.5));
    this.x = d.top.x + Math.sin(this.time * 2.1) * Math.min(10, d.len * 0.03);
    this.y = d.top.y + 18 + d.len;
    this.heading = damp(this.heading, Math.PI / 2, 8, dt);
    if (d.len >= d.target && !d.done) {
      d.done = true;
      const web = this.g.web;
      const end = web.addParticle(this.x, this.y);
      web.chain(d.top, end, 0.995, { id: this.g.nextStrandId++, len: d.target, strong: true });
      this.setAtNode(end);
      this.mode = 'idle';
      this.idleT = -4;
      this.g.onSpiderLanded();
    }
    this.updateLegs(dt, 0);
  }

  followSupport() {
    if (!this.at) return;
    const p = this.locPos(this.at);
    this.x = p.x; this.y = p.y;
  }

  idle(dt) {
    this.followSupport();
    this.idleT += dt;
    // settle head-down at rest, unless listening to a vibration
    const want = this.listen > 0 ? this.listenAng : Math.PI / 2;
    this.heading = angleLerp(this.heading, want, 1 - Math.exp(-6 * dt));
    // occasionally pluck a thread with a front leg: feel the web
    this.pluckT -= dt;
    if (this.pluckT <= 0) {
      this.pluckT = 2.5 + Math.random() * 3.5;
      const leg = this.legs[Math.random() < 0.5 ? 0 : 4];
      if (leg.attach && leg.attach.link.alive) {
        leg.step = 0.35; // a little lift
        this.g.web.impulse(leg.attach.link.a, 0, 1.4);
        this.g.web.impulse(leg.attach.link.b, 0, 1.4);
        this.g.audio?.tick(this.x);
      }
    }
    // weight on the web
    this.applyWeight();
    // after a while with nothing to do, go to the hub (best waiting spot)
    if (this.idleT > 2.2 && !this.hidden) {
      const hub = this.g.findHub();
      if (hub && dist(hub.x, hub.y, this.x, this.y) > 40) this.command({ type: 'move', node: hub, auto: true });
      this.idleT = -3;
    }
  }

  // gnats are too small to wrap: the spider snaps up any stuck within reach as it passes
  snack(dt) {
    this.snackT = (this.snackT || 0) - dt;
    if (this.snackT > 0 || this.mode !== 'idle' && this.mode !== 'walk' && this.mode !== 'idle') return;
    for (const b of this.g.bugs) {
      if (b.kind !== 'gnat' || !b.stuck || b.dead || b.beingWrapped) continue;
      if (dist(b.x, b.y, this.x, this.y) < 46) {
        this.gulp = Math.max(this.gulp, 0.5);
        this.snackT = 0.18;
        this.g.onEat(b);
        return;
      }
    }
  }

  applyWeight() {
    const at = this.at;
    if (!at) return;
    const w = 26;
    if (at.a.inv) at.a.fy += w * (1 - at.t);
    if (at.b.inv) at.b.fy += w * at.t;
  }

  startOrder(o) {
    this.order = o;
    this.path = null;
    this.idleT = 0;
    this.crouch = 1; // anticipation
    if (this.hidden && o.type !== 'hide') this.hidden = false;
    if (o.type === 'build') o.stage = 'goto';
    this.g.audio?.go();
  }

  finishOrder() {
    this.order = null;
    this.path = null;
  }

  // Walk the graph toward a target location. Returns true when arrived.
  walkTo(dt, target, speed = WALK) {
    const web = this.g.web;
    const key = target.node ? 'n' + target.node.id : 'l' + target.link.id + ':' + target.t.toFixed(3);
    if (!this.path || this.path.ver !== web.version || this.path.key !== key) {
      const from = this.at.a === this.at.b ? { node: this.at.a } : { a: this.at.a, b: this.at.b, t: this.at.t };
      const res = web.path(from, target);
      if (!res) return null;
      this.path = { nodes: res.nodes, i: 0, ver: web.version, tgt: target, key };
      // first node: if we are between a and b, the path starts at one of them
    }
    const onSurface = this.at && this.at.a.kind === 'surface' && this.at.b.kind === 'surface';
    let budget = speed * dt * this.speedK * (onSurface ? 1.35 : 1);
    let guard = 0;
    while (budget > 0 && guard++ < 50) {
      const P = this.path;
      let tx, ty, node = null;
      if (P.i < P.nodes.length) { node = P.nodes[P.i]; tx = node.x; ty = node.y; }
      else if (target.link) { tx = lerp(target.link.a.x, target.link.b.x, target.t); ty = lerp(target.link.a.y, target.link.b.y, target.t); }
      else return true;
      const d = dist(this.x, this.y, tx, ty);
      const ang = Math.atan2(ty - this.y, tx - this.x);
      if (d > 0.5) this.heading = angleLerp(this.heading, ang, 1 - Math.exp(-14 * dt));
      if (d <= budget) {
        this.x = tx; this.y = ty;
        budget -= d;
        if (node) {
          const prev = this.at;
          this.setAtNode(node);
          P.i++;
          void prev;
        } else {
          this.at = { a: target.link.a, b: target.link.b, t: target.t };
          return true;
        }
      } else {
        this.x += Math.cos(ang) * budget;
        this.y += Math.sin(ang) * budget;
        // keep a graph location between last node and the next one
        if (node && this.at.a === this.at.b) {
          const from = this.at.a;
          const L = dist(from.x, from.y, node.x, node.y) || 1;
          this.at = { a: from, b: node, t: clamp(1 - d / L, 0, 1) };
        } else if (node) {
          const L = dist(this.at.a.x, this.at.a.y, node.x, node.y) || 1;
          if (this.at.b === node) this.at.t = clamp(1 - d / L, 0, 1);
        }
        budget = 0;
      }
    }
    this.applyWeight();
    return false;
  }

  runOrder(dt) {
    const o = this.order;
    const g = this.g;
    if (o.type === 'move') {
      const tgt = o.tgt || (o.tgt = o.node ? { node: o.node } : { link: o.link, t: o.t });
      if (o.node && !o.node.alive) { this.finishOrder(); return false; }
      if (o.link && !o.link.alive) { this.finishOrder(); return false; }
      const r = this.walkTo(dt, tgt);
      if (r === null) { this.finishOrder(); if (!o.auto) g.toastNoPath(); return false; }
      if (r) { this.finishOrder(); if (o.hide) { this.hidden = true; g.audio?.hide(); } }
      return !r;
    }
    if (o.type === 'eat') {
      const bug = o.bug;
      if (!bug.stuck || bug.dead || !bug.stuck.link.alive) { this.finishOrder(); return false; }
      const r = this.walkTo(dt, { link: bug.stuck.link, t: bug.stuck.t });
      if (r === null) { this.finishOrder(); g.toastNoPath(); return false; }
      // close enough to grab?
      if (r || dist(this.x, this.y, bug.x, bug.y) < 16) {
        this.at = { a: bug.stuck.link.a, b: bug.stuck.link.b, t: bug.stuck.t };
        this.mode = 'wrap';
        this.wrapT = 0;
        this.wrapDur = bug.type.wrap;
        this.prey = bug;
        bug.beingWrapped = true;
        this.order = null;
        this.path = null;
        g.onWrapStart(bug);
        return false;
      }
      return true;
    }
    if (o.type === 'build') return this.runBuild(dt, o);
    return false;
  }

  runBuild(dt, o) {
    const g = this.g;
    if (o.stage === 'goto') {
      // materialize the start point now (the web may have changed since planning)
      if (!o.startP) {
        o.startP = g.materialize(o.start);
        if (!o.startP) { g.planFailed(o); this.finishOrder(); return false; }
      }
      const r = this.walkTo(dt, { node: o.startP });
      if (r === null) { g.planFailed(o, 'path'); this.finishOrder(); return false; }
      if (r) {
        // begin laying: a kinematic tip follows the spider; joints are dropped behind it
        o.stage = 'lay';
        const web = g.web;
        o.tip = web.addParticle(this.x, this.y, false, 'silk');
        o.tip.kinematic = true;
        o.last = o.startP;
        o.tipLink = web.addLink(o.last, o.tip, true, 1);
        o.laid = 0;
        // long threads are frame silk (strong, like real dragline silk); short ones are capture silk
        const len = dist(o.start.x, o.start.y, o.end.x, o.end.y);
        o.strand = { id: g.nextStrandId++, len, strong: len >= 380 };
        o.tipLink.strand = o.strand;
        this.crouch = 0.7;
        g.audio?.layStart();
      }
      return true;
    }
    if (o.stage === 'lay') {
      const web = g.web;
      // aim at the planned end, re-resolved live if it sits on silk
      let ex = o.end.x, ey = o.end.y;
      if (o.end.type === 'silk' && o.end.link && o.end.link.alive) {
        ex = lerp(o.end.link.a.x, o.end.link.b.x, o.end.t); ey = lerp(o.end.link.a.y, o.end.link.b.y, o.end.t);
      }
      const d = dist(this.x, this.y, ex, ey);
      const ang = Math.atan2(ey - this.y, ex - this.x);
      this.heading = angleLerp(this.heading, ang, 1 - Math.exp(-12 * dt));
      const step = Math.min(d, LAY * dt * this.speedK);
      this.x += Math.cos(ang) * step; this.y += Math.sin(ang) * step;
      o.laid += step;
      o.tip.x = o.tip.ox = this.x; o.tip.y = o.tip.oy = this.y;
      // drop a joint every SEG
      const L = dist(o.last.x, o.last.y, o.tip.x, o.tip.y);
      if (L > SEG) {
        const k = SEG / L;
        const p = web.addParticle(lerp(o.last.x, o.tip.x, k), lerp(o.last.y, o.tip.y, k));
        o.tipLink.alive = false;
        web.addLink(o.last, p, true, SEG * TENSION, o.strand);
        o.last = p;
        o.tipLink = web.addLink(o.last, o.tip, true, 1, o.strand);
      }
      o.tipLink.rest = Math.max(1, dist(o.last.x, o.last.y, o.tip.x, o.tip.y) * 0.99);
      // ride the new line (for the walk graph and weight)
      this.at = { a: o.last, b: o.last, t: 0 };
      g.audio?.layTick(o.laid);
      if (d < 2) {
        // attach the end
        const endP = g.materialize(o.end);
        o.tipLink.alive = false;
        o.tip.alive = false;
        web.version++;
        if (endP) {
          const l = web.addLink(o.last, endP, true, Math.max(2, dist(o.last.x, o.last.y, endP.x, endP.y) * TENSION), o.strand);
          this.setAtNode(endP);
          g.onThreadDone(o, l);
        } else {
          // nothing to glue to any more: the thread stays dangling
          this.setAtNode(o.last);
          g.onThreadDone(o, null);
        }
        this.finishOrder();
        return false;
      }
      return true;
    }
    return false;
  }

  updateWrap(dt) {
    const bug = this.prey;
    this.wrapT += dt;
    if (!bug || bug.dead || !bug.stuck || !bug.stuck.link.alive) {
      this.mode = 'idle';
      if (bug) bug.beingWrapped = false;
      this.prey = null;
      this.regrab();
      return;
    }
    // circle the prey, legs flicking
    const k = this.wrapT / this.wrapDur;
    const orbit = 9 * (1 - k * 0.5);
    const a = this.wrapT * 22;
    this.x = bug.x + Math.cos(a) * orbit;
    this.y = bug.y + Math.sin(a) * orbit;
    this.heading = a + Math.PI / 2;
    this.at = { a: bug.stuck.link.a, b: bug.stuck.link.b, t: bug.stuck.t };
    this.g.onWrapTick(bug, dt, k);
    if (this.mode !== 'wrap') return; // stung or interrupted
    if (this.wrapT >= this.wrapDur) {
      this.mode = 'idle';
      this.gulp = 1;
      this.prey = null;
      this.idleT = 0.8;
      this.g.onEat(bug);
    }
    this.updateLegs(dt, 2);
  }

  stung(sec) {
    if (this.prey) { this.prey.beingWrapped = false; this.prey = null; }
    this.mode = 'stun';
    this.stun = sec;
    this.order = null; this.path = null;
    if (!this.supportAlive()) this.regrab();
  }

  // ------------------------------------------------------------ legs
  updateLegs(dt, moving) {
    const web = this.g.web;
    const c = Math.cos(this.heading), s = Math.sin(this.heading);
    const reach = FEMUR + TIBIA;
    const wrap = this.mode === 'wrap';
    const stun = this.mode === 'stun';
    const curl = stun ? 0.45 : this.hidden ? 0.3 : 1;
    let groupSteps = 0;
    // only threads near the body can carry a foot: gather them once per frame
    const R = (FEMUR + TIBIA) * 1.6;
    const near = [];
    for (const l of web.L) {
      if (!l.alive) continue;
      if (Math.max(l.a.x, l.b.x) < this.x - R || Math.min(l.a.x, l.b.x) > this.x + R) continue;
      if (Math.max(l.a.y, l.b.y) < this.y - R || Math.min(l.a.y, l.b.y) > this.y + R) continue;
      near.push(l);
    }
    for (const L of this.legs) {
      const [f, sd] = REST[L.i];
      const fx = f * (wrap ? 0.6 : 1) * curl, sx = sd * L.side * -1 * (wrap ? 0.7 : 1) * curl;
      // body frame: forward = heading, side = perpendicular (left negative)
      let tx = this.x + c * fx - s * sx;
      let ty = this.y + s * fx + c * sx;
      // lead the step when moving
      if (moving) { tx += c * 10; ty += s * 10; }
      // plant on the nearest thread or surface
      let attach = null;
      if (!stun && !this.hidden && this.mode !== 'descend') {
        const nl = web.nearestLink(tx, ty, 22, false, near);
        if (nl) { attach = nl; tx = lerp(nl.link.a.x, nl.link.b.x, nl.t); ty = lerp(nl.link.a.y, nl.link.b.y, nl.t); }
      }
      L.tx = tx; L.ty = ty;
      // follow the thread the foot stands on
      if (L.attach && L.step >= 1) {
        if (L.attach.link.alive) { L.fx = lerp(L.attach.link.a.x, L.attach.link.b.x, L.attach.t); L.fy = lerp(L.attach.link.a.y, L.attach.link.b.y, L.attach.t); }
        else L.attach = null;
      }
      if (L.step < 1) {
        L.step = Math.min(1, L.step + dt * (moving ? 11 : 7));
        const e = L.step;
        L.fx = lerp(L.sx, L.tx, e); L.fy = lerp(L.sy, L.ty, e);
        // arc outward during the swing (reads as a lifted foot)
        const lift = Math.sin(e * Math.PI) * 7;
        L.fx += -s * lift * -L.side; L.fy += c * lift * -L.side;
        if (L.step >= 1) L.attach = attach ? { link: attach.link, t: attach.t } : null;
        groupSteps++;
      }
      const far = dist(L.fx, L.fy, tx, ty);
      const hipX = this.x + c * 8, hipY = this.y + s * 8;
      const over = dist(hipX, hipY, L.fx, L.fy) > reach * 0.98;
      const thresh = wrap ? 6 : moving ? 16 : 26;
      if (L.step >= 1 && (far > thresh || over) && (L.group === this.gaitPhase || over || stun || wrap)) {
        L.sx = L.fx; L.sy = L.fy; L.step = 0;
      }
    }
    // alternate gait groups
    const pending = this.legs.some((L) => L.group === this.gaitPhase && L.step < 1);
    if (!pending) this.gaitPhase = 1 - this.gaitPhase;
    void groupSteps;
  }

  // ------------------------------------------------------------ draw
  draw(ctx, lamp, dawn) {
    if (this.hidden) {
      // peeking out of the curled leaf: two front leg tips and a glint of eyes
      const R = this.g.layout.retreat;
      const tw = Math.sin(this.time * 2.3) * 2;
      ctx.strokeStyle = '#1b120e'; ctx.lineWidth = 2.6 * S; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(R.x + 12, R.y + 14); ctx.lineTo(R.x + 26, R.y + 26 + tw); ctx.lineTo(R.x + 30, R.y + 40 + tw); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(R.x + 2, R.y + 18); ctx.lineTo(R.x + 8, R.y + 34 - tw); ctx.lineTo(R.x + 6, R.y + 48 - tw); ctx.stroke();
      ctx.fillStyle = 'rgba(255,230,190,0.8)';
      ctx.beginPath(); ctx.arc(R.x + 6, R.y + 12, 1.6, 0, TAU); ctx.arc(R.x + 11, R.y + 12, 1.6, 0, TAU); ctx.fill();
      return;
    }
    const c = Math.cos(this.heading), s = Math.sin(this.heading);
    const squash = 1 - this.crouch * 0.12;
    const stunJit = this.mode === 'stun' ? Math.sin(this.time * 60) * 1.2 : 0;
    const x = this.x + stunJit, y = this.y;
    // light direction for highlights
    let lx = lamp.x - x, ly = lamp.y - y;
    const ll = Math.hypot(lx, ly) || 1; lx /= ll; ly /= ll;
    const lampK = (1 - dawn) * clamp(1.2 - ll / 900, 0.15, 1);

    // dragline while descending / laying
    if (this.mode === 'descend' && this.dragline) {
      ctx.strokeStyle = 'rgba(230,225,215,0.55)'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(this.dragline.top.x, this.dragline.top.y); ctx.lineTo(x, y); ctx.stroke();
    }
    if (this.fallFrom) {
      ctx.strokeStyle = `rgba(230,225,215,${0.5 * (1 - this.fallFrom.t)})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(this.fallFrom.x, this.fallFrom.y); ctx.lineTo(x, y); ctx.stroke();
    }

    // soft shadow/occlusion behind the body (depth against bright background)
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath(); ctx.ellipse(x + 3, y + 5, 26 * S * this.abd, 20 * S * this.abd, this.heading, 0, TAU); ctx.fill();

    // legs
    const hipBase = [[10, 5.5], [6, 7], [2, 7.2], [-2, 6]].map(([f, s]) => [f * S, s * S]);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const L of this.legs) {
      const [hf, hs] = hipBase[L.i];
      const sx = hs * L.side * -1;
      const hx = x + c * hf - s * sx, hy = y + s * hf + c * sx;
      const knee = ik2(hx, hy, L.fx, L.fy, FEMUR, TIBIA, L.side * (L.i < 2 ? 1 : -1) * -1);
      // femur
      ctx.strokeStyle = '#1b120e'; ctx.lineWidth = 4.2 * S;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(knee.x, knee.y); ctx.stroke();
      ctx.lineWidth = 2.6 * S;
      ctx.beginPath(); ctx.moveTo(knee.x, knee.y); ctx.lineTo(L.fx, L.fy); ctx.stroke();
      // banded highlight on the lamp side
      ctx.strokeStyle = `rgba(255,200,140,${0.35 * lampK + 0.1})`; ctx.lineWidth = 1.2 * S;
      ctx.beginPath(); ctx.moveTo(lerp(hx, knee.x, 0.2), lerp(hy, knee.y, 0.2)); ctx.lineTo(lerp(hx, knee.x, 0.8), lerp(hy, knee.y, 0.8)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lerp(knee.x, L.fx, 0.15), lerp(knee.y, L.fy, 0.15)); ctx.lineTo(lerp(knee.x, L.fx, 0.55), lerp(knee.y, L.fy, 0.55)); ctx.stroke();
      // knee joint
      ctx.fillStyle = '#5b3b26';
      ctx.beginPath(); ctx.arc(knee.x, knee.y, 1.9 * S, 0, TAU); ctx.fill();
    }

    // abdomen (behind the head), the cross pattern of Araneus diadematus
    const ab = this.abd * squash;
    const ax = x - c * (13 + 8 * ab) * S, ay = y - s * (13 + 8 * ab) * S;
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(this.heading); ctx.scale(S, S);
    const rx = 17 * ab, ry = 14 * ab * (1 + this.crouch * 0.1);
    const ag = ctx.createRadialGradient(-rx * 0.1 + lx * 6, ly * 6, 1, 0, 0, rx * 1.2);
    ag.addColorStop(0, `rgb(${150 + 60 * lampK | 0},${96 + 40 * lampK | 0},${58 + 20 * lampK | 0})`);
    ag.addColorStop(0.55, '#5a3520');
    ag.addColorStop(1, '#22140c');
    ctx.fillStyle = ag;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill();
    // folium edges
    ctx.strokeStyle = 'rgba(30,16,8,0.55)'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) { const t = i / 6; ctx.lineTo(lerp(rx * 0.75, -rx * 0.85, t), (ry * 0.55) * (1 - t * 0.4) * (i % 2 ? 0.75 : 1)); }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) { const t = i / 6; ctx.lineTo(lerp(rx * 0.75, -rx * 0.85, t), -(ry * 0.55) * (1 - t * 0.4) * (i % 2 ? 0.75 : 1)); }
    ctx.stroke();
    // white cross dots
    ctx.fillStyle = 'rgba(250,240,220,0.9)';
    const dots = [[rx * 0.45, 0], [rx * 0.2, 0], [-rx * 0.05, 0], [-rx * 0.3, 0], [rx * 0.2, ry * 0.32], [rx * 0.2, -ry * 0.32], [rx * 0.6, 0]];
    for (const [dx, dy] of dots) { ctx.beginPath(); ctx.arc(dx, dy, 1.8 * ab, 0, TAU); ctx.fill(); }
    // specular glint toward the lamp
    const hx = lx * Math.cos(-this.heading) - ly * Math.sin(-this.heading), hy = lx * Math.sin(-this.heading) + ly * Math.cos(-this.heading);
    ctx.fillStyle = `rgba(255,236,200,${0.25 + 0.5 * lampK})`;
    ctx.beginPath(); ctx.ellipse(hx * rx * 0.5, hy * ry * 0.5, rx * 0.22, ry * 0.12, Math.atan2(hy, hx) + Math.PI / 2, 0, TAU); ctx.fill();
    ctx.restore();

    // cephalothorax
    ctx.save(); ctx.translate(x + c * 7 * S, y + s * 7 * S); ctx.rotate(this.heading); ctx.scale(S, S);
    const cg = ctx.createRadialGradient(lx * 2, ly * 2, 1, 0, 0, 11);
    cg.addColorStop(0, '#7a5034'); cg.addColorStop(1, '#24150d');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.ellipse(0, 0, 10.5, 8.5, 0, 0, TAU); ctx.fill();
    // pedipalps
    ctx.strokeStyle = '#24150d'; ctx.lineWidth = 2.2;
    const palp = Math.sin(this.time * 9) * (this.order || this.mode === 'wrap' ? 1.5 : 0.4);
    ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(15, -5 + palp); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, 3); ctx.lineTo(15, 5 - palp); ctx.stroke();
    // eyes
    ctx.fillStyle = `rgba(255,230,190,${0.5 + 0.5 * lampK})`;
    ctx.beginPath(); ctx.arc(8, -1.8, 1.1, 0, TAU); ctx.arc(8, 1.8, 1.1, 0, TAU); ctx.fill();
    ctx.restore();

    // stunned stars
    if (this.mode === 'stun') {
      ctx.fillStyle = 'rgba(255,240,170,0.9)';
      for (let i = 0; i < 3; i++) {
        const a = this.time * 5 + (i * TAU) / 3;
        ctx.beginPath(); ctx.arc(x + Math.cos(a) * 22, y - 26 + Math.sin(a) * 6, 2.2, 0, TAU); ctx.fill();
      }
    }
  }
}

// Two-bone IK in 2D (law of cosines). bend = +1/-1 picks the knee side.
export function ik2(hx, hy, fx, fy, a, b, bend) {
  let dx = fx - hx, dy = fy - hy;
  let d = Math.hypot(dx, dy);
  const maxD = a + b - 0.01;
  if (d > maxD) { dx *= maxD / d; dy *= maxD / d; d = maxD; }
  if (d < 1e-3) d = 1e-3;
  const base = Math.atan2(dy, dx);
  const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
  const ang = base + Math.acos(cosA) * bend;
  return { x: hx + Math.cos(ang) * a, y: hy + Math.sin(ang) * a };
}
