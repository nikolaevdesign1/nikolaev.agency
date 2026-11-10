"use client";

import Link from "next/link";
import { countryFlag, type Project } from "@/lib/data/projects";
import { HoverPlate } from "@/components/hover-plate";
import { ProjectCover } from "@/components/project-cover";
import { Tilt } from "@/components/tilt";

export function ProjectTile({
  project,
  index,
  number,
  className,
}: {
  project: Project;
  index: number;
  number: string;
  className?: string;
}) {
  const tags = Array.from(new Set([project.category, ...project.services]));

  return (
    <div className={`group relative block ${className ?? ""}`}>
      <Link href={`/projects/${project.slug}`} draggable={false} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
          <Tilt className="absolute inset-0">
            <ProjectCover
              project={project}
              index={index}
              className="aspect-auto h-full w-full rounded-none border-0"
            />
          </Tilt>
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
            {project.award ? (
              <span className="rounded-[4px] bg-white px-2 py-1 font-mono text-[10px] leading-none text-[#141414]">
                {project.award}
              </span>
            ) : null}
            <span className="rounded-[4px] bg-white px-2 py-1 text-sm leading-none">
              {countryFlag(project.location)}
            </span>
          </div>
          <HoverPlate project={project} />
          <div className="absolute inset-x-3 bottom-3 z-10 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[4px] bg-white px-2 py-1 font-mono text-[10px] leading-none text-[#141414]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="flex items-baseline gap-3 font-serif text-xl font-medium text-foreground">
            <span className="font-mono text-[10px] font-normal text-muted">{number}</span>
            {project.title}
          </p>
          <p className="font-mono text-[10px] text-muted">{project.year}</p>
        </div>
      </Link>
    </div>
  );
}
