"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DIGITS = "0123456789";

type NumberRollProps = {
  value: string;
  className?: string;
  delay?: number;
};

export function NumberRoll({ value, className, delay = 0 }: NumberRollProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasRun.current) return;
          hasRun.current = true;
          window.setTimeout(() => {
            let frame = 0;
            const totalFrames = 18;
            const tick = () => {
              frame++;
              if (frame >= totalFrames) {
                setDisplay(value);
                return;
              }
              const scrambled = value
                .split("")
                .map((char) =>
                  /\d/.test(char)
                    ? DIGITS[Math.floor(Math.random() * DIGITS.length)]
                    : char,
                )
                .join("");
              setDisplay(scrambled);
              requestAnimationFrame(tick);
            };
            tick();
          }, delay);
          observer.disconnect();
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={value}>
      {display}
    </span>
  );
}
