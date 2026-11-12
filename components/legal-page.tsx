import Link from "next/link";

export type LegalSection = { title: string; body: string[] };

export const legalLinks = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Cookie policy", href: "/cookies" },
  { label: "Accessibility", href: "/accessibility" },
] as const;

/** Shared layout for the legal pages: title, update date, numbered sections with a contents list. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  children?: React.ReactNode;
}) {
  return (
    <article className="bg-dot-grid relative bg-background gutter pb-24 pt-36 text-foreground md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-[11px] text-muted">
          <Link href="/" className="hover:text-foreground">
            nikolaev.agency
          </Link>{" "}
          / Legal
        </p>
        <h1 className="mt-3 font-serif text-5xl font-medium leading-[1.02] md:text-7xl">{title}</h1>
        <p className="mt-3 font-mono text-[12px] text-muted">Last updated {updated}</p>

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-x-8">
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <p className="font-mono text-[12px] text-muted">Contents</p>
              <ol className="mt-4 flex flex-col gap-2 text-[14px]">
                {sections.map((section, i) => (
                  <li key={section.title}>
                    <a href={`#s${i + 1}`} className="text-muted transition-colors hover:text-foreground">
                      {String(i + 1).padStart(2, "0")} {section.title}
                    </a>
                  </li>
                ))}
              </ol>
              <ul className="mt-8 flex flex-col gap-2 border-t border-border pt-6 font-mono text-[12px]">
                {legalLinks
                  .filter((link) => link.label !== title)
                  .map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-foreground underline-offset-4 hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          <div className="max-w-2xl md:col-span-8">
            <p className="text-lg leading-relaxed text-foreground">{intro}</p>
            {children}
            {sections.map((section, i) => (
              <section key={section.title} id={`s${i + 1}`} className="mt-12 scroll-mt-32">
                <h2 className="font-serif text-3xl font-medium leading-tight">
                  <span className="mr-3 font-mono text-[13px] font-normal text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-[16px] leading-[1.75] text-foreground/85">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
