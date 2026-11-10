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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute left-[var(--gutter)] top-5 font-mono text-sm leading-none text-foreground/25">+</span>
        <span className="absolute right-[var(--gutter)] top-5 font-mono text-sm leading-none text-foreground/25">+</span>
        <div className="absolute inset-x-[var(--gutter)] top-5 flex justify-between font-mono text-[10px] text-foreground/25">
          <span className="ml-6">end of page</span>
          <span className="mr-6">{site.location}</span>
        </div>
        <div className="absolute inset-x-[var(--gutter)] bottom-4 h-2 bg-[repeating-linear-gradient(90deg,rgba(35,35,35,0.18)_0_1px,transparent_1px_24px)]" />
      </div>
      <div className="relative gutter pb-14 pt-14 md:pb-16 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <ul className="flex flex-col gap-1.5 font-mono text-[10px] leading-relaxed text-muted lg:col-span-3 lg:pt-2">
            {marginNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <div className="lg:col-span-6">
            <p className="max-w-3xl font-serif text-[1.9rem] font-normal leading-[1.12] text-foreground sm:text-4xl lg:text-[2.6rem]">
              A digital-first studio.{" "}
              <span className="bg-accent px-[0.12em] text-ink box-decoration-clone">
                No account managers.
              </span>
            </p>
            <p className="mt-5 font-mono text-[10px] leading-relaxed text-muted">
              Next / a direct note. The reply comes from the person doing the work.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] text-muted">Social Media</p>
            <div className="mt-3 flex items-center gap-3">
              <Image
                src="/avatar.webp"
                alt="Oleg Nikolaev"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <p className="font-mono text-[11px] text-foreground">Oleg Nikolaev</p>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
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

        <div className="mt-10 lg:mt-12">
          <h2 className="font-serif text-[clamp(2.2rem,5.2vw,5rem)] font-normal leading-[0.9] text-foreground">
            <span className="block">Do you have any questions?</span>
            <span className="block">
              <a href={`mailto:${site.email}`} className="relative inline-block transition-colors duration-300 hover:text-accent">
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
