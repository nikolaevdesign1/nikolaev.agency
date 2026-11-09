import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { ProjectCover } from "@/components/project-cover";
import { CreditsOverlay } from "@/components/credits-overlay";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const credits = [
    { role: "Design by", name: site.name, top: "10%", left: "6%" },
    { role: "Art Direction", name: site.name, top: "18%", left: "78%" },
    { role: "Development", name: site.name, top: "72%", left: "8%" },
    { role: "Client", name: project.client, top: "80%", left: "70%" },
  ];

  return (
    <section className="px-6 pb-24 pt-36 md:px-10 md:pt-44">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">
        {project.category} — {project.year}
      </p>
      <ScrambleText
        as="h1"
        trigger="mount"
        text={project.title}
        className="mt-6 max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl"
      />
      <p className="mt-8 max-w-lg text-muted">
        Full case study coming soon. In the meantime: {project.summary}
      </p>
      <Link
        href="/projects"
        className="mt-12 inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted underline underline-offset-4 transition-colors hover:text-foreground"
      >
        Back to projects
      </Link>

      <div className="relative mt-16 overflow-hidden rounded-2xl">
        <ProjectCover project={project} index={index} className="aspect-[16/9]" />
        <CreditsOverlay credits={credits} />
      </div>
    </section>
  );
}
