"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { StudioChatButton } from "@/components/ambient-text-field";
import { pillClass } from "@/components/button";
import { RichText } from "@/components/rich-text";
import { ServiceBanner } from "@/components/service-banner";
import type { Article, ArticleBlock } from "@/lib/data/media";

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Block({ block }: { block: ArticleBlock }) {
  if (block.type === "h2") {
    return (
      <h2 id={slug(block.text)} className="mt-16 scroll-mt-32 font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
        {block.text}
      </h2>
    );
  }
  if (block.type === "h3") {
    return <h3 className="mt-10 font-serif text-2xl font-medium leading-tight text-foreground md:text-3xl">{block.text}</h3>;
  }
  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag className={`mt-6 flex flex-col gap-2 pl-6 text-[17px] leading-[1.7] text-foreground/85 ${block.ordered ? "list-decimal" : "list-disc"}`}>
        {block.items.map((item, i) => (
          <li key={i}>
            <RichText as="span" text={item} />
          </li>
        ))}
      </Tag>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="mt-8 border-l-2 border-foreground/70 pl-5 font-serif text-2xl leading-snug text-foreground">
        <RichText as="span" text={block.text} />
      </blockquote>
    );
  }
  if (block.type === "divider") return <hr className="my-12 border-border" />;
  if (block.type === "image") {
    return (
      <div className="my-10 overflow-hidden rounded-[12px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.src} alt={block.alt} className="w-full object-cover" />
      </div>
    );
  }
  return <RichText text={block.text} className="mt-6 text-[17px] leading-[1.75] text-foreground/85 first:mt-0" />;
}

/**
 * Two-column article: a sticky side with contents, share and a call to action; the text on the right.
 * Also draws the reading progress bar on top (the bottom blur is site-wide, see bottom-blur.tsx).
 */
export function ArticleBody({ article }: { article: Article }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const headings = useMemo(
    () => article.content.flatMap((block) => (block.type === "h2" ? [{ id: slug(block.text), text: block.text }] : [])),
    [article],
  );
  const midpoint = Math.ceil(article.content.length / 2);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const body = bodyRef.current;
      if (!body) return;
      const rect = body.getBoundingClientRect();
      const view = window.innerHeight;
      const total = Math.max(1, rect.height - view * 0.6);
      const p = Math.min(1, Math.max(0, (view * 0.25 - rect.top) / total));
      setProgress(p);

      let current: string | null = null;
      for (const heading of headings) {
        const node = document.getElementById(heading.id);
        if (node && node.getBoundingClientRect().top < view * 0.35) current = heading.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  const minutesLeft = Math.max(0, Math.ceil(article.readMinutes * (1 - progress)));

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const contents = (
    <ul className="flex flex-col gap-1">
      {headings.map((heading) => {
        const active = heading.id === activeId;
        return (
          <li key={heading.id}>
            <button
              type="button"
              onClick={() => goTo(heading.id)}
              className={`relative w-full py-1.5 pl-4 text-left text-[14px] leading-snug transition-colors ${
                active ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 bottom-1.5 w-px transition-colors ${active ? "bg-foreground" : "bg-transparent"}`}
              />
              {heading.text}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[80] h-[3px] bg-transparent">
        <div className="h-full bg-accent" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-12 md:gap-x-8">
        <aside className="md:col-span-4">
          <div className="md:sticky md:top-28">
            {headings.length > 0 ? (
              <>
                <details className="md:hidden" open={false}>
                  <summary className="cursor-pointer font-mono text-[12px] text-muted">Contents</summary>
                  <div className="mt-3">{contents}</div>
                </details>
                <div className="hidden md:block">
                  <p className="font-mono text-[12px] text-muted">Contents</p>
                  <div className="mt-4">{contents}</div>
                </div>
              </>
            ) : null}
            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={share}
                className="flex items-center gap-2 rounded-[6px] px-3 py-2 font-mono text-[12px] text-foreground ring-1 ring-border transition-colors hover:bg-foreground hover:text-background"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="6" cy="12" r="2.5" />
                  <circle cx="18" cy="6" r="2.5" />
                  <circle cx="18" cy="18" r="2.5" />
                  <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
                </svg>
                {copied ? "Link copied" : "Share"}
              </button>
              <span className="font-mono text-[12px] text-muted">{minutesLeft > 0 ? `${minutesLeft} min left` : "Read"}</span>
            </div>
            <div className="mt-8 hidden border-t border-border pt-8 md:block">
              <p className="max-w-xs text-[15px] leading-snug text-foreground">
                Have a project like this? Tell us what you&apos;re building.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 rounded bg-[#0a0a0a] px-5 py-2.5 font-sans text-[11px] font-medium text-white ring-1 ring-black transition-opacity duration-200 hover:opacity-75"
                >
                  Request a project
                </Link>
                <StudioChatButton className={pillClass}>Let&apos;s chat</StudioChatButton>
              </div>
            </div>
          </div>
        </aside>

        <div ref={bodyRef} className="md:col-span-8">
          <div className="max-w-2xl">
            {article.content.slice(0, midpoint).map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <ServiceBanner />
            {article.content.slice(midpoint).map((block, i) => (
              <Block key={midpoint + i} block={block} />
            ))}

            {article.socials.length > 0 ? (
            <div className="mt-12 border-t border-border pt-6">
              <p className="font-mono text-[11px] text-muted">Also published on</p>
              <ul className="mt-3 flex flex-wrap gap-5">
                {article.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[11px] text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {social.label}
                      <span aria-hidden>→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
