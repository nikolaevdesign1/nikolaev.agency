"use client";

import { useEffect, useRef } from "react";
import { drawAsciiFrame } from "@/lib/ascii-wipe";

const STEPS = 5;
const STEP_MS = 56;
const FADE_MS = 260;
const BAND_HEIGHT = 160;

export function SectionTransition() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!sentinel || !overlay || !canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || fired.current) return;
          fired.current = true;
          observer.disconnect();

          const w = overlay.offsetWidth;
          const h = overlay.offsetHeight;
          canvas.width = w;
          canvas.height = h;

          overlay.style.transitionDuration = "0ms";
          overlay.style.opacity = "1";

          let step = 0;
          const interval = window.setInterval(() => {
            step++;
            drawAsciiFrame(ctx, w, h);
            if (step >= STEPS) {
              window.clearInterval(interval);
              overlay.style.transitionDuration = `${FADE_MS}ms`;
              overlay.style.opacity = "0";
            }
          }, STEP_MS);
        });
      },
      { threshold: 0, rootMargin: "-46% 0px -46% 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sentinelRef} aria-hidden="true" className="relative h-0 w-full">
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-x-0 top-1/2 z-20 opacity-0 ease-out"
        style={{ height: BAND_HEIGHT, transform: "translateY(-50%)" }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </div>
  );
}
