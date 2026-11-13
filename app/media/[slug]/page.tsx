import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/data/media";
import { ArticleBody } from "@/components/article-body";
import { ArticleMeta, MediaCard } from "@/components/media-card";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import { site } from "@/lib/data/site";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article" };
  return pageMeta({
    title: article.title,
    description: article.description,
    path: `/media/${article.slug}`,
    image: article.cover,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();
  const article = articles[index];
  const next = articles[(index + 1) % articles.length];
  const recommended = articles.filter((a) => a.slug !== article.slug && a.slug !== next.slug).slice(0, 3);

  return (
    <article className="bg-background gutter pb-32 pt-36 text-foreground md:pt-44">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          image: absoluteUrl(article.cover),
          datePublished: article.date,
          dateModified: article.date,
          articleSection: article.category,
          mainEntityOfPage: absoluteUrl(`/media/${article.slug}`),
          author: { "@id": `${site.url}/#organization` },
          publisher: { "@id": `${site.url}/#organization` },
        }}
      />
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-[11px] text-muted">
          <Link href="/media" className="hover:text-foreground">
            Media
          </Link>{" "}
          / {article.category}
        </p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl font-medium leading-[1.06] md:text-6xl">{article.title}</h1>
        <ArticleMeta article={article} className="mt-3" />

        <div className="mt-6 aspect-[2.2/1] overflow-hidden rounded-[12px] bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover}
            alt=""
            data-scroll=""
            data-scroll-speed="-0.06"
            className="h-full w-full scale-[1.12] object-cover"
          />
        </div>

        <ArticleBody article={article} />

        <Link
          href={`/media/${next.slug}`}
          className="group mt-28 grid overflow-hidden rounded-[12px] bg-ink text-ink-foreground md:grid-cols-[1fr_1.2fr]"
        >
          <div className="aspect-[3/2] overflow-hidden md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={next.cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </div>
          <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
            <p className="font-mono text-[12px] text-ink-muted">Next article</p>
            <div>
              <p className="font-serif text-3xl font-medium leading-tight md:text-5xl">{next.title}</p>
              <p className="mt-4 line-clamp-2 text-[15px] leading-relaxed text-ink-foreground/70">{next.excerpt}</p>
            </div>
            <span aria-hidden="true" className="text-3xl transition-transform duration-300 group-hover:translate-x-3">
              →
            </span>
          </div>
        </Link>

        <section className="mt-28">
          <h2 className="font-serif text-4xl font-medium leading-none md:text-6xl">Keep reading</h2>
          <div className="mt-12 grid grid-cols-1 items-start gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {recommended.map((item) => (
              <MediaCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
