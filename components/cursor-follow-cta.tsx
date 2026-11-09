"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CursorFollowCtaProps = {
  label?: string;
  mode?: "block" | "cursor";
  className?: string;
  children: React.ReactNode;
};

type Slot = {
  el: HTMLElement;
  badge: HTMLElement;
  shown: boolean;
  setShown: (shown: boolean) => void;
};

const slots = new Set<Slot>();
const pointer = { x: 0, y: 0, seen: false };
let raf = 0;
let listening = false;
let pokeUntil = 0;

function place(slot: Slot, rect: DOMRect) {
  const badge = slot.badge;
  const width = badge.offsetWidth;
  const height = badge.offsetHeight;
  const pad = 8;
  const maxX = Math.max(pad, rect.width - width - pad);
  const maxY = Math.max(pad, rect.height - height - pad);
  const x = Math.min(Math.max(pad, pointer.x - rect.left + 12), maxX);
  const y = Math.min(Math.max(pad, pointer.y - rect.top + 12), maxY);
  badge.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function tick() {
  raf = 0;
  let active: Slot | null = null;

  if (pointer.seen) {
    for (const slot of slots) {
      const rect = slot.el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      const slop = slot.shown ? 1 : 0;
      const inside =
        pointer.x >= rect.left - slop &&
        pointer.x <= rect.right + slop &&
        pointer.y >= rect.top - slop &&
        pointer.y <= rect.bottom + slop;
      if (!inside) continue;
      active = slot;
      place(slot, rect);
      break;
    }
  }

  for (const slot of slots) {
    const on = slot === active;
    if (slot.shown === on) continue;
    slot.shown = on;
    slot.setShown(on);
  }

  if (active || performance.now() < pokeUntil) {
    raf = requestAnimationFrame(tick);
  }
}

function poke(ms = 900) {
  pokeUntil = Math.max(pokeUntil, performance.now() + ms);
  if (raf) return;
  raf = requestAnimationFrame(tick);
}

function ensureListen() {
  if (listening || typeof window === "undefined") return;
  listening = true;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.seen = true;
      poke(900);
    },
    { passive: true },
  );

  window.addEventListener(
    "pointerdown",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.seen = true;
      poke(1200);
    },
    { passive: true },
  );

  // The project field eases after a wheel tick while the pointer stays still.
  window.addEventListener("wheel", () => poke(1200), { passive: true });

  window.addEventListener("blur", () => {
    pointer.seen = false;
    pokeUntil = performance.now();
    poke(0);
  });

  document.addEventListener("pointerout", (event) => {
    if (event.relatedTarget) return;
    pointer.seen = false;
    pokeUntil = performance.now();
    poke(0);
  });
}

export function CursorFollowCta({
  label = "View case study",
  className,
  children,
}: CursorFollowCtaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    ensureListen();
    const el = rootRef.current;
    const badge = badgeRef.current;
    if (!el || !badge) return;

    const slot: Slot = { el, badge, shown: false, setShown };
    slots.add(slot);
    poke(0);

    return () => {
      slots.delete(slot);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {children}
      <span
        ref={badgeRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-30 inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] bg-ink px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.2em] text-ink-foreground",
          shown ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </span>
    </div>
  );
}
