"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/data/site";

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

type Turn = {
  role: "user" | "assistant";
  content: string;
};

const starters = [
  "What does the studio do?",
  "What work is on the site?",
  "I want to start a project",
];

function MessageBody({ content }: { content: string }) {
  const parts = content.split(/(\/contact|hello@nikolaev\.agency)/g);
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part === "/contact") {
          return (
            <Link key={index} href="/contact" className="underline underline-offset-4">
              /contact
            </Link>
          );
        }
        if (part === site.email) {
          return (
            <a
              key={index}
              href={`mailto:${site.email}`}
              className="underline underline-offset-4"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const pendingRef = useRef(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", handleKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [open, messages, pending, error]);

  async function request(history: Turn[]) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = (await res.json()) as { reply?: unknown; error?: unknown };
      if (!res.ok || typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error(typeof data.error === "string" ? data.error : "No reply.");
      }
      setMessages([...history, { role: "assistant", content: data.reply }]);
    } catch {
      setError("The reply didn't come through. Try again.");
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pendingRef.current) return;
    const next: Turn[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setDraft("");
    void request(next);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-chat-title"
      className="fixed inset-0 z-[100] flex bg-ink text-ink-foreground"
      onWheel={(event) => event.stopPropagation()}
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col px-6">
        <header className="flex items-start justify-between gap-6 py-5">
          <div>
            <h2
              id="studio-chat-title"
              className="font-serif text-2xl font-medium leading-none tracking-tight"
            >
              Let&apos;s chat
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              Answers from the site. Inquiries are drafted, not sent.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer font-mono text-xs uppercase tracking-wider text-ink-foreground"
          >
            Close
          </button>
        </header>

        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col justify-end pb-4">
              <p className="max-w-md font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                Ask about the studio, or start a brief.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {starters.map((line) => (
                  <button
                    key={line}
                    type="button"
                    onClick={() => send(line)}
                    className="rounded-[4px] border border-ink-border px-4 py-3 text-left font-sans text-sm text-ink-foreground/80 transition-colors hover:border-ink-foreground/40 hover:text-ink-foreground"
                  >
                    {line}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-2" aria-live="polite">
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <div
                    key={index}
                    className="ml-auto max-w-[85%] rounded-[4px] bg-ink-foreground/10 px-4 py-3"
                  >
                    <MessageBody content={message.content} />
                  </div>
                ) : (
                  <div key={index} className="max-w-xl text-ink-foreground">
                    <MessageBody content={message.content} />
                  </div>
                ),
              )}
              {pending ? <p className="text-sm text-ink-muted">…</p> : null}
              {error ? (
                <p className="text-sm text-accent">
                  {error}{" "}
                  <button
                    type="button"
                    onClick={() => void request(messages)}
                    className="underline underline-offset-4"
                  >
                    Retry
                  </button>
                </p>
              ) : null}
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(draft);
          }}
          className="pb-6"
        >
          <div className="flex items-end gap-2 rounded-[4px] border border-ink-border px-3 py-2">
            <label htmlFor="studio-chat-input" className="sr-only">
              Message
            </label>
            <textarea
              id="studio-chat-input"
              ref={inputRef}
              rows={2}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
              placeholder="Message the studio"
              className="max-h-40 w-full resize-none bg-transparent py-2 font-sans text-sm leading-relaxed text-ink-foreground outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="mb-1 shrink-0 rounded-[4px] bg-ink-foreground px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-ink transition-colors hover:bg-accent disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
