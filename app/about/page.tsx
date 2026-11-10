"use client";

import { useState } from "react";
import { BitEdge } from "@/components/bit-edge";
import { directions } from "@/lib/data/services";
import { site } from "@/lib/data/site";

const ORANGE = "#f09637";
const INK = "#161616";

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

const supportCards = [
  {
    index: "01",
    title: "Direct access",
    body: "You reach the people designing and building. The conversation stays with the studio.",
  },
  {
    index: "02",
    title: "No account managers",
    body: "Nobody is inserted between you and the work. The same people answer.",
  },
  {
    index: "03",
    title: "A small studio",
    body: "nikolaev.agency stays small, so a project is not handed across a larger team.",
  },
  {
    index: "04",
    title: "Ongoing support",
    body: "The work can continue after a launch. Ongoing design support is one of the reasons on the contact form.",
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

function Hero() {
  return (
    <section id="company" className="scroll-mt-24 gutter pb-24 pt-32 md:pb-32 md:pt-36" style={{ backgroundColor: ORANGE, color: INK }}>
      <div className="grid items-end gap-x-4 gap-y-8 md:grid-cols-12">
        <p className="text-lg md:col-span-3">Digital-first design</p>
        <figure className="mx-auto w-[min(60%,260px)] md:col-span-3 md:col-start-5 md:w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar.webp" alt="" draggable={false} className="aspect-[3/4] w-full select-none object-cover" />
        </figure>
        <p className="font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-none md:col-span-5 md:col-start-8">
          Made in Los Angeles
        </p>
      </div>
      <h1 className="mt-10 font-serif text-[clamp(2.2rem,5.9vw,6rem)] font-normal leading-[0.98] md:mt-12">
        nikolaev.agency is a small digital-first studio. Direct access to the people doing the work.
        No account managers. We design brands, products, and interfaces, build them ourselves, and
        keep AI inside the process.
      </h1>
    </section>
  );
}

function Capabilities() {
  return (
    <section id="services" className="scroll-mt-24 gutter pb-24 md:pb-32" style={{ backgroundColor: ORANGE, color: INK }}>
      <div className="grid gap-10 md:grid-cols-12 md:gap-x-4">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <p className="text-[clamp(1.4rem,2vw,2rem)] leading-none">Capabilities</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/atelier-40.webp"
              alt=""
              draggable={false}
              className="mt-6 aspect-[3/4] w-[min(100%,420px)] select-none object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <ul className="flex flex-col gap-16 md:gap-24">
            {directions.map((direction) => (
              <li key={direction.label} className="grid gap-3 sm:grid-cols-2 sm:gap-x-4">
                <p className="text-[clamp(1.4rem,2vw,2rem)] leading-tight">{direction.label}</p>
                <ul className="text-[clamp(1.4rem,2vw,2rem)] leading-[1.12]">
                  {direction.popular.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Awards() {
  return (
    <section id="awards" className="scroll-mt-24 bg-ink gutter pb-24 pt-10 text-ink-foreground md:pb-32">
      <div className="flex items-baseline justify-between gap-6 pb-6">
        <h2 className="font-serif text-[clamp(2.6rem,7vw,7rem)] leading-none font-normal">
          Awards &amp; Recognitions
        </h2>
        <span className="shrink-0 font-serif text-[clamp(2.2rem,6vw,6rem)] leading-none">({awardCount})</span>
      </div>
      <div>
        {awardGroups.map((group) => (
          <div key={group.org} className="grid border-t-2 border-ink-foreground/80 md:grid-cols-12 md:gap-x-4">
            <p className="py-3 text-[clamp(1.1rem,1.7vw,1.6rem)] leading-tight md:col-span-6">{group.org}</p>
            <div className="md:col-span-6">
              {group.entries.map((entry, i) => (
                <div
                  key={entry.label}
                  className={`grid grid-cols-[3rem_1fr] gap-x-4 py-3 text-[clamp(1.1rem,1.7vw,1.6rem)] leading-tight sm:grid-cols-[4.5rem_1fr] ${
                    i > 0 ? "border-t border-ink-foreground/50" : ""
                  }`}
                >
                  <span>{entry.count}</span>
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="border-t-2 border-ink-foreground/80" />
      </div>
    </section>
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
    <div className="mt-14 border-b border-white/20">
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
  );
}

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <BitEdge
        from={ORANGE}
        to="#0a0a0a"
        seed={21}
        phrase="Direct access no account managers ongoing support"
      />
      <Awards />

      <section id="support" className="scroll-mt-24 bg-ink text-ink-foreground">
        <div className="gutter py-20 md:py-28">
          <h2 className="max-w-3xl font-serif text-4xl leading-[1.05] font-normal md:text-6xl">
            Direct access. Ongoing support.
          </h2>
          <ul className="mt-14 grid gap-px bg-white/15 sm:grid-cols-2">
            {supportCards.map((card) => (
              <li key={card.index} className="bg-ink gutter py-8 md:px-8 md:py-10">
                <p className="font-mono text-[11px] text-ink-muted">{card.index}</p>
                <h3 className="mt-6 font-serif text-3xl leading-none font-normal">{card.title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-foreground/70">{card.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-ink text-ink-foreground">
        <div className="gutter py-24 md:py-32">
          <h2 className="font-serif text-5xl leading-none font-normal md:text-7xl">Before we start</h2>
          <Faq />
        </div>
        <BitEdge
          from="#0a0a0a"
          to="#fcfbf9"
          seed={8}
          phrase="Before we start a small digital-first studio"
        />
      </section>
    </>
  );
}
