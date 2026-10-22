// AI Game Market: a walkable 3D hub for Arseni Atrokhov's games, teardowns and projects.
// three.js, no build step. Layout is generated from data.js, so new content needs no code changes.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SECTIONS, GAMES, PROJECTS, TEARDOWNS, STATS, LINKS, VAULT_SECTIONS, VAULT } from './data.js';

// ---------- environment ----------
const params = new URLSearchParams(location.search);
const FILM = params.has('film');
const isTouch = matchMedia('(pointer: coarse)').matches;
const lowEnd = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency || 8) <= 4;
let quality = params.get('q') || ((isTouch || lowEnd) ? 'low' : 'high');
const store = {
  get(k) { try { return localStorage.getItem('aigm:' + k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem('aigm:' + k, v); } catch { /* private mode */ } },
};
// Preview builds can point paths that are not bundled at the live site.
const REMOTE = window.ARCADE_REMOTE || '';
const LOCAL = window.ARCADE_LOCAL || null;
function url(p) {
  if (!p || /^https?:/.test(p)) return p;
  if (REMOTE && LOCAL && !LOCAL.some(pre => p.startsWith(pre))) return REMOTE + p;
  return p;
}

const C = {
  bg: 0x04060a, green: 0x35ff9a, cyan: 0x2de2ff, magenta: 0xff3dcf, amber: 0xffb92e, violet: 0x9a7bff, white: 0xeef6ff,
};
const hex = c => '#' + c.toString(16).padStart(6, '0');

// ---------- renderer ----------
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === 'high', powerPreference: 'high-performance', preserveDrawingBuffer: FILM });
renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 2 : 1.25));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(C.bg);
scene.fog = new THREE.FogExp2(0x050a0c, 0.016);
const camera = new THREE.PerspectiveCamera(innerWidth < 700 ? 64 : 55, innerWidth / innerHeight, 0.1, 400);

scene.add(new THREE.HemisphereLight(0x9fd0ff, 0x1a2a24, 1.6));
const sun = new THREE.DirectionalLight(0xbfe9ff, 0.9);
sun.position.set(10, 20, 8);
scene.add(sun);

let composer = null, bloom = null;
function setupComposer() {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.85, 0.55, 0.62);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
}
if (quality === 'high') setupComposer();

// ---------- text & textures ----------
const texLoader = new THREE.TextureLoader();
const FONT_SIGN = '"Orbitron", "Segoe UI", system-ui, sans-serif';
const FONT_TEXT = '"Inter", "Segoe UI", system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono", ui-monospace, Consolas, monospace';

function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function canvasTex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }

function fitText(g, text, maxW, size, weight, family) {
  let s = size;
  do { g.font = `${weight} ${s}px ${family}`; s -= 2; } while (g.measureText(text).width > maxW && s > 10);
  return s + 2;
}

// Neon sign: glowing text on a dark plate with a coloured rim.
function signTexture(text, color, { w = 1024, h = 192, sub = '', plate = true, size = 104 } = {}) {
  const [c, g] = makeCanvas(w, h);
  const col = hex(color);
  if (plate) {
    g.fillStyle = 'rgba(4,8,10,0.92)';
    roundRect(g, 6, 6, w - 12, h - 12, 22); g.fill();
    g.lineWidth = 6; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 18; g.stroke(); g.shadowBlur = 0;
  }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const ty = sub ? h * 0.42 : h / 2;
  fitText(g, text, w - 80, size, 800, FONT_SIGN);
  g.shadowColor = col; g.shadowBlur = 24; g.fillStyle = col; g.fillText(text, w / 2, ty);
  g.shadowBlur = 6; g.fillStyle = '#ffffff'; g.globalAlpha = 0.55; g.fillText(text, w / 2, ty); g.globalAlpha = 1;
  if (sub) {
    g.shadowBlur = 0; fitText(g, sub, w - 100, Math.round(size * 0.36), 600, FONT_TEXT);
    g.fillStyle = 'rgba(220,255,240,0.85)'; g.fillText(sub, w / 2, h * 0.78);
  }
  return canvasTex(c);
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function wrapLines(g, text, maxW) {
  const words = text.split(' '); const lines = []; let line = '';
  for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (g.measureText(t).width > maxW && line) { lines.push(line); line = wd; } else line = t; }
  if (line) lines.push(line); return lines;
}
// Info panel: title + paragraph, for pipeline stands and text-only exhibits.
function panelTexture(title, body, color, { w = 768, h = 1024, kicker = '' } = {}) {
  const [c, g] = makeCanvas(w, h); const col = hex(color);
  const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, 'rgba(6,20,18,0.95)'); grd.addColorStop(1, 'rgba(2,6,8,0.95)');
  g.fillStyle = grd; roundRect(g, 8, 8, w - 16, h - 16, 26); g.fill();
  g.lineWidth = 6; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 20; g.stroke(); g.shadowBlur = 0;
  let y = 90; g.textAlign = 'left';
  if (kicker) { g.font = `700 54px ${FONT_MONO}`; g.fillStyle = col; g.fillText(kicker, 56, y); y += 90; }
  g.font = `800 62px ${FONT_SIGN}`; g.fillStyle = '#ffffff';
  for (const ln of wrapLines(g, title, w - 112)) { g.fillText(ln, 56, y); y += 74; }
  y += 24; g.font = `500 38px ${FONT_TEXT}`; g.fillStyle = 'rgba(215,255,240,0.88)';
  for (const ln of wrapLines(g, body, w - 112)) { if (y > h - 60) break; g.fillText(ln, 56, y); y += 52; }
  return canvasTex(c);
}
// Striped awning cloth.
function awningTexture(color) {
  const [c, g] = makeCanvas(256, 64);
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? hex(color) : '#101418'; g.fillRect(i * 32, 0, 32, 64); }
  const t = canvasTex(c); t.wrapS = THREE.RepeatWrapping; return t;
}
// Placeholder card for exhibits without art.
function cardTexture(title, line, color) {
  const [c, g] = makeCanvas(640, 400); const col = hex(color);
  g.fillStyle = '#071012'; g.fillRect(0, 0, 640, 400);
  g.strokeStyle = col; g.globalAlpha = 0.25; for (let x = 0; x < 640; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 400); g.stroke(); } g.globalAlpha = 1;
  g.textAlign = 'center'; g.fillStyle = col; g.font = `800 52px ${FONT_SIGN}`;
  wrapLines(g, title, 560).forEach((l, i) => g.fillText(l, 320, 170 + i * 60));
  g.font = `500 28px ${FONT_MONO}`; g.fillStyle = '#cfe'; g.fillText(line, 320, 330);
  return canvasTex(c);
}

// ---------- digital rain material ----------
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789ABCDEF<>/{}=+*#';
function glyphAtlas() {
  const [c, g] = makeCanvas(512, 512);
  g.fillStyle = '#000'; g.fillRect(0, 0, 512, 512);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `700 50px ${FONT_MONO}`;
  for (let i = 0; i < 64; i++) {
    const ch = GLYPHS[i % GLYPHS.length]; const x = (i % 8) * 64 + 32, y = Math.floor(i / 8) * 64 + 34;
    g.save(); g.translate(x, y); if (i % 3 === 0) g.scale(-1, 1); g.fillText(ch, 0, 0); g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter; return t;
}
let atlas;
const rainMats = [];
function rainMaterial(color, cols, rows, opacity = 1, speed = 1) {
  const m = new THREE.ShaderMaterial({
    uniforms: { atlas: { value: atlas }, time: { value: 0 }, color: { value: new THREE.Color(color) }, grid: { value: new THREE.Vector2(cols, rows) }, opacity: { value: opacity }, speed: { value: speed } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `
      uniform sampler2D atlas; uniform float time; uniform vec3 color; uniform vec2 grid; uniform float opacity; uniform float speed;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      void main(){
        vec2 g = vUv * grid; vec2 cell = floor(g); vec2 f = fract(g);
        float sp = (0.5 + hash(vec2(cell.x, 1.0)) * 1.3) * speed;
        float len = grid.y * (0.25 + hash(vec2(cell.x, 3.0)) * 0.5);
        float head = mod(time * sp * 5.0 + hash(vec2(cell.x, 7.0)) * grid.y * 2.0, grid.y + len * 2.0);
        float y = grid.y - cell.y;
        float d = head - y;
        float trail = (d < 0.0 || d > len) ? 0.0 : pow(1.0 - d / len, 1.6);
        float gi = floor(hash(cell + floor(time * (0.6 + hash(cell) * 2.5))) * 64.0);
        vec2 auv = vec2((mod(gi, 8.0) + f.x) / 8.0, 1.0 - (floor(gi / 8.0) + 1.0 - f.y) / 8.0);
        float glyph = texture2D(atlas, auv).r;
        float headGlow = smoothstep(1.2, 0.0, abs(d));
        vec3 c = color * trail * glyph * 0.9 + vec3(0.85, 1.0, 0.92) * headGlow * glyph;
        gl_FragColor = vec4(c * opacity, 1.0);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false,
  });
  rainMats.push(m); return m;
}

// ---------- layout ----------
const W = 2.4;            // half width of walkable avenue
const PLAZA = 10;         // plaza half size
const ROW = 4.6;          // distance between stall rows
const VROW = 3.9;         // tighter rows in the vault
const DISTRICT = {
  games: { name: 'GAMES', color: C.magenta },
  library: { name: 'TEARDOWN LIBRARY', color: C.amber },
  workshop: { name: 'ROBLOX · UI/UX · TOOLS', color: C.cyan },
  how: { name: 'HOW I WORK', color: C.green },
};
const exhibits = [];      // everything the player can walk up to
const clickables = [];    // meshes for raycasting
const animated = [];      // per-frame callbacks
const zones = [];         // walkable rectangles {x0,x1,z0,z1,name}

// Avenues run along an axis: dir = unit vector away from plaza; side vector = perpendicular.
function avenue(key, dir) {
  const side = new THREE.Vector3(-dir.z, 0, dir.x); // left-hand side
  return { key, dir, side, start: PLAZA, cursor: PLAZA + 3 };
}
const AV = {
  games: avenue('games', new THREE.Vector3(0, 0, -1)),
  library: avenue('library', new THREE.Vector3(1, 0, 0)),
  workshop: avenue('workshop', new THREE.Vector3(-1, 0, 0)),
  how: avenue('how', new THREE.Vector3(0, 0, 1)),
};
function avPoint(av, along, across, y = 0) {
  return new THREE.Vector3().addScaledVector(av.dir, along).addScaledVector(av.side, across).setY(y);
}
// Rotation that makes an object's +Z face the avenue centre line from the given side.
function faceCentre(av, sideSign) {
  const n = av.side.clone().multiplyScalar(-sideSign);
  return Math.atan2(n.x, n.z);
}

const mats = {
  dark: new THREE.MeshStandardMaterial({ color: 0x1a252b, roughness: 0.5, metalness: 0.35 }),
  darker: new THREE.MeshStandardMaterial({ color: 0x0b1317, roughness: 0.8, metalness: 0.2 }),
  screenOff: new THREE.MeshBasicMaterial({ color: 0x0a1a16 }),
};
const neonMat = new Map();
function neon(color, intensity = 1) {
  const k = color + ':' + intensity;
  if (!neonMat.has(k)) neonMat.set(k, new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), toneMapped: false }));
  return neonMat.get(k);
}
function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
function plane(w, h, mat) { return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); }

function signMesh(text, color, w, h, opts) {
  const m = plane(w, h, new THREE.MeshBasicMaterial({ map: signTexture(text, color, opts), transparent: true, toneMapped: false }));
  return m;
}

// Hanging section banner across an avenue.
function sectionArch(av, along, title, color, sub) {
  const g = new THREE.Group();
  const p = avPoint(av, along, 0);
  g.position.copy(p); g.rotation.y = Math.atan2(-av.dir.x, -av.dir.z);
  for (const s of [-1, 1]) {
    const post = box(0.18, 5.6, 0.18, mats.dark); post.position.set(s * 4.3, 2.8, 0); g.add(post);
    const strip = box(0.06, 5.6, 0.2, neon(color, 0.9)); strip.position.set(s * 4.3, 2.8, 0.06); g.add(strip);
  }
  const bar = box(8.8, 0.16, 0.16, neon(color, 1.2)); bar.position.y = 5.6; g.add(bar);
  const sign = signMesh(title, color, 5.2, 0.98, { sub, h: 192 }); sign.position.set(0, 4.75, 0.02); g.add(sign);
  const back = sign.clone(); back.rotation.y = Math.PI; back.position.z = -0.02; g.add(back);
  scene.add(g);
}

// Big district gate where an avenue meets the plaza.
function districtGate(av, color, title, sub) {
  const g = new THREE.Group();
  g.position.copy(avPoint(av, PLAZA - 0.5, 0)); g.rotation.y = Math.atan2(-av.dir.x, -av.dir.z);
  for (const s of [-1, 1]) {
    const pillar = box(0.7, 7.4, 0.7, mats.dark); pillar.position.set(s * 4.8, 3.7, 0); g.add(pillar);
    const rain = plane(0.6, 7.2, rainMaterial(color, 4, 36, 1.1, 1.4)); rain.position.set(s * 4.8, 3.7, 0.36); g.add(rain);
    const rain2 = rain.clone(); rain2.rotation.y = Math.PI; rain2.position.z = -0.36; g.add(rain2);
  }
  const top = box(10.3, 0.5, 0.7, mats.dark); top.position.y = 7.5; g.add(top);
  const line = box(10.3, 0.07, 0.75, neon(color, 1.4)); line.position.y = 7.24; g.add(line);
  const sign = signMesh(title, color, 8.4, 1.6, { sub, h: 240, size: 120 }); sign.position.set(0, 8.75, 0.05); g.add(sign);
  const back = signMesh(title, color, 8.4, 1.6, { sub, h: 240, size: 120 }); back.rotation.y = Math.PI; back.position.set(0, 8.75, -0.05); g.add(back);
  scene.add(g);
}

// String lights over avenues.
const bulbGeo = new THREE.SphereGeometry(0.07, 8, 6);
const bulbs = [];
function stringLights(a, b, color, n = 14, sag = 0.9) {
  for (let i = 0; i <= n; i++) {
    const t = i / n; const p = a.clone().lerp(b, t); p.y -= Math.sin(t * Math.PI) * sag;
    bulbs.push({ p, color: new THREE.Color(color).multiplyScalar(1.6) });
  }
}
function flushBulbs() {
  const mesh = new THREE.InstancedMesh(bulbGeo, new THREE.MeshBasicMaterial({ toneMapped: false }), bulbs.length);
  const m = new THREE.Matrix4();
  bulbs.forEach((b, i) => { m.makeTranslation(b.p.x, b.p.y, b.p.z); mesh.setMatrixAt(i, m); mesh.setColorAt(i, b.color); });
  scene.add(mesh);
}

// Floor marking along an avenue.
function avenueFloor(av, length, color) {
  const mid = avPoint(av, PLAZA + length / 2, 0, 0.012);
  const horiz = Math.abs(av.dir.x) > 0.5;
  const floor = plane(horiz ? length : 2 * W + 0.4, horiz ? 2 * W + 0.4 : length, new THREE.MeshStandardMaterial({ color: 0x0b1418, roughness: 0.4, metalness: 0.5 }));
  floor.rotation.x = -Math.PI / 2; floor.position.copy(mid); scene.add(floor);
  for (const s of [-1, 1]) {
    const edge = plane(horiz ? length : 0.07, horiz ? 0.07 : length, neon(color, 1.1));
    edge.rotation.x = -Math.PI / 2; edge.position.copy(avPoint(av, PLAZA + length / 2, s * (W + 0.2), 0.02)); scene.add(edge);
  }
  // dashed centre line
  for (let d = PLAZA + 1; d < PLAZA + length; d += 2.4) {
    const dash = plane(horiz ? 0.9 : 0.09, horiz ? 0.09 : 0.9, neon(color, 0.45));
    dash.rotation.x = -Math.PI / 2; dash.position.copy(avPoint(av, d, 0, 0.022)); scene.add(dash);
  }
  const x0 = Math.min(mid.x - (horiz ? length / 2 : W), mid.x + (horiz ? length / 2 : W));
  const x1 = Math.max(mid.x - (horiz ? length / 2 : W), mid.x + (horiz ? length / 2 : W));
  const z0 = Math.min(mid.z - (horiz ? W : length / 2), mid.z + (horiz ? W : length / 2));
  const z1 = Math.max(mid.z - (horiz ? W : length / 2), mid.z + (horiz ? W : length / 2));
  zones.push({ name: av.key, x0: x0 - (horiz ? 2 : 0), x1: x1 + (horiz ? 2 : 0), z0: z0 - (horiz ? 0 : 2), z1: z1 + (horiz ? 0 : 2) });
}

function towerFree(p, w) {
  if (Math.hypot(p.x, p.z) < PLAZA + 9 + w) return false;
  for (const av of Object.values(AV)) {
    const along = p.x * av.dir.x + p.z * av.dir.z, across = Math.abs(p.x * av.side.x + p.z * av.side.z);
    if (along > 0 && across < 10 + w / 2) return false;
  }
  return true;
}
// Background "data towers" with digital rain on their faces.
function dataTowers(av, length, color) {
  for (const s of [-1, 1]) {
    for (let d = PLAZA - 4; d < PLAZA + length + 6; d += 5 + Math.random() * 3) {
      const h = 9 + Math.random() * 24, w = 3 + Math.random() * 3.5;
      const pos = avPoint(av, d, s * (13 + Math.random() * 8), h / 2);
      if (!towerFree(pos, w)) continue;
      const t = box(w, h, w, mats.darker); t.position.copy(pos); scene.add(t);
      const face = plane(w * 0.92, h * 0.96, rainMaterial(Math.random() < 0.8 ? C.green : color, Math.round(w * 3), Math.round(h * 2.4), 0.7, 0.8 + Math.random() * 0.6));
      face.position.copy(pos).addScaledVector(av.side, -s * (w / 2 + 0.02)); face.rotation.y = faceCentre(av, s); scene.add(face);
      if (Math.random() < 0.5) { const cap = box(w + 0.1, 0.08, w + 0.1, neon(color, 0.8)); cap.position.copy(pos).setY(h); scene.add(cap); }
    }
  }
}

// ---------- exhibits ----------
function registerExhibit(ex) {
  exhibits.push(ex);
  if (ex.hit) { ex.hit.userData.exhibit = ex; clickables.push(ex.hit); }
  return ex;
}

function setScreenMaterial(mesh, map, w, h) {
  mesh.material = new THREE.MeshBasicMaterial({ map, toneMapped: false });
  mesh.material.color.setScalar(0.92);
}

// Market stall that shows a cover or a gameplay loop. Used for games and projects.
function stall(av, along, sideSign, item, color, kind) {
  const g = new THREE.Group();
  const base = avPoint(av, along, sideSign * (W + 1.75));
  g.position.copy(base); g.rotation.y = faceCentre(av, sideSign);
  const counter = box(2.9, 1.0, 1.0, mats.dark); counter.position.set(0, 0.5, 0.2); g.add(counter);
  const lip = box(2.94, 0.06, 1.04, neon(color, 0.9)); lip.position.set(0, 1.0, 0.2); g.add(lip);
  const back = box(3.1, 3.4, 0.2, mats.darker); back.position.set(0, 2.4, -0.45); g.add(back);
  for (const s of [-1, 1]) { const post = box(0.12, 4.1, 0.12, mats.dark); post.position.set(s * 1.5, 2.05, 0.75); g.add(post); }
  const awning = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 1.6), new THREE.MeshStandardMaterial({ map: awningTexture(color), roughness: 0.7, emissive: new THREE.Color(color), emissiveIntensity: 0.12 }));
  awning.material.map.repeat.set(3, 1); awning.position.set(0, 4.15, 0.25); awning.rotation.x = -0.18; g.add(awning);
  const valance = box(3.4, 0.05, 0.05, neon(color, 1.3)); valance.position.set(0, 4.02, 1.02); g.add(valance);
  const sign = signMesh(item.title, color, 3.1, 0.5, { h: 160, size: 92 }); sign.position.set(0, 3.7, 1.06); g.add(sign);

  // screen: size follows the cover's aspect once it loads
  const frame = box(2.7, 1.6, 0.06, neon(color, 0.55)); frame.position.set(0, 2.42, -0.33); g.add(frame);
  const screen = plane(2.6, 1.5, mats.screenOff); screen.position.set(0, 2.42, -0.29); g.add(screen);
  const fit = (aspect) => {
    const maxW = 2.6, maxH = 2.05; let w = maxW, h = w / aspect; if (h > maxH) { h = maxH; w = h * aspect; }
    screen.scale.set(w / 2.6, h / 1.5, 1); frame.scale.set((w + 0.1) / 2.7, (h + 0.1) / 1.6, 1);
    const y = 1.25 + h / 2 + 0.1; screen.position.y = y; frame.position.y = y;
  };
  const coverPath = item.cover || (item.img ? `arcade/proj/${item.img}.jpg` : null);
  let coverTex = null;
  if (coverPath) {
    texLoader.load(url(coverPath), t => { t.colorSpace = THREE.SRGBColorSpace; coverTex = t; fit(t.image.width / t.image.height); if (!ex.videoOn) setScreenMaterial(screen, t); });
  } else {
    coverTex = cardTexture(item.title, item.zone === 'Tools' ? 'Python · Telegram' : '', color); setScreenMaterial(screen, coverTex); fit(1.6);
  }
  if (item.section === 'New releases') {
    const tag = signMesh('NEW', C.green, 0.9, 0.34, { h: 128, size: 88 }); tag.position.set(1.05, 3.28, 1.07); g.add(tag);
  }
  const pad = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.74, 40), neon(color, 0.5).clone());
  pad.material.transparent = true; pad.material.opacity = 0.35;
  pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.03, 2.25); g.add(pad);
  const hit = box(3.2, 4.2, 2.2, new THREE.MeshBasicMaterial({ visible: false })); hit.position.set(0, 2.1, 0.3); g.add(hit);
  scene.add(g);

  // projects without a gameplay loop flip through their gallery while you are nearby
  const slides = !item.video && (item.gallery || []).filter(gi => gi.type === 'img');
  if (slides && slides.length > 1) {
    const cache = []; let idx = 0, next = 3;
    animated.push(t => {
      if (t < next || base.distanceTo(state.pos) > 22) return;
      next = t + 3.5; idx = (idx + 1) % slides.length; const k = idx;
      const apply = tex => { fit(tex.image.width / tex.image.height); setScreenMaterial(screen, tex); };
      if (cache[k]) apply(cache[k]); else texLoader.load(url(slides[k].src), tex => { tex.colorSpace = THREE.SRGBColorSpace; cache[k] = tex; apply(tex); });
    });
  }
  const padWorld = avPoint(av, along, sideSign * (W - 0.55));
  const ex = registerExhibit({
    kind, item, color, group: g, hit, pad, screen, padWorld, facing: base.clone().setY(1.6),
    zone: av.key, video: item.video, videoOn: false, coverTex, fit,
    setActive(on) { pad.material.opacity = on ? 1 : 0.35; frame.material = neon(color, on ? 1.4 : 0.55); },
  });
  return ex;
}

// Wall of phone screens from the Figma projects; tap a screen to open it full size.
function figmaWall(av, along, sideSign, projects, color) {
  const shots = projects.flatMap(p => p.gallery.map((g, i) => ({ p, g, i })));
  const sw = 0.86, sh = sw * 844 / 390, gap = 0.2, width = shots.length * (sw + gap) + 0.6;
  const g = new THREE.Group();
  const base = avPoint(av, along + width / 2, sideSign * (W + 1.6));
  g.position.copy(base); g.rotation.y = faceCentre(av, sideSign);
  const back = box(width, sh + 1.5, 0.25, mats.darker); back.position.set(0, (sh + 1.5) / 2 + 0.3, -0.2); g.add(back);
  for (const y of [0.3, sh + 1.8]) { const l = box(width, 0.06, 0.3, neon(color, 1.2)); l.position.set(0, y, -0.05); g.add(l); }
  const title = signMesh('FIGMA WALL', color, 3.6, 0.6, { sub: 'paid client UI · tap a screen', h: 200, size: 110 }); title.position.set(0, sh + 2.35, 0); g.add(title);
  const wall = registerExhibit({ kind: 'wall', item: { title: 'Figma wall', projects }, color, group: g, padWorld: avPoint(av, along + width / 2, sideSign * (W - 0.6)), facing: base.clone().setY(1.6), zone: av.key, radius: width / 2,
    setActive(on) { title.scale.setScalar(on ? 1.06 : 1); } });
  shots.forEach((s, k) => {
    const x = -width / 2 + 0.3 + sw / 2 + k * (sw + gap) + gap / 2;
    const frame = box(sw + 0.08, sh + 0.08, 0.05, neon(color, 0.5)); frame.position.set(x, 0.55 + sh / 2, -0.04); g.add(frame);
    const scr = plane(sw, sh, mats.screenOff); scr.position.set(x, 0.55 + sh / 2, 0); g.add(scr);
    texLoader.load(url(s.g.src), t => { t.colorSpace = THREE.SRGBColorSpace; setScreenMaterial(scr, t); });
    scr.userData.exhibit = wall; scr.userData.shot = s; clickables.push(scr);
    if (k === 0 || shots[k - 1].p !== s.p) { const lab = signMesh(s.p.title, color, 2.6, 0.32, { h: 120, size: 64, plate: false }); lab.position.set(x - sw / 2 + 1.3, 0.3 + sh + 0.62, 0.02); g.add(lab); }
  });
  scene.add(g);
  return width;
}

// Display shelf with three teardown "books" facing the aisle.
function bookShelf(av, along, sideSign, books, color) {
  const g = new THREE.Group();
  const base = avPoint(av, along, sideSign * (W + 1.3));
  g.position.copy(base); g.rotation.y = faceCentre(av, sideSign);
  const body = box(3.5, 2.9, 0.6, mats.dark); body.position.set(0, 1.45, -0.2); g.add(body);
  const top = box(3.6, 0.07, 0.7, neon(color, 0.9)); top.position.set(0, 2.92, -0.15); g.add(top);
  const ledge = box(3.5, 0.06, 0.45, neon(color, 0.5)); ledge.position.set(0, 0.95, 0.2); g.add(ledge);
  scene.add(g);
  books.forEach((b, i) => {
    const x = (i - (books.length - 1) / 2) * 1.12;
    const bg = new THREE.Group(); bg.position.set(x, 1.0, 0.18); bg.rotation.x = -0.12; g.add(bg);
    const cover = box(0.9, 1.25, 0.07, mats.dark); cover.position.y = 0.66; bg.add(cover);
    const face = plane(0.86, 1.21, mats.screenOff); face.position.set(0, 0.66, 0.04); bg.add(face);
    if (b.thumb) texLoader.load(url(b.thumb), t => { t.colorSpace = THREE.SRGBColorSpace; t.center.set(0.5, 0.5); const a = t.image.width / t.image.height; if (a > 0.71) t.repeat.set(0.71 / a, 1); setScreenMaterial(face, t); });
    const label = plane(1.05, 0.3, new THREE.MeshBasicMaterial({ map: signTexture(b.title, color, { w: 512, h: 144, size: 60, plate: false }), transparent: true, toneMapped: false }));
    label.position.set(x, 2.55, 0.12); g.add(label);
    const hit = box(1.05, 1.6, 0.8, new THREE.MeshBasicMaterial({ visible: false })); hit.position.set(0, 0.7, 0.2); bg.add(hit);
    const world = new THREE.Vector3(); bg.getWorldPosition(world);
    const padWorld = avPoint(av, along, sideSign * (W - 0.5)).addScaledVector(av.dir, 0).add(new THREE.Vector3().copy(av.dir).multiplyScalar(0));
    // shift pad along the avenue to sit in front of this book
    const off = new THREE.Vector3(x, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), g.rotation.y);
    padWorld.add(off.setY(0));
    registerExhibit({
      kind: 'teardown', item: b, color, group: bg, hit, padWorld, facing: world.clone().setY(1.6), zone: av.key, radius: 1.5,
      setActive(on) { cover.material = on ? neon(color, 1.2) : mats.dark; bg.position.y = on ? 1.08 : 1.0; },
    });
  });
}

// Pipeline stand on the "How I work" avenue.
function pipelineStand(av, along, sideSign, step, color) {
  const g = new THREE.Group();
  const base = avPoint(av, along, sideSign * (W + 1.4));
  g.position.copy(base); g.rotation.y = faceCentre(av, sideSign);
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.6, 8), mats.dark); ped.position.y = 0.3; g.add(ped);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.03, 6, 40), neon(color, 1.2)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.62; g.add(ring);
  const panel = plane(2.1, 2.8, new THREE.MeshBasicMaterial({ map: panelTexture(step.title, step.text, color, { kicker: step.kicker }), transparent: true, toneMapped: false, side: THREE.DoubleSide }));
  panel.position.y = 2.25; g.add(panel);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 3.6, 16, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  beam.position.y = 2.2; g.add(beam);
  animated.push(t => { panel.position.y = 2.25 + Math.sin(t * 1.3 + along) * 0.06; });
  const hit = box(2.2, 3.6, 1.4, new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.8; g.add(hit);
  scene.add(g);
  registerExhibit({ kind: 'how', item: step, color, group: g, hit, padWorld: avPoint(av, along, sideSign * (W - 0.6)), facing: base.clone().setY(1.6), zone: av.key,
    setActive(on) { ring.material = neon(color, on ? 2.2 : 1.2); } });
}

// ---------- build the world ----------
function buildWorld() {
  atlas = glyphAtlas();

  // ground and the digital sky
  const ground = plane(700, 700, new THREE.MeshStandardMaterial({ color: 0x05080a, roughness: 0.92, metalness: 0.1 }));
  ground.rotation.x = -Math.PI / 2; ground.name = 'ground'; scene.add(ground);
  const grid = new THREE.GridHelper(700, 350, 0x0e3a2a, 0x0a231b); grid.position.y = 0.005; grid.material.transparent = true; grid.material.opacity = 0.5; scene.add(grid);
  const sky = new THREE.Mesh(new THREE.CylinderGeometry(150, 150, 90, 64, 1, true), rainMaterial(C.green, 320, 70, quality === 'high' ? 0.55 : 0.4, 0.7));
  sky.position.y = 30; scene.add(sky);
  animated.push(() => { sky.position.x = camera.position.x; sky.position.z = camera.position.z; });

  // plaza
  const plazaFloor = new THREE.Mesh(new THREE.CircleGeometry(PLAZA + 1.5, 64), new THREE.MeshStandardMaterial({ color: 0x0a1215, roughness: 0.35, metalness: 0.6 }));
  plazaFloor.rotation.x = -Math.PI / 2; plazaFloor.position.y = 0.01; scene.add(plazaFloor);
  for (const r of [3.2, 6.5, PLAZA + 1.2]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.06, 96), neon(C.green, 0.6)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02; scene.add(ring);
  }
  zones.push({ name: 'plaza', x0: -PLAZA, x1: PLAZA, z0: -PLAZA, z1: PLAZA });
  buildKiosk();

  // GAMES avenue: sections from data
  const gav = AV.games; let d = PLAZA + 2.5;
  for (const sec of SECTIONS) {
    const items = GAMES.filter(gm => gm.section === sec);
    if (!items.length) continue;
    sectionArch(gav, d, sec.toUpperCase(), DISTRICT.games.color, `${items.length} playable`);
    d += 2.6;
    items.forEach((it, i) => { stall(gav, d + Math.floor(i / 2) * ROW, i % 2 ? -1 : 1, it, DISTRICT.games.color, 'game'); });
    d += Math.ceil(items.length / 2) * ROW + 1.2;
  }
  const gLen = d - PLAZA + 2;
  finishAvenue(gav, gLen, DISTRICT.games.color, 'THE END OF THE GAMES ROW', 'Map ⌖ jumps anywhere');

  // TEARDOWN LIBRARY avenue
  const lav = AV.library; d = PLAZA + 2.5;
  const cats = [...new Set(TEARDOWNS.map(t => t.cat))];
  for (const cat of cats) {
    const books = TEARDOWNS.filter(t => t.cat === cat);
    sectionArch(lav, d, cat.toUpperCase(), DISTRICT.library.color, `${books.length} teardowns`);
    d += 2.8;
    const units = []; for (let i = 0; i < books.length; i += 3) units.push(books.slice(i, i + 3));
    units.forEach((u, i) => bookShelf(lav, d + Math.floor(i / 2) * 4.2, i % 2 ? -1 : 1, u, DISTRICT.library.color));
    d += Math.ceil(units.length / 2) * 4.2 + 0.8;
  }
  finishAvenue(lav, d - PLAZA + 2, DISTRICT.library.color, '600+ GAMES ANALYSED', `${TEARDOWNS.length} of them are on these shelves`);

  // WORKSHOP avenue: Roblox, UI/UX, Tools
  const wav = AV.workshop; d = PLAZA + 2.5;
  const wz = [...new Set(PROJECTS.map(p => p.zone))];
  for (const z of wz) {
    const items = PROJECTS.filter(p => p.zone === z);
    sectionArch(wav, d, z.toUpperCase(), DISTRICT.workshop.color, z === 'UI/UX' ? 'paid client work' : z === 'Roblox' ? 'Luau · Rojo · CI' : 'apps & bots');
    d += 2.6;
    items.forEach((it, i) => stall(wav, d + Math.floor(i / 2) * ROW, i % 2 ? -1 : 1, it, DISTRICT.workshop.color, 'project'));
    d += Math.ceil(items.length / 2) * ROW + 1.2;
    if (z === 'UI/UX') d += figmaWall(wav, d, 1, items.filter(p => p.gallery && p.gallery.length), C.magenta) + 1.5;
  }
  // THE VAULT: every other prototype, further down the same street
  for (const sec of VAULT_SECTIONS) {
    const items = VAULT.filter(v => v.section === sec);
    if (!items.length) continue;
    sectionArch(wav, d + 0.6, sec.replace('Vault · ', 'VAULT · ').toUpperCase(), C.violet, `${items.length} prototypes · play them all`);
    d += 3.2;
    items.forEach((it, i) => stall(wav, d + Math.floor(i / 2) * VROW, i % 2 ? -1 : 1, it, C.violet, 'game'));
    d += Math.ceil(items.length / 2) * VROW + 1.2;
  }
  const wLen = d - PLAZA + 2;
  finishAvenue(wav, wLen, DISTRICT.workshop.color, 'MORE ON GITHUB', 'github.com/CondrusArsen');

  // HOW I WORK avenue, ending at the entrance gate
  const hav = AV.how;
  HOW.forEach((s, i) => pipelineStand(hav, PLAZA + 3 + i * 3.6, i % 2 ? 1 : -1, s, DISTRICT.how.color));
  const hLen = 3 + HOW.length * 3.6 + 5;
  avenueFloor(hav, hLen, DISTRICT.how.color);
  dataTowers(hav, hLen, DISTRICT.how.color);
  for (let i = 0; i < HOW.length - 1; i++) chevron(hav, PLAZA + 4.8 + i * 3.6, DISTRICT.how.color);
  entranceGate(hav, PLAZA + hLen - 1.5);
  START.copy(avPoint(hav, PLAZA + hLen - 3.5, 0));

  districtGate(gav, DISTRICT.games.color, 'GAMES', `${GAMES.length} playable in your browser`);
  districtGate(lav, DISTRICT.library.color, 'TEARDOWNS', `${TEARDOWNS.length} game analyses`);
  districtGate(wav, DISTRICT.workshop.color, 'WORKSHOP · VAULT', `Roblox · UI/UX · Tools · ${VAULT.length} prototypes`);

  // string lights across avenues
  for (const [av, color, len] of [[gav, C.magenta, gLen], [lav, C.amber, d], [wav, C.cyan, wLen], [hav, C.green, hLen]]) {
    for (let a = PLAZA + 4; a < PLAZA + len - 2; a += 7) stringLights(avPoint(av, a, -4.2, 4.9), avPoint(av, a + 3.5, 4.2, 4.9), [C.amber, color, C.green][Math.floor(a) % 3], 12, 0.7);
  }
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, b = a + Math.PI / 6; stringLights(new THREE.Vector3(Math.cos(a) * 9, 5.5, Math.sin(a) * 9), new THREE.Vector3(0, 7.2, 0), [C.green, C.magenta, C.amber, C.cyan][i % 4], 10, 0.4); }
  flushBulbs();
  spawnWanderers();
}

function finishAvenue(av, length, color, title, sub) {
  avenueFloor(av, length, color);
  dataTowers(av, length, color);
  const end = signMesh(title, color, 6.4, 1.2, { sub, h: 240, size: 96 });
  end.position.copy(avPoint(av, PLAZA + length + 1.5, 0, 3)); end.rotation.y = Math.atan2(-av.dir.x, -av.dir.z); scene.add(end);
  const wall = box(9, 6, 0.4, mats.darker); wall.position.copy(avPoint(av, PLAZA + length + 1.8, 0, 3)); wall.rotation.y = end.rotation.y; scene.add(wall);
}

function chevron(av, along, color) {
  const shape = new THREE.Shape(); shape.moveTo(-0.5, 0); shape.lineTo(0, 0.45); shape.lineTo(0.5, 0); shape.lineTo(0.5, 0.18); shape.lineTo(0, 0.63); shape.lineTo(-0.5, 0.18);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), neon(color, 0.9));
  m.rotation.x = -Math.PI / 2; m.rotation.z = Math.atan2(av.dir.x, -av.dir.z) + Math.PI;
  m.position.copy(avPoint(av, along, 0, 0.03)); scene.add(m);
  animated.push(t => { m.material.opacity = 1; m.position.y = 0.03; m.scale.setScalar(1 + Math.sin(t * 4 - along) * 0.08); });
}

function entranceGate(av, along) {
  const g = new THREE.Group(); g.position.copy(avPoint(av, along, 0)); g.rotation.y = Math.atan2(-av.dir.x, -av.dir.z);
  for (const s of [-1, 1]) {
    const p = box(1.1, 9, 1.1, mats.dark); p.position.set(s * 5.4, 4.5, 0); g.add(p);
    for (const f of [0.56, -0.56]) { const r = plane(1.0, 8.8, rainMaterial(C.green, 5, 44, 1.3, 1.6)); r.position.set(s * 5.4, 4.5, f); if (f < 0) r.rotation.y = Math.PI; g.add(r); }
  }
  const top = box(12, 1.3, 1.1, mats.dark); top.position.y = 9.4; g.add(top);
  for (const y of [8.75, 10.05]) { const l = box(12, 0.07, 1.15, neon(C.green, 1.5)); l.position.y = y; g.add(l); }
  const sign = signMesh('AI GAME MARKET', C.green, 10.4, 1.2, { h: 200, size: 130, plate: false }); sign.position.set(0, 9.4, 0.58); g.add(sign);
  const sign2 = sign.clone(); sign2.rotation.y = Math.PI; sign2.position.z = -0.58; g.add(sign2);
  const by = signMesh('by Arseni Atrokhov', C.cyan, 5, 0.5, { h: 120, size: 70, plate: false }); by.position.set(0, 10.7, 0.58); g.add(by);
  scene.add(g);
}

function buildKiosk() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.3, 1.1, 8), mats.dark); base.position.y = 0.55; g.add(base);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.05, 6, 8), neon(C.green, 1.4)); rim.rotation.x = Math.PI / 2; rim.position.y = 1.1; g.add(rim);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6.5, 24, 1, true), rainMaterial(C.green, 10, 40, 1.4, 1.5)); column.position.y = 4.3; g.add(column);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6.5, 12), neon(C.green, 0.6)); core.position.y = 4.3; g.add(core);
  // rotating stat ring
  const ring = new THREE.Group(); ring.position.y = 3.2; g.add(ring);
  STATS.forEach(([n, label], i) => {
    const a = i / STATS.length * Math.PI * 2;
    const s = signMesh(n, [C.magenta, C.amber, C.cyan][i], 2.0, 0.95, { sub: label, h: 256, size: 130 });
    s.position.set(Math.sin(a) * 1.9, 0, Math.cos(a) * 1.9); s.rotation.y = a; ring.add(s);
    const back = s.clone(); back.rotation.y = a + Math.PI; back.position.multiplyScalar(0.999); ring.add(back);
  });
  animated.push(t => { ring.rotation.y = t * 0.25; });
  const name = signMesh('ARSENI ATROKHOV', C.white, 6, 0.75, { sub: 'AI-assisted game developer · Roblox · HTML5', h: 220, size: 120, plate: false });
  name.position.y = 7.6; g.add(name);
  animated.push(() => { name.quaternion.copy(camera.quaternion); });
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 7, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 3.5; g.add(hit);
  scene.add(g);
  registerExhibit({ kind: 'about', item: { title: 'About me & contact' }, color: C.green, group: g, hit, padWorld: new THREE.Vector3(0, 0, 3.4), facing: new THREE.Vector3(0, 1.6, 0), zone: 'plaza', radius: 2.2,
    setActive(on) { rim.material = neon(C.green, on ? 2.6 : 1.4); } });
  // direction posts
  [['GAMES', C.magenta, Math.PI], ['TEARDOWNS', C.amber, Math.PI / 2], ['WORKSHOP · VAULT', C.cyan, -Math.PI / 2]].forEach(([t, c, a], i) => {
    const s = signMesh(t + '  ➜', c, 2.0, 0.4, { h: 128, size: 80 });
    s.position.set(Math.sin(a) * 0.55, 1.7 + i * 0.5, Math.cos(a) * 0.55); s.rotation.y = a - Math.PI / 2; scene.add(s);
  });
}

const HOW = [
  { kicker: '01 · REFERENCE', title: 'Pick a game worth learning from', text: 'I choose the reference game and the gameplay recordings to study: what makes it fun, and what the market already proved.' },
  { kicker: '02 · TEARDOWN', title: 'Take it apart', text: 'AI agents draft a teardown from the footage: core loop, rules, numbers, economy, FTUE. Every claim is tagged observed, inferred or unknown, and I review it.' },
  { kicker: '03 · DESIGN SPEC', title: 'Decide what changes', text: 'I write the design: theme, which rules stay, which change, what is new. Every rule maps back to the teardown.' },
  { kicker: '04 · BUILD & QA', title: 'Ship a playable build', text: 'AI coding agents write the code from my spec. I playtest on phone and desktop, run bots and rule tests, and send the fixes back.' },
];
const START = new THREE.Vector3();

// Shopper bots that stroll the avenues, so the market feels alive.
const wanderers = [];
function robotMesh(body = 0xe9f2ff, visor = C.cyan) {
  const g = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.45, 6, 16), new THREE.MeshStandardMaterial({ color: body, roughness: 0.3, metalness: 0.2 }));
  torso.position.y = 0.68; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14), torso.material); head.position.y = 1.32; g.add(head);
  const vis = box(0.36, 0.1, 0.12, neon(visor, 1.6)); vis.position.set(0, 1.34, 0.22); g.add(vis);
  const ant = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), neon(visor, 2)); ant.position.y = 1.68; g.add(ant);
  const stick = box(0.02, 0.18, 0.02, mats.dark); stick.position.y = 1.58; g.add(stick);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.38, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.015; g.add(shadow);
  g.userData = { torso, head };
  return g;
}
function spawnWanderers() {
  const tints = [C.magenta, C.amber, C.green, C.violet, C.cyan, C.amber, C.violet, C.magenta];
  const routes = [[AV.games, 14, 60], [AV.games, 20, 70], [AV.library, 14, 50], [AV.workshop, 13, 30], [AV.how, 11, 22], [AV.games, 30, 80], [AV.workshop, 40, 110], [AV.workshop, 90, 170]];
  routes.forEach(([av, a, b], i) => {
    const m = robotMesh(0x8fa3b8, tints[i]); m.scale.setScalar(0.85); scene.add(m);
    wanderers.push({ m, av, a, b, t: Math.random(), dir: 1, lane: (Math.random() - 0.5) * 2.4, speed: 0.012 + Math.random() * 0.01 });
  });
}

// ---------- player & controls ----------
const player = robotMesh();
scene.add(player);
const state = {
  pos: new THREE.Vector3(), yaw: Math.PI, camYaw: 0, pitch: innerWidth < 700 ? 0.6 : 0.38, dist: innerWidth < 700 ? 9.5 : 7.4,
  keys: new Set(), path: [], active: null, moved: 0, paused: true, joy: null, lastInteract: 0,
};

function inZones(x, z) {
  if (x * x + z * z < 2.5 * 2.5) return false; // kiosk
  return zones.some(r => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1);
}
function zoneOf(p) {
  if (Math.abs(p.x) <= PLAZA && Math.abs(p.z) <= PLAZA) return 'plaza';
  const z = zones.find(r => r.name !== 'plaza' && p.x >= r.x0 && p.x <= r.x1 && p.z >= r.z0 && p.z <= r.z1);
  return z ? z.name : 'plaza';
}
function entryOf(zone) { const av = AV[zone]; return av ? avPoint(av, PLAZA - 1.2, 0) : null; }
function tryMove(dx, dz) {
  const p = state.pos;
  if (inZones(p.x + dx, p.z + dz)) { p.x += dx; p.z += dz; return true; }
  if (inZones(p.x + dx, p.z)) { p.x += dx; return true; }
  if (inZones(p.x, p.z + dz)) { p.z += dz; return true; }
  return false;
}
// Camera yaw that looks at an exhibit diagonally from the avenue, with the plaza behind the camera.
function frameYaw(p, faceYaw) {
  const z = zoneOf(p), av = AV[z]; if (!av) return faceYaw + Math.PI;
  const toPlaza = Math.atan2(-av.dir.x, -av.dir.z);
  const diff = a => Math.abs(((a - toPlaza + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI);
  const a1 = faceYaw + Math.PI + 0.8, a2 = faceYaw + Math.PI - 0.8;
  return diff(a1) < diff(a2) ? a1 : a2;
}
// Walk to a point: through the plaza when it is on another avenue, around the kiosk when needed.
function walkTo(target, then) {
  const from = zoneOf(state.pos), to = zoneOf(target);
  const pts = [];
  if (from !== to) {
    if (from !== 'plaza') pts.push(entryOf(from));
    const a = from === 'plaza' ? state.pos : entryOf(from), b = to === 'plaza' ? target : entryOf(to);
    const ab = b.clone().sub(a), t = THREE.MathUtils.clamp(-a.dot(ab) / ab.lengthSq(), 0, 1);
    const closest = a.clone().addScaledVector(ab, t);
    if (closest.length() < 3.4) { const n = new THREE.Vector3(-ab.z, 0, ab.x).normalize().multiplyScalar(5.5); pts.push(n); }
    if (to !== 'plaza') pts.push(entryOf(to));
  }
  pts.push(target.clone());
  state.path = pts; state.onArrive = then || null;
}
function teleport(p, faceTo) {
  fade(() => {
    state.pos.copy(p); state.path = [];
    if (faceTo) { const d = faceTo.clone().sub(p); state.yaw = Math.atan2(d.x, d.z); state.camYaw = frameYaw(p, state.yaw); }
    snapCamera();
  });
}

addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input,textarea')) return;
  if (modalOpen()) { if (e.key === 'Escape') closeModal(); else if (galleryKeys && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) galleryKeys(e.key === 'ArrowLeft' ? -1 : 1); return; }
  const k = e.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', 'q'].includes(k)) { state.keys.add(k); state.path = []; e.preventDefault(); }
  if ((k === 'e' || k === 'enter') && state.active) primaryAction(state.active);
  if (k === 'm') toggleMap();
  if (k === 'escape') { closeMap(); }
});
addEventListener('keyup', e => state.keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => state.keys.clear());

// pointer: drag to look, click/tap to walk or select
const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
let drag = null;
const touches = new Map(); let pinch = null; // two fingers = zoom
const pinchDist = () => { const [a, b] = [...touches.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
canvas.addEventListener('pointerdown', e => { touches.set(e.pointerId, { x: e.clientX, y: e.clientY }); });
canvas.addEventListener('pointermove', e => {
  if (!touches.has(e.pointerId)) return; touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (touches.size === 2) { const d = pinchDist(); if (!pinch) pinch = { d, dist: state.dist }; state.dist = THREE.MathUtils.clamp(pinch.dist * pinch.d / Math.max(d, 1), 4, 15); if (drag) drag.moved = 99; }
});
const endTouch = e => { touches.delete(e.pointerId); if (touches.size < 2) pinch = null; };
canvas.addEventListener('pointerup', endTouch); canvas.addEventListener('pointercancel', endTouch);
canvas.addEventListener('pointerdown', e => { if (touches.size > 1) return; drag = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId, yaw: state.camYaw, pitch: state.pitch }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => {
  if (pinch) return;
  if (!drag || drag.id !== e.pointerId) { hover(e); return; }
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
  if (drag.moved > 6) { state.camYaw = drag.yaw - dx * 0.006; state.pitch = THREE.MathUtils.clamp(drag.pitch + dy * 0.003, 0.15, 1.1); state.userCam = performance.now(); }
});
canvas.addEventListener('pointerup', e => {
  if (!drag) return; const wasClick = drag.moved < 8; drag = null;
  if (wasClick && !state.paused) pick(e.clientX, e.clientY);
});
canvas.addEventListener('wheel', e => { state.dist = THREE.MathUtils.clamp(state.dist + e.deltaY * 0.006, 4, 15); e.preventDefault(); }, { passive: false });

function setNdc(x, y) { ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); }
function hover(e) {
  if (isTouch || state.paused) return;
  setNdc(e.clientX, e.clientY);
  const hit = ray.intersectObjects(clickables, false)[0];
  canvas.style.cursor = hit ? 'pointer' : 'default';
}
function pick(x, y) {
  setNdc(x, y);
  const hit = ray.intersectObjects(clickables, false)[0];
  if (hit && hit.object.userData.shot) { const s = hit.object.userData.shot; openProject(s.p, s.i); return; }
  if (hit) { const ex = hit.object.userData.exhibit; goToExhibit(ex); return; }
  const g = ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3());
  if (g && inZones(g.x, g.z)) { walkTo(g); marker(g); }
}
function goToExhibit(ex, instant) {
  if (instant) { teleport(ex.padWorld, ex.facing); return; }
  walkTo(ex.padWorld, () => { const d = ex.facing.clone().sub(state.pos); state.yaw = Math.atan2(d.x, d.z); state.camYaw = frameYaw(state.pos, state.yaw); state.userCam = 0; });
}
const clickMark = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.3, 24), neon(C.green, 1.5)); clickMark.material = clickMark.material.clone(); clickMark.material.transparent = true;
clickMark.rotation.x = -Math.PI / 2; clickMark.visible = false; scene.add(clickMark);
function marker(p) { clickMark.position.copy(p).setY(0.04); clickMark.visible = true; clickMark.userData.t = 0; }

// virtual joystick (touch)
const joyEl = document.getElementById('joy');
if (isTouch) {
  joyEl.hidden = false; const knob = joyEl.firstElementChild;
  joyEl.addEventListener('pointerdown', e => { state.joy = { id: e.pointerId, cx: e.clientX, cy: e.clientY, x: 0, y: 0 }; joyEl.setPointerCapture(e.pointerId); state.path = []; e.stopPropagation(); });
  joyEl.addEventListener('pointermove', e => {
    if (!state.joy || state.joy.id !== e.pointerId) return;
    let dx = e.clientX - state.joy.cx, dy = e.clientY - state.joy.cy; const l = Math.hypot(dx, dy), m = 42;
    if (l > m) { dx *= m / l; dy *= m / l; } state.joy.x = dx / m; state.joy.y = dy / m; knob.style.transform = `translate(${dx}px,${dy}px)`;
  });
  const end = () => { state.joy = null; knob.style.transform = ''; };
  joyEl.addEventListener('pointerup', end); joyEl.addEventListener('pointercancel', end);
}

// ---------- per-frame ----------
const tmp = new THREE.Vector3();
function updatePlayer(dt) {
  let mx = 0, mz = 0; const k = state.keys;
  if (k.has('w') || k.has('arrowup')) mz -= 1; if (k.has('s') || k.has('arrowdown')) mz += 1;
  if (k.has('a') || k.has('arrowleft')) mx -= 1; if (k.has('d') || k.has('arrowright')) mx += 1;
  if (state.joy) { mx += state.joy.x; mz += state.joy.y; }
  const speed = (k.has('shift') ? 9 : 5.6) * dt;
  let moving = false, before = state.pos.clone();
  if (mx || mz) {
    const l = Math.min(1, Math.hypot(mx, mz)); const a = Math.atan2(mx, mz) + state.camYaw;
    const dx = Math.sin(a) * speed * l, dz = Math.cos(a) * speed * l;
    if (tryMove(dx, dz)) { state.yaw = Math.atan2(dx, dz); moving = true; }
  } else if (state.path.length) {
    const t = state.path[0]; tmp.copy(t).sub(state.pos).setY(0); const dist = tmp.length();
    if (dist < 0.12) { state.path.shift(); if (!state.path.length) { clickMark.visible = false; state.onArrive && state.onArrive(); state.onArrive = null; } }
    else {
      const s = Math.min(dist, 6.4 * dt); tmp.normalize().multiplyScalar(s);
      if (!tryMove(tmp.x, tmp.z)) { state.pos.add(tmp); }
      state.yaw = Math.atan2(tmp.x, tmp.z); moving = true;
      if (!state.userCam || performance.now() - state.userCam > 2500) state.camYaw = lerpAngle(state.camYaw, state.yaw + Math.PI, 1 - Math.exp(-dt * 1.6));
    }
  }
  state.moved += before.distanceTo(state.pos);
  player.position.copy(state.pos);
  player.rotation.y = lerpAngle(player.rotation.y, state.yaw, 1 - Math.exp(-dt * 12));
  const bob = moving ? Math.sin(performance.now() * 0.018) * 0.06 : 0;
  player.userData.torso.position.y = 0.68 + Math.abs(bob); player.userData.head.position.y = 1.32 + Math.abs(bob) * 1.2;
  player.userData.torso.rotation.z = moving ? Math.sin(performance.now() * 0.009) * 0.08 : 0;
}
function lerpAngle(a, b, t) { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * t; }

const camTarget = new THREE.Vector3();
// Ideal camera spot: behind the player along camYaw, raised by the pitch angle (always above the floor).
function camIdeal(head) {
  const h = state.dist * Math.cos(state.pitch);
  return new THREE.Vector3(head.x + Math.sin(state.camYaw) * h, head.y + state.dist * Math.sin(state.pitch), head.z + Math.cos(state.camYaw) * h);
}
function updateCamera(dt, snap) {
  const head = state.pos.clone().add(new THREE.Vector3(0, 1.4, 0));
  let desired = camIdeal(head);
  // keep the camera inside the walkable corridor so stalls never block the view
  if (!camFree(desired.x, desired.z)) {
    let lo = 0, hi = 1; for (let i = 0; i < 8; i++) { const m = (lo + hi) / 2; const p = head.clone().lerp(desired, m); camFree(p.x, p.z) ? lo = m : hi = m; }
    const p = head.clone().lerp(desired, lo); p.y = Math.max(p.y, head.y + 1.6 + (1 - lo) * 2.2); desired = p;
  }
  desired.y = Math.max(desired.y, 1.2);
  const k = snap ? 1 : 1 - Math.exp(-dt * 6);
  camera.position.lerp(desired, k);
  // standing at an exhibit: aim between the player and the exhibit so the screen is in frame
  const look = state.pos.clone().add(new THREE.Vector3(0, 1.5, 0));
  if (state.active && !state.path.length && !state.keys.size && !state.joy && state.active.facing) look.lerp(state.active.facing.clone().setY(2.2), 0.45);
  camTarget.lerp(look, snap ? 1 : 1 - Math.exp(-dt * 4));
  camera.lookAt(camTarget);
}
function camFree(x, z) {
  return zones.some(r => x >= r.x0 - 0.6 && x <= r.x1 + 0.6 && z >= r.z0 - 0.6 && z <= r.z1 + 0.6) || Math.hypot(x, z) < PLAZA + 1;
}
function snapCamera() { updateCamera(0, true); }

function updateActive() {
  let best = null, bd = 1e9;
  for (const ex of exhibits) {
    const d = Math.hypot(ex.padWorld.x - state.pos.x, ex.padWorld.z - state.pos.z);
    if (d < (ex.radius || 2.5) && d < bd) { bd = d; best = ex; }
  }
  if (best !== state.active) {
    state.active && state.active.setActive(false);
    state.active = best; best && best.setActive(true);
    showCard(best);
    if (best) tutorial.event('near');
  }
}

// Lazy gameplay loops on stall screens: start near, stop far, at most 4 at a time.
const MAX_VIDEOS = quality === 'high' ? 4 : 2;
let videoCount = 0;
function updateVideos() {
  for (const ex of exhibits) {
    if (!ex.video) continue;
    const d = ex.padWorld.distanceTo(state.pos);
    if (!ex.videoOn && d < 13 && videoCount < MAX_VIDEOS) {
      const v = document.createElement('video'); v.src = url(ex.video); v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = 'anonymous'; v.preload = 'auto';
      v.play().catch(() => {}); ex.vel = v; ex.videoOn = true; videoCount++;
      const vt = new THREE.VideoTexture(v); vt.colorSpace = THREE.SRGBColorSpace; ex.vtex = vt;
      v.addEventListener('loadeddata', () => { if (ex.videoOn) { ex.fit && ex.fit(v.videoWidth / v.videoHeight); setScreenMaterial(ex.screen, vt); } }, { once: true });
    } else if (ex.videoOn && d > 18) {
      ex.vel.pause(); ex.vel.removeAttribute('src'); ex.vel.load(); ex.vtex.dispose(); ex.videoOn = false; videoCount--;
      if (ex.coverTex) { ex.fit(ex.coverTex.image.width / ex.coverTex.image.height); setScreenMaterial(ex.screen, ex.coverTex); }
    }
  }
}

function updateWanderers(dt) {
  for (const w of wanderers) {
    w.t += w.speed * w.dir * dt * 6; if (w.t > 1 || w.t < 0) { w.dir *= -1; w.t = THREE.MathUtils.clamp(w.t, 0, 1); }
    const along = w.a + (w.b - w.a) * w.t; const p = avPoint(w.av, along, w.lane);
    w.m.position.copy(p); w.m.rotation.y = Math.atan2(w.av.dir.x * w.dir, w.av.dir.z * w.dir);
    w.m.userData.torso.position.y = 0.68 + Math.abs(Math.sin(performance.now() * 0.012 + w.lane)) * 0.05;
  }
}

// ---------- UI ----------
const $ = s => document.querySelector(s);
const cardEl = $('#card');
function showCard(ex) {
  if (!ex) { cardEl.classList.remove('show'); return; }
  const it = ex.item; const btns = [];
  let thumb = '', kicker = '', text = '';
  if (ex.kind === 'game') {
    kicker = it.section + ' · ' + it.platforms.replace('Phone · Desktop', 'Phone + PC'); text = it.blurb; thumb = it.cover;
    btns.push(['play', '▶ Play here', true], ['how', 'How it was made']);
    if (it.teardown) btns.push(['td', 'Teardown']);
  } else if (ex.kind === 'teardown') {
    kicker = 'Teardown · ' + it.cat; text = it.sub; thumb = it.thumb; btns.push(['read', '📖 Read teardown', true]);
  } else if (ex.kind === 'project') {
    kicker = it.zone; text = it.blurb; thumb = it.img ? `arcade/proj/${it.img}.jpg` : '';
    if (it.app) btns.push(['app', '▶ Try it here', true]);
    btns.push(['details', it.gallery && it.gallery.length ? `Screens (${it.gallery.length})` : 'Details', !it.app]);
    it.links.forEach(([l, u], i) => btns.push(['link:' + i, l + ' ↗']));
  } else if (ex.kind === 'wall') {
    kicker = 'UI/UX · Figma'; text = 'Screen flows I designed by hand in Figma for paying clients. Tap any screen on the wall to see it full size.';
    it.projects.forEach((p, i) => btns.push(['wall:' + i, `${p.title.replace(/ (Mobile|Story).*/, '')} screens`, i === 0]));
  } else if (ex.kind === 'how') {
    kicker = it.kicker; text = it.text; btns.push(['pipeline', 'How I work with AI', true]);
  } else if (ex.kind === 'about') {
    kicker = 'Info kiosk'; text = 'AI-assisted game developer and designer. I direct AI coding agents from teardown to playable build.'; btns.push(['about', 'About me & contact', true], ['map', 'Open the map']);
  }
  cardEl.innerHTML = `${thumb ? `<img src="${url(thumb)}" alt="">` : ''}<div class="c-body"><div class="c-kicker" style="color:${hex(ex.color)}">${esc(kicker)}</div><h3>${esc(it.title)}</h3><p>${esc(text)}</p>
    <div class="c-btns">${btns.map(([a, l, main]) => `<button data-a="${a}" class="${main ? 'main' : ''}">${l}</button>`).join('')}</div>
    <div class="c-hint">${isTouch ? '' : 'E · ' + (ex.kind === 'game' ? 'play' : 'open')}</div></div>`;
  cardEl.style.setProperty('--accent', hex(ex.color));
  cardEl.classList.add('show');
  cardEl.querySelectorAll('button').forEach(b => b.onclick = () => action(ex, b.dataset.a));
}
function esc(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function primaryAction(ex) {
  const first = ex.kind === 'project' && ex.item.app ? 'app' : { game: 'play', teardown: 'read', project: 'details', how: 'pipeline', about: 'about', wall: 'wall:0' }[ex.kind];
  action(ex, first);
}
function action(ex, a) {
  const it = ex.item;
  if (a === 'play') { openFrame(it.title, url(it.play), { kind: 'game', id: it.id }); tutorial.event('play'); track('play/' + it.id); }
  else if (a === 'td') openFrame(TEARDOWNS.find(t => t.url === it.teardown)?.title + ' — teardown', url(it.teardown));
  else if (a === 'read') { openFrame(it.title + ' — teardown', url(it.url)); track('teardown/' + it.id); }
  else if (a === 'how') openInfo(it.title, `<p class="lead">${esc(it.blurb)}</p><h4>How it was made</h4><p>${esc(it.how)}</p>
      <ul class="facts"><li><b>Runs on</b> ${esc(it.platforms)}</li>${it.tags.length ? `<li><b>Tags</b> ${it.tags.map(esc).join(' · ')}</li>` : ''}${it.earlier ? `<li><b>Earlier build</b> <a href="#" data-frame="${url(it.earlier.url)}" data-title="${esc(it.earlier.title)}">${esc(it.earlier.title)}</a></li>` : ''}</ul>
      <div class="m-btns"><button class="main" data-play="${it.id}">▶ Play</button>${it.teardown ? `<a href="${url(it.teardown)}" target="_blank" rel="noopener">Read the teardown ↗</a>` : ''}</div>`);
  else if (a === 'details' || a.startsWith('shot:')) openProject(it, a.startsWith('shot:') ? +a.slice(5) : 0);
  else if (a === 'app') openFrame(it.title, url(it.app));
  else if (a.startsWith('wall:')) openProject(it.projects[+a.slice(5)], 0);
  else if (a.startsWith('link:')) window.open(it.links[+a.slice(5)][1], '_blank', 'noopener');
  else if (a === 'pipeline') openInfo('How I work with AI', PIPELINE_HTML);
  else if (a === 'about') openInfo('Arseni Atrokhov', ABOUT_HTML);
  else if (a === 'map') openMap();
}

const ABOUT_HTML = `<p class="lead">AI-assisted game developer and designer: Roblox (Luau) and HTML5. I take a game from teardown to a playable, tested build, directing AI coding agents and owning the design and the final quality.</p>
<div class="stats">${STATS.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('')}</div>
<p>Everything in this market was made that way, including the market itself: I designed it, AI agents wrote the code, I tested it on desktop and phones.</p>
<p>Looking for remote roles: AI game designer / prototyper, Roblox developer, HTML5 game developer.</p>
<div class="m-btns"><a class="main" href="${LINKS.linkedin}" target="_blank" rel="noopener">Message me on LinkedIn ↗</a><a href="${LINKS.github}" target="_blank" rel="noopener">GitHub ↗</a><a href="list/">All projects as a list</a></div>`;
const PIPELINE_HTML = `<p class="lead">Gameplay video → teardown → design spec → playable build → playtest and QA. AI agents draft the analysis and write most of the code. I direct the work and own the decisions.</p>
<h4>What I decide</h4><ul><li>Which reference game to study and which recordings to use.</li><li>What the adaptation is: theme, art direction, which rules stay, change or are new (onboarding, economy, pacing, meta-game).</li><li>Scope and priorities for each iteration, and what gets cut.</li><li>Whether a build feels right and is ready to show.</li></ul>
<h4>What the agents generate</h4><ul><li>Teardown drafts with evidence frames; each claim tagged observed, inferred or unknown.</li><li>A design document per game that maps every rule back to the teardown.</li><li>Game code (JavaScript/TypeScript, Canvas 2D, WebGL, three.js; Luau for Roblox) and test harnesses.</li><li>Asset sourcing with saved licence evidence and a generated credits screen.</li></ul>
<h4>How builds are checked</h4><ul><li>Rule tests on the simulation, save/restore and economy.</li><li>Headless balance bots, e.g. route bots that play all 40 Digit Dash layouts.</li><li>End-to-end runs in Chrome with touch input and layout checks at several screen sizes.</li><li>My own playtests on phone and desktop, with bug lists and fixes per iteration.</li></ul>`;

// modal: game/teardown frame or info panel
const modal = $('#modal'), mBody = $('#m-body'), mTitle = $('#m-title'), mOpen = $('#m-open');
function modalOpen() { return !modal.hidden; }
function openFrame(title, src, meta = {}) {
  if (FILM && meta.kind === 'game') { const g = GAMES.find(x => x.id === meta.id); if (g && g.video) { openFilmVideo(title, g.video); return; } }
  mTitle.textContent = title; mOpen.href = src; mOpen.hidden = false;
  if (REMOTE && /^https?:/.test(src)) { // preview build: only new items are bundled, the rest is on the live site
    const missing = (window.ARCADE_MISSING || []).some(m => src.includes(m));
    mOpen.hidden = true; mBody.className = 'info';
    mBody.innerHTML = `<div class="remote"><h2>${esc(title)}</h2><p>${missing ? 'This build is too large for the preview. It will be playable here once the site is published.' : 'In this preview it opens from the live GitHub Pages site.'}</p>${missing ? '' : `<a class="btn main" href="${src}" target="_blank" rel="noopener">Open ${esc(title)} ↗</a>`}</div>`;
    showModal(); return;
  }
  mBody.className = 'frame'; mBody.innerHTML = `<div class="loading">Loading ${esc(title)}…</div><iframe src="${src}" allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope" allowfullscreen></iframe>`;
  mBody.querySelector('iframe').addEventListener('load', () => { const l = mBody.querySelector('.loading'); l && l.remove(); });
  showModal();
}
function openFilmVideo(title, src) {
  mTitle.textContent = title; mOpen.hidden = true; mBody.className = 'frame';
  mBody.innerHTML = `<video src="${url(src)}" muted playsinline style="width:100%;height:100%;object-fit:contain;background:#000"></video>`;
  showModal();
}
function openInfo(title, html) {
  mTitle.textContent = title; mOpen.hidden = true; mBody.className = 'info'; mBody.innerHTML = html;
  mBody.querySelectorAll('[data-play]').forEach(b => b.onclick = () => { const g = GAMES.find(x => x.id === b.dataset.play); openFrame(g.title, url(g.play), { kind: 'game', id: g.id }); });
  mBody.querySelectorAll('[data-frame]').forEach(a => a.onclick = e => { e.preventDefault(); openFrame(a.dataset.title, a.dataset.frame); });
  showModal();
}
// Project panel: a gallery of screens and clips you can flip through, plus the story and links.
function openProject(it, start = 0) {
  const gal = it.gallery || [];
  const media = g => g.type === 'video' ? `<video src="${url(g.src)}" autoplay muted loop playsinline></video>` : `<img src="${url(g.src)}" alt="${esc(g.cap)}">`;
  openInfo(it.title, `${gal.length ? `<div class="gal"><div class="gal-stage"><button class="gal-nav prev" aria-label="Previous">‹</button><div class="gal-media"></div><button class="gal-nav next" aria-label="Next">›</button></div>
      <div class="gal-cap"></div><div class="gal-thumbs">${gal.map((g, i) => `<button data-i="${i}" aria-label="${esc(g.cap)}">${g.type === 'video' ? `<video src="${url(g.src)}" muted playsinline preload="metadata"></video>` : `<img src="${url(g.src)}" alt="">`}</button>`).join('')}</div></div>` : ''}
    <p class="lead">${esc(it.blurb)}</p><p>${esc(it.how)}</p>
    <div class="m-btns">${it.app ? `<button class="main" data-app>▶ Try it here</button>` : ''}${it.links.map(([l, u], i) => `<a class="${i || it.app ? '' : 'main'}" href="${u}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join('')}</div>`);
  const app = mBody.querySelector('[data-app]'); if (app) app.onclick = () => openFrame(it.title, url(it.app));
  if (!gal.length) return;
  let i = start;
  const stage = mBody.querySelector('.gal-media'), cap = mBody.querySelector('.gal-cap'), thumbs = [...mBody.querySelectorAll('.gal-thumbs button')];
  const show = n => { i = (n + gal.length) % gal.length; stage.innerHTML = media(gal[i]); cap.textContent = `${i + 1} / ${gal.length} · ${gal[i].cap}`; thumbs.forEach((t, k) => t.classList.toggle('on', k === i)); };
  mBody.querySelector('.prev').onclick = () => show(i - 1); mBody.querySelector('.next').onclick = () => show(i + 1);
  thumbs.forEach((t, k) => t.onclick = () => show(k));
  let sx = null; stage.addEventListener('pointerdown', e => sx = e.clientX); stage.addEventListener('pointerup', e => { if (sx != null && Math.abs(e.clientX - sx) > 40) show(i + (e.clientX < sx ? 1 : -1)); sx = null; });
  galleryKeys = d => show(i + d);
  show(i);
}
let galleryKeys = null;
function showModal() { modal.hidden = false; state.keys.clear(); state.paused = true; requestAnimationFrame(() => modal.classList.add('show')); }
function closeModal() {
  galleryKeys = null;
  modal.classList.remove('show'); modal.hidden = true; mBody.innerHTML = ''; state.paused = false;
  canvas.focus();
}
$('#m-close').onclick = closeModal;
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// map with search: every exhibit reachable in one tap
const mapEl = $('#map'), mapCanvas = $('#map-canvas'), mapList = $('#map-list'), mapSearch = $('#map-search');
let mapBounds = null;
function openMap() { mapEl.hidden = false; requestAnimationFrame(() => mapEl.classList.add('show')); drawMap(); renderMapList(''); mapSearch.value = ''; if (!isTouch) mapSearch.focus(); state.paused = true; }
function closeMap() { if (mapEl.hidden) return; mapEl.classList.remove('show'); mapEl.hidden = true; state.paused = modalOpen(); }
function toggleMap() { mapEl.hidden ? openMap() : closeMap(); }
$('#btn-map').onclick = openMap; $('#map-close').onclick = closeMap;
mapEl.addEventListener('click', e => { if (e.target === mapEl) closeMap(); });
function drawMap() {
  const r = mapCanvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio, 2);
  mapCanvas.width = r.width * dpr; mapCanvas.height = r.height * dpr;
  const g = mapCanvas.getContext('2d'); g.scale(dpr, dpr);
  const xs = zones.flatMap(z => [z.x0, z.x1]), zs = zones.flatMap(z => [z.z0, z.z1]);
  const minX = Math.min(...xs) - 6, maxX = Math.max(...xs) + 6, minZ = Math.min(...zs) - 6, maxZ = Math.max(...zs) + 6;
  const s = Math.min(r.width / (maxX - minX), r.height / (maxZ - minZ));
  const ox = (r.width - (maxX - minX) * s) / 2, oz = (r.height - (maxZ - minZ) * s) / 2;
  mapBounds = { minX, minZ, s, ox, oz };
  const P = (x, z) => [ox + (x - minX) * s, oz + (z - minZ) * s];
  g.fillStyle = '#03080a'; g.fillRect(0, 0, r.width, r.height);
  const colorOf = { games: C.magenta, library: C.amber, workshop: C.cyan, how: C.green, plaza: C.green };
  for (const z of zones) {
    const [x0, y0] = P(z.x0, z.z0), [x1, y1] = P(z.x1, z.z1);
    g.fillStyle = hex(colorOf[z.name]) + '22'; g.strokeStyle = hex(colorOf[z.name]); g.lineWidth = 1.5;
    g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeRect(x0, y0, x1 - x0, y1 - y0);
  }
  g.font = `700 12px ${FONT_SIGN}`; g.textAlign = 'center';
  for (const [key, label] of [['games', 'GAMES'], ['library', 'TEARDOWNS'], ['workshop', 'WORKSHOP · VAULT'], ['how', 'HOW I WORK']]) {
    const z = zones.find(q => q.name === key); const [cx, cy] = P((z.x0 + z.x1) / 2, (z.z0 + z.z1) / 2);
    g.fillStyle = hex(colorOf[key]); g.save(); g.translate(cx, cy); if (key === 'games' || key === 'how') g.rotate(-Math.PI / 2); g.fillText(label, 0, key === 'games' || key === 'how' ? -14 : -12); g.restore();
  }
  for (const ex of exhibits) { const [x, y] = P(ex.padWorld.x, ex.padWorld.z); g.fillStyle = hex(ex.color); g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.fill(); }
  const [px, py] = P(state.pos.x, state.pos.z);
  g.fillStyle = '#fff'; g.beginPath(); g.arc(px, py, 5, 0, 7); g.fill(); g.strokeStyle = '#35ff9a'; g.lineWidth = 2; g.stroke();
  g.font = `600 11px ${FONT_TEXT}`; g.fillStyle = '#fff'; g.fillText('you', px, py - 9);
}
mapCanvas.addEventListener('click', e => {
  if (!mapBounds) return; const r = mapCanvas.getBoundingClientRect();
  const x = (e.clientX - r.left - mapBounds.ox) / mapBounds.s + mapBounds.minX, z = (e.clientY - r.top - mapBounds.oz) / mapBounds.s + mapBounds.minZ;
  let best = null, bd = 4; for (const ex of exhibits) { const d = Math.hypot(ex.padWorld.x - x, ex.padWorld.z - z); if (d < bd) { bd = d; best = ex; } }
  closeMap();
  if (best) goToExhibit(best, true); else if (inZones(x, z)) teleport(new THREE.Vector3(x, 0, z));
});
function renderMapList(q) {
  q = q.trim().toLowerCase();
  const isVault = e => (e.item.section || '').startsWith('Vault');
  const groups = [['Games', exhibits.filter(e => e.kind === 'game' && !isVault(e))], ['Vault', exhibits.filter(e => e.kind === 'game' && isVault(e))], ['Teardowns', exhibits.filter(e => e.kind === 'teardown')], ['Workshop', exhibits.filter(e => e.kind === 'project' || e.kind === 'wall')], ['Info', exhibits.filter(e => e.kind === 'how' || e.kind === 'about')]];
  mapList.innerHTML = groups.map(([name, list]) => {
    const f = list.filter(e => !q || (e.item.title + ' ' + (e.item.section || e.item.cat || e.item.zone || '')).toLowerCase().includes(q));
    if (!f.length) return '';
    return `<div class="ml-group"><div class="ml-h">${name} · ${f.length}</div>${f.map(e => `<button data-i="${exhibits.indexOf(e)}"><i style="background:${hex(e.color)}"></i>${esc(e.item.title)}</button>`).join('')}</div>`;
  }).join('') || '<p class="ml-empty">Nothing found.</p>';
  mapList.querySelectorAll('button').forEach(b => b.onclick = () => { closeMap(); goToExhibit(exhibits[+b.dataset.i], true); });
}
mapSearch.addEventListener('input', () => renderMapList(mapSearch.value));

$('#btn-help').onclick = () => tutorial.start(true);
$('#btn-about').onclick = () => action(exhibits.find(e => e.kind === 'about'), 'about');

// fade between teleports
const fadeEl = $('#fade');
function fade(mid) { fadeEl.classList.add('on'); setTimeout(() => { mid(); fadeEl.classList.remove('on'); }, 260); }

function toast(html, ms = 6000) { const t = $('#toast'); t.innerHTML = html; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), ms); }

// ---------- tutorial ----------
const tutorial = (() => {
  const el = $('#tutor'); let step = -1;
  const steps = [
    { id: 'move', title: 'Walk around', text: isTouch ? 'Tap the floor to walk there. Drag to look around, or use the joystick.' : 'Use WASD or the arrow keys, or click the floor. Drag to look around, Shift to run.' },
    { id: 'near', title: 'Walk up to a stall', text: isTouch ? 'Tap any stall or book: you walk there and its card opens.' : 'Click any stall or book, or walk up to it: its card opens below.' },
    { id: 'play', title: 'Play it right here', text: 'Press ▶ Play' + (isTouch ? '' : ' or E') + ' to open the game on top of the market. Close it to come back to the same spot. The Map ⌖ finds anything by name.' },
  ];
  function render() {
    if (step < 0 || step >= steps.length) { el.classList.remove('show'); return; }
    const s = steps[step];
    el.innerHTML = `<div class="t-step">${step + 1} / ${steps.length}</div><b>${s.title}</b><p>${s.text}</p><div class="t-btns"><button data-t="skip">Skip tour</button>${step === steps.length - 1 ? '<button class="main" data-t="done">Got it</button>' : '<button data-t="next">Next ›</button>'}</div>`;
    el.classList.add('show');
    el.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.t === 'next') advance(); else finish(); });
  }
  function advance() { step++; render(); if (step >= steps.length) finish(); }
  function finish() { step = -1; render(); store.set('tour', 'done'); }
  return {
    start(force) { if (!force && store.get('tour') === 'done') return; step = 0; state.moved = 0; render(); },
    event(id) { if (step >= 0 && steps[step].id === id) setTimeout(advance, id === 'move' ? 300 : 700); },
    tick() { if (step === 0 && state.moved > 3) tutorial.event('move'); },
  };
})();

// ---------- analytics (GoatCounter, no cookies) ----------
function track(path) { try { window.goatcounter && window.goatcounter.count({ path: 'arcade/' + path, event: true }); } catch { /* optional */ } }

// ---------- intro: digital rain ----------
const intro = $('#intro');
function introRain() {
  const c = $('#rain'), g = c.getContext('2d'); let w, h, cols, drops;
  const titles = GAMES.map(x => x.title.toUpperCase());
  function size() { w = c.width = innerWidth; h = c.height = innerHeight; cols = Math.ceil(w / 18); drops = Array.from({ length: cols }, () => ({ y: Math.random() * h / 18 - 10, word: Math.random() < 0.12 ? titles[Math.floor(Math.random() * titles.length)] : null, i: 0 })); }
  size(); addEventListener('resize', size);
  let last = 0, speedMul = 1, alive = true;
  function frame(t) {
    if (!alive) return; requestAnimationFrame(frame);
    if (t - last < 45 / speedMul) return; last = t;
    g.fillStyle = 'rgba(2,6,6,0.14)'; g.fillRect(0, 0, w, h);
    g.font = `600 16px ${FONT_MONO}`;
    drops.forEach((d, i) => {
      const ch = d.word ? d.word[d.i % d.word.length] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      const y = d.y * 18; g.fillStyle = d.word ? '#ff8bea' : (Math.random() < 0.06 ? '#e9fff4' : '#35ff9a'); g.fillText(ch, i * 18, y);
      d.y++; d.i++; if (y > h && Math.random() > 0.975) { d.y = 0; d.i = 0; d.word = Math.random() < 0.12 ? titles[Math.floor(Math.random() * titles.length)] : null; }
    });
  }
  requestAnimationFrame(frame);
  return { fast() { speedMul = 4; }, stop() { alive = false; } };
}

let clock = new THREE.Clock(), elapsed = 0, intro_t = -1;
const INTRO_DUR = 3.2;
function startIntroFlight() {
  intro_t = 0; state.pos.copy(START); state.yaw = Math.PI; state.camYaw = 0;
}
function introCamera(t) {
  const k = THREE.MathUtils.smootherstep(t / INTRO_DUR, 0, 1);
  const from = new THREE.Vector3(0, 34, START.z + 42), mid = new THREE.Vector3(0, 9, START.z + 6);
  const end = camIdeal(state.pos.clone().add(new THREE.Vector3(0, 1.4, 0)));
  const p = k < 0.6 ? from.clone().lerp(mid, k / 0.6) : mid.clone().lerp(end, (k - 0.6) / 0.4);
  camera.position.copy(p);
  camTarget.copy(new THREE.Vector3(0, 2, -20).lerp(state.pos.clone().setY(1.5), k)); camera.lookAt(camTarget);
}

// ---------- performance guard ----------
let fpsSamples = [], perfChecked = 0;
function perfGuard(dt) {
  if (FILM || state.paused) return;
  fpsSamples.push(dt); if (fpsSamples.length < 120) return;
  const fps = fpsSamples.length / fpsSamples.reduce((a, b) => a + b, 0); fpsSamples = []; perfChecked++;
  if (quality === 'high' && fps < 40) { quality = 'low'; composer = null; renderer.setPixelRatio(1); renderer.setSize(innerWidth, innerHeight); }
  else if (quality === 'low' && fps < 22 && perfChecked > 1 && !perfGuard.warned) {
    perfGuard.warned = true; renderer.setPixelRatio(0.75); renderer.setSize(innerWidth, innerHeight);
    toast('Running slowly on this device? <a href="list/">Open the list view</a>', 9000);
  }
}

// ---------- main loop ----------
function render() { composer ? composer.render() : renderer.render(scene, camera); }
function loop() {
  requestAnimationFrame(loop);
  if (FILM) return;
  if (document.hidden) return;
  const dt = Math.min(clock.getDelta(), 0.05);
  if (modalOpen() || !mapEl.hidden) return; // freeze the world while a game or the map is open
  step(dt);
  render();
  perfGuard(dt);
}
function step(dt) {
  elapsed += dt;
  for (const m of rainMats) m.uniforms.time.value = elapsed;
  for (const f of animated) f(elapsed);
  if (intro_t >= 0) {
    intro_t += dt; introCamera(intro_t);
    if (intro_t >= INTRO_DUR) { intro_t = -1; state.paused = false; camTarget.copy(state.pos).setY(1.5); tutorial.start(); $('#hud').classList.add('show'); }
  } else {
    if (!state.paused) updatePlayer(dt);
    updateCamera(dt);
    updateActive();
    tutorial.tick();
  }
  updateWanderers(dt);
  updateVideos();
  if (clickMark.visible) { clickMark.userData.t += dt; clickMark.scale.setScalar(1 + clickMark.userData.t * 2); clickMark.material.opacity = Math.max(0, 1 - clickMark.userData.t); }
  player.position.copy(state.pos);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.fov = innerWidth < 700 ? 64 : 55; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer && composer.setSize(innerWidth, innerHeight);
});

// ---------- boot ----------
async function boot() {
  try { await Promise.race([document.fonts.load('800 40px Orbitron'), new Promise(r => setTimeout(r, 1800))]); await document.fonts.load('600 16px "JetBrains Mono"'); } catch { /* fonts optional */ }
  buildWorld();
  state.pos.copy(START); player.position.copy(START);
  $('#intro-count').textContent = `${GAMES.length + VAULT.length} playable games · ${TEARDOWNS.length} teardowns · ${PROJECTS.length} more projects`;
  const rain = introRain();
  const go = params.get('go');
  const enter = (instant) => {
    rain.fast(); intro.classList.add('leave'); setTimeout(() => { intro.hidden = true; rain.stop(); }, 900);
    if (instant) { state.paused = false; snapCamera(); $('#hud').classList.add('show'); tutorial.start(); }
    else startIntroFlight();
    track('enter');
  };
  $('#enter').onclick = () => enter(false);
  $('#enter').disabled = false; $('#enter').textContent = 'Enter the market ▶';
  addEventListener('keydown', function k(e) { if (!intro.hidden && e.key === 'Enter') { removeEventListener('keydown', k); enter(false); } });
  if (go) {
    const ex = exhibits.find(e => e.item.id === go);
    if (ex) { enter(true); state.pos.copy(ex.padWorld); const d = ex.facing.clone().sub(ex.padWorld); state.yaw = Math.atan2(d.x, d.z); state.camYaw = frameYaw(ex.padWorld, state.yaw); snapCamera(); }
  }
  camera.position.set(0, 34, START.z + 42); camera.lookAt(0, 2, -20);
  clock.start(); loop();
  // first frame behind the intro so the scene is warm when you enter
  render();
  if (FILM) setupFilm();
  window.__arcade = { state, exhibits, goToExhibit, action, teleport, openMap, closeModal, camera };
}
boot();

// ---------- film mode: deterministic frames for the promo video ----------
function setupFilm() {
  // window.__film(t) advances the world to time t (seconds) and renders one frame.
  const shots = filmScript();
  window.__filmDuration = shots.duration;
  window.__film = (t) => {
    const dt = 1 / 30; elapsed = t;
    for (const m of rainMats) m.uniforms.time.value = t;
    for (const f of animated) f(t);
    shots.apply(t, dt);
    updateWanderers(dt);
    for (const ex of exhibits) if (ex.vel && ex.vel.duration) ex.vel.currentTime = t % ex.vel.duration;
    const v = mBody.querySelector('video'); if (v && v.duration) v.currentTime = Math.min(v.duration - 0.05, (t - (shots.playAt || 0)) + 2);
    render();
  };
  window.__filmReady = () => Promise.all(exhibits.filter(e => e.vel).map(e => new Promise(r => e.vel.readyState >= 2 ? r() : e.vel.addEventListener('loadeddata', r, { once: true }))));
}
function filmScript() {
  intro.hidden = true; $('#hud').classList.add('show'); state.paused = false;
  const nox = exhibits.find(e => e.item.id === 'block-express') || exhibits.find(e => e.kind === 'game');
  const book = exhibits.find(e => e.kind === 'teardown');
  const keys = [];
  const S = { duration: 34, playAt: 12.5 };
  // pre-warm videos near the first stalls
  state.pos.copy(nox.padWorld); updateVideos();
  S.apply = (t) => {
    const lerp = (a, b, k) => a.clone().lerp(b, THREE.MathUtils.smootherstep(k, 0, 1));
    const capS = $('#film-cap');
    let cap = '';
    if (t < 3.2) { intro_t = t; state.pos.copy(START); introCamera(t); cap = 'My GitHub is a game you can walk in'; }
    else if (t < 12) {
      const k = (t - 3.2) / 8.8; const path = [START, avPoint(AV.how, PLAZA + 2, 0), new THREE.Vector3(0, 0, -8), nox.padWorld];
      const seg = Math.min(2, Math.floor(k * 3)); const kk = k * 3 - seg;
      state.pos.copy(lerp(path[seg], path[seg + 1], kk)); const d = path[seg + 1].clone().sub(path[seg]); state.yaw = Math.atan2(d.x, d.z);
      state.camYaw = lerpAngle(state.camYaw, state.yaw + Math.PI, 0.08);
      if (t > 11.2) { const f = nox.facing.clone().sub(state.pos); state.yaw = Math.atan2(f.x, f.z); }
      updatePlayer(0.001); updateCamera(1 / 30); updateActive(); updateVideos();
      cap = t < 7.5 ? `${GAMES.length + VAULT.length} games I built with AI` : 'Every stall is playable';
    } else if (t < 19) {
      if (!modalOpen()) action(nox, 'play');
      cap = 'Press Play. It runs right here.';
    } else if (t < 27) {
      if (modalOpen()) closeModal();
      const k = (t - 19) / 8; const a = new THREE.Vector3(0, 0, -6), b = book.padWorld;
      state.pos.copy(k < 0.4 ? lerp(nox.padWorld, a, k / 0.4) : lerp(a, b, (k - 0.4) / 0.6));
      const target = k < 0.4 ? a : b; const d = target.clone().sub(state.pos); if (d.length() > 0.05) state.yaw = Math.atan2(d.x, d.z);
      state.camYaw = lerpAngle(state.camYaw, state.yaw + Math.PI, 0.1);
      updatePlayer(0.001); updateCamera(1 / 30); updateActive();
      cap = t < 23 ? `${TEARDOWNS.length} teardowns behind them` : 'Reference → teardown → spec → build';
    } else {
      const k = THREE.MathUtils.smootherstep((t - 27) / 7, 0, 1); camera.position.set(-6 + Math.sin(k * 0.9) * 14, 44 + k * 18, 30 - k * 8); camera.lookAt(-14, 0, -14);
      cap = 'Walk in: condrusarsen.github.io/ai-game-lab';
    }
    capS.textContent = cap; capS.classList.toggle('show', !!cap);
  };
  return S;
}
