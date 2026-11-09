import { HeroVideo } from "@/components/hero-video";
import { ServicesGrid } from "@/components/services-grid";
import { SectionTransition } from "@/components/section-transition";
import { BitEdge } from "@/components/bit-edge";
import { AmbientTextField, StudioChatButton } from "@/components/ambient-text-field";
import { BestCases } from "@/components/best-cases";
import { LinkButton, PillArrow, pillClass } from "@/components/button";

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
      <section className="relative flex min-h-[120vh] flex-col overflow-hidden bg-ink px-6 py-36 text-ink-foreground md:px-10 md:py-48">
        <AmbientTextField phrase="Small team · direct access · no account managers" />
        <div className="relative z-[1] flex flex-1 flex-col justify-between gap-24 md:gap-32">
          <div className="flex max-w-5xl flex-col gap-10 md:gap-14">
            <p className="font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              nikolaev.agency is a small digital-first studio.
            </p>
            <p className="font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Direct access. No account managers.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <p className="max-w-sm text-sm leading-relaxed text-ink-foreground/70 md:text-base">
              by Oleg Nikolaev. Designed &amp; built in Los Angeles.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <StudioChatButton className={pillClass}>
                Let&apos;s chat
                <PillArrow />
              </StudioChatButton>
              <LinkButton href="/contact">Request a project</LinkButton>
            </div>
          </div>
        </div>
      </section>

      <BitEdge phrase="Small team · direct access · no account managers · the work continues past the edge" />
    </>
  );
}
