"use client";

import { useState } from "react";
import { site } from "@/lib/data/site";

/** "Coming soon" plaque for the project grid with an email subscription. */
export function UpcomingPlaque() {
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

  return (
    <div className="flex aspect-[4/3] flex-col justify-between rounded-[6px] bg-surface/60 p-6 md:p-8">
      <p className="font-mono text-[11px] text-muted">Next</p>
      <div>
        <p className="font-serif text-4xl font-medium leading-none text-foreground md:text-5xl">
          {site.upcoming.count} projects
        </p>
        <p className="mt-2 font-serif text-4xl font-medium leading-none text-muted md:text-5xl">
          coming soon
        </p>
        <p className="mt-4 font-mono text-[11px] text-muted">{site.upcoming.month}</p>

        {status === "done" ? (
          <p className="mt-6 font-mono text-[12px] text-foreground">
            Subscribed. We&apos;ll write when they ship.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-wrap gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              aria-label="Email for updates"
              className="min-w-0 flex-1 basis-44 rounded-[4px] bg-background px-3 py-2.5 font-mono text-[12px] text-foreground outline-none placeholder:text-muted focus:ring-1 focus:ring-foreground/40"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-[4px] bg-foreground px-4 py-2.5 font-mono text-[12px] text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Subscribe"}
            </button>
            {error ? <p className="basis-full font-mono text-[11px] text-red-600">{error}</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
