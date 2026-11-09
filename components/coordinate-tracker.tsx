"use client";

import { useEffect, useRef } from "react";

function pad(n: number) {
  return String(Math.max(0, Math.round(n))).padStart(4, "0");
}

export function CoordinateTracker({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const root = node?.parentElement;
    if (!node || !root) return;

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      node.textContent = `X:${pad(event.clientX - rect.left)} Y:${pad(event.clientY - rect.top)}`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={
        className ??
        "pointer-events-none absolute left-1/3 top-1/2 font-mono text-[11px] tracking-[0.08em] text-foreground/30"
      }
    >
      X:0000 Y:0000
    </span>
  );
}
