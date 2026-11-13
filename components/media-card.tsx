import Link from "next/link";
import type { Article } from "@/lib/data/media";
import { formatDate } from "@/lib/format-date";

export function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

/** Date and read time, a quiet grey line. */
export function ArticleMeta({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <p className={`flex items-center gap-4 font-mono text-[12px] text-muted ${className}`}>
      <span className="flex items-center gap-1.5">
        <CalendarIcon />
        {formatDate(article.date)}
      </span>
      <span className="flex items-center gap-1.5">
        <ClockIcon />
        {article.readMinutes} min
      </span>
    </p>
  );
}

/** Article card: 3:2 picture, title, excerpt, date. Same everywhere a list of articles appears. */
/** `parallax` is kept for callers; the cover is shown whole, so it no longer moves. */
export function MediaCard({ article }: { article: Article; parallax?: number }) {
  return (
    <Link href={`/media/${article.slug}`} className="group block">
      <div className="aspect-video overflow-hidden rounded-[10px] bg-surface ring-1 ring-border">
        {article.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover}
            alt=""
            draggable={false}
            className="h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="mt-4">
        <p className="font-serif text-2xl font-medium leading-snug text-foreground">{article.title}</p>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">{article.excerpt}</p>
        <ArticleMeta article={article} className="mt-3" />
      </div>
    </Link>
  );
}
