import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { NumberRoll } from "@/components/number-roll";
import { Reveal } from "@/components/reveal";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, a design studio based in ${site.location}.`,
};

const stats = [
  { value: "04", label: "Years in operation" },
  { value: "30", label: "Projects shipped" },
  { value: "12", label: "Active clients" },
  { value: "100", label: "Percent remote-friendly" },
];

const process = [
  {
    index: "01",
    title: "Discover",
    copy: "We start with the business problem, not the pixels — audience, offer, and what success looks like in 90 days.",
  },
  {
    index: "02",
    title: "Design",
    copy: "Brand and interface decisions get made together, in the same files, so nothing gets lost in translation.",
  },
  {
    index: "03",
    title: "Build",
    copy: "We ship production code ourselves — fast, accessible, and built to be handed off or maintained by us.",
  },
  {
    index: "04",
    title: "Iterate",
    copy: "Launch is the start of the data. We keep refining based on what real users actually do.",
  },
];

const principles = [
  "Direct access to the people doing the work",
  "No templates, no theme-store shortcuts",
  "Design decisions backed by a reason",
  "Built to perform, not just to look good in a deck",
];

export default function AboutPage() {
  return (
    <>
      <section className="px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          About
        </p>
        <ScrambleText
          as="h1"
          trigger="mount"
          text="A studio built for founders who care about craft."
          className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        />
        <p className="mt-8 max-w-xl text-foreground/60">
          {site.legalName} is based in {site.location}, working with
          early-stage and growth companies who need a brand and product
          presence that can actually ship.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-8 border-t border-foreground/10 px-6 py-16 md:grid-cols-4 md:px-10 md:py-20">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <NumberRoll
              value={stat.value}
              className="block font-mono text-4xl text-foreground md:text-6xl"
            />
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-foreground/50">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </section>

      <section className="border-t border-foreground/10 px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <h2 className="font-mono text-xs uppercase tracking-wider text-accent">
            How we work
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          {process.map((step, i) => (
            <Reveal key={step.index} delay={i * 100}>
              <span className="font-mono text-xs text-foreground/30">
                {step.index}
              </span>
              <h3 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-md text-foreground/60">{step.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-foreground/10 px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <h2 className="font-mono text-xs uppercase tracking-wider text-accent">
            What we believe
          </h2>
        </Reveal>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {principles.map((principle, i) => (
            <Reveal key={principle} as="li" delay={i * 80}>
              <p className="py-6 text-xl font-medium tracking-tight text-foreground md:text-2xl">
                {principle}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      <CtaSection />
    </>
  );
}
