import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { ProjectList } from "@/components/project-list";
import { HeroVideo } from "@/components/hero-video";
import { ServicesGrid } from "@/components/services-grid";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <>
      <HeroVideo />

      <ServicesGrid />

      <section className="px-6 py-20 md:px-10 md:py-28" id="work">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
              Last Works / {String(projects.length).padStart(2, "0")}
            </h2>
            <span className="hidden font-mono text-xs uppercase tracking-wider text-muted/60 md:block">
              2023 — 2025
            </span>
          </div>
        </Reveal>

        <ProjectList projects={projects} />

        <Reveal className="mt-10 flex justify-end">
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-wider text-muted underline underline-offset-4 transition-colors hover:text-foreground"
          >
            View all work
          </Link>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 gap-12 border-y-2 border-ink-border bg-ink px-6 py-24 text-ink-foreground md:grid-cols-2 md:px-10 md:py-32">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            About the studio
          </p>
          <ScrambleText
            as="h2"
            text="Small team. Direct access. No account managers."
            className="mt-6 max-w-lg text-3xl font-medium leading-[1.1] tracking-tight md:text-5xl"
          />
        </Reveal>
        <Reveal delay={150} className="flex flex-col justify-between gap-8">
          <p className="max-w-md text-ink-foreground/60">
            {site.name} is a small studio based in Los Angeles. We partner
            with founders and teams who care about craft, working end-to-end
            from brand to a production-ready build.
          </p>
          <Link
            href="/about"
            className="inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-foreground/70 underline underline-offset-4 transition-colors hover:text-accent"
          >
            More about us
          </Link>
        </Reveal>
      </section>

      <CtaSection />
    </>
  );
}
