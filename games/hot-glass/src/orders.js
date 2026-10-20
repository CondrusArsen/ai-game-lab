// A working day: five commissions. Each target silhouette is produced by running the same glass physics
// with a reference technique (blow to size, squeeze a neck, spin a bowl open), so every outline is
// physically reachable and looks like real blown glass. Customers vary the size a little.
// Shapes are ordered so each teaches one more technique: blow → long gather → tweezers → long neck → flare.

import { Gather, N } from './glass.js';

export const M = 80;   // samples along a target
const DT = 1 / 60;

// reference techniques: g = fresh gather, k = customer's size factor
const SHAPES = {
  ball: {
    name: 'Ёлочный шар', teach: 'blow', gather: { len: 100, radius: 50, neck: 16, capFrac: 0.4, rise: 1, round: true },
    make(g, k, sim) { sim.blowUntil(() => g.bodyMax() >= 88 * k); },
  },
  tumbler: {
    name: 'Стакан', teach: 'heat', gather: { len: 150, radius: 42, neck: 20, capFrac: 0.12, rise: 0.35 },
    make(g, k, sim) { sim.blowUntil(() => g.bodyMax() >= 70 * k); },
  },
  vase: {
    name: 'Ваза для ландышей', teach: 'jacks', gather: { len: 140, radius: 48, neck: 22, capFrac: 0.3, rise: 0.9, round: true },
    make(g, k, sim) {
      sim.blowUntil(() => g.bodyMax() >= 98 * k);
      sim.squeeze(0.3, 34, 1.4);
    },
  },
  bottle: {
    name: 'Бутыль для настойки', teach: 'jacks', gather: { len: 160, radius: 44, neck: 20, capFrac: 0.22, rise: 0.5 },
    make(g, k, sim) {
      sim.blowUntil(() => g.bodyMax() >= 84 * k);
      for (const f of [0.2, 0.28, 0.36, 0.44]) sim.squeeze(f, 26, 0.6);
    },
  },
  bowl: {
    name: 'Чаша-цветок', teach: 'flare', gather: { len: 105, radius: 50, neck: 18, capFrac: 0.05, rise: 1 },
    make(g, k, sim) {
      sim.blowUntil(() => g.bodyMax() >= 58);
      sim.spinUntil(() => g.r[N - g.capN - 1] >= 128 * k);
    },
  },
};

function reference(shape, k) {
  const g = new Gather(shape.gather);
  // the reference gaffer keeps the glass hot between moves
  const hot = () => { for (let i = 0; i < N; i++) g.T[i] = Math.max(g.T[i], 0.95); };
  const sim = {
    blowUntil(cond, max = 8) { for (let i = 0; i < max * 60 && !cond(); i++) { g.spin = Math.max(g.spin, 1.2); g.blow(0.9, DT); hot(); g.step(DT); } },
    squeeze(f, r, sec) { for (let i = 0; i < sec * 60; i++) { g.spin = Math.max(g.spin, 1.2); g.squeeze(g.len * f, r, 10, DT); hot(); g.step(DT); } },
    spinUntil(cond, max = 8) { for (let i = 0; i < max * 60 && !cond(); i++) { g.spin = 3; hot(); g.step(DT); } },
  };
  shape.make(g, k, sim);
  const target = new Float32Array(M);
  for (let j = 0; j < M; j++) target[j] = g.radiusAt((j / (M - 1)) * g.len * 0.999);
  return { target, len: g.len };
}

const CUSTOMERS = [
  ['соседка Вера', 'Хочу шар на ёлку, круглый-круглый.'],
  ['трактир «У моста»', 'Стакан, ровный как бочонок.'],
  ['учительница Анна', 'Вазочку: пузатую, с тонкой шейкой.'],
  ['аптекарь Лев', 'Бутыль с длинным узким горлом.'],
  ['свадьба на набережной', 'Чашу-цветок: раскрытую, с широким краем.'],
];

const TINTS = [
  { name: 'прозрачное', t: [0.9, 0.97, 0.95] },
  { name: 'кобальт', t: [0.45, 0.6, 0.98] },
  { name: 'янтарь', t: [1.0, 0.78, 0.42] },
  { name: 'изумруд', t: [0.55, 0.92, 0.62] },
  { name: 'розовое', t: [1.0, 0.7, 0.78] },
];

export function makeDay(seed) {
  let s = seed >>> 0;
  const rnd = () => ((s = Math.imul(s ^ (s >>> 13), 1103515245) + 12345 >>> 0) / 4294967296);
  const keys = ['ball', 'tumbler', 'vase', 'bottle', 'bowl'];
  const tints = TINTS.slice(1).sort(() => rnd() - 0.5);
  return keys.map((key, i) => {
    const shape = SHAPES[key];
    const k = 0.92 + rnd() * 0.14;             // each customer wants a slightly different size
    const { target, len } = reference(shape, k);
    return {
      key, name: shape.name, teach: shape.teach, target, len, gather: shape.gather,
      who: CUSTOMERS[i][0], wish: CUSTOMERS[i][1],
      tint: i === 0 ? TINTS[0] : tints[(i - 1) % tints.length],
      patience: [80, 85, 95, 95, 95][i],
    };
  });
}

export function targetAt(order, x) {
  if (x < 0 || x > order.len) return 0;
  const f = (x / order.len) * (M - 1), i = Math.min(M - 2, Math.floor(f)), t = f - i;
  return order.target[i] * (1 - t) + order.target[i + 1] * t;
}

// overlap of the two silhouettes as solids of revolution (∫min(r,t)² / ∫max(r,t)²), past the neck
export function matchScore(g, order) {
  const L = Math.max(order.len, g.len);
  let inter = 0, union = 0;
  const S = 96;
  for (let j = 0; j < S; j++) {
    const x = ((j + 0.5) / S) * L;
    if (x < order.len * 0.08) continue;
    const r = g.radiusAt(x), t = targetAt(order, x);
    inter += Math.min(r, t) ** 2;
    union += Math.max(r, t) ** 2;
  }
  return union > 0 ? inter / union : 0;
}

export function finalScore(g, order) {
  if (g.burst) return { match: 0, score: 0, stars: 0, notes: ['лопнуло'] };
  let m = matchScore(g, order);
  const notes = [];
  const droop = g.droop();
  if (droop > 6) { m *= Math.max(0.6, 1 - (droop - 6) / 60); notes.push('кривовато'); }
  if (g.crack > 0.2) { m *= 0.75; notes.push('трещина'); }
  const stars = m >= 0.82 ? 3 : m >= 0.66 ? 2 : m >= 0.45 ? 1 : 0;
  return { match: m, score: Math.round(m * 100), stars, notes };
}
