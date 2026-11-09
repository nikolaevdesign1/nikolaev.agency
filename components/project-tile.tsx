"use client";

import Link from "next/link";
import { countryFlag, type Project } from "@/lib/data/projects";
import { CursorFollowCta } from "@/components/cursor-follow-cta";
import { ProjectCover } from "@/components/project-cover";

const RATIO = {
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
} as const;

export function ProjectTile({
  project,
  index,
  className,
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  const tags = [project.category, ...project.services];

  return (
    <CursorFollowCta label="View case" className={`group block ${className ?? ""}`}>
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          className={`relative overflow-hidden rounded-[6px] border border-border ${RATIO[project.format ?? "4:3"]}`}
        >
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <ProjectCover
              project={project}
              index={index}
              className="h-full rounded-none border-0"
            />
          </div>
          <span className="absolute right-3 top-3 rounded-[4px] bg-white px-2 py-1 text-sm leading-none">
            {countryFlag(project.location)}
          </span>
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
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
          <p className="font-serif text-xl font-medium text-foreground">{project.title}</p>
          <p className="font-mono text-[10px] text-muted">{project.year}</p>
        </div>
      </Link>
    </CursorFollowCta>
  );
}
