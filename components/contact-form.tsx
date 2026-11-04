"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const budgets = ["< $10k", "$10k – $25k", "$25k – $75k", "$75k+"];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
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
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className="max-w-md text-2xl font-medium leading-snug tracking-tight text-foreground">
        Thanks — your message is in. We reply to every inquiry within two
        business days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-10">
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Company" name="company" />

      <div>
        <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          Budget
        </span>
        <div className="mt-4 flex flex-wrap gap-3">
          {budgets.map((budget) => (
            <label
              key={budget}
              className="cursor-pointer rounded-full border-2 border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground/70 transition-colors has-checked:border-accent has-checked:text-accent"
            >
              <input
                type="radio"
                name="budget"
                value={budget}
                className="sr-only"
              />
              {budget}
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          Project details
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none border-0 border-b-2 border-border bg-transparent py-2 text-xl text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-accent"
          placeholder="Tell us what you're building"
        />
      </label>

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-3 rounded-full border-2 border-border px-6 py-3 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
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
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-4">
      <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="border-0 border-b-2 border-border bg-transparent py-2 text-xl text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-accent"
      />
    </label>
  );
}
