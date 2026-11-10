import { awardSourceOf, projectIsAwarded, type Project } from "@/lib/data/projects";
import { TagIcon } from "@/components/tag-icon";

/** White pills with an icon: category and services, sitting on the cover. */
export function ProjectTags({ project }: { project: Pick<Project, "category" | "services"> }) {
  const tags = Array.from(new Set([project.category, ...project.services]));
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[14px] leading-none text-[#141414]"
        >
          <TagIcon label={tag} />
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Black award badge. On hover of the parent `group` it drops down a little and shows the detail line. */
export function AwardBadge({ project }: { project: Pick<Project, "award" | "awardSource"> }) {
  if (!projectIsAwarded(project as Project)) return null;
  const source = awardSourceOf(project);
  return (
    <div className="pointer-events-none absolute left-4 top-0 z-10 -translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
      <div className="rounded-b-[8px] bg-[#0a0a0a] px-4 pb-3 pt-4 text-white">
        <p className="flex items-center gap-2 text-[15px] leading-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="9" r="5.5" />
            <path d="m8.8 13.6-1.3 6.9L12 18l4.5 2.5-1.3-6.9" />
          </svg>
          {source}
        </p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
          <p className="overflow-hidden whitespace-nowrap pt-0 text-[12px] leading-none text-white/60 group-hover:pt-2">
            {project.award}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Quiet "page" icon in the top right corner. */
export function SiteIcon() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9h17M7 6.8h.01M10 6.8h.01" />
      </svg>
    </span>
  );
}
