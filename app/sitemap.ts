import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { articles } from "@/lib/data/media";
import { getProjects } from "@/lib/content/store";

const pages = ["", "/about", "/projects", "/contact", "/media", "/privacy", "/terms", "/cookies", "/accessibility"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    ...pages.map((route) => ({ url: `${site.url}${route}` })),
    ...projects.map((project) => ({ url: `${site.url}/projects/${project.slug}` })),
    // Only articles carry a real date; pages and projects have none worth reporting.
    ...articles.map((article) => ({ url: `${site.url}/media/${article.slug}`, lastModified: new Date(article.date) })),
  ];
}
