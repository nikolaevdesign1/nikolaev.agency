"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { articleCategories, latestArticle, otherArticles } from "@/lib/data/media";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MediaIndex() {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => articleCategories(), []);
  const featured = useMemo(() => latestArticle(), []);
  const rest = useMemo(() => otherArticles(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter((article) => {
      if (category && article.category !== category) return false;
      if (q && !article.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rest, category, query]);

  return (
    <section className="bg-background gutter pb-28 pt-40 text-foreground md:pt-48">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-[11px] text-muted">nikolaev.media</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-[1.05] md:text-6xl">
            Notes on design, AI, and running a small studio.
          </h1>
        </div>

        <div className="mt-12 flex flex-col gap-3 text-[13px] md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1 overflow-x-auto rounded-[6px] bg-surface/60 p-1">
            <div className="flex w-max">
              {["All", ...categories].map((c) => {
                const activeTag = c === "All" ? category === null : category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={activeTag}
                    onClick={() => setCategory(c === "All" ? null : category === c ? null : c)}
                    className={`shrink-0 rounded-[4px] px-3 py-1.5 transition-colors duration-300 ${
                      activeTag
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-foreground/8"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="flex shrink-0 items-center gap-2 rounded-[6px] border border-border bg-background px-3 py-2 transition-colors focus-within:border-foreground/50 md:w-72">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="shrink-0 text-muted">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m20 20-4.2-4.2" />
            </svg>
            <span className="sr-only">Search articles</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles"
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted/70"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="text-muted transition-colors hover:text-foreground"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            ) : null}
          </label>
        </div>

        {!category && !query ? (
          <Link
            href={`/media/${featured.slug}`}
            className="group mt-8 block border-b border-border pb-10"
          >
            <div className="aspect-[2/1] w-full overflow-hidden rounded-[6px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.cover}
                alt=""
                draggable={false}
                className="h-full w-full select-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
              <div>
                <p className="font-mono text-[11px] text-muted">{featured.category} · Latest</p>
                <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground md:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{featured.excerpt}</p>
              </div>
              <p className="shrink-0 font-mono text-[11px] text-muted">
                {formatDate(featured.date)} · {featured.readMinutes} min read
              </p>
            </div>
          </Link>
        ) : null}

      {filtered.length === 0 ? (
        <p className="mt-16 font-mono text-sm text-muted">
          No articles match.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 md:grid-cols-3 md:gap-x-12 md:gap-y-16">
          {filtered.map((article) => (
            <Link key={article.slug} href={`/media/${article.slug}`} className="group block">
              <p className="font-mono text-[10px] text-muted">
                {article.category} · {formatDate(article.date)}
              </p>
              <p className="mt-1.5 font-serif text-lg font-medium leading-snug text-foreground">
                {article.title}
              </p>
              <div className="mt-4 aspect-[4/3] overflow-hidden rounded-[6px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.cover}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}