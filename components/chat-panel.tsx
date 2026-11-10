"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoCube } from "@/components/logo-cube";
import { site } from "@/lib/data/site";

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

type Turn = {
  role: "user" | "assistant";
  content: string;
  files?: string[];
};

type Chat = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Turn[];
};

const STORAGE_KEY = "studio-chats";
const LEGACY_KEY = "studio-chat-history";

const suggestions = [
  {
    title: "What does the studio do?",
    hint: "Services, process, and how we work",
    icon: <path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z" />,
  },
  {
    title: "What work is on the site?",
    hint: "Case studies and recent projects",
    icon: <path d="M4 6h16v12H4zM4 14l4-4 4 4 3-3 5 5" />,
  },
  {
    title: "I want to start a project",
    hint: "Share a brief and get the next steps",
    icon: <path d="M12 4v16M4 12h16" />,
  },
];

const placeholders = [
  "Ask what the studio can build for you…",
  "How long does a website take?",
  "Tell me about your project…",
  "What does a design support plan include?",
];

function Orb({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative size-32 shrink-0 overflow-hidden rounded-full transition-transform duration-700 md:size-40 ${
        active ? "scale-110" : "scale-100"
      }`}
      style={{
        background: "radial-gradient(circle at 50% 50%, #2a2118, #0f0c09)",
        boxShadow:
          "0 0 70px rgba(240,150,55,0.28), inset 0 0 30px rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="absolute left-1/4 top-1/4 size-3/4 rounded-full mix-blend-screen"
        style={{
          background: "radial-gradient(circle, #f09637, rgba(240,150,55,0) 70%)",
          filter: "blur(10px)",
          animation: "orb-blob-a 7s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-0 top-1/3 size-4/5 rounded-full mix-blend-screen"
        style={{
          background: "radial-gradient(circle, #dcb2f0, rgba(220,178,240,0) 70%)",
          filter: "blur(12px)",
          animation: "orb-blob-b 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-1/3 top-0 size-3/4 rounded-full mix-blend-screen"
        style={{
          background: "radial-gradient(circle, #c3eec5, rgba(195,238,197,0) 70%)",
          filter: "blur(12px)",
          animation: "orb-blob-c 11s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -inset-[10%] opacity-60 mix-blend-overlay"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.5), transparent 40%, rgba(255,255,255,0.35), transparent 75%)",
          filter: "blur(8px)",
          animation: "orb-spin 10s linear infinite",
        }}
      />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.55),transparent_42%)]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_90%,rgba(10,10,10,0.5),transparent_55%)]" />
    </div>
  );
}

function TypingPlaceholder({ visible }: { visible: boolean }) {
  const [text, setText] = useState("");

  useEffect(() => {
    let phrase = 0;
    let index = 0;
    let deleting = false;
    let timer = 0;

    const step = () => {
      const full = placeholders[phrase] ?? "";
      if (!deleting) {
        index += 1;
        setText(full.slice(0, index));
        if (index >= full.length) {
          deleting = true;
          timer = window.setTimeout(step, 1700);
          return;
        }
        timer = window.setTimeout(step, 42);
      } else {
        index -= 1;
        setText(full.slice(0, Math.max(0, index)));
        if (index <= 0) {
          deleting = false;
          phrase = (phrase + 1) % placeholders.length;
          timer = window.setTimeout(step, 350);
          return;
        }
        timer = window.setTimeout(step, 18);
      }
    };
    timer = window.setTimeout(step, 500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-5 top-5 font-sans text-base text-ink-muted"
    >
      {text}
      <span className="ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-ink-muted [animation:caret-blink_1s_steps(1)_infinite]" />
    </span>
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
    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
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

function sizeLabel(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fresh, setFresh] = useState<number>(-1);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const pendingRef = useRef(false);
  const loadedRef = useRef(false);
  onCloseRef.current = onClose;

  const active = chats.find((chat) => chat.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setChats(JSON.parse(raw) as Chat[]);
      } else {
        const legacy = window.localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const turns = JSON.parse(legacy) as Turn[];
          const first = turns.find((turn) => turn.role === "user")?.content ?? "Earlier chat";
          if (turns.length) {
            setChats([
              { id: "legacy", title: first.slice(0, 40), updatedAt: Date.now(), messages: turns },
            ]);
          }
        }
      }
    } catch {
      /* no history */
    }
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0, 30)));
    } catch {
      /* storage blocked */
    }
  }, [chats]);

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
    document.documentElement.setAttribute("data-layer-open", "");
    inputRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
      document.documentElement.removeAttribute("data-layer-open");
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [open, messages, pending, error]);

  function patchChat(id: string, messagesNext: Turn[], title?: string) {
    setChats((current) => {
      const exists = current.some((chat) => chat.id === id);
      const updated: Chat = {
        id,
        title: title ?? current.find((chat) => chat.id === id)?.title ?? "New chat",
        updatedAt: Date.now(),
        messages: messagesNext,
      };
      const rest = current.filter((chat) => chat.id !== id);
      return exists || title ? [updated, ...rest] : current;
    });
  }

  async function request(id: string, history: Turn[]) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((turn) => ({
            role: turn.role,
            content: turn.files?.length
              ? `${turn.content}\n(attached: ${turn.files.join(", ")})`
              : turn.content,
          })),
        }),
      });
      const data = (await res.json()) as { reply?: unknown; error?: unknown };
      if (!res.ok || typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error(typeof data.error === "string" ? data.error : "No reply.");
      }
      setFresh(history.length);
      patchChat(id, [...history, { role: "assistant", content: data.reply }]);
    } catch {
      setError("The reply didn't come through. Try again.");
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if ((!trimmed && files.length === 0) || pendingRef.current) return;
    const turn: Turn = {
      role: "user",
      content: trimmed || "Please take a look at the attached file.",
      files: files.length ? files.map((file) => file.name) : undefined,
    };
    const id = activeId ?? `chat-${Date.now()}`;
    const history = [...messages, turn];
    setActiveId(id);
    patchChat(id, history, active ? undefined : (trimmed || turn.files?.[0] || "New chat").slice(0, 40));
    setDraft("");
    setFiles([]);
    void request(id, history);
  }

  function newChat() {
    setActiveId(null);
    setFresh(-1);
    setError(null);
    setDraft("");
    setFiles([]);
    inputRef.current?.focus();
  }

  function removeChat(id: string) {
    setChats((current) => current.filter((chat) => chat.id !== id));
    if (activeId === id) newChat();
  }

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chat"
      className={`fixed inset-0 z-[100] flex bg-ink text-ink-foreground transition-[opacity,transform] duration-500 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      onWheel={(event) => event.stopPropagation()}
    >
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-ink-border md:flex">
        <div className="px-[var(--gutter)] pb-4 pt-5">
          <LogoCube body="#f3f1ea" face="#0a0a0a" className="size-8" />
        </div>
        <div className="px-3">
          <button
            type="button"
            onClick={newChat}
            className="flex w-full items-center gap-2 rounded-[6px] border border-ink-border px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-ink-foreground/8"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
        </div>
        <p className="mt-6 px-[var(--gutter)] font-mono text-[10px] text-ink-muted">History</p>
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-6">
          {chats.length === 0 ? (
            <p className="px-3 py-2 text-[13px] text-ink-muted">No chats yet</p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {chats.map((chat) => (
                <li key={chat.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(chat.id);
                      setFresh(-1);
                      setError(null);
                    }}
                    className={`w-full truncate rounded-[6px] px-3 py-2 pr-8 text-left text-[13px] transition-colors ${
                      chat.id === activeId
                        ? "bg-ink-foreground/12"
                        : "text-ink-foreground/80 hover:bg-ink-foreground/8"
                    }`}
                  >
                    {chat.title}
                  </button>
                  <button
                    type="button"
                    aria-label="Delete chat"
                    onClick={() => removeChat(chat.id)}
                    className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-[4px] text-ink-muted opacity-0 transition-opacity hover:text-ink-foreground group-hover:opacity-100"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between px-[var(--gutter)] pt-5">
          <LogoCube body="#f3f1ea" face="#0a0a0a" className="size-8 md:invisible" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-ink-border px-4 py-2 font-mono text-[12px] text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink"
          >
            Close
          </button>
        </div>

        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[var(--gutter)]">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-7 pb-6 text-center">
              <Orb active={pending} />
              <div>
                <p className="font-serif text-2xl text-ink-muted md:text-3xl">Hi there,</p>
                <p className="font-serif text-4xl font-medium leading-tight md:text-6xl">
                  How can I help today?
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-7 py-8" aria-live="polite">
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <div
                    key={index}
                    className="ml-auto flex max-w-[85%] flex-col items-end gap-2"
                  >
                    {message.files?.map((name) => (
                      <span
                        key={name}
                        className="rounded-[4px] border border-ink-border px-2.5 py-1 font-mono text-[11px] text-ink-muted"
                      >
                        {name}
                      </span>
                    ))}
                    <div className="rounded-[8px] bg-ink-foreground/10 px-4 py-3">
                      <MessageBody content={message.content} />
                    </div>
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
                      style={{ background: "conic-gradient(#f09637, #dcb2f0, #c3eec5, #f09637)" }}
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
                    onClick={() => activeId && void request(activeId, messages)}
                    className="underline underline-offset-4"
                  >
                    Retry
                  </button>
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="px-[var(--gutter)] pb-16 pt-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
            className="mx-auto max-w-3xl"
          >
            <div className="rounded-[12px] border border-ink-border bg-ink-foreground/[0.04] transition-colors focus-within:border-ink-foreground/40">
              {files.length > 0 ? (
                <div className="flex flex-wrap gap-2 px-4 pt-4">
                  {files.map((file) => (
                    <span
                      key={`${file.name}-${file.size}`}
                      className="flex items-center gap-2 rounded-[6px] border border-ink-border px-2.5 py-1.5 font-mono text-[11px]"
                    >
                      {file.name}
                      <span className="text-ink-muted">{sizeLabel(file.size)}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => setFiles((current) => current.filter((f) => f !== file))}
                        className="text-ink-muted transition-colors hover:text-ink-foreground"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="relative">
                <TypingPlaceholder visible={!draft} />
                <label htmlFor="studio-chat-input" className="sr-only">
                  Message
                </label>
                <textarea
                  id="studio-chat-input"
                  ref={inputRef}
                  rows={4}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send(draft);
                    }
                  }}
                  className="block h-32 max-h-64 min-h-32 w-full resize-none bg-transparent p-5 font-sans text-base leading-relaxed text-ink-foreground outline-none"
                />
              </div>
              <div className="flex items-center justify-between px-3 pb-3">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  hidden
                  onChange={(event) => {
                    const picked = Array.from(event.target.files ?? []);
                    if (picked.length) setFiles((current) => [...current, ...picked].slice(0, 5));
                    event.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-[6px] px-3 py-2 font-mono text-[12px] text-ink-muted transition-colors hover:bg-ink-foreground/8 hover:text-ink-foreground"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7" />
                  </svg>
                  Attach
                </button>
                <button
                  type="submit"
                  disabled={pending || (!draft.trim() && files.length === 0)}
                  className="rounded-[8px] bg-white px-6 py-2.5 font-mono text-[13px] text-black transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {suggestions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => send(item.title)}
                    className="group flex flex-col gap-3 rounded-[10px] border border-ink-border p-4 text-left transition-colors hover:border-ink-foreground/40 hover:bg-ink-foreground/5"
                  >
                    <span className="flex size-8 items-center justify-center rounded-[6px] border border-ink-border text-ink-foreground/80 transition-colors group-hover:text-ink-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        {item.icon}
                      </svg>
                    </span>
                    <span>
                      <span className="block text-sm text-ink-foreground">{item.title}</span>
                      <span className="mt-1 block text-[12px] leading-snug text-ink-muted">
                        {item.hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>
        </div>

        <nav
          aria-label="Social"
          className="absolute bottom-4 right-[var(--gutter)] hidden gap-5 font-mono text-[11px] md:flex"
        >
          {site.cornerSocial.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-ink-foreground transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </section>
    </div>
  );
}
