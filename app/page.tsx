import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { ProjectList } from "@/components/project-list";
import { Marquee } from "@/components/marquee";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";

const services = [
  "Brand Identity",
  "Web Design",
  "Front-end Development",
  "Motion",
  "Design Systems",
  "Art Direction",
];

export default function Home() {
  return (
    <>
      <section className="flex min-h-screen flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          {site.location} — Est. {site.founded}
        </p>

        <ScrambleText
          as="h1"
          trigger="mount"
          text="We design and build digital presence for ambitious brands."
          className="mt-6 max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        />

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-md text-balance text-foreground/60">
            A Los Angeles design studio working at the intersection of brand,
            product, and motion — from first sketch to shipped site.
          </p>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-wider text-foreground/70 underline underline-offset-4 transition-colors hover:text-accent"
          >
            View all work
          </Link>
        </div>
      </section>

      <Marquee items={services} />

      <section className="px-6 py-20 md:px-10 md:py-28" id="work">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-foreground/50">
              Selected Work / {String(projects.length).padStart(2, "0")}
            </h2>
            <span className="hidden font-mono text-xs uppercase tracking-wider text-foreground/30 md:block">
              2023 — 2025
            </span>
          </div>
        </Reveal>

        <ProjectList projects={projects} />
      </section>

      <section className="grid grid-cols-1 gap-12 border-t border-foreground/10 px-6 py-24 md:grid-cols-2 md:px-10 md:py-32">
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
          <p className="max-w-md text-foreground/60">
            {site.name} is a small studio based in Los Angeles. We partner
            with founders and teams who care about craft, working end-to-end
            from brand to a production-ready build.
          </p>
          <Link
            href="/about"
            className="inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-wider text-foreground/70 underline underline-offset-4 transition-colors hover:text-accent"
          >
            More about us
          </Link>
        </Reveal>
      </section>

      <CtaSection />
    </>
  );
}
