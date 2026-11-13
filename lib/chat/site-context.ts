import "server-only";
import { directions } from "@/lib/data/services";
import { awardGroups } from "@/lib/data/awards";
import { site } from "@/lib/data/site";
import { getProjects } from "@/lib/content/store";
import { awardsOf } from "@/lib/data/projects";
import { getArticles } from "@/lib/notion";

const clip = (text: string | undefined, max: number) => {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).replace(/\s+\S*$/, "")}…` : clean;
};

/** Everything the chat may say, taken from the live site data. */
export async function siteFacts(): Promise<string> {
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);

  const services = directions.map((d) => `- ${d.label}: ${d.description} Typical items: ${d.popular.join(", ")}.`).join("\n");
  const work = projects
    .map((p) => {
      const awards = awardsOf(p).map((a) => [a.source, a.title].filter(Boolean).join(": ")).join("; ");
      return [
        `- ${p.title} (${p.year}, ${p.category}, client ${p.client}, ${p.location}). Page: /projects/${p.slug}`,
        `  Summary: ${p.summary}`,
        `  Services: ${p.services.join(", ")}.${awards ? ` Recognition: ${awards}.` : ""}`,
        p.about ? `  About: ${clip(p.about, 420)}` : "",
        p.problem ? `  Task: ${clip(p.problem, 280)}` : "",
        p.results ? `  Result: ${clip(p.results, 280)}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
  const awards = awardGroups.map((g) => `${g.org}: ${g.entries.map((e) => `${e.count} x ${e.label}`).join(", ")}`).join("; ");
  const media = articles.slice(0, 12).map((a) => `- ${a.title} (/media/${a.slug}, ${a.date})`).join("\n");

  return [
    `Studio: ${site.domain} (${site.legalName}). Run by Oleg Nikolaev. ${site.description} ${site.tagline}`,
    `Established ${site.founded}. Base: ${site.location}. Works with clients worldwide, remotely.`,
    `Contact: email ${site.email}; contact form at /contact (name, email, optional reason, message, optional file). The site says every inquiry gets a reply within two business days.`,
    `Social profiles: ${site.social.map((s) => `${s.label} ${s.href}`).join(", ")}.`,
    `Recognition on the Agency page: ${awards}.`,
    `Services:\n${services}`,
    `Projects:\n${work}`,
    media ? `Articles on /media:\n${media}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}
