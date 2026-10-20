// One working day in the hot shop: five commissions, inputs → glass physics, verdicts, evening shelf.

import { Gather, N, SET, THIN } from './glass.js';
import { makeLayout, paintStudio, skyAt } from './studio.js';
import { makeDay, matchScore, finalScore, targetAt, M } from './orders.js';

const FINE = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;   // mouse + keyboard
const HINTS = {
  blow: 'Держи <b>«дуть»</b> — капля раздуется до контура',
  turn: FINE ? 'Стекло провисает — <b>тяни мышью вверх-вниз</b> (или колесо, ↑↓), чтобы крутить трубку'
    : 'Стекло провисает — <b>смахни вверх или вниз</b>, чтобы крутить трубку',
  heat: 'Остывает — держи <b>«в печь»</b>, пока снова не засветится',
  done: 'Контур заполнен — жми <b>«готово»</b>',
  tumbler: 'Стакан ровный: прогрей <b>всё</b> стекло, потом дуй понемногу',
  jacks: FINE ? 'Нажми на стекло и веди к оси — <b>щипцы</b> сузят шейку' : 'Коснись стекла и веди к оси — <b>щипцы</b> сузят шейку',
  flare: FINE ? 'Чуть подуй, потом <b>быстро крути колесо</b> (или часто тяни мышью): горячий край раскроется'
    : 'Чуть подуй, потом <b>часто смахивай</b>: быстро вращаемый горячий край раскроется',
  thin: 'Стенка тонкая — <b>отпусти</b>, или лопнет!',
};

const REACTIONS = [
  ['Это не то, что я просил…', 'Брак'],
  ['Ну… сойдёт.', 'Сойдёт'],
  ['Хорошо, беру.', 'Хорошая работа'],
  ['Ровно то, что нужно!', 'Мастерски'],
];

function haptic(ms) {
  try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(ms); } catch (e) { /* ignore */ }
}

export class Game {
  constructor({ renderer, overlay, sound, hud, platform }) {
    this.R = renderer; this.fx = overlay; this.snd = sound; this.hud = hud; this.platform = platform;
    this.state = 'title';
    this.time = 0;
    this.best = 0;
    try { this.best = Number(localStorage.getItem('glass.best') || 0); } catch (e) { /* ignore */ }
    try { this.seen = new Set(JSON.parse(localStorage.getItem('glass.hints') || '[]')); } catch (e) { this.seen = new Set(); }
    this.shelf = [];
    this.dayT = 0.05;
    this.slide = 0;
    this.blowing = false;
    this.heating = false;
    this.jaws = null;
    this.turnPtr = null;
    this.ghostK = 0;
    this.match = 0;
    this.layoutFor(window.innerWidth, window.innerHeight);
    // title screen backdrop: a glowing gather slowly turning
    this.gather = new Gather({ len: 100, radius: 50, neck: 16, capFrac: 0.4, rise: 1, round: true });   // a glowing round drop
    this.gather.spin = 0.8;
    this.order = null;
  }

  // ------------------------------------------------------------------ layout
  layoutFor(w, h) {
    if (!(w >= 200 && h >= 200)) { w = 390; h = 800; }
    this.L = makeLayout(w, h);
    const dpr = Math.min(this.dprCap || 2, window.devicePixelRatio || 1);
    this.dpr = dpr;
    this.R.resize(w, h, dpr);
    this.fx.resize(w, h, dpr);
    this.repaint();
  }
  repaint() {
    this.R.setBackground(paintStudio(this.L, Math.min(1.5, this.dpr), this.dayT, this.shelf, this.state === 'result'));
  }

  // ------------------------------------------------------------------ flow
  startDay() {
    this.day = makeDay((Math.random() * 1e9) | 0);
    this.idx = -1;
    this.results = [];
    this.shelf = [];
    this.state = 'work';
    this.hud.show(true);
    this.platform.gameplayStart();
    this.nextOrder();
  }

  nextOrder() {
    this.idx++;
    if (this.idx >= this.day.length) return this.endDay();
    this.order = this.day[this.idx];
    this.dayT = 0.05 + (this.idx / this.day.length) * 0.85;
    this.repaint();
    this.newGather();
    this.patience = this.order.patience;
    this.started = false;                 // the customer starts waiting once the master touches the glass
    this.ghostK = 0;
    this.state = 'work';
    this.hud.order(this.order, this.idx, this.day.length);
    this.hud.verdict(null);
    this.hud.toast(this.order.wish);
    this.flags = { thinWarned: false, doneHinted: false };
    this.hintAfter = 1.2;
    const t = this.order.teach;
    if (t === 'blow') this.queueHint('blow');
    if (this.order.key === 'tumbler') this.queueHint('tumbler');
    if (t === 'flare') this.queueHint('flare');
  }

  newGather() {
    this.gather = new Gather({ ...(this.order ? this.order.gather : {}), colour: this.order ? this.order.tint.t : undefined });
    this.slide = 0;
    this.crackShown = 0;
    this.respawnIn = 0;
  }

  finishPiece(auto = false) {
    if (this.state !== 'work' || !this.order) return;
    const g = this.gather;
    const res = finalScore(g, this.order);
    this.state = 'verdict';
    this.blowing = this.heating = false; this.jaws = null;
    this.results.push({ order: this.order, ...res });
    const size = Math.max(...g.r);
    // the finished piece cools to clear glass in front of the player: the reveal
    this.revealT = 0;
    this.snd.ring(size, res.stars);
    haptic(15);
    if (!g.burst) { this.shelf.push({ profile: Array.from(g.r).map((v, i) => (i < 3 ? 0 : v)), len: g.len, tint: this.order.tint.t }); this.repaint(); }
    const [line, title] = REACTIONS[res.stars];
    this.hud.verdict({ stars: res.stars, title: auto && res.stars === 0 ? 'Заказчик ушёл' : title, line: `${this.order.who}: «${line}» Совпадение ${res.score}%.` });
    this.platform.moment(res.stars === 3 ? 'Три звезды' : 'Первое изделие');
    if (this.idx === this.day.length - 1) this.hud.nextLabel('Закончить день');
    else this.hud.nextLabel('Следующий заказ');
  }

  endDay() {
    this.state = 'result';
    this.dayT = 0.97;
    this.repaint();   // the evening still life: the day's pieces against the sunset
    this.platform.gameplayStop();
    const stars = this.results.reduce((s, r) => s + r.stars, 0);
    const newBest = stars > this.best;
    if (newBest) { this.best = stars; try { localStorage.setItem('glass.best', String(stars)); } catch (e) { /* ignore */ } }
    this.platform.saveBest(this.best);
    if (stars >= 12) this.platform.moment('Мастер своего дела');
    this.hud.result(this.results, stars, newBest, this.best);
    this.gather = null;
  }

  pause(on) {
    if (on && (this.state === 'work' || this.state === 'verdict')) { this.prevState = this.state; this.state = 'paused'; this.hud.pause(true); this.blowing = this.heating = false; this.jaws = null; }
    else if (!on && this.state === 'paused') { this.state = this.prevState; this.hud.pause(false); }
  }

  // ------------------------------------------------------------------ hints
  queueHint(key, force = false) {
    if (this.seen.has(key) && !force) return;
    this.pendingHint = key;
  }
  showHint(key) {
    this.seen.add(key);
    try { localStorage.setItem('glass.hints', JSON.stringify([...this.seen])); } catch (e) { /* ignore */ }
    this.hud.hint(HINTS[key]);
    this.hintKey = key;
    this.hintAge = 0;
  }

  // ------------------------------------------------------------------ input
  geom() {
    const L = this.L, k = L.scale;
    const len = (this.gather ? this.gather.len : 300) * k;
    return { x0: L.pipeX + this.slide * this.slideDist(), k, len };
  }
  // slide the piece so its nose half goes into the glory hole
  slideDist() { const L = this.L; const len = (this.gather ? this.gather.len : 300) * L.scale; return Math.max(0, L.furnaceX - (L.pipeX + len * 0.5)); }

  onPointerDown(e) {
    if (this.state !== 'work') return;
    const { x0, k } = this.geom();
    const g = this.gather;
    const xa = (e.x - x0) / k;
    const onGlass = g && !g.burst && xa > g.len * 0.04 && xa < g.len * 1.02 && Math.abs(e.y - this.L.axisY) < g.radiusAt(Math.min(g.len, xa)) * k + 16;
    this.started = true;
    if (onGlass && this.slide < 0.2) this.jaws = { id: e.id, x: e.x, y: e.y };
    else this.turnPtr = { id: e.id, y: e.y, t: performance.now() };
  }
  onPointerMove(e) {
    if (this.jaws && e.id === this.jaws.id) { this.jaws.x = e.x; this.jaws.y = e.y; return; }
    if (this.turnPtr && e.id === this.turnPtr.id && this.gather) {
      const dy = e.y - this.turnPtr.y;
      this.turnPtr.y = e.y;
      const g = this.gather;
      // any swipe rolls the pipe further in the way it already turns (scrubbing up and down must not cancel out);
      // a calm swipe turns, a hard one flares
      const dir = Math.abs(g.spin) > 0.25 ? Math.sign(g.spin) : (Math.sign(dy) || 1);
      g.spin = Math.max(-3.2, Math.min(3.2, g.spin + dir * Math.abs(dy) * 0.012));
      if (this.hintKey === 'turn' && Math.abs(g.spin) > 0.8) this.clearHint();
    }
  }
  onPointerUp(e) {
    if (this.jaws && e.id === this.jaws.id) this.jaws = null;
    if (this.turnPtr && e.id === this.turnPtr.id) this.turnPtr = null;
  }
  setBlow(on) { if (this.state === 'work') { this.blowing = on; if (on) this.started = true; if (on && this.hintKey === 'blow') this.clearHint(); } else this.blowing = false; }
  setHeat(on) {
    if (this.state !== 'work') { this.heating = false; return; }
    if (on && !this.heating) this.snd.heatIn();
    if (on) this.started = true;
    this.heating = on;
    if (on && this.hintKey === 'heat') this.clearHint();
  }
  spinBy(v) {
    if (!this.gather || this.state !== 'work') return;
    this.started = true;
    const g = this.gather, dir = Math.abs(g.spin) > 0.25 ? Math.sign(g.spin) : Math.sign(v) || 1;
    g.spin = Math.max(-3.2, Math.min(3.2, g.spin + dir * Math.abs(v)));
    if (this.hintKey === 'turn' && Math.abs(g.spin) > 0.8) this.clearHint();
  }
  clearHint() { this.hud.hint(null); this.hintKey = null; }

  // ------------------------------------------------------------------ update
  update(dt) {
    this.time += dt;
    this.fx.update(dt);
    const g = this.gather;
    if (this.state === 'paused') return;
    if (this.state === 'title' && g) {
      g.spin = 0.8; g.T.fill(0.97); g.step(dt);
      return;
    }
    if (!g) return;
    if (this.state === 'verdict') {
      // finished piece: lit by the window, cooling to clear glass
      this.revealT += dt;
      let mT = 0;
      for (let i = 0; i < N; i++) { g.T[i] = Math.max(0.05, g.T[i] - dt * 0.9); mT = Math.max(mT, g.T[i]); }
      this.hud.live(this.match, this.match >= 0.76, mT, this.patience / this.order.patience);
      g.spin = 0.35;
      this.slide = Math.max(0, this.slide - dt * 3);
      g.step(dt);
      return;
    }
    if (this.state !== 'work') return;

    this.ghostK = Math.min(1, this.ghostK + dt * 1.6);
    // until the master starts, the assistant keeps the fresh gather hot and turning (nothing is lost while reading)
    if (!this.started) { for (let i = 0; i < N; i++) g.T[i] = Math.max(g.T[i], 1); g.spin = Math.max(g.spin, 0.6); }
    // furnace: the piece slides into the glory hole while heating is held
    this.slide += ((this.heating ? 1 : 0) - this.slide) * (1 - Math.exp(-6 * dt));
    if (this.heating && this.slide > 0.55) g.reheat(0.3 + 0.55 * this.slide, dt);
    // breath only reaches the glass outside the furnace
    let worst = -1;
    if (this.blowing && this.slide < 0.3 && !g.burst) worst = g.blow(0.9, dt);
    // tweezers
    let squeezing = false, hotAtJaws = 0;
    if (this.jaws && !g.burst) {
      const { x0, k } = this.geom();
      const xa = (this.jaws.x - x0) / k;
      const z = xa / g.len;
      if (z > 0.03 && z < 1) {
        let rT = Math.abs(this.jaws.y - this.L.axisY) / k;
        // a finger covers what it squeezes: the jaws settle on the dashed outline when they are close to it
        const tr = targetAt(this.order, xa);
        if (tr > 0 && rT < tr && rT > tr - 12) rT = tr;
        this.jaws.r = rT * k;
        const cold = g.squeeze(xa, rT, 10, dt);
        const ri = Math.min(N - g.capN - 1, Math.round(z * (N - 1)));
        hotAtJaws = Math.max(0, (g.T[ri] - SET) / (1 - SET));
        squeezing = g.r[ri] > rT + 0.5 || cold > 0;
        if (cold > 0.5) {
          g.crack = Math.min(1.2, g.crack + cold * dt * 0.6);
          if (g.crack > this.crackShown + 0.25) { this.crackShown = g.crack; this.snd.crack(); this.fx.shake(0.15); }
        }
        if (squeezing && hotAtJaws > 0.2 && Math.random() < dt * 20) this.fx.spark(this.jaws.x, this.L.axisY + Math.sign(this.jaws.y - this.L.axisY) * g.r[ri] * k, 1, { speed: 90, life: 0.5, size: 1.6 });
      }
    }
    g.step(dt);
    if (this.respawnIn > 0 && (this.respawnIn -= dt) <= 0) { this.newGather(); this.hud.toast('Новая капля стекла'); return; }
    // cracks spread into a break
    if (g.crack >= 1 && !g.burst) g.burst = { i: N >> 1, t: 0, crack: true };
    if (g.burst && !this.burstHandled) this.onBurst();
    if (!g.burst) this.burstHandled = false;

    // thin wall warning while blowing
    if (worst >= 0 && !g.burst && g.stretch(worst) < THIN && !this.flags.thinWarned) {
      this.flags.thinWarned = true;
      if (!this.seen.has('thin')) this.showHint('thin');
      this.fx.word(this.geom().x0 + (worst / (N - 1)) * this.geom().len, this.L.axisY - g.r[worst] * this.L.scale - 12, 'тонко!', '#ff9b85', 18);
    }
    // little stress pings as the glass passes through its setting range
    let maxT = 0, sumT = 0;
    for (let i = 0; i < N; i++) { maxT = Math.max(maxT, g.T[i]); sumT += g.T[i]; }
    // blowing into glass that has gone stiff does nothing: say so, and point at the furnace
    this.coldBlow = this.blowing && this.slide < 0.3 && maxT < 0.6 ? (this.coldBlow || 0) + dt : 0;
    if (this.coldBlow > 0.5 && !this.flags.coldWarned) {
      this.flags.coldWarned = true;
      const { x0, len } = this.geom();
      this.fx.word(x0 + len * 0.5, this.L.axisY - Math.max(...g.r) * this.L.scale - 14, 'не поддаётся — в печь', '#ffd27a', 17);
      this.hud.nudge('btnHeat');
      if (this.hintKey !== 'heat') this.showHint('heat');
    }
    if (maxT > 0.8) this.flags.coldWarned = false;
    if (maxT > SET && maxT < 0.6 && Math.random() < dt * 0.8) this.snd.stress();
    this.maxT = maxT;
    // hot sparks and heat shimmer at the furnace
    if (this.slide > 0.5 && Math.random() < dt * 14) this.fx.spark(this.L.furnaceX - 10, this.L.axisY - 20, 1, { speed: 120, life: 0.7, dir: -Math.PI / 2 - 0.5, spread: 1 });
    if (this.blowing && this.slide < 0.3 && Math.random() < dt * 10) this.fx.spark(4, this.L.axisY, 1, { kind: 'smoke', col: [255, 255, 255], speed: 30, dir: Math.PI, size: 10, g: -10, life: 0.8 });

    this.match = g.burst ? 0 : matchScore(g, this.order);
    const good = this.match >= 0.76;
    this.hud.live(this.match, good, maxT, this.patience / this.order.patience);

    if (this.started) this.patience -= dt;
    if (this.patience <= 0 && !g.burst) { this.hud.toast(`${this.order.who} не дождался`, true); this.finishPiece(true); return; }

    // ---- contextual hints
    this.hintAge = (this.hintAge || 0) + dt;
    if (this.pendingHint && (this.hintAfter -= dt) <= 0) { this.showHint(this.pendingHint); this.pendingHint = null; }
    if (!this.hintKey && !this.pendingHint) {
      // the tweezers lesson comes once the body is blown (there is something to shape)
      if (this.order.teach === 'jacks' && this.match >= 0.55 && !this.seen.has('jacks')) this.showHint('jacks');
      else if (maxT < 0.62 && !this.seen.has('heat')) this.showHint('heat');
      else if (g.droop() > 4 && !this.seen.has('turn')) this.showHint('turn');
      else if (good && !this.seen.has('done')) this.showHint('done');
    }
    if (this.hintKey === 'done' && !good) this.clearHint();
    if (this.hintKey && !['turn', 'blow', 'jacks'].includes(this.hintKey) && this.hintAge > 6) this.clearHint();
    if (this.hintKey === 'jacks' && squeezing && this.hintAge > 0.8) this.clearHint();
    if (this.hintKey === 'heat' && maxT > 0.8) this.clearHint();
    if (this.hintKey === 'thin' && !this.blowing) this.clearHint();

    this.snd.frame({
      heating: this.heating && this.slide > 0.3, blowing: this.blowing && this.slide < 0.3, bubble: Math.max(...g.ri),
      squeezing, spin: g.spin, hot: hotAtJaws,
    });
  }

  onBurst() {
    this.burstHandled = true;
    const g = this.gather;
    const { x0, k, len } = this.geom();
    const i = g.burst.i;
    const cx = x0 + (i / (N - 1)) * len;
    const tint = this.order.tint.t.map((v) => Math.round(v * 255));
    for (let j = 0; j < N; j += 2) {
      const x = x0 + (j / (N - 1)) * len;
      this.fx.spark(x, this.L.axisY - g.r[j] * k * 0.8, 2, { kind: 'shard', col: tint, speed: 260, life: 1.4, size: 5, g: 600, dir: -Math.PI / 2, spread: 3 });
    }
    this.fx.spark(cx, this.L.axisY, 18, { speed: 220, life: 0.6, size: 2 });
    this.fx.shake(0.6);
    this.snd.burst();
    haptic(40);
    this.hud.toast(g.burst.crack ? 'Треснуло!' : 'Лопнуло!', true);
    this.fx.word(cx, this.L.axisY - 40, g.burst.crack ? 'трещина' : 'пф-ф!', '#ff9b85', 26);
    this.blowing = false; this.jaws = null;
    // a fresh gather after a beat (game time, so pause holds it); the customer keeps waiting
    this.respawnIn = 1.2;
  }

  // ------------------------------------------------------------------ draw
  draw() {
    const L = this.L;
    const { x0, k } = this.geom();
    const sh = this.fx.offset();
    const { sun } = skyAt(this.dayT);
    const g = this.gather;
    this.R.draw({
      gather: g, hidden: !g || (g.burst && this.state === 'work'),
      x0: x0 + sh.x, axisY: L.axisY + sh.y, scale: k,
      furnace: { x: L.furnaceX, y: L.axisY, r: Math.min(64, L.workH * 0.11) * 0.62, roar: this.heating ? 1 : 0.2 },
      sun, tint: this.order ? this.order.tint.t : [0.9, 0.97, 0.95], crack: g ? Math.min(1, g.crack) : 0, time: this.time,
    });
    let hand = null;
    if (this.hintKey === 'turn') hand = { kind: 'swipe', x: L.w * 0.78, y: L.axisY + L.workH * 0.22 };
    if (this.hintKey === 'jacks' && g) {
      const xa = g.len * 0.28;
      hand = { kind: 'press', x: x0 + xa * k, y: L.axisY - (g.radiusAt(Math.min(g.len, xa)) * k + 10) };
    }
    this.fx.draw({
      x0: x0 + sh.x, axisY: L.axisY + sh.y, scale: k, gather: this.state === 'work' || this.state === 'verdict' || this.state === 'title' ? g : null,
      target: this.state === 'work' || this.state === 'verdict' ? this.order?.target : null, tlen: this.order ? this.order.len : 0, ghostK: this.state === 'verdict' ? 1 : this.ghostK,
      good: this.match >= 0.76, jaws: this.jaws && g ? { x: this.jaws.x, r: this.jaws.r ?? Math.abs(this.jaws.y - L.axisY) } : null, hand,
    });
  }
}
