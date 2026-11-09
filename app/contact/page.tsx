import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-background px-6 py-24 md:px-10 md:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Contact / New conversation
      </p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-6xl">
        What do you have in mind?
      </h1>
      <p className="mt-4 max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-muted">
        A new product, a design challenge, or a possible collaboration.
        <br />
        Tell me a little about it.
      </p>

      <div className="mt-8 max-w-5xl">
        <ContactForm />
      </div>
    </section>
  );
}
