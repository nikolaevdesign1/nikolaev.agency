import type { Metadata } from "next";
import { site } from "@/lib/data/site";
import { MediaIndex } from "@/components/media-index";

export const metadata: Metadata = {
  title: "Media",
  description: `Notes on design, AI, and running a small studio, from ${site.name}.`,
};

export default function MediaPage() {
  return <MediaIndex />;
}
