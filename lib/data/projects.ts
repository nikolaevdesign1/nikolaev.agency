/** One image or one video. Everywhere a picture can stand, a video can too. */
export type Media = {
  type: "image" | "video";
  src: string;
  /** Still shown before a video plays, and as alt text for images. */
  poster?: string;
  alt?: string;
};

/** Where a block sits on the project page: after About, in the main content (default) or after Results. */
export type BlockPlace = "about" | "content" | "results";

export type ProjectBlock = (
  | { type: "media"; media: Media; caption?: string }
  | { type: "media2"; items: [Media, Media] }
  /** One wide picture on top, two below. */
  | { type: "media3"; items: [Media, Media, Media] }
  /** Two by two. */
  | { type: "media4"; items: [Media, Media, Media, Media] }
  | { type: "text"; label: string; text: string }
  | { type: "credits"; rows: { role: string; name: string }[] }
) & { place?: BlockPlace };

export type ProjectLink = { label: string; url: string };

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
  /** People credited on the project; shown on hover and on the project page. */
  credits?: string[];
  /** Award text shown as a plaque, e.g. "Awarded by Behance UI". */
  award?: string;
  /** Who gave the award: "Behance", "Awwwards" or "CSS Design Awards". Shown on the badge. */
  awardSource?: string;
  /** Live site, when the project is one. Enables "Visit site". */
  url?: string;
  /** Short line under the cover on the project page. */
  coverCaption?: string;
  /** Big statement on the project page. */
  statement?: string;
  /** Full description, the "About" section. Falls back to the summary. */
  about?: string;
  /** The task and its context. */
  problem?: string;
  /** What came out of it: numbers, launches, awards. */
  results?: string;
  /** Links shown at the top of the page: site, Awwwards, Behance… */
  links?: ProjectLink[];
  /** Content of the project page, in order. */
  blocks?: ProjectBlock[];
  /** Where the project sits on the home globe. */
  place?: { city: string; lat: number; lon: number };
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
    featured: true,
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

export const awardSources = ["Behance", "Awwwards", "CSS Design Awards"] as const;

/** Badge label: the chosen source when it is one of ours, else guessed from the award text. */
export function awardSourceOf(project: Pick<Project, "award" | "awardSource">): string {
  const chosen = project.awardSource?.trim();
  if (chosen && (awardSources as readonly string[]).includes(chosen)) return chosen;
  const text = `${chosen ?? ""} ${project.award ?? ""}`.toLowerCase();
  const hit = awardSources.find((name) => text.includes(name.toLowerCase()));
  if (hit) return hit;
  if (/css ?da|cssda/.test(text)) return "CSS Design Awards";
  return "Behance";
}

/** Awarded when the record carries an award text. */
export function projectIsAwarded(project: Project): boolean {
  return Boolean(project.award?.trim());
}

/** Client country flag, derived from the project location. */
export function countryFlag(location: string) {
  if (/remote/i.test(location)) return "🌐";
  return "🇺🇸";
}

/** The project's links; older records keep the site and Behance in their own fields. */
export function linksOf(project: Pick<Project, "links" | "url" | "behance">): ProjectLink[] {
  if (project.links && project.links.length > 0) return project.links.filter((link) => link.url.trim());
  const list: ProjectLink[] = [];
  if (project.url) list.push({ label: "Website", url: project.url });
  if (project.behance) list.push({ label: "Behance", url: project.behance });
  return list;
}
