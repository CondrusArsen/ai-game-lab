// WebGL2 renderer: the painted studio as a texture, the glory-hole fire, and the glass piece itself,
// ray-cast per pixel as a surface of revolution from a 1D profile texture (outer r, inner r, temperature, droop).

import { N } from './glass.js';

const VS = `#version 300 es
in vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const COMMON = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform vec2 uRes;      // drawing buffer size (px)
uniform float uPx;      // device px per css px
uniform float uTime;
uniform sampler2D uBg;
vec2 cssPos(){ return vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPx; }
vec3 bgAt(vec2 css){ return texture(uBg, clamp(css * uPx / uRes, 0.001, 0.999)).rgb; }
float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }  // sin-free: stable on mobile GPUs
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
`;

// Background: studio + living fire in the glory hole + warm light thrown by hot glass.
const FS_BG = COMMON + `
uniform vec4 uFurnace;   // css x, y, radius, roar 0..1
uniform vec4 uHeat;      // css x, y of piece centre, radius, heat 0..1
out vec4 o;
void main(){
  vec2 p = cssPos();
  vec3 c = bgAt(p);
  // fire inside the glory hole
  vec2 d = (p - uFurnace.xy) / uFurnace.z;
  float r = length(d);
  float flick = noise(vec2(uTime * 3.0, 1.0)) * 0.25 + 0.75;
  float flame = noise(d * 3.0 + vec2(0.0, uTime * 2.3)) * 0.6 + noise(d * 7.0 - vec2(uTime * 1.7, uTime * 3.1)) * 0.4;
  float mouth = smoothstep(1.0, 0.86, r);
  vec3 fire = mix(vec3(1.0, 0.36, 0.06), vec3(1.0, 0.92, 0.6), smoothstep(0.35, 0.95, flame - r * 0.5 + 0.25 * uFurnace.w));
  // the cavity: brightest deep inside, flames licking toward the opening
  float deep = smoothstep(1.0, 0.2, r);
  c = mix(c, fire * (0.9 + 0.5 * deep + 0.5 * uFurnace.w) * flick, mouth);
  // cast-iron collar around the opening, lit from inside
  float ring = smoothstep(0.98, 1.02, r) * smoothstep(1.32, 1.24, r);
  vec3 iron = mix(vec3(0.09, 0.07, 0.06), vec3(0.55, 0.3, 0.15), smoothstep(1.3, 1.0, r) * 0.6) + vec3(0.9, 0.5, 0.2) * 0.25 * max(0.0, -d.y) * flick;
  c = mix(c, iron, ring);
  // glow spilling onto the brick, and a heat shimmer above the mouth
  c += vec3(1.0, 0.45, 0.12) * smoothstep(2.8, 1.3, r) * (0.16 + 0.25 * uFurnace.w) * flick * (1.0 - mouth) * (1.0 - ring);
  float shimmer = smoothstep(0.9, 0.0, abs(d.x) * 0.7) * smoothstep(-4.0, -1.2, d.y) * smoothstep(-0.9, -1.4, d.y);
  c += vec3(1.0, 0.6, 0.3) * 0.06 * shimmer * noise(vec2(d.x * 4.0, d.y * 3.0 + uTime * 4.0));
  // warm light from the hot glass onto the wall
  float hd = length(p - uHeat.xy) / (uHeat.z * 2.6);
  c += vec3(1.0, 0.5, 0.15) * uHeat.w * 0.35 * exp(-hd * hd * 2.0);
  o = vec4(c, 1.0);
}`;

// Glass: per-pixel surface of revolution
const FS_GLASS = COMMON + `
uniform sampler2D uProf;
uniform vec4 uAxis;      // css x of neck, css y of axis, css length, angle (turning)
uniform vec3 uTint;      // transmission colour of the cold glass
uniform vec3 uSun;       // window light colour (for highlights)
uniform float uCrack;    // 0..1 cracks showing
uniform float uPipeR;    // css radius of the steel pipe
uniform vec4 uFurnace;   // glory hole mouth: css x, y, radius
out vec4 o;

vec3 glow(float t){       // incandescence: dull cherry red -> orange -> orange-yellow (tone-mapped below)
  t = clamp(t, 0.0, 1.1);
  vec3 cherry = vec3(0.75, 0.08, 0.02), orange = vec3(1.0, 0.42, 0.06), yellow = vec3(1.0, 0.72, 0.24);
  vec3 c = mix(cherry, orange, smoothstep(0.5, 0.82, t));
  c = mix(c, yellow, smoothstep(0.88, 1.08, t));
  return c * pow(smoothstep(0.4, 1.0, t), 1.3) * 2.4;
}
vec4 prof(float z){ return texture(uProf, vec2(clamp(z, 0.0, 1.0) * (float(${N}) - 1.0) / float(${N}) + 0.5 / float(${N}), 0.5)); }

void main(){
  vec2 p = cssPos();
  float x0 = uAxis.x, ay = uAxis.y, len = uAxis.z;
  float z = (p.x - x0) / len;
  // steel blowpipe (to the left of the glass)
  if (p.x < x0 + 2.0) {
    float py = abs(p.y - ay);
    if (py < uPipeR) {
      float s = py / uPipeR;
      vec3 steel = mix(vec3(0.82, 0.83, 0.86), vec3(0.18, 0.18, 0.2), s * s);
      steel += vec3(1.0) * 0.35 * exp(-pow((p.y - ay + uPipeR * 0.45) / (uPipeR * 0.25), 2.0));
      // heat colour creeping along the pipe near the glass
      steel = mix(steel, vec3(0.6, 0.25, 0.1), 0.5 * exp(-(x0 - p.x) / 30.0) * prof(0.0).b);
      o = vec4(steel, 1.0); return;
    }
    discard;
  }
  if (z > 1.0) discard;
  // inside the glory hole the fire hides the glass
  if (length(p - uFurnace.xy) < uFurnace.z * 0.97 || p.x > uFurnace.x) discard;
  vec4 P = prof(z);
  float R = P.r, Ri = P.g, T = P.b, sag = P.a;
  float dy = p.y - (ay + sag);
  if (abs(dy) >= R || R < 0.5) discard;

  float zf = sqrt(R * R - dy * dy);
  float h = 1.5 / len;
  float dR = (prof(z + h).r - prof(z - h).r) / (2.0 * h * len);
  vec3 n = normalize(vec3(-dR, dy / R, zf / R));
  float th = 2.0 * zf;
  bool hollow = abs(dy) < Ri;
  if (hollow) th -= 2.0 * sqrt(max(0.0, Ri * Ri - dy * dy));
  float thick = th / 40.0;                       // path length through glass, ~1 = 40 css px

  // turning: faint twisted streaks that move with the pipe
  float phase = acos(clamp(dy / R, -1.0, 1.0));
  float streak = 0.5 + 0.5 * sin(phase * 5.0 + uAxis.w + z * 14.0);

  // cold glass: refracted studio + tint absorption + Fresnel + window highlights
  vec2 off = n.xy * (8.0 + 16.0 * min(thick, 2.0)) * vec2(1.0, 1.0);
  vec3 behind = bgAt(p - off);
  vec3 trans = behind * pow(uTint, vec3(0.6 + thick * 1.4));
  float F = 0.04 + 0.96 * pow(1.0 - clamp(n.z, 0.0, 1.0), 5.0);
  vec3 env = bgAt(vec2(p.x + n.x * 120.0, p.y - abs(n.y) * 160.0 - 60.0)) * 1.2;
  vec3 L1 = normalize(vec3(0.35, -0.75, 0.55));
  float spec = pow(max(dot(reflect(vec3(0.0, 0.0, -1.0), n), L1), 0.0), 90.0);
  float spec2 = pow(max(dot(reflect(vec3(0.0, 0.0, -1.0), n), normalize(vec3(-0.5, -0.4, 0.8))), 0.0), 30.0);
  vec3 cold = mix(trans, env, F) + uSun * (spec * 2.2 + spec2 * 0.25) * (0.75 + 0.25 * streak);
  // inner wall line: makes the bubble read as hollow
  if (Ri > 1.0) cold += vec3(1.0) * 0.09 * exp(-pow((abs(dy) - Ri) / 1.2, 2.0));
  // silhouette edge: total internal reflection darkens grazing walls
  cold *= mix(0.45, 1.0, smoothstep(0.0, 0.35, n.z));

  // hot glass: glows from within, brighter where the path through it is long, dimmer at the thin rim;
  // slow convection swirls in the melt turn with the pipe
  float swirl = noise(vec2(z * 7.0 + uTime * 0.15, phase * 2.2 + uAxis.w * 0.8)) * 0.6 + noise(vec2(z * 19.0 - uTime * 0.3, phase * 5.0 + uAxis.w)) * 0.4;
  vec3 em = glow(T + (swirl - 0.5) * 0.08) * (0.3 + 0.7 * (1.0 - exp(-thick * 1.1))) * (0.85 + 0.15 * streak) * mix(0.5, 1.0, smoothstep(0.0, 0.6, n.z));
  float hot = smoothstep(0.4, 0.78, T);
  vec3 col = mix(cold, cold * 0.35 + em, hot) + em * 0.2 * (1.0 - hot);
  col += uSun * spec * 0.5 * hot;

  // cracks (when tools touched glass that was too cold)
  if (uCrack > 0.0) {
    float cr = abs(noise(vec2(z * 30.0, dy / R * 6.0)) - 0.5);
    col = mix(col, vec3(1.0), uCrack * smoothstep(0.02, 0.0, cr) * 0.8);
  }
  col = col / (1.0 + col * 0.38);             // soft shoulder keeps the molten core from clipping to white
  o = vec4(col, 1.0);
}`;

export class GlassRenderer {
  constructor(canvas) {
    this.cv = canvas;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL2 недоступен');
    this.gl = gl;
    this.bgProg = this.program(FS_BG);
    this.glassProg = this.program(FS_GLASS);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.bgTex = this.texture(gl.LINEAR);
    this.profTex = this.texture(gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, this.profTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, N, 1, 0, gl.RGBA, gl.FLOAT, new Float32Array(N * 4));
    this.prof = new Float32Array(N * 4);
    this.quality = 1;
  }

  program(fs) {
    const gl = this.gl;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p, u };
  }

  texture(filter) {
    const gl = this.gl;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  resize(cssW, cssH, dpr) {
    this.px = dpr * this.quality;
    this.cv.width = Math.max(2, Math.round(cssW * this.px));
    this.cv.height = Math.max(2, Math.round(cssH * this.px));
    this.cssW = cssW; this.cssH = cssH;
  }

  setBackground(canvas) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    // canvas rows top→bottom map to v 0→1, which is how bgAt() samples (css y grows downward)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  }

  // s: { gather, x0, axisY, scale, furnace:{x,y,r,roar}, sun:[r,g,b], tint:[r,g,b], crack, time }
  draw(s) {
    const gl = this.gl;
    gl.viewport(0, 0, this.cv.width, this.cv.height);
    gl.bindVertexArray(this.vao);
    gl.disable(gl.SCISSOR_TEST);
    // background
    let P = this.bgProg;
    gl.useProgram(P.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.uniform1i(P.u.uBg, 0);
    gl.uniform2f(P.u.uRes, this.cv.width, this.cv.height);
    gl.uniform1f(P.u.uPx, this.px);
    gl.uniform1f(P.u.uTime, s.time % 600);   // wrapped: large values lose float precision in the noise
    gl.uniform4f(P.u.uFurnace, s.furnace.x, s.furnace.y, s.furnace.r, s.furnace.roar);
    const g = s.gather;
    let heat = 0, maxR = 0;
    if (g) { for (let i = 0; i < N; i++) { heat = Math.max(heat, g.T[i]); maxR = Math.max(maxR, g.r[i]); } }
    const k = s.scale;
    gl.uniform4f(P.u.uHeat, s.x0 + (g ? g.len : 0) * k * 0.55, s.axisY, Math.max(30, maxR * k), g ? Math.max(0, (heat - 0.45) / 0.6) : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!g) return;
    // hidden (a burst piece): an empty profile, so only the bare pipe is drawn
    // profile texture (css px)
    const pr = this.prof;
    let maxSag = 0;
    for (let i = 0; i < N; i++) {
      const v = s.hidden ? 0 : 1;
      pr[i * 4] = g.r[i] * k * v; pr[i * 4 + 1] = Math.max(0, g.ri[i]) * k * v; pr[i * 4 + 2] = g.T[i]; pr[i * 4 + 3] = g.sy[i] * k * v;
      maxSag = Math.max(maxSag, g.sy[i] * k);
    }
    gl.bindTexture(gl.TEXTURE_2D, this.profTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, N, 1, gl.RGBA, gl.FLOAT, pr);
    // only shade the pixels around the piece and the pipe
    const pad = 6;
    const left = 0, right = Math.min(this.cssW, s.x0 + g.len * k + pad);
    const top = s.axisY - maxR * k - pad, bottom = s.axisY + maxR * k + maxSag + pad;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(Math.floor(left * this.px), Math.floor((this.cssH - bottom) * this.px), Math.ceil((right - left) * this.px), Math.ceil((bottom - top) * this.px));
    P = this.glassProg;
    gl.useProgram(P.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.uniform1i(P.u.uBg, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.profTex);
    gl.uniform1i(P.u.uProf, 1);
    gl.uniform2f(P.u.uRes, this.cv.width, this.cv.height);
    gl.uniform1f(P.u.uPx, this.px);
    gl.uniform1f(P.u.uTime, s.time % 600);   // wrapped: large values lose float precision in the noise
    gl.uniform4f(P.u.uAxis, s.x0, s.axisY, g.len * k, g.angle % (Math.PI * 100));
    gl.uniform3f(P.u.uTint, s.tint[0], s.tint[1], s.tint[2]);
    gl.uniform3f(P.u.uSun, s.sun[0], s.sun[1], s.sun[2]);
    gl.uniform1f(P.u.uCrack, s.crack || 0);
    gl.uniform1f(P.u.uPipeR, Math.max(3, 5.5 * k));
    gl.uniform4f(P.u.uFurnace, s.furnace.x, s.furnace.y, s.furnace.r, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
  }
}
