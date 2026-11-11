"use client";

import { useEffect, useState } from "react";
import {
  siBlender,
  siClaude,
  siCursor,
  siElevenlabs,
  siFigma,
  siFramer,
  siGooglegemini,
  siLottiefiles,
  siNextdotjs,
  siReact,
  siRive,
  siShopify,
  siThreedotjs,
  siWebflow,
} from "simple-icons";
import { AmbientTextField, StudioChatButton } from "@/components/ambient-text-field";
import { BitEdge } from "@/components/bit-edge";
import { InView } from "@/components/in-view";
import { ExpandableVideo } from "@/components/expandable-video";
import { FigureDots } from "@/components/figure-dots";
import { pillClass } from "@/components/button";
import { directions } from "@/lib/data/services";
import { site } from "@/lib/data/site";

const awardGroups: { org: string; entries: { count: number; label: string }[] }[] = [
  {
    org: "The Webby Award",
    entries: [
      { count: 1, label: "Best Visual Design — Function" },
      { count: 1, label: "Websites & Mobile Sites — Professional Services" },
      { count: 1, label: "Best Home Page" },
    ],
  },
  {
    org: "Awwwards",
    entries: [
      { count: 4, label: "Site of the Day" },
      { count: 2, label: "Developer Award" },
      { count: 1, label: "Honorable Mention" },
    ],
  },
  {
    org: "CSS Design Awards",
    entries: [
      { count: 3, label: "Website of the Day" },
      { count: 1, label: "UI Design" },
      { count: 1, label: "UX Design" },
    ],
  },
  {
    org: "FWA",
    entries: [{ count: 2, label: "FWA of the Day" }],
  },
];

const awardCount = awardGroups.reduce(
  (total, group) => total + group.entries.reduce((sum, entry) => sum + entry.count, 0),
  0,
);

const supportSteps = [
  {
    index: "01",
    title: "Send a request",
    body: "You write what needs to change, in the chat or by email.",
  },
  {
    index: "02",
    title: "We pick it up",
    body: "You get a time estimate the same day and wait while we work.",
  },
  {
    index: "03",
    title: "Changes go live",
    body: "We make the edits and show you the result.",
  },
  {
    index: "04",
    title: "You sign off",
    body: "You review and accept the work. Anything off goes back to step 03.",
  },
] as const;

function serviceNames() {
  const labels = directions.map((direction) => direction.label);
  if (labels.length < 2) return labels[0] ?? "";
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

const faqs = [
  {
    id: "Q.001",
    q: "What is nikolaev.agency?",
    a: "A small digital-first studio. You get direct access to the people doing the work, with no account managers.",
  },
  {
    id: "Q.002",
    q: "What does the studio work on?",
    a: `The published directions are ${serviceNames()}.`,
  },
  {
    id: "Q.003",
    q: "How do I reach the studio?",
    a: `Email ${site.email}, or use the contact form. It asks for a name, an email, an optional reason — new project, existing product, ongoing design support, job opportunity, or something else — and what you have in mind. The confirmation says every inquiry gets a reply within two business days.`,
  },
  {
    id: "Q.004",
    q: "Do you publish prices or awards?",
    a: "Pricing is not on the site, and the contact form does not collect a budget. Awards and recognitions are listed above, grouped by the body that gave them.",
  },
  {
    id: "Q.005",
    q: "How does a project start?",
    a: "You write through the contact form or by email. A person from the studio replies, and every inquiry gets an answer within two business days.",
  },
  {
    id: "Q.006",
    q: "Who will I work with?",
    a: "With the people designing and building the project. Nobody is inserted between you and the work, and the same people answer your messages.",
  },
  {
    id: "Q.007",
    q: "Do you design and build, or only design?",
    a: "Both. Front-end development is one of the studio's directions: production code, shipped by the same team that designed it.",
  },
  {
    id: "Q.008",
    q: "Do you work with AI?",
    a: "Yes. AI shortens the distance between a brief and a shipped build, and AI Integration is one of the directions. The assistant in the chat on this site is trained on the studio; a person picks up anything it can't settle.",
  },
  {
    id: "Q.009",
    q: "Does the work continue after launch?",
    a: "It can. Ongoing design support is one of the reasons on the contact form.",
  },
  {
    id: "Q.010",
    q: "Do I need a finished brief to write?",
    a: "No. Describe what you have in mind in the contact form, in your own words, and the conversation starts from there.",
  },
] as const;

type Tool = { name: string; icon?: { path: string; hex: string }; mono?: string };

/** Sixteen tools in one compact grid. Adobe apps get a drawn monogram tile. */
const tools: Tool[] = [
  { name: "Figma", icon: siFigma },
  { name: "Framer", icon: siFramer },
  { name: "Webflow", icon: siWebflow },
  { name: "Blender", icon: siBlender },
  { name: "Rive", icon: siRive },
  { name: "Lottie", icon: siLottiefiles },
  { name: "Photoshop", mono: "Ps" },
  { name: "After Effects", mono: "Ae" },
  { name: "Claude", icon: siClaude },
  { name: "Gemini", icon: siGooglegemini },
  { name: "Cursor", icon: siCursor },
  { name: "ElevenLabs", icon: siElevenlabs },
  { name: "Next.js", icon: siNextdotjs },
  { name: "React", icon: siReact },
  { name: "Three.js", icon: siThreedotjs },
  { name: "Shopify", icon: siShopify },
];

const toolCount = tools.length;

/** Brand color for hover; near-black brands light up white on the dark page. */
function hoverColor(hex: string | undefined) {
  if (!hex) return "#f3f1ea";
  const n = Number.parseInt(hex, 16);
  const lum = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
  return lum < 60 ? "#ffffff" : `#${hex}`;
}

function Hero() {
  return (
    <section
      id="company"
      className="bg-dot-grid relative flex scroll-mt-24 flex-col justify-end overflow-hidden bg-background gutter pb-14 pt-28 text-foreground md:min-h-[100svh] md:pb-16"
    >
      <HeroDecor />
      <div className="relative grid items-end gap-x-4 gap-y-6 md:grid-cols-12">
        <p className="text-base md:col-span-3">Digital-first design</p>
        <figure className="w-[min(46%,200px)] md:col-span-2 md:col-start-5 md:w-auto">
          <video
            src="/video/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="aspect-[3/4] h-auto w-full object-cover md:h-[clamp(150px,30vh,300px)] md:w-auto"
          />
        </figure>
        <p className="font-serif text-[clamp(1.6rem,2.8vw,2.8rem)] leading-none md:col-span-5 md:col-start-8">
          Made in Los Angeles
        </p>
      </div>
      <h1 className="relative mt-8 font-serif text-[clamp(1.9rem,min(4.2vw,6.4vh),4.2rem)] font-normal leading-[1.02] md:mt-10">
        nikolaev.agency is a small digital-first studio. Direct access to the people doing the work.
        No account managers. We design brands, products, and interfaces, build them ourselves, and
        keep AI inside the process.
      </h1>
    </section>
  );
}

/** The quiet drafting marks from the contact page: crosses, margin notes and a ruler. */
function HeroDecor() {
  const notes = ["— Agency", "— Digital first", `— ${site.location}`, `:: Est. ${site.founded}`];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 font-mono text-[10px] text-foreground/30">
      <span className="absolute left-[var(--gutter)] top-[7.5rem] text-sm leading-none">+</span>
      <span className="absolute right-[var(--gutter)] top-[7.5rem] text-sm leading-none">+</span>
      <span className="absolute left-[calc(var(--gutter)+1.5rem)] top-[7.6rem]">+ agency</span>
      <span className="absolute right-[calc(var(--gutter)+1.5rem)] top-[7.6rem]">{site.location}</span>
      <ul className="absolute left-[var(--gutter)] top-[11rem] hidden flex-col gap-2 md:flex">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <span className="absolute right-[var(--gutter)] top-1/2 hidden text-sm md:block">+</span>
      <span className="absolute left-1/2 top-[42%] hidden text-sm md:block">+</span>
      <div
        className="absolute inset-x-[var(--gutter)] bottom-3 h-2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 24px)",
        }}
      />
    </div>
  );
}

function Capabilities() {
  return (
    <section id="services" className="scroll-mt-24 bg-background gutter pb-24 pt-24 text-foreground md:pb-36 md:pt-44">
      <div className="grid gap-10 md:grid-cols-12 md:gap-x-4">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-36">
            <p className="text-[clamp(1.15rem,1.5vw,1.5rem)] leading-none">Capabilities</p>
            <FigureDots className="mt-6 aspect-[3/4] w-[min(100%,360px)]" />
          </div>
        </div>
        <ul className="flex flex-col gap-14 md:col-span-7 md:col-start-6 md:gap-20">
          {directions.map((direction) => (
            <InView as="li" key={direction.label} className="grid gap-3 sm:grid-cols-2 sm:gap-x-4">
              <p className="reveal-line text-[clamp(1.15rem,1.5vw,1.5rem)] leading-tight">
                <span>{direction.label}</span>
              </p>
              <ul className="text-[clamp(1.15rem,1.5vw,1.5rem)] leading-[1.18]">
                {direction.popular.map((item, i) => (
                  <li key={item} className="reveal-line">
                    <span style={{ ["--d" as string]: `${80 + i * 60}ms` }}>{item}</span>
                  </li>
                ))}
              </ul>
            </InView>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <InView className="mb-16 flex items-baseline justify-between gap-6 md:mb-24">
      <h2 className="reveal-line font-serif text-[clamp(2.4rem,6.4vw,6.4rem)] leading-none font-normal">
        <span>{title}</span>
      </h2>
      <span className="reveal-fade shrink-0 font-serif text-[clamp(2rem,5.4vw,5.4rem)] leading-none">({count})</span>
    </InView>
  );
}

function Awards() {
  return (
    <section id="awards" className="relative scroll-mt-24 gutter pb-24 pt-12 md:pb-32">
      <SectionTitle title="Awards & Recognitions" count={awardCount} />
      <div role="table" aria-label="Awards and recognitions" className="text-[clamp(1rem,1.35vw,1.35rem)] leading-tight">
        <div role="row" className="grid grid-cols-[1fr_3.5rem_2fr] gap-x-4 border-b border-ink-foreground/60 pb-3 font-mono text-[11px] text-ink-muted md:grid-cols-[5fr_1fr_6fr]">
          <span role="columnheader">Organization</span>
          <span role="columnheader" className="text-right">Qty</span>
          <span role="columnheader">Award</span>
        </div>
        {awardGroups.map((group) => (
          <InView key={group.org} className="border-b-2 border-ink-foreground/70">
            {group.entries.map((entry, i) => (
              <div
                role="row"
                key={entry.label}
                className={`reveal-fade grid grid-cols-[1fr_3.5rem_2fr] gap-x-4 py-4 transition-colors hover:bg-ink-foreground/[0.04] md:grid-cols-[5fr_1fr_6fr] ${
                  i > 0 ? "border-t border-ink-foreground/20" : ""
                }`}
                style={{ ["--d" as string]: `${i * 70}ms` }}
              >
                <span role="cell" className={i === 0 ? "" : "text-transparent select-none"}>
                  {group.org}
                </span>
                <span role="cell" className="text-right tabular-nums">{entry.count}</span>
                <span role="cell">{entry.label}</span>
              </div>
            ))}
          </InView>
        ))}
        <div role="row" className="grid grid-cols-[1fr_3.5rem_2fr] gap-x-4 py-4 text-ink-muted md:grid-cols-[5fr_1fr_6fr]">
          <span role="cell">Total</span>
          <span role="cell" className="text-right tabular-nums text-ink-foreground">{awardCount}</span>
          <span role="cell" />
        </div>
      </div>
    </section>
  );
}

function Tools() {
  return (
    <section id="tools" className="relative scroll-mt-24 gutter pb-24 md:pb-32">
      <SectionTitle title="Tools we work with" count={toolCount} />
      <InView>
        <ul className="grid grid-cols-4 border-l border-t border-ink-foreground/20 md:grid-cols-8">
          {tools.map((tool, i) => (
            <li
              key={tool.name}
              className="reveal-fade group/tool flex flex-col items-center justify-center gap-2.5 border-b border-r border-ink-foreground/20 px-2 py-5 text-ink-foreground/75 transition-colors duration-300 hover:bg-ink-foreground/[0.04] md:py-6"
              style={{ ["--d" as string]: `${i * 30}ms`, ["--brand" as string]: hoverColor(tool.icon?.hex) }}
            >
              {tool.icon ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-current transition-colors duration-300 group-hover/tool:text-[var(--brand)]">
                  <path d={tool.icon.path} />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 transition-colors duration-300 group-hover/tool:text-white">
                  <rect x="1.5" y="1.5" width="21" height="21" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <text x="12" y="16.2" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="currentColor" fontFamily="var(--font-mono-display), ui-monospace, monospace">
                    {tool.mono}
                  </text>
                </svg>
              )}
              <span className="truncate font-mono text-[10px] text-ink-muted md:text-[11px]">{tool.name}</span>
            </li>
          ))}
        </ul>
      </InView>
    </section>
  );
}

function Support() {
  return (
    <section id="support" className="relative scroll-mt-24 gutter py-20 md:py-28">
      <h2 className="max-w-3xl font-serif text-4xl leading-[1.05] font-normal md:text-6xl">How support works</h2>
      <div className="mt-12 md:mt-16">
        <SupportVideo />
      </div>
      <ul className="mt-14 border-t border-ink-foreground/20 md:mt-20">
        {supportSteps.map((step, i) => (
          <InView as="li" key={step.index} className="group/row border-b border-ink-foreground/20">
            <div
              className="reveal-fade grid items-baseline gap-4 py-8 md:grid-cols-[8rem_1fr_1fr] md:gap-8 md:py-10"
              style={{ ["--d" as string]: `${i * 60}ms` }}
            >
              <span
                className={`font-serif text-5xl leading-none transition-[color,transform] duration-300 group-hover/row:translate-x-2 group-hover/row:text-accent md:text-7xl ${
                  i === 0 ? "text-accent" : "text-ink-foreground/30"
                }`}
              >
                {step.index}
              </span>
              <h3 className="font-serif text-3xl leading-none font-normal md:text-4xl">{step.title}</h3>
              <p className="max-w-md text-sm leading-relaxed text-ink-foreground/70">{step.body}</p>
            </div>
          </InView>
        ))}
      </ul>
    </section>
  );
}

/** The support video once /video/support.mp4 is uploaded; a quiet placeholder until then. */
function SupportVideo() {
  const [ready, setReady] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/video/support.mp4", { method: "HEAD" })
      .then((res) => alive && setReady(res.ok))
      .catch(() => alive && setReady(false));
    return () => {
      alive = false;
    };
  }, []);

  if (ready) return <ExpandableVideo src="/video/support.mp4" className="w-full" />;
  return (
    <div className="grid aspect-video w-full place-items-center rounded-[12px] bg-[#141414] ring-1 ring-ink-foreground/10">
      <div className="flex flex-col items-center gap-3 font-mono text-[12px] text-ink-muted">
        <span className="grid size-12 place-items-center rounded-full ring-1 ring-ink-foreground/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l10.5-6.5z" />
          </svg>
        </span>
        {ready === false ? "Video coming soon" : ""}
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([faqs[0].id]));
  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section id="faq" className="relative scroll-mt-24 gutter py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <h2 className="font-serif text-5xl leading-none font-normal md:text-7xl">Before we start</h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-foreground/70">
              Didn&apos;t find your question? Ask it in the chat. The reply comes from the people doing the work.
            </p>
            <StudioChatButton className={`${pillClass} mt-8`}>Let&apos;s chat</StudioChatButton>
          </div>
        </div>
        <div className="border-b border-white/20 md:col-span-8">
          {faqs.map((item) => {
            const isOpen = open.has(item.id);
            return (
              <div key={item.id} className="border-t border-white/20">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  onClick={() => toggle(item.id)}
                  className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
                >
                  <span className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="shrink-0 font-mono text-[11px] text-ink-muted">{item.id}</span>
                    <span className="font-serif text-2xl leading-tight transition-opacity group-hover:opacity-70 md:text-3xl">
                      {item.q}
                    </span>
                  </span>
                  <span aria-hidden="true" className="relative size-5 shrink-0 self-center">
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                    <span
                      className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out ${
                        isOpen ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>
                <div
                  id={`${item.id}-panel`}
                  role="region"
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 text-sm leading-relaxed text-ink-foreground/70 sm:pl-[4.6rem]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <BitEdge from="#fcfbf9" to="#0a0a0a" seed={21} phrase="Direct access no account managers ongoing support" />
      <div className="relative bg-ink text-ink-foreground">
        <AmbientTextField phrase="Small team · direct access · no account managers" />
        <div className="relative z-[1]">
          <Awards />
          <Tools />
          <Support />
          <Faq />
        </div>
      </div>
      <BitEdge from="#0a0a0a" to="#fcfbf9" seed={8} phrase="Before we start a small digital-first studio" />
    </>
  );
}
