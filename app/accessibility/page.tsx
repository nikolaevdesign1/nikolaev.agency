import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Accessibility", description: `Accessibility statement for ${site.name}.`, path: "/accessibility" });

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      updated="November 12, 2026"
      intro="We want everyone to be able to read about our work and reach us. We aim for WCAG 2.2 level AA and keep fixing what falls short."
      sections={[
        {
          title: "What we do",
          body: [
            "Text alternatives for images, readable contrast for body text, keyboard access to navigation, forms and the chat, and visible focus states.",
            "If your system asks for reduced motion, the scrolling effects, text animations and loaders are turned off.",
            "Sound is off until you switch it on.",
          ],
        },
        {
          title: "Known gaps",
          body: [
            "Some decorative animations and the interactive globe and project field are hard to use without a mouse. Every project they show is also available as a plain list on the Work page.",
            "Some older case-study images contain text that is not yet described in full.",
          ],
        },
        {
          title: "Tell us",
          body: [
            `If something on the site does not work for you, write to ${site.email} with the page and what happened. We reply within two business days and will send the information in another format if you need it.`,
          ],
        },
      ]}
    />
  );
}
