import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import { projects as seed, type Project } from "@/lib/data/projects";

const BLOB_PATH = "content/projects.json";
const FILE_PATH = path.join(process.cwd(), "content", "projects.json");

export type StorageKind = "blob" | "file" | "none";

export function storageKind(): StorageKind {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.NODE_ENV !== "production") return "file";
  return "none";
}

async function readStored(): Promise<Project[] | null> {
  const kind = storageKind();
  try {
    if (kind === "blob") {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: BLOB_PATH });
      const hit = blobs.find((b) => b.pathname === BLOB_PATH);
      if (!hit) return null;
      const res = await fetch(`${hit.url}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as Project[];
    }
    if (kind === "file") {
      return JSON.parse(await fs.readFile(FILE_PATH, "utf8")) as Project[];
    }
  } catch {
    /* nothing stored yet */
  }
  return null;
}

/** Admin read: the stored list if there is one, else the built-in seed. Never cached. */
export async function readProjectsForAdmin(): Promise<{ projects: Project[]; stored: boolean }> {
  const stored = await readStored();
  return { projects: stored ?? seed, stored: Boolean(stored) };
}

/** Public read, cached and tagged so a save in the admin refreshes the site. */
export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheTag("projects");
  cacheLife("hours");
  return (await readStored()) ?? seed;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug);
}

export async function saveProjects(list: Project[]) {
  const kind = storageKind();
  const body = JSON.stringify(list, null, 2);
  if (kind === "blob") {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
    return;
  }
  if (kind === "file") {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, body, "utf8");
    return;
  }
  throw new Error("No storage is connected. Add a Vercel Blob store to the project.");
}
