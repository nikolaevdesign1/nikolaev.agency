import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdminRequest } from "@/lib/content/auth";
import { readProjectsForAdmin, saveProjects, storageKind } from "@/lib/content/store";
import type { Project } from "@/lib/data/projects";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { projects, stored } = await readProjectsForAdmin();
  return NextResponse.json({ projects, stored, storage: storageKind() });
}

function valid(list: unknown): list is Project[] {
  if (!Array.isArray(list) || list.length > 200) return false;
  const slugs = new Set<string>();
  for (const item of list) {
    if (!item || typeof item !== "object") return false;
    const p = item as Project;
    if (typeof p.slug !== "string" || !/^[a-z0-9-]+$/.test(p.slug)) return false;
    if (typeof p.title !== "string" || !p.title.trim()) return false;
    if (slugs.has(p.slug)) return false;
    slugs.add(p.slug);
  }
  return true;
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const list = (body as { projects?: unknown }).projects;
  if (!valid(list)) {
    return NextResponse.json(
      { error: "Every project needs a title and a unique slug (a-z, 0-9, dashes)." },
      { status: 422 },
    );
  }
  try {
    await saveProjects(list);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save." },
      { status: 500 },
    );
  }
  revalidateTag("projects", { expire: 0 });
  // Pages refresh stale-while-revalidate: the first visit after a change still gets the old copy.
  // Make that first visit here, so the owner sees the change on the next reload.
  const origin = new URL(request.url).origin;
  const slugs = list.map((project) => `/projects/${project.slug}`);
  await Promise.allSettled(
    ["/", "/projects", ...slugs].map((path) => fetch(`${origin}${path}`, { cache: "no-store" })),
  );
  return NextResponse.json({ ok: true });
}
