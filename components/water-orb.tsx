"use client";

import { useEffect, useRef, useState } from "react";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform float t;
uniform vec2 res;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 5; i++) { s += a * n(p); p *= 2.02; a *= 0.5; }
  return s;
}
void main(){
  vec2 uv = (gl_FragCoord.xy * 2.0 - res) / min(res.x, res.y);
  float r = length(uv);
  float a = smoothstep(1.0, 0.975, r);
  if (a <= 0.0) { gl_FragColor = vec4(0.0); return; }
  float z = sqrt(max(0.0, 1.0 - r * r));
  vec2 p = uv / (z + 1.15) * 2.3;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.12)), fbm(p + vec2(5.2, 1.3) - t * 0.1));
  vec2 w = p + 2.2 * q;
  float f = fbm(w + t * 0.07);
  float rip = sin((w.x + w.y) * 10.0 + t * 1.3 + f * 6.0) * 0.5 + 0.5;
  vec3 deep = vec3(0.05, 0.07, 0.10);
  vec3 orange = vec3(0.94, 0.59, 0.22);
  vec3 violet = vec3(0.86, 0.70, 0.94);
  vec3 mint = vec3(0.76, 0.93, 0.77);
  vec3 col = mix(deep, orange, smoothstep(0.25, 0.85, f));
  col = mix(col, violet, smoothstep(0.35, 0.9, q.x) * 0.85);
  col = mix(col, mint, smoothstep(0.5, 1.0, q.y) * 0.7);
  col += pow(rip, 7.0) * 0.32 * smoothstep(0.3, 0.8, f);
  float fres = pow(1.0 - z, 2.4);
  col = mix(col, vec3(0.92, 0.96, 1.0), fres * 0.32);
  vec3 N = normalize(vec3(uv + vec2(rip - 0.5, f - 0.5) * 0.12, z));
  float spec = pow(max(dot(N, normalize(vec3(-0.4, 0.6, 0.7))), 0.0), 48.0);
  col += spec * 0.45;
  gl_FragColor = vec4(col * a, a);
}
`;

/** Liquid sphere: a flowing, rippling water surface drawn with a small fragment shader. */
export function WaterOrb({ className, active = false }: { className?: string; active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const [fallback, setFallback] = useState(false);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) {
      setFallback(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setFallback(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tLoc = gl.getUniformLocation(program, "t");
    const rLoc = gl.getUniformLocation(program, "res");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let time = 4;
    let last = performance.now();

    const draw = (now: number) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * ratio);
      const h = Math.floor(canvas.clientHeight * ratio);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      const dt = (now - last) / 1000;
      last = now;
      if (!reduce) time += dt * (activeRef.current ? 2.2 : 1);
      gl.uniform1f(tLoc, time);
      gl.uniform2f(rLoc, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      gl.deleteProgram(program);
    };
  }, []);

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className={`${className ?? ""} rounded-full`}
        style={{
          background:
            "conic-gradient(from 0deg, #f09637, #dcb2f0, #c3eec5, #dde9ae, #f09637)",
          filter: "blur(2px)",
        }}
      />
    );
  }

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
