"use client";

import { StatusPage } from "@/components/status-page";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusPage
      code="500"
      title="Something broke on our side."
      text="Try again in a moment. If it keeps happening, tell us in the chat and we will fix it."
      action={
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded bg-foreground px-5 py-2.5 font-sans text-[11px] font-medium text-background transition-opacity hover:opacity-80"
        >
          Try again
        </button>
      }
    />
  );
}
