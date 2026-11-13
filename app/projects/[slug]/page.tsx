import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content/store";
import { ProjectModal } from "@/components/project-modal";
import { ProjectCase } from "@/components/project-case";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, pageMeta, shareImage } from "@/lib/seo";
import { site } from "@/lib/data/site";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project" };
  return pageMeta({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover,
  });
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <ProjectModal title={project.title} slug={project.slug}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.summary,
          url: absoluteUrl(`/projects/${project.slug}`),
          image: absoluteUrl(project.cover ?? shareImage.url),
          genre: project.category,
          keywords: project.services.join(", "),
          dateCreated: project.year,
          creator: { "@id": `${site.url}/#organization` },
        }}
      />
      <ProjectCase
        project={project}
        next={next.slug === project.slug ? undefined : next}
        index={index}
        total={projects.length}
      />
    </ProjectModal>
  );
}

export default function ProjectDetailPage({
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
