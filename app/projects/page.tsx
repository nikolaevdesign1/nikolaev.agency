import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { pageMeta } from "@/lib/seo";
import { getProjects } from "@/lib/content/store";
import { ProjectsView } from "@/components/projects-view";

export const metadata: Metadata = pageMeta({
  title: "Projects",
  description: `Selected work from ${site.name}.`,
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsView projects={projects} />;
}
