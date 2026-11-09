export type Direction = {
  label: string;
  bullets: string[];
  color: string;
};

export const directions: Direction[] = [
  {
    label: "Brand Identity",
    bullets: [
      "Naming, logo, and visual systems built to hold up at scale.",
      "One language across every touchpoint, physical or digital.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Product Design",
    bullets: [
      "Interfaces shaped around the job the user actually came to do.",
      "Design decisions backed by a reason, not a trend.",
    ],
    color: "#f3d9c4",
  },
  {
    label: "UI / UX",
    bullets: [
      "Flows that remove friction before adding polish.",
      "Accessible by default, not bolted on at the end.",
    ],
    color: "#c9e4f0",
  },
  {
    label: "Functional Research",
    bullets: [
      "Talking to real users before committing pixels.",
      "Validating the problem before designing the solution.",
    ],
    color: "#e6d9f3",
  },
  {
    label: "Wireframing",
    bullets: [
      "Structure first — layout decisions made before visual ones.",
      "Fast enough to test, precise enough to build from.",
    ],
    color: "#f3e3b8",
  },
  {
    label: "Motion & Dynamics",
    bullets: [
      "Micro-interactions that explain state, not just decorate it.",
      "Timing and easing tuned by hand, not default curves.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Front-end Development",
    bullets: [
      "Production code, shipped by the same team that designed it.",
      "Fast, accessible, and built to be maintained.",
    ],
    color: "#f3d9c4",
  },
  {
    label: "Design Systems",
    bullets: [
      "Shared foundations: tokens, components, reusable patterns.",
      "Keeps design and development aligned as products grow.",
    ],
    color: "#c9e4f0",
  },
  {
    label: "AI Integration",
    bullets: [
      "Agent-native workflows built into the product, not bolted on.",
      "Interfaces designed for both human and model users.",
    ],
    color: "#e6d9f3",
  },
  {
    label: "Art Direction",
    bullets: [
      "A distinctive visual direction, carried through every asset.",
      "Typography, imagery, and motion as one language.",
    ],
    color: "#f3e3b8",
  },
  {
    label: "Accessibility",
    bullets: [
      "Designed for varied abilities, contexts, and input methods.",
      "Contrast, focus states, and keyboard use — not an afterthought.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Content Architecture",
    bullets: [
      "Structuring content so it scales without a redesign.",
      "Schema and hierarchy decided before a single page is built.",
    ],
    color: "#f3d9c4",
  },
];
