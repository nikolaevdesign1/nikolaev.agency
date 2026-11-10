"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projectIsAwarded, projects as allProjects, type Project } from "@/lib/data/projects";
import { PhotoBit } from "@/components/photo-bit";
import { HoverPlate } from "@/components/hover-plate";
import { Tilt } from "@/components/tilt";

const TILE_W = 480;
const TILE_H = 360;
const CAPTION_H = 118;
const MIN_GAP_X = 150;
const MIN_GAP_Y = 110;
const JITTER_X = 60;
const JITTER_Y = 60;
const CELL_W = TILE_W + MIN_GAP_X + JITTER_X;
const CELL_H = TILE_H + CAPTION_H + MIN_GAP_Y + JITTER_Y;

type Cell = {
  key: string;
  x: number;
  y: number;
  src: string;
  slug: string;
  title: string;
  seed: number;
  blurb: string;
  tags: string[];
  award: string | null;
  project: Project;
  number: string;
};

const GRID = 96;
const NOTE_STEP = 300;

const NOTE_POOL = [
  "--STUDIO:",
  ":--DIRECT ACCESS",
  ":--NO ACCOUNT MANAGERS",
  ":--SMALL BY DESIGN",
  "RPL-LOG :--INDEX:",
  ":--READ WITHIN A DAY",
  ":--REPLY FROM THE STUDIO",
  "WRK-LOG :--INDEX:",
  ":--BRAND",
  ":--PRODUCT",
  ":--MOTION",
  "--STATUS: ACCEPTING PROJECTS",
  ":--LOS ANGELES, CA",
  ":--EST. 2021",
  "IDX-001 :--SELECTED WORK",
  ":--MORE SOON",
  ":--REPLY WITHIN 2 DAYS",
  "--SYS: ONLINE",
  ":--CASE STUDIES",
];

type Note = { key: string; x: number; y: number; text: string };

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

function tagsOf(project: Project) {
  const services = project.services.filter((service) => service.trim().length > 0);
  return Array.from(new Set([project.category, ...services]));
}

function awardPlaque(project: Project) {
  return projectIsAwarded(project) ? (project.award?.trim() ?? null) : null;
}

function buildNotes(camX: number, camY: number, width: number, height: number) {
  const startCol = Math.floor(camX / NOTE_STEP) - 1;
  const startRow = Math.floor(camY / NOTE_STEP) - 1;
  const cols = Math.ceil(width / NOTE_STEP) + 3;
  const rows = Math.ceil(height / NOTE_STEP) + 3;
  const notes: Note[] = [];

  for (let row = startRow; row < startRow + rows; row++) {
    for (let col = startCol; col < startCol + cols; col++) {
      const h = hash(col + 8191, row - 4093);
      if (unit(h) > 0.34) continue;
      notes.push({
        key: `${col}:${row}`,
        x: col * NOTE_STEP + unit(hash(col, row + 101)) * NOTE_STEP * 0.7,
        y: row * NOTE_STEP + unit(hash(col + 53, row)) * NOTE_STEP * 0.7,
        text: (NOTE_POOL[h % NOTE_POOL.length] ?? NOTE_POOL[0]).toLowerCase(),
      });
    }
  }

  return notes;
}

function place(col: number, row: number) {
  const jx = unit(hash(col, row));
  const jy = unit(hash(col + 17, row + 29));
  // brick layout: every other row sits half a cell over, so neighbours are predictable
  const rowShift = (mod(row, 2) === 1 ? 0.5 : 0) * CELL_W;
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
      // walk the list so close neighbours never show the same project
      const project = projectList[mod(col + row * 3, projectList.length)];
      const variant = h % 97;
      const { x, y } = place(col, row);
      cells.push({
        key: `${col}:${row}`,
        x,
        y,
        slug: project.slug,
        title: project.title,
        blurb: shortLine(project.summary),
        tags: tagsOf(project),
        award: awardPlaque(project),
        project,
        number: String(allProjects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, "0"),
        seed: h,
        src: project.cover ?? `https://picsum.photos/seed/${project.slug}-${variant}/1280/960`,
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
  const router = useRouter();
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
  const notes = useMemo(
    () => buildNotes(cam.x, cam.y, viewport.width, viewport.height),
    [cam.x, cam.y, viewport.width, viewport.height],
  );
  const dotInk = theme === "dark" ? "rgba(240, 150, 55, 0.55)" : "rgba(35, 35, 35, 0.4)";
  const noteInk = theme === "dark" ? "rgba(243, 241, 234, 0.14)" : "rgba(35, 35, 35, 0.14)";

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
        const drag = dragRef.current;
        if (drag?.pointerId !== event.pointerId) return;
        const moved = Math.hypot(event.clientX - drag.x, event.clientY - drag.y);
        dragRef.current = null;
        if (moved < 6) {
          const hit = document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest<HTMLElement>("[data-project-slug]");
          if (hit?.dataset.projectSlug) router.push(`/projects/${hit.dataset.projectSlug}`);
        }
        setDragging(false);
      }}
      onDragStart={(event) => event.preventDefault()}
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
            backgroundImage: `radial-gradient(${dotInk} 1px, transparent 1px)`,
            backgroundSize: `${GRID}px ${GRID}px`,
            backgroundPosition: `${-mod(cam.x, GRID)}px ${-mod(cam.y, GRID)}px`,
          }}
        />
        {notes.map((note) => (
          <pre
            key={note.key}
            data-field-note=""
            className="absolute m-0 font-mono text-[10px] leading-[1.4] select-none"
            style={{
              color: noteInk,
              transform: `translate3d(${note.x - cam.x}px, ${note.y - cam.y}px, 0)`,
            }}
          >
            {note.text}
          </pre>
        ))}
      </div>
      {cells.map((cell) => (
        <div
          key={cell.key}
          data-project-tile=""
          data-project-slug={cell.slug}
          className="absolute z-10"
          style={{
            width: TILE_W,
            transform: `translate3d(${cell.x - cam.x}px, ${cell.y - cam.y}px, 0)`,
          }}
        >
          <div className="group relative w-full">
            <div data-project-caption="" className="pb-3 pl-0.5">
              <p className="mb-1.5 font-mono text-[10px] text-muted">{cell.number}</p>
              <div className="flex items-baseline justify-between gap-3">
                <p
                  data-project-title=""
                  className="font-serif text-3xl font-medium leading-none text-foreground"
                >
                  {cell.title}
                </p>
                {cell.award ? (
                  <span
                    data-award-plaque=""
                    className="shrink-0 rounded-[2px] border border-foreground/45 px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                  >
                    {cell.award}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted">{cell.blurb}</p>
            </div>
            <div
              className="relative overflow-hidden rounded-[6px]"
              style={{ height: TILE_H }}
            >
              <Tilt className="absolute inset-0">
                <PhotoBit src={cell.src} title={cell.title} seed={cell.seed} theme={theme} />
              </Tilt>
              <HoverPlate project={cell.project} />
              <div
                data-project-direction=""
                className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5"
              >
                {cell.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[4px] bg-white px-2 py-1 font-mono text-[10px] leading-none text-[#141414]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
