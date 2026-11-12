"use client";

import type { Project } from "@/lib/data/projects";
import { Reveal } from "@/components/reveal";
import Link from "next/link";
import { ProjectTile } from "@/components/project-tile";

export function BestCases({ projects }: { projects: Project[] }) {
  const cases = projects.filter((project) => project.featured).slice(0, 6);

  return (
    <section className="gutter py-24 md:py-32">
      <h2 className="mx-auto max-w-3xl text-center font-serif text-4xl font-medium leading-[1.05] text-foreground md:text-6xl">
        Selected work
      </h2>
      <div className="mt-14 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2">
        {cases.map((project, i) => (
          <div key={project.slug}>
            <Reveal delay={i * 40}>
              <ProjectTile
                project={project}
                index={i}
              />
            </Reveal>
          </div>
        ))}
      </div>
      <div className="mt-14 flex justify-center md:mt-16">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-3 rounded-[6px] bg-foreground px-6 py-3.5 font-mono text-[13px] text-background transition-opacity duration-300 hover:opacity-85"
        >
          All projects ({projects.length})
          <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
