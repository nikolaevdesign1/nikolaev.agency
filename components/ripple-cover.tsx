"use client";

import { useEffect, useRef, useState } from "react";

const MAX_RIPPLES = 8;

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D tex;
uniform vec2 res;
uniform vec2 img;
uniform vec2 mouse;
uniform float strength;
uniform float time;
uniform vec3 ripples[${MAX_RIPPLES}];

void main(){
  vec2 p = gl_FragCoord.xy;
  vec2 off = vec2(0.0);

  // the surface sinks under the cursor and pushes the picture outward
  vec2 d = p - mouse;
  float r = length(d);
  float s = res.y * 0.16;
  float dent = exp(-(r * r) / (2.0 * s * s));
  off -= normalize(d + vec2(0.0001)) * dent * 26.0 * strength;

  // rings travelling outward from the points the cursor passed through
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    vec3 rp = ripples[i];
    float age = time - rp.z;
    if (age > 0.0 && age < 2.4) {
      vec2 dd = p - rp.xy;
      float rr = length(dd);
      float front = rr - age * 210.0;
      float w = sin(front * 0.12) * exp(-abs(front) * 0.018) * exp(-age * 1.5);
      off += normalize(dd + vec2(0.0001)) * w * 10.0 * strength;
    }
  }

  vec2 q = p + off;
  float scale = max(res.x / img.x, res.y / img.y);
  vec2 uv = (q - 0.5 * res) / (img * scale) + 0.5;
  uv = clamp(uv, 0.0, 1.0);
  vec3 col = texture2D(tex, vec2(uv.x, 1.0 - uv.y)).rgb;
  col *= 1.0 + (off.x - off.y) * 0.0045;
  gl_FragColor = vec4(col, 1.0);
}
`;

type Engine = {
  move: (x: number, y: number) => void;
  setStrength: (value: number) => void;
  destroy: () => void;
};

function createEngine(canvas: HTMLCanvasElement, src: string, onReady: () => void, onFail: () => void): Engine | null {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uRes = u("res");
  const uImg = u("img");
  const uMouse = u("mouse");
  const uStrength = u("strength");
  const uTime = u("time");
  const uRipples = u("ripples");

  const ripples = new Float32Array(MAX_RIPPLES * 3).fill(-100);
  let nextRipple = 0;
  let mouse = { x: -1000, y: -1000 };
  let lastDrop = { x: -1000, y: -1000 };
  let strength = 0;
  let strengthTarget = 0;
  let frame = 0;
  let loaded = false;
  let destroyed = false;
  const start = performance.now();

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    if (destroyed) return;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    } catch {
      onFail();
      return;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform2f(uImg, image.naturalWidth, image.naturalHeight);
    loaded = true;
    onReady();
  };
  image.onerror = onFail;
  image.src = src;

  const draw = () => {
    frame = requestAnimationFrame(draw);
    if (!loaded) return;
    const w = canvas.width;
    const h = canvas.height;
    gl.viewport(0, 0, w, h);
    strength += (strengthTarget - strength) * 0.12;
    gl.uniform2f(uRes, w, h);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uStrength, strength);
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.uniform3fv(uRipples, ripples);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  frame = requestAnimationFrame(draw);

  return {
    move(x, y) {
      // x, y in canvas pixels, origin bottom-left
      mouse = { x, y };
      strengthTarget = 1;
      if (Math.hypot(x - lastDrop.x, y - lastDrop.y) > 46 * (canvas.width / Math.max(1, canvas.clientWidth))) {
        const i = nextRipple++ % MAX_RIPPLES;
        ripples[i * 3] = x;
        ripples[i * 3 + 1] = y;
        ripples[i * 3 + 2] = (performance.now() - start) / 1000;
        lastDrop = { x, y };
      }
    },
    setStrength(value) {
      strengthTarget = value;
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

/**
 * Wraps a still cover. While the cursor is over it, a WebGL copy of the picture takes over:
 * the surface sinks under the cursor and rings spread from where it has been, like water.
 */
export function RippleCover({
  src,
  children,
  className,
}: {
  src?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      Boolean(src) &&
      !window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [src]);

  useEffect(() => {
    if (!active || !src) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.floor(host.clientWidth * ratio));
    canvas.height = Math.max(1, Math.floor(host.clientHeight * ratio));
    const engine = createEngine(
      canvas,
      src,
      () => setReady(true),
      () => {
        setActive(false);
        setReady(false);
      },
    );
    engineRef.current = engine;
    if (!engine) {
      setActive(false);
      return;
    }
    if (pending.current) engine.move(pending.current.x * ratio, canvas.height - pending.current.y * ratio);
    return () => {
      engine.destroy();
      engineRef.current = null;
      setReady(false);
    };
  }, [active, src]);

  const point = (event: React.PointerEvent) => {
    const rect = hostRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <div
      ref={hostRef}
      className={className}
      onPointerEnter={(event) => {
        if (!enabled.current || event.pointerType === "touch") return;
        if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
        pending.current = point(event);
        setActive(true);
      }}
      onPointerMove={(event) => {
        const p = point(event);
        if (!p) return;
        pending.current = p;
        const canvas = canvasRef.current;
        if (!engineRef.current || !canvas) return;
        const ratio = canvas.width / Math.max(1, canvas.clientWidth);
        engineRef.current.move(p.x * ratio, canvas.height - p.y * ratio);
      }}
      onPointerLeave={() => {
        engineRef.current?.setStrength(0);
        if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
        leaveTimer.current = window.setTimeout(() => setActive(false), 650);
      }}
    >
      {children}
      {active ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
    </div>
  );
}
