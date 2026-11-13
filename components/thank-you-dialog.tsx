"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Centered confirmation that fades and scales in over a dimmed page.
 * Closes on the button, a click on the backdrop and Esc; focus returns to where it was.
 */
export function ThankYouDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = window.setTimeout(() => setMounted(false), 400);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return (
    <div
      className={`fixed inset-0 z-[120] grid place-items-center bg-black/45 px-[var(--gutter)] transition-opacity duration-400 ease-out ${
        shown ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thank-you-title"
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-md rounded-[12px] bg-background p-8 text-foreground shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-10 ${
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.97] opacity-0"
        }`}
      >
        <p id="thank-you-title" className="font-serif text-4xl font-medium leading-tight">
          Thank you for your message
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">We will get back to you soon.</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="mt-8 rounded-[6px] bg-foreground px-8 py-3 font-sans text-[12px] font-medium text-background transition-opacity hover:opacity-85"
        >
          Close
        </button>
      </div>
    </div>
  );
}
