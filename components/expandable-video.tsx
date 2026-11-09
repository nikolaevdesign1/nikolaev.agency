"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    return () => window.removeEventListener("keydown", onKey);
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
          className="aspect-video cursor-pointer overflow-hidden rounded-[6px] border border-ink-border bg-black/40 transition-transform duration-300 hover:scale-[1.03]"
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

      {box ? (
        <div
          className="fixed z-[70] overflow-hidden bg-black transition-[top,left,width,height,border-radius] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
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
            className={`absolute right-5 top-5 rounded-[6px] bg-white px-4 py-2 text-sm text-black transition-opacity duration-300 hover:opacity-80 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            Close
          </button>
        </div>
      ) : null}
    </>
  );
}
