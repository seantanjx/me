import { clamp, lerp, prefersReducedMotion } from "./utils";
import type { Scroller } from "./smooth";

/**
 * Ambient "signal field" — a full-screen fragment shader that sits behind the
 * interface. Layered flow noise + a receding grid + a cursor-reactive glow,
 * tinted with the brand signal-green. Deliberately quiet: it reads as depth and
 * light, not a screensaver.
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
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;   // 0..1, eased
uniform float u_scroll;   // 0..1
uniform float u_dpr;

// — hash / value-noise / fbm —
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

  float t = u_time * 0.028;
  vec2 par = (u_pointer - 0.5) * 0.28;      // pointer parallax
  float sc = u_scroll;

  // — flowing layered structure (advected fbm) —
  vec2 q = p * 1.55 + par;
  q.y += sc * 0.6;
  float flow = fbm(q + vec2(t, -t * 0.6));
  float flow2 = fbm(q * 2.1 - vec2(t * 0.7, t) + flow);
  float structure = smoothstep(0.42, 0.98, flow * 0.7 + flow2 * 0.5);

  // — receding depth lines only (horizon floor + ceiling).
  //   Deliberately no vertical radials: the starburst reads retro-gaming,
  //   not luxury. Horizontal recession alone gives quiet, premium depth. —
  vec2 g = p + par * 0.5;
  g.y += sc * 0.4;
  float persp = 1.0 / (abs(g.y) * 4.4 + 0.55);
  float rows = abs(fract(g.y * persp * 7.0) - 0.5);
  float line = smoothstep(0.47, 0.5, rows);
  float gridFade = smoothstep(1.5, 0.05, abs(g.y)) * 0.05;

  // — cursor glow (soft, tight light source) —
  vec2 ptr = (u_pointer - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  float d = length(p - ptr);
  float glow = exp(-d * 4.4) * 0.26;

  // — compose (all intensities restrained; the field is atmosphere) —
  vec3 base = vec3(0.017, 0.026, 0.021);        // near-black field
  vec3 signal = vec3(0.36, 0.86, 0.44);         // signal-green light
  vec3 col = base;
  col += signal * structure * 0.095;
  col += signal * line * gridFade;
  col += signal * glow;

  // depth vignette + faint breathing
  float vig = smoothstep(1.3, 0.1, length(p));
  col *= mix(0.5, 1.0, vig);
  col += signal * 0.010 * (0.5 + 0.5 * sin(u_time * 0.4));

  // subtle filmic curve
  col = col / (col + 0.6);
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
