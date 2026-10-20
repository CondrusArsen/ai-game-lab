// Frame composition. Canvas2D, layered: baked painted layers + live silk, creatures, light.

import { paintBackground, paintProps, paintForeground, paintVignette, visibleBounds } from './scene.js';
import { clamp, lerp, TAU } from './util.js';

// The part of the world that must always be on screen (the playable porch corner).
const MUST = { x0: 70, y0: 128, x1: 900, y1: 1478 };

export class Renderer {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.layers = null;
    this.view = null;
    this.layout = null;
    this.glow = makeGlowSprite();
    this.quality = 1;
  }

  resize(layout) {
    this.layout = layout;
    const dprRaw = window.devicePixelRatio || 1;
    // a frame can report 0×0 before it is laid out (hidden tab, iframe not yet sized): use a phone-sized fallback,
    // the resize listener repaints once a real size arrives
    let cssW = window.innerWidth, cssH = window.innerHeight;
    if (!(cssW >= 160 && cssH >= 160)) { cssW = 360; cssH = 740; }
    let dpr = Math.min(dprRaw, 2);
    // keep the pixel budget sane on big/high-dpi screens
    const maxPx = 2.6e6;
    if (cssW * cssH * dpr * dpr > maxPx) dpr = Math.sqrt(maxPx / (cssW * cssH));
    const pw = Math.round(cssW * dpr), ph = Math.round(cssH * dpr);
    this.cv.width = pw; this.cv.height = ph;
    const mw = MUST.x1 - MUST.x0, mh = MUST.y1 - MUST.y0;
    const scale = Math.min(pw / mw, ph / mh);
    const ox = (pw - mw * scale) / 2 - MUST.x0 * scale;
    // on tall phones push the field a bit down so the HUD sits over the beam/sky, not over the web
    const spareY = ph - mh * scale;
    const oy = spareY * 0.58 - MUST.y0 * scale;
    this.view = { pw, ph, scale, ox, oy, dpr, cssW, cssH };
    this.lineW = Math.max(1.4, 1.4 * dpr / scale);
    this.layers = {
      bgNight: paintBackground(layout, this.view, 'night'),
      bgDawn: paintBackground(layout, this.view, 'dawn'),
      propsNight: paintProps(layout, this.view, 'night'),
      propsDawn: paintProps(layout, this.view, 'dawn'),
      fgNight: paintForeground(layout, this.view, 'night'),
      fgDawn: paintForeground(layout, this.view, 'dawn'),
      vignette: paintVignette(this.view),
    };
    // distant garden life: tiny fireflies far behind the web, and slow mist banks
    const b = visibleBounds(this.view);
    let s = layout.seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    this.ambient = [];
    for (let i = 0; i < 22; i++) this.ambient.push({ x: lerp(b.x0, b.x1, rnd()), y: lerp(720, 1380, rnd()), ph: rnd() * 10, sp: 0.4 + rnd() * 0.8, r: 0.6 + rnd() * 0.6 });
    this.mist = [];
    for (let i = 0; i < 5; i++) this.mist.push({ x: lerp(b.x0, b.x1, rnd()), y: lerp(950, 1350, rnd()), w: 380 + rnd() * 380, h: 60 + rnd() * 70, v: (rnd() - 0.5) * 14 });
  }

  drawAmbient(t, night) {
    const ctx = this.ctx;
    const b = visibleBounds(this.view);
    ctx.globalCompositeOperation = 'lighter';
    for (const m of this.mist) {
      let x = m.x + m.v * t;
      const span = b.x1 - b.x0 + m.w * 2;
      x = ((x - b.x0 + m.w) % span + span) % span + b.x0 - m.w;
      ctx.save(); ctx.translate(x, m.y); ctx.scale(m.w / 64, m.h / 64);
      ctx.globalAlpha = 0.05 * (0.4 + 0.6 * night);
      ctx.drawImage(this.tinted([120, 160, 190]), -64, -64, 128, 128);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    for (const f of this.ambient) {
      const p = (t * 0.45 + f.ph) % 3.2;
      const on = Math.max(0, 1 - Math.abs(p - 0.4) / 0.25);
      if (on <= 0.01) continue;
      const x = f.x + Math.sin(t * 0.3 * f.sp + f.ph) * 30, y = f.y + Math.cos(t * 0.23 * f.sp + f.ph) * 18;
      this.sprite(x, y, 16 * f.r, [200, 255, 120], on * 0.55 * night);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // screen (css px) -> world
  toWorld(cx, cy) {
    const v = this.view;
    return { x: (cx * v.dpr - v.ox) / v.scale, y: (cy * v.dpr - v.oy) / v.scale };
  }
  // world distance for a given css-pixel radius
  cssToWorld(px) { return (px * this.view.dpr) / this.view.scale; }
  bounds() { return visibleBounds(this.view); }

  draw(g) {
    const ctx = this.ctx, v = this.view, Ls = this.layers;
    const dawn = g.dawnMix || 0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    // shake
    const sh = g.shake ? g.shake() : { x: 0, y: 0 };
    ctx.drawImage(Ls.bgNight, sh.x * 0.5, sh.y * 0.5, v.pw, v.ph);
    if (dawn > 0) { ctx.globalAlpha = dawn; ctx.drawImage(Ls.bgDawn, sh.x * 0.5, sh.y * 0.5, v.pw, v.ph); ctx.globalAlpha = 1; }

    ctx.setTransform(v.scale, 0, 0, v.scale, v.ox + sh.x * 0.5, v.oy + sh.y * 0.5);
    this.drawAmbient(g.time || 0, 1 - dawn);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(Ls.propsNight, sh.x, sh.y);
    if (dawn > 0) { ctx.globalAlpha = dawn; ctx.drawImage(Ls.propsDawn, sh.x, sh.y); ctx.globalAlpha = 1; }

    ctx.setTransform(v.scale, 0, 0, v.scale, v.ox + sh.x, v.oy + sh.y);
    const lamp = this.layout.lamp;
    const lampOn = 1 - dawn;
    const flick = g.lampFlicker ?? 1;

    // lamp halo (additive), breathing with the flicker
    ctx.globalCompositeOperation = 'lighter';
    this.sprite(lamp.x, lamp.y + 4, 260 * (0.92 + 0.08 * flick), [255, 170, 80], 0.38 * lampOn * flick);
    this.sprite(lamp.x, lamp.y + 4, 90, [255, 230, 170], 0.55 * lampOn * flick);

    // silk
    this.drawSilk(g, lampOn * flick, dawn);
    ctx.globalCompositeOperation = 'source-over';

    if (g.drawWorld) g.drawWorld(ctx, this);

    // foreground leaves, then vignette
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(Ls.fgNight, sh.x * 1.4, sh.y * 1.4);
    if (dawn > 0) { ctx.globalAlpha = dawn; ctx.drawImage(Ls.fgDawn, sh.x * 1.4, sh.y * 1.4); ctx.globalAlpha = 1; }
    ctx.drawImage(Ls.vignette, 0, 0);
    if (g.drawOverlay) { ctx.setTransform(v.scale, 0, 0, v.scale, v.ox, v.oy); g.drawOverlay(ctx, this); }
  }

  sprite(x, y, r, col, a) {
    if (a <= 0.003) return;
    const ctx = this.ctx;
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.filter = 'none';
    // tinted glow sprite: draw white sprite then rely on 'lighter' with colored fill via cached tint
    const spr = this.tinted(col);
    ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  }

  tinted(col) {
    const key = col.join(',');
    this._tint = this._tint || new Map();
    let c = this._tint.get(key);
    if (!c) { c = makeGlowSprite(col); this._tint.set(key, c); }
    return c;
  }

  // Threads catch the light where they are perpendicular to the direction of the lamp:
  // the familiar halo of bright arcs around a light seen through a web.
  drawSilk(g, lampK, dawn) {
    const ctx = this.ctx;
    const web = g.web;
    const lamp = this.layout.lamp;
    const BINS = 9;
    const base = [], warm = [], cool = [], hot = [];
    for (let i = 0; i < BINS; i++) { base.push(new Path2D()); warm.push(new Path2D()); cool.push(new Path2D()); }
    const hotPath = new Path2D();
    const strongPath = new Path2D(); // frame silk reads a little thicker, like real dragline threads
    // moon direction (upper-left), and the dawn sun from the right
    const mdx = -0.55, mdy = -0.83;
    const sdx = 0.94, sdy = -0.34;
    let n = 0;
    for (const l of web.L) {
      if (!l.alive || !l.phys) continue;
      const ax = l.a.x, ay = l.a.y, bx = l.b.x, by = l.b.y;
      let dx = bx - ax, dy = by - ay;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl; dy /= dl;
      const mx = (ax + bx) * 0.5, my = (ay + by) * 0.5;
      let tx = lamp.x - mx, ty = lamp.y - my;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl; ty /= tl;
      const fall = 1 / (1 + (tl / 420) ** 2);
      const cosL = dx * tx + dy * ty;
      const gl = Math.min(1, Math.exp(-((cosL * 6) ** 2)) * (fall * 1.3 + 0.08) * lampK);
      const cosM = dx * mdx + dy * mdy;
      const gm = Math.exp(-((cosM * 4) ** 2)) * (0.28 + dawn * 0.0);
      const cosS = dx * sdx + dy * sdy;
      const gs = dawn * Math.exp(-((cosS * 3) ** 2)) * 0.9;
      const b = 0.2 + 0.3 * fall * lampK + 0.3 * dawn;
      const age = clamp((web.time - l.born) * 3, 0, 1); // fresh silk fades in
      const add = (arr, val) => {
        const k = Math.min(BINS - 1, Math.floor(clamp(val, 0, 0.999) * BINS));
        if (val < 0.03) return;
        arr[k].moveTo(ax, ay); arr[k].lineTo(bx, by);
      };
      add(base, b * age);
      add(warm, gl * age);
      add(cool, (gm + gs) * age);
      if (l.strain > 1.32) { hotPath.moveTo(ax, ay); hotPath.lineTo(bx, by); }
      if (l.strand && l.strand.strong) { strongPath.moveTo(ax, ay); strongPath.lineTo(bx, by); }
      n++;
    }
    ctx.lineCap = 'round';
    ctx.lineWidth = this.lineW * 2;
    ctx.strokeStyle = `rgba(214,212,222,${0.07 + 0.08 * dawn})`;
    ctx.stroke(strongPath);
    ctx.lineWidth = this.lineW;
    for (let i = 0; i < BINS; i++) {
      const a = (i + 0.5) / BINS;
      ctx.strokeStyle = `rgba(214,212,222,${a})`; ctx.stroke(base[i]);
      ctx.strokeStyle = `rgba(255,214,150,${a})`; ctx.stroke(warm[i]);
      ctx.strokeStyle = `rgba(190,214,255,${a})`; ctx.stroke(cool[i]);
    }
    // bright cores for strong lamp glints (gives the sparkle its "hot" center)
    ctx.lineWidth = this.lineW * 2.2;
    ctx.strokeStyle = 'rgba(255,190,110,0.16)';
    ctx.stroke(warm[BINS - 1]); ctx.stroke(warm[BINS - 2]);
    // overstretched threads warn in red before they snap
    ctx.lineWidth = this.lineW * 1.6;
    ctx.strokeStyle = 'rgba(255,90,60,0.55)';
    ctx.stroke(hotPath);
    this.silkCount = n;
  }
}

function makeGlowSprite(col = [255, 255, 255]) {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  const [r, gg, b] = col;
  g.addColorStop(0, `rgba(${r},${gg},${b},1)`);
  g.addColorStop(0.18, `rgba(${r},${gg},${b},0.55)`);
  g.addColorStop(0.45, `rgba(${r},${gg},${b},0.16)`);
  g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  return c;
}
