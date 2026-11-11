"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InfinityVision } from "@/components/infinity-vision";
import { projectIsAwarded, type Project } from "@/lib/data/projects";
import { UpcomingPlaque } from "@/components/upcoming-plaque";
import { pixelSwap } from "@/lib/pixel-swap";
import { ProjectTile } from "@/components/project-tile";
import { ScrambleText } from "@/components/scramble-text";
import { site } from "@/lib/data/site";
import Link from "next/link";
import { FilterCheckbox, FilterSelect, ScrollStrip } from "@/components/filter-controls";

type Theme = "light" | "dark";
type View = "field" | "list";


export function ProjectsView({ projects }: { projects: Project[] }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [view, setView] = useState<View>("field");
  const [shown, setShown] = useState<View>("field");
  const [awardsOnly, setAwardsOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const selectView = (next: View) => {
    if (next === shown) return;
    setView(next);
    // The same loader as the home page covers the swap.
    window.dispatchEvent(new Event("studio:preload"));
    setShown(next);
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

  const swapping = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const listContentRef = useRef<HTMLDivElement>(null);

  // The list scrolls inside its own layer, so it gets its own smooth scroll with the site's inertia.
  useEffect(() => {
    if (shown !== "list") return;
    const wrapper = listRef.current;
    const content = listContentRef.current;
    if (!wrapper || !content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { destroy: () => void } | null = null;
    let cancelled = false;
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ wrapper, content, lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.95, autoRaf: true });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, [shown]);
  const changeTheme = (next: Theme) => {
    if (next === theme || swapping.current) return;
    swapping.current = true;
    const fill = next === "dark" ? "#0a0a0a" : "#fcfbf9";
    const ink = next === "dark" ? "#f3f1ea" : "#161616";
    pixelSwap(fill, ink, () => {
      setTheme(next);
      window.setTimeout(() => {
        swapping.current = false;
      }, 400);
    });
  };

  return (
    <div
      data-page-theme={theme}
      data-projects-view={view}
      data-projects-shown={shown}
      className="fixed inset-0 z-40 bg-background text-foreground"
    >
      {shown === "field" ? (
        <div className="absolute inset-0">
          <InfinityVision theme={theme} projects={visible} allProjects={projects} />
        </div>
      ) : null}

      {shown === "list" ? (
        <div
          ref={listRef}
          data-own-lenis=""
          className="absolute inset-0 z-10 overflow-y-auto"
          aria-label="Project catalog"
        >
          <div ref={listContentRef} className="relative w-full gutter pb-40 pt-36">
            <div className="relative mt-8 flex flex-col items-center text-center md:mt-10">
              <button
                type="button"
                onClick={() => document.getElementById("upcoming")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className="rounded-[4px] bg-foreground px-3.5 py-2 font-mono text-[12px] leading-none text-background transition-opacity duration-300 hover:opacity-80"
              >
                {site.upcoming.count} upcoming projects in {site.upcoming.month}
              </button>
              <h1 className="mt-6 max-w-3xl font-serif text-4xl font-medium leading-[1.05] text-foreground md:text-6xl">
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
                {visible.length === projects.length ? <UpcomingPlaque /> : null}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div
        data-projects-toolbar=""
        role="toolbar"
        aria-label="Projects"
        className="absolute bottom-16 left-1/2 z-30 flex origin-bottom -translate-x-1/2 scale-[1.2] items-center gap-1 rounded-[6px] border border-border bg-background p-1 font-serif text-base text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
      >
        <SlidingGroup activeIndex={theme === "light" ? 0 : 1} ariaLabel="Theme">
          <BarOption pressed={theme === "light"} onClick={() => changeTheme("light")}>
            Light
          </BarOption>
          <BarOption pressed={theme === "dark"} onClick={() => changeTheme("dark")}>
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
