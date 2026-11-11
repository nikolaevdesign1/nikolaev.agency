"use client";

import { useEffect, useRef } from "react";

const POINTS = 2600;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/**
 * Smooth, flowing field on the sphere: large slow swells with a domain warp,
 * so the surface reads as liquid rather than ripples.
 */
function wave(x: number, y: number, z: number, t: number) {
  const wx = x + Math.sin(y * 1.3 + t * 0.35) * 0.55;
  const wy = y + Math.sin(z * 1.1 - t * 0.28) * 0.55;
  const wz = z + Math.sin(x * 1.2 + t * 0.31) * 0.55;
  return (
    Math.sin(wx * 1.6 + t * 0.6) * 0.45 +
    Math.sin(wy * 1.9 - t * 0.5 + wx * 0.7) * 0.35 +
    Math.sin(wz * 2.4 + t * 0.8 - wy * 0.6) * 0.2
  );
}

type Dot = { x: number; y: number; z: number; shade: number };

/**
 * A sphere made of dots whose surface swells and dips like a sound wave.
 * It breathes at rest, swells while the user types, and pulses while an answer is on its way.
 */
export function DotOrb({
  className,
  active = false,
  typing = false,
}: {
  className?: string;
  active?: boolean;
  typing?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const energyRef = useRef({ active, typing });
  energyRef.current = { active, typing };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots: Dot[] = Array.from({ length: POINTS }, (_, i) => {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * GOLDEN;
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, shade: Math.random() };
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let ratio = 1;
    const resize = () => {
      ratio = window.devicePixelRatio || 1;
      size = canvas.clientWidth;
      canvas.width = Math.floor(size * ratio);
      canvas.height = Math.floor(size * ratio);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);

    let frame = 0;
    let energy = 0;
    const start = performance.now();

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || size === 0) return;
      const t = (now - start) / 1000;
      const want = energyRef.current.active ? 1 : energyRef.current.typing ? 0.55 : 0;
      energy += (want - energy) * 0.06;
      const amp = 0.17 + energy * 0.14;
      const speed = 0.8 + energy * 1.4;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const c = size / 2;
      const R = size * 0.34;

      // liquid core: two soft blobs drifting inside the sphere
      for (let k = 0; k < 2; k++) {
        const bx = c + Math.sin(t * (0.4 + k * 0.17) + k * 2) * R * 0.32;
        const by = c + Math.cos(t * (0.33 + k * 0.21) + k) * R * 0.28;
        const core = ctx.createRadialGradient(bx, by, 0, bx, by, R * 0.85);
        core.addColorStop(0, k === 0 ? `rgba(240,150,55,${0.28 + energy * 0.12})` : "rgba(220,178,240,0.22)");
        core.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = core;
        ctx.fillRect(0, 0, size, size);
      }

      const glow = ctx.createRadialGradient(c, c, R * 0.2, c, c, R * 1.5);
      glow.addColorStop(0, `rgba(240,150,55,${0.1 + energy * 0.08})`);
      glow.addColorStop(0.6, "rgba(220,178,240,0.05)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      const yaw = t * 0.25;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const tilt = 0.35;
      const cp = Math.cos(tilt);
      const sp = Math.sin(tilt);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const w = wave(d.x, d.y, d.z, t * speed);
        const k = 1 + w * amp;
        let x = d.x * k;
        let y = d.y * k;
        let z = d.z * k;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        x = x1;
        const y1 = y * cp - z1 * sp;
        z = y * sp + z1 * cp;
        y = y1;

        const depth = (z + 1.4) / 2.8; // 0 far, 1 near
        const persp = 1 / (1.9 - z * 0.45);
        const px = c + x * R * persp * 1.9;
        const py = c + y * R * persp * 1.9;
        const crest = Math.max(0, w);
        const dotSize = (0.7 + depth * 1.4 + crest * 0.9) * (size / 220);

        // warm palette: peaks go orange, troughs lavender, with a few bright sparks
        const h = (w + 1) / 2;
        const r = Math.round(220 + h * 30);
        const g = Math.round(150 + (1 - h) * 40 + h * 10);
        const b = Math.round(235 - h * 150);
        const alpha = 0.18 + depth * 0.7 * (0.55 + h * 0.45);
        ctx.fillStyle = d.shade > 0.985 ? `rgba(255,248,235,${alpha})` : `rgba(${r},${g},${b},${alpha})`;
        ctx.fillRect(px - dotSize / 2, py - dotSize / 2, dotSize, dotSize);
      }
    };

    if (reduce) {
      draw(performance.now() + 1500);
      cancelAnimationFrame(frame);
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ display: "block" }} />;
}
