// DOM overlay: meters, night clock, hints, toasts and the three screens.

import { NIGHT } from './game.js';
import { KINDS } from './bugs.js';

const $ = (id) => document.getElementById(id);

export class Hud {
  constructor() {
    this.el = {
      hud: $('hud'), belly: document.querySelector('.meter.belly'), silk: document.querySelector('.meter.silk'),
      bellyBar: document.querySelector('.meter.belly i'), silkBar: document.querySelector('.meter.silk i'),
      moon: document.querySelector('.clock .moon'), score: document.querySelector('.clock .score'),
      hint: $('hint'), toast: $('toast'), title: $('title'), pause: $('pause'), result: $('result'),
      resTitle: $('resTitle'), resLine: $('resLine'), resStats: $('resStats'), best: $('bestLine'), sound: $('btnSound'),
    };
    this.toastTimer = 0;
    this.lastHint = null;
  }

  show(on) { this.el.hud.classList.toggle('hidden', !on); this.el.title.classList.add('hidden'); this.el.result.classList.add('hidden'); }

  title(best) {
    this.el.title.classList.remove('hidden');
    this.el.hud.classList.add('hidden');
    this.el.best.textContent = best > 0 ? `Рекорд: ${best} калорий за ночь` : '';
  }

  update(g) {
    const e = this.el;
    e.bellyBar.style.width = Math.min(100, g.belly) + '%';
    e.silkBar.style.width = Math.max(0, g.silk) + '%';
    e.silk.classList.toggle('low', g.silk < 12);
    e.belly.classList.toggle('full', g.belly >= 100);
    const t = Math.min(1, g.nightT / NIGHT);
    e.moon.setAttribute('cx', (50 - 44 * Math.cos(Math.PI * t)).toFixed(1));
    e.moon.setAttribute('cy', (48 - 44 * Math.sin(Math.PI * t)).toFixed(1));
    if (this._score !== g.score) { this._score = g.score; e.score.textContent = g.score; }
  }

  flash(which) {
    const m = which === 'belly' ? this.el.belly : this.el.silk;
    m.classList.remove('flash'); void m.offsetWidth; m.classList.add('flash');
  }

  // sticky hints stay until the game clears them (the action they ask for happened)
  hint(html, sticky = false) {
    if (html === this.lastHint) return;
    this.lastHint = html;
    const h = this.el.hint;
    clearTimeout(this.hintTimer);
    if (!html) { h.classList.add('hidden'); return; }
    h.innerHTML = html;
    h.classList.remove('hidden');
    h.style.animation = 'none'; void h.offsetWidth; h.style.animation = '';
    if (!sticky) this.hintTimer = setTimeout(() => { if (this.lastHint === html) this.hint(null); }, 6500);
  }

  toast(s) {
    const t = this.el.toast;
    t.textContent = s;
    t.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
  }

  pause(on) { this.el.pause.classList.toggle('hidden', !on); }

  setMuted(m) { this.el.sound.classList.toggle('muted', m); this.el.sound.setAttribute('aria-pressed', String(!m)); }

  result(g, { full, newBest }) {
    const e = this.el;
    e.hud.classList.add('hidden');
    this.hint(null);
    e.resTitle.textContent = full ? 'Сытая ночь' : g.belly >= 60 ? 'Дотянет до вечера' : 'Голодный рассвет';
    e.resLine.textContent = full
      ? 'Паучиха сыта и сплела кокон для яиц. Паутина в росе — вот твоя ночь.'
      : g.belly >= 60 ? 'Почти хватило. Плотнее сеть у фонаря — и следующая ночь будет сытой.'
        : 'Добыча уходила сквозь редкую сеть. Попробуй больше нитей там, где кружат мотыльки.';
    const caught = Object.entries(g.stats.caught).sort((a, b) => KINDS[b[0]].value - KINDS[a[0]].value);
    const total = caught.reduce((s, [, n]) => s + n, 0);
    const parts = [
      ['калорий', g.score + (newBest ? ' ★' : '')],
      ['поймано', total],
      ['нитей', g.stats.threads],
      ['сорвалось', g.stats.escaped],
    ];
    e.resStats.innerHTML = parts.map(([k, v]) => `<li><b>${v}</b>${k}</li>`).join('') +
      (caught.length ? `<li style="grid-column:1/-1">${caught.map(([k, n]) => `${KINDS[k].name} ×${n}`).join(' · ')}</li>` : '') +
      `<li style="grid-column:1/-1">${newBest ? 'Новый рекорд!' : `Рекорд: ${g.best}`}</li>`;
    setTimeout(() => e.result.classList.remove('hidden'), 400);
  }
}
