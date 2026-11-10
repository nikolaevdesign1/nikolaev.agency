import Link from "next/link";
import type { Media, Project, ProjectBlock } from "@/lib/data/projects";
import { MediaView } from "@/components/media-view";

function coverOf(project: Project): Media | null {
  if (project.video) return { type: "video", src: project.video, poster: project.cover };
  if (project.cover) return { type: "image", src: project.cover, alt: project.title };
  return null;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[12px] text-muted">{children}</p>;
}

function Block({ block }: { block: ProjectBlock }) {
  if (block.type === "media") {
    return (
      <figure className="mt-20 md:mt-28">
        <MediaView media={block.media} className="rounded-[6px]" />
        {block.caption ? (
          <figcaption className="mt-3 font-mono text-[12px] text-muted">{block.caption}</figcaption>
        ) : null}
      </figure>
    );
  }
  if (block.type === "media2") {
    return (
      <div className="mt-20 grid items-start gap-4 md:mt-28 md:grid-cols-2 md:gap-6">
        {block.items.map((item, i) => (
          <MediaView key={i} media={item} className="rounded-[6px]" />
        ))}
      </div>
    );
  }
  if (block.type === "text") {
    return (
      <section className="mt-20 grid gap-6 md:mt-28 md:grid-cols-2">
        <Label>{block.label}</Label>
        <p className="max-w-xl whitespace-pre-line text-lg leading-relaxed text-foreground md:text-xl">
          {block.text}
        </p>
      </section>
    );
  }
  return (
    <section className="mt-20 grid gap-6 md:mt-28 md:grid-cols-2">
      <Label>Credits</Label>
      <dl className="border-t border-foreground/80">
        {block.rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-4 border-b border-foreground/80 py-2 text-sm text-foreground"
          >
            <dt>{row.role}</dt>
            <dd>{row.name}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProjectCase({ project, next }: { project: Project; next?: Project }) {
  const cover = coverOf(project);
  const tags = Array.from(new Set(project.services));
  const blocks: ProjectBlock[] =
    project.blocks && project.blocks.length > 0
      ? project.blocks
      : [{ type: "text", label: "About", text: project.summary }];
  const host = project.url?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <article className="gutter pb-24 pt-8 md:pb-32 md:pt-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div />
        <div className="grid grid-cols-2 gap-6 font-mono text-[12px] text-muted">
          <p>Case Study</p>
          <p className="text-foreground">
            {tags.map((tag) => (
              <span key={tag} className="block">
                {tag}
              </span>
            ))}
          </p>
        </div>
      </div>

      <h1 className="mt-14 max-w-5xl font-serif text-6xl font-normal leading-[0.95] text-foreground md:mt-20 md:text-8xl">
        {project.title}
      </h1>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-6 self-end font-mono text-[12px] text-foreground">
          <p>©{project.year}</p>
          <p>
            <span className="block">{project.category}</span>
            <span className="block">{project.location}</span>
          </p>
        </div>
        {cover ? (
          <div>
            <MediaView media={cover} className="rounded-[6px]" />
            {project.coverCaption ? (
              <div className="mt-3 flex items-start justify-between gap-6 font-mono text-[12px] text-foreground">
                <p className="max-w-xs">{project.coverCaption}</p>
                <span aria-hidden="true">↓</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {project.url || project.statement ? (
        <div className="mt-20 md:mt-28">
          {project.url ? (
            <div className="grid gap-2 md:grid-cols-2">
              <Label>Website(s)</Label>
              <Label>{host}</Label>
            </div>
          ) : null}
          <p className="mt-4 font-serif text-4xl leading-[1.05] text-foreground md:text-6xl">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-1 underline-offset-[0.12em] transition-colors hover:text-accent"
              >
                {host}
              </a>
            ) : null}
            {project.url && project.statement ? " " : null}
            {project.statement}
          </p>
        </div>
      ) : null}

      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}

      {project.behance ? (
        <div className="mt-20 grid gap-6 md:mt-28 md:grid-cols-2">
          <Label>Behance</Label>
          <a
            href={project.behance}
            target="_blank"
            rel="noreferrer"
            className="w-fit font-serif text-3xl underline underline-offset-4 transition-colors hover:text-accent"
          >
            View the case on Behance
          </a>
        </div>
      ) : null}

      {next ? (
        <Link
          href={`/projects/${next.slug}`}
          replace
          className="group mt-24 grid gap-4 border-t border-foreground/80 pt-3 md:mt-32 md:grid-cols-2"
        >
          <Label>Next Project</Label>
          <p className="font-serif text-4xl leading-none text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-6xl">
            {next.title}
          </p>
        </Link>
      ) : null}
    </article>
  );
}
