"use client";

import Image from "next/image";
import { DotField } from "@/components/dot-field";
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

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <footer
      className="bg-dot-grid relative overflow-hidden bg-background text-foreground"
    >
      <DotField />
      <div className="relative gutter pb-16 pt-24 md:pb-20 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <ul className="flex flex-col gap-1.5 font-mono text-[10px] leading-relaxed text-muted lg:col-span-3 lg:pt-4">
            {marginNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <p className="max-w-4xl font-serif text-[2rem] font-normal leading-[1.12] text-foreground sm:text-4xl lg:col-span-9 lg:text-[3.15rem]">
            A digital-first studio.{" "}
            <span className="bg-accent px-[0.12em] text-ink box-decoration-clone">
              No account managers.
            </span>
          </p>
        </div>

        <div className="mt-24 grid gap-10 lg:mt-36 lg:grid-cols-12 lg:items-start lg:gap-8">
          <p className="font-mono text-[10px] text-muted lg:col-span-3">
            Next / a direct note
          </p>
          <p className="max-w-xs font-mono text-[10px] leading-relaxed text-muted lg:col-span-5 lg:pt-6">
            The reply comes from the person doing the work.
          </p>
          <div className="lg:col-span-4 lg:justify-self-end">
            <p className="font-mono text-[10px] text-muted">Contact</p>
            <Image
              src="/avatar.webp"
              alt="Oleg Nikolaev"
              width={40}
              height={40}
              className="mt-3 size-10 rounded-full object-cover"
            />
            <ul className="mt-3 flex flex-col gap-2">
              {site.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-mono text-[10px] text-foreground transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <h2 className="font-serif text-[clamp(3.4rem,8.6vw,8.25rem)] font-normal leading-[0.9] text-foreground">
            <span className="block">Do you have any questions?</span>
            <span className="block">
              <a href={`mailto:${site.email}`} className="relative inline-block">
                {site.email}
                <svg
                  aria-hidden
                  viewBox="0 0 640 18"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -left-[0.5%] top-[0.82em] h-[0.12em] w-[103%]"
                >
                  <path
                    d="M2 11 C 48 6, 96 14, 160 9 S 270 13, 360 8 S 480 14, 560 9 S 610 12, 636 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </span>
          </h2>
        </div>
      </div>
    </footer>
  );
}
