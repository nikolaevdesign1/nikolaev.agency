import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { CookieReset } from "@/components/cookie-notice";
import { site } from "@/lib/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Cookie policy", description: `What ${site.name} stores in your browser.`, path: "/cookies" });

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie policy"
      updated="November 13, 2026"
      intro="This site does not use advertising cookies. It keeps a few small settings in your browser so the site remembers your choices, and it measures visits with Google Analytics. Here is the full list."
      sections={[
        {
          title: "What is stored",
          body: [
            "cookie-choice: whether you accepted or declined the cookie notice.",
            "studio-sound: whether sound is on or off.",
            "studio-projects-theme: light or dark on the projects page and project pages.",
            "studio-chats and studio-chat-sidebar: your chat history on this device and whether the chat list is open.",
            "An admin session cookie exists only for the site owner when signed in to edit content. Visitors never get it.",
          ],
        },
        {
          title: "Analytics",
          body: [
            "We use Google Analytics 4 to see which pages are visited and where visitors come from.",
            "If you press Accept, Google Analytics sets the cookies _ga and _ga_PBNJNW5B7B to tell one visit from another. They last up to two years.",
            "If you press Decline or make no choice, no analytics cookies are set. Google Analytics still receives anonymous page-view signals without an identifier.",
            "Advertising features are switched off in both cases.",
          ],
        },
        {
          title: "Why",
          body: ["Each item is needed for a feature you use: without it the site would forget your settings on every visit. The settings listed under \"What is stored\" are not shared with anyone."],
        },
        {
          title: "How to remove them",
          body: [
            "Clear the site data for nikolaev.agency in your browser settings, or use the button above to reset your cookie choice. Clearing the data also removes your chat history on this device.",
          ],
        },
      ]}
    >
      <div className="mt-6">
        <CookieReset />
      </div>
    </LegalPage>
  );
}
