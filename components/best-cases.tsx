"use client";

import { projects } from "@/lib/data/projects";
import { Reveal } from "@/components/reveal";
import { ProjectTile } from "@/components/project-tile";

export function BestCases() {
  const cases = projects.filter((project) => project.featured);

  return (
    <section className="gutter py-24 md:py-32">
      <p className="font-mono text-[11px] text-muted">
        Selected work
      </p>
      <div className="mt-6 columns-1 gap-x-4 sm:columns-2 lg:columns-3">
        {cases.map((project, i) => (
          <Reveal key={project.slug} delay={i * 40} className="mb-10 break-inside-avoid">
            <ProjectTile project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
