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

  if (fromDark) {
    // Dark above, light below: the same rising effect, drawn upside down with upright letters.
    const upright = ctx.fillText.bind(ctx);
    ctx.save();
    ctx.transform(1, 0, 0, -1, 0, height);
    ctx.fillText = (text: string, x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, -1);
      upright(text, 0, 0);
      ctx.restore();
    };
    try {
      paintRise(ctx, width, height, to, from, glyphs, seed, progress, font);
    } finally {
      delete (ctx as { fillText?: unknown }).fillText;
      ctx.restore();
    }
  }

  if (toDark) {
    paintRise(ctx, width, height, from, to, glyphs, seed, progress, font);
  }
}

/**
 * Light page rising into a dark ground. The edge is built from 4-cell blocks with
 * small steps, a thin dithered band sits right under it, letters sit on a regular
 * row grid and fade away from the edge, and a travelling wave brightens them.
 */
function paintRise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  from: string,
  to: string,
  glyphs: string,
  seed: number,
  progress: number,
  font: string,
) {
  const step = 10;
  const blockW = 4;
  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);

  const blocks = Math.ceil(cols / blockW);
  const base: number[] = [];
  for (let b = 0; b < blocks; b++) {
    const wave = Math.sin(b * 0.33 + seed) * 2 + Math.sin(b * 0.1 + seed * 1.7) * 3;
    const jitter = (hash(b * 13 + seed * 97) - 0.5) * 3;
    let row = Math.round(rows * 0.42 + wave + jitter);
    if (b > 0) row = Math.max(base[b - 1] - 2, Math.min(base[b - 1] + 2, row));
    base.push(row);
  }

  const rise = 1 - progress;
  ctx.fillStyle = from;
  ctx.fillRect(0, 0, width, height);

  ctx.font = `500 8px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const glyphAt = (col: number, row: number) => {
    const ch = glyphs[Math.floor(hash(col * 9 + row * 3 + seed) * glyphs.length)] ?? "";
    return ch === " " ? "" : ch.toUpperCase();
  };

  for (let col = 0; col < cols; col++) {
    // Lift stays below the canvas height, so the edge is ragged along its whole length (no flat run).
    const lift = Math.round(rise * rows * 0.4 * (0.55 + 0.45 * Math.sin(col * 0.05 + seed)));
    const edge = Math.min(rows - 3, base[Math.floor(col / blockW)] + lift);
    const x = col * step;
    const travel = 0.5 + 0.5 * Math.sin(col * 0.09 - progress * 14 + seed);

    // dark ground
    ctx.fillStyle = to;
    ctx.fillRect(x, edge * step, step + 0.5, height - edge * step + 2);

    // letters above the edge, sparse and fading upward
    for (let d = 1; d <= 14; d++) {
      const row = edge - d;
      if (row < 0 || row % 2 !== 0) continue;
      const odds = 0.3 * (1 - d / 15);
      if (hash(col * 31 + row * 17 + seed) > odds) continue;
      const ch = glyphAt(col, row);
      if (!ch) continue;
      ctx.fillStyle = `rgba(22,22,22,${(0.25 + 0.5 * (1 - d / 14)).toFixed(2)})`;
      ctx.fillText(ch, x + step / 2, row * step + step / 2 + 0.5);
    }

    // dithered band right under the edge: light runs with dark letters
    for (let d = 0; d < 3; d++) {
      const row = edge + d;
      const run = Math.floor(col / 3);
      if (hash(run * 41 + row * 7 + seed) > 0.42 - d * 0.14) continue;
      ctx.fillStyle = from;
      ctx.fillRect(x, row * step, step, step);
      const ch = glyphAt(col, row);
      if (ch) {
        ctx.fillStyle = "#161616";
        ctx.fillText(ch, x + step / 2, row * step + step / 2 + 0.5);
      }
    }

    // letters inside the ground, on even rows, fading with depth
    for (let row = edge + 3; row < rows; row += 2) {
      const depth = (row - edge) / Math.max(1, rows * 0.55);
      const odds = 0.34 * Math.max(0, 1 - depth);
      if (odds <= 0 || hash(col * 29 + row * 11 + seed) > odds) continue;
      const ch = glyphAt(col, row);
      if (!ch) continue;
      const alpha = (0.16 + 0.42 * travel) * Math.max(0, 1 - depth * 0.9);
      ctx.fillStyle = `rgba(232,229,220,${alpha.toFixed(2)})`;
      ctx.fillText(ch, x + step / 2, row * step + step / 2 + 0.5);
    }
  }

  // make sure the last row is solid so no hairline shows against the section below
  ctx.fillStyle = to;
  ctx.fillRect(0, height - 2, width, 2);
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
      className={className ?? "-mb-px h-72 w-full md:h-[22rem]"}
      style={{ backgroundColor: from }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={isDark(to) ? { maskImage: "linear-gradient(to bottom, transparent, #000 18%)" } : undefined}
      />
    </div>
  );
}
