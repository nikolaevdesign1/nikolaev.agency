"use client";

import { useEffect, useRef, useState } from "react";
import { DotField } from "@/components/dot-field";
import { directions, serviceTints, type Direction } from "@/lib/data/services";

const ROW_COUNT = 4;
const CARD_W = 300;

function rows() {
  return Array.from({ length: ROW_COUNT }, (_, row) =>
    directions.filter((_, index) => index % ROW_COUNT === row),
  );
}

function Marks() {
  // registration crosses and ticks, very faint
  const crosses = [
    "left-[var(--gutter)] top-8",
    "right-[var(--gutter)] top-8",
    "left-[var(--gutter)] bottom-8",
    "right-[var(--gutter)] bottom-8",
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {crosses.map((pos) => (
        <span key={pos} className={`absolute ${pos} font-mono text-sm leading-none text-foreground/25`}>
          +
        </span>
      ))}
      <div className="absolute inset-x-[var(--gutter)] top-8 flex justify-between font-mono text-[10px] text-foreground/25">
        <span className="ml-6">services / 12</span>
        <span className="mr-6">hover to read</span>
      </div>
      <div className="absolute inset-x-[var(--gutter)] bottom-8 h-2 bg-[repeating-linear-gradient(90deg,rgba(35,35,35,0.18)_0_1px,transparent_1px_24px)]" />
    </div>
  );
}

export function ServicesGrid() {
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<{ direction: Direction; tint: string } | null>(null);
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

  const moveCard = (event: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const h = card.offsetHeight;
    let x = event.clientX + 22;
    let y = event.clientY + 22;
    if (x + CARD_W + 12 > window.innerWidth) x = event.clientX - CARD_W - 22;
    if (y + h + 12 > window.innerHeight) y = event.clientY - h - 22;
    card.style.transform = `translate3d(${Math.max(8, x)}px, ${Math.max(8, y)}px, 0)`;
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={moveCard}
      onPointerLeave={() => {
        setHovered(null);
        setActive(null);
      }}
      className="bg-dot-grid relative overflow-hidden border-t-2 border-border py-40 md:py-56"
    >
      <DotField />
      <Marks />
      <div className="relative flex flex-col gap-1">
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
                      const isActive = hovered === id;
                      return (
                        <span
                          key={id}
                          onPointerEnter={(event) => {
                            setHovered(id);
                            setActive({
                              direction,
                              tint: serviceTints[directions.indexOf(direction) % serviceTints.length],
                            });
                            moveCard(event);
                          }}
                          onPointerLeave={() => {
                            setHovered(null);
                            setActive(null);
                          }}
                          className={`cursor-pointer whitespace-nowrap px-2 text-4xl font-medium leading-none transition-[filter,color] duration-300 sm:text-5xl md:text-7xl ${
                            isActive ? "text-black blur-none" : "text-foreground/35 blur-[5px]"
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

      <div
        ref={cardRef}
        aria-hidden="true"
        style={{ width: CARD_W, backgroundColor: active?.tint ?? "#dde9ae" }}
        className={`pointer-events-none fixed left-0 top-0 z-30 rounded-[8px] p-5 text-[#141414] shadow-[0_18px_40px_rgba(0,0,0,0.14)] transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      >
        {active ? (
          <>
            <p className="font-serif text-2xl font-medium leading-none">{active.direction.label}</p>
            <p className="mt-3 text-[13px] leading-snug text-[#141414]/75">
              {active.direction.description}
            </p>
            <ul className="mt-4 flex flex-col gap-1.5 border-t border-black/15 pt-3 font-mono text-[12px]">
              {active.direction.popular.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1 rounded-[1px] bg-[#141414]" />
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
