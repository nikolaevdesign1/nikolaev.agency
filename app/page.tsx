import { HeroVideo } from "@/components/hero-video";
import { ServicesGrid } from "@/components/services-grid";
import { BitEdge } from "@/components/bit-edge";
import { AmbientTextField, StudioChatButton } from "@/components/ambient-text-field";
import { ScrambleText } from "@/components/scramble-text";
import { ExpandableVideo } from "@/components/expandable-video";
import { BestCases } from "@/components/best-cases";
import { GlobeNetwork } from "@/components/globe-network";
import { GlobeSticky } from "@/components/globe-sticky";
import { LinkButton, pillClass } from "@/components/button";

const aiPoints = [
  {
    index: "001",
    title: "Faster, by default",
    body: "AI shortens the distance between a brief and a shipped build: drafts, variations, and first passes happen in hours, not days, without skipping the craft.",
  },
  {
    index: "002",
    title: "Support that doesn't wait on a ticket",
    body: "Most questions get answered the moment they're asked, by a studio-trained assistant that knows the project. A person picks up anything it can't.",
  },
  {
    index: "003",
    title: "Reachable from anywhere",
    body: "Async reviews, written handoffs, and tooling built for distributed teams. The work stays easy to pick up across time zones, not just across a desk.",
  },
  {
    index: "004",
    title: "Context that stays",
    body: "The assistant knows the brief, past decisions, and what was agreed last week. Nobody has to explain the project twice.",
  },
  {
    index: "005",
    title: "Self-organising support",
    body: "Requests sort themselves into tasks and owners. Small questions close in minutes; bigger ones reach the right person already described.",
  },
  {
    index: "006",
    title: "Reviews in writing",
    body: "Feedback, approvals, and handoffs live in one thread per project. You can see what changed without sitting through a call.",
  },
  {
    index: "007",
    title: "A person behind it",
    body: "Anything the assistant can't settle goes to someone in the studio with the full context attached. You are never left with a bot alone.",
  },
];

export default function Home() {
  return (
    <>
      <HeroVideo src="/video/hero.mp4" />

      <ServicesGrid />

      <BestCases />

      <BitEdge
        from="#fcfbf9"
        to="#0a0a0a"
        seed={11}
        phrase="Best cases · brand · product · a production-ready build · direct access"
      />
      <section className="relative flex flex-col overflow-hidden bg-ink gutter pb-36 pt-20 text-ink-foreground md:pb-48 md:pt-24">
        <AmbientTextField phrase="Small team · direct access · no account managers" />
        <div className="relative z-[1] flex flex-col gap-24 md:gap-32">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
            <div className="flex flex-col gap-16 md:gap-20">
              <div className="flex flex-col gap-10 md:gap-14">
                <ScrambleText
                  as="p"
                  text="We build AI into the work itself."
                  className="font-serif text-4xl font-medium leading-[1.05] md:text-6xl"
                />
                <ScrambleText
                  as="p"
                  text="Faster builds, lighter support, reachable from anywhere."
                  className="font-serif text-4xl font-medium leading-[1.05] md:text-6xl"
                />
              </div>

              <ol className="flex flex-col gap-14 md:gap-16">
                {aiPoints.map((point, i) => (
                  <li
                    key={point.index}
                    className="flex max-w-[26rem] flex-col gap-4 lg:ml-[calc(var(--step)*2rem)]"
                    style={{ ["--step" as string]: i }}
                  >
                    <p className="font-mono text-[11px] text-ink-muted">
                      {point.index} / {point.title}
                    </p>
                    <p className="text-xl leading-snug text-ink-foreground md:text-2xl">
                      {point.body}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap items-center gap-3">
                <StudioChatButton className={pillClass}>Let&apos;s chat</StudioChatButton>
                <LinkButton href="/contact">Request a project</LinkButton>
              </div>
            </div>

            <GlobeSticky>
              <GlobeNetwork className="mx-auto w-full max-w-[680px]" />
            </GlobeSticky>
          </div>

          <ExpandableVideo src="/video/hero.mp4" className="mx-auto w-[min(88vw,640px)]" />
        </div>
      </section>

      <BitEdge phrase="Small team · direct access · no account managers · the work continues past the edge" />
    </>
  );
}
