import type { Media } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

/** Renders one image or one video. Videos play inline, muted, on a loop. */
export function MediaView({ media, className }: { media: Media; className?: string }) {
  if (media.type === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={cn("block h-auto w-full", className)}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.src}
      alt={media.alt ?? ""}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn("block h-auto w-full select-none", className)}
    />
  );
}
