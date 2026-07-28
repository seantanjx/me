import { clamp, lerp, prefersReducedMotion } from "./utils";
import type { Scroller } from "./smooth";

/**
 * Ambient "observatory field" — a full-screen fragment shader that reads as a
 * deep night sky observed. Sparse starfield, soft nebula haze in warm amber and
 * cool starlight, a warm cursor lamp glow, and a radial vignette keeping the
 * center legible. Scroll pans the sky vertically; pointer applies parallax.
 *
 * Reduced-motion: a single static frame is drawn and the loop never starts.
 * Also pauses when the tab is hidden. Falls back gracefully if WebGL is absent.
 */
const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;   // 0..1, eased
uniform float u_scroll;    // 0..1
uniform float u_dpr;

// --- Hash functions ---
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

// --- Value noise for nebula ---
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p  *= 2.07;
    a  *= 0.48;
  }
  return v;
}

// --- Sparse starfield layer ---
// Returns vec2(brightness, warmth). ~20 % of cells hold a star.
// seed offsets the hash domain so two layers don't overlap.
vec2 starLayer(vec2 uv, float scale, float t, float seed) {
  float ar    = u_res.x / u_res.y;
  vec2  scaled = vec2(uv.x * ar, uv.y) * scale;
  vec2  cell   = floor(scaled);
  vec2  off    = fract(scaled);

  float brite = 0.0;
  float warm  = 0.0;

  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      vec2 nc = cell + vec2(float(dx), float(dy));
      vec2 h  = hash22(nc + seed);

      // Gate: step(0.80, h.x) => ~20 % of cells get a star
      float hasStar = step(0.80, h.x);

      vec2  starOff = vec2(float(dx), float(dy)) + h;
      float dist    = length(off - starOff);
      float r       = 0.036 + h.y * 0.040;         // radius in cell units
      float b       = (1.0 - smoothstep(0.0, r, dist)) * hasStar;
      b = b * b;                                    // sharpen falloff

      // Very slow twinkling — not a disco
      float twinkle = 0.87 + 0.13 * sin(t * 0.44 + h.x * 19.1 + seed * 4.7);
      b *= twinkle * (0.45 + h.y * 0.55);          // per-star brightness spread

      // ~12 % of stars are warm-tinted
      float w = step(0.88, hash21(nc + seed + 3.1)) * b;

      brite += b;
      warm  += w;
    }
  }
  return vec2(clamp(brite, 0.0, 1.0), clamp(warm, 0.0, 1.0));
}

void main() {
  vec2  uv  = gl_FragCoord.xy / u_res.xy;
  vec2  p   = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;  // aspect-corrected

  float t        = u_time;
  vec2  par      = u_pointer - 0.5;    // -0.5..0.5
  float skyDrift = u_scroll * 0.20;   // scroll pans sky upward

  // --- Palette ---
  vec3 bgCol    = vec3(0.028, 0.030, 0.055);  // deep indigo night
  vec3 amber    = vec3(0.95,  0.62,  0.32);   // warm amber (lead voice)
  vec3 coolStar = vec3(0.88,  0.92,  1.00);   // cool-white starlight
  vec3 warmStar = vec3(1.00,  0.84,  0.60);   // warm amber star tint

  vec3 col = bgCol;

  // --- Nebula haze (low-frequency fbm, drifting slowly) ---
  vec2  nebP = p * 0.62;
  nebP.y    -= skyDrift * 0.55;
  nebP      += par * 0.055;
  float ts   = t * 0.008;
  float n1   = fbm(nebP + vec2(ts, -ts * 0.75));
  float n2   = fbm(nebP * 1.85 - vec2(ts * 0.9, ts * 1.3) + n1 * 0.30);

  // Soft radial mask: suppress nebula at center so text stays legible
  float nebMask = smoothstep(0.18, 0.65, length(p * vec2(0.65, 1.0)));

  col += amber               * smoothstep(0.50, 0.82, n1 * 0.55 + n2 * 0.45) * 0.040 * nebMask;
  col += vec3(0.50, 0.62, 0.85) * smoothstep(0.52, 0.84, n2 * 0.62 + n1 * 0.38) * 0.022 * nebMask;

  // --- Starfield — two depth layers for parallax ---
  // Far layer: finer cells, cool-white, gentle parallax
  vec2 uvFar  = uv + par * 0.025;
  uvFar.y    -= skyDrift;
  vec2 sF     = starLayer(uvFar, 15.0, t, 0.0);
  col += coolStar * sF.x * 0.72;
  col += warmStar * sF.y * 1.10;

  // Near layer: coarser cells, slightly warmer, more parallax
  vec2 uvNear  = uv + par * 0.055;
  uvNear.y    -= skyDrift * 1.35;
  vec2 sN      = starLayer(uvNear, 22.0, t, 6.74);
  col += coolStar * sN.x * 0.52;
  col += warmStar * sN.y * 0.85;

  // --- Cursor glow (warm amber lamp — the observer's light) ---
  vec2  ptr  = (u_pointer - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  float dPtr = length(p - ptr);
  float glow = exp(-dPtr * 4.4) * 0.21;
  col += amber * glow;

  // --- Radial vignette — edges darker, center preserved ---
  float vig = smoothstep(1.22, 0.05, length(p));
  col *= mix(0.30, 1.0, vig);

  // Faint slow breathing
  col += bgCol * 0.012 * (0.5 + 0.5 * sin(t * 0.31));

  // --- Filmic tonemap ---
  col = col / (col + 0.55);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? "shader compile failed");
  }
  return sh;
}

export function initField(scroller: Scroller): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#field");
  if (!canvas) return;

  const gl =
    canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) ??
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
  if (!gl) return; // no WebGL — the CSS bg + grain still carry atmosphere

  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link failed");
  } catch {
    return;
  }
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(program, "u_res"),
    time: gl.getUniformLocation(program, "u_time"),
    pointer: gl.getUniformLocation(program, "u_pointer"),
    scroll: gl.getUniformLocation(program, "u_scroll"),
    dpr: gl.getUniformLocation(program, "u_dpr"),
  };

  const reduced = prefersReducedMotion();
  const dpr = Math.min(window.devicePixelRatio || 1, reduced ? 1 : 1.75);
  const pointer = { x: 0.5, y: 0.55 };
  const eased = { x: 0.5, y: 0.55 };
  let scroll = 0;

  const resize = (): void => {
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };
  window.addEventListener("resize", resize);

  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = 1 - e.clientY / window.innerHeight;
    },
    { passive: true },
  );
  scroller.onScroll((progress) => {
    scroll = progress;
  });

  const draw = (timeMs: number): void => {
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.time, timeMs * 0.001);
    gl.uniform1f(u.dpr, dpr);
    gl.uniform2f(u.pointer, eased.x, eased.y);
    gl.uniform1f(u.scroll, clamp(scroll, 0, 1));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  resize();

  if (reduced) {
    // one static, representative frame — no animation loop
    draw(4200);
    return;
  }

  let running = true;
  const loop = (time: number): void => {
    if (!running) return;
    eased.x = lerp(eased.x, pointer.x, 0.06);
    eased.y = lerp(eased.y, pointer.y, 0.06);
    resize();
    draw(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });
}
