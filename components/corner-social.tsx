import { site } from "@/lib/data/site";

export function CornerSocial() {
  return (
    <nav
      aria-label="Social"
      className="pointer-events-none fixed bottom-4 right-[var(--gutter)] z-[45] hidden gap-5 font-mono text-[11px] mix-blend-difference md:flex"
    >
      {site.cornerSocial.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="pointer-events-auto text-white transition-opacity hover:opacity-60"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
