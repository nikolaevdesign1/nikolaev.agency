import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <section className="grid grid-cols-1 gap-16 px-6 pb-24 pt-36 md:grid-cols-[1fr_1.2fr] md:gap-10 md:px-10 md:pb-32 md:pt-44">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          Contact
        </p>
        <ScrambleText
          as="h1"
          trigger="mount"
          text="Tell us about your project."
          className="mt-6 max-w-sm text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl"
        />
        <p className="mt-8 max-w-sm text-foreground/60">
          Based in {site.location}. We work with teams remotely and in
          person, and typically reply within two business days.
        </p>

        <div className="mt-16 flex flex-col gap-1 font-mono text-sm uppercase tracking-wider">
          <a
            href={`mailto:${site.email}`}
            className="w-fit text-foreground transition-colors hover:text-accent"
          >
            {site.email}
          </a>
          <span className="text-foreground/50">{site.location}</span>
        </div>
      </div>

      <Reveal>
        <ContactForm />
      </Reveal>
    </section>
  );
}
