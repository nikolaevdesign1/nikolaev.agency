import type { Project } from "@/lib/data/projects";
import { AccentMark } from "@/components/accent-mark";
import { cn } from "@/lib/utils";

type ProjectCoverProps = {
  project: Project;
  index: number;
  className?: string;
};

export function ProjectCover({ project, index, className }: ProjectCoverProps) {
  const dark = index % 2 === 0;
  const showAccent = index % 4 === 3;

  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border-2",
        dark
          ? "border-ink-border bg-ink text-ink-foreground"
          : "border-border bg-surface/60 text-foreground",
        className,
      )}
    >
      <span className="font-sans text-8xl font-medium tracking-tight opacity-20">
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
