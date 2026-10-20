// DOM interface: order header, live match, heat bar, hints, verdict card, title/pause/result screens.

const $ = (id) => document.getElementById(id);

export class Hud {
  constructor() {
    this.e = {
      hud: $('hud'), controls: $('controls'), name: $('orderName'), who: $('orderWho'), pct: $('matchPct'), match: document.querySelector('.match'),
      temp: $('tempBar'), tempLabel: $('tempLabel'), hint: $('hint'), toast: $('toast'), title: $('title'), pauseS: $('pause'),
      verdict: $('verdict'), vStars: $('vStars'), vTitle: $('vTitle'), vLine: $('vLine'), next: $('btnNext'),
      result: $('result'), resTitle: $('resTitle'), resLine: $('resLine'), resList: $('resList'), best: $('bestLine'),
      done: $('btnDone'), sound: $('btnSound'),
    };
  }
  title(best) {
    this.e.title.classList.remove('hidden');
    this.show(false);
    this.e.best.textContent = best > 0 ? `Рекорд: ${best} ★ за день` : '';
  }
  show(on) {
    this.e.hud.classList.toggle('hidden', !on);
    this.e.controls.classList.toggle('hidden', !on);
    if (on) { this.e.title.classList.add('hidden'); this.e.result.classList.add('hidden'); }
  }
  order(o, i, n) {
    this.e.name.textContent = `${o.name}`;
    this.e.who.textContent = `${i + 1} из ${n} · ${o.who} · ${o.tint.name}`;
  }
  live(match, good, maxT, patience) {
    const p = Math.round(match * 100);
    if (p !== this._p) { this._p = p; this.e.pct.textContent = p + '%'; }
    this.e.match.classList.toggle('good', good);
    this.e.done.classList.toggle('ready', good);
    const heat = Math.max(0, Math.min(1, (maxT - 0.3) / 0.75));
    this.e.temp.style.width = (heat * 100).toFixed(1) + '%';
    const label = maxT > 0.8 ? 'жар' : maxT > 0.55 ? 'остывает' : maxT > 0.42 ? 'густеет' : 'застыло';
    if (label !== this._l) { this._l = label; this.e.tempLabel.textContent = label; }
    const wp = Math.max(0, Math.min(1, patience));
    $('waitBar').style.width = (wp * 100).toFixed(1) + '%';
    $('waitBar').parentElement.classList.toggle('low', wp < 0.2);
  }
  hint(html) {
    if (html === this._hint) return;
    this._hint = html;
    if (!html) { this.e.hint.classList.add('hidden'); return; }
    this.e.hint.innerHTML = html;
    this.e.hint.classList.remove('hidden');
    this.e.hint.style.animation = 'none'; void this.e.hint.offsetWidth; this.e.hint.style.animation = '';
  }
  toast(s, bad = false) {
    const t = this.e.toast;
    t.textContent = s; t.classList.toggle('bad', bad); t.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 2200);
  }
  verdict(v) {
    clearTimeout(this._vt);   // a pending reveal must not pop the old card over the next order
    if (!v) { this.e.verdict.classList.add('hidden'); this.e.controls.classList.remove('hidden'); return; }
    this.hint(null);
    this.e.controls.classList.add('hidden');
    this.e.vStars.innerHTML = [0, 1, 2].map((i) => `<span class="${i < v.stars ? '' : 'off'}">★</span>`).join('');
    this.e.vTitle.textContent = v.title;
    this.e.vLine.textContent = v.line;
    clearTimeout(this._vt);
    this._vt = setTimeout(() => this.e.verdict.classList.remove('hidden'), 700);
  }
  // draw the eye to a control (e.g. the furnace when the glass has gone stiff)
  nudge(id) {
    const el = $(id);
    el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge');
    clearTimeout(this._nt); this._nt = setTimeout(() => el.classList.remove('nudge'), 2400);
  }
  nextLabel(s) { this.e.next.textContent = s; }
  pause(on) { this.e.pauseS.classList.toggle('hidden', !on); }
  setMuted(m) { this.e.sound.classList.toggle('muted', m); }
  result(results, stars, newBest, best) {
    clearTimeout(this._vt);
    this.e.verdict.classList.add('hidden');
    this.show(false);
    this.e.result.classList.remove('hidden');
    this.e.resTitle.textContent = stars >= 12 ? 'Мастер своего дела' : stars >= 8 ? 'Хороший день' : stars >= 4 ? 'День подмастерья' : 'Трудный день';
    this.e.resLine.textContent = `Полка заполнена: ${stars} из 15 звёзд. ${newBest ? 'Новый рекорд!' : `Рекорд: ${best} ★`}`;
    this.e.resList.innerHTML = results.map((r) => `<li><b>${'★'.repeat(r.stars) || '—'}</b>${r.order.name.split(' ')[0]}<span>${r.score}%</span></li>`).join('');
  }
}
