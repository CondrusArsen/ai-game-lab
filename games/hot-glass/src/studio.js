// The hot shop, painted procedurally on a 2D canvas and uploaded as a texture.
// Layout is in CSS pixels of the current screen (portrait first); everything is derived from `L` (layout).

export function makeLayout(w, h) {
  const portrait = h >= w;
  const top = 64;                                   // HUD band
  const bottom = Math.min(190, h * 0.24);           // controls band
  const workH = h - top - bottom;
  const axisY = top + workH * (portrait ? 0.52 : 0.5);
  const pipeX = Math.round(w * (portrait ? 0.08 : 0.2));      // where the glass starts (end of the blowpipe)
  const furnaceX = w * (portrait ? 0.97 : 0.86);              // mouth of the glory hole
  // the widest piece (an opened bowl, ~270 sim units across) must fit the work band's height too
  const maxLen = Math.min(w * (portrait ? 0.7 : 0.5), workH * (portrait ? 1.2 : 0.85));
  const scale = maxLen / 300;                        // sim units (piece length 300) → css px
  return { w, h, portrait, top, bottom, axisY, pipeX, furnaceX, scale, workH };
}

// time of day 0..1 (morning → evening) changes the window light
export function skyAt(t) {
  const keys = [
    [0.0, [0.62, 0.74, 0.86], [0.96, 0.92, 0.84]],
    [0.5, [0.50, 0.70, 0.92], [1.0, 0.98, 0.92]],
    [0.85, [0.95, 0.66, 0.45], [1.0, 0.82, 0.58]],
    [1.0, [0.55, 0.40, 0.48], [0.98, 0.62, 0.42]],
  ];
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i][0] && t <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break; }
  const k = (t - a[0]) / Math.max(1e-6, b[0] - a[0]);
  const mix = (p, q) => p.map((v, i) => v + (q[i] - v) * k);
  return { sky: mix(a[1], b[1]), sun: mix(a[2], b[2]) };
}

const css = (c, a = 1) => `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;

function rnd(seed) { let s = seed >>> 0; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) + 0x9e3779b9 >>> 0) / 4294967296); }

// one finished piece standing on its bottom, neck up, as a soft tinted glass silhouette lit by the window
function drawPiece(g, p, cx, baseY, k, sun) {
  const prof = p.profile, n = prof.length;
  const maxR = Math.max(...prof);
  const pathOf = () => {
    g.beginPath();
    for (let j = 0; j < n; j++) g.lineTo(cx + prof[j] * k, baseY - (p.len - (j / (n - 1)) * p.len) * k);
    for (let j = n - 1; j >= 0; j--) g.lineTo(cx - prof[j] * k, baseY - (p.len - (j / (n - 1)) * p.len) * k);
    g.closePath();
  };
  g.save();
  pathOf();
  const gr = g.createLinearGradient(cx - maxR * k, 0, cx + maxR * k, 0);
  gr.addColorStop(0, css(p.tint.map((v) => v * 0.55), 0.85));
  gr.addColorStop(0.35, css(p.tint, 0.35));
  gr.addColorStop(0.7, css(p.tint.map((v) => v * 0.8), 0.45));
  gr.addColorStop(1, css(p.tint.map((v) => v * 0.45), 0.9));
  g.fillStyle = gr; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1; g.stroke();
  // window glint
  g.clip();
  g.fillStyle = css(sun, 0.7);
  g.fillRect(cx - maxR * k * 0.55, baseY - p.len * k, maxR * k * 0.12, p.len * k);
  g.restore();
  // its coloured light on the plank
  g.fillStyle = css(p.tint, 0.18);
  g.beginPath(); g.ellipse(cx, baseY + 4, maxR * k * 1.1, 4, 0, 0, Math.PI * 2); g.fill();
}

function plank(g, x, y, w, h) {
  g.fillStyle = '#6b4a2e'; g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(255,220,170,0.25)'; g.fillRect(x, y, w, 2);
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x, y + h, w, 7);
}

// Paint the studio. `shelf` = finished pieces to show on the shelf (drawn as soft glass silhouettes).
// showcase: the evening still life for the end of the day (the pieces large, against the window)
export function paintStudio(L, dpr, dayT, shelf = [], showcase = false) {
  const cv = document.createElement('canvas');
  cv.width = Math.max(2, Math.round(L.w * dpr));
  cv.height = Math.max(2, Math.round(L.h * dpr));
  const g = cv.getContext('2d');
  g.scale(dpr, dpr);
  const { w, h } = L;
  const r = rnd(7);
  const { sky, sun } = skyAt(dayT);

  // back wall: limewashed plaster, warm
  const wall = g.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, '#d9cbb4'); wall.addColorStop(0.6, '#bfae94'); wall.addColorStop(1, '#8c7a63');
  g.fillStyle = wall; g.fillRect(0, 0, w, h);
  // plaster mottling
  for (let i = 0; i < 260; i++) {
    const x = r() * w, y = r() * h, rad = 6 + r() * 40;
    g.fillStyle = `rgba(${r() < 0.5 ? '255,250,240' : '90,70,50'},${0.025 + r() * 0.03})`;
    g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }

  // big window behind the work: the light source the cold glass will refract and reflect
  const wx = w * 0.18, wy = L.top + 12, ww = w * 0.64, wh = L.workH * 0.62;
  const skyG = g.createLinearGradient(0, wy, 0, wy + wh);
  skyG.addColorStop(0, css(sky)); skyG.addColorStop(1, css(sky.map((v, i) => Math.min(1, v * 0.7 + sun[i] * 0.35))));
  g.fillStyle = skyG; g.fillRect(wx, wy, ww, wh);
  // distant roofs and a tree through the glass
  g.fillStyle = css(sky.map((v) => v * 0.62), 0.9);
  g.beginPath(); g.moveTo(wx, wy + wh);
  for (let x = 0; x <= ww; x += ww / 12) g.lineTo(wx + x, wy + wh * (0.78 - 0.08 * Math.sin(x * 0.05) - (Math.floor(x / (ww / 6)) % 2) * 0.06));
  g.lineTo(wx + ww, wy + wh); g.fill();
  g.fillStyle = css([0.3, 0.42, 0.3].map((v, i) => v * 0.6 + sky[i] * 0.4), 0.85);
  for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(wx + ww * 0.8 + Math.cos(i) * 26, wy + wh * 0.62 + Math.sin(i * 1.7) * 22, 26 + r() * 10, 0, Math.PI * 2); g.fill(); }
  // sun glow
  const sg = g.createRadialGradient(wx + ww * 0.75, wy + wh * 0.25, 4, wx + ww * 0.75, wy + wh * 0.25, ww * 0.6);
  sg.addColorStop(0, css(sun, 0.85)); sg.addColorStop(1, css(sun, 0));
  g.fillStyle = sg; g.fillRect(wx, wy, ww, wh);
  // mullions and frame
  g.fillStyle = '#5b4632';
  const bars = 3;
  for (let i = 1; i < bars; i++) g.fillRect(wx + (ww * i) / bars - 3, wy, 6, wh);
  g.fillRect(wx, wy + wh * 0.42 - 3, ww, 6);
  g.lineWidth = 12; g.strokeStyle = '#4a3828'; g.strokeRect(wx - 6, wy - 6, ww + 12, wh + 12);
  // light falling into the room
  const beam = g.createLinearGradient(wx, wy + wh, wx + ww * 0.3, h);
  beam.addColorStop(0, css(sun, 0.18)); beam.addColorStop(1, css(sun, 0));
  g.fillStyle = beam;
  g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx + ww, wy + wh); g.lineTo(wx + ww * 1.25, h); g.lineTo(wx - ww * 0.1, h); g.fill();

  // furnace on the right: brick face with the glowing glory hole
  const fx = L.furnaceX, fr = Math.min(64, L.workH * 0.11);
  g.save();
  g.fillStyle = '#6e4a36';
  const bw = 22, bh = 11;
  for (let y = L.axisY - fr * 3.2; y < L.axisY + fr * 3.6; y += bh) {
    const off = (Math.floor(y / bh) % 2) * bw * 0.5;
    for (let x = fx - fr * 1.6 - off; x < w + bw; x += bw) {
      const shade = 0.75 + r() * 0.35;
      g.fillStyle = `rgb(${Math.round(120 * shade)},${Math.round(70 * shade)},${Math.round(50 * shade)})`;
      g.fillRect(x + 1, y + 1, bw - 2, bh - 2);
    }
  }
  // soot and heat-darkening around the mouth
  const soot = g.createRadialGradient(fx, L.axisY, fr * 0.8, fx, L.axisY, fr * 3);
  soot.addColorStop(0, 'rgba(20,10,5,0.75)'); soot.addColorStop(1, 'rgba(20,10,5,0)');
  g.fillStyle = soot; g.beginPath(); g.arc(fx, L.axisY, fr * 3, 0, Math.PI * 2); g.fill();
  g.restore();

  // bench rails in front (where the pipe rolls)
  const ry = L.axisY + L.workH * 0.34;
  g.fillStyle = '#3d2c1e'; g.fillRect(0, ry, w, 10);
  g.fillStyle = '#7d6a55'; g.fillRect(0, ry, w, 3);
  // floor / bench shadow toward the bottom
  const fl = g.createLinearGradient(0, ry + 10, 0, h);
  fl.addColorStop(0, '#5a4a3a'); fl.addColorStop(1, '#2d241c');
  g.fillStyle = fl; g.fillRect(0, ry + 10, w, h - ry - 10);
  // vignette
  const vg = g.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.3, w / 2, h * 0.5, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,4,0.45)');
  g.fillStyle = vg; g.fillRect(0, 0, w, h);

  if (showcase) {
    // two staggered rows on a deep sill in front of the sunset window
    const back = [0, 2, 4], front = [1, 3];
    const yb = L.top + L.workH * 0.5, yf = yb + Math.min(34, L.workH * 0.06);
    const rMax = Math.min(w * 0.115, 66), hMax = L.workH * 0.3;
    plank(g, w * 0.04, yb, w * 0.92, 8);
    plank(g, w * 0.08, yf, w * 0.84, 10);
    const place = (idx, xs, y) => idx.forEach((pi, j) => {
      const p = shelf[pi]; if (!p) return;
      const k = Math.min(rMax / Math.max(...p.profile), hMax / p.len);
      drawPiece(g, p, w * xs[j], y, k, sun);
    });
    place(back, [0.2, 0.5, 0.8], yb);
    place(front, [0.35, 0.65], yf);
    return cv;
  }
  // the day's shelf: a plank above the controls where finished pieces stand, neck up
  const shelfY = ry + (h - L.bottom - ry) * 0.62;
  plank(g, w * 0.03, shelfY, w * 0.94, 9);
  const slotW = (w * 0.9) / 5;
  shelf.forEach((p, i) => {
    const k = Math.min(slotW * 0.42 / Math.max(...p.profile), ((shelfY - ry) * 0.85) / p.len);
    drawPiece(g, p, w * 0.05 + slotW * (i + 0.5), shelfY, k, sun);
  });
  // empty slots for the rest of the day
  for (let i = shelf.length; i < 5; i++) {
    const cx = w * 0.05 + slotW * (i + 0.5);
    g.strokeStyle = 'rgba(255,240,220,0.12)'; g.setLineDash([3, 4]); g.lineWidth = 1;
    g.beginPath(); g.ellipse(cx, shelfY - 2, slotW * 0.28, 3, 0, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
  }
  return cv;
}
