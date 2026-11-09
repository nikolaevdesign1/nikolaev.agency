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
                    : "border-foreground/80 text-foreground hover:border-foreground hover:bg-foreground/5"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-muted">
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
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted">
            04 / What do you have in mind?* (a few sentences are enough. No
            polished brief needed.)
          </p>
          <span className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted">
            {message.length}/{MESSAGE_MAX}
          </span>
        </div>
      </label>

      <div className="flex flex-col gap-2">
        <label className="group flex w-fit cursor-pointer items-center gap-2 border-b border-foreground/40 pb-1 font-mono text-[11px] tracking-[0.14em] text-muted transition-colors hover:border-foreground hover:text-foreground">
          <input
            type="file"
            name="attachment"
            className="sr-only"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <span aria-hidden>+</span>
          {file ? file.name : "Attach a file (optional)"}
        </label>
        {file && (
          <button
            type="button"
            onClick={() => setFile(null)}
            className="w-fit font-mono text-[11px] tracking-[0.14em] text-muted underline-offset-2 hover:text-foreground hover:underline"
          >
            Remove attachment
          </button>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full max-w-[21rem] rounded bg-foreground py-5 text-center font-sans text-[11px] font-medium uppercase text-background ring-1 ring-black/10 transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
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
