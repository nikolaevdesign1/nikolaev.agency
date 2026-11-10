"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types the text out as it scrolls through the viewport. The full string is always laid out
 * (untyped characters are transparent), so nothing reflows while it fills in.
 */
export function TypeOnScroll({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // starts as the block enters the lower third, done by the time it reaches the middle
      const start = vh * 0.92;
      const end = vh * 0.45;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setCount(Math.round(p * text.length));
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
  }, [text]);

  const typing = count > 0 && count < text.length;

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {typing && <span className="ml-px inline-block h-[0.9em] w-[2px] translate-y-[0.1em] bg-current" />}
        <span className="opacity-0">{text.slice(count)}</span>
      </span>
    </p>
  );
}
