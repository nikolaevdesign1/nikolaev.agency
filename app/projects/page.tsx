import type { Metadata } from "next";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { ProjectList } from "@/components/project-list";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Projects",
  description: `Selected work from ${site.name}.`,
};

export default function ProjectsPage() {
  return (
    <>
      <section className="px-6 pb-12 pt-36 md:px-10 md:pb-16 md:pt-44">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          Projects — {String(projects.length).padStart(2, "0")}
        </p>
        <ScrambleText
          as="h1"
          trigger="mount"
          text="Selected work."
          className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        />
        <p className="mt-8 max-w-xl text-foreground/60">
          A mix of brand, product, and web work for founders and teams across
          hospitality, finance, health, and consumer goods.
        </p>
      </section>

      <section className="px-6 pb-20 md:px-10 md:pb-28">
        <ProjectList projects={projects} />
      </section>

      <CtaSection />
    </>
  );
}
