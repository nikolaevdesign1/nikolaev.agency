"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { InfinityVision } from "@/components/infinity-vision";
import { projectIsAwarded, projects } from "@/lib/data/projects";
import { CursorFollowCta } from "@/components/cursor-follow-cta";
import { ProjectCover } from "@/components/project-cover";

type Theme = "light" | "dark";
type View = "field" | "list";
type Shown = View | "clear";

const PASSAGE_MS = 840;
const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

function glyphHash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function buildLetterField(width: number, height: number, font: string) {
  const cell = 8;
  const texH = Math.max(220, Math.round(height * 0.42));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = texH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, texH);
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(texH / cell);
  for (let row = 0; row < rows; row++) {
    const norm = Math.abs(row + 0.5 - rows / 2) / (rows / 2);
    const density = Math.exp(-norm * norm * 1.65);
    ctx.fillStyle = density > 0.5 ? "#141414" : "#6a6862";
    const y = row * cell + cell / 2;
    for (let col = 0; col < cols; col++) {
      const roll = glyphHash(col * 17 + row * 53);
      if (roll > density * 0.97) continue;
      const pick = glyphHash(col * 9 + row * 3);
      const ch = GLYPHS[Math.floor(pick * GLYPHS.length)] ?? "a";
      ctx.fillText(ch, col * cell + cell / 2, y);
    }
  }

  return canvas;
}

function LetterDensityPassage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width < 1 || height < 1) return;

    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const font = `500 7px ${getComputedStyle(document.body).fontFamily}`;
    const field = buildLetterField(width, height, font);
    if (!field) return;

    let frame = 0;
    let stopped = false;
    const start = performance.now();
    const strips = 16;

    const tick = (now: number) => {
      if (stopped) return;
      const progress = Math.min(1, (now - start) / PASSAGE_MS);
      const y = -field.height + progress * (height + field.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#f7f6f2";
      ctx.fillRect(0, 0, width, height);
      const sw = Math.ceil(width / strips);
      for (let i = 0; i < strips; i++) {
        const sx = i * sw;
        const shift = Math.sin(i * 0.62 + progress * Math.PI * 2) * 12;
        ctx.drawImage(field, sx, 0, sw, field.height, sx, y + shift, sw, field.height);
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      data-letter-passage=""
      data-state="playing"
      data-duration={PASSAGE_MS}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 bg-[#f7f6f2]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export function ProjectsView() {
  const [theme, setTheme] = useState<Theme>("light");
  const [view, setView] = useState<View>("field");
  const [shown, setShown] = useState<Shown>("field");
  const [passing, setPassing] = useState(false);
  const [awardsOnly, setAwardsOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const destination = useRef<View>("field");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finishNow = () => {
      if (!motion.matches) return;
      if (timer.current != null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
      setPassing(false);
      setShown(destination.current);
    };
    motion.addEventListener("change", finishNow);
    return () => {
      motion.removeEventListener("change", finishNow);
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, []);

  const selectView = (next: View) => {
    if (next === destination.current && shown === next && !passing) return;
    destination.current = next;
    setView(next);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (timer.current != null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
      setPassing(false);
      setShown(next);
      return;
    }

    if (passing) return;

    setShown("clear");
    setPassing(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setPassing(false);
      setShown(destination.current);
    }, PASSAGE_MS);
  };

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).sort(),
    [],
  );
  const locations = useMemo(
    () => Array.from(new Set(projects.map((p) => p.location))).sort(),
    [],
  );

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        if (awardsOnly && !projectIsAwarded(project)) return false;
        if (categoryFilter && project.category !== categoryFilter) return false;
        if (locationFilter && project.location !== locationFilter) return false;
        return true;
      }),
    [awardsOnly, categoryFilter, locationFilter],
  );

  const changeTheme = (next: Theme, event: React.MouseEvent<HTMLButtonElement>) => {
    if (next === theme) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--theme-toggle-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-toggle-y", `${rect.top + rect.height / 2}px`);

    const apply = () => setTheme(next);
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <div
      data-page-theme={theme}
      data-projects-view={view}
      data-projects-shown={shown}
      data-projects-passage={passing ? "playing" : "idle"}
      aria-busy={passing}
      className="fixed inset-0 z-40 bg-background text-foreground"
    >
      {shown === "field" ? (
        <div className="absolute inset-0">
          <InfinityVision theme={theme} projects={visible} />
        </div>
      ) : null}

      {shown === "list" ? (
        <div
          data-lenis-prevent
          className="absolute inset-0 z-10 overflow-y-auto"
          aria-label="Project catalog"
        >
          <div className="w-full px-6 pb-40 pt-28 md:px-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>{" "}
              / Work
            </p>
            <h1 className="mt-4 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-7xl">
              Projects
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              {visible.length} of {projects.length} case studies — brand, product, and motion
              work shipped end to end.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-4 font-mono text-[11px] uppercase tracking-[0.14em]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted">Category</span>
                <FilterPill active={categoryFilter === null} onClick={() => setCategoryFilter(null)}>
                  All
                </FilterPill>
                {categories.map((category) => (
                  <FilterPill
                    key={category}
                    active={categoryFilter === category}
                    onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                  >
                    {category}
                  </FilterPill>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted">Location</span>
                <FilterPill active={locationFilter === null} onClick={() => setLocationFilter(null)}>
                  All
                </FilterPill>
                {locations.map((location) => (
                  <FilterPill
                    key={location}
                    active={locationFilter === location}
                    onClick={() => setLocationFilter(locationFilter === location ? null : location)}
                  >
                    {location}
                  </FilterPill>
                ))}
              </div>
              <button
                type="button"
                aria-pressed={awardsOnly}
                onClick={() => setAwardsOnly((on) => !on)}
                className={`rounded-[4px] border px-3 py-1.5 transition-colors ${
                  awardsOnly
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                Awarded only
              </button>
            </div>

            {visible.length === 0 ? (
              <p className="mt-16 font-mono text-sm uppercase tracking-wider text-muted">
                No projects match these filters.
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 md:grid-cols-3 md:gap-x-12 md:gap-y-16">
                {visible.map((project, i) => (
                  <CursorFollowCta key={project.slug} label="View case study" className="group block">
                    <Link href={`/projects/${project.slug}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-serif text-xl font-medium tracking-tight text-foreground">
                          {project.title}
                        </p>
                        {projectIsAwarded(project) ? (
                          <span className="shrink-0 rounded-[2px] border border-foreground/45 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
                            Award
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {project.category} · {project.location}
                      </p>
                      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg border border-border">
                        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                          <ProjectCover project={project} index={i} className="h-full border-0" />
                        </div>
                      </div>
                    </Link>
                  </CursorFollowCta>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {passing ? <LetterDensityPassage /> : null}

      <div
        data-projects-toolbar=""
        role="toolbar"
        aria-label="Projects"
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-[6px] border border-border bg-background p-1 font-serif text-base text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
      >
        <SlidingGroup activeIndex={theme === "light" ? 0 : 1} ariaLabel="Theme">
          <BarOption pressed={theme === "light"} onClick={(e) => changeTheme("light", e)}>
            Light
          </BarOption>
          <BarOption pressed={theme === "dark"} onClick={(e) => changeTheme("dark", e)}>
            Dark
          </BarOption>
        </SlidingGroup>
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
        <SlidingGroup activeIndex={view === "field" ? 0 : 1} ariaLabel="Layout">
          <BarOption pressed={view === "field"} onClick={() => selectView("field")}>
            Field
          </BarOption>
          <BarOption pressed={view === "list"} onClick={() => selectView("list")}>
            List
          </BarOption>
        </SlidingGroup>
      </div>
    </div>
  );
}

function SlidingGroup({
  activeIndex,
  ariaLabel,
  children,
}: {
  activeIndex: number;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ x: number; width: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const active = container.querySelectorAll("button")[activeIndex] as HTMLElement | undefined;
    if (!active) return;
    setRect({ x: active.offsetLeft, width: active.offsetWidth });
  }, [activeIndex]);

  return (
    <div ref={containerRef} role="group" aria-label={ariaLabel} className="relative flex items-center">
      {rect && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 z-0 rounded-[4px] bg-foreground transition-all duration-300 ease-out"
          style={{ left: rect.x, width: rect.width }}
        />
      )}
      {children}
    </div>
  );
}

function BarOption({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`relative z-10 rounded-[4px] px-4 py-4 transition-colors duration-300 ${
        pressed ? "text-background" : "text-foreground hover:bg-foreground/8"
      }`}
    >
      {children}
    </button>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-[4px] border px-2.5 py-1 transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
