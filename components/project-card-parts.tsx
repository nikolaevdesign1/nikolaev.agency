import { awardSourceOf, projectIsAwarded, type Project } from "@/lib/data/projects";
import { TagIcon } from "@/components/tag-icon";

/** White pills with an icon: category and services, sitting on the cover. */
export function ProjectTags({
  project,
  stagger = false,
}: {
  project: Pick<Project, "category" | "services">;
  /** Each pill fades in after the previous one once the parent gets [data-shown]. */
  stagger?: boolean;
}) {
  const tags = Array.from(new Set([project.category, ...project.services]));
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span
          key={tag}
          style={stagger ? { ["--d" as string]: `${120 + i * 70}ms` } : undefined}
          className={`${stagger ? "reveal-fade " : ""}inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[14px] leading-none text-[#141414] shadow-[0_2px_12px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.06]`}
        >
          <TagIcon label={tag} />
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Black vertical tab hanging from the top edge, the source name reads bottom-to-top. Drops a little on hover. */
export function AwardBadge({ project }: { project: Pick<Project, "award" | "awardSource"> }) {
  if (!projectIsAwarded(project as Project)) return null;
  const source = awardSourceOf(project);
  return (
    <div
      title={project.award}
      className="pointer-events-none absolute left-4 top-0 z-10 -translate-y-1.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
    >
      <span className="block rounded-b-[6px] bg-[#0a0a0a] px-2.5 pb-3.5 pt-5 text-[14px] leading-none text-white shadow-[0_6px_16px_rgba(0,0,0,0.22)]">
        <span className="block rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">{source}</span>
      </span>
    </div>
  );
}

/** Quiet "page" icon in the top right corner. */
export function SiteIcon() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-black/45 text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] ring-1 ring-white/25 backdrop-blur-md"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9h17M7 6.8h.01M10 6.8h.01" />
      </svg>
    </span>
  );
}
