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

/** One award: who gave it, what it is called, and where it can be seen. */
export type ProjectAward = { source: string; title: string; url?: string };

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
  /** Awards, shown as plaques on the project page and as the badge on cards. */
  awards?: ProjectAward[];
  /** Older single-award fields; `awardsOf` reads them when `awards` is empty. */
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
    slug: "atelier-40-fashion-journal",
    title: "Atelier №40",
    client: "Atelier №40",
    category: "Fashion Media",
    location: "Remote",
    year: "2026",
    services: ["Visual Identity", "Logo", "UI/UX", "Prototyping", "Usability Testing"],
    summary: "Visual identity and interface for a digital fashion journal where authors publish their own stories.",
    featured: true,
    cover: "/projects/atelier-40.webp",
    behance: "https://www.behance.net/gallery/243665037/Atelier-40-Fashion-digital-journal",
    credits: ["Identity & UI: Oleg Nikolaev"],
    coverCaption: "The Atelier №40 wordmark on the journal's front page.",
    statement: "A fashion magazine that reads like print and works like a platform.",
    about: "Atelier №40 is an online magazine where authors publish articles about fashion and the fashion industry. Contributors use a paid publishing subscription to share their work and stay close to current trends.\n\nWe designed the magazine's visual identity, including the logo, and built the user interface around it. After the first version we tested the prototype, refined it, and turned it into a clean, practical product that matches the brand's luxury positioning.",
    problem: "The journal needed to serve two audiences at once: readers who come for fashion stories, and authors who pay to publish them.\n\nFor readers it had to feel like a high-end print magazine. For authors it had to be clear and easy to use. The identity and the interface had to carry a luxury tone without getting in the way of reading.",
    results: "Atelier №40 got a complete identity, from the logo to the type system, and an interface that was tested and refined before the final design. The result is a calm, editorial product that looks like a fashion magazine and works like a publishing platform.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/243665037/Atelier-40-Fashion-digital-journal" }],
  },
  {
    slug: "pyn-ai-navigation-app",
    title: "pyn.ai",
    client: "pyn.ai",
    category: "AI / Navigation",
    location: "Remote",
    year: "2026",
    services: ["Mobile App", "UX/UI", "AI Product Design"],
    summary: "An AI agent added to a live navigation app: describe your trip in plain words, get a ready route.",
    featured: true,
    cover: "/projects/pynai.webp",
    behance: "https://www.behance.net/gallery/252995061/pynai-App-design",
    credits: ["Product Design: Oleg Nikolaev"],
    coverCaption: "Route search with free-form input.",
    statement: "Say where you need to go. The route builds itself.",
    about: "pyn.ai is a navigation app that already had users and familiar flows. The client asked us to add an AI agent to it.\n\nWe added free-form voice and text input next to the classic \"from\" and \"to\" fields. A user can say \"home, but first grab burgers, pick up a jacket from the dry cleaner and buy milk\", and the agent builds a route with all the stops. Saved places and trip history give the agent context, so \"home\" means home without extra questions. On the route screen, a short set of suggested categories changes with the time of day, location and history. The onboarding shows that the agent can run on several AI models.",
    problem: "Designing an AI app from scratch is easier than adding AI to a product people already use. Users know where every button is and trust the screens they see every day.\n\nThe new layer had to sit next to the old one, not replace it. Part of the audience is not ready for AI and will keep using the familiar flow, so nobody should have to relearn the app to get the same result.",
    results: "The AI agent became an alternative way into the same result, a ready route the user can check and adjust, while the classic flow stayed untouched. The design reuses data the app already had, so no extra onboarding was needed to collect it.\n\nThe project has been handed off to development.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/252995061/pynai-App-design" }],
  },
  {
    slug: "litt-ecommerce",
    title: "LITT",
    client: "LITT",
    category: "Fashion E-commerce",
    location: "Dubai, UAE",
    year: "2026",
    services: ["E-commerce", "UI/UX", "Web Development"],
    summary: "Luxury fashion store in Dubai, designed and built from scratch as one system with the flagship boutique.",
    featured: true,
    cover: "/projects/litt.webp",
    behance: "https://www.behance.net/gallery/254571553/LITT-ecommerce",
    credits: ["Design: Oleg Nikolaev", "Development: Oleg Nikolaev"],
    coverCaption: "Home page with the summer collection.",
    statement: "Luxury that sells through restraint, not decoration.",
    about: "LITT is a luxury platform in Dubai that connects independent fashion designers with collectors around the world. It has a flagship store, and the online store had to work with it as one system, not as a business card for the boutique.\n\nI designed and developed the store myself, from the first screen to production. The interface feels premium through space, typography and pauses between blocks rather than decoration. The product page does the heavy lifting: material and fit, the exact colour, the model's height, a size chart, and links to stories from the brand's journal. Journal articles lead straight back to the item they talk about.",
    problem: "LITT had no website and no online sales. Both had to be built from zero, on a tight timeline.\n\nLuxury in the Gulf reads differently: restraint, material and calm, not discount banners or sale timers. At the same time the audience is international, so the store had to keep a local luxury feel and still follow e-commerce logic any buyer understands. The scope was cut along the buyer's path: home, catalog, product page, cart, checkout. Everything else moved to a second phase.",
    results: "LITT now has a complete store, designed and built by one person, covering the full path from the home page to checkout. The product page answers the buyer's questions right on the page and connects the catalog with the brand's journal.\n\nThe store has just launched, so it is too early to share numbers.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/254571553/LITT-ecommerce" }],
    place: { city: "Dubai", lat: 25.2, lon: 55.27 },
  },
  {
    slug: "tud-ecommerce",
    title: "TUD",
    client: "TUD",
    category: "E-commerce",
    location: "Remote",
    year: "2025",
    services: ["E-commerce", "UI/UX", "Responsive Design", "Design Handoff"],
    summary: "Online store for TUD, a brand of limited, numbered designer toys made to collect.",
    featured: true,
    awards: [
      { source: "Behance", title: "Featured in Behance UI/UX", url: "https://www.behance.net/galleries/ui-ux" },
    ],
    cover: "/projects/tud.webp",
    behance: "https://www.behance.net/gallery/221900447/TUD-e-commerce-Design",
    credits: ["UX/UI Design: Oleg Nikolaev"],
    coverCaption: "Who is TUD? The brand character opens the store.",
    statement: "A store for toys that people collect, not just buy.",
    about: "TUD makes designer toys for collectors: limited pieces, each one numbered and shipped worldwide with a certificate of authenticity.\n\nWe designed the TUD online store from the ground up. That meant the catalog structure, the main user scenarios, and a responsive interface for every screen size. The UI leans on strong typography and bold accents taken from the brand's character, so the store feels as playful and collectible as the toys. Final layouts were prepared for development with room for the catalog to grow.",
    problem: "A collectible is not a regular product. People buy it for the character, the series and the rarity, and they need to trust that what they get is authentic.\n\nTUD needed a store that shows each piece as an object worth owning, makes series and collaborations easy to explore, and keeps the path to purchase simple on any device.",
    results: "TUD got a complete e-commerce design: catalog logic, product and collection pages, and a responsive UI with a clear visual identity. The layouts were handed off ready for development and built to scale as new series are added.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/221900447/TUD-e-commerce-Design" }, { label: "Website", url: "https://tudtoy.com" }],
  },
  {
    slug: "chris-williams-art-gallery",
    title: "Chris Williams Art Gallery",
    client: "Chris Williams",
    category: "Art",
    location: "Remote",
    year: "2026",
    services: ["Website", "UI/UX", "Art Direction", "Interaction Design"],
    summary: "Website for a contemporary painting gallery in East London: the collection, the artists, and the visit.",
    featured: true,
    awards: [
      { source: "Behance", title: "Featured in Behance UI/UX", url: "https://www.behance.net/galleries/ui-ux" },
      { source: "Awwwards", title: "Awwwards Nominee", url: "https://www.awwwards.com/sites/chris-williams-art-gallery" },
    ],
    cover: "/projects/chris-williams.webp",
    behance: "https://www.behance.net/gallery/257145321/Chris-Williams-Art-Gallery",
    credits: ["Design: Oleg Nikolaev", "Art Direction: Oleg Nikolaev"],
    coverCaption: "The home page: an infinite field of paintings.",
    statement: "Paintings shown at true scale, in real rooms, in an endless field you can wander through.",
    about: "Chris Williams Art Gallery shows contemporary painting in Bethnal Green, East London. The new website is built around the paintings themselves.\n\nThe home page is an infinite field of works you can drag in any direction. Every painting can be seen at true scale inside a real room, so a visitor understands its size before coming to the gallery. A text index with cursor previews gives a fast way through the collection, and ripple transitions and scramble text reveals connect the pages without getting in the way of the art.",
    problem: "A gallery website usually turns paintings into small thumbnails on a grid. Size, texture and presence get lost, and the site looks like any online shop.\n\nThe task was to give the gallery a site that feels like walking through the space: easy to browse, quiet in tone, and honest about how each work looks on a wall. It also had to cover the practical side: artists, exhibitions, and how to visit.",
    results: "The site gives the gallery one place for the collection, the artists and the visit, with the paintings shown the way they are seen in person.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/257145321/Chris-Williams-Art-Gallery" }, { label: "Website", url: "https://www.chriswilliamsart.com" }, { label: "Awwwards", url: "https://www.awwwards.com/sites/chris-williams-art-gallery" }],
    place: { city: "London", lat: 51.51, lon: -0.13 },
  },
  {
    slug: "shuttle-pro-car-wash-app",
    title: "Shuttle.pro",
    client: "Shuttle.pro",
    category: "Automotive Services",
    location: "Remote",
    year: "2025",
    services: ["Mobile App", "UX/UI"],
    summary: "Mobile app for car washes: find a wash, pick a service, book a time.",
    featured: true,
    cover: "/projects/shuttlepro.webp",
    behance: "https://www.behance.net/gallery/221603205/Shuttlepro-Mobile-App-Design",
    credits: ["UX/UI Design: Oleg Nikolaev"],
    coverCaption: "Welcome screen of the Shuttle.pro app.",
    statement: "Car wash for your car, a few taps away.",
    about: "Shuttle.pro is a mobile app for car washes. It lets drivers take care of their car from the phone instead of calling or waiting in line.\n\nWe designed the app's UX and UI, from the welcome screens to the booking flow, with a monochrome, technical visual style that fits the automotive world.",
    problem: "Booking a car wash is still often a phone call or a queue. The app had to turn that into a few clear taps: choose a place, choose a service, choose a time.\n\nThe interface needed to be fast to use on the go and look premium enough for people who care about their cars.",
    results: "Shuttle.pro got a complete mobile app design with a short, clear booking flow and a distinct visual identity.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/221603205/Shuttlepro-Mobile-App-Design" }],
  },
  {
    slug: "structura-family-website",
    title: "Structura",
    client: "Structura",
    category: "Events / Corporate",
    location: "Remote",
    year: "2025",
    services: ["Website", "UI/UX", "Motion"],
    summary: "One website for the Structura family: agency, production, art, design and digital under one roof.",
    cover: "/projects/structura.webp",
    behance: "https://www.behance.net/gallery/221183991/Structura-family-Web-design",
    credits: ["Web Design: Oleg Nikolaev"],
    coverCaption: "The Structura family home page with its divisions.",
    statement: "Five companies, one structure.",
    about: "Structura is a group of companies built around large-scale events. Its divisions, Structura agency, production, art, design and digital, each have their own work and clients.\n\nWe designed the website for the Structura family as a whole: a single entry point that explains what the group does and leads visitors to the right division. A strict grid, a bold red and black palette and animated transitions give the group one recognisable voice while keeping every division easy to find.",
    problem: "When a company grows into several divisions, clients stop understanding who does what. Separate sites for each part make the group look scattered.\n\nStructura needed one site that presents the family as a single, strong brand and still gives each division its own space.",
    results: "The group got a clear umbrella website: one visual system, one navigation logic, and a direct path from the main page to each of the divisions.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/221183991/Structura-family-Web-design" }],
  },
  {
    slug: "alnima-ecommerce",
    title: "Alnima",
    client: "Alnima",
    category: "E-commerce / Marketplace",
    location: "Remote",
    year: "2025",
    services: ["E-commerce", "Website", "UX/UI"],
    summary: "Marketplace website for Alnima: a clear catalog, strong visuals and a simple path to checkout.",
    cover: "/projects/alnima.webp",
    behance: "https://www.behance.net/gallery/220837707/Alnima-E-commerce-Design",
    credits: ["UX/UI Design: Oleg Nikolaev"],
    coverCaption: "Alnima: e-commerce, design, marketplace.",
    statement: "A marketplace that stays clear, no matter how big the catalog gets.",
    about: "Alnima is an online marketplace. We designed its website: the home page, catalog, product pages and the path to checkout.\n\nThe design puts lifestyle photography and products first, with a clean layout and clear navigation so a large range stays easy to browse. The Alnima mobile app uses the same visual language.",
    problem: "A marketplace has to hold a lot of products without turning into noise. Visitors should understand the range quickly, find what they need and trust the store enough to buy.\n\nAlnima needed a website with a recognisable look and a catalog structure that scales as the range grows.",
    results: "Alnima got a complete e-commerce website design with a scalable catalog and a consistent visual system shared with the brand's mobile app.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/220837707/Alnima-E-commerce-Design" }],
  },
  {
    slug: "alnima-mobile-app",
    title: "Alnima.io",
    client: "Alnima",
    category: "E-commerce / Marketplace",
    location: "Remote",
    year: "2025",
    services: ["Mobile App", "UX/UI"],
    summary: "Mobile app for the Alnima marketplace: browse, choose and buy from your phone.",
    cover: "/projects/alnimaio.webp",
    behance: "https://www.behance.net/gallery/221627387/Alnimaio-Mobile-app-Design",
    credits: ["UX/UI Design: Oleg Nikolaev"],
    coverCaption: "Product page and app components.",
    statement: "The whole marketplace, made for one hand.",
    about: "Alnima is an online marketplace. Alongside the web store, the brand needed a mobile app that keeps the same look and makes shopping on the phone just as easy.\n\nWe designed the app's UX and UI: browsing and product pages, the path to purchase, and a set of reusable components that keep the app consistent with the Alnima website.",
    problem: "Most marketplace traffic now comes from phones, and a shrunk-down website is not enough there.\n\nThe app had to make browsing a large catalog comfortable on a small screen, keep product information clear, and stay visually connected to the Alnima brand and website.",
    results: "Alnima got a complete mobile app design that continues the website's visual language and covers the core shopping flow, from browsing to checkout.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/221627387/Alnimaio-Mobile-app-Design" }],
  },
  {
    slug: "froki-brand-identity",
    title: "Froki",
    client: "Froki",
    category: "Food / Branding",
    location: "Remote",
    year: "2026",
    services: ["Brand Identity", "Logo", "Visual System"],
    summary: "Brand identity for an ice cream brand, made to stand out on a crowded shelf.",
    cover: "/projects/froki.webp",
    behance: "https://www.behance.net/gallery/248712857/Froki",
    credits: ["Brand Identity: Oleg Nikolaev"],
    coverCaption: "The Froki character.",
    statement: "An ice cream brand you notice before you read the name.",
    about: "Froki is an ice cream brand that came to us with no existing identity.\n\nWe built its visual language from scratch: logo, colour, shapes and a friendly character. Every decision was checked against one question: will this help the product stand out on the shelf, make the choice easier and make people smile at first sight? The result is a cohesive system where colour, form and character work together and give the brand a friendly, modern face.",
    problem: "Ice cream is sold in a freezer full of competitors, and the buyer decides in seconds. A new brand without any identity has no chance there.\n\nFroki needed a recognisable presence in retail: something that catches the eye, is easy to remember and feels warm and fun.",
    results: "Froki got a complete visual identity built for retail: a memorable character, a bold colour system and a consistent language ready to use on packaging and beyond.",
    links: [{ label: "Behance", url: "https://www.behance.net/gallery/248712857/Froki" }],
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

/** The project's awards, including the older single award text. */
export function awardsOf(project: Pick<Project, "awards" | "award" | "awardSource">): ProjectAward[] {
  const list = (project.awards ?? []).filter((a) => a.title.trim() || a.source.trim());
  if (list.length > 0) return list;
  if (project.award?.trim()) return [{ source: awardSourceOf(project), title: project.award.trim() }];
  return [];
}

/** Awarded when the record carries at least one award. */
export function projectIsAwarded(project: Pick<Project, "awards" | "award" | "awardSource">): boolean {
  return awardsOf(project).length > 0;
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
