"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projectIsAwarded, type Project } from "@/lib/data/projects";
import { PhotoBit } from "@/components/photo-bit";
import { CursorFollowCta } from "@/components/cursor-follow-cta";

const TILE_W = 420;
const TILE_H = 315;
const CAPTION_H = 118;
const MIN_GAP_X = 520;
const MIN_GAP_Y = 460;
const JITTER_X = 70;
const JITTER_Y = 70;
const CELL_W = TILE_W + MIN_GAP_X + JITTER_X;
const CELL_H = TILE_H + CAPTION_H + MIN_GAP_Y + JITTER_Y;

type Cell = {
  key: string;
  x: number;
  y: number;
  src: string;
  title: string;
  seed: number;
  blurb: string;
  direction: string;
  award: string | null;
};

const GRID = 48;
const BIT_STEP = 156;

type Bit = { key: string; x: number; y: number; glyph: "0" | "1" };

function hash(x: number, y: number) {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n ^ (n >>> 16)) >>> 0;
}

function unit(n: number) {
  return n / 4294967296;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function shortLine(summary: string) {
  const head = (summary.split("—")[0] ?? summary).trim();
  const sentence = (head.split(/(?<=\.)\s/)[0] ?? head).trim().replace(/[,\s]+$/, "");
  const clean = sentence.replace(/\.$/, "");
  if (clean.length <= 92) return clean;
  const clause = clean.split(",")[0]?.trim() ?? clean;
  if (clause.length >= 24 && clause.length <= 92) return clause;
  return `${clean.slice(0, 89).trimEnd()}…`;
}

function directionOf(project: Project) {
  const services = project.services.filter((service) => service.trim().length > 0);
  return [project.category, ...services].join(" · ");
}

function awardPlaque(project: Project) {
  if (!projectIsAwarded(project)) return null;
  const record = project as Project & {
    award?: unknown;
    awards?: unknown;
    prize?: unknown;
    prizes?: unknown;
    winner?: unknown;
  };
  const values = [record.award, record.awards, record.prize, record.prizes, record.winner];
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item.trim()) return item.trim();
      }
    }
  }
  return "Award";
}

function buildBits(camX: number, camY: number, width: number, height: number) {
  const startCol = Math.floor(camX / BIT_STEP) - 1;
  const startRow = Math.floor(camY / BIT_STEP) - 1;
  const cols = Math.ceil(width / BIT_STEP) + 3;
  const rows = Math.ceil(height / BIT_STEP) + 3;
  const bits: Bit[] = [];

  for (let row = startRow; row < startRow + rows; row++) {
    for (let col = startCol; col < startCol + cols; col++) {
      const h = hash(col + 8191, row - 4093);
      if (unit(h) > 0.34) continue;
      bits.push({
        key: `${col}:${row}`,
        x: col * BIT_STEP + unit(hash(col, row + 101)) * BIT_STEP * 0.78,
        y: row * BIT_STEP + unit(hash(col + 53, row)) * BIT_STEP * 0.78,
        glyph: (h & 1) === 0 ? "0" : "1",
      });
    }
  }

  return bits;
}

function place(col: number, row: number) {
  const jx = unit(hash(col, row));
  const jy = unit(hash(col + 17, row + 29));
  const rowShift = unit(hash(row, 0x51f7)) * CELL_W;
  return {
    x: col * CELL_W + rowShift + jx * JITTER_X,
    y: row * CELL_H + jy * JITTER_Y,
  };
}

function buildCells(
  camX: number,
  camY: number,
  width: number,
  height: number,
  projectList: readonly Project[],
) {
  if (!projectList?.length) return [];
  const startCol = Math.floor(camX / CELL_W) - 2;
  const startRow = Math.floor(camY / CELL_H) - 2;
  const cols = Math.ceil(width / CELL_W) + 5;
  const rows = Math.ceil(height / CELL_H) + 5;
  const cells: Cell[] = [];

  for (let row = startRow; row < startRow + rows; row++) {
    for (let col = startCol; col < startCol + cols; col++) {
      const h = hash(col, row);
      const project = projectList[h % projectList.length];
      const variant = h % 97;
      const { x, y } = place(col, row);
      cells.push({
        key: `${col}:${row}`,
        x,
        y,
        title: project.title,
        blurb: shortLine(project.summary),
        direction: directionOf(project),
        award: awardPlaque(project),
        seed: h,
        src: `https://picsum.photos/seed/${project.slug}-${variant}/1280/960`,
      });
    }
  }

  return cells;
}

export function InfinityVision({
  theme,
  projects,
}: {
  theme: "light" | "dark";
  projects: readonly Project[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const camRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const kickRef = useRef<() => void>(() => {});
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    camX: number;
    camY: number;
  } | null>(null);
  const [cam, setCam] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      setViewport({ width: root.clientWidth, height: root.clientHeight });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(root);

    let frame = 0;
    let running = false;
    const tick = () => {
      running = false;
      const cam = camRef.current;
      const target = targetRef.current;
      const x = cam.x + (target.x - cam.x) * 0.07;
      const y = cam.y + (target.y - cam.y) * 0.07;
      if (Math.abs(target.x - x) < 0.4 && Math.abs(target.y - y) < 0.4) {
        camRef.current = { x: target.x, y: target.y };
        setCam({ x: target.x, y: target.y });
        return;
      }
      camRef.current = { x, y };
      setCam({ x, y });
      running = true;
      frame = requestAnimationFrame(tick);
    };
    kickRef.current = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientHeight : 1;
      targetRef.current = {
        x: targetRef.current.x + event.deltaX * unit * 0.38,
        y: targetRef.current.y + event.deltaY * unit * 0.38,
      };
      kickRef.current();
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("wheel", onWheel);
    };
  }, []);

  const cells = useMemo(
    () => buildCells(cam.x, cam.y, viewport.width, viewport.height, projects),
    [cam.x, cam.y, viewport.width, viewport.height, projects],
  );
  const bits = useMemo(
    () => buildBits(cam.x, cam.y, viewport.width, viewport.height),
    [cam.x, cam.y, viewport.width, viewport.height],
  );
  const gridInk = theme === "dark" ? "rgba(243, 241, 234, 0.05)" : "rgba(35, 35, 35, 0.045)";
  const digitInk = theme === "dark" ? "rgba(243, 241, 234, 0.72)" : "rgba(35, 35, 35, 0.62)";

  return (
    <div
      ref={rootRef}
      data-lenis-prevent
      data-lenis-prevent-wheel
      className={`absolute inset-0 overflow-hidden touch-none ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      aria-label="Project covers. Scroll or drag in any direction."
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        rootRef.current?.setPointerCapture(event.pointerId);
        dragRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          camX: targetRef.current.x,
          camY: targetRef.current.y,
        };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        targetRef.current = {
          x: drag.camX - (event.clientX - drag.x) * 0.62,
          y: drag.camY - (event.clientY - drag.y) * 0.62,
        };
        kickRef.current();
      }}
      onPointerUp={(event) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        setDragging(false);
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div
          data-field-grid=""
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${gridInk} 0.5px, transparent 0.5px), linear-gradient(to bottom, ${gridInk} 0.5px, transparent 0.5px)`,
            backgroundSize: `${GRID}px ${GRID}px`,
            backgroundPosition: `${-mod(cam.x, GRID)}px ${-mod(cam.y, GRID)}px`,
          }}
        />
        {bits.map((bit) => (
          <span
            key={bit.key}
            data-field-digit=""
            className="absolute font-mono text-[12px] leading-none"
            style={{
              color: digitInk,
              transform: `translate3d(${bit.x - cam.x}px, ${bit.y - cam.y}px, 0)`,
            }}
          >
            {bit.glyph}
          </span>
        ))}
      </div>
      {cells.map((cell) => (
        <div
          key={cell.key}
          data-project-tile=""
          className="absolute z-10"
          style={{
            width: TILE_W,
            transform: `translate3d(${cell.x - cam.x}px, ${cell.y - cam.y}px, 0)`,
          }}
        >
          <div className="overflow-hidden rounded-2xl" style={{ height: TILE_H }}>
            <CursorFollowCta label="View case study" className="h-full w-full">
              <PhotoBit
                src={cell.src}
                title={cell.title}
                seed={cell.seed}
                theme={theme}
              />
            </CursorFollowCta>
          </div>
          <div data-project-caption="" className="px-1 pt-3" style={{ minHeight: CAPTION_H }}>
            <div className="flex items-baseline justify-between gap-3">
              <p
                data-project-title=""
                className="font-serif text-3xl font-medium leading-none tracking-tight text-foreground"
              >
                {cell.title}
              </p>
              {cell.award ? (
                <span
                  data-award-plaque=""
                  className="shrink-0 rounded-[2px] border border-foreground/45 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
                >
                  {cell.award}
                </span>
              ) : null}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted">{cell.blurb}</p>
            <p
              data-project-direction=""
              className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/75"
            >
              {cell.direction}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
