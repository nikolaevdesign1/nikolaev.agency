"use client";

import { useMemo, useState } from "react";
import { projects } from "@/lib/data/projects";
import { ProjectCover } from "@/components/project-cover";
import Link from "next/link";
import { CursorFollowCta } from "@/components/cursor-follow-cta";

export function BasedCatalog() {
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(
    () =>
      filter === "All" ? projects : projects.filter((p) => p.category === filter),
    [filter],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`rounded border-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              filter === category
                ? "border-accent text-accent"
                : "border-border text-foreground/70 hover:border-foreground/40"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
        {filtered.map((project, index) => (
          <CursorFollowCta key={project.slug} label="View case study">
          <Link href={`/projects/${project.slug}`} className="group">
            <ProjectCover project={project} index={index} className="aspect-[4/3]" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium tracking-tight transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                  {project.category} — {project.year}
                </p>
              </div>
            </div>
          </Link>
          </CursorFollowCta>
        ))}
      </div>
    </div>
  );
}
