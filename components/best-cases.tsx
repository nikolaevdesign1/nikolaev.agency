"use client";

import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { Reveal } from "@/components/reveal";
import { CursorFollowCta } from "@/components/cursor-follow-cta";
import { ProjectCover } from "@/components/project-cover";

export function BestCases() {
  const cases = projects.slice(0, 9);

  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Selected work
      </p>
      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 md:grid-cols-3 md:gap-x-12 md:gap-y-16">
        {cases.map((project, i) => (
          <Reveal key={project.slug} delay={i * 40}>
            <CursorFollowCta label="View case study" className="group block">
              <Link href={`/projects/${project.slug}`}>
                <p className="font-serif text-xl font-medium tracking-tight text-foreground">
                  {project.title}
                </p>
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
