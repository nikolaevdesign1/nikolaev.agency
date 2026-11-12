import { awardSources, awardsOf, type Project } from "@/lib/data/projects";
import { siAwwwards, siBehance, siCssdesignawards } from "simple-icons";
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

/** Black vertical tab hanging from the top edge by a punched hole; the source name reads bottom-to-top. Drops a little on hover. */
type Awarded = Pick<Project, "awards" | "award" | "awardSource">;

/** The first award's source, named the way the badge shows it. */
function firstAward(project: Awarded) {
  const award = awardsOf(project)[0];
  if (!award) return null;
  const known = awardSources.find((name) => name.toLowerCase() === award.source.trim().toLowerCase());
  return { source: known ?? (award.source.trim() || "Award"), title: award.title };
}

export function AwardBadge({ project }: { project: Awarded }) {
  const award = firstAward(project);
  if (!award) return null;
  const source = award.source;
  const hole = "radial-gradient(circle at 50% 13px, transparent 4px, #000 4.6px)";
  return (
    <div
      title={award.title}
      className="pointer-events-none absolute left-4 top-0 z-10 -translate-y-1.5 drop-shadow-[0_6px_10px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
    >
      <span
        className="block rounded-b-[6px] bg-[#0a0a0a] px-2.5 pb-3.5 pt-8 text-[14px] leading-none text-white"
        style={{ maskImage: hole, WebkitMaskImage: hole }}
      >
        <span className="block rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">{source}</span>
      </span>
    </div>
  );
}

const awardIcons: Record<string, { path: string; hex: string }> = {
  Behance: siBehance,
  Awwwards: siAwwwards,
  "CSS Design Awards": siCssdesignawards,
};

/** Round brand-coloured logo of the award source, for the Field view. */
export function AwardIcon({ project }: { project: Awarded }) {
  const award = firstAward(project);
  if (!award) return null;
  const source = award.source;
  const icon = awardIcons[source];
  return (
    <span
      title={award.title || source}
      className="pointer-events-none absolute left-4 top-4 z-10 grid size-11 place-items-center rounded-full text-white shadow-[0_4px_14px_rgba(0,0,0,0.22)] ring-1 ring-white/20 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      style={{ backgroundColor: icon ? `#${icon.hex}` : "#0a0a0a" }}
    >
      {icon ? (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-label={source} role="img">
          <path d={icon.path} fill="currentColor" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-label={source} role="img">
          <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
        </svg>
      )}
    </span>
  );
}
