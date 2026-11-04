"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type QueueItem = {
  to: string;
  start: number;
  end: number;
  char?: string;
};

function buildQueue(text: string): QueueItem[] {
  return text.split("").map((to) => {
    const start = Math.floor(Math.random() * 20);
    const end = start + Math.floor(Math.random() * 20) + 10;
    return { to, start, end };
  });
}

function nextChar(current: string | undefined, target: string): string {
  if (target === " ") return " ";
  if (current && Math.random() >= 0.3) return current;
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function renderFrame(queue: QueueItem[], frame: number) {
  let output = "";
  let complete = 0;
  for (const item of queue) {
    if (frame >= item.end) {
      complete++;
      output += item.to;
    } else if (frame >= item.start) {
      item.char = nextChar(item.char, item.to);
      output += item.char;
    }
  }
  return { output, done: complete === queue.length };
}

type ScrambleTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  trigger?: "mount" | "hover" | "inview";
  /** ms before the scramble starts (mount/inview triggers only) */
  delay?: number;
  /** ms between animation steps — lower is faster */
  frameRate?: number;
};

export function ScrambleText({
  text,
  as = "span",
  className,
  trigger = "inview",
  delay = 0,
  frameRate = 28,
}: ScrambleTextProps) {
  const Tag = as;
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const timeoutRef = useRef<number | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function play() {
    const start = () => {
      const queue = buildQueue(text);
      let frame = 0;

      const tick = () => {
        const { output, done } = renderFrame(queue, frame);
        setDisplay(output);
        if (done) return;
        frame++;
        timeoutRef.current = window.setTimeout(tick, frameRate);
      };

      tick();
    };

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (delay > 0) {
      timeoutRef.current = window.setTimeout(start, delay);
    } else {
      start();
    }
  }

  useEffect(() => {
    if (trigger === "mount") {
      play();
      return;
    }

    if (trigger === "inview") {
      const node = ref.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasRun.current) {
              hasRun.current = true;
              play();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 },
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  const handlers = trigger === "hover" ? { onMouseEnter: () => play() } : {};

  return (
    <Tag
      ref={ref as never}
      className={cn("inline-block", className)}
      aria-label={text}
      {...handlers}
    >
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
