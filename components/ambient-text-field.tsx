"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FONT_SIZE = 12;
const LINE = 28;
const TICK_MS = 240;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type AmbientTextFieldProps = {
  phrase: string;
  className?: string;
};

type StudioChatButtonProps = {
  className?: string;
  children: React.ReactNode;
};

function unitFor(phrase: string) {
  return `${phrase}      ·      `;
}

function noise(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

/** Keeps short scattered fragments of the line and blanks the rest, so the field reads as loose letters. */
function scatter(line: string, row: number) {
  const chars = Array.from(line);
  let i = 0;
  let seed = row * 131;
  while (i < chars.length) {
    const gap = 8 + Math.floor(noise(seed++) * 40);
    const run = 3 + Math.floor(noise(seed++) * 9);
    const keep = noise(seed++) < 0.55;
    for (let k = 0; k < gap && i + k < chars.length; k++) chars[i + k] = " ";
    i += gap;
    if (!keep) {
      for (let k = 0; k < run && i + k < chars.length; k++) chars[i + k] = " ";
    }
    i += run;
  }
  return chars.join("");
}

function buildLines(phrase: string, cols: number, rows: number) {
  const unit = unitFor(phrase);
  let built = "";
  while (built.length < cols + unit.length) built += unit;

  return Array.from({ length: rows }, (_, row) => {
    const offset = Math.floor((row * unit.length * 0.37) % unit.length);
    return scatter(built.slice(offset, offset + cols), row);
  });
}

function swapOne(line: string) {
  const chars = Array.from(line);
  const indexes = chars.flatMap((char, index) => (char === " " ? [] : [index]));
  if (indexes.length === 0) return line;

  const index = indexes[Math.floor(Math.random() * indexes.length)];
  let next = chars[index];
  while (next === chars[index]) {
    next = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  chars[index] = next;
  return chars.join("");
}

function swapInPlace(line: string) {
  return swapOne(swapOne(line));
}

function openExistingChat() {
  const header = document.querySelector("header");
  if (!header) return;
  const opener = Array.from(header.querySelectorAll("button")).find(
    (node) => node.textContent?.replace(/\s+/g, " ").trim() === "Let's chat",
  );
  opener?.click();
}

export function StudioChatButton({ className, children }: StudioChatButtonProps) {
  return (
    <button type="button" className={className} onClick={openExistingChat}>
      {children}
    </button>
  );
}

export function AmbientTextField({ phrase, className }: AmbientTextFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const charWidth = useRef(FONT_SIZE * 0.6);
  const gridRef = useRef({ cols: 0, rows: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const measure = () => {
      const svg = svgRef.current;
      if (svg) {
        const probe = document.createElementNS("http://www.w3.org/2000/svg", "text");
        probe.setAttribute("font-size", String(FONT_SIZE));
        probe.setAttribute("letter-spacing", "0");
        probe.setAttribute(
          "font-family",
          "var(--font-mono-display), ui-monospace, monospace",
        );
        const sample = "SMALL TEAM · DIRECT ACCESS · NO ACCOUNT MANAGERS 0123456789";
        probe.textContent = sample;
        svg.appendChild(probe);
        const measured = probe.getComputedTextLength() / sample.length;
        probe.remove();
        if (measured > 0) charWidth.current = measured;
      }

      const width = node.offsetWidth;
      const height = node.offsetHeight;
      if (width === 0 || height === 0) return;

      const cols = Math.ceil(width / charWidth.current) + 2;
      const rows = Math.ceil(height / LINE) + 1;
      if (gridRef.current.cols === cols && gridRef.current.rows === rows) return;

      gridRef.current = { cols, rows };
      setSize({ width, height });
      setLines(buildLines(phrase, cols, rows));
    };

    measure();
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [phrase]);

  useEffect(() => {
    if (lines.length === 0) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interval = 0;

    const stop = () => {
      if (interval) window.clearInterval(interval);
      interval = 0;
    };

    const start = () => {
      stop();
      if (media.matches) return;
      interval = window.setInterval(() => {
        setLines((current) => {
          if (current.length === 0) return current;
          const next = current.map((line, row) =>
            row % 2 === 0 || Math.random() < 0.4 ? swapInPlace(line) : line,
          );
          if (next.every((line, index) => line === current[index])) {
            next[0] = swapInPlace(current[0]);
          }
          return next;
        });
      }, TICK_MS);
    };

    start();
    media.addEventListener("change", start);
    return () => {
      stop();
      media.removeEventListener("change", start);
    };
  }, [lines.length]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        ref={svgRef}
        className="block h-full w-full"
        width={size.width || undefined}
        height={size.height || undefined}
        xmlns="http://www.w3.org/2000/svg"
      >
        {lines.map((line, row) => (
          <text
            key={row}
            x="0"
            y={row * LINE + FONT_SIZE}
            fill="rgba(243, 241, 234, 0.07)"
            fontSize={FONT_SIZE}
            letterSpacing="0"
            textLength={size.width ? size.width + 4 : undefined}
            lengthAdjust="spacing"
            fontFamily="var(--font-mono-display), ui-monospace, monospace"
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  );
}
