"use client";

import { useState } from "react";
type Status = "idle" | "submitting" | "success" | "error";

const reasons = [
  "New project",
  "Existing product",
  "Ongoing design support",
  "Job opportunity",
  "Something else",
];

const fieldClass =
  "w-full border-0 border-b border-foreground/80 bg-transparent pb-2 font-serif text-lg leading-snug text-foreground outline-none transition-colors placeholder:text-foreground/55 focus:border-foreground md:text-xl md:leading-snug";

const MESSAGE_MAX = 1000;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (reason) formData.set("reason", reason);
    if (file) formData.set("attachment", file);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Something went wrong. Try again.");

      setStatus("success");
      form.reset();
      setReason(null);
      setMessage("");
      setFile(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className="max-w-md font-serif text-3xl font-medium leading-snug text-foreground">
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
                    : "border-foreground/80 text-foreground hover:border-foreground hover:bg-foreground/5"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[11px] text-muted">
          03 / What brings you here? (optional)
        </p>
      </div>

      <label className="flex flex-col">
        <textarea
          name="message"
          required
          rows={1}
          maxLength={MESSAGE_MAX}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="What are you working on, and where could I help?"
          className={`${fieldClass} resize-none`}
        />
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="font-mono text-[11px] text-muted">
            04 / What do you have in mind?* (a few sentences are enough. No
            polished brief needed.)
          </p>
          <span className="shrink-0 font-mono text-[11px] text-muted">
            {message.length}/{MESSAGE_MAX}
          </span>
        </div>
      </label>

      <div className="flex flex-col gap-2">
        {file ? (
          <div className="flex w-fit max-w-full items-center gap-3 rounded-[6px] border border-foreground bg-foreground/5 px-3 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5 12.5 20a5.5 5.5 0 0 1-7.8-7.8l9-9a3.7 3.7 0 0 1 5.2 5.2l-9 9a1.8 1.8 0 0 1-2.6-2.6l8.3-8.3" />
            </svg>
            <span className="min-w-0 truncate text-sm text-foreground">{file.name}</span>
            <span className="shrink-0 font-mono text-[11px] text-muted">
              {file.size > 1048576
                ? `${(file.size / 1048576).toFixed(1)} MB`
                : `${Math.max(1, Math.round(file.size / 1024))} KB`}
            </span>
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={() => setFile(null)}
              className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border border-border transition-colors hover:bg-foreground hover:text-background"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        ) : (
          <label htmlFor="attachment" className="flex w-fit cursor-pointer items-center gap-2 rounded-[6px] border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-foreground">
            <span aria-hidden>+</span>
            Attach a file (optional)
          </label>
        )}
        <input
          type="file"
          id="attachment"
          name="attachment"
          className="sr-only"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-fit rounded-[6px] bg-foreground px-8 py-3 text-center font-sans text-[12px] font-medium text-background ring-1 ring-black/10 transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        {error && (
          <span className="font-mono text-xs text-accent-red">
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
      <p className="mt-3 font-mono text-[11px] text-muted">
        {index} / {label}
        {required ? "*" : ""}
      </p>
    </label>
  );
}
