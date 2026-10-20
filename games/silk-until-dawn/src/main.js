// Boot: renderer, audio, HUD, optional platform hooks; the frame loop and the buttons.
import { Renderer } from './render.js';
import { AudioEngine } from './audio.js';
import { Hud } from './hud.js';
import { Platform } from './platform.js';
import { Game } from './game.js';

const $ = (id) => document.getElementById(id);
const canvas = $('view');
const R = new Renderer(canvas);
const audio = new AudioEngine();
const hud = new Hud();
const platform = new Platform();
const game = new Game(R, audio, hud, platform);

hud.title(game.best);
hud.setMuted(audio.muted);

// ---- loop
let last = performance.now();
let acc = 0;
const debug = /[?&]debug/.test(location.search);
const perf = { upd: 0, draw: 0, fps: 60, el: null };
if (debug) {
  perf.el = document.createElement('div');
  perf.el.style.cssText = 'position:fixed;left:6px;bottom:6px;font:11px monospace;color:#9f9;background:#000a;padding:3px 6px;z-index:9;pointer-events:none';
  document.body.appendChild(perf.el);
}
function frame(now) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1; // tab was asleep: don't fast-forward the night
  // fixed-ish step for stable silk physics
  acc += dt;
  const step = 1 / 60;
  let n = 0;
  const t0 = performance.now();
  while (acc >= step && n < 4 && !window.__botRunning) { game.update(step); acc -= step; n++; }
  if (n === 4) acc = 0;
  const t1 = performance.now();
  R.draw(game);
  if (debug) {
    const t2 = performance.now();
    perf.upd = perf.upd * 0.95 + (t1 - t0) * 0.05;
    perf.draw = perf.draw * 0.95 + (t2 - t1) * 0.05;
    perf.fps = perf.fps * 0.95 + (dt > 0 ? 1 / dt : 60) * 0.05;
    perf.el.textContent = `fps ${perf.fps.toFixed(0)} · update ${perf.upd.toFixed(1)}ms · draw ${perf.draw.toFixed(1)}ms · P ${game.web.P.length} L ${game.web.L.length} · bugs ${game.bugs.length}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---- resize (debounced; repaints the baked layers)
let rt = 0;
const relayout = () => { R.resize(game.layout); game.bounds = R.bounds(); };
addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(relayout, 120);
});
// iframes (e.g. inside the report or the platform) may get their size without a window resize event
if (window.ResizeObserver) {
  let lastW = innerWidth, lastH = innerHeight;
  new ResizeObserver(() => {
    if (innerWidth === lastW && innerHeight === lastH) return;
    lastW = innerWidth; lastH = innerHeight;
    clearTimeout(rt); rt = setTimeout(relayout, 120);
  }).observe(document.documentElement);
}

// ---- buttons
const begin = () => { audio.unlock(); audio.ui(); game.start(); };
$('btnStart').addEventListener('click', begin);
$('btnAgain').addEventListener('click', begin);
$('btnRestart').addEventListener('click', () => { hud.pause(false); begin(); });
$('btnPause').addEventListener('click', () => { audio.ui(); game.pause(true); });
$('btnResume').addEventListener('click', () => { audio.unlock(); game.pause(false); });
$('btnSound').addEventListener('click', () => {
  audio.unlock();
  audio.setMuted(!audio.muted);
  hud.setMuted(audio.muted);
});
addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') { audio.unlock(); audio.setMuted(!audio.muted); hud.setMuted(audio.muted); }
  if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') game.pause(game.state === 'play');
  if ((e.key === 'Enter' || e.key === ' ') && (game.state === 'title' || game.state === 'result')) begin();
});

// ---- tab hidden: pause the night and silence
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { game.pause(true); audio.suspend(); }
  else audio.resume();
});

// ---- bug.games hooks (no-op off-platform)
platform.onPause = () => { game.pause(true); audio.suspend(); };
platform.onResume = () => audio.resume();
platform.onMute = (m) => audio.setPlatformMuted(m);
platform.init().then(async (save) => {
  if (save) {
    const b = await platform.bestFromSave();
    if (b > game.best) { game.best = b; hud.title(game.best); }
  }
  platform.loaded();
});

window.__game = game; // handy for debugging and for the report's screenshot script
