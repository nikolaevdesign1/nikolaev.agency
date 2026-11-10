"use client";

import { useEffect, useRef } from "react";
import { projectIsAwarded, type Project } from "@/lib/data/projects";

/**
 * Dark info plate that follows the cursor while it is over the parent `group`
 * (the nearest `relative` ancestor). It may leave the tile, but stays in the viewport.
 */
export function HoverPlate({ project }: { project: Pick<Project, "year" | "services" | "credits" | "award"> }) {
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plate = plateRef.current;
    const host = plate?.parentElement;
    if (!plate || !host) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const show = (on: boolean) => {
      plate.style.opacity = on ? "1" : "0";
    };
    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const pad = 8;
      const w = plate.offsetWidth;
      const h = plate.offsetHeight;
      const x = Math.min(Math.max(pad, event.clientX + 16), window.innerWidth - w - pad) - rect.left;
      const y = Math.min(Math.max(pad, event.clientY + 16), window.innerHeight - h - pad) - rect.top;
      plate.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      show(true);
    };
    const leave = () => show(false);

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  const rows: { label: string; value: string }[] = [
    { label: "Year", value: project.year },
    project.credits?.length
      ? { label: "Credits", value: project.credits.join(" · ") }
      : { label: "Services", value: project.services.join(" · ") },
  ];
  if (projectIsAwarded(project as Project)) {
    rows.push({ label: "Awards", value: project.award ?? "" });
  }

  return (
    <div
      ref={plateRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-30 w-[min(300px,80vw)] opacity-0 transition-opacity duration-200"
    >
      <dl className="flex flex-col gap-2.5 rounded-[8px] bg-[#161616] px-4 py-3.5 font-mono text-[12px] leading-none text-white">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6">
            <dt className="shrink-0 text-white/45">{row.label}</dt>
            <dd className="min-w-0 truncate text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
