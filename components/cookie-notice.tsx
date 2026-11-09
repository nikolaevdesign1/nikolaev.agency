"use client";

import { useEffect, useState } from "react";

const KEY = "cookie-choice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      /* storage blocked */
    }
    if (stored) return;
    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked */
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      aria-hidden={!visible}
      className={`fixed bottom-4 left-[var(--gutter)] z-[60] w-[min(22rem,calc(100vw-2*var(--gutter)))] rounded-[8px] border border-border bg-background p-4 text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.14)] transition-[opacity,transform] duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <p className="text-sm leading-relaxed">
        We use cookies to keep the site working and to understand how it is used.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="rounded-[6px] bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-80"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("declined")}
          className="rounded-[6px] border border-border px-4 py-2 text-sm transition-colors hover:border-foreground"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
