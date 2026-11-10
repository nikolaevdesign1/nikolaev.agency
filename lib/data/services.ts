export type Direction = {
  label: string;
  /** One-line description shown in the hover card. */
  description: string;
  /** The most requested items within this service. */
  popular: string[];
  bullets: string[];
  color: string;
};

/** Hover-card tints, from the site palette (soft). */
export const serviceTints = ["#dde9ae", "#c3eec5", "#dcb2f0", "#e6a592", "#f3c58f"] as const;

export const directions: Direction[] = [
  {
    label: "Brand Identity",
    description: "Naming, logo, and a visual system that holds up at scale.",
    popular: ["Logo and mark", "Visual guidelines", "Naming", "Packaging"],
    bullets: [
      "Naming, logo, and visual systems built to hold up at scale.",
      "One language across every touchpoint, physical or digital.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Product Design",
    description: "Interfaces shaped around the job the user came to do.",
    popular: ["Web apps", "Mobile apps", "Dashboards", "MVP design"],
    bullets: [
      "Interfaces shaped around the job the user actually came to do.",
      "Design decisions backed by a reason, not a trend.",
    ],
    color: "#f3d9c4",
  },
  {
    label: "UI / UX",
    description: "Flows that remove friction before adding polish.",
    popular: ["User flows", "Interface design", "Prototypes", "Usability review"],
    bullets: [
      "Flows that remove friction before adding polish.",
      "Accessible by default, not bolted on at the end.",
    ],
    color: "#c9e4f0",
  },
  {
    label: "Functional Research",
    description: "Talking to real users before committing pixels.",
    popular: ["User interviews", "Competitor audit", "Problem framing", "Concept testing"],
    bullets: [
      "Talking to real users before committing pixels.",
      "Validating the problem before designing the solution.",
    ],
    color: "#e6d9f3",
  },
  {
    label: "Wireframing",
    description: "Structure first: layout decided before visuals.",
    popular: ["Low-fi wireframes", "Clickable flows", "Page structure", "Handoff specs"],
    bullets: [
      "Structure first — layout decisions made before visual ones.",
      "Fast enough to test, precise enough to build from.",
    ],
    color: "#f3e3b8",
  },
  {
    label: "Motion & Dynamics",
    description: "Micro-interactions that explain state, not just decorate.",
    popular: ["Page transitions", "Hover states", "Product motion", "Intro animation"],
    bullets: [
      "Micro-interactions that explain state, not just decorate it.",
      "Timing and easing tuned by hand, not default curves.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Front-end Development",
    description: "Production code by the team that designed it.",
    popular: ["Next.js builds", "Animations", "CMS setup", "Performance"],
    bullets: [
      "Production code, shipped by the same team that designed it.",
      "Fast, accessible, and built to be maintained.",
    ],
    color: "#f3d9c4",
  },
  {
    label: "Design Systems",
    description: "Tokens, components, and patterns that keep teams aligned.",
    popular: ["Component library", "Tokens", "Documentation", "Figma kit"],
    bullets: [
      "Shared foundations: tokens, components, reusable patterns.",
      "Keeps design and development aligned as products grow.",
    ],
    color: "#c9e4f0",
  },
  {
    label: "AI Integration",
    description: "Agent-native workflows built into the product.",
    popular: ["Chat assistants", "Support automation", "AI search", "Content tooling"],
    bullets: [
      "Agent-native workflows built into the product, not bolted on.",
      "Interfaces designed for both human and model users.",
    ],
    color: "#e6d9f3",
  },
  {
    label: "Art Direction",
    description: "One visual direction carried through every asset.",
    popular: ["Visual concept", "Photo direction", "Typography", "Campaign look"],
    bullets: [
      "A distinctive visual direction, carried through every asset.",
      "Typography, imagery, and motion as one language.",
    ],
    color: "#f3e3b8",
  },
  {
    label: "Accessibility",
    description: "Designed for varied abilities, contexts, and input.",
    popular: ["Contrast audit", "Keyboard flows", "Screen reader pass", "WCAG fixes"],
    bullets: [
      "Designed for varied abilities, contexts, and input methods.",
      "Contrast, focus states, and keyboard use — not an afterthought.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Content Architecture",
    description: "Content structured so it scales without a redesign.",
    popular: ["Site structure", "Schemas", "Navigation", "Editorial model"],
    bullets: [
      "Structuring content so it scales without a redesign.",
      "Schema and hierarchy decided before a single page is built.",
    ],
    color: "#f3d9c4",
  },
];
