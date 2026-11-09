import { HeroVideo } from "@/components/hero-video";
import { ServicesGrid } from "@/components/services-grid";
import { SectionTransition } from "@/components/section-transition";
import { BitEdge } from "@/components/bit-edge";
import { AmbientTextField, StudioChatButton } from "@/components/ambient-text-field";
import { ScrambleText } from "@/components/scramble-text";
import { ExpandableVideo } from "@/components/expandable-video";
import { BestCases } from "@/components/best-cases";
import { LinkButton, pillClass } from "@/components/button";

const aiPoints = [
  {
    index: "001",
    title: "Faster, by default",
    body: "AI shortens the distance between a brief and a shipped build — drafts, variations, and first passes happen in hours, not days, without skipping the craft.",
  },
  {
    index: "002",
    title: "Support that doesn't wait on a ticket",
    body: "Most questions get answered the moment they're asked, by a studio-trained assistant that knows the project. A person picks up anything it can't.",
  },
  {
    index: "003",
    title: "Reachable from anywhere",
    body: "Async reviews, written handoffs, and tooling built for distributed teams — the work stays easy to pick up across time zones, not just across a desk.",
  },
];

export default function Home() {
  return (
    <>
      <HeroVideo src="/video/hero.mp4" />

      <SectionTransition />
      <ServicesGrid />

      <BestCases />

      <BitEdge
        from="#fcfbf9"
        to="#0a0a0a"
        seed={11}
        phrase="Best cases · brand · product · a production-ready build · direct access"
      />
      <section className="relative flex flex-col overflow-hidden bg-ink gutter py-36 text-ink-foreground md:py-48">
        <AmbientTextField phrase="Small team · direct access · no account managers" />
        <div className="relative z-[1] flex flex-col gap-24 md:gap-32">
          <div className="flex max-w-5xl flex-col gap-10 md:gap-14">
            <ScrambleText
              as="p"
              text="We build AI into the work itself."
              className="font-serif text-4xl font-medium leading-[1.05] md:text-6xl lg:text-7xl"
            />
            <ScrambleText
              as="p"
              text="Faster builds, lighter support, reachable from anywhere."
              className="font-serif text-4xl font-medium leading-[1.05] md:text-6xl lg:text-7xl"
            />
          </div>

          <div className="grid gap-12 border-t border-ink-border pt-12 md:grid-cols-3 md:gap-10">
            {aiPoints.map((point) => (
              <div key={point.index} className="flex flex-col gap-3">
                <p className="font-mono text-[11px] text-ink-muted">
                  {point.index} / {point.title}
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-ink-foreground/80 md:text-base">
                  {point.body}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            <p className="max-w-sm text-sm leading-relaxed text-ink-foreground/70 md:text-base">
              by Oleg Nikolaev. Designed &amp; built in Los Angeles.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <StudioChatButton className={pillClass}>Let&apos;s chat</StudioChatButton>
              <LinkButton href="/contact">Request a project</LinkButton>
            </div>
          </div>

          <ExpandableVideo src="/video/hero.mp4" className="mx-auto w-[min(20vw,320px)]" />
        </div>
      </section>

      <BitEdge phrase="Small team · direct access · no account managers · the work continues past the edge" />
    </>
  );
}
