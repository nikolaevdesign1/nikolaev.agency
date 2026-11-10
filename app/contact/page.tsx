import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { ContactForm } from "@/components/contact-form";
import { CoordinateTracker } from "@/components/coordinate-tracker";
import { ScrambleText } from "@/components/scramble-text";
import { DotField } from "@/components/dot-field";
import { TerminalNotes } from "@/components/terminal-notes";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

const studioNotes = [
  "--STUDIO:",
  "  :--STATUS:",
  "        :ACCEPTING PROJECTS",
  "  :--PRINCIPLES:",
  "        :--DIRECT ACCESS",
  "        :--NO ACCOUNT MANAGERS",
  "        :--SMALL BY DESIGN",
];

const replyNotes = [
  "RPL-LOG           --INDEX:",
  "RPL-001             :--READ WITHIN A DAY",
  "RPL-002             :--REPLY FROM THE STUDIO",
  "RPL-003             :--NO FORM EVER IGNORED",
];

export default function ContactPage() {
  return (
    <section className="bg-dot-grid relative flex min-h-screen flex-col justify-center overflow-hidden bg-background gutter pb-10 pt-36 md:pb-10 md:pt-40">
      <DotField />
      <TerminalNotes
        lines={studioNotes}
        className="pointer-events-none absolute bottom-4 left-[var(--gutter)] hidden select-none font-mono text-[11px] leading-[1.5] text-foreground/35 md:left-10 [@media(min-height:980px)]:lg:block"
      />
      <TerminalNotes
        lines={replyNotes}
        className="pointer-events-none absolute bottom-12 right-[var(--gutter)] hidden select-none text-right font-mono text-[11px] leading-[1.5] text-foreground/35 md:right-10 [@media(min-height:980px)]:lg:block"
      />
      <CoordinateTracker className="pointer-events-none absolute right-[var(--gutter)] top-28 hidden font-mono text-[11px] text-foreground/30 md:block" />
      <p className="relative font-mono text-[11px] text-muted">
        Contact / New conversation
      </p>
      <h1 className="relative mt-4 max-w-4xl font-serif text-4xl font-medium leading-[1.05] text-foreground md:text-5xl">
        <ScrambleText as="span" trigger="mount" delay={300} text="What do you have in mind?" />
      </h1>
      <p className="relative mt-4 max-w-xl font-mono text-[11px] leading-relaxed text-muted">
        A new product, a design challenge, or a possible collaboration.
        <br />
        Tell me a little about it.
      </p>

      <div className="relative mt-6 max-w-7xl">
        <ContactForm />
      </div>
    </section>
  );
}
