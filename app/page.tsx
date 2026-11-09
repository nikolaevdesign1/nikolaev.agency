import { HeroVideo } from "@/components/hero-video";
import { ServicesGrid } from "@/components/services-grid";
import { SectionTransition } from "@/components/section-transition";
import { BitEdge } from "@/components/bit-edge";
import { AmbientTextField, StudioChatButton } from "@/components/ambient-text-field";
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
        from="#f8f6f2"
        to="#0a0a0a"
        seed={11}
        phrase="Best cases · brand · product · a production-ready build · direct access"
      />
      <section className="relative flex flex-col overflow-hidden bg-ink px-6 py-36 text-ink-foreground md:px-10 md:py-48">
        <AmbientTextField phrase="Small team · direct access · no account managers" />
        <div className="relative z-[1] flex flex-col gap-24 md:gap-32">
          <div className="flex max-w-5xl flex-col gap-10 md:gap-14">
            <p className="font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              We build AI into the work itself.
            </p>
            <p className="font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Faster builds, lighter support, reachable from anywhere.
            </p>
          </div>

          <div className="grid gap-12 border-t border-ink-border pt-12 md:grid-cols-3 md:gap-10">
            {aiPoints.map((point) => (
              <div key={point.index} className="flex flex-col gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
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

          <div className="mx-auto w-[min(20vw,320px)]">
            <div className="aspect-video overflow-hidden rounded-xl border border-ink-border bg-black/40">
              <video
                src="/video/hero.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <BitEdge phrase="Small team · direct access · no account managers · the work continues past the edge" />
    </>
  );
}
