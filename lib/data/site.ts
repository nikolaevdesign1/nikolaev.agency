export const site = {
  name: "Nikolaev",
  domain: "nikolaev.agency",
  /** Browser title of the home page and the default share title. */
  title: "nikolaev.agency | Premium design agency",
  legalName: "Nikolaev Design Studio",
  tagline: "A design studio building digital presence for ambitious brands.",
  description:
    "nikolaev.agency is a premium design agency working at the intersection of brand, product, and motion.",
  /** Canonical host: the bare domain redirects here. */
  url: "https://www.nikolaev.agency",
  /** Google Analytics 4 measurement ID (public). */
  analyticsId: "G-PBNJNW5B7B",
  email: "info@nikolaev.agency",
  location: "Los Angeles, CA",
  founded: "2021",
  social: [
    { label: "X (Twitter)", href: "#" },
    { label: "Behance", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "Threads", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "Awwwards", href: "#" },
  ],
  upcoming: { count: 7, month: "December" },
  cornerSocial: [
    { label: "Instagram", href: "#" },
    { label: "X (Twitter)", href: "#" },
    { label: "Behance", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;
