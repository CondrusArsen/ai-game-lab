// Small effects: motes, dust, floating numbers, rings, rain, wind leaves; plus trauma-based shake.

import { TAU, clamp, lerp, noise1 } from './util.js';

export class FX {
  constructor() {
    this.parts = [];
    this.texts = [];
    this.rings = [];
    this.trauma = 0;
    this.n1 = noise1(5);
    this.n2 = noise1(9);
    this.t = 0;
    this.reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  add(p) { if (this.parts.length < 700) this.parts.push(p); }

  burst(x, y, n, opt = {}) {
    for (let i = 0; i < n; i++) {
      const a = opt.angle != null ? opt.angle + (Math.random() - 0.5) * (opt.spread ?? TAU) : Math.random() * TAU;
      const sp = (opt.speed ?? 80) * (0.3 + Math.random() * 0.9);
      this.add({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: (opt.life ?? 0.7) * (0.6 + Math.random() * 0.6), age: 0,
        size: (opt.size ?? 2) * (0.6 + Math.random() * 0.8), col: opt.col ?? [255, 230, 190], g: opt.g ?? 30, drag: opt.drag ?? 1.5,
        add: opt.add ?? true, kind: opt.kind ?? 'dot',
      });
    }
  }

  text(x, y, s, col = '#ffd59a', big = false) { this.texts.push({ x, y, s, col, age: 0, life: 1.3, big }); }
  ring(x, y, col = [255, 220, 160], r0 = 8, r1 = 46, life = 0.5) { this.rings.push({ x, y, col, r0, r1, age: 0, life }); }

  shake(k) { if (!this.reduced) this.trauma = clamp(this.trauma + k, 0, 1); }
  offset(scalePx) {
    const t = this.trauma * this.trauma;
    if (t < 0.001) return { x: 0, y: 0 };
    const m = scalePx * 0.012 * t;
    return { x: this.n1(this.t * 22) * m, y: this.n2(this.t * 22 + 50) * m };
  }

  update(dt, wind) {
    this.t += dt;
    this.trauma = Math.max(0, this.trauma - dt * 0.9);
    const P = this.parts;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.age += dt;
      if (p.age >= p.life) { P.splice(i, 1); continue; }
      const w = wind ? wind(p.x, p.y) : { x: 0, y: 0 };
      p.vx += (w.x * (p.kind === 'leaf' ? 1.2 : 0.4)) * dt;
      p.vy += (p.g + w.y * 0.4) * dt;
      p.vx *= Math.exp(-p.drag * dt); p.vy *= Math.exp(-p.drag * dt);
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.kind === 'leaf') p.rot = (p.rot || 0) + dt * (p.spin || 3);
    }
    for (let i = this.texts.length - 1; i >= 0; i--) { const t = this.texts[i]; t.age += dt; t.y -= dt * 34; if (t.age > t.life) this.texts.splice(i, 1); }
    for (let i = this.rings.length - 1; i >= 0; i--) { const r = this.rings[i]; r.age += dt; if (r.age > r.life) this.rings.splice(i, 1); }
  }

  draw(ctx) {
    for (const p of this.parts) {
      const k = 1 - p.age / p.life;
      if (p.kind === 'leaf') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot || 0);
        ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${Math.min(1, k * 2)})`;
        ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, TAU); ctx.fill();
        ctx.restore();
        continue;
      }
      if (p.kind === 'drop') {
        ctx.strokeStyle = `rgba(190,210,240,${0.45 * k})`; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02); ctx.stroke();
        continue;
      }
      ctx.globalCompositeOperation = p.add ? 'lighter' : 'source-over';
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${k})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.5 + 0.5 * k), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const r of this.rings) {
      const k = r.age / r.life;
      ctx.strokeStyle = `rgba(${r.col[0]},${r.col[1]},${r.col[2]},${(1 - k) * 0.8})`;
      ctx.lineWidth = 2.5 * (1 - k) + 0.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, lerp(r.r0, r.r1, 1 - Math.pow(1 - k, 3)), 0, TAU); ctx.stroke();
    }
    for (const t of this.texts) {
      const k = t.age / t.life;
      const a = k < 0.15 ? k / 0.15 : 1 - Math.max(0, (k - 0.6) / 0.4);
      ctx.font = `600 ${t.big ? 34 : 26}px Georgia, 'Palatino Linotype', serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0,0,0,${0.55 * a})`;
      ctx.fillText(t.s, t.x + 1.5, t.y + 2);
      ctx.globalAlpha = a;
      ctx.fillStyle = t.col;
      ctx.fillText(t.s, t.x, t.y);
      ctx.globalAlpha = 1;
    }
  }
}
