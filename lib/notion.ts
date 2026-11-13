import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { site } from "@/lib/data/site";
import type { Article, ArticleBlock } from "@/lib/data/media";

const API = "https://api.notion.com/v1";

type RichText = { plain_text: string; href: string | null; annotations: { bold: boolean; italic: boolean } };
type Block = {
  id: string;
  type: string;
  has_children: boolean;
  created_time: string;
  child_page?: { title: string };
  link_to_page?: { type: string; page_id?: string };
  [key: string]: unknown;
};

async function notion<T>(path: string, attempt = 0): Promise<T> {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN is not set.");
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28" },
  });
  if (res.status === 429 && attempt < 4) {
    const wait = Number(res.headers.get("retry-after") ?? "1");
    await new Promise((resolve) => setTimeout(resolve, Math.min(10, Math.max(1, wait)) * 1000));
    return notion<T>(path, attempt + 1);
  }
  if (!res.ok) throw new Error(`Notion ${res.status} on ${path}`);
  return (await res.json()) as T;
}

async function children(id: string): Promise<Block[]> {
  const out: Block[] = [];
  let cursor: string | undefined;
  do {
    const page = await notion<{ results: Block[]; has_more: boolean; next_cursor: string | null }>(
      `/blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`,
    );
    out.push(...page.results);
    cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return out;
}

/** Notion text with its bold, italic and links, in the small markup RichText understands. */
function inline(parts: RichText[] | undefined) {
  return (parts ?? [])
    .map((part) => {
      const text = part.plain_text.replace(/\*/g, "");
      if (!text.trim()) return text;
      if (part.href && /^https?:\/\//.test(part.href)) return `[${text.replace(/[\]\[]/g, "")}](${part.href})`;
      if (part.annotations.bold) return `**${text}**`;
      if (part.annotations.italic) return `*${text}*`;
      return text;
    })
    .join("");
}

const plain = (parts: RichText[] | undefined) => (parts ?? []).map((part) => part.plain_text).join("").trim();

function textOf(block: Block): RichText[] | undefined {
  const data = block[block.type] as { rich_text?: RichText[] } | undefined;
  return data?.rich_text;
}

/** Pages that hang under the articles page: sub-pages and page links, also inside toggles and columns. */
async function articlePages(parent: string, depth = 0): Promise<{ id: string; title: string; created: string }[]> {
  const found: { id: string; title: string; created: string }[] = [];
  for (const block of await children(parent)) {
    if (block.type === "child_page" && block.child_page) {
      found.push({ id: block.id, title: block.child_page.title, created: block.created_time });
    } else if (block.type === "link_to_page" && block.link_to_page?.page_id) {
      const page = await notion<{ created_time: string; properties: Record<string, { type: string; title?: RichText[] }> }>(
        `/pages/${block.link_to_page.page_id}`,
      );
      const title = Object.values(page.properties).find((p) => p.type === "title")?.title;
      found.push({ id: block.link_to_page.page_id, title: plain(title), created: page.created_time });
    } else if (block.has_children && depth < 3 && ["toggle", "column_list", "column", "heading_1", "heading_2", "heading_3"].includes(block.type)) {
      found.push(...(await articlePages(block.id, depth + 1)));
    }
  }
  return found;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");

/** "16.11 How to hire…" -> day 16, month 11, title without the date. */
function splitTitle(raw: string, created: string) {
  const match = raw.trim().match(/^(\d{1,2})\.(\d{1,2})\s+(.+)$/);
  const made = new Date(created);
  if (!match) return { title: raw.trim(), date: made.toISOString().slice(0, 10) };
  const day = Number(match[1]);
  const month = Number(match[2]);
  let year = made.getUTCFullYear();
  if (month < made.getUTCMonth() + 1 - 6) year += 1;
  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { title: match[3].trim(), date };
}

function categoryOf(title: string) {
  const t = title.toLowerCase();
  if (/\b(cost|price|pricing|quote|proposals?)\b/.test(t)) return "Pricing";
  if (/\bai\b/.test(t)) return "AI";
  if (/\b(hire|hiring|freelanc\w*|in-house|designer|white-label|subscription|retainer|agenc\w*)\b/.test(t)) return "Hiring";
  if (/\b(landing|website|redesign|framer|webflow|site)\b/.test(t)) return "Websites";
  if (/\b(mvp|prototype|ux|onboarding|saas|product|design systems?)\b/.test(t)) return "Product";
  return "Design";
}

/** Copies a Notion-hosted picture into the project's blob store: Notion links stop working after an hour. */
async function stableImage(blockId: string, url: string, external: boolean) {
  if (external || !process.env.BLOB_READ_WRITE_TOKEN) return url;
  try {
    const { list, put } = await import("@vercel/blob");
    const res = await fetch(url);
    if (!res.ok) return url;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("gif") ? "gif" : type.includes("svg") ? "svg" : "jpg";
    const path = `notion/${blockId}.${ext}`;
    const { blobs } = await list({ prefix: path, limit: 1 });
    const hit = blobs.find((blob) => blob.pathname === path);
    if (hit) return hit.url;
    const stored = await put(path, await res.arrayBuffer(), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: type,
      cacheControlMaxAge: 31536000,
    });
    return stored.url;
  } catch (error) {
    console.error("Could not copy a Notion picture", error);
    return url;
  }
}

async function toBlocks(blocks: Block[]): Promise<ArticleBlock[]> {
  const out: ArticleBlock[] = [];
  for (const block of blocks) {
    const rich = textOf(block);
    switch (block.type) {
      case "paragraph":
      case "toggle": {
        const text = inline(rich).trim();
        if (text) out.push({ type: "p", text });
        break;
      }
      case "heading_1":
      case "heading_2":
        if (plain(rich)) out.push({ type: "h2", text: plain(rich) });
        break;
      case "heading_3":
        if (plain(rich)) out.push({ type: "h3", text: plain(rich) });
        break;
      case "bulleted_list_item":
      case "numbered_list_item": {
        const ordered = block.type === "numbered_list_item";
        const text = inline(rich).trim();
        if (!text) break;
        const last = out[out.length - 1];
        if (last?.type === "list" && last.ordered === ordered) last.items.push(text);
        else out.push({ type: "list", ordered, items: [text] });
        break;
      }
      case "quote":
      case "callout": {
        const text = inline(rich).trim();
        if (text) out.push({ type: "quote", text });
        break;
      }
      case "divider":
        out.push({ type: "divider" });
        break;
      case "image": {
        const image = block.image as { type: "file" | "external"; file?: { url: string }; external?: { url: string }; caption?: RichText[] };
        const url = image.type === "file" ? image.file?.url : image.external?.url;
        if (url) out.push({ type: "image", src: await stableImage(block.id, url, image.type === "external"), alt: plain(image.caption) });
        break;
      }
    }
  }
  return out;
}

const wordCount = (blocks: ArticleBlock[]) =>
  blocks.reduce((sum, block) => {
    const text = block.type === "list" ? block.items.join(" ") : "text" in block ? block.text : "";
    return sum + text.split(/\s+/).filter(Boolean).length;
  }, 0);

function shorten(text: string, max = 170) {
  const clean = text.replace(/\*\*|\*|\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** One-off: the articles dated up to this day are released early. Harmless once the day has passed. */
const EARLY_RELEASE_UNTIL = "2026-11-16";

async function loadArticles(): Promise<Article[]> {
  const realToday = new Date().toISOString().slice(0, 10);
  const today = realToday > EARLY_RELEASE_UNTIL ? realToday : EARLY_RELEASE_UNTIL;
  const pages = await articlePages(site.notionArticlesPage);
  const articles: Article[] = [];
  const used = new Set<string>();

  for (const page of pages) {
    const { title, date } = splitTitle(page.title, page.created);
    if (!title || date > today) continue; // not released yet

    let slug = slugify(title) || page.id.slice(0, 8);
    if (used.has(slug)) slug = `${slug}-${page.id.slice(0, 4)}`;
    used.add(slug);

    let content = await toBlocks(await children(page.id));
    const coverIndex = content.findIndex((block) => block.type === "image");
    const cover = coverIndex >= 0 && content[coverIndex].type === "image" ? (content[coverIndex] as { src: string }).src : "";
    if (coverIndex >= 0) content = content.filter((_, i) => i !== coverIndex);

    // A paragraph that starts with "Meta description:" is the description, not article text.
    let description = "";
    const metaAt = content.findIndex((block) => block.type === "p" && /^meta description\s*:/i.test(block.text));
    if (metaAt >= 0) {
      description = (content[metaAt] as { text: string }).text.replace(/^meta description\s*:\s*/i, "");
      content = content.filter((_, i) => i !== metaAt);
    }
    const firstParagraph = content.find((block) => block.type === "p" && block.text.length >= 50);
    const excerpt = shorten(description || (firstParagraph && "text" in firstParagraph ? firstParagraph.text : title));

    articles.push({
      slug,
      title,
      description: shorten(description || excerpt, 160),
      category: categoryOf(title),
      date,
      readMinutes: Math.max(1, Math.ceil(wordCount(content) / 200)),
      cover,
      excerpt,
      content,
      socials: [],
    });
  }
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Released articles from Notion, newest first. Refreshed every 15 minutes; an article appears
 * once its date has come. A failure returns an empty list and is retried after two minutes.
 */
export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheTag("articles");
  try {
    const articles = await loadArticles();
    cacheLife({ stale: 300, revalidate: 900, expire: 86400 });
    return articles;
  } catch (error) {
    console.error("Could not load articles from Notion", error);
    // Not shorter than 5 minutes of expiry: a shorter cache cannot be prerendered and fails the build.
    cacheLife({ stale: 60, revalidate: 120, expire: 600 });
    return [];
  }
}
