"use client";

import { cities } from "@/lib/data/cities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { awardSources, awardsOf, linksOf, type ProjectAward, type BlockPlace, type Media, type Project, type ProjectBlock, type ProjectLink } from "@/lib/data/projects";
import { MediaField, emptyMedia } from "@/components/admin/media-field";

type Load = { projects: Project[]; stored: boolean; storage: "blob" | "file" | "none" };

const input =
  "w-full rounded-[6px] border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/60";
const label = "mb-1 block font-mono text-[11px] text-muted";
const smallBtn =
  "rounded-[6px] bg-foreground/[0.07] px-2.5 py-1.5 font-mono text-[11px] text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function coverMedia(project: Project): Media {
  if (project.video) return { type: "video", src: project.video, poster: project.cover };
  return { type: "image", src: project.cover ?? "" };
}

export function AdminApp() {
  const [phase, setPhase] = useState<"loading" | "login" | "ready">("loading");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [storage, setStorage] = useState<Load["storage"]>("none");
  const [selected, setSelected] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/projects", { cache: "no-store" });
    if (res.status === 401) {
      setPhase("login");
      return;
    }
    const data = (await res.json()) as Load;
    setProjects(data.projects);
    setStorage(data.storage);
    setPhase("ready");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const current = projects[selected];

  const patch = (change: Partial<Project>) => {
    setProjects((list) => list.map((p, i) => (i === selected ? { ...p, ...change } : p)));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects }),
    });
    const data = (await res.json()) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setNotice(data.error ?? "Could not save.");
      return;
    }
    setDirty(false);
    setNotice("Saved. The site updates in a few seconds.");
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setLoginError(data.error ?? "Could not sign in.");
      return;
    }
    setPassword("");
    setPhase("loading");
    await load();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setPhase("login");
  };

  const addProject = () => {
    const fresh: Project = {
      slug: `new-project-${projects.length + 1}`,
      title: "New project",
      client: "",
      category: "",
      location: "Remote",
      year: String(new Date().getFullYear()),
      services: [],
      summary: "",
      blocks: [],
    };
    setProjects((list) => [...list, fresh]);
    setSelected(projects.length);
    setDirty(true);
  };

  const removeProject = () => {
    if (!current || !window.confirm(`Delete "${current.title}"? This cannot be undone after saving.`)) return;
    setProjects((list) => list.filter((_, i) => i !== selected));
    setSelected(Math.max(0, selected - 1));
    setDirty(true);
  };

  const blocks = useMemo(() => current?.blocks ?? [], [current]);
  const setBlocks = (next: ProjectBlock[]) => patch({ blocks: next });
  /** Links replace the old Website / Behance fields, which are cleared on the first edit. */
  /** The award list replaces the old single award fields on the first edit. */
  const setAwards = (next: ProjectAward[]) => patch({ awards: next, award: undefined, awardSource: undefined });
  const setLinks = (next: ProjectLink[]) => patch({ links: next, url: undefined, behance: undefined });
  const patchBlock = (index: number, change: ProjectBlock) =>
    setBlocks(blocks.map((b, i) => (i === index ? change : b)));

  if (phase === "loading") {
    return (
      <Shell>
        <div className="grid min-h-screen place-items-center font-mono text-sm text-muted">Loading…</div>
      </Shell>
    );
  }

  if (phase === "login") {
    return (
      <Shell>
      <div className="grid min-h-screen place-items-center px-4">
        <form onSubmit={login} className="w-full max-w-xs">
          <p className="font-serif text-4xl text-foreground">Admin</p>
          <label className={`${label} mt-8`} htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
          {loginError ? <p className="mt-2 font-mono text-[11px] text-accent-red">{loginError}</p> : null}
          <button
            type="submit"
            className="mt-4 w-full rounded-[6px] bg-foreground px-4 py-2.5 font-mono text-[12px] text-background transition-opacity hover:opacity-85"
          >
            Sign in
          </button>
        </form>
      </div>
      </Shell>
    );
  }

  const folder = `projects/${current?.slug ?? "misc"}`;

  return (
    <Shell>
    <div className="min-h-screen bg-background pb-24 text-foreground">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-6 py-3 backdrop-blur">
        <p className="font-serif text-2xl">Projects</p>
        <div className="flex items-center gap-3">
          {notice ? <span className="font-mono text-[11px] text-muted">{notice}</span> : null}
          {storage === "none" ? (
            <span className="font-mono text-[11px] text-accent-red">No storage connected</span>
          ) : null}
          <a href="/projects" target="_blank" rel="noreferrer" className={smallBtn}>
            View site
          </a>
          <button type="button" onClick={logout} className={smallBtn}>
            Sign out
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="rounded-[6px] bg-foreground px-4 py-2 font-mono text-[12px] text-background transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {saving ? "Saving…" : dirty ? "Save" : "Saved"}
          </button>
        </div>
      </header>

      <div className="grid gap-8 px-6 pt-6 lg:grid-cols-[260px_1fr]">
        <aside>
          <ul className="flex flex-col gap-1">
            {projects.map((p, i) => (
              <li key={p.slug + i} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  className={`min-w-0 flex-1 truncate rounded-[6px] px-3 py-2 text-left text-sm transition-colors ${
                    i === selected ? "bg-foreground text-background" : "hover:bg-foreground/[0.07]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {p.title}
                </button>
                <button
                  type="button"
                  aria-label="Move up"
                  className={smallBtn}
                  disabled={i === 0}
                  onClick={() => {
                    setProjects((l) => move(l, i, i - 1));
                    setSelected(i - 1);
                    setDirty(true);
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  className={smallBtn}
                  disabled={i === projects.length - 1}
                  onClick={() => {
                    setProjects((l) => move(l, i, i + 1));
                    setSelected(i + 1);
                    setDirty(true);
                  }}
                >
                  ↓
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={addProject} className={`${smallBtn} mt-4 w-full py-2`}>
            + Add project
          </button>
        </aside>

        {current ? (
          <main className="max-w-3xl">
            <section className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={label}>Title</label>
                <input
                  className={input}
                  value={current.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const auto = current.slug === slugify(current.title) || current.slug.startsWith("new-project");
                    patch({ title, ...(auto ? { slug: slugify(title) || current.slug } : {}) });
                  }}
                />
              </div>
              <div>
                <label className={label}>Slug (address)</label>
                <input className={input} value={current.slug} onChange={(e) => patch({ slug: slugify(e.target.value) })} />
              </div>
              <div>
                <label className={label}>Client</label>
                <input className={input} value={current.client} onChange={(e) => patch({ client: e.target.value })} />
              </div>
              <div>
                <label className={label}>Category</label>
                <input className={input} value={current.category} onChange={(e) => patch({ category: e.target.value })} />
              </div>
              <div>
                <label className={label}>Year</label>
                <input className={input} value={current.year} onChange={(e) => patch({ year: e.target.value })} />
              </div>
              <div>
                <label className={label}>Location (shown on the page)</label>
                <input className={input} value={current.location} onChange={(e) => patch({ location: e.target.value })} />
              </div>
              <div>
                <label className={label}>Services (comma separated)</label>
                <input
                  className={input}
                  value={current.services.join(", ")}
                  onChange={(e) =>
                    patch({
                      services: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Short summary (cards, chat, fallback text)</label>
                <textarea className={`${input} min-h-20`} value={current.summary} onChange={(e) => patch({ summary: e.target.value })} />
              </div>
              <div className="rounded-[8px] border border-border p-3 md:col-span-2">
                <p className="font-mono text-[11px] text-muted">
                  Awards: shown as plaques at the top of the project page; the first one is the badge on cards. The link opens where the award is listed.
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {awardsOf(current).map((award, k, list) => (
                    <div key={k} className="grid gap-2 md:grid-cols-[11rem_1fr_1.4fr_auto]">
                      <select
                        className={input}
                        value={award.source}
                        onChange={(e) => setAwards(list.map((a, n) => (n === k ? { ...a, source: e.target.value } : a)))}
                      >
                        {awardSources.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <input
                        className={input}
                        placeholder="Site of the Day, Best of Behance…"
                        value={award.title}
                        onChange={(e) => setAwards(list.map((a, n) => (n === k ? { ...a, title: e.target.value } : a)))}
                      />
                      <input
                        className={input}
                        placeholder="https:// (where the award is listed)"
                        value={award.url ?? ""}
                        onChange={(e) => setAwards(list.map((a, n) => (n === k ? { ...a, url: e.target.value || undefined } : a)))}
                      />
                      <button type="button" className={smallBtn} onClick={() => setAwards(list.filter((_, n) => n !== k))}>
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={`${smallBtn} w-fit`}
                    onClick={() => setAwards([...awardsOf(current), { source: "Behance", title: "" }])}
                  >
                    + Award
                  </button>
                </div>
              </div>
              <div>
                <label className={label}>Credits on hover (comma separated)</label>
                <input
                  className={input}
                  value={(current.credits ?? []).join(", ")}
                  onChange={(e) =>
                    patch({
                      credits: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="rounded-[8px] border border-border p-3 md:col-span-2">
                <p className="font-mono text-[11px] text-muted">
                  Links at the top of the page (site, Awwwards, Behance, CSS Design Awards…). The icon is picked from the address.
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {linksOf(current).map((link, k, list) => (
                    <div key={k} className="flex gap-2">
                      <input
                        className={`${input} max-w-[10rem]`}
                        placeholder="Label"
                        value={link.label}
                        onChange={(e) => setLinks(list.map((l, n) => (n === k ? { ...l, label: e.target.value } : l)))}
                      />
                      <input
                        className={input}
                        placeholder="https://"
                        value={link.url}
                        onChange={(e) => setLinks(list.map((l, n) => (n === k ? { ...l, url: e.target.value } : l)))}
                      />
                      <button type="button" className={smallBtn} disabled={k === 0} onClick={() => setLinks(move(list, k, k - 1))}>
                        ↑
                      </button>
                      <button type="button" className={smallBtn} onClick={() => setLinks(list.filter((_, n) => n !== k))}>
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={`${smallBtn} w-fit`}
                    onClick={() => setLinks([...linksOf(current), { label: "", url: "" }])}
                  >
                    + Link
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={label}>About (full description; empty = the summary)</label>
                <textarea className={`${input} min-h-28`} value={current.about ?? ""} onChange={(e) => patch({ about: e.target.value || undefined })} />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Problem (the task and its context)</label>
                <textarea className={`${input} min-h-28`} value={current.problem ?? ""} onChange={(e) => patch({ problem: e.target.value || undefined })} />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Results (what came out of it; the award is added automatically)</label>
                <textarea className={`${input} min-h-28`} value={current.results ?? ""} onChange={(e) => patch({ results: e.target.value || undefined })} />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Short statement (large text after the cover, optional)</label>
                <textarea className={`${input} min-h-16`} value={current.statement ?? ""} onChange={(e) => patch({ statement: e.target.value || undefined })} />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Cover caption</label>
                <input className={input} value={current.coverCaption ?? ""} onChange={(e) => patch({ coverCaption: e.target.value || undefined })} />
              </div>
              <div className="md:col-span-2">
                <MediaField
                  label="Cover (image or video)"
                  folder={folder}
                  value={coverMedia(current)}
                  onChange={(m) =>
                    m.type === "video"
                      ? // the picture stays as the poster unless a new poster is set
                        patch({ video: m.src || undefined, cover: m.poster ?? current.cover })
                      : patch({ video: undefined, cover: m.src || undefined })
                  }
                />
              </div>
              <div className="rounded-[8px] border border-border p-3 md:col-span-2">
                <p className="font-mono text-[11px] text-muted">Globe point: pick a city from the list, coordinates fill in. Others: enter lat and lon by hand</p>
                <datalist id="globe-cities">
                  {cities.map((c) => (
                    <option key={c.city} value={c.city} />
                  ))}
                </datalist>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <input
                    className={input}
                    placeholder="City"
                    value={current.place?.city ?? ""}
                    list="globe-cities"
                    onChange={(e) => {
                      const hit = cities.find((c) => c.city.toLowerCase() === e.target.value.toLowerCase());
                      patch({
                        place: hit
                          ? { city: hit.city, lat: hit.lat, lon: hit.lon }
                          : { city: e.target.value, lat: current.place?.lat ?? 0, lon: current.place?.lon ?? 0 },
                      });
                    }}
                  />
                  <input
                    className={input}
                    placeholder="Lat"
                    value={current.place?.lat ?? ""}
                    onChange={(e) => patch({ place: { city: current.place?.city ?? "", lat: Number(e.target.value) || 0, lon: current.place?.lon ?? 0 } })}
                  />
                  <input
                    className={input}
                    placeholder="Lon"
                    value={current.place?.lon ?? ""}
                    onChange={(e) => patch({ place: { city: current.place?.city ?? "", lat: current.place?.lat ?? 0, lon: Number(e.target.value) || 0 } })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" checked={Boolean(current.featured)} onChange={(e) => patch({ featured: e.target.checked || undefined })} />
                Show on the home page (Selected work)
              </label>
            </section>

            <section className="mt-10">
              <p className="font-serif text-2xl">Page blocks</p>
              <ol className="mt-4 flex flex-col gap-4">
                {blocks.map((block, i) => (
                  <li key={i} className="rounded-[10px] border border-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-mono text-[11px] text-muted">
                        {i + 1} ·{" "}
                        {block.type === "media"
                          ? "1 photo"
                          : block.type === "media2"
                            ? "2 in a row"
                            : block.type === "media3"
                              ? "3 photos (1 + 2)"
                              : block.type === "media4"
                                ? "4 photos (2×2)"
                                : block.type === "text"
                                  ? "Text section"
                                  : "Credits"}
                      </p>
                      <div className="flex gap-1">
                        <select
                          className={`${smallBtn} pr-2`}
                          value={block.place ?? "content"}
                          onChange={(e) => patchBlock(i, { ...block, place: e.target.value as BlockPlace })}
                          aria-label="Where on the page"
                        >
                          <option value="about">After About</option>
                          <option value="content">After Problem</option>
                          <option value="results">After Results</option>
                        </select>
                        <button type="button" className={smallBtn} disabled={i === 0} onClick={() => setBlocks(move(blocks, i, i - 1))}>
                          ↑
                        </button>
                        <button type="button" className={smallBtn} disabled={i === blocks.length - 1} onClick={() => setBlocks(move(blocks, i, i + 1))}>
                          ↓
                        </button>
                        <button type="button" className={smallBtn} onClick={() => setBlocks(blocks.filter((_, k) => k !== i))}>
                          Delete
                        </button>
                      </div>
                    </div>

                    {block.type === "media" ? (
                      <div className="flex flex-col gap-3">
                        <MediaField label="Media" folder={folder} value={block.media} onChange={(m) => patchBlock(i, { ...block, media: m })} />
                        <input
                          className={input}
                          placeholder="Caption (optional)"
                          value={block.caption ?? ""}
                          onChange={(e) => patchBlock(i, { ...block, caption: e.target.value || undefined })}
                        />
                      </div>
                    ) : null}

                    {block.type === "media2" ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {[0, 1].map((k) => (
                          <MediaField
                            key={k}
                            label={k === 0 ? "Left" : "Right"}
                            folder={folder}
                            value={block.items[k]}
                            onChange={(m) => {
                              const items = [...block.items] as [Media, Media];
                              items[k] = m;
                              patchBlock(i, { ...block, items });
                            }}
                          />
                        ))}
                      </div>
                    ) : null}

                    {block.type === "media3" || block.type === "media4" ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {block.items.map((item, k) => (
                          <div key={k} className={block.type === "media3" && k === 0 ? "md:col-span-2" : ""}>
                            <MediaField
                              label={block.type === "media3" ? (k === 0 ? "Wide, on top" : k === 1 ? "Below, left" : "Below, right") : `Photo ${k + 1}`}
                              folder={folder}
                              value={item}
                              onChange={(m) => {
                                if (block.type === "media3") {
                                  const items = [...block.items] as [Media, Media, Media];
                                  items[k] = m;
                                  patchBlock(i, { ...block, items });
                                } else {
                                  const items = [...block.items] as [Media, Media, Media, Media];
                                  items[k] = m;
                                  patchBlock(i, { ...block, items });
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {block.type === "text" ? (
                      <div className="flex flex-col gap-3">
                        <input
                          className={input}
                          placeholder="Label (About, Context, Approach…)"
                          value={block.label}
                          onChange={(e) => patchBlock(i, { ...block, label: e.target.value })}
                        />
                        <textarea
                          className={`${input} min-h-32`}
                          placeholder="Text"
                          value={block.text}
                          onChange={(e) => patchBlock(i, { ...block, text: e.target.value })}
                        />
                      </div>
                    ) : null}

                    {block.type === "credits" ? (
                      <div className="flex flex-col gap-2">
                        {block.rows.map((row, k) => (
                          <div key={k} className="flex gap-2">
                            <input
                              className={input}
                              placeholder="Role"
                              value={row.role}
                              onChange={(e) =>
                                patchBlock(i, { ...block, rows: block.rows.map((r, n) => (n === k ? { ...r, role: e.target.value } : r)) })
                              }
                            />
                            <input
                              className={input}
                              placeholder="Name"
                              value={row.name}
                              onChange={(e) =>
                                patchBlock(i, { ...block, rows: block.rows.map((r, n) => (n === k ? { ...r, name: e.target.value } : r)) })
                              }
                            />
                            <button type="button" className={smallBtn} onClick={() => patchBlock(i, { ...block, rows: block.rows.filter((_, n) => n !== k) })}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className={`${smallBtn} w-fit`}
                          onClick={() => patchBlock(i, { ...block, rows: [...block.rows, { role: "", name: "" }] })}
                        >
                          + Row
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={smallBtn} onClick={() => setBlocks([...blocks, { type: "text", label: "About", text: "" }])}>
                  + Text section
                </button>
                <button type="button" className={smallBtn} onClick={() => setBlocks([...blocks, { type: "media", media: emptyMedia() }])}>
                  + 1 photo
                </button>
                <button type="button" className={smallBtn} onClick={() => setBlocks([...blocks, { type: "media2", items: [emptyMedia(), emptyMedia()] }])}>
                  + 2 in a row
                </button>
                <button
                  type="button"
                  className={smallBtn}
                  onClick={() => setBlocks([...blocks, { type: "media3", items: [emptyMedia(), emptyMedia(), emptyMedia()] }])}
                >
                  + 3 photos
                </button>
                <button
                  type="button"
                  className={smallBtn}
                  onClick={() => setBlocks([...blocks, { type: "media4", items: [emptyMedia(), emptyMedia(), emptyMedia(), emptyMedia()] }])}
                >
                  + 4 photos (2×2)
                </button>
                <button type="button" className={smallBtn} onClick={() => setBlocks([...blocks, { type: "credits", rows: [{ role: "", name: "" }] }])}>
                  + Credits
                </button>
              </div>
            </section>

            <button type="button" onClick={removeProject} className={`${smallBtn} mt-12`}>
              Delete this project
            </button>
          </main>
        ) : (
          <p className="font-mono text-sm text-muted">No projects yet.</p>
        )}
      </div>
    </div>
    </Shell>
  );
}

/** Covers the site chrome (header, footer) while the admin is open. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div data-lenis-prevent className="fixed inset-0 z-[70] overflow-y-auto bg-background">
      {children}
    </div>
  );
}
