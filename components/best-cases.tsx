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
      <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 md:grid-cols-3">
        {cases.map((project, i) => (
          <Reveal key={project.slug} delay={i * 40}>
            <Link href={`/projects/${project.slug}`} className="group block h-full bg-background">
              <CursorFollowCta label="View case study" className="block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                    <ProjectCover project={project} index={i} className="h-full rounded-none border-0" />
                  </div>
                </div>
              </CursorFollowCta>
              <div className="px-5 py-4">
                <p className="font-serif text-xl font-medium tracking-tight text-foreground">
                  {project.title}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {project.category} · {project.location}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
