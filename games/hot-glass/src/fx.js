// Overlay layer (Canvas2D on top of the WebGL glass): target outline, tools, sparks, shards, floating words.

import { M } from './orders.js';

export class Overlay {
  constructor(canvas) {
    this.cv = canvas;
    this.g = canvas.getContext('2d');
    this.parts = [];
    this.words = [];
    this.trauma = 0;
    this.t = 0;
    this.reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  resize(w, h, dpr) {
    this.dpr = dpr;
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
    this.w = w; this.h = h;
  }

  shake(k) { if (!this.reduced) this.trauma = Math.min(1, this.trauma + k); }
  offset() {
    const t = this.trauma * this.trauma;
    if (t < 0.002) return { x: 0, y: 0 };
    const m = Math.min(this.w, this.h) * 0.02 * t;
    return { x: Math.sin(this.t * 61) * m, y: Math.cos(this.t * 47) * m * 0.7 };
  }

  spark(x, y, n, o = {}) {
    for (let i = 0; i < n; i++) {
      const a = (o.dir ?? -Math.PI / 2) + (Math.random() - 0.5) * (o.spread ?? 1.4);
      const v = (o.speed ?? 160) * (0.4 + Math.random() * 0.8);
      this.parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: (o.life ?? 0.8) * (0.6 + Math.random() * 0.6), age: 0,
        size: (o.size ?? 2) * (0.6 + Math.random() * 0.8), col: o.col ?? [255, 190, 90], g: o.g ?? 260, kind: o.kind ?? 'spark',
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 18,
      });
    }
  }

  word(x, y, s, col = '#ffd27a', size = 22) { this.words.push({ x, y, s, col, size, age: 0, life: 1.4 }); }

  update(dt) {
    this.t += dt;
    this.trauma = Math.max(0, this.trauma - dt * 1.5);
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.age += dt;
      if (p.age > p.life) { this.parts.splice(i, 1); continue; }
      p.vy += p.g * dt; p.vx *= Math.exp(-0.8 * dt);
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (let i = this.words.length - 1; i >= 0; i--) { const w = this.words[i]; w.age += dt; w.y -= 26 * dt; if (w.age > w.life) this.words.splice(i, 1); }
  }

  // s: { L, x0, scale, gather, target, ghostK (0..1 draw-in), jaws:{x,r}|null, hand:{...}|null, puff }
  draw(s) {
    const g = this.g;
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    g.clearRect(0, 0, this.w, this.h);
    const k = s.scale;
    const ay = s.axisY;
    // target outline: a dashed silhouette over the glass (top and bottom curves), drawn in as the order arrives
    if (s.target && s.ghostK > 0) {
      const n = Math.max(2, Math.floor(M * s.ghostK));
      g.save();
      g.lineWidth = 2;
      g.setLineDash([6, 6]);
      g.lineDashOffset = -this.t * 18;
      g.strokeStyle = s.good ? 'rgba(170,240,170,0.95)' : 'rgba(255,248,235,0.85)';
      g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 4;
      for (const sgn of [-1, 1]) {
        g.beginPath();
        for (let i = 0; i < n; i++) {
          const x = s.x0 + (i / (M - 1)) * s.tlen * k;
          const y = ay + sgn * s.target[i] * k;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.stroke();
      }
      // close the tip
      if (n === M) { const xe = s.x0 + s.tlen * k; g.beginPath(); g.moveTo(xe, ay - s.target[M - 1] * k); g.lineTo(xe, ay + s.target[M - 1] * k); g.stroke(); }
      g.restore();
    }
    // jacks (tweezers) squeezing where the finger is
    if (s.jaws) {
      const { x, r } = s.jaws;
      g.save();
      g.strokeStyle = '#c9ccd2'; g.lineWidth = 5; g.lineCap = 'round';
      for (const sgn of [-1, 1]) {
        g.beginPath(); g.moveTo(x - 4, ay + sgn * (r + 70)); g.lineTo(x, ay + sgn * (r + 2)); g.stroke();
      }
      g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 1.5;
      for (const sgn of [-1, 1]) { g.beginPath(); g.moveTo(x - 6, ay + sgn * (r + 68)); g.lineTo(x - 2, ay + sgn * (r + 4)); g.stroke(); }
      g.restore();
    }
    // the blowpipe's wooden grip at the left edge turns with the pipe: shows spin even when the glass is cold
    if (s.gather) {
      // a wooden grip on the pipe, a fixed distance from the glass, rolling with it
      const gEnd = s.x0 - this.w * 0.42, gStart = gEnd - this.w * 0.5, gr = 8;
      if (gEnd > 0) {
        const a = Math.max(0, gStart);
        g.save();
        g.fillStyle = '#6a4a2c';
        g.fillRect(a, ay - gr, gEnd - a, gr * 2);
        g.beginPath(); g.rect(a, ay - gr, gEnd - a, gr * 2); g.clip();
        g.fillStyle = 'rgba(0,0,0,0.35)';
        const step = 14;
        const off = ((s.gather.angle * 22) % step + step) % step;
        for (let x = gStart - step + off; x < gEnd; x += step) g.fillRect(x, ay - gr, 4, gr * 2);
        g.fillStyle = 'rgba(255,230,190,0.25)'; g.fillRect(a, ay - gr + 2, gEnd - a, 3);
        g.restore();
      }
    }
    // breath puffs at the mouthpiece
    for (const p of this.parts) {
      const a = 1 - p.age / p.life;
      if (p.kind === 'shard') {
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
        g.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${0.75 * a})`;
        g.beginPath(); g.moveTo(-p.size, -p.size * 0.4); g.lineTo(p.size, 0); g.lineTo(-p.size * 0.3, p.size * 0.6); g.closePath(); g.fill();
        g.strokeStyle = `rgba(255,255,255,${0.7 * a})`; g.lineWidth = 1; g.stroke();
        g.restore();
      } else if (p.kind === 'smoke') {
        g.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${0.12 * a})`;
        g.beginPath(); g.arc(p.x, p.y, p.size * (1.5 - a), 0, Math.PI * 2); g.fill();
      } else {
        g.globalCompositeOperation = 'lighter';
        g.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
        g.beginPath(); g.arc(p.x, p.y, p.size * (0.4 + 0.6 * a), 0, Math.PI * 2); g.fill();
        g.globalCompositeOperation = 'source-over';
      }
    }
    for (const w of this.words) {
      const k2 = w.age / w.life;
      const a = k2 < 0.12 ? k2 / 0.12 : 1 - Math.max(0, (k2 - 0.6) / 0.4);
      g.globalAlpha = a;
      g.font = `600 ${w.size}px 'Iowan Old Style', Georgia, serif`;
      g.textAlign = 'center';
      g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillText(w.s, w.x + 1, w.y + 2);
      g.fillStyle = w.col; g.fillText(w.s, w.x, w.y);
      g.globalAlpha = 1;
    }
    // animated hint hand (swipe up/down to turn, or touch the glass for the tweezers)
    if (s.hand) {
      const h = s.hand;
      const t = (this.t % 1.6) / 1.6;
      let x = h.x, y = h.y;
      if (h.kind === 'swipe') y = h.y + Math.sin(t * Math.PI * 2) * 46;
      if (h.kind === 'press') { x = h.x; y = h.y + (1 - Math.min(1, t * 2)) * 30; }
      g.save();
      g.globalAlpha = 0.85;
      g.fillStyle = 'rgba(255,248,235,0.9)';
      g.beginPath(); g.arc(x, y, 16, 0, Math.PI * 2); g.fill();
      g.strokeStyle = 'rgba(255,210,122,0.9)'; g.lineWidth = 2;
      g.beginPath(); g.arc(x, y, 24 + 6 * Math.sin(this.t * 6), 0, Math.PI * 2); g.stroke();
      if (h.kind === 'swipe') {
        g.strokeStyle = 'rgba(255,248,235,0.55)'; g.setLineDash([4, 6]); g.lineWidth = 2;
        g.beginPath(); g.moveTo(h.x, h.y - 52); g.lineTo(h.x, h.y + 52); g.stroke();
      }
      g.restore();
    }
  }
}
