/** Splits on **bold**, *italic* and [text](https://link) markers. No HTML: only these three shapes are ever drawn. */
function inline(text: string, keyPrefix: string) {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return (
        <a key={key} href={link[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-accent">
          {link[1]}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <span key={key}>{part}</span>;
  });
}

export function RichText({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: "p" | "span" }) {
  return <Tag className={className}>{inline(text, "t")}</Tag>;
}
