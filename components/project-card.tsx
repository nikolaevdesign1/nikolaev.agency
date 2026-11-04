import Link from "next/link";
import type { Project } from "@/lib/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/projects#${project.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-foreground/10 py-8 transition-colors md:grid-cols-[4rem_1fr_12rem_6rem] md:gap-10"
    >
      <span className="font-mono text-xs text-foreground/30">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="overflow-hidden">
        <h3 className="text-2xl font-medium tracking-tight text-foreground transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-foreground/50 md:hidden">
          {project.category} — {project.year}
        </p>
      </div>

      <div className="hidden font-mono text-xs uppercase tracking-wider text-foreground/50 md:block">
        {project.services.join(" / ")}
      </div>

      <div className="hidden text-right font-mono text-xs uppercase tracking-wider text-foreground/50 md:block">
        {project.year}
      </div>
    </Link>
  );
}
