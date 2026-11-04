"use client";

import { useEffect } from "react";
import { AccentMark } from "@/components/accent-mark";

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100]"
      aria-hidden={!open}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="AI assistant"
        className="absolute right-0 top-0 flex h-full w-full flex-col justify-between border-l-2 border-ink-border bg-ink p-6 text-ink-foreground transition-transform duration-300 ease-out md:w-[26rem] md:p-10"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Let&apos;s talk
            </span>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-wider text-ink-foreground"
            >
              Close
            </button>
          </div>

          <div className="mt-16 flex flex-col items-start gap-6">
            <AccentMark size={32} />
            <p className="max-w-xs text-2xl font-medium leading-snug tracking-tight">
              The AI assistant is still warming up.
            </p>
            <p className="max-w-xs text-ink-muted">
              For now, email us directly or use the contact form — we reply
              within two business days.
            </p>
          </div>
        </div>

        <a
          href="/contact"
          onClick={onClose}
          className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-ink-border px-6 py-3 font-mono text-xs uppercase tracking-wider text-ink-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Go to contact form
        </a>
      </div>
    </div>
  );
}
