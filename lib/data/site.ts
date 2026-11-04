export const site = {
  name: "Nikolaev",
  legalName: "Nikolaev Design Studio",
  tagline: "A design studio building digital presence for ambitious brands.",
  description:
    "Nikolaev is a Los Angeles design studio working at the intersection of brand, product, and motion.",
  url: "https://nikolaev.agency",
  email: "hello@nikolaev.agency",
  location: "Los Angeles, CA",
  founded: "2021",
  social: [
    { label: "Instagram", href: "https://instagram.com/nikolaev.design" },
    { label: "LinkedIn", href: "https://linkedin.com/company/nikolaev-design" },
    { label: "X", href: "https://x.com/nikolaevdesign" },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;
