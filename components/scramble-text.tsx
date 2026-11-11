"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { whenPreloaderDone } from "@/lib/use-preloader-done";

const DIGITS = "0123456789";
const START = 20; // ms before the first character
const STEP = 20; // ms between character starts
const DURATION = 200; // ms each character spends cycling digits

type ScrambleTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  trigger?: "mount" | "inview";
  /** ms before the effect starts */
  delay?: number;
};

/**
 * Characters appear one by one. Each flickers through digits for a fraction
 * of a second and settles on the real letter. Hidden characters keep their
 * space, so the layout never moves.
 */
export function ScrambleText({
  text,
  as = "span",
  className,
  trigger = "inview",
  delay = 0,
}: ScrambleTextProps) {
  const Tag = as;
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState<{ ch: string; visible: boolean }[]>(() =>
    text.split("").map((ch) => ({ ch, visible: true })),
  );
  const frameRef = useRef(0);
  const ranRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = text.split("");

    const run = () => {
      if (ranRef.current) return;
      ranRef.current = true;
      if (reduce) return;
      const begin = performance.now() + delay;
      setDisplay(chars.map((ch) => ({ ch, visible: ch === " " })));

      const tick = (now: number) => {
        const t = now - begin;
        let finished = true;
        const next = chars.map((ch, i) => {
          if (ch === " ") return { ch, visible: true };
          const from = START + i * STEP;
          if (t < from) {
            finished = false;
            return { ch, visible: false };
          }
          if (t < from + DURATION) {
            finished = false;
            return { ch: DIGITS[Math.floor(Math.random() * DIGITS.length)] ?? "0", visible: true };
          }
          return { ch, visible: true };
        });
        setDisplay(next);
        if (!finished) frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    if (trigger === "mount") {
      // Hide the text now, play it once the preloader is gone.
      if (!reduce) setDisplay(chars.map((ch) => ({ ch, visible: ch === " " })));
      const stop = whenPreloaderDone(run);
      return () => {
        stop();
        cancelAnimationFrame(frameRef.current);
        ranRef.current = false;
      };
    }

    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
      ranRef.current = false;
    };
  }, [text, trigger, delay]);

  return (
    <Tag ref={ref as never} className={cn(className)} aria-label={text} data-no-scramble="">
      <span aria-hidden="true">
        {display.map((item, i) => (
          <span key={i} style={item.visible ? undefined : { visibility: "hidden" }}>
            {item.ch}
          </span>
        ))}
      </span>
    </Tag>
  );
}
