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

const STORAGE_KEY = "studio-chat-history";

function Orb({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative size-28 shrink-0 overflow-hidden rounded-full transition-transform duration-700 md:size-36 ${
        active ? "scale-110" : "scale-100"
      }`}
      style={{ boxShadow: "0 0 60px rgba(240,150,55,0.25)" }}
    >
      <div
        className="absolute -inset-1/4 animate-[orb-spin_9s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, #f09637, #e1b8ef, #c3eec5, #dde9ae, #dfbcab, #f09637)",
          filter: "blur(18px)",
        }}
      />
      <div
        className="absolute inset-[18%] animate-[orb-spin_6s_linear_infinite_reverse] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)",
          filter: "blur(6px)",
        }}
      />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_80%,rgba(10,10,10,0.55),transparent_60%)]" />
    </div>
  );
}

function Typed({ text, animate }: { text: string; animate: boolean }) {
  const [shown, setShown] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const timer = window.setInterval(() => {
      i += 2;
      setShown(Math.min(text.length, i));
      if (i >= text.length) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [text, animate]);

  return <MessageBody content={text.slice(0, shown)} />;
}

function MessageBody({ content }: { content: string }) {
  const parts = content.split(/(\/contact|info@nikolaev\.agency)/g);
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
  const [fresh, setFresh] = useState<number>(-1);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const pendingRef = useRef(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw) as Turn[]);
    } catch {
      /* no history */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* storage blocked */
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const timer = window.setTimeout(() => setMounted(false), 450);
    return () => window.clearTimeout(timer);
  }, [open]);

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
      setFresh(history.length);
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

  function clearHistory() {
    setMessages([]);
    setFresh(-1);
    setError(null);
  }

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-chat-title"
      className={`fixed inset-0 z-[100] flex bg-ink text-ink-foreground transition-[opacity,transform] duration-500 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      onWheel={(event) => event.stopPropagation()}
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col gutter">
        <header className="flex items-start justify-between gap-6 py-5">
          <div>
            <h2 id="studio-chat-title" className="font-serif text-2xl font-medium leading-none">
              Let&apos;s chat
            </h2>
            <p className="mt-2 font-mono text-[11px] text-ink-muted">
              Answers from the site. Inquiries are drafted, not sent.
            </p>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={clearHistory}
                className="text-ink-muted transition-colors hover:text-ink-foreground"
              >
                Clear
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-[4px] border border-ink-border px-3 py-1.5 text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink"
            >
              Close
            </button>
          </div>
        </header>

        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 pb-4 text-center">
              <Orb active={pending} />
              <div>
                <p className="font-serif text-2xl text-ink-muted md:text-3xl">Hi there,</p>
                <p className="font-serif text-3xl font-medium leading-tight md:text-5xl">
                  How can I help today?
                </p>
              </div>
              <div className="mt-2 grid w-full gap-2 md:grid-cols-3">
                {starters.map((line) => (
                  <button
                    key={line}
                    type="button"
                    onClick={() => send(line)}
                    className="rounded-[6px] border border-ink-border px-4 py-4 text-left text-sm text-ink-foreground/80 transition-colors hover:border-ink-foreground/40 hover:bg-ink-foreground/5 hover:text-ink-foreground"
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
                    className="ml-auto max-w-[85%] rounded-[6px] bg-ink-foreground/10 px-4 py-3"
                  >
                    <MessageBody content={message.content} />
                  </div>
                ) : (
                  <div key={index} className="max-w-xl text-ink-foreground">
                    <Typed text={message.content} animate={index === fresh} />
                  </div>
                ),
              )}
              {pending ? (
                <div className="flex items-center gap-3">
                  <div className="size-6 overflow-hidden rounded-full">
                    <div
                      className="size-full animate-[orb-spin_2s_linear_infinite]"
                      style={{
                        background:
                          "conic-gradient(#f09637, #e1b8ef, #c3eec5, #f09637)",
                      }}
                    />
                  </div>
                  <p className="text-sm text-ink-muted">Thinking…</p>
                </div>
              ) : null}
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
          <div className="flex items-end gap-2 rounded-[8px] border border-ink-border bg-ink-foreground/5 px-3 py-2">
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
              placeholder="Ask me anything…"
              className="max-h-40 w-full resize-none bg-transparent py-2 font-sans text-sm leading-relaxed text-ink-foreground outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="mb-1 shrink-0 rounded-[6px] bg-accent px-4 py-2 font-mono text-[12px] text-ink transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
