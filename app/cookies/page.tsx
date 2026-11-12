import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { CookieReset } from "@/components/cookie-notice";
import { site } from "@/lib/data/site";

export const metadata: Metadata = { title: "Cookie policy", description: `What ${site.name} stores in your browser.` };

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie policy"
      updated="November 12, 2026"
      intro="This site does not use advertising or tracking cookies. It keeps a few small settings in your browser so the site remembers your choices. Here is the full list."
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
          title: "Why",
          body: ["Each item is needed for a feature you use: without it the site would forget your settings on every visit. None of them is shared with anyone."],
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
