import { GAMES, VAULT, PROJECTS, TEARDOWNS } from '../arcade/data.js';
import { makeWoodGrain } from './wood.js';

const $ = id => document.getElementById(id);
const query = new URLSearchParams(location.search);
const PAGE_SIZE = 6;
const colors = ['#88d6d2', '#f4a589', '#d0e989', '#c1b3f5', '#f2ca83', '#9cc2f5'];
const words = {
  skip: ['Skip to games', 'К играм'],
  headline: ['The Game Shelf', 'Игровая полка'],
  intro: ['Pick a box. See it on the screen. Play the build or read how it works.', 'Выбери коробку, посмотри игру на экране и запусти сборку или открой разбор.'],
  showreel: ['Showreel', 'Шоурил'],
  market: ['3D market', '3D-маркет'],
  contact: ['CV & contact', 'Резюме и контакты'],
  catalogue: ['Full catalogue ↗', 'Весь каталог ↗'],
  selected: ['Highlights', 'Избранное'],
  games: ['Games', 'Игры'],
  roblox: ['Roblox', 'Roblox'],
  research: ['Teardowns', 'Разборы'],
  tools: ['Tools & UI', 'Инструменты и UI'],
  search: ['Find a project', 'Найти проект'],
  empty: ['No projects found.', 'Ничего не нашлось.'],
  screen: ['PROJECT SCREEN', 'ЭКРАН ПРОЕКТА'],
  watchReel: ['▶ 35 seconds', '▶ 35 секунд'],
  watch: ['▶ Watch footage', '▶ Смотреть запись'],
  reelTitle: ['Gameplay showreel', 'Шоурил портфолио'],
  reelCopy: ['Six projects in 35 seconds.', 'Шесть проектов за 35 секунд.'],
  openReel: ['Open showreel ↗', 'Открыть шоурил ↗'],
  openGame: ['Open game ↗', 'Открыть игру ↗'],
  playHere: ['Play here', 'Играть здесь'],
  openRoblox: ['Open in Roblox ↗', 'Открыть в Roblox ↗'],
  read: ['Read teardown ↗', 'Читать разбор ↗'],
  openProject: ['Open project ↗', 'Открыть проект ↗'],
  case: ['Development case ↗', 'Кейс разработки ↗'],
  demo: ['Browser demo ↗', 'Демо в браузере ↗'],
  newTab: ['Open in new tab ↗', 'Открыть в новой вкладке ↗'],
  previous: ['Previous page', 'Предыдущая страница'],
  next: ['Next page', 'Следующая страница'],
  close: ['Close game', 'Закрыть игру'],
  credits: ['Shelf texture adapted from Kirill Kulinkin’s Cartridge Club ↗', 'Фактура полки по коду Cartridge Club Кирилла Кулинкина ↗']
};
let storedLanguage;
try { storedLanguage = localStorage.getItem('portfolio-language'); } catch {}
const lang = query.get('lang') || storedLanguage || navigator.language.slice(0, 2);
const categories = ['selected', 'games', 'roblox', 'research', 'tools'];
const state = {
  lang: lang === 'ru' ? 'ru' : 'en',
  category: categories.includes(query.get('tab')) ? query.get('tab') : 'selected',
  term: '',
  page: 0,
  active: null
};
const t = key => words[key][state.lang === 'ru' ? 1 : 0];

const games = [...GAMES, ...VAULT].map(game => ({
  id: game.id,
  title: game.title,
  kind: 'HTML5',
  group: 'games',
  summary: game.blurb,
  cover: game.cover,
  clip: game.video,
  href: game.play,
  extra: game.teardown
}));

const projectMedia = {
  'soap-cutting': { cover: 'showreel/soap-cutting.jpg' },
  'zombie-lake': { cover: 'showreel/zombie-lake.jpg', clip: 'showreel/zombie-lake.mp4' }
};
const projects = PROJECTS.map(project => {
  const media = projectMedia[project.id];
  const roblox = project.zone === 'Roblox';
  return {
    id: project.id,
    title: project.id === 'soap-cutting' ? 'SoapCutting' : project.title,
    kind: project.zone,
    group: roblox ? 'roblox' : 'tools',
    summary: project.blurb,
    cover: media?.cover ?? (project.img ? `arcade/proj/${project.img}.jpg` : null),
    clip: media?.clip ?? project.video,
    href: project.links[0]?.[1],
    extra: project.links[1]?.[1],
    opensRoblox: roblox && project.links[0]?.[1].startsWith('https://www.roblox.com/')
  };
});

const research = TEARDOWNS.map(item => ({
  id: `research-${item.id}`,
  title: item.title,
  kind: item.cat,
  group: 'research',
  cover: item.thumb,
  summary: item.sub,
  href: item.url
}));
const all = [...games, ...projects, ...research];
const byId = new Map(all.map(item => [item.id, item]));
const highlights = ['block-express', 'zombie-lake', 'breaking-storm', 'soap-cutting', 'twelve-second-heist', 'foggy-woods']
  .map(id => byId.get(id)).filter(Boolean);
const reel = { title: 'Gameplay showreel', cover: 'showreel/overview.jpg', clip: 'showreel/overview.mp4' };

const wood = makeWoodGrain();
if (wood) document.documentElement.style.setProperty('--wood', `url("${wood}")`);

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set('lang', state.lang);
  if (state.category === 'selected') url.searchParams.delete('tab');
  else url.searchParams.set('tab', state.category);
  history.replaceState(null, '', url);
}

function renderLanguage() {
  document.documentElement.lang = state.lang;
  for (const el of document.querySelectorAll('[data-text]')) el.textContent = t(el.dataset.text);
  $('language').textContent = state.lang === 'ru' ? 'EN' : 'RU';
  $('language').setAttribute('aria-label', state.lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
  $('search').placeholder = t('search');
  $('prev').setAttribute('aria-label', t('previous'));
  $('next').setAttribute('aria-label', t('next'));
  $('close-game').setAttribute('aria-label', t('close'));
  for (const link of document.querySelectorAll('[data-link]')) {
    const hash = link.dataset.link === 'contact' ? '#contact' : '';
    link.href = `showreel.html?lang=${state.lang}${hash}`;
  }
}

function getItems() {
  const base = state.category === 'selected'
    ? (state.term ? all : highlights)
    : all.filter(item => item.group === state.category);
  if (!state.term) return base;
  return base.filter(item => `${item.title} ${item.kind} ${item.summary || ''}`.toLowerCase().includes(state.term));
}

function makeBox(item, index) {
  const button = document.createElement('button');
  button.className = 'box';
  button.type = 'button';
  button.dataset.project = item.id;
  button.style.setProperty('--case-color', colors[index % colors.length]);
  button.setAttribute('aria-pressed', String(state.active?.id === item.id));

  const art = document.createElement('span');
  art.className = 'box-art';
  if (item.cover) {
    const img = document.createElement('img');
    img.src = item.cover;
    img.alt = '';
    img.width = 320;
    img.height = 180;
    img.addEventListener('error', () => img.remove(), { once: true });
    art.append(img);
  } else {
    art.classList.add('code-art');
    art.textContent = '▧';
  }
  const label = document.createElement('span');
  label.className = 'box-label';
  const title = document.createElement('strong');
  title.textContent = item.title;
  const kind = document.createElement('small');
  kind.textContent = item.kind;
  label.append(title, kind);
  button.append(art, label);
  button.addEventListener('click', () => {
    state.active = item;
    resetPreview();
    renderSelection();
    for (const box of $('shelves').querySelectorAll('button')) {
      box.setAttribute('aria-pressed', String(box === button));
    }
    if (matchMedia('(max-width: 820px)').matches) {
      $('selected-title').focus({ preventScroll: true });
      $('console').scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  });
  return button;
}

function renderFilters() {
  const active = document.activeElement?.dataset.category;
  $('filters').replaceChildren(...categories.map(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = t(category);
    button.dataset.category = category;
    button.setAttribute('aria-pressed', String(category === state.category));
    button.addEventListener('click', () => {
      state.category = category;
      state.page = 0;
      for (const control of $('filters').children) {
        control.setAttribute('aria-pressed', String(control === button));
      }
      renderShelf();
      updateUrl();
    });
    return button;
  }));
  if (active) $('filters').querySelector(`[data-category="${active}"]`)?.focus();
}

function renderShelf() {
  const items = getItems();
  const start = state.page * PAGE_SIZE;
  const page = items.slice(start, start + PAGE_SIZE);
  const rows = [];
  for (let index = 0; index < page.length; index += 3) {
    const row = document.createElement('div');
    row.className = 'shelf-row';
    row.append(...page.slice(index, index + 3).map((item, i) => makeBox(item, index + i)));
    rows.push(row);
  }
  $('shelves').replaceChildren(...rows);
  $('empty').hidden = items.length > 0;
  $('range').textContent = items.length ? `${start + 1}–${start + page.length} / ${items.length}` : '0';
  $('prev').disabled = state.page === 0;
  $('next').disabled = start + PAGE_SIZE >= items.length;
}

function resetPreview() {
  const video = $('clip');
  video.pause();
  video.removeAttribute('src');
  video.load();
  video.hidden = true;
}

function renderSelection() {
  const item = state.active;
  const media = item || reel;
  $('poster').hidden = !$('clip').hidden || !media.cover;
  if (media.cover) $('poster').src = media.cover;
  $('watch').hidden = !$('clip').hidden || !media.clip;
  $('watch').textContent = t(item ? 'watch' : 'watchReel');
  $('watch').setAttribute('aria-label', $('watch').textContent);
  $('selected-kind').textContent = item?.kind || 'Roblox · HTML5';
  $('selected-title').textContent = item?.title || t('reelTitle');
  $('selected-copy').textContent = item?.summary || t('reelCopy');
  const embedded = item?.group === 'games' && Boolean(item.href);
  $('play').hidden = !embedded;
  $('open').className = embedded ? 'secondary' : 'primary';
  $('open').href = item?.href || `showreel.html?lang=${state.lang}`;
  $('open').textContent = t(!item ? 'openReel' : item.group === 'research' ? 'read' : embedded ? 'openGame' : item.opensRoblox ? 'openRoblox' : 'openProject');
  const extra = item?.extra || (item?.group === 'tools' ? `showreel.html?focus=tools&lang=${state.lang}` : null);
  $('extra').hidden = Boolean(item) && !extra;
  $('extra').href = extra || 'list/';
  $('extra').textContent = t(item?.extra ? (embedded ? 'read' : 'case') : extra ? 'demo' : 'catalogue');
}

$('watch').addEventListener('click', () => {
  const video = $('clip');
  video.src = (state.active || reel).clip;
  video.hidden = false;
  $('poster').hidden = true;
  $('watch').hidden = true;
  video.focus();
  video.play().catch(() => {});
});
$('clip').addEventListener('error', () => {
  resetPreview();
  renderSelection();
});
$('reset').addEventListener('click', () => {
  state.active = null;
  resetPreview();
  renderSelection();
  for (const box of $('shelves').querySelectorAll('button')) box.setAttribute('aria-pressed', 'false');
});
$('search').addEventListener('input', event => {
  state.term = event.target.value.trim().toLowerCase();
  state.page = 0;
  renderShelf();
});
for (const [id, delta] of [['prev', -1], ['next', 1]]) {
  $(id).addEventListener('click', () => {
    state.page += delta;
    renderShelf();
    if ($(id).disabled) $(delta === 1 ? 'prev' : 'next').focus();
  });
}
$('shelves').addEventListener('keydown', event => {
  const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[event.key];
  if (!step) return;
  const boxes = [...$('shelves').querySelectorAll('button')];
  const index = boxes.indexOf(event.target);
  if (index < 0) return;
  event.preventDefault();
  boxes[index + step]?.focus();
});
$('language').addEventListener('click', () => {
  state.lang = state.lang === 'ru' ? 'en' : 'ru';
  try { localStorage.setItem('portfolio-language', state.lang); } catch {}
  renderLanguage();
  renderFilters();
  renderSelection();
  updateUrl();
});
$('play').addEventListener('click', () => {
  const item = state.active;
  if (!item?.href || item.group !== 'games') return;
  $('clip').pause();
  const frame = document.createElement('iframe');
  frame.src = item.href;
  frame.title = item.title;
  frame.allow = 'fullscreen; autoplay; gamepad';
  frame.allowFullscreen = true;
  $('game-title').textContent = item.title;
  $('game-link').href = item.href;
  $('game-frame').replaceChildren(frame);
  $('game-dialog').showModal();
  $('close-game').focus();
});
$('close-game').addEventListener('click', () => $('game-dialog').close());
$('game-dialog').addEventListener('close', () => $('game-frame').replaceChildren());

renderLanguage();
renderFilters();
renderShelf();
renderSelection();
