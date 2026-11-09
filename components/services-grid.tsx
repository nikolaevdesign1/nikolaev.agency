"use client";

import { useEffect, useRef, useState } from "react";
import { directions } from "@/lib/data/services";

const ROW_COUNT = 4;

function rows() {
  return Array.from({ length: ROW_COUNT }, (_, row) =>
    directions.filter((_, index) => index % ROW_COUNT === row),
  );
}

export function ServicesGrid() {
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const sets = rows();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let drift = 0;

    const tick = () => {
      if (!reduce) drift += 0.85;
      const scroll = window.scrollY;
      tracks.current.forEach((track, index) => {
        if (!track) return;
        const segment = track.scrollWidth / 2;
        if (!segment) return;
        const speed = 0.65 + index * 0.22;
        const travel = ((drift + scroll * 0.45) * speed) % segment;
        const offset = index % 2 === 0 ? travel - segment : -travel;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      });
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative overflow-hidden border-t-2 border-border py-24 md:py-32">
      <div className="flex flex-col gap-1">
        {sets.map((items, row) => {
          const loop = Array.from({ length: 6 }, () => items).flat();
          return (
            <div key={row} className="overflow-hidden">
              <div
                ref={(node) => {
                  tracks.current[row] = node;
                }}
                className="flex w-max"
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center gap-x-10 pr-10">
                    {loop.map((direction, index) => {
                      const id = `${row}-${copy}-${direction.label}-${index}`;
                      const active = hovered === id;
                      return (
                        <span
                          key={id}
                          onMouseEnter={() => setHovered(id)}
                          onMouseLeave={() => setHovered(null)}
                          className={`cursor-default whitespace-nowrap px-2 text-4xl font-medium leading-none tracking-tight transition-[filter,color] duration-300 sm:text-5xl md:text-7xl ${
                            active
                              ? "text-black blur-none"
                              : "text-foreground/35 blur-[5px]"
                          }`}
                        >
                          {direction.label}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
