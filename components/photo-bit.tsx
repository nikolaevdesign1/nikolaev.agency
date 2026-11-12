"use client";

import { useEffect, useRef } from "react";

type PhotoBitProps = {
  src: string;
  title: string;
  seed?: number;
  theme?: "light" | "dark";
  /** Cover video; plays muted on a loop while the cell is on screen. `src` is its poster. */
  video?: string;
  /** False when `src` is only a placeholder: the video's own first frame is better then. */
  hasPoster?: boolean;
};

export function PhotoBit({ src, title, theme = "light", video, hasPoster = true }: PhotoBitProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only cells on screen play; the field can hold many copies of the same project.
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void node.play().catch(() => {});
      else node.pause();
    });
    io.observe(node);
    return () => io.disconnect();
  }, [video]);

  return (
    <div
      className="h-full w-full cursor-pointer"
      style={{ background: theme === "dark" ? "#141414" : "#f3f1ea" }}
    >
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={hasPoster ? src : undefined}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={title}
          className="pointer-events-none h-full w-full select-none object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}
