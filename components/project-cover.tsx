import type { Project } from "@/lib/data/projects";
import { AccentMark } from "@/components/accent-mark";
import { cn } from "@/lib/utils";

type ProjectCoverProps = {
  project: Project;
  index: number;
  className?: string;
};

export function ProjectCover({ project, index, className }: ProjectCoverProps) {
  if (project.video || project.cover) {
    return (
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-none bg-surface", className)}>
        {project.video ? (
          <video
            src={project.video}
            poster={project.cover}
            autoPlay
            muted
            loop
            playsInline
            draggable={false}
            className="pointer-events-none h-full w-full select-none object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt={project.title}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="pointer-events-none h-full w-full select-none object-cover"
          />
        )}
      </div>
    );
  }

  const dark = index % 2 === 0;
  const showAccent = index % 4 === 3;

  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-none",
        dark
          ? "border-ink-border bg-ink text-ink-foreground"
          : "border-border bg-surface/60 text-foreground",
        className,
      )}
    >
      <span className="font-sans text-8xl font-medium opacity-20">
        {project.title.charAt(0)}
      </span>
      {showAccent && (
        <div className="absolute bottom-4 right-4">
          <AccentMark size={20} />
        </div>
      )}
    </div>
  );
}
