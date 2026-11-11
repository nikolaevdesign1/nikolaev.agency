"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Layers of growing blur, each masked a little lower, so the edge has no visible line. */
const LAYERS = [2, 4, 8, 14];

/**
 * Progressive blur along the bottom of the screen: content scrolls out of it.
 * Shows once the page has moved and steps aside when the footer arrives.
 */
export function BottomBlur() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setOn(false);
      return;
    }
    let frame = 0;
    let footerVisible = false;
    const update = () => {
      frame = 0;
      setOn(window.scrollY > 60 && !footerVisible);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const footer = document.querySelector("footer");
    const io = footer
      ? new IntersectionObserver(([entry]) => {
          footerVisible = Boolean(entry?.isIntersecting);
          onScroll();
        })
      : null;
    if (footer) io?.observe(footer);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[20] h-32 transition-opacity duration-500 md:h-40 ${
        on ? "opacity-100" : "opacity-0"
      }`}
    >
      {LAYERS.map((blur, i) => {
        const mask = `linear-gradient(to bottom, transparent ${i * 22}%, #000 ${Math.min(100, i * 22 + 40)}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
