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
  /** Cover image (local file in /public/projects). */
  cover?: string;
  /** Cover video; takes priority over the image. */
  video?: string;
  /** Behance case study. */
  behance?: string;
  /** Award text shown as a plaque, e.g. "Awarded by Behance UI". */
  award?: string;
  /** Live site, when the project is one. Enables "Visit site". */
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "atelier-40",
    title: "Atelier №40",
    client: "Atelier №40",
    category: "Media",
    location: "Remote",
    year: "2026",
    services: ["Website", "Art Direction"],
    summary: "Fashion digital journal. Design of the site and the reading experience.",
    featured: true,
    cover: "/projects/atelier-40.webp",
    behance: "https://www.behance.net/gallery/243665037/Atelier-40-Fashion-digital-journal",
  },
  {
    slug: "pynai",
    title: "pyn.ai",
    client: "pyn.ai",
    category: "Technology",
    location: "Remote",
    year: "2026",
    services: ["App Design", "UI/UX", "AI Integration"],
    summary: "App design for pyn.ai: interface, flows, and visual system.",
    featured: true,
    cover: "/projects/pynai.webp",
    behance: "https://www.behance.net/gallery/252995061/pynai-App-design",
  },
  {
    slug: "litt",
    title: "LITT",
    client: "LITT",
    category: "E-commerce",
    location: "Remote",
    year: "2026",
    services: ["E-commerce", "UI/UX", "Website"],
    summary: "E-commerce design for LITT: storefront, catalog, and checkout.",
    featured: true,
    cover: "/projects/litt.webp",
    behance: "https://www.behance.net/gallery/254571553/LITT-ecommerce",
  },
  {
    slug: "tud",
    title: "TUD",
    client: "TUD",
    category: "E-commerce",
    location: "Remote",
    year: "2025",
    services: ["E-commerce", "UI/UX", "Website"],
    summary: "E-commerce design for TUD: storefront and purchase flow.",
    featured: true,
    award: "Awarded by Behance UI",
    cover: "/projects/tud.webp",
    behance: "https://www.behance.net/gallery/221900447/TUD-e-commerce-Design",
  },
  {
    slug: "chris-williams-art-gallery",
    title: "Chris Williams Art Gallery",
    client: "Chris Williams",
    category: "Art",
    location: "Remote",
    year: "2026",
    services: ["Website", "UI/UX", "Art Direction"],
    summary: "Website for an art gallery: the collection, the artists, and the visit.",
    featured: true,
    award: "Awarded by Behance UI",
    cover: "/projects/chris-williams.webp",
    behance: "https://www.behance.net/gallery/257145321/Chris-Williams-Art-Gallery",
  },
  {
    slug: "shuttle-pro",
    title: "Shuttle.pro",
    client: "Shuttle.pro",
    category: "Product",
    location: "Remote",
    year: "2025",
    services: ["Mobile App", "UI/UX"],
    summary: "Mobile app design for Shuttle.pro.",
    cover: "/projects/shuttlepro.webp",
    behance: "https://www.behance.net/gallery/221603205/Shuttlepro-Mobile-App-Design",
  },
  {
    slug: "structura",
    title: "Structura",
    client: "Structura",
    category: "Agency",
    location: "Remote",
    year: "2025",
    services: ["Website", "Front-end"],
    summary: "Website for the Structura agency: designed in Figma, built in HTML/CSS, JavaScript, and PHP.",
    cover: "/projects/structura.webp",
    behance: "https://www.behance.net/gallery/220813551/Structura-agency-Website",
  },
  {
    slug: "alnima",
    title: "Alnima",
    client: "Alnima",
    category: "E-commerce",
    location: "Remote",
    year: "2025",
    services: ["E-commerce", "UI/UX"],
    summary: "E-commerce design for Alnima.",
    cover: "/projects/alnima.webp",
    behance: "https://www.behance.net/gallery/220837707/Alnima-E-commerce-Design",
  },
  {
    slug: "alnima-io",
    title: "Alnima.io",
    client: "Alnima.io",
    category: "Product",
    location: "Remote",
    year: "2025",
    services: ["Mobile App", "UI/UX"],
    summary: "Mobile app design for Alnima.io.",
    cover: "/projects/alnimaio.webp",
    behance: "https://www.behance.net/gallery/221627387/Alnimaio-Mobile-app-Design",
  },
  {
    slug: "froki",
    title: "Froki",
    client: "Froki",
    category: "Product",
    location: "Remote",
    year: "2026",
    services: ["UI/UX"],
    summary: "Design for Froki.",
    cover: "/projects/froki.webp",
    behance: "https://www.behance.net/gallery/248712857/Froki",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/** Awarded when the record carries an award text. */
export function projectIsAwarded(project: Project): boolean {
  return Boolean(project.award?.trim());
}

/** Client country flag, derived from the project location. */
export function countryFlag(location: string) {
  if (/remote/i.test(location)) return "🌐";
  return "🇺🇸";
}
