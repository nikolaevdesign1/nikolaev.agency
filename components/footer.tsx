import Link from "next/link";
import { navLinks, site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t-2 border-ink-border bg-ink px-6 py-16 text-ink-foreground md:px-10 md:py-24">
      <div className="flex flex-col gap-16 md:flex-row md:items-end md:justify-between">
        <div>
          <ScrambleText
            as="p"
            text="Let's build something."
            className="max-w-sm text-3xl font-medium leading-[1.1] tracking-tight md:text-5xl"
          />
          <Link
            href={`mailto:${site.email}`}
            className="mt-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink-foreground/70 transition-colors hover:text-accent"
          >
            {site.email}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-10 font-mono text-xs uppercase tracking-wider text-ink-foreground/50 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <span className="text-ink-foreground/30">Sitemap</span>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-foreground/70 transition-colors hover:text-ink-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-ink-foreground/30">Social</span>
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-ink-foreground/70 transition-colors hover:text-ink-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-ink-foreground/30">Studio</span>
            <span className="text-ink-foreground/70">{site.location}</span>
            <span className="text-ink-foreground/70">Est. {site.founded}</span>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-foreground/30 md:flex-row md:items-center md:justify-between">
        <span>
          © {currentYear} {site.legalName}. All rights reserved.
        </span>
        <span>Designed &amp; built in Los Angeles</span>
      </div>
    </footer>
  );
}
