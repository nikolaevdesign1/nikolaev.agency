"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { ProjectCover } from "@/components/project-cover";

type Tab = "info" | "elements";

function IconButton({
  label,
  children,
  onClick,
  href,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "flex size-10 items-center justify-center rounded-[6px] border border-border bg-background text-foreground transition-colors hover:bg-foreground hover:text-background";
  if (href) {
    return (
      <Link href={href} target="_blank" aria-label={label} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

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

export function ProjectModal({
  project,
  index,
  intercepted = false,
}: {
  project: Project;
  index: number;
  intercepted?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("info");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const close = () => (intercepted ? router.back() : router.push("/projects"));

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "info", label: "Info" },
    { id: "elements", label: "Elements" },
  ];

  return (
    <div
      data-project-modal=""
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 pt-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        data-lenis-prevent
        className="relative h-full w-full animate-[modal-in_520ms_cubic-bezier(0.22,1,0.36,1)_both] overflow-y-auto rounded-t-[12px] border border-b-0 border-border bg-background"
      >
        <div className="flex items-start justify-between gap-6 gutter pt-8 md:pt-10">
          <div className="min-w-0">
            <p className="font-mono text-[11px] text-muted">
              {project.category} · {project.year}
            </p>
            <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.02] md:text-7xl">
              {project.title}
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-ink font-mono text-xs text-ink-foreground"
              >
                {site.name.charAt(0)}
              </span>
              <p className="text-sm text-muted">
                by <span className="text-foreground">{site.name}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <IconButton label={saved ? "Remove bookmark" : "Bookmark"} onClick={() => setSaved((s) => !s)}>
              <svg {...stroke} fill={saved ? "currentColor" : "none"}>
                <path d="M6 4h12v17l-6-4-6 4V4z" />
              </svg>
            </IconButton>
            <IconButton label={copied ? "Link copied" : "Share"} onClick={share}>
              <svg {...stroke}>
                <path d="M4 12v7h16v-7M12 3v12M7.5 7.5 12 3l4.5 4.5" />
              </svg>
            </IconButton>
            <IconButton label="Open in new tab" href={`/projects/${project.slug}`}>
              <svg {...stroke}>
                <path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" />
              </svg>
            </IconButton>
          </div>
        </div>

        <div className="gutter pb-32 pt-8">
          <div className="overflow-hidden rounded-lg border border-border">
            <ProjectCover project={project} index={index} className="aspect-[16/9] rounded-none border-0" />
          </div>

          {tab === "info" ? (
            <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
              <p className="max-w-2xl text-lg leading-relaxed">{project.summary}</p>
              <dl className="space-y-4 font-mono text-[11px]">
                <div>
                  <dt className="text-muted">Client</dt>
                  <dd className="mt-1">{project.client}</dd>
                </div>
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="mt-1">{project.location}</dd>
                </div>
                <div>
                  <dt className="text-muted">Year</dt>
                  <dd className="mt-1">{project.year}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <ul className="mt-10 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <li
                  key={service}
                  className="rounded-[6px] border border-border px-4 py-2 font-mono text-[11px]"
                >
                  {service}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pointer-events-none sticky bottom-5 z-10 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-border bg-background p-2 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
            <Link href="/" aria-label="Home" className="px-3 font-serif text-lg font-semibold">
              n.
            </Link>
            <span aria-hidden="true" className="h-6 w-px bg-border" />
            <div role="tablist" className="flex items-center gap-1">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`rounded-md px-4 py-2 text-sm transition-colors ${
                    tab === item.id ? "bg-foreground text-background" : "hover:bg-foreground/8"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {project.url ? (
              <Link
                href={project.url}
                target="_blank"
                className="rounded-md bg-ink px-5 py-2 text-sm text-ink-foreground transition-opacity hover:opacity-80"
              >
                Visit site
              </Link>
            ) : null}
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-foreground hover:text-background"
            >
              <svg {...stroke}>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
