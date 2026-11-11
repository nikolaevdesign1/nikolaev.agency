import Link from "next/link";
import { siAwwwards, siBehance, siCssdesignawards, siDribbble, siGithub, siYoutube } from "simple-icons";
import {
  linksOf,
  type BlockPlace,
  type Media,
  type Project,
  type ProjectBlock,
  type ProjectLink,
} from "@/lib/data/projects";
import { MediaView } from "@/components/media-view";
import { AmbientTextField } from "@/components/ambient-text-field";

function coverOf(project: Project): Media | null {
  if (project.video) return { type: "video", src: project.video, poster: project.cover };
  if (project.cover) return { type: "image", src: project.cover, alt: project.title };
  return null;
}

const ROUND = "rounded-[8px]";

/** Pictures between the text sections: one wide, two in a row, one plus two, or two by two. */
function Block({ block }: { block: ProjectBlock }) {
  if (block.type === "media") {
    return (
      <figure className="mt-10 md:mt-16">
        <MediaView media={block.media} className={ROUND} />
        {block.caption ? <figcaption className="mt-3 font-mono text-[12px] text-muted">{block.caption}</figcaption> : null}
      </figure>
    );
  }
  if (block.type === "media2") {
    return (
      <div className="mt-10 grid items-start gap-3 md:mt-16 md:grid-cols-2 md:gap-4">
        {block.items.map((item, i) => (
          <MediaView key={i} media={item} className={ROUND} />
        ))}
      </div>
    );
  }
  if (block.type === "media3") {
    const [wide, ...pair] = block.items;
    return (
      <div className="mt-10 flex flex-col gap-3 md:mt-16 md:gap-4">
        <MediaView media={wide} className={ROUND} />
        <div className="grid items-start gap-3 md:grid-cols-2 md:gap-4">
          {pair.map((item, i) => (
            <MediaView key={i} media={item} className={ROUND} />
          ))}
        </div>
      </div>
    );
  }
  if (block.type === "media4") {
    return (
      <div className="mt-10 grid items-start gap-3 md:mt-16 md:grid-cols-2 md:gap-4">
        {block.items.map((item, i) => (
          <MediaView key={i} media={item} className={ROUND} />
        ))}
      </div>
    );
  }
  if (block.type === "text") return <TextSection label={block.label} text={block.text} />;
  return (
    <section className="mt-20 grid gap-6 md:mt-28 md:grid-cols-12 md:gap-x-6">
      <p className="font-mono text-[12px] text-muted md:col-span-4">Credits</p>
      <dl className="border-t border-foreground/70 md:col-span-8">
        {block.rows.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 border-b border-foreground/20 py-3 text-sm text-foreground">
            <dt className="text-muted">{row.role}</dt>
            <dd>{row.name}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Label on the left, the text on the right. */
function TextSection({ label, text, large = false }: { label: string; text: string; large?: boolean }) {
  return (
    <section className="mt-20 grid gap-5 md:mt-28 md:grid-cols-12 md:gap-x-6">
      <h2 className="font-mono text-[12px] font-normal text-muted md:col-span-4">{label}</h2>
      <p
        className={`whitespace-pre-line text-foreground md:col-span-8 ${
          large ? "font-serif text-3xl leading-[1.12] md:text-5xl" : "max-w-3xl text-lg leading-relaxed md:text-xl"
        }`}
      >
        {text}
      </p>
    </section>
  );
}

const linkIcons: { test: RegExp; icon: { path: string } }[] = [
  { test: /behance\./i, icon: siBehance },
  { test: /awwwards\./i, icon: siAwwwards },
  { test: /cssdesignawards\./i, icon: siCssdesignawards },
  { test: /dribbble\./i, icon: siDribbble },
  { test: /github\./i, icon: siGithub },
  { test: /youtube\.|youtu\.be/i, icon: siYoutube },
];

function LinkIcon({ url }: { url: string }) {
  const hit = linkIcons.find((entry) => entry.test.test(url));
  if (hit) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path d={hit.icon.path} fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5S14.5 17.9 12 20.5C9.5 17.9 8.4 15.1 8.4 12S9.5 6.1 12 3.5z" />
    </svg>
  );
}

function Links({ links }: { links: ProjectLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="mt-6 flex flex-wrap justify-center gap-2">
      {links.map((link) => (
        <li key={`${link.label}${link.url}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] px-4 py-2 font-mono text-[12px] text-foreground ring-1 ring-border transition-colors duration-300 hover:bg-foreground hover:text-background"
          >
            <LinkIcon url={link.url} />
            {link.label}
            <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Drafting marks behind the page: dots and notes in light, the letter field in dark. */
function Decor({ project, index, total }: { project: Project; index?: number; total?: number }) {
  const number = index !== undefined && total ? `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}` : null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="decor-light bg-dot-grid absolute inset-0 font-mono text-[10px] text-foreground/30">
        <span className="absolute left-[var(--gutter)] top-8 text-sm leading-none">+</span>
        <span className="absolute right-[var(--gutter)] top-8 text-sm leading-none">+</span>
        <span className="absolute left-[calc(var(--gutter)+1.5rem)] top-[2.05rem]">+ Case study</span>
        <span className="absolute right-[calc(var(--gutter)+1.5rem)] top-[2.05rem]">
          {[number, project.year, project.place?.city ?? project.location].filter(Boolean).join("   ·   ")}
        </span>
      </div>
      <div className="decor-dark absolute inset-0">
        <AmbientTextField phrase={`${project.title} · case study · nikolaev.agency`} />
      </div>
    </div>
  );
}

export function ProjectCase({
  project,
  next,
  index,
  total,
}: {
  project: Project;
  next?: Project;
  index?: number;
  total?: number;
}) {
  const cover = coverOf(project);
  const blocks = project.blocks ?? [];
  const at = (place: BlockPlace) => blocks.filter((block) => (block.place ?? "content") === place);
  const details = [
    project.category,
    ...project.services.filter((service) => service !== project.category),
    project.year,
    project.client !== project.title ? project.client : null,
    project.place?.city ?? project.location,
  ].filter(Boolean);
  const hasCredits = blocks.some((block) => block.type === "credits");

  return (
    <article className="relative isolate pb-24 md:pb-32">
      <Decor project={project} index={index} total={total} />

      <div className="relative gutter">
        <header data-case-title="" className="mx-auto flex max-w-5xl flex-col items-center pt-16 text-center md:pt-24">
          <h1 className="font-serif text-6xl font-normal leading-[0.95] text-foreground md:text-8xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-snug text-muted md:text-xl">{project.summary}</p>
          <p className="mt-6 font-mono text-[12px] text-foreground/80">{details.join("  ·  ")}</p>
          <Links links={linksOf(project)} />
        </header>

        {cover ? (
          <figure className="mt-12 md:mt-16">
            <MediaView media={cover} className="rounded-[10px]" />
            {project.coverCaption ? (
              <figcaption className="mt-3 font-mono text-[12px] text-muted">{project.coverCaption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        {project.statement ? <TextSection label="In short" text={project.statement} large /> : null}
        <TextSection label="About" text={project.about?.trim() || project.summary} />
        {at("about").map((block, i) => (
          <Block key={`a${i}`} block={block} />
        ))}

        {project.problem?.trim() ? <TextSection label="Problem" text={project.problem} /> : null}
        {at("content").map((block, i) => (
          <Block key={`c${i}`} block={block} />
        ))}

        {project.results?.trim() || project.award ? (
          <TextSection
            label="Results"
            text={[project.results?.trim(), project.award ? `Recognition: ${project.award}.` : null].filter(Boolean).join("\n\n")}
          />
        ) : null}
        {at("results").map((block, i) => (
          <Block key={`r${i}`} block={block} />
        ))}

        {!hasCredits && project.credits && project.credits.length > 0 ? (
          <section className="mt-20 grid gap-6 md:mt-28 md:grid-cols-12 md:gap-x-6">
            <p className="font-mono text-[12px] text-muted md:col-span-4">Credits</p>
            <p className="text-sm text-foreground md:col-span-8">{project.credits.join(", ")}</p>
          </section>
        ) : null}

        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            replace
            className="group mt-24 grid gap-4 border-t border-foreground/70 pt-3 md:mt-32 md:grid-cols-12 md:gap-x-6"
          >
            <p className="font-mono text-[12px] text-muted md:col-span-4">Next project</p>
            <p className="font-serif text-4xl leading-none text-foreground transition-transform duration-300 group-hover:translate-x-2 md:col-span-8 md:text-6xl">
              {next.title}
            </p>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
