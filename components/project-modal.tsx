"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const stroke = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const btn =
  "flex size-10 items-center justify-center rounded-[6px] bg-foreground/[0.07] text-foreground transition-colors hover:bg-foreground hover:text-background";

export function ProjectModal({
  title,
  slug,
  intercepted = false,
  children,
}: {
  title: string;
  slug: string;
  intercepted?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const close = () => (intercepted ? router.back() : router.push("/projects"));

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-layer-open", "");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.documentElement.removeAttribute("data-layer-open");
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, intercepted]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      data-project-modal=""
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] bg-black/60 pt-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        data-lenis-prevent
        className="relative h-full w-full animate-[modal-in_520ms_cubic-bezier(0.22,1,0.36,1)_both] overflow-y-auto rounded-t-[12px] bg-background"
      >
        <div className="sticky top-0 z-20 flex items-center justify-between gap-6 bg-background/90 px-[var(--gutter)] py-3 backdrop-blur">
          <p className="truncate font-serif text-xl text-foreground">{title}</p>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" aria-label={copied ? "Link copied" : "Copy link"} onClick={share} className={btn}>
              <svg {...stroke}>
                <path d="M4 12v7h16v-7M12 3v12M7.5 7.5 12 3l4.5 4.5" />
              </svg>
            </button>
            <Link href={`/projects/${slug}`} target="_blank" aria-label="Open in new tab" className={btn}>
              <svg {...stroke}>
                <path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" />
              </svg>
            </Link>
            <button type="button" aria-label="Close" onClick={close} className={btn}>
              <svg {...stroke}>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
