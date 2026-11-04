import type { Project } from "@/lib/data/projects";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="border-t-2 border-border">
      {projects.map((project, index) => (
        <Reveal key={project.slug} delay={index * 60}>
          <ProjectCard project={project} index={index} />
        </Reveal>
      ))}
    </div>
  );
}
