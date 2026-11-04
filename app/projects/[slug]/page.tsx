import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data/projects";
import { ScrambleText } from "@/components/scramble-text";

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

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-36 md:px-10">
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
    </section>
  );
}
