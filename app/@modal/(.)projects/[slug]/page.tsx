import { Suspense } from "react";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data/projects";
import { ProjectModal } from "@/components/project-modal";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const index = projects.findIndex((p) => p.slug === slug);

  return <ProjectModal project={project} index={index} intercepted />;
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
