"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Tag = as;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => {
              node.dataset.revealed = "true";
            }, delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref as never}
      data-revealed="false"
      className={cn(
        "translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-out",
        "data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
