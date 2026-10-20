// Boot, frame loop and input wiring.
import { GlassRenderer } from './gl.js';
import { Overlay } from './fx.js';
import { Sound } from './audio.js';
import { Hud } from './hud.js';
import { Platform } from './platform.js';
import { Game } from './game.js';

const $ = (id) => document.getElementById(id);
const hud = new Hud();
const platform = new Platform();
const sound = new Sound();
let renderer;
try {
  renderer = new GlassRenderer($('gl'));
} catch (err) {
  document.body.innerHTML = '<p style="color:#f3e7d3;font:16px system-ui;padding:24px;text-align:center">Этой игре нужен WebGL2. Попробуйте открыть её в свежем Chrome, Safari или Firefox.</p>';
  platform.init().then(() => { try { platform.bp?.failed('Нужен WebGL2'); } catch (e) { /* ignore */ } });
  throw err;
}
const overlay = new Overlay($('fx'));
const game = new Game({ renderer, overlay, sound, hud, platform });
hud.title(game.best);
hud.setMuted(sound.muted);
window.__game = game;

// ---------------------------------------------------------------- loop
let last = performance.now(), acc = 0;
// adaptive resolution: if a phone cannot hold ~45 fps for two seconds, render fewer pixels (2x → 1.5x → 1x)
let slowT = 0, okT = 0;
function adapt(dt) {
  if (document.hidden || window.__frozen || dt > 0.25) return;
  if (dt > 1 / 45) slowT += dt; else okT += dt;
  if (slowT + okT < 2) return;
  const cap = game.dprCap || 2;
  if (slowT > 1.2 && cap > 1 && (window.devicePixelRatio || 1) > 1) { game.dprCap = cap - 0.5; relayout(); }
  slowT = okT = 0;
}
function frame(now) {
  requestAnimationFrame(frame);   // first: a thrown error in one frame must not stop the game
  let dt = (now - last) / 1000; last = now;
  adapt(dt);
  if (dt > 0.1) dt = 0.1;
  acc += dt;
  let n = 0;
  while (acc >= 1 / 60 && n < 4 && !window.__frozen) { game.update(1 / 60); acc -= 1 / 60; n++; }
  if (n === 4) acc = 0;
  game.draw();
}
requestAnimationFrame(frame);

// ---------------------------------------------------------------- resize
let rt = 0;
const relayout = () => game.layoutFor(window.innerWidth, window.innerHeight);
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayout, 100); });
if (window.ResizeObserver) {
  let lw = innerWidth, lh = innerHeight;
  new ResizeObserver(() => { if (innerWidth !== lw || innerHeight !== lh) { lw = innerWidth; lh = innerHeight; clearTimeout(rt); rt = setTimeout(relayout, 100); } }).observe(document.documentElement);
}

// ---------------------------------------------------------------- input: the work area
const cv = $('gl');
const pt = (e) => ({ id: e.pointerId, x: e.clientX, y: e.clientY });
cv.addEventListener('pointerdown', (e) => { try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } game.onPointerDown(pt(e)); });
cv.addEventListener('pointermove', (e) => game.onPointerMove(pt(e)));
cv.addEventListener('pointerup', (e) => { sound.unlock(); game.onPointerUp(pt(e)); });
cv.addEventListener('pointercancel', (e) => game.onPointerUp(pt(e)));
cv.addEventListener('wheel', (e) => { game.spinBy(e.deltaY * 0.004); e.preventDefault(); }, { passive: false });
// iOS: keep the page from scrolling / pulling to refresh
document.addEventListener('touchmove', (e) => { if (e.target === cv) e.preventDefault(); }, { passive: false });

// hold buttons
function holdButton(el, set) {
  const on = (e) => { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } el.classList.add('on'); set(true); };
  const off = () => { el.classList.remove('on'); set(false); };
  el.addEventListener('pointerdown', on);
  el.addEventListener('pointerup', () => { sound.unlock(); off(); });
  el.addEventListener('pointercancel', off);
  el.addEventListener('lostpointercapture', off);
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
holdButton($('btnBlow'), (v) => game.setBlow(v));
holdButton($('btnHeat'), (v) => game.setHeat(v));

const click = (id, fn) => $(id).addEventListener('click', () => { sound.unlock(); sound.ui(); fn(); });
click('btnDone', () => game.finishPiece());
click('btnNext', () => game.nextOrder());
click('btnStart', () => game.startDay());
click('btnAgain', () => game.startDay());
click('btnPause', () => game.pause(true));
click('btnResume', () => game.pause(false));
click('btnRestart', () => { hud.pause(false); game.startDay(); });
$('btnSound').addEventListener('click', () => { sound.unlock(); sound.setMuted(!sound.muted); hud.setMuted(sound.muted); });

// keyboard (desktop)
addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (k === ' ' || k === 'b' || k === 'и') { e.preventDefault(); sound.unlock(); game.setBlow(true); }
  if (k === 'f' || k === 'а') { sound.unlock(); game.setHeat(true); }
  if (k === 'arrowup') game.spinBy(-1);
  if (k === 'arrowdown') game.spinBy(1);
  if (k === 'enter') { sound.unlock(); if (game.state === 'work') game.finishPiece(); else if (game.state === 'verdict') game.nextOrder(); else if (game.state === 'title' || game.state === 'result') game.startDay(); }
  if (k === 'm' || k === 'ь') { sound.unlock(); sound.setMuted(!sound.muted); hud.setMuted(sound.muted); }
  if (k === 'escape' || k === 'p' || k === 'з') game.pause(game.state !== 'paused');
});
addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  if (k === ' ' || k === 'b' || k === 'и') game.setBlow(false);
  if (k === 'f' || k === 'а') game.setHeat(false);
});

// tab hidden: pause and silence
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { game.pause(true); sound.suspend(); } else sound.resume();
});

// bug.games hooks (no-op off-platform)
platform.onPause = () => { game.pause(true); sound.suspend(); };
platform.onResume = () => sound.resume();
platform.onMute = (m) => sound.setPlatformMuted(m);
platform.init().then(async (save) => {
  if (save) { const b = await platform.bestFromSave(); if (b > game.best) { game.best = b; if (game.state === 'title') hud.title(b); } }
  platform.loaded();
});
