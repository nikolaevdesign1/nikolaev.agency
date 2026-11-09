"use client";

import { useState } from "react";
import { PillArrow, pillClass } from "@/components/button";

type Status = "idle" | "submitting" | "success" | "error";

const reasons = [
  "New project",
  "Existing product",
  "Ongoing design support",
  "Job opportunity",
  "Something else",
];

const fieldClass =
  "w-full border-0 border-b border-foreground/80 bg-transparent pb-2 font-serif text-lg leading-snug text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground md:text-xl md:leading-snug";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (reason) formData.set("reason", reason);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Something went wrong. Try again.");

      setStatus("success");
      form.reset();
      setReason(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className="max-w-md font-serif text-3xl font-medium leading-snug tracking-tight text-foreground">
        Thanks — your message is in. We reply to every inquiry within two
        business days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
        <Field
          index="01"
          label="Your name"
          name="name"
          placeholder="How should I address you?"
          required
        />
        <Field
          index="02"
          label="Email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
        />
      </div>

      <div>
        <div className="flex flex-wrap gap-3">
          {reasons.map((item) => {
            const active = reason === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setReason(active ? null : item)}
                className={`rounded border px-4 py-1.5 font-serif text-base transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/80 text-foreground hover:border-foreground"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          03 / What brings you here? (optional)
        </p>
      </div>

      <label className="flex flex-col">
        <textarea
          name="message"
          required
          rows={1}
          placeholder="What are you working on, and where could I help?"
          className={`${fieldClass} resize-none`}
        />
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          04 / What do you have in mind?* (a few sentences are enough. No
          polished brief needed.)
        </p>
      </label>

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`${pillClass} h-[3.75rem] w-full max-w-[21rem] justify-center transition-colors hover:bg-white/90 disabled:opacity-60`}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
          <PillArrow />
        </button>
        {error && (
          <span className="font-mono text-xs uppercase tracking-wider text-accent-red">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({
  index,
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  index: string;
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col">
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
      />
      <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-muted">
        {index} / {label}
        {required ? "*" : ""}
      </p>
    </label>
  );
}
