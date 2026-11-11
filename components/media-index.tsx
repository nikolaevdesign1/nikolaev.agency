"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CursorFollowCta } from "@/components/cursor-follow-cta";
import { ArticleMeta, MediaCard } from "@/components/media-card";
import { SubscribeBanner } from "@/components/subscribe-banner";
import { articleCategories, latestArticle, otherArticles, type Article } from "@/lib/data/media";

export function MediaIndex() {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => articleCategories(), []);
  const featured = useMemo(() => latestArticle(), []);
  const rest = useMemo(() => otherArticles(), []);
  const all = useMemo(() => [featured, ...rest], [featured, rest]);

  const lead = useMemo(() => rest.slice(0, 3), [rest]);
  const banner = rest[3];
  const more = useMemo(() => rest.slice(4), [rest]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((article) => {
      if (category && article.category !== category) return false;
      if (!q) return true;
      return [article.title, article.excerpt, article.category].some((field) => field.toLowerCase().includes(q));
    });
  }, [all, category, query]);

  const browsing = !category && !query.trim();

  return (
    <section className="bg-background gutter pb-40 pt-40 text-foreground md:pt-48">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-[11px] text-muted">nikolaev.media</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-[1.05] md:text-6xl">
            Notes on design, AI, and running a small studio.
          </h1>
        </div>

        <label className="mt-12 flex w-full items-center gap-4 rounded-[10px] border border-border bg-background px-5 py-4 transition-colors focus-within:border-foreground/50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="shrink-0 text-muted">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <span className="sr-only">Search articles</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, topics, categories"
            className="min-w-0 flex-1 bg-transparent text-lg text-foreground outline-none placeholder:text-muted/70"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="text-muted transition-colors hover:text-foreground"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          ) : null}
        </label>

        {browsing ? (
          <>
            <Hero article={featured} />
            {lead.length > 0 ? <Grid articles={lead} className="mt-16 md:mt-24" /> : null}
            <div id="subscribe" className="mt-24 scroll-mt-32 md:mt-32">
              <SubscribeBanner />
            </div>
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

      <MediaNav categories={categories} category={category} onChange={setCategory} />
    </section>
  );
}

function MediaNav({
  categories,
  category,
  onChange,
}: {
  categories: string[];
  category: string | null;
  onChange: (value: string | null) => void;
}) {
  const items = ["All", ...categories];
  return (
    <nav
      aria-label="Article categories"
      className="fixed bottom-16 left-1/2 z-30 flex max-w-[calc(100vw-2rem)] origin-bottom -translate-x-1/2 scale-[1.2] items-center gap-1 overflow-x-auto rounded-[6px] border border-border bg-background p-1 font-serif text-base text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.16)] max-md:scale-100"
    >
      {items.map((item) => {
        const active = item === "All" ? category === null : category === item;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => {
              onChange(item === "All" ? null : item);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`shrink-0 rounded-[4px] px-3 py-2 transition-colors duration-300 ${
              active ? "bg-foreground text-background" : "text-foreground hover:bg-foreground/8"
            }`}
          >
            {item}
          </button>
        );
      })}
      <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-border" />
      <button
        type="button"
        onClick={() => {
          onChange(null);
          window.setTimeout(() => document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
        }}
        className="shrink-0 rounded-[4px] bg-foreground px-4 py-2 text-background transition-opacity duration-300 hover:opacity-80"
      >
        Subscribe
      </button>
    </nav>
  );
}

function Hero({ article }: { article: Article }) {
  return (
    <CursorFollowCta label="More" className="mt-16 block md:mt-20">
      <Link href={`/media/${article.slug}`} className="group block">
        <h2 className="max-w-4xl font-serif text-4xl font-medium leading-[1.05] text-foreground md:text-6xl">
          {article.title}
        </h2>
        <ArticleMeta article={article} className="mt-5" />
        <div className="mt-10 aspect-[2.3/1] w-full overflow-hidden rounded-[12px] bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover}
            alt=""
            draggable={false}
            data-scroll=""
            data-scroll-speed="-0.06"
            className="h-full w-full scale-[1.12] select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.15]"
          />
        </div>
      </Link>
    </CursorFollowCta>
  );
}

function Grid({ articles: list, className = "" }: { articles: Article[]; className?: string }) {
  return (
    <div className={`grid grid-cols-1 items-start gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 ${className}`}>
      {list.map((article, i) => (
        <CursorFollowCta key={article.slug} label="More" className="block">
          <MediaCard article={article} parallax={i % 2 === 1 ? -0.04 : undefined} />
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
            data-scroll=""
            data-scroll-speed="-0.06"
            className="h-full w-full scale-[1.12] select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.15]"
          />
        </div>
        <div className="mt-8 max-w-[66%] max-md:max-w-none">
          <h3 className="font-serif text-3xl font-medium leading-tight text-foreground md:text-5xl">{article.title}</h3>
          <ArticleMeta article={article} className="mt-4" />
        </div>
      </Link>
    </CursorFollowCta>
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
