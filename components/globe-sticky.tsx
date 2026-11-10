"use client";

import { useEffect, useRef } from "react";

/** Keeps the globe in view while the list scrolls and grows it with progress through the block. */
export function GlobeSticky({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const grid = outer?.parentElement;
    if (!outer || !inner || !grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = grid.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight * 0.6);
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - rect.top) / travel));
      inner.style.transform = `scale(${(1 + 0.4 * p).toFixed(3)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={outerRef} className="lg:sticky lg:top-20 lg:self-start">
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
