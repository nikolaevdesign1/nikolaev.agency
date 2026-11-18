import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { pageMeta } from "@/lib/seo";
import { MediaIndex } from "@/components/media-index";
import { notFound } from "next/navigation";
import { getArticles } from "@/lib/notion";

export const metadata: Metadata = pageMeta({
  title: "Media",
  description: `Notes on design, AI, and running a small studio, from ${site.name}.`,
  path: "/media",
});

export default async function MediaPage() {
  if (!site.features.media) notFound();
  return <MediaIndex articles={await getArticles()} />;
}
