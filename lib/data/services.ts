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
    popular: ["Wordmark and logo system", "Brand character and mascot", "Colour, type and shape rules", "Packaging and labels"],
    bullets: [
      "Naming, logo, and visual systems built to hold up at scale.",
      "One language across every touchpoint, physical or digital.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Product Design",
    description: "Interfaces shaped around the job the user came to do.",
    popular: ["Mobile app flows", "Web app screens", "Marketplace and store design", "AI features inside live products"],
    bullets: [
      "Interfaces shaped around the job the user actually came to do.",
      "Design decisions backed by a reason, not a trend.",
    ],
    color: "#f3d9c4",
  },
  {
    label: "UI / UX",
    description: "Flows that remove friction before adding polish.",
    popular: ["Responsive interface design", "Clickable prototypes", "Usability test rounds", "Layouts ready for developers"],
    bullets: [
      "Flows that remove friction before adding polish.",
      "Accessible by default, not bolted on at the end.",
    ],
    color: "#c9e4f0",
  },
  {
    label: "Functional Research",
    description: "Talking to real users before committing pixels.",
    popular: ["Competitor teardown", "Interview scripts and findings", "Problem statements", "Concept checks before design"],
    bullets: [
      "Talking to real users before committing pixels.",
      "Validating the problem before designing the solution.",
    ],
    color: "#e6d9f3",
  },
  {
    label: "Wireframing",
    description: "Structure first: layout decided before visuals.",
    popular: ["Page maps and structure", "Rough layouts for testing", "Click-through flows", "Annotated specs for build"],
    bullets: [
      "Structure first — layout decisions made before visual ones.",
      "Fast enough to test, precise enough to build from.",
    ],
    color: "#f3e3b8",
  },
  {
    label: "Motion & Dynamics",
    description: "Micro-interactions that explain state, not just decorate.",
    popular: ["Page and route transitions", "Scroll and hover behaviour", "Product walkthrough motion", "Intro and loading sequences"],
    bullets: [
      "Micro-interactions that explain state, not just decorate it.",
      "Timing and easing tuned by hand, not default curves.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Front-end Development",
    description: "Production code by the team that designed it.",
    popular: ["Next.js and React builds", "Animated interfaces", "Content management setup", "Speed and Core Web Vitals"],
    bullets: [
      "Production code, shipped by the same team that designed it.",
      "Fast, accessible, and built to be maintained.",
    ],
    color: "#f3d9c4",
  },
  {
    label: "Design Systems",
    description: "Tokens, components, and patterns that keep teams aligned.",
    popular: ["Shared component library", "Colour, type and spacing tokens", "Usage documentation", "Figma kit kept in sync"],
    bullets: [
      "Shared foundations: tokens, components, reusable patterns.",
      "Keeps design and development aligned as products grow.",
    ],
    color: "#c9e4f0",
  },
  {
    label: "AI Integration",
    description: "Agent-native workflows built into the product.",
    popular: ["Voice and text assistants", "Agents that plan routes and tasks", "Search over your own content", "Prompts and guardrails"],
    bullets: [
      "Agent-native workflows built into the product, not bolted on.",
      "Interfaces designed for both human and model users.",
    ],
    color: "#e6d9f3",
  },
  {
    label: "Art Direction",
    description: "One visual direction carried through every asset.",
    popular: ["Visual concept and mood", "Image and 3D direction", "Type pairing and layout", "Look for launches and campaigns"],
    bullets: [
      "A distinctive visual direction, carried through every asset.",
      "Typography, imagery, and motion as one language.",
    ],
    color: "#f3e3b8",
  },
  {
    label: "Accessibility",
    description: "Designed for varied abilities, contexts, and input.",
    popular: ["Contrast and colour checks", "Keyboard and focus paths", "Screen reader pass", "Fixes to WCAG 2.2 AA"],
    bullets: [
      "Designed for varied abilities, contexts, and input methods.",
      "Contrast, focus states, and keyboard use — not an afterthought.",
    ],
    color: "#d7f0c7",
  },
  {
    label: "Content Architecture",
    description: "Content structured so it scales without a redesign.",
    popular: ["Site maps and navigation", "Content models and fields", "Editorial structure for journals", "URL and metadata planning"],
    bullets: [
      "Structuring content so it scales without a redesign.",
      "Schema and hierarchy decided before a single page is built.",
    ],
    color: "#f3d9c4",
  },
];
