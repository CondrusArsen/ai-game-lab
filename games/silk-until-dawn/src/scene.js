// The set: a porch corner at night. Portrait playfield 900x1600 (world units).
// Static surfaces (things silk can be glued to and the spider can walk on) + baked painted layers.

import { rng, noise2, fbm2, lerp, clamp, TAU, segT } from './util.js';

export const FIELD = { w: 900, h: 1600 };

// ---------- layout ----------
export function makeLayout(seed) {
  const r = rng(seed);
  const lamp = { x: 640, y: 300, r: 26 };
  const surfaces = [];
  // eave beam along the top (its lower edge is the glue line)
  surfaces.push({ kind: 'beam', pts: [[-600, 196], [1500, 196]], r: 8, solid: { x0: -600, y0: 40, x1: 1500, y1: 196 } });
  // porch post on the left (glue line = its right face)
  surfaces.push({ kind: 'post', pts: [[96, 196], [96, 1480]], r: 8, solid: { x0: 4, y0: 196, x1: 96, y1: 2000 } });
  // railing at the bottom (glue line = top face)
  surfaces.push({ kind: 'rail', pts: [[96, 1392], [1500, 1392]], r: 8, solid: { x0: 96, y0: 1392, x1: 1500, y1: 1450 } });
  // the rose's main cane climbs the right side from the railing to the beam;
  // side stems branch off it to the left (so every surface is connected for the spider)
  const caneX = lerp(846, 868, r());
  const cane = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    cane.push([caneX + Math.sin(t * 7.1 + r()) * 9 + (t - 0.5) * 14, lerp(1396, 190, t)]);
  }
  surfaces.push({ kind: 'cane', pts: cane, r: 10 });
  const caneXAt = (y) => {
    for (let i = 0; i < cane.length - 1; i++) if (y <= cane[i][1] && y >= cane[i + 1][1]) return lerp(cane[i][0], cane[i + 1][0], (cane[i][1] - y) / (cane[i][1] - cane[i + 1][1]));
    return caneX;
  };
  const stems = [];
  const stemDefs = [
    { y: lerp(470, 560, r()), len: lerp(300, 380, r()), droop: lerp(-60, 40, r()) },
    { y: lerp(860, 960, r()), len: lerp(330, 420, r()), droop: lerp(-80, 10, r()) },
    { y: lerp(1180, 1260, r()), len: lerp(240, 310, r()), droop: lerp(-90, -30, r()) },
  ];
  for (const d of stemDefs) {
    const pts = [];
    const n = 8;
    const x0 = caneXAt(d.y), x1 = x0 - d.len;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = lerp(x0, x1, t);
      const y = d.y + d.droop * t * t + Math.sin(t * 5.2 + r() * 0.6) * 10 * t;
      pts.push([x, y]);
    }
    const radius = 7;
    surfaces.push({ kind: 'stem', pts, r: radius, taper: true });
    stems.push({ pts, radius });
  }
  // a twig hanging from the beam near the left-middle (gives an inner anchor)
  const tx = lerp(330, 420, r());
  const twig = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    twig.push([tx + Math.sin(t * 3) * 18 + t * 30, 196 + t * lerp(170, 230, r())]);
  }
  surfaces.push({ kind: 'twig', pts: twig, r: 4, taper: true });

  // walkable nodes along each surface glue line
  for (const s of surfaces) {
    s.len = 0;
    for (let i = 0; i < s.pts.length - 1; i++) s.len += Math.hypot(s.pts[i + 1][0] - s.pts[i][0], s.pts[i + 1][1] - s.pts[i][1]);
  }
  // retreat: a curled dry leaf tucked under the beam, top-left
  const retreat = { x: 168, y: 214, r: 34 };
  return { seed, lamp, surfaces, stems, retreat, twig };
}

// Nearest point on any surface glue line.
export function nearestSurface(layout, x, y) {
  let best = null, bd = Infinity;
  for (const s of layout.surfaces) {
    for (let i = 0; i < s.pts.length - 1; i++) {
      const [ax, ay] = s.pts[i], [bx, by] = s.pts[i + 1];
      const t = segT(x, y, ax, ay, bx, by);
      const px = ax + (bx - ax) * t, py = ay + (by - ay) * t;
      const d = Math.hypot(px - x, py - y);
      if (d < bd) { bd = d; best = { s, x: px, y: py, d, seg: i, t }; }
    }
  }
  return best;
}

// Is the point inside opaque scenery (beam/post/rail)? Bugs bounce off, threads cannot pass.
export function insideSolid(layout, x, y) {
  for (const s of layout.surfaces) {
    const b = s.solid;
    if (b && x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return true;
  }
  return false;
}

// ---------- painting ----------
// view: { scale, ox, oy, pw, ph }  (world -> pixel: px = ox + x*scale)

const PAL = {
  skyTop: [8, 14, 30], skyMid: [16, 32, 52], skyLow: [28, 52, 66],
  far: [18, 38, 52], mid: [12, 26, 34], near: [8, 16, 20],
  lampCore: [255, 236, 190], lampWarm: [255, 170, 90],
  woodDark: [34, 22, 16], woodMid: [70, 44, 28], woodLit: [150, 96, 54],
};

function rgb(c, a = 1) { return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`; }

function setWorld(ctx, view, k = 1) {
  ctx.setTransform(view.scale * k, 0, 0, view.scale * k, view.ox * k, view.oy * k);
}

// Background: sky, distant garden, lit window, bokeh. Painted at reduced resolution (it is meant to be soft).
export function paintBackground(layout, view, mood = 'night') {
  const k = 0.5;
  const cv = document.createElement('canvas');
  cv.width = Math.max(2, Math.ceil(view.pw * k));
  cv.height = Math.max(2, Math.ceil(view.ph * k));
  const ctx = cv.getContext('2d');
  const r = rng(layout.seed * 7 + (mood === 'dawn' ? 3 : 0));
  const n2 = noise2(layout.seed + 11);
  const vb = visibleBounds(view);
  const dawn = mood === 'dawn';

  // sky gradient in world space
  setWorld(ctx, view, k);
  const g = ctx.createLinearGradient(0, vb.y0, 0, vb.y1);
  if (!dawn) {
    g.addColorStop(0, rgb(PAL.skyTop)); g.addColorStop(0.45, rgb(PAL.skyMid)); g.addColorStop(1, rgb(PAL.skyLow));
  } else {
    g.addColorStop(0, 'rgb(58,78,120)'); g.addColorStop(0.45, 'rgb(170,140,150)'); g.addColorStop(0.75, 'rgb(246,184,132)'); g.addColorStop(1, 'rgb(255,214,160)');
  }
  ctx.fillStyle = g;
  ctx.fillRect(vb.x0 - 10, vb.y0 - 10, vb.x1 - vb.x0 + 20, vb.y1 - vb.y0 + 20);

  // stars / dawn haze
  if (!dawn) {
    for (let i = 0; i < 140; i++) {
      const x = lerp(vb.x0, vb.x1, r()), y = lerp(vb.y0, 700, r() * r());
      const a = 0.15 + r() * 0.5;
      ctx.fillStyle = `rgba(220,230,255,${a})`;
      ctx.beginPath(); ctx.arc(x, y, 0.8 + r() * 1.6, 0, TAU); ctx.fill();
    }
    // moon
    const mg = ctx.createRadialGradient(250, 420, 0, 250, 420, 260);
    mg.addColorStop(0, 'rgba(200,220,255,0.30)'); mg.addColorStop(0.2, 'rgba(160,190,240,0.10)'); mg.addColorStop(1, 'rgba(120,150,220,0)');
    ctx.fillStyle = mg; ctx.fillRect(-10, 160, 520, 520);
    ctx.fillStyle = 'rgba(230,238,255,0.85)';
    ctx.beginPath(); ctx.arc(250, 420, 30, 0, TAU); ctx.fill();
    ctx.fillStyle = rgb(PAL.skyMid, 0.55);
    ctx.beginPath(); ctx.arc(263, 412, 27, 0, TAU); ctx.fill();
  }

  // distant tree line: layered noisy silhouettes
  const layers = dawn
    ? [{ c: [120, 104, 120], y: 820, amp: 160, f: 0.004, a: 0.85 }, { c: [80, 70, 86], y: 980, amp: 140, f: 0.006, a: 0.9 }, { c: [46, 40, 52], y: 1150, amp: 120, f: 0.009, a: 0.95 }]
    : [{ c: PAL.far, y: 820, amp: 160, f: 0.004, a: 0.9 }, { c: PAL.mid, y: 980, amp: 140, f: 0.006, a: 0.95 }, { c: PAL.near, y: 1150, amp: 120, f: 0.009, a: 1 }];
  layers.forEach((L, li) => {
    ctx.fillStyle = rgb(L.c, L.a);
    ctx.beginPath();
    ctx.moveTo(vb.x0 - 20, vb.y1 + 20);
    for (let x = vb.x0 - 20; x <= vb.x1 + 20; x += 8) {
      const h = fbm2(n2, x * L.f, li * 7.3, 4) * L.amp * 2.2 + Math.sin(x * 0.0021 + li) * 40;
      ctx.lineTo(x, L.y - h);
    }
    ctx.lineTo(vb.x1 + 20, vb.y1 + 20);
    ctx.closePath();
    ctx.fill();
  });

  // lit window of the house, behind the post (warm rectangle with mullions, soft)
  if (!dawn) {
    const wx = -260, wy = 520, ww = 330, wh = 420;
    const wg = ctx.createRadialGradient(wx + ww * 0.6, wy + wh * 0.45, 20, wx + ww * 0.5, wy + wh * 0.5, 420);
    wg.addColorStop(0, 'rgba(255,190,110,0.30)'); wg.addColorStop(1, 'rgba(255,150,80,0)');
    ctx.fillStyle = wg; ctx.fillRect(wx - 300, wy - 300, ww + 600, wh + 600);
    // glass: warm, brighter toward a lamp inside, with a curtain and a pot on the sill
    const gg = ctx.createRadialGradient(wx + ww * 0.65, wy + wh * 0.35, 10, wx + ww * 0.5, wy + wh * 0.5, ww * 0.9);
    gg.addColorStop(0, 'rgba(255,214,150,0.62)'); gg.addColorStop(1, 'rgba(200,120,60,0.38)');
    ctx.fillStyle = gg;
    ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = 'rgba(120,50,30,0.45)';
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + ww * 0.34, wy); ctx.quadraticCurveTo(wx + ww * 0.2, wy + wh * 0.5, wx + ww * 0.3, wy + wh); ctx.lineTo(wx, wy + wh); ctx.fill();
    ctx.fillStyle = 'rgba(30,20,14,0.8)';
    ctx.beginPath(); ctx.moveTo(wx + ww * 0.6, wy + wh); ctx.lineTo(wx + ww * 0.64, wy + wh - 48); ctx.lineTo(wx + ww * 0.82, wy + wh - 48); ctx.lineTo(wx + ww * 0.86, wy + wh); ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(wx + ww * (0.66 + i * 0.04), wy + wh - 70 - (i % 2) * 18, 9, 26, -0.6 + i * 0.3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(40,24,16,0.88)';
    ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh);
    ctx.fillRect(wx, wy + wh / 2 - 6, ww, 12);
    ctx.fillRect(wx - 12, wy - 12, ww + 24, 14); ctx.fillRect(wx - 12, wy + wh - 2, ww + 24, 16);
    ctx.fillRect(wx - 12, wy - 12, 14, wh + 26); ctx.fillRect(wx + ww - 2, wy - 12, 14, wh + 26);
  }

  // bokeh: out-of-focus lit leaves and far lamps
  const lampX = layout.lamp.x, lampY = layout.lamp.y;
  for (let i = 0; i < 44; i++) {
    const x = lerp(vb.x0, vb.x1, r());
    const y = lerp(300, vb.y1, r());
    const rad = 8 + r() * r() * 46;
    const dl = Math.hypot(x - lampX, y - lampY);
    const warm = clamp(1 - dl / 800, 0, 1);
    const col = dawn ? [255, 230, 200] : [lerp(70, 255, warm), lerp(150, 180, warm), lerp(160, 90, warm)];
    const a = (dawn ? 0.08 : 0.035 + warm * 0.13) * (0.5 + r());
    const bg = ctx.createRadialGradient(x, y, rad * 0.55, x, y, rad);
    bg.addColorStop(0, rgb(col, a)); bg.addColorStop(0.85, rgb(col, a * 0.9)); bg.addColorStop(1, rgb(col, 0));
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
  }

  // lamp light pool in the air (big soft warm glow)
  if (!dawn) {
    const lg = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, 760);
    lg.addColorStop(0, 'rgba(255,190,110,0.42)');
    lg.addColorStop(0.25, 'rgba(255,150,80,0.16)');
    lg.addColorStop(1, 'rgba(255,120,60,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(lampX - 800, lampY - 800, 1600, 1600);
  }
  return cv;
}

export function visibleBounds(view) {
  // clamped: painting loops walk these bounds, so an absurd aspect ratio must not turn into millions of strokes
  return {
    x0: Math.max(-2600, -view.ox / view.scale), y0: Math.max(-1400, -view.oy / view.scale),
    x1: Math.min(3500, (view.pw - view.ox) / view.scale), y1: Math.min(3000, (view.ph - view.oy) / view.scale),
  };
}

// Foreground props: beam, lamp fixture, post, railing, rose stems with leaves. Full resolution, crisp.
export function paintProps(layout, view, mood = 'night') {
  const cv = document.createElement('canvas');
  cv.width = view.pw; cv.height = view.ph;
  const ctx = cv.getContext('2d');
  setWorld(ctx, view);
  const n2 = noise2(layout.seed + 23);
  const r = rng(layout.seed * 13 + 5);
  const vb = visibleBounds(view);
  const L = layout.lamp;
  const dawn = mood === 'dawn';

  const lightAt = (x, y) => (dawn ? 0.55 : clamp(1.15 - Math.hypot(x - L.x, y - L.y) / 900, 0.08, 1));

  // --- wooden planks helper: noisy grain stripes
  const wood = (x0, y0, x1, y1, horizontal) => {
    const step = 3;
    for (let y = y0; y < y1; y += step) {
      for (let x = x0; x < x1; x += 24) {
        const u = horizontal ? x : y, v = horizontal ? y : x;
        const grain = fbm2(n2, u * 0.004, v * 0.08, 3);
        const lit = lightAt(x, y);
        const base = lerp(0.25, 1, grain);
        const c = [
          lerp(PAL.woodDark[0], PAL.woodLit[0], base * lit),
          lerp(PAL.woodDark[1], PAL.woodLit[1], base * lit),
          lerp(PAL.woodDark[2], PAL.woodLit[2], base * lit),
        ];
        ctx.fillStyle = rgb(c);
        ctx.fillRect(x, y, 25, step + 0.6);
      }
    }
  };

  // beam (top)
  wood(vb.x0 - 10, Math.max(vb.y0 - 10, -200), vb.x1 + 10, 196, true);
  // beam underside warm light + edge
  const ug = ctx.createLinearGradient(0, 160, 0, 200);
  ug.addColorStop(0, 'rgba(0,0,0,0)'); ug.addColorStop(1, dawn ? 'rgba(255,220,180,0.25)' : 'rgba(255,170,90,0.45)');
  ctx.fillStyle = ug; ctx.fillRect(vb.x0 - 10, 160, vb.x1 - vb.x0 + 20, 36);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(vb.x0 - 10, 120, vb.x1 - vb.x0 + 20, 4);

  // rail (bottom), continuing behind the post on wide screens
  wood(vb.x0 - 10, 1392, vb.x1 + 10, 1450, true);
  ctx.fillStyle = dawn ? 'rgba(255,230,190,0.25)' : 'rgba(255,170,90,0.22)'; ctx.fillRect(vb.x0 - 10, 1392, vb.x1 - vb.x0 + 20, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(vb.x0 - 10, 1446, vb.x1 - vb.x0 + 20, 6);
  // balusters below the rail
  for (let x = 150 - Math.ceil((150 - vb.x0) / 110) * 110; x < vb.x1 + 40; x += 110) {
    if (x > -30 && x < 110) continue;
    const bg = ctx.createLinearGradient(x, 0, x + 34, 0);
    bg.addColorStop(0, 'rgba(30,20,14,1)'); bg.addColorStop(0.6, `rgba(${70 * lightAt(x, 1500) + 30 | 0},${46 * lightAt(x, 1500) + 20 | 0},30,1)`); bg.addColorStop(1, 'rgba(26,18,12,1)');
    ctx.fillStyle = bg; ctx.fillRect(x, 1450, 34, vb.y1 - 1450 + 20);
  }

  // post (left): a square porch post; on wide screens the garden continues behind it
  wood(4, 196, 96, vb.y1 + 10, false);
  const edge = ctx.createLinearGradient(4, 0, 22, 0);
  edge.addColorStop(0, 'rgba(0,0,0,0.6)'); edge.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = edge; ctx.fillRect(4, 196, 18, vb.y1 - 196 + 10);
  const pg = ctx.createLinearGradient(70, 0, 98, 0);
  pg.addColorStop(0, 'rgba(0,0,0,0)'); pg.addColorStop(1, dawn ? 'rgba(255,230,190,0.3)' : 'rgba(255,170,90,0.35)');
  ctx.fillStyle = pg; ctx.fillRect(70, 196, 28, vb.y1 - 196 + 10);
  // shadow cast by beam on post
  const sg = ctx.createLinearGradient(0, 196, 0, 260);
  sg.addColorStop(0, 'rgba(0,0,0,0.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sg; ctx.fillRect(vb.x0 - 10, 196, 106 - vb.x0, 64);

  // hanging lamp: chain + lantern
  ctx.strokeStyle = '#1a120c'; ctx.lineWidth = 3;
  for (let y = 196; y < L.y - 40; y += 12) { ctx.beginPath(); ctx.ellipse(L.x, y + 6, 3, 6, 0, 0, TAU); ctx.stroke(); }
  // cap
  ctx.fillStyle = '#20160f';
  ctx.beginPath(); ctx.moveTo(L.x - 40, L.y - 30); ctx.lineTo(L.x + 40, L.y - 30); ctx.lineTo(L.x + 20, L.y - 48); ctx.lineTo(L.x - 20, L.y - 48); ctx.closePath(); ctx.fill();
  // glass
  const gl = ctx.createRadialGradient(L.x, L.y, 2, L.x, L.y, 40);
  gl.addColorStop(0, dawn ? 'rgba(255,240,210,0.6)' : 'rgba(255,250,230,1)'); gl.addColorStop(0.5, dawn ? 'rgba(220,190,150,0.5)' : 'rgba(255,200,120,0.95)'); gl.addColorStop(1, dawn ? 'rgba(160,130,100,0.6)' : 'rgba(255,140,60,0.85)');
  ctx.fillStyle = gl;
  ctx.beginPath(); ctx.moveTo(L.x - 34, L.y - 30); ctx.lineTo(L.x + 34, L.y - 30); ctx.lineTo(L.x + 26, L.y + 34); ctx.lineTo(L.x - 26, L.y + 34); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1d140e'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(L.x, L.y - 30); ctx.lineTo(L.x, L.y + 34); ctx.stroke();
  ctx.fillStyle = '#20160f'; ctx.fillRect(L.x - 30, L.y + 32, 60, 8);

  // rose stems + leaves + thorns
  const leaf = (x, y, ang, size, lit) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    const lg = ctx.createLinearGradient(0, -size * 0.4, 0, size * 0.4);
    const c1 = dawn ? [70, 96, 60] : [lerp(14, 70, lit), lerp(30, 84, lit), lerp(22, 40, lit)];
    const c2 = dawn ? [36, 52, 34] : [lerp(8, 30, lit), lerp(16, 40, lit), lerp(14, 24, lit)];
    lg.addColorStop(0, rgb(c1)); lg.addColorStop(1, rgb(c2));
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(size * 0.3, -size * 0.42, size * 0.8, -size * 0.3, size, 0);
    ctx.bezierCurveTo(size * 0.8, size * 0.3, size * 0.3, size * 0.42, 0, 0);
    ctx.fill();
    // rim light toward the lamp
    ctx.strokeStyle = dawn ? 'rgba(255,230,190,0.35)' : `rgba(255,190,110,${0.15 + lit * 0.5})`;
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(size * 0.3, -size * 0.42, size * 0.8, -size * 0.3, size, 0); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(size * 0.05, 0); ctx.lineTo(size * 0.92, 0); ctx.stroke();
    ctx.restore();
  };
  const drawStem = (pts, radius, leaves = true) => {
    // stem body
    for (let pass = 0; pass < 2; pass++) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (let i = 0; i < pts.length - 1; i++) {
        const t = i / (pts.length - 1);
        const w = radius * 2 * lerp(1.15, 0.45, t);
        const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
        const lit = lightAt(ax, ay);
        ctx.strokeStyle = pass === 0 ? (dawn ? 'rgb(40,46,30)' : rgb([lerp(14, 50, lit), lerp(22, 52, lit), lerp(14, 26, lit)])) : (dawn ? 'rgba(255,230,190,0.35)' : `rgba(255,180,100,${0.1 + lit * 0.45})`);
        ctx.lineWidth = pass === 0 ? w : w * 0.25;
        ctx.beginPath();
        if (pass === 0) { ctx.moveTo(ax, ay); ctx.lineTo(bx, by); }
        else { ctx.moveTo(ax, ay - w * 0.3); ctx.lineTo(bx, by - w * 0.3); }
        ctx.stroke();
      }
    }
    // thorns
    for (let i = 1; i < pts.length - 1; i++) {
      if (r() < 0.45) continue;
      const [x, y] = pts[i];
      const s = r() < 0.5 ? -1 : 1;
      ctx.fillStyle = dawn ? 'rgb(60,50,34)' : 'rgb(38,30,20)';
      ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.lineTo(x + 1 + r() * 4, y + s * (9 + r() * 5)); ctx.closePath(); ctx.fill();
    }
    if (!leaves) return;
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i];
      const [px, py] = pts[i - 1];
      const dir = Math.atan2(y - py, x - px);
      const count = r() < 0.5 ? 1 : 2;
      for (let j = 0; j < count; j++) {
        const side = j === 0 ? 1 : -1;
        leaf(x, y, dir + side * lerp(0.6, 1.2, r()), lerp(30, 54, r()), lightAt(x, y));
      }
    }
  };
  for (const s of layout.surfaces) if (s.kind === 'cane') drawStem(s.pts, s.r * 0.8, true);
  for (const s of layout.surfaces) if (s.kind === 'stem') drawStem(s.pts, s.r);
  for (const s of layout.surfaces) if (s.kind === 'twig') drawStem(s.pts, s.r, false);

  // retreat: curled dry leaf under the beam
  const R = layout.retreat;
  ctx.save(); ctx.translate(R.x, R.y);
  const rg = ctx.createLinearGradient(-40, -10, 40, 30);
  rg.addColorStop(0, dawn ? 'rgb(150,110,70)' : 'rgb(120,74,40)'); rg.addColorStop(1, dawn ? 'rgb(90,60,36)' : 'rgb(52,32,18)');
  ctx.fillStyle = rg;
  ctx.beginPath(); ctx.ellipse(0, 6, 44, 24, -0.25, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(10,6,4,0.9)';
  ctx.beginPath(); ctx.ellipse(-4, 10, 26, 12, -0.25, 0, TAU); ctx.fill();
  ctx.strokeStyle = dawn ? 'rgba(255,230,190,0.4)' : 'rgba(255,180,100,0.45)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 6, 44, 24, -0.25, Math.PI * 1.05, Math.PI * 1.9); ctx.stroke();
  ctx.restore();
  // a few silk "frame" wisps from the retreat to the beam (decor)
  ctx.strokeStyle = 'rgba(230,220,200,0.25)'; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(R.x - 30 + i * 18, R.y - 6); ctx.lineTo(R.x - 40 + i * 25, 196); ctx.stroke(); }

  return cv;
}

// Out-of-focus big leaves at the very bottom, drawn in front of everything for depth.
export function paintForeground(layout, view, mood = 'night') {
  const cv = document.createElement('canvas');
  cv.width = view.pw; cv.height = view.ph;
  const ctx = cv.getContext('2d');
  setWorld(ctx, view);
  const r = rng(layout.seed * 17 + 9);
  const vb = visibleBounds(view);
  const dawn = mood === 'dawn';
  for (let i = 0; i < 7; i++) {
    const x = lerp(vb.x0, vb.x1, (i + r() * 0.6) / 7);
    const y = vb.y1 + 20;
    ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2 + lerp(-0.6, 0.6, r()));
    ctx.fillStyle = dawn ? 'rgba(30,40,30,0.95)' : 'rgba(4,8,8,0.96)';
    const s = lerp(150, 260, r());
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.bezierCurveTo(s * 0.3, -s * 0.3, s * 0.8, -s * 0.25, s, 0);
    ctx.bezierCurveTo(s * 0.8, s * 0.25, s * 0.3, s * 0.3, 0, 0); ctx.fill();
    ctx.restore();
  }
  return cv;
}

// Vignette + warm/cool grade, baked once per resize.
export function paintVignette(view) {
  const cv = document.createElement('canvas');
  cv.width = view.pw; cv.height = view.ph;
  const ctx = cv.getContext('2d');
  const cx = view.pw / 2, cy = view.ph / 2;
  const R = Math.hypot(cx, cy);
  const g = ctx.createRadialGradient(cx, cy * 0.9, R * 0.35, cx, cy, R * 1.05);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,10,0.62)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, view.pw, view.ph);
  return cv;
}
