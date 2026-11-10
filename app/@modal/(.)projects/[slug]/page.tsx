import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content/store";
import { ProjectModal } from "@/components/project-modal";
import { ProjectCase } from "@/components/project-case";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <ProjectModal title={project.title} slug={project.slug} intercepted>
      <ProjectCase project={project} next={next.slug === project.slug ? undefined : next} />
    </ProjectModal>
  );
}

export default function InterceptedProject({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}
