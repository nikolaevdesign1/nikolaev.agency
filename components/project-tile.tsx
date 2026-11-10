"use client";

import Link from "next/link";
import { countryFlag, type Project } from "@/lib/data/projects";
import { HoverPlate } from "@/components/hover-plate";
import { ProjectCover } from "@/components/project-cover";

export function ProjectTile({
  project,
  index,
  className,
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  const tags = Array.from(new Set([project.category, ...project.services]));

  return (
    <div className={`group relative block ${className ?? ""}`}>
      <Link href={`/projects/${project.slug}`} draggable={false} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
          <ProjectCover
            project={project}
            index={index}
            className="absolute inset-0 aspect-auto h-full w-full rounded-none border-0"
          />
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
            {project.award ? (
              <span className="rounded-[4px] bg-white px-2 py-1 font-mono text-[10px] leading-none text-[#141414]">
                {project.award}
              </span>
            ) : null}
            <span className="text-lg leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
              {countryFlag(project.location)}
            </span>
          </div>
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
          <p className="font-serif text-xl font-medium text-foreground">
            {project.title}
          </p>
          <p className="font-mono text-[10px] text-muted">{project.year}</p>
        </div>
      </Link>
      <HoverPlate project={project} />
    </div>
  );
}
