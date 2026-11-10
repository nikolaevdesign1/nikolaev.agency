"use client";

import { useMemo, useState } from "react";
import { CursorFollowCta } from "@/components/cursor-follow-cta";
import { ScrollStrip } from "@/components/filter-controls";
import Link from "next/link";
import { articleCategories, latestArticle, otherArticles, type Article } from "@/lib/data/media";

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

  const lead = useMemo(() => rest.slice(0, 3), [rest]);
  const banner = rest[3];
  const more = useMemo(() => rest.slice(4), [rest]);

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
          <ScrollStrip>
            {["All", ...categories].map((c) => {
              const activeTag = c === "All" ? category === null : category === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={activeTag}
                  onClick={() => setCategory(c === "All" ? null : category === c ? null : c)}
                  className={`relative z-10 shrink-0 rounded-[4px] px-3 py-1.5 transition-colors duration-300 ${
                    activeTag
                      ? "text-background"
                      : "text-foreground hover:bg-foreground/8"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </ScrollStrip>
          <label className="flex shrink-0 items-center gap-2 rounded-[6px] border border-border bg-background px-3 py-2 md:ml-auto transition-colors focus-within:border-foreground/50 md:w-72">
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
          <>
            <Hero article={featured} />
            {lead.length > 0 ? <Grid articles={lead} className="mt-16 md:mt-24" /> : null}
            <Marquee />
            {banner ? (
              <>
                <Banner article={banner} />
                {more.length > 0 ? <Grid articles={more} className="mt-14 md:mt-20" /> : null}
              </>
            ) : null}
            <Cta />
          </>
        ) : filtered.length === 0 ? (
          <p className="mt-16 font-mono text-sm text-muted">No articles match.</p>
        ) : (
          <Grid articles={filtered} className="mt-14" />
        )}
      </div>
    </section>
  );
}

function Tags({ article, center = false }: { article: Article; center?: boolean }) {
  return (
    <p className={`flex items-center gap-2 text-[13px] text-accent ${center ? "justify-center" : ""}`}>
      <span>{article.category}</span>
      <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
      <span>{article.readMinutes} min read</span>
    </p>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function Hero({ article }: { article: Article }) {
  return (
    <CursorFollowCta label="More" className="mt-16 block md:mt-20">
      <Link href={`/media/${article.slug}`} className="group block">
        <Tags article={article} />
        <div className="mt-4 flex items-start justify-between gap-8">
          <h2 className="max-w-4xl font-serif text-4xl font-medium leading-[1.05] text-foreground md:text-6xl">
            {article.title}
          </h2>
          <span className="hidden size-[72px] shrink-0 place-items-center rounded-full border border-foreground/70 text-[13px] text-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background md:grid">
            Read
          </span>
        </div>
        <div className="mt-10 aspect-[2.3/1] w-full overflow-hidden rounded-[12px] bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover}
            alt=""
            draggable={false}
            className="h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </Link>
    </CursorFollowCta>
  );
}

function Grid({ articles: list, className = "" }: { articles: Article[]; className?: string }) {
  return (
    <div className={`grid grid-cols-1 items-start gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 ${className}`}>
      {list.map((article) => (
        <CursorFollowCta key={article.slug} label="More" className="block">
          <Link href={`/media/${article.slug}`} className="group block">
            <div className="aspect-[3/2] overflow-hidden rounded-[10px] bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.cover}
                alt=""
                draggable={false}
                className="h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-6">
              <Tags article={article} />
              <p className="mt-3 font-serif text-2xl font-medium leading-snug text-foreground">{article.title}</p>
              <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">{article.excerpt}</p>
              <p className="mt-4 flex items-center gap-4 font-mono text-[12px] text-muted">
                <span>{formatDate(article.date)}</span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon />
                  {article.readMinutes} min
                </span>
              </p>
            </div>
          </Link>
        </CursorFollowCta>
      ))}
    </div>
  );
}

function Banner({ article }: { article: Article }) {
  return (
    <CursorFollowCta label="More" className="mt-24 block md:mt-32">
      <Link href={`/media/${article.slug}`} className="group block">
        <div className="aspect-[2.6/1] w-full overflow-hidden rounded-[12px] bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover}
            alt=""
            draggable={false}
            className="h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <Tags article={article} center />
          <h3 className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground md:text-5xl">
            {article.title}
          </h3>
        </div>
      </Link>
    </CursorFollowCta>
  );
}

function Marquee() {
  const unit = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className={`shrink-0 px-6 ${i === 2 ? "text-accent" : ""}`}>
      ( nikolaev.media )
    </span>
  ));
  return (
    <div aria-hidden="true" className="mt-24 overflow-hidden bg-ink py-4 text-ink-foreground md:mt-32">
      <div className="flex w-max animate-marquee whitespace-nowrap font-sans text-lg font-semibold">
        <div className="flex">{unit}</div>
        <div className="flex">{unit}</div>
      </div>
    </div>
  );
}

function Cta() {
  return (
    <div className="mt-24 grid items-end gap-8 border-t border-foreground/80 pt-10 md:mt-32 md:grid-cols-[1.4fr_1fr] md:gap-16">
      <p className="font-serif text-5xl font-medium leading-[0.98] text-foreground md:text-8xl">
        Have a project in mind?
      </p>
      <div>
        <p className="text-lg leading-snug text-foreground">
          We write about what we build. If something here matches your problem, the people behind it can help.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-[6px] bg-foreground px-6 py-3 font-mono text-[13px] text-background transition-opacity hover:opacity-80"
        >
          Request a project
        </Link>
      </div>
    </div>
  );
}
