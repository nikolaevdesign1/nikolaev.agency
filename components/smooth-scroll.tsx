"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "locomotive-scroll/dist/locomotive-scroll.css";

/**
 * Locomotive Scroll (v5): inertial smooth scrolling plus `data-scroll-speed` parallax.
 * It is rebuilt on each route so it sees the new page's `[data-scroll]` elements.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let instance: { destroy: () => void } | null = null;
    let cancelled = false;

    void import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      if (cancelled) return;
      instance = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.075,
          smoothWheel: true,
          wheelMultiplier: 0.95,
        },
      });
    });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
