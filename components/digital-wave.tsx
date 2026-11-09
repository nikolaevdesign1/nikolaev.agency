"use client";

import { useEffect, useRef, useState } from "react";

export const DIGITAL_WAVE_MS = 2200;

const FIELD = "#f8f6f2";
const INK = "#1c1c1c";
const CELL = 8;
const FONT_PX = 7;
const GLYPHS = "aaabbddggooqq00pq848#%&*+=";

function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function cellHash(col: number, row: number, salt: number) {
  return hash(
    Math.imul(col + 1, 0x9e3779b1) ^
      Math.imul(row + 1, 0x85ebca77) ^
      Math.imul(salt + 1, 0xc2b2ae3d),
  );
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function presence(progress: number) {
  const inEnd = 0.16;
  const outStart = 0.62;
  if (progress <= 0 || progress >= 1) return 0;
  if (progress < inEnd) return smoothstep(progress / inEnd);
  if (progress > outStart) return 1 - smoothstep((progress - outStart) / (1 - outStart));
  return 1;
}

type Atlas = {
  dpr: number;
  font: string;
  canvas: HTMLCanvasElement;
  cell: number;
};

let atlasCache: Atlas | null = null;

function glyphAtlas(fontFamily: string, dpr: number): Atlas {
  const font = `500 ${Math.max(1, Math.round(FONT_PX * dpr))}px ${fontFamily}`;
  if (atlasCache && atlasCache.dpr === dpr && atlasCache.font === font) return atlasCache;

  const cell = Math.max(1, Math.round(CELL * dpr));
  const canvas = document.createElement("canvas");
  canvas.width = cell * GLYPHS.length;
  canvas.height = cell;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = font;
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < GLYPHS.length; i++) {
      ctx.fillText(GLYPHS[i] ?? "0", i * cell + cell / 2, cell / 2);
    }
  }

  atlasCache = { dpr, font, canvas, cell };
  return atlasCache;
}

function paintWave(
  canvas: HTMLCanvasElement,
  progress: number,
  elapsed: number,
  fontFamily: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pxW = Math.max(1, Math.floor(width * dpr));
  const pxH = Math.max(1, Math.floor(height * dpr));
  if (canvas.width !== pxW || canvas.height !== pxH) {
    canvas.width = pxW;
    canvas.height = pxH;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = 1;
  ctx.fillStyle = FIELD;
  ctx.fillRect(0, 0, width, height);

  const life = presence(progress);
  if (life <= 0.004) return;

  const atlas = glyphAtlas(fontFamily, dpr);
  const cols = Math.ceil(width / CELL);
  const rows = Math.ceil(height / CELL);
  const slice = Math.floor(elapsed / 90);
  const travel = progress * 15;
  const rise = Math.sin(progress * Math.PI * 2.4) * 0.072;

  for (let col = 0; col < cols; col++) {
    const center =
      0.5 +
      rise +
      Math.sin(col * 0.1 + travel) * 0.062 +
      Math.sin(col * 0.23 - travel * 0.7) * 0.03;
    const sigma = Math.max(
      0.05,
      0.055 + 0.085 * life + Math.sin(col * 0.16 + travel * 0.8) * 0.02,
    );
    const inv = 1 / (2 * sigma * sigma);

    for (let row = 0; row < rows; row++) {
      const yNorm = (row + 0.5) / rows;
      const dist = yNorm - center;
      const core = Math.exp(-(dist * dist) * inv);
      const shoulder = Math.min(1, Math.min(yNorm, 1 - yNorm) / 0.1);
      const density = life * (0.78 * core + (core < 0.22 ? 0.018 * shoulder * (1 - core) : 0));
      if (density < 0.012) continue;
      if (cellHash(col, row, 1) > density) continue;

      const index = Math.floor(cellHash(col, row, slice + 4) * GLYPHS.length) % GLYPHS.length;
      ctx.globalAlpha = 0.82 + 0.18 * Math.min(1, core);
      ctx.drawImage(
        atlas.canvas,
        index * atlas.cell,
        0,
        atlas.cell,
        atlas.cell,
        col * CELL,
        row * CELL,
        CELL,
        CELL,
      );
    }
  }

  ctx.globalAlpha = 1;
}

export function DigitalWave() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState<{ elapsed: number } | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const finish = (elapsed: number) => {
      const ms = Math.max(0, Math.round(elapsed));
      overlay.dataset.state = "done";
      overlay.dataset.elapsed = String(ms);
      overlay.style.pointerEvents = "none";
      setDone({ elapsed: ms });
    };

    if (motion.matches) {
      finish(0);
      return;
    }

    const fontFamily = getComputedStyle(document.body).fontFamily || "ui-monospace, monospace";
    overlay.hidden = false;
    overlay.dataset.state = "playing";
    overlay.style.pointerEvents = "auto";

    let frame = 0;
    let stopped = false;
    const start = performance.now();

    const tick = (now: number) => {
      if (stopped) return;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / DIGITAL_WAVE_MS);
      try {
        paintWave(canvas, progress, elapsed, fontFamily);
      } catch {
        finish(elapsed);
        return;
      }
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      finish(elapsed);
    };

    const onMotion = () => {
      if (!motion.matches || stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      finish(performance.now() - start);
    };

    const onFonts = () => {
      atlasCache = null;
    };

    motion.addEventListener("change", onMotion);
    document.fonts?.addEventListener("loadingdone", onFonts);
    paintWave(canvas, 0, 0, fontFamily);
    frame = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", onMotion);
      document.fonts?.removeEventListener("loadingdone", onFonts);
    };
  }, []);

  return (
    <>
      <style>
        {`@media (prefers-reduced-motion: reduce){.digital-wave{display:none !important}}`}
      </style>
      <div
        ref={overlayRef}
        data-digital-wave=""
        data-state={done ? "done" : "playing"}
        data-duration={DIGITAL_WAVE_MS}
        data-elapsed={done ? done.elapsed : undefined}
        aria-hidden="true"
        hidden={done !== null}
        className={`digital-wave fixed inset-0 z-[90] ${done ? "pointer-events-none" : "pointer-events-auto"}`}
        style={{ background: FIELD }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    </>
  );
}
