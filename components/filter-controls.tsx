"use client";

import { useEffect, useRef, useState } from "react";

/** Segmented strip that hugs its buttons; fades its right edge only when it overflows. */
export function ScrollStrip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setFade(el.scrollWidth - el.clientWidth - el.scrollLeft > 2);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="min-w-0 max-w-full overflow-x-auto rounded-[6px] bg-surface/30 p-1"
      style={fade ? { maskImage: "linear-gradient(to right, #000 calc(100% - 28px), transparent)" } : undefined}
    >
      <div className="flex w-max">{children}</div>
    </div>
  );
}

export function FilterCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex shrink-0 items-center gap-2.5 rounded-[6px] px-2 py-2 text-[13px] text-foreground"
    >
      <span
        aria-hidden="true"
        className={`flex size-[18px] items-center justify-center rounded-[4px] border transition-colors duration-200 ${
          checked
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/40 bg-transparent group-hover:border-foreground"
        }`}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-[opacity,transform] duration-200 ${
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <path d="M2.5 6.5 5 9l4.5-5.5" />
        </svg>
      </span>
      {children}
    </button>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (next: string | null) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-w-[150px] items-center justify-between gap-4 rounded-[6px] bg-surface/30 px-3 py-2 text-[13px] text-foreground transition-colors duration-200 hover:bg-foreground/10"
      >
        <span className={value ? "" : "text-foreground/80"}>{value ?? label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
      </button>
      <div
        role="listbox"
        aria-label={label}
        className={`absolute right-0 top-[calc(100%+6px)] z-50 max-h-72 min-w-full origin-top-right overflow-y-auto rounded-[8px] border border-border bg-background p-1 shadow-[0_14px_36px_rgba(0,0,0,0.18)] transition-[opacity,transform] duration-200 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {[null, ...options].map((option) => {
          const active = option === value;
          return (
            <button
              key={option ?? "all"}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => pick(option)}
              className={`flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-[4px] px-3 py-2 text-left text-[13px] transition-colors ${
                active ? "bg-foreground text-background" : "text-foreground hover:bg-foreground/10"
              }`}
            >
              {option ?? `All ${label.toLowerCase()}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
