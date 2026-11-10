"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Subtle 3D tilt toward the pointer with a soft light sheen. Flat on touch / reduced motion. */
export function Tilt({
  children,
  className,
  max = 4,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);
  const enabled = useRef<boolean | null>(null);

  const check = () => {
    if (enabled.current === null) {
      enabled.current =
        !window.matchMedia("(pointer: coarse)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return enabled.current;
  };

  const move = (event: React.PointerEvent) => {
    const el = rootRef.current;
    const sheen = sheenRef.current;
    if (!el || !sheen || !check()) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    el.style.transitionDuration = "70ms";
    el.style.transform = `perspective(1100px) rotateX(${((0.5 - py) * max * 2).toFixed(2)}deg) rotateY(${((px - 0.5) * max * 2).toFixed(2)}deg)`;
    sheen.style.opacity = "1";
    sheen.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.32), rgba(255,255,255,0) 55%)`;
  };

  const leave = () => {
    const el = rootRef.current;
    const sheen = sheenRef.current;
    if (!el || !sheen) return;
    el.style.transitionDuration = "650ms";
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
    sheen.style.opacity = "0";
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn(
        "transition-transform duration-[650ms] ease-[cubic-bezier(0.2,0.9,0.25,1)] will-change-transform",
        className,
      )}
    >
      {children}
      <span
        ref={sheenRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300"
      />
    </div>
  );
}
