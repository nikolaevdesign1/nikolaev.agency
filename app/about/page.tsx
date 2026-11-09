"use client";

import { useEffect, useState } from "react";
import { BitEdge } from "@/components/bit-edge";
import { directions, type Direction } from "@/lib/data/services";
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

/** Clauses taken from each direction's published bullets. Three or four, nothing added. */
const servicePoints: Record<string, readonly string[]> = {
  "Brand Identity": [
    "Naming, logo, and visual systems",
    "Built to hold up at scale",
    "One language across every touchpoint",
    "Physical or digital",
  ],
  "Product Design": [
    "Interfaces shaped around the job the user actually came to do",
    "Design decisions backed by a reason",
    "Not a trend",
  ],
  "UI / UX": [
    "Flows that remove friction",
    "Before adding polish",
    "Accessible by default",
    "Not bolted on at the end",
  ],
  "Functional Research": [
    "Talking to real users",
    "Before committing pixels",
    "Validating the problem",
    "Before designing the solution",
  ],
  Wireframing: [
    "Structure first",
    "Layout decisions made before visual ones",
    "Fast enough to test",
    "Precise enough to build from",
  ],
  "Motion & Dynamics": [
    "Micro-interactions that explain state",
    "Not just decorate it",
    "Timing and easing tuned by hand",
    "Not default curves",
  ],
  "Front-end Development": [
    "Production code",
    "Shipped by the same team that designed it",
    "Fast, accessible",
    "Built to be maintained",
  ],
  "Design Systems": [
    "Shared foundations",
    "Tokens, components, reusable patterns",
    "Keeps design and development aligned",
    "As products grow",
  ],
  "AI Integration": [
    "Agent-native workflows built into the product",
    "Not bolted on",
    "Interfaces designed for both human and model users",
  ],
  "Art Direction": [
    "A distinctive visual direction",
    "Carried through every asset",
    "Typography, imagery, and motion",
    "As one language",
  ],
  Accessibility: [
    "Designed for varied abilities, contexts, and input methods",
    "Contrast, focus states, and keyboard use",
    "Not an afterthought",
  ],
  "Content Architecture": [
    "Structuring content so it scales",
    "Without a redesign",
    "Schema and hierarchy",
    "Decided before a single page is built",
  ],
};

const spots = [
  { x: "1%", y: "2%", r: -6 },
  { x: "27%", y: "0%", r: 3 },
  { x: "51%", y: "3%", r: -2 },
  { x: "76%", y: "1%", r: 5 },
  { x: "0%", y: "32%", r: 4 },
  { x: "78%", y: "28%", r: -4 },
  { x: "2%", y: "56%", r: -5 },
  { x: "76%", y: "54%", r: 3 },
  { x: "1%", y: "78%", r: 6 },
  { x: "27%", y: "76%", r: -3 },
  { x: "52%", y: "80%", r: 2 },
  { x: "76%", y: "74%", r: -6 },
] as const;

function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return (x ^ (x >>> 16)) >>> 0;
}

function digitField() {
  const cols = 140;
  const rows = 48;
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => String(hash(row * cols + col + 17) % 10)).join(
      " ",
    ),
  ).join("\n");
}

const DIGITS = digitField();

function pointsFor(direction: Direction) {
  const written = servicePoints[direction.label];
  if (written && written.length >= 3) return written.slice(0, 4);
  return direction.bullets.slice(0, 4);
}

function serviceNames() {
  const labels = directions.map((direction) => direction.label);
  if (labels.length < 2) return labels[0] ?? "";
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function PosterArt({ index, ink }: { index: number; ink: string }) {
  switch (index % 12) {
    case 0:
      return <circle cx="80" cy="84" r="46" fill={ink} />;
    case 1:
      return (
        <>
          <rect x="28" y="40" width="104" height="12" fill={ink} />
          <rect x="28" y="64" width="72" height="12" fill={ink} />
          <rect x="28" y="88" width="104" height="12" fill={ink} />
          <rect x="28" y="112" width="48" height="12" fill={ink} />
        </>
      );
    case 2:
      return <polygon points="28,132 132,36 132,132" fill={ink} />;
    case 3:
      return (
        <>
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={40 + col * 26}
                cy={40 + row * 22}
                r="4"
                fill={ink}
              />
            )),
          )}
        </>
      );
    case 4:
      return (
        <>
          <rect x="36" y="32" width="28" height="108" fill={ink} />
          <rect x="76" y="56" width="48" height="16" fill={ink} />
          <rect x="76" y="84" width="36" height="16" fill={ink} />
        </>
      );
    case 5:
      return <path d="M28 132 A52 52 0 0 1 132 132 Z" fill={ink} />;
    case 6:
      return (
        <>
          <rect x="72" y="32" width="16" height="104" fill={ink} />
          <rect x="32" y="76" width="96" height="16" fill={ink} />
        </>
      );
    case 7:
      return (
        <>
          <rect x="32" y="36" width="40" height="40" fill={ink} />
          <rect x="80" y="36" width="48" height="22" fill={ink} />
          <rect x="32" y="86" width="96" height="18" fill={ink} />
          <rect x="32" y="114" width="64" height="18" fill={ink} />
        </>
      );
    case 8:
      return <path d="M36 120c0-40 88-40 88 0" fill="none" stroke={ink} strokeWidth="14" />;
    case 9:
      return (
        <>
          <rect x="36" y="32" width="88" height="100" fill="none" stroke={ink} strokeWidth="10" />
          <rect x="52" y="48" width="56" height="68" fill={ink} />
        </>
      );
    case 10:
      return (
        <>
          <circle cx="80" cy="78" r="40" fill="none" stroke={ink} strokeWidth="10" />
          <circle cx="80" cy="78" r="14" fill={ink} />
        </>
      );
    default:
      return (
        <>
          <rect x="30" y="34" width="100" height="100" fill="none" stroke={ink} strokeWidth="8" />
          <rect x="46" y="50" width="68" height="68" fill="none" stroke={ink} strokeWidth="8" />
          <rect x="62" y="66" width="36" height="36" fill={ink} />
        </>
      );
  }
}

function ServicePoster({ direction, index }: { direction: Direction; index: number }) {
  const ink = "#161616";
  return (
    <svg viewBox="0 0 160 200" className="h-full w-full" aria-hidden="true">
      <rect width="160" height="200" fill={direction.color} />
      <PosterArt index={index} ink={ink} />
      <text
        x="10"
        y="182"
        fill={ink}
        fontSize={direction.label.length > 18 ? 18 : 22}
        style={{ fontFamily: "var(--font-serif), 'Times New Roman', serif" }}
      >
        {direction.label}
      </text>
      <rect
        x="0.5"
        y="0.5"
        width="159"
        height="199"
        fill="none"
        stroke={ink}
        strokeOpacity="0.28"
      />
    </svg>
  );
}

const AMBIENT_TAGS = [
  "BRAND :: IDENTITY",
  "PRODUCT :: DESIGN",
  "UI :: UX",
  "WIREFRAME :: TEST",
  "MOTION :: TIMING",
  "FRONT-END :: SHIP",
  "DESIGN :: SYSTEM",
  "AI :: NATIVE",
  "ART :: DIRECTION",
  "A11Y :: DEFAULT",
  "SCHEMA :: SCALE",
  "RESEARCH :: FIRST",
];

const AMBIENT_SPOTS = [
  { x: "6%", y: "8%" },
  { x: "38%", y: "4%" },
  { x: "68%", y: "10%" },
  { x: "88%", y: "22%" },
  { x: "14%", y: "30%" },
  { x: "56%", y: "26%" },
  { x: "8%", y: "58%" },
  { x: "42%", y: "62%" },
  { x: "74%", y: "56%" },
  { x: "20%", y: "84%" },
  { x: "60%", y: "88%" },
  { x: "86%", y: "80%" },
] as const;

function AmbientTag({
  text,
  x,
  y,
  baseDelay,
}: {
  text: string;
  x: string;
  y: string;
  baseDelay: number;
}) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [faded, setFaded] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(() => !cancelled && fn(), ms));
    };

    const typeStep = 55;
    const runCycle = () => {
      setFaded(false);
      setVisibleChars(0);
      for (let i = 1; i <= text.length; i++) {
        schedule(() => setVisibleChars(i), i * typeStep);
      }
      const holdStart = text.length * typeStep;
      schedule(() => setFaded(true), holdStart + 3000);
      schedule(runCycle, holdStart + 3000 + 600 + Math.random() * 4000);
    };

    schedule(runCycle, baseDelay + Math.random() * 1500);
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [text, baseDelay]);

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute whitespace-nowrap font-mono text-[11px] text-[#161616]/35 transition-opacity duration-700"
      style={{ left: x, top: y, opacity: faded ? 0 : 1 }}
    >
      {text.slice(0, visibleChars)}
      <span className="opacity-60">{visibleChars < text.length ? "_" : ""}</span>
    </span>
  );
}

function ServiceAmbience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {AMBIENT_SPOTS.map((spot, index) => (
        <AmbientTag
          key={index}
          text={AMBIENT_TAGS[index % AMBIENT_TAGS.length]}
          x={spot.x}
          y={spot.y}
          baseDelay={index * 900}
        />
      ))}
    </div>
  );
}

function ServiceField() {
  return (
    <div className="relative mx-auto min-h-[920px] max-w-6xl sm:min-h-[1040px] md:min-h-[1120px]">
      <ServiceAmbience />
      <h2 className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-center font-serif text-[clamp(2.5rem,6vw,5.25rem)] leading-none font-normal whitespace-nowrap text-foreground">
        Our services
      </h2>
      {directions.map((direction, index) => {
        const spot = spots[index % spots.length];
        const above = Number.parseFloat(spot.y) > 60;
        const x = Number.parseFloat(spot.x);
        const side = x < 18 ? "left" : x > 64 ? "right" : "center";
        const points = pointsFor(direction);
        return (
          <button
            key={direction.label}
            type="button"
            className="group absolute z-10 w-[72px] border-0 bg-transparent p-0 text-left hover:z-30 focus:z-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#161616] sm:w-[128px] md:w-[156px]"
            style={{
              left: spot.x,
              top: spot.y,
            }}
          >
            <span className="block aspect-[4/5] w-full shadow-[0_12px_28px_rgba(22,22,22,0.08)]">
              <ServicePoster direction={direction} index={index} />
            </span>
            <span
              className={`pointer-events-none absolute z-30 w-44 border border-[#161616]/15 bg-white px-3 py-2.5 opacity-0 shadow-[0_8px_24px_rgba(22,22,22,0.08)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
                above ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
              } ${side === "right" ? "right-0" : side === "center" ? "left-1/2 -translate-x-1/2" : "left-0"}`}
            >
              <span className="block font-serif text-[13px] leading-tight text-[#161616]">
                {direction.label}
              </span>
              <ul className="mt-2 space-y-1">
                {points.map((point) => (
                  <li
                    key={point}
                    className="font-mono text-[10px] leading-snug text-[#161616]/75"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </span>
          </button>
        );
      })}
    </div>
  );
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
] as const;

export default function AboutPage() {
  return (
    <>
      <section id="company" className="scroll-mt-24 bg-white gutter pt-36 pb-24 md:pt-48 md:pb-36">
        <div className="grid items-start gap-6 md:grid-cols-[7.5rem_minmax(0,1fr)] md:gap-12">
          <p className="font-mono text-[11px] text-muted md:pt-4">
            Company
          </p>
          <h1 className="max-w-5xl font-serif text-[clamp(2.15rem,5vw,4.6rem)] leading-[1.08] font-normal text-pretty text-foreground">
            nikolaev.agency is a small digital-first studio. Direct access to the people doing
            the work. No account managers.
          </h1>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 bg-white gutter py-16 md:py-24">
        <ServiceField />
      </section>

      <section id="awards" className="scroll-mt-24 bg-white gutter py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-baseline justify-between gap-6 border-b-2 border-[#161616] pb-4">
            <h2 className="font-serif text-4xl leading-none font-normal text-foreground md:text-6xl">
              Awards &amp; Recognitions
            </h2>
            <span className="shrink-0 font-serif text-2xl text-foreground md:text-4xl">
              ({awardCount})
            </span>
          </div>
          <div>
            {awardGroups.map((group) => (
              <div key={group.org} className="border-b-2 border-[#161616]">
                {group.entries.map((entry, i) => (
                  <div
                    key={entry.label}
                    className={`grid grid-cols-[1fr_2.5rem_1fr] items-baseline gap-4 py-3.5 ${
                      i > 0 ? "border-t border-[#161616]/25" : ""
                    }`}
                  >
                    <span className="font-serif text-lg text-foreground">
                      {i === 0 ? group.org : ""}
                    </span>
                    <span className="font-mono text-sm text-muted">{entry.count}</span>
                    <span className="font-mono text-xs text-foreground">
                      {entry.label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="relative scroll-mt-24 overflow-hidden bg-white">
        <pre
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-0 overflow-hidden font-mono text-[11px] leading-[1.65] text-[#161616]/20 select-none md:text-xs"
        >
          {DIGITS}
        </pre>
        <div className="relative flex items-center gutter py-24 md:py-32">
          <p className="max-w-md font-serif text-3xl leading-snug font-normal text-pretty text-foreground md:text-5xl">
            A small digital-first studio. Direct access, no account managers.
          </p>
        </div>
      </section>

      <section id="support" className="scroll-mt-24 bg-ink text-ink-foreground">
        <BitEdge
          from="#ffffff"
          to="#0a0a0a"
          seed={21}
          phrase="Direct access no account managers ongoing support"
        />
        <div className="gutter py-20 md:py-28">
          <h2 className="max-w-3xl font-serif text-4xl leading-[1.05] font-normal md:text-6xl">
            Direct access. Ongoing support.
          </h2>
          <ul className="mt-14 grid gap-px bg-white/15 sm:grid-cols-2">
            {supportCards.map((card) => (
              <li key={card.index} className="bg-ink gutter py-8 md:px-8 md:py-10">
                <p className="font-mono text-[11px] text-ink-muted">
                  {card.index}
                </p>
                <h3 className="mt-6 font-serif text-3xl leading-none font-normal">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-foreground/70">
                  {card.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-ink text-ink-foreground">
        <div className="gutter py-24 md:py-32">
          <h2 className="font-serif text-5xl leading-none font-normal md:text-7xl">
            Before we start
          </h2>
          <div className="mt-14 border-b border-white/20">
            {faqs.map((item, index) => (
              <details
                key={item.id}
                open={index === 0}
                className="group border-t border-white/20"
              >
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="shrink-0 font-mono text-[11px] text-ink-muted">
                      {item.id}
                    </span>
                    <span className="font-serif text-2xl leading-tight md:text-3xl">{item.q}</span>
                  </span>
                  <span aria-hidden="true" className="font-mono text-2xl leading-none">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 text-sm leading-relaxed text-ink-foreground/70 sm:pl-[4.6rem]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
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
