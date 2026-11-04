import Link from "next/link";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { Reveal } from "@/components/reveal";

export function CtaSection() {
  return (
    <section className="border-t border-foreground/10 px-6 py-24 md:px-10 md:py-32">
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
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Start a project
          </Link>
          <Link
            href={`mailto:${site.email}`}
            className="font-mono text-xs uppercase tracking-wider text-foreground/50 transition-colors hover:text-foreground"
          >
            {site.email}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
