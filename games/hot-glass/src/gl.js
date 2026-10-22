import{N as n}from"./glass.js";const v=`#version 300 es
in vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`,x=`#version 300 es
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
`,T=x+`
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
}`,R=x+`
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
vec4 prof(float z){ return texture(uProf, vec2(clamp(z, 0.0, 1.0) * (float(${n}) - 1.0) / float(${n}) + 0.5 / float(${n}), 0.5)); }

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
}`;export class GlassRenderer{constructor(t){this.cv=t;const e=t.getContext("webgl2",{antialias:!1,alpha:!1,premultipliedAlpha:!1,powerPreference:"high-performance"});if(!e)throw new Error("WebGL2 недоступен");this.gl=e,this.bgProg=this.program(T),this.glassProg=this.program(R);const o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.bgTex=this.texture(e.LINEAR),this.profTex=this.texture(e.LINEAR),e.bindTexture(e.TEXTURE_2D,this.profTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,n,1,0,e.RGBA,e.FLOAT,new Float32Array(n*4)),this.prof=new Float32Array(n*4),this.quality=1}program(t){const e=this.gl,o=(i,s)=>{const c=e.createShader(i);if(e.shaderSource(c,s),e.compileShader(c),!e.getShaderParameter(c,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(c));return c},r=e.createProgram();if(e.attachShader(r,o(e.VERTEX_SHADER,v)),e.attachShader(r,o(e.FRAGMENT_SHADER,t)),e.bindAttribLocation(r,0,"aPos"),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(r));const l={},h=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let i=0;i<h;i++){const s=e.getActiveUniform(r,i);l[s.name]=e.getUniformLocation(r,s.name)}return{p:r,u:l}}texture(t){const e=this.gl,o=e.createTexture();return e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),o}resize(t,e,o){this.px=o*this.quality,this.cv.width=Math.max(2,Math.round(t*this.px)),this.cv.height=Math.max(2,Math.round(e*this.px)),this.cssW=t,this.cssH=e}setBackground(t){const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.bgTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t)}draw(t){const e=this.gl;e.viewport(0,0,this.cv.width,this.cv.height),e.bindVertexArray(this.vao),e.disable(e.SCISSOR_TEST);let o=this.bgProg;e.useProgram(o.p),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.bgTex),e.uniform1i(o.u.uBg,0),e.uniform2f(o.u.uRes,this.cv.width,this.cv.height),e.uniform1f(o.u.uPx,this.px),e.uniform1f(o.u.uTime,t.time%600),e.uniform4f(o.u.uFurnace,t.furnace.x,t.furnace.y,t.furnace.r,t.furnace.roar);const r=t.gather;let l=0,h=0;if(r)for(let a=0;a<n;a++)l=Math.max(l,r.T[a]),h=Math.max(h,r.r[a]);const i=t.scale;if(e.uniform4f(o.u.uHeat,t.x0+(r?r.len:0)*i*.55,t.axisY,Math.max(30,h*i),r?Math.max(0,(l-.45)/.6):0),e.drawArrays(e.TRIANGLES,0,3),!r)return;const s=this.prof;let c=0;for(let a=0;a<n;a++){const f=t.hidden?0:1;s[a*4]=r.r[a]*i*f,s[a*4+1]=Math.max(0,r.ri[a])*i*f,s[a*4+2]=r.T[a],s[a*4+3]=r.sy[a]*i*f,c=Math.max(c,r.sy[a]*i)}e.bindTexture(e.TEXTURE_2D,this.profTex),e.texSubImage2D(e.TEXTURE_2D,0,0,0,n,1,e.RGBA,e.FLOAT,s);const u=6,m=0,g=Math.min(this.cssW,t.x0+r.len*i+u),d=t.axisY-h*i-u,p=t.axisY+h*i+c+u;e.enable(e.SCISSOR_TEST),e.scissor(Math.floor(m*this.px),Math.floor((this.cssH-p)*this.px),Math.ceil((g-m)*this.px),Math.ceil((p-d)*this.px)),o=this.glassProg,e.useProgram(o.p),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.bgTex),e.uniform1i(o.u.uBg,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.profTex),e.uniform1i(o.u.uProf,1),e.uniform2f(o.u.uRes,this.cv.width,this.cv.height),e.uniform1f(o.u.uPx,this.px),e.uniform1f(o.u.uTime,t.time%600),e.uniform4f(o.u.uAxis,t.x0,t.axisY,r.len*i,r.angle%(Math.PI*100)),e.uniform3f(o.u.uTint,t.tint[0],t.tint[1],t.tint[2]),e.uniform3f(o.u.uSun,t.sun[0],t.sun[1],t.sun[2]),e.uniform1f(o.u.uCrack,t.crack||0),e.uniform1f(o.u.uPipeR,Math.max(3,5.5*i)),e.uniform4f(o.u.uFurnace,t.furnace.x,t.furnace.y,t.furnace.r,0),e.drawArrays(e.TRIANGLES,0,3),e.disable(e.SCISSOR_TEST)}}
