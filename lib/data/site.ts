export const site = {
  name: "Nikolaev",
  legalName: "Nikolaev Design Studio",
  tagline: "A design studio building digital presence for ambitious brands.",
  description:
    "Nikolaev is a Los Angeles design studio working at the intersection of brand, product, and motion.",
  url: "https://nikolaev.agency",
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
