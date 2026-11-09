export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  location: string;
  year: string;
  services: string[];
  summary: string;
  featured?: boolean;
  /** Cover aspect ratio used by the tile layout. */
  format?: "4:3" | "16:9" | "9:16";
  /** Live site, when the project is one. Enables "Visit site". */
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "silo-dallas",
    format: "16:9",
    title: "Silo Dallas",
    client: "Silo",
    category: "Hospitality",
    location: "Dallas, TX",
    year: "2025",
    services: ["Website", "Art Direction", "Motion"],
    summary:
      "A nightlife venue brand and responsive site built around event energy — bold type, high-contrast imagery, and a ticketing flow that never gets in the way.",
    featured: true,
  },
  {
    slug: "meridian-capital",
    format: "9:16",
    title: "Meridian Capital",
    client: "Meridian",
    category: "Finance",
    location: "New York, NY",
    year: "2025",
    services: ["Brand Identity", "Website", "Design System"],
    summary:
      "A quiet, confident identity for a private investment firm — restrained type, long-form data tables, and a site built to earn trust in seconds.",
    featured: true,
  },
  {
    slug: "fieldnote",
    format: "4:3",
    title: "Fieldnote",
    client: "Fieldnote Labs",
    category: "Product",
    location: "Remote",
    year: "2024",
    services: ["Product UI", "Design System", "Front-end"],
    summary:
      "An agent-native workflow tool for field teams. We designed and built the full product surface, from onboarding to the dashboards teams live in daily.",
    featured: true,
  },
  {
    slug: "atlas-running",
    format: "16:9",
    title: "Atlas Running Club",
    client: "Atlas",
    category: "Apparel",
    location: "Los Angeles, CA",
    year: "2024",
    services: ["Brand Identity", "Packaging", "Website"],
    summary:
      "Identity and e-commerce build for an LA-born running club turned apparel label — built to move at the pace of its community.",
  },
  {
    slug: "harbor-health",
    format: "4:3",
    title: "Harbor Health",
    client: "Harbor",
    category: "Healthcare",
    location: "Boston, MA",
    year: "2023",
    services: ["Website", "Content System"],
    summary:
      "A content-heavy marketing site for a healthcare network, rebuilt for clarity, speed, and a CMS their team actually wants to use.",
  },
  {
    slug: "northline",
    format: "9:16",
    title: "Northline",
    client: "Northline Goods",
    category: "E-commerce",
    location: "Chicago, IL",
    year: "2023",
    services: ["Website", "Art Direction"],
    summary:
      "A direct-to-consumer storefront built around product photography and a checkout flow engineered to convert.",
  },
  {
    slug: "pulsar",
    format: "16:9",
    title: "Pulsar",
    client: "Pulsar Labs",
    category: "Technology",
    location: "San Francisco, CA",
    year: "2025",
    services: ["AI Integration", "Design System", "Front-end"],
    summary:
      "An agent-native analytics product rebuilt around how teams actually read data — dashboards that explain themselves before a single filter is touched.",
  },
  {
    slug: "open-archive",
    format: "4:3",
    title: "Open Archive",
    client: "Open Archive",
    category: "Media",
    location: "Austin, TX",
    year: "2024",
    services: ["Website", "Content Architecture", "Brand Identity"],
    summary:
      "A documentation-first archive for digital case studies, structured so a growing library never needs a redesign to stay legible.",
  },
  {
    slug: "silverline-robotics",
    format: "9:16",
    title: "Silverline Robotics",
    client: "Silverline",
    category: "Robotics",
    location: "Seattle, WA",
    year: "2023",
    services: ["Brand Identity", "Website", "Motion"],
    summary:
      "Identity and site for a robotics manufacturer — industrial precision translated into type, grid, and a product configurator that feels just as engineered.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

const AWARD_COPY = /\b(awards?|awwwards|prizes?|winners?)\b/i;

function awardValue(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(awardValue);
  return false;
}

/** Awarded when the record has a real award, prize, or winner flag, or the copy already says so. */
export function projectIsAwarded(project: Project): boolean {
  const record = project as Project & {
    award?: unknown;
    awards?: unknown;
    prize?: unknown;
    prizes?: unknown;
    winner?: unknown;
  };
  if (
    awardValue(record.award) ||
    awardValue(record.awards) ||
    awardValue(record.prize) ||
    awardValue(record.prizes) ||
    awardValue(record.winner)
  ) {
    return true;
  }
  const copy = [
    project.title,
    project.client,
    project.category,
    project.summary,
    ...project.services,
  ].join(" ");
  return AWARD_COPY.test(copy);
}

/** Client country flag, derived from the project location. */
export function countryFlag(location: string) {
  if (/remote/i.test(location)) return "🌐";
  return "🇺🇸";
}
