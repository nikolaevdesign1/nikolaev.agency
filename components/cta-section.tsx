import Link from "next/link";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { Reveal } from "@/components/reveal";
import { LinkButton } from "@/components/button";

export function CtaSection() {
  return (
    <section className="border-t-2 border-border px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          Start a project
        </p>
        <ScrambleText
          as="h2"
          text="Have something in mind? Let's talk."
          className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl"
        />
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <LinkButton href="/contact">Start a project</LinkButton>
          <Link
            href={`mailto:${site.email}`}
            className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
          >
            {site.email}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
