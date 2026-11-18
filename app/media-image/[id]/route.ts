import { notionImageUrl } from "@/lib/notion";

const BLOCK_ID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/** Streams a Notion-hosted article picture. The CDN keeps it, so Notion is asked only on a cache miss. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!BLOCK_ID.test(id)) return new Response("Not found", { status: 404 });
  try {
    const url = await notionImageUrl(id);
    if (!url) return new Response("Not found", { status: 404 });
    const res = await fetch(url);
    if (!res.ok || !res.body) return new Response("Not found", { status: 404 });
    const type = res.headers.get("content-type") ?? "image/png";
    if (!type.startsWith("image/")) return new Response("Not found", { status: 404 });
    return new Response(res.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=604800, s-maxage=31536000, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Could not load a Notion picture", error);
    return new Response("Not available", { status: 502 });
  }
}
