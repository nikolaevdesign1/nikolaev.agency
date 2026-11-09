import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/data/media";
import { RichText } from "@/components/rich-text";
import { ServiceBanner } from "@/components/service-banner";

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
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.cover],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
  const recommended = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const midpoint = Math.ceil(article.content.length / 2);

  return (
    <article className="bg-background px-6 pb-28 pt-36 text-foreground md:px-10 md:pt-44">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        <Link href="/media" className="hover:text-foreground">
          Media
        </Link>{" "}
        / {article.category}
      </p>
      <h1 className="mt-6 max-w-3xl font-serif text-4xl font-medium leading-[1.08] tracking-tight md:text-6xl">
        {article.title}
      </h1>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {formatDate(article.date)} · {article.readMinutes} min read
      </p>

      <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.cover} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        {article.content.slice(0, midpoint).map((block, i) => (
          <ArticleBlock key={i} block={block} />
        ))}

        <ServiceBanner />

        {article.content.slice(midpoint).map((block, i) => (
          <ArticleBlock key={midpoint + i} block={block} />
        ))}

        <div className="mt-12 border-t border-border pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Also published on
          </p>
          <ul className="mt-3 flex flex-wrap gap-5">
            {article.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:text-foreground"
                >
                  {social.label}
                  <span aria-hidden>→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ServiceBanner />
      </div>

      <Link
        href={`/media/${next.slug}`}
        className="mx-auto mt-16 flex max-w-2xl items-center justify-between gap-6 border-y border-border py-6 transition-colors hover:text-accent"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Next article
        </span>
        <span className="font-serif text-2xl font-medium tracking-tight">{next.title}</span>
        <span aria-hidden className="text-2xl">
          →
        </span>
      </Link>

      <div className="mx-auto mt-16 max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Recommended
        </p>
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-3">
          {recommended.map((item) => (
            <Link
              key={item.slug}
              href={`/media/${item.slug}`}
              className="group block h-full bg-background"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.cover}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {item.category}
                </p>
                <p className="mt-1.5 font-serif text-lg font-medium leading-snug tracking-tight text-foreground">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

function ArticleBlock({
  block,
}: {
  block: { type: "p" | "h2" | "image"; text?: string; src?: string; alt?: string };
}) {
  if (block.type === "h2") {
    return (
      <h2 className="mt-10 font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
        {block.text}
      </h2>
    );
  }
  if (block.type === "image") {
    return (
      <div className="my-8 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.src} alt={block.alt ?? ""} className="w-full object-cover" />
      </div>
    );
  }
  return (
    <RichText
      text={block.text ?? ""}
      className="mt-5 leading-relaxed text-foreground/90 first:mt-0"
    />
  );
}
