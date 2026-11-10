"use client";

import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import { AwardBadge, ProjectTags, SiteIcon } from "@/components/project-card-parts";
import { HoverPlate } from "@/components/hover-plate";
import { ProjectCover } from "@/components/project-cover";
import { RippleCover } from "@/components/ripple-cover";

export function ProjectTile({
  project,
  index,
  className,
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  return (
    <div className={`group relative block ${className ?? ""}`}>
      <Link href={`/projects/${project.slug}`} draggable={false} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
          <RippleCover src={project.video ? undefined : project.cover} className="absolute inset-0">
            <ProjectCover
              project={project}
              index={index}
              className="absolute inset-0 aspect-auto h-full w-full rounded-none border-0"
            />
          </RippleCover>
          <AwardBadge project={project} />
          <SiteIcon />
          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10">
            <ProjectTags project={project} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
            {project.title}
          </p>
          <p className="font-mono text-[14px] text-muted">{project.year}</p>
        </div>
      </Link>
      <HoverPlate project={project} />
    </div>
  );
}
