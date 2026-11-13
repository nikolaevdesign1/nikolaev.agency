"use client";

import { useEffect, useState } from "react";
import { CONSENT_KEY as KEY, setAnalyticsConsent } from "@/lib/analytics";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      /* storage blocked */
    }
    const reopen = () => setVisible(true);
    window.addEventListener("studio:cookies", reopen);
    if (stored) return () => window.removeEventListener("studio:cookies", reopen);
    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("studio:cookies", reopen);
    };
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked */
    }
    setAnalyticsConsent(value === "accepted");
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

/** Clears the saved choice and shows the notice again (used on the Cookie policy page). */
export function CookieReset() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          /* storage blocked */
        }
        setAnalyticsConsent(false);
        window.dispatchEvent(new Event("studio:cookies"));
      }}
      className="rounded-[6px] bg-foreground px-4 py-2.5 font-mono text-[12px] text-background transition-opacity hover:opacity-80"
    >
      Change cookie choice
    </button>
  );
}
