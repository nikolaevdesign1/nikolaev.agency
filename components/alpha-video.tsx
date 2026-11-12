"use client";

import { useSyncExternalStore } from "react";

type AlphaVideoProps = {
  /** HEVC with alpha (.mov): the only transparent format Safari plays. */
  hevc: string;
  /** VP9 with alpha (.webm): Chrome, Firefox, Edge. */
  webm: string;
  label: string;
  className?: string;
};

const noop = () => () => {};

/** Safari (macOS and every iOS browser) plays alpha only from HEVC. */
function prefersHevc() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return true;
  return /Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\/|Firefox\//.test(ua);
}

/**
 * A looping video with a transparent background. Each browser plays alpha in only one of the two
 * formats and would show the other on black, so the source is picked here instead of by <source> order.
 */
export function AlphaVideo({ hevc, webm, label, className }: AlphaVideoProps) {
  const src = useSyncExternalStore(
    noop,
    () => (prefersHevc() ? hevc : webm),
    () => null,
  );

  if (!src) return <div aria-hidden="true" className={className} />;
  return (
    <video
      key={src}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
    />
  );
}
