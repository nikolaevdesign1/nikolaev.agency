"use client";

import { useEffect, useRef, useState } from "react";
import { AccentMark } from "@/components/accent-mark";

type HeroVideoProps = {
  src?: string;
  poster?: string;
};

export function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [glitching, setGlitching] = useState(false);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let glitchTimeout: number;
    let freezeTimeout: number;

    function scheduleGlitch() {
      const delay = 2800 + Math.random() * 4200;
      glitchTimeout = window.setTimeout(() => {
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 220);
        scheduleGlitch();
      }, delay);
    }

    function scheduleFreeze() {
      const delay = 6000 + Math.random() * 8000;
      freezeTimeout = window.setTimeout(() => {
        setFrozen(true);
        videoRef.current?.pause();
        window.setTimeout(() => {
          setFrozen(false);
          videoRef.current?.play().catch(() => {});
        }, 900);
        scheduleFreeze();
      }, delay);
    }

    scheduleGlitch();
    scheduleFreeze();

    return () => {
      window.clearTimeout(glitchTimeout);
      window.clearTimeout(freezeTimeout);
    };
  }, []);

  return (
    <div
      className={`group relative h-screen w-full overflow-hidden bg-ink ${glitching ? "glitching" : ""}`}
    >
      <div className={`glitch-layer absolute inset-0 ${frozen ? "frozen" : ""}`}>
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-dot-grid-ink bg-ink">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className="glitch-red pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="glitch-cyan pointer-events-none absolute inset-0"
      />

      {/* true-color accent mark — kept outside the blend layer so the red reads as red */}
      <div className="pointer-events-none absolute bottom-6 left-6 md:bottom-10 md:left-10">
        <AccentMark size={28} />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-6 mix-blend-difference md:p-10">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-foreground">
          Scroll
        </span>
      </div>
    </div>
  );
}
