import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { ProjectsView } from "@/components/projects-view";

export const metadata: Metadata = {
  title: "Projects",
  description: `Selected work from ${site.name}.`,
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
