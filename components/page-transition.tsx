"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const CHARS = "01 ABCDEFGHIJKLMNOPQRSTUVWXYZ::/\\";
const CELL = 24;
const STEPS = 6;
const STEP_MS = 60;
const FADE_MS = 320;

function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);
  ctx.font = `${CELL - 8}px var(--font-mono-display), monospace`;
  ctx.fillStyle = "#f3f1ea";
  ctx.textBaseline = "top";

  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (Math.random() < 0.72) continue;
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, x * CELL, y * CELL);
    }
  }
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    overlay.style.transitionDuration = "0ms";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";

    let step = 0;
    const interval = window.setInterval(() => {
      step++;
      drawFrame(ctx, w, h);
      if (step >= STEPS) {
        window.clearInterval(interval);
        overlay.style.transitionDuration = `${FADE_MS}ms`;
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
      }
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] opacity-0 ease-out"
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      {children}
    </>
  );
}
