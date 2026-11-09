import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  reverse?: boolean;
};

export function Marquee({ items, className, reverse = false }: MarqueeProps) {
  const content = items.join("  /  ") + "  /  ";

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden border-y-2 border-border py-5",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-0 whitespace-nowrap font-mono text-sm text-muted",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        <span className="pr-0">{content}</span>
        <span aria-hidden="true">{content}</span>
      </div>
    </div>
  );
}
