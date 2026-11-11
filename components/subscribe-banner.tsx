"use client";

import { useState } from "react";

/** Dark subscribe block for nikolaev.media, with the running "( nikolaev.media )" strip on top. */
export function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const unit = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className={`shrink-0 px-6 ${i === 2 ? "text-accent" : ""}`}>
      ( nikolaev.media )
    </span>
  ));

  return (
    <div className="overflow-hidden rounded-[12px] bg-ink text-ink-foreground">
      <div aria-hidden="true" className="overflow-hidden border-b border-ink-foreground/15 py-2.5">
        <div className="flex w-max animate-marquee whitespace-nowrap font-sans text-sm font-semibold">
          <div className="flex">{unit}</div>
          <div className="flex">{unit}</div>
        </div>
      </div>
      <div className="grid gap-8 p-8 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-12 md:p-12">
        <div>
          <p className="font-serif text-4xl font-medium leading-[1.02] md:text-6xl">New notes, straight to your inbox</p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-foreground/70">
            Design, AI, and running a small studio. One email when something new is out.
          </p>
        </div>
        {status === "done" ? (
          <p className="font-mono text-[13px] text-ink-foreground">You&apos;re in. Thanks.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-wrap gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              aria-label="Email for updates"
              className="min-w-0 flex-1 basis-52 rounded-[6px] bg-ink-foreground/10 px-4 py-3 font-mono text-[13px] text-ink-foreground outline-none ring-1 ring-ink-foreground/15 placeholder:text-ink-muted focus:ring-ink-foreground/40"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-[6px] bg-white px-5 py-3 font-mono text-[13px] text-black transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Subscribe"}
            </button>
            {error ? <p className="basis-full font-mono text-[11px] text-accent">{error}</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
