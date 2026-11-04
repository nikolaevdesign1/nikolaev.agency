export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  services: string[];
  summary: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "silo-dallas",
    title: "Silo Dallas",
    client: "Silo",
    category: "Hospitality",
    year: "2025",
    services: ["Website", "Art Direction", "Motion"],
    summary:
      "A nightlife venue brand and responsive site built around event energy — bold type, high-contrast imagery, and a ticketing flow that never gets in the way.",
    featured: true,
  },
  {
    slug: "meridian-capital",
    title: "Meridian Capital",
    client: "Meridian",
    category: "Finance",
    year: "2025",
    services: ["Brand Identity", "Website", "Design System"],
    summary:
      "A quiet, confident identity for a private investment firm — restrained type, long-form data tables, and a site built to earn trust in seconds.",
    featured: true,
  },
  {
    slug: "fieldnote",
    title: "Fieldnote",
    client: "Fieldnote Labs",
    category: "Product",
    year: "2024",
    services: ["Product UI", "Design System", "Front-end"],
    summary:
      "An agent-native workflow tool for field teams. We designed and built the full product surface, from onboarding to the dashboards teams live in daily.",
    featured: true,
  },
  {
    slug: "atlas-running",
    title: "Atlas Running Club",
    client: "Atlas",
    category: "Apparel",
    year: "2024",
    services: ["Brand Identity", "Packaging", "Website"],
    summary:
      "Identity and e-commerce build for an LA-born running club turned apparel label — built to move at the pace of its community.",
  },
  {
    slug: "harbor-health",
    title: "Harbor Health",
    client: "Harbor",
    category: "Healthcare",
    year: "2023",
    services: ["Website", "Content System"],
    summary:
      "A content-heavy marketing site for a healthcare network, rebuilt for clarity, speed, and a CMS their team actually wants to use.",
  },
  {
    slug: "northline",
    title: "Northline",
    client: "Northline Goods",
    category: "E-commerce",
    year: "2023",
    services: ["Website", "Art Direction"],
    summary:
      "A direct-to-consumer storefront built around product photography and a checkout flow engineered to convert.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
