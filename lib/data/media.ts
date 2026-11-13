export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "divider" };

export type SocialMirror = { label: "LinkedIn" | "Twitter" | "Substack"; href: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** Publication day, YYYY-MM-DD. */
  date: string;
  readMinutes: number;
  /** First picture of the article; empty when the article has none. */
  cover: string;
  excerpt: string;
  content: ArticleBlock[];
  socials: SocialMirror[];
};

const newestFirst = (a: Article, b: Article) => b.date.localeCompare(a.date);

export function articleCategories(list: Article[]) {
  return Array.from(new Set(list.map((a) => a.category))).sort();
}

export function latestArticle(list: Article[]): Article | undefined {
  return [...list].sort(newestFirst)[0];
}

export function otherArticles(list: Article[]) {
  const latest = latestArticle(list);
  return list.filter((a) => a.slug !== latest?.slug).sort(newestFirst);
}
