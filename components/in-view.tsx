"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sets `data-shown` on itself the first time it enters the viewport, which starts the
 * `.reveal-line` / `.reveal-fade` / `.reveal-type` transitions inside it. It stays shown while mounted.
 */
export function InView({
  as: Tag = "div",
  className,
  style,
  margin = "0px 0px -8% 0px",
  children,
}: {
  as?: "div" | "section" | "li" | "span" | "p" | "ul" | "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
  margin?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shown, margin]);

  const Element = Tag as React.ElementType;
  return (
    <Element ref={ref} className={className} style={style} data-shown={shown ? "" : undefined}>
      {children}
    </Element>
  );
}
