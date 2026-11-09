"use client";

import { useEffect, useRef } from "react";

type BitEdgeProps = {
  from?: string;
  to?: string;
  phrase?: string;
  seed?: number;
  className?: string;
};

const CELL = 16;

function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function isDark(hex: string) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function edgeRow(col: number, rows: number, seed: number) {
  const wave =
    Math.sin(col * 0.085 + seed) * 1.6 +
    Math.sin(col * 0.23 + seed * 1.7) * 0.7;
  const jitter = (hash(col * 13 + seed * 97) - 0.5) * 3.2;
  const row = Math.round(rows * 0.46 + wave + jitter);
  return Math.max(2, Math.min(rows - 3, row));
}

function paint(
  canvas: HTMLCanvasElement,
  from: string,
  to: string,
  phrase: string,
  seed: number,
  progress: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = window.devicePixelRatio || 1;
  const nextW = Math.max(1, Math.floor(width * ratio));
  const nextH = Math.max(1, Math.floor(height * ratio));
  if (canvas.width !== nextW || canvas.height !== nextH) {
    canvas.width = nextW;
    canvas.height = nextH;
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const cols = Math.ceil(width / CELL);
  const rows = Math.ceil(height / CELL);
  const edges = Array.from({ length: cols }, (_, col) =>
    edgeRow(col, rows, seed),
  );
  const glyphs = phrase.replace(/\s+/g, " ").trim();
  const font = getComputedStyle(document.body).fontFamily;
  const fromDark = isDark(from);
  const toDark = isDark(to);
  const onFrom = fromDark ? "#f3f1ea" : "#161616";
  const onTo = toDark ? "#8a8a8a" : "#161616";

  ctx.fillStyle = to;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = from;
  edges.forEach((edge, col) => {
    ctx.fillRect(col * CELL, 0, CELL + 1, edge * CELL);
  });

  // Chunks of the lower color biting up into the upper field.
  ctx.fillStyle = to;
  for (let col = 0; col < cols; col++) {
    const roll = hash(col * 19 + seed * 3);
    if (roll < (fromDark ? 0.58 : 0.72)) continue;
    const tall = fromDark ? 1 : 1 + Math.floor(hash(col * 7 + seed) * 4);
    const wide = fromDark ? 1 : roll > 0.9 ? 3 : roll > 0.82 ? 2 : 1;
    const top = Math.max(0, edges[col] - tall);
    ctx.fillRect(col * CELL, top * CELL, wide * CELL, tall * CELL);
    for (let c = col; c < Math.min(cols, col + wide); c++) {
      edges[c] = Math.min(edges[c], top);
    }
  }

  const paintSquares = (
    darkOnTop: boolean,
    inked: number,
    glyphRate: number,
  ) => {
    const step = 10;
    const letter = 8;
    const gridCols = Math.ceil(width / step);
    const gridRows = Math.ceil(height / step);
    const skyline = Array.from({ length: gridCols }, (_, col) => {
      const wave =
        Math.sin(col * 0.09 + seed) * 2.2 +
        Math.sin(col * 0.31 + seed * 1.4) * 1.3;
      const jitter = (hash(col * 13 + seed * 97) - 0.5) * 9;
      const spike = hash(col * 41 + seed * 5) > 0.86 ? (hash(col * 3 + seed) - 0.5) * 22 : 0;
      const drift = Math.sin(col * 0.021 + seed * 2.3) * 7;
      const row = Math.round(gridRows * 0.4 + wave + jitter + spike + drift);
      return Math.max(2, Math.min(gridRows - 3, row));
    });

    ctx.font = `500 ${letter}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Same 10px squares. Their survival chance falls across almost the
    // whole band so the field never reads as a hard color cut.
    const falloffSpan = Math.max(16, Math.round(gridRows * 0.94));

    for (let row = 0; row < gridRows; row++) {
      const distToBlack = darkOnTop ? row : gridRows - 1 - row;
      const presence = smoothstep(distToBlack / falloffSpan);
      for (let col = 0; col < gridCols; col++) {
        const x = col * step;
        const y = row * step;
        const inDark = darkOnTop ? row <= skyline[col] : row >= skyline[col];
        const clump = hash(Math.floor(col / 5) * 31 + Math.floor(row / 4) * 67 + seed);
        const slot = (hash(col * 17 + row * 53 + seed) + clump) / 2;
        const localInked = 1 - (1 - inked) * (inDark ? presence : 1);
        const painted = !inDark || slot < localInked;
        const darkColor = darkOnTop ? from : to;
        const lightColor = darkOnTop ? to : from;
        ctx.fillStyle = painted && inDark ? darkColor : lightColor;
        ctx.fillRect(x, y, step, step);
        const glyphHere = glyphRate * (inDark ? presence : 1);
        if (!painted || hash(col * 29 + row * 7 + seed) > glyphHere) continue;
        const index = Math.floor(hash(col * 9 + row * 3 + seed) * glyphs.length);
        const ch = glyphs[index] ?? "";
        if (ch === " ") continue;
        ctx.fillStyle = inDark ? "#c9c6bc" : onFrom;
        ctx.fillText(ch, x + step / 2, y + step / 2 + 0.5);
      }
    }
  };

  if (fromDark) {
    paintSquares(true, 0.04 + progress * 0.96, 0.62);
  }

  if (toDark) {
    paintSquares(false, 0.04 + progress * 0.96, 0.62);
  }
}

export function BitEdge({
  from = "#0a0a0a",
  to = "#fcfbf9",
  phrase = "SMALL TEAM DIRECT ACCESS NO ACCOUNT MANAGERS",
  seed = 4,
  className,
}: BitEdgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frame = 0;
    let last = -1;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (view - rect.top) / (view * 0.9)));
      if (Math.abs(progress - last) < 0.012 && last >= 0) return;
      last = progress;
      paint(canvas, from, to, phrase, seed, progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(() => {
      last = -1;
      draw();
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [from, to, phrase, seed]);

  return (
    <div
      aria-hidden="true"
      className={className ?? "h-72 w-full md:h-[22rem]"}
      style={
        isDark(to)
          ? { maskImage: "linear-gradient(to bottom, transparent, #000 18%)" }
          : { maskImage: "linear-gradient(to bottom, #000 72%, transparent)" }
      }
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
