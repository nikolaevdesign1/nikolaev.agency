"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CursorFollowCta } from "@/components/cursor-follow-cta";

type Box = { top: number; left: number; width: number; height: number };

export function ExpandableVideo({ src, className }: { src: string; className?: string }) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [open, setOpen] = useState(false);

  const openIt = () => {
    const rect = thumbRef.current?.getBoundingClientRect();
    if (!rect) return;
    setBox({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  const closeIt = useCallback(() => {
    const rect = thumbRef.current?.getBoundingClientRect();
    if (rect) {
      setBox({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
    setOpen(false);
    window.setTimeout(() => setBox(null), 520);
  }, []);

  useEffect(() => {
    if (!box) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeIt();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.setAttribute("data-layer-open", "");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-layer-open");
    };
  }, [box, closeIt]);

  const style = open
    ? { top: 0, left: 0, width: "100vw", height: "100vh" }
    : box
      ? { top: box.top, left: box.left, width: box.width, height: box.height }
      : undefined;

  return (
    <>
      <CursorFollowCta label="Play" className={className}>
        <div
          ref={thumbRef}
          role="button"
          tabIndex={0}
          aria-label="Open video"
          onClick={openIt}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") openIt();
          }}
          className="aspect-video cursor-pointer overflow-hidden rounded-[6px] border border-ink-border bg-black/40 transition-transform duration-300 hover:scale-[1.02]"
        >
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
      </CursorFollowCta>

      {box
        ? createPortal(
            <div
              className="fixed z-[150] overflow-hidden bg-black transition-[top,left,width,height,border-radius] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{ ...style, borderRadius: open ? 0 : 6 }}
            >
              <video
                src={src}
                autoPlay
                loop
                controls
                playsInline
                className="h-full w-full object-contain"
              />
              <button
                type="button"
                aria-label="Close video"
                onClick={closeIt}
                className={`absolute right-5 top-5 flex h-10 items-center gap-2 rounded-full bg-black/40 px-4 font-mono text-[12px] text-white ring-1 ring-white/20 backdrop-blur-md transition-[opacity,background-color,color] duration-300 hover:bg-white hover:text-black ${
                  open ? "opacity-100" : "opacity-0"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
                Close
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
