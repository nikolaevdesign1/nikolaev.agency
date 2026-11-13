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
  /** Where contact-form messages are delivered. */
  inbox: "nikolaev.design1@gmail.com",
  location: "Los Angeles, CA",
  founded: "2021",
  social: [
    { label: "X (Twitter)", href: "https://x.com/oleg_nikolaev1" },
    { label: "Behance", href: "https://www.behance.net/oleg_nikolaev1" },
    { label: "Dribbble", href: "https://dribbble.com/nikolaev_design1" },
    { label: "Threads", href: "https://www.threads.com/@nikolaev_design1" },
    { label: "TikTok", href: "https://www.tiktok.com/@nikolaev_design1" },
    { label: "Awwwards", href: "https://www.awwwards.com/nikolaev_design/" },
  ],
  upcoming: { count: 7, month: "December" },
  cornerSocial: [
    { label: "X (Twitter)", href: "https://x.com/oleg_nikolaev1" },
    { label: "Behance", href: "https://www.behance.net/oleg_nikolaev1" },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;
