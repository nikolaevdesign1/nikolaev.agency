"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InfinityVision } from "@/components/infinity-vision";
import { projectIsAwarded, type Project } from "@/lib/data/projects";
import { ProjectTile } from "@/components/project-tile";
import { ScrambleText } from "@/components/scramble-text";
import { site } from "@/lib/data/site";
import Link from "next/link";
import { FilterCheckbox, FilterSelect, ScrollStrip } from "@/components/filter-controls";

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

export function ProjectsView({ projects }: { projects: Project[] }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [view, setView] = useState<View>("field");
  const [shown, setShown] = useState<Shown>("field");
  const [passing, setPassing] = useState(false);
  const [awardsOnly, setAwardsOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
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
    [projects],
  );
  const locations = useMemo(
    () => Array.from(new Set(projects.map((p) => p.location))).sort(),
    [projects],
  );

  const services = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.services))).sort(),
    [projects],
  );

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        if (awardsOnly && !projectIsAwarded(project)) return false;
        if (categoryFilter && project.category !== categoryFilter) return false;
        if (locationFilter && project.location !== locationFilter) return false;
        if (serviceFilter && !project.services.includes(serviceFilter)) return false;
        return true;
      }),
    [projects, awardsOnly, categoryFilter, locationFilter, serviceFilter],
  );

  const changeTheme = (next: Theme, event: React.MouseEvent<HTMLButtonElement>) => {
    if (next === theme) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const apply = () => setTheme(next);
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    const transition = doc.startViewTransition(apply);
    transition.ready
      .then(() => {
        // Ragged front: a polygon around the click whose radius jitters per vertex and per frame.
        const maxR = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) * 1.25;
        const points = 90;
        const frames = 18;
        const seed = Math.random() * 1000;
        const keyframes = Array.from({ length: frames + 1 }, (_, f) => {
          const t = f / frames;
          const eased = 1 - Math.pow(1 - t, 2.2);
          const poly = Array.from({ length: points }, (_, i) => {
            const angle = (i / points) * Math.PI * 2;
            const lobes = Math.sin(angle * 3 + seed) * 0.1 + Math.sin(angle * 7 - seed * 1.3) * 0.07;
            const spike = Math.sin(i * 12.9898 + seed + f * 0.7) * 43758.5453;
            const jag = (spike - Math.floor(spike) - 0.5) * 0.22;
            const lag = Math.sin(angle * 5 + seed * 2) * 0.12;
            const radius = Math.max(0, eased * (1 + lobes + jag) + lag * (1 - t) * eased) * maxR;
            return `${(cx + Math.cos(angle) * radius).toFixed(1)}px ${(cy + Math.sin(angle) * radius).toFixed(1)}px`;
          });
          return { clipPath: `polygon(${poly.join(",")})`, offset: t };
        });
        document.documentElement.animate(keyframes, {
          duration: 1000,
          easing: "linear",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        });
      })
      .catch(() => {});
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
          <InfinityVision theme={theme} projects={visible} allProjects={projects} />
        </div>
      ) : null}

      {shown === "list" ? (
        <div
          data-lenis-prevent
          className="absolute inset-0 z-10 overflow-y-auto"
          aria-label="Project catalog"
        >
          <div className="relative w-full gutter pb-40 pt-36">
            <div className="relative mt-8 flex flex-col items-center text-center md:mt-10">
              <p className="self-start rounded-[4px] border border-border px-3 py-1.5 font-mono text-[11px] text-muted md:absolute md:right-0 md:top-2 md:self-auto">
                {site.upcoming.count} upcoming projects in {site.upcoming.month}
              </p>
              <h1 className="mt-8 max-w-3xl font-serif text-4xl font-medium leading-[1.05] text-foreground md:mt-0 md:text-6xl">
                <ScrambleText as="span" trigger="mount" text="Featured Projects" />
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                {visible.length} of {projects.length} case studies: brand, product, and motion
                work shipped end to end.
              </p>
            </div>

            <div className="mt-10 flex flex-nowrap items-center gap-3 text-[13px]">
              <ScrollStrip>
                {["All", ...categories].map((category) => {
                  const active =
                    category === "All" ? categoryFilter === null : categoryFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategoryFilter(category === "All" ? null : category)}
                      className={`relative z-10 shrink-0 rounded-[4px] px-3 py-1.5 transition-colors duration-300 ${
                        active
                          ? "text-background"
                          : "text-foreground hover:bg-foreground/8"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </ScrollStrip>
              <div className="ml-auto flex shrink-0 items-center gap-3">
              <FilterCheckbox checked={awardsOnly} onChange={setAwardsOnly}>
                Awarded
              </FilterCheckbox>
              <FilterSelect
                label="Location"
                value={locationFilter}
                options={locations}
                onChange={setLocationFilter}
              />
              <FilterSelect
                label="Services"
                value={serviceFilter}
                options={services}
                onChange={setServiceFilter}
              />
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="mt-16 text-center font-mono text-sm text-muted">
                No projects match these filters.
              </p>
            ) : (
              <div
                key={`${categoryFilter}|${locationFilter}|${serviceFilter}|${awardsOnly}`}
                className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2"
              >
                {visible.map((project, i) => (
                  <div
                    key={project.slug}
                    className="animate-[tile-in_420ms_ease-out_both]"
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    <ProjectTile
                      project={project}
                      index={i}
                    />
                  </div>
                ))}
                {visible.length === projects.length && visible.length % 2 !== 0 ? (
                  <div
                    className="flex min-h-[220px] flex-col justify-between rounded-[6px] bg-surface/60 p-6"
                  >
                    <p className="font-mono text-[11px] text-muted">Next</p>
                    <div>
                      <p className="font-serif text-4xl font-medium leading-none text-foreground md:text-5xl">
                        {site.upcoming.count} projects
                      </p>
                      <p className="mt-2 font-serif text-4xl font-medium leading-none text-muted md:text-5xl">
                        coming soon
                      </p>
                      <p className="mt-4 font-mono text-[11px] text-muted">
                        {site.upcoming.month}
                      </p>
                    </div>
                  </div>
                ) : null}
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
        className="absolute bottom-14 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-[6px] border border-border bg-background p-1 font-serif text-base text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
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
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
        <Link
          href="/contact"
          className="rounded-[4px] bg-foreground px-4 py-2 text-background transition-opacity duration-300 hover:opacity-80"
        >
          Order design
        </Link>
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
      className={`relative z-10 rounded-[4px] px-3 py-2 transition-colors duration-300 ${
        pressed ? "text-background" : "text-foreground hover:bg-foreground/8"
      }`}
    >
      {children}
    </button>
  );
}
