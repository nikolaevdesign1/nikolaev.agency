import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Terms of use", description: `Terms for using the ${site.name} website.`, path: "/terms" });

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="November 12, 2026"
      intro="These terms cover the use of this website. Client projects are governed by their own written agreement, which takes priority over this page."
      sections={[
        {
          title: "Using the site",
          body: [
            "You can browse, read and share links to the site. Please do not try to break it, overload it, scrape it at scale or use it to send spam.",
          ],
        },
        {
          title: "Our work and content",
          body: [
            "Case studies, texts, images, videos and code on this site belong to nikolaev.agency or to the clients and authors credited next to them. Showing the work here does not give anyone a license to reuse it. Ask us first.",
            "Client names and logos are shown with their permission or as a record of public work.",
          ],
        },
        {
          title: "The chat assistant",
          body: [
            "The chat gives general answers about the studio. It can be wrong and it does not make offers or commitments. Prices, timelines and scope are only agreed in writing with a person from the studio.",
          ],
        },
        {
          title: "Links to other sites",
          body: ["Links to Behance, Awwwards, client sites and others are there for reference. We are not responsible for their content or their privacy practices."],
        },
        {
          title: "No guarantees",
          body: [
            "The site is provided as is. We do our best to keep it accurate and available, but we do not promise that it is free of errors or always online. To the extent the law allows, we are not liable for losses caused by using it.",
          ],
        },
        {
          title: "Law and contact",
          body: [
            `These terms are governed by the laws of the State of California, USA. Questions: ${site.email}.`,
          ],
        },
      ]}
    />
  );
}
