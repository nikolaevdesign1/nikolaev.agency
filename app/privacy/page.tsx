import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/data/site";

export const metadata: Metadata = { title: "Privacy policy", description: `How ${site.name} handles personal data.` };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="November 12, 2026"
      intro={`This page explains what nikolaev.agency collects when you use this site, why, and what you can ask us to do with it. The site is run by Oleg Nikolaev, ${site.location}. Questions go to ${site.email}.`}
      sections={[
        {
          title: "What we collect",
          body: [
            "Contact form: your name, email, the reason you picked and your message.",
            "Chat and brief: the messages you type in the chat on this site, and the answers you give in a brief (company, goal, timeline, budget range, contact details). Names of files you attach are shown in the chat; we do not store the files.",
            "Subscription: the email you leave for new notes or upcoming projects.",
            "Technical data: our host, Vercel, keeps standard server logs (IP address, browser, pages requested, time) to run and protect the site.",
          ],
        },
        {
          title: "Why we use it",
          body: [
            "To answer you, prepare a proposal and run the project you asked about.",
            "To send the emails you subscribed to. Every email has an unsubscribe link.",
            "To keep the site working and secure.",
            "We do not use your data for advertising and we do not build profiles of visitors.",
          ],
        },
        {
          title: "What stays in your browser",
          body: [
            "Your chat history, the sound setting, the light or dark choice on the projects page and your cookie choice are saved in your own browser (local storage). They never leave your device unless you send a message. The Cookie policy lists each one.",
          ],
        },
        {
          title: "Who else sees it",
          body: [
            "Vercel hosts the site and processes requests on our behalf. If we connect an email service to deliver form messages and newsletters, it will be named here before it is used.",
            "We do not sell or share personal information for money or for cross-context advertising, as those terms are used in California law.",
          ],
        },
        {
          title: "How long we keep it",
          body: [
            "Inquiries and briefs: as long as the conversation or project lasts, then up to three years for our records. Subscription emails: until you unsubscribe. Server logs: as long as Vercel keeps them, usually days to weeks.",
          ],
        },
        {
          title: "Your rights",
          body: [
            `You can ask what we hold about you, ask us to correct it, delete it or hand it to you in a usable format, and object to its use. Write to ${site.email}; we answer within 30 days.`,
            "California residents: you have the rights to know, delete, correct and opt out of sale or sharing under the CCPA/CPRA. We do not sell or share, and we will not treat you differently for using any of these rights.",
            "EU and UK residents: our legal bases are your request (to reply and work with you), your consent (newsletters) and our legitimate interest (security). You can complain to your local data protection authority.",
          ],
        },
        {
          title: "Children",
          body: ["This site is meant for businesses and is not aimed at children under 16. We do not knowingly collect their data."],
        },
        {
          title: "Changes",
          body: ["If this policy changes, the date at the top changes too. Big changes will be pointed out on the site."],
        },
      ]}
    />
  );
}
