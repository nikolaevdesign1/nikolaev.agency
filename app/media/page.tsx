import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { pageMeta } from "@/lib/seo";
import { MediaIndex } from "@/components/media-index";
import { getArticles } from "@/lib/notion";

export const metadata: Metadata = pageMeta({
  title: "Media",
  description: `Notes on design, AI, and running a small studio, from ${site.name}.`,
  path: "/media",
});

export default async function MediaPage() {
  return <MediaIndex articles={await getArticles()} />;
}
