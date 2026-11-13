import type { Metadata } from "next";
import { site } from "@/lib/data/site";

/** Default share image, 1200×630. */
export const shareImage = { url: "/og.png", width: 1200, height: 630, alt: site.title };

type PageMeta = {
  /** Page name; the root layout appends the site name. Omit on the home page. */
  title?: string;
  description?: string;
  /** Path from the site root, e.g. "/about". */
  path: string;
  /** Share image path or absolute URL; defaults to the site cover. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Absolute URL on the canonical host. */
export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}

/**
 * Title, description, canonical link and share tags for one page.
 * Share tags are spelled out per page because a page-level `openGraph` replaces the layout's.
 */
export function pageMeta({ title, description = site.description, path, image, type = "website", publishedTime }: PageMeta): Metadata {
  const shareTitle = title ? `${title} | ${site.domain}` : site.title;
  const images = [image ? { url: image } : shareImage];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: site.domain,
      locale: "en_US",
      type,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images },
  };
}
