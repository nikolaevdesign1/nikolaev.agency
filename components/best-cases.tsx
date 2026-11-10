"use client";

import type { Project } from "@/lib/data/projects";
import { Reveal } from "@/components/reveal";
import { ProjectTile } from "@/components/project-tile";

export function BestCases({ projects }: { projects: Project[] }) {
  const cases = projects.filter((project) => project.featured).slice(0, 6);

  return (
    <section className="gutter py-24 md:py-32">
      <p className="font-mono text-[11px] text-muted">
        Selected work
      </p>
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((project, i) => (
          <div key={project.slug} data-scroll data-scroll-speed={[0.04, 0.09, 0.02][i % 3]}>
            <Reveal delay={i * 40}>
              <ProjectTile
                project={project}
                index={i}
                number={String(projects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, "0")}
              />
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
