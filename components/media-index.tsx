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
    <section className="bg-background px-6 pb-28 pt-36 text-foreground md:px-10 md:pt-44">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        nikolaev.media
      </p>
      <h1 className="mt-4 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
        Notes on design, AI, and running a small studio.
      </h1>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-y border-border py-4">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-[4px] border px-2.5 py-1 transition-colors ${
              category === null
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(category === c ? null : c)}
              className={`rounded-[4px] border px-2.5 py-1 transition-colors ${
                category === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 border-b border-foreground/40 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted focus-within:border-foreground">
          <span aria-hidden="true">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Article title…"
            className="w-48 bg-transparent text-foreground outline-none placeholder:text-muted/60"
          />
        </label>
      </div>

      {!category && !query ? (
        <Link
          href={`/media/${featured.slug}`}
          className="group mt-10 grid gap-6 border-b border-border pb-10 md:grid-cols-2 md:gap-10"
        >
          <div className="aspect-[16/10] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {featured.category} · Latest
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{featured.excerpt}</p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {formatDate(featured.date)} · {featured.readMinutes} min read
            </p>
          </div>
        </Link>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-16 font-mono text-sm uppercase tracking-wider text-muted">
          No articles match.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 md:grid-cols-3 md:gap-x-12 md:gap-y-16">
          {filtered.map((article) => (
            <Link key={article.slug} href={`/media/${article.slug}`} className="group block">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {article.category} · {formatDate(article.date)}
              </p>
              <p className="mt-1.5 font-serif text-lg font-medium leading-snug tracking-tight text-foreground">
                {article.title}
              </p>
              <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl">
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
    </section>
  );
}
