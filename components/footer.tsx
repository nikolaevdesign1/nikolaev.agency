"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/data/site";

const marginNotes = [
  "— Studio",
  "— Digital first",
  `— ${site.location}`,
  ":: Direct access",
  ":: No managers",
  `:: Est. ${site.founded}`,
];

const contactLinks = [
  { label: site.email, href: `mailto:${site.email}` },
  ...site.social,
];

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <footer
      className="relative bg-background text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(rgba(35, 35, 35, 0.22) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="relative px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <ul className="flex flex-col gap-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted lg:col-span-3 lg:pt-4">
            {marginNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <p className="max-w-4xl font-serif text-[2rem] font-normal leading-[1.12] tracking-[-0.02em] text-foreground sm:text-4xl lg:col-span-9 lg:text-[3.15rem]">
            A small digital-first studio — your note reaches the person
            making the work, with direct
            access and{" "}
            <span className="bg-accent px-[0.12em] text-ink box-decoration-clone">
              no account managers.
            </span>
          </p>
        </div>

        <div className="mt-24 grid gap-10 lg:mt-36 lg:grid-cols-12 lg:items-start lg:gap-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted lg:col-span-3">
            Next / a direct note
          </p>
          <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted lg:col-span-5 lg:pt-6">
            The reply comes from the person doing the work.
          </p>
          <div className="lg:col-span-4 lg:justify-self-end">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Contact
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <span aria-hidden>→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <h2 className="font-serif text-[clamp(3.4rem,8.6vw,8.25rem)] font-normal leading-[0.86] tracking-[-0.035em] text-foreground">
            <span className="block">Who should read</span>
            <span className="block">
              <span className="relative inline-block">
                the next brief
                <svg
                  aria-hidden
                  viewBox="0 0 640 18"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -left-[0.5%] top-[0.78em] h-[0.16em] w-[103%]"
                >
                  <path
                    d="M2 11 C 48 6, 96 14, 160 9 S 270 13, 360 8 S 480 14, 560 9 S 610 12, 636 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              ?
            </span>
          </h2>
        </div>
      </div>
    </footer>
  );
}
