"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoCube } from "@/components/logo-cube";
import { DotOrb } from "@/components/dot-orb";
import { AmbientTextField } from "@/components/ambient-text-field";
import { ScrambleText } from "@/components/scramble-text";
import { site } from "@/lib/data/site";

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

type Turn = {
  role: "user" | "assistant";
  content: string;
  files?: string[];
  /** Quick replies offered under a brief question. */
  options?: string[];
  /** The closing summary of a brief, with a send button. */
  briefSummary?: boolean;
};

type Brief = { step: number; answers: Record<string, string>; done?: boolean; sent?: boolean };

type Chat = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Turn[];
  brief?: Brief;
};

const BRIEF_STEPS: { key: string; label: string; q: string; options?: string[] }[] = [
  {
    key: "product",
    label: "What you want",
    q: "Let's put a brief together. What would you like to get?",
    options: ["Website", "Product or app", "Brand identity", "Something else"],
  },
  { key: "company", label: "Company and audience", q: "What is the company or product, and who is it for?" },
  { key: "goal", label: "Goal", q: "What should the project achieve? What problem does it solve?" },
  { key: "existing", label: "What exists", q: "What do you already have: a site, a brand, mockups?", options: ["Nothing yet"] },
  { key: "references", label: "References", q: "Any references you like? Paste links or attach files.", options: ["Skip"] },
  { key: "timeline", label: "Timeline", q: "What timeline do you have in mind?", options: ["As soon as possible", "1–2 months", "Flexible"] },
  { key: "budget", label: "Budget", q: "Is there a budget range? You can skip this one.", options: ["Skip"] },
  { key: "contact", label: "Contact", q: "Last one: your name and the email we should reply to." },
];

function briefSummary(answers: Record<string, string>) {
  return BRIEF_STEPS.map((step) => `${step.label}: ${answers[step.key]?.trim() || "—"}`).join("\n");
}

type SpeechLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
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

function Orb({ active, typing }: { active: boolean; typing: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-square h-[clamp(120px,22vh,200px)] shrink-0"
    >
      <DotOrb className="size-full" active={active} typing={typing} />
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
  const [collapsed, setCollapsed] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOk, setVoiceOk] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
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
    try {
      setCollapsed(window.localStorage.getItem("studio-chat-sidebar") === "collapsed");
    } catch {
      /* storage blocked */
    }
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    setVoiceOk(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem("studio-chat-sidebar", next ? "collapsed" : "open");
      } catch {
        /* storage blocked */
      }
      return next;
    });
  }

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechLike;
      webkitSpeechRecognition?: new () => SpeechLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = navigator.language?.toLowerCase().startsWith("ru") ? "ru-RU" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    const base = draft ? `${draft.trimEnd()} ` : "";
    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript;
      setDraft(base + text);
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  useEffect(() => {
    if (!open) recognitionRef.current?.stop();
  }, [open]);

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

    // A running brief is answered locally: store the answer, ask the next question.
    if (active?.brief && !active.brief.done) {
      const brief = active.brief;
      const step = BRIEF_STEPS[brief.step];
      const value = trimmed === "Skip" ? "" : turn.files?.length ? `${trimmed} (files: ${turn.files.join(", ")})` : trimmed;
      const answers = { ...brief.answers, [step.key]: value };
      const next = brief.step + 1;
      const history = [...messages, turn];
      const reply: Turn =
        next < BRIEF_STEPS.length
          ? { role: "assistant", content: BRIEF_STEPS[next].q, options: BRIEF_STEPS[next].options }
          : {
              role: "assistant",
              content: `Here is your brief:\n\n${briefSummary(answers)}\n\nCheck it and send it to the studio.`,
              briefSummary: true,
            };
      setFresh(history.length);
      setChats((current) =>
        current.map((chat) =>
          chat.id === active.id
            ? {
                ...chat,
                updatedAt: Date.now(),
                messages: [...history, reply],
                brief: { step: next, answers, done: next >= BRIEF_STEPS.length },
              }
            : chat,
        ),
      );
      setDraft("");
      setFiles([]);
      return;
    }

    const id = activeId ?? `chat-${Date.now()}`;
    const history = [...messages, turn];
    setActiveId(id);
    patchChat(id, history, active ? undefined : (trimmed || turn.files?.[0] || "New chat").slice(0, 40));
    setDraft("");
    setFiles([]);
    void request(id, history);
  }

  function startBrief() {
    const id = `brief-${Date.now()}`;
    const first = BRIEF_STEPS[0];
    setChats((current) => [
      {
        id,
        title: "Project brief",
        updatedAt: Date.now(),
        messages: [{ role: "assistant", content: first.q, options: first.options }],
        brief: { step: 0, answers: {} },
      },
      ...current,
    ]);
    setActiveId(id);
    setFresh(0);
    setError(null);
    setDraft("");
    setFiles([]);
    inputRef.current?.focus();
  }

  async function sendBrief() {
    if (!active?.brief || active.brief.sent || pendingRef.current) return;
    const answers = active.brief.answers;
    const contact = answers.contact ?? "";
    const email = contact.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0];
    if (!email) {
      setError("Add an email to the contact answer so the studio can reply.");
      return;
    }
    const name = contact.replace(email, "").replace(/[,;]/g, " ").trim() || "Brief from the chat";
    pendingRef.current = true;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: `Project brief from the chat\n\n${briefSummary(answers)}` }),
      });
      if (!res.ok) throw new Error("failed");
      const done: Turn = {
        role: "assistant",
        content: "Thanks, the brief is in. Every inquiry gets a reply within two business days.",
      };
      setFresh(messages.length);
      setChats((current) =>
        current.map((chat) =>
          chat.id === active.id
            ? { ...chat, messages: [...chat.messages, done], brief: { ...active.brief!, sent: true } }
            : chat,
        ),
      );
    } catch {
      setError("The brief didn't go through. Try again.");
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
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

  const empty = messages.length === 0;
  const brief = active?.brief;
  const briefRunning = Boolean(brief && !brief.done);
  const lastIndex = messages.length - 1;

  const sidebarToggle = (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={collapsed ? "Show chats" : "Hide chats"}
      aria-expanded={!collapsed}
      className="grid size-9 place-items-center rounded-[8px] text-ink-foreground/70 transition-colors hover:bg-ink-foreground/10 hover:text-ink-foreground [&>svg]:block"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M9.5 4.5v15" />
      </svg>
    </button>
  );

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
      <aside
        className={`absolute inset-y-0 left-0 z-10 hidden w-[260px] flex-col bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 pb-4 pt-5">
          <LogoCube body="#f3f1ea" face="#0a0a0a" className="size-8" />
          {sidebarToggle}
        </div>
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={newChat}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-white px-3 py-3 text-[13px] text-black transition-opacity hover:opacity-85"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
        </div>
        <div className="mx-4 border-t border-ink-foreground/15" />
        <p className="mt-5 px-4 font-mono text-[10px] text-ink-muted">History</p>
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-6">
          {chats.length === 0 ? (
            <p className="px-2 py-2 text-[13px] text-ink-muted">No chats yet</p>
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
                    className={`w-full truncate rounded-[6px] px-2 py-2 pr-8 text-left text-[13px] transition-colors ${
                      chat.id === activeId ? "bg-ink-foreground/12" : "text-ink-foreground/80 hover:bg-ink-foreground/8"
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

      <section
        className={`relative flex min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:my-3 md:mr-3 md:rounded-[16px] md:bg-[#111] md:ring-1 md:ring-ink-foreground/10 ${
          collapsed ? "md:ml-3" : "md:ml-[260px]"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            maskImage: "radial-gradient(ellipse 420px 320px at 50% 28%, transparent 35%, #000 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 420px 320px at 50% 28%, transparent 35%, #000 80%)",
          }}
        >
          <AmbientTextField phrase="Small team · direct access · no account managers" />
        </div>

        <div className="relative z-[1] flex items-center justify-between px-4 pt-4 md:px-5">
          <div className="flex items-center gap-2">
            <LogoCube body="#f3f1ea" face="#0a0a0a" className="size-8 md:hidden" />
            <span className={collapsed ? "hidden md:block" : "hidden"}>{sidebarToggle}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] px-3 py-2 font-mono text-[12px] text-ink-foreground/80 ring-1 ring-ink-foreground/15 transition-colors hover:bg-ink-foreground hover:text-ink"
          >
            Close
          </button>
        </div>

        {empty ? <div aria-hidden="true" className="hidden min-h-0 flex-[0.55] md:block" /> : null}

        <div
          ref={scrollerRef}
          className={`relative z-[1] overflow-y-auto overscroll-contain px-[var(--gutter)] ${empty ? "min-h-0 flex-1 md:flex-none" : "min-h-0 flex-1"}`}
        >
          {empty ? (
            <div className="mx-auto flex max-w-[760px] flex-col items-center gap-[clamp(0.5rem,2.4vh,1.5rem)] pb-4 pt-4 text-center">
              <div className="chat-rise" style={{ ["--d" as string]: "420ms" }}>
                <Orb active={pending} typing={draft.length > 0 || listening} />
              </div>
              <div>
                <ScrambleText
                  as="p"
                  trigger="mount"
                  delay={620}
                  text="Hi there, we are nikolaev.agency."
                  className="font-serif text-[clamp(1.3rem,3.2vh,2rem)] leading-tight text-ink-muted"
                />
                <ScrambleText
                  as="p"
                  trigger="mount"
                  delay={820}
                  text="How can I help today?"
                  className="mt-1 font-serif text-[clamp(1.9rem,5vh,3.2rem)] font-medium leading-[1.08]"
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-[760px] flex-col gap-7 py-8" aria-live="polite">
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <div key={index} className="ml-auto flex max-w-[85%] flex-col items-end gap-2">
                    {message.files?.map((name) => (
                      <span key={name} className="rounded-[4px] bg-ink-foreground/8 px-2.5 py-1 font-mono text-[11px] text-ink-muted">
                        {name}
                      </span>
                    ))}
                    <div className="rounded-[10px] bg-ink-foreground/10 px-4 py-3">
                      <MessageBody content={message.content} />
                    </div>
                  </div>
                ) : (
                  <div key={index} className="max-w-xl text-ink-foreground">
                    <Typed text={message.content} animate={index === fresh} />
                    {message.options && index === lastIndex && briefRunning ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => send(option)}
                            className="rounded-full bg-ink-foreground/10 px-3.5 py-2 text-[13px] transition-colors hover:bg-ink-foreground hover:text-ink"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {message.briefSummary && !brief?.sent ? (
                      <button
                        type="button"
                        onClick={() => void sendBrief()}
                        disabled={pending}
                        className="mt-4 rounded-[8px] bg-white px-5 py-2.5 font-mono text-[13px] text-black transition-opacity hover:opacity-85 disabled:opacity-40"
                      >
                        Send brief
                      </button>
                    ) : null}
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
                  {!brief ? (
                    <button
                      type="button"
                      onClick={() => activeId && void request(activeId, messages)}
                      className="underline underline-offset-4"
                    >
                      Retry
                    </button>
                  ) : null}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="relative z-[1] px-[var(--gutter)] pb-3 pt-3">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
            className="mx-auto max-w-[760px]"
          >
            {briefRunning && brief ? (
              <div className="mb-2 flex items-center gap-3 font-mono text-[11px] text-ink-muted">
                <span>
                  Brief · {Math.min(brief.step + 1, BRIEF_STEPS.length)} of {BRIEF_STEPS.length}
                </span>
                <span className="h-px flex-1 bg-ink-foreground/15">
                  <span
                    className="block h-px bg-accent transition-[width] duration-500"
                    style={{ width: `${(brief.step / BRIEF_STEPS.length) * 100}%` }}
                  />
                </span>
              </div>
            ) : null}
            <div
              className={`rounded-[14px] bg-[#1a1a1a] ring-1 ring-ink-foreground/12 transition-shadow focus-within:ring-ink-foreground/35 ${empty ? "chat-rise" : ""}`}
              style={{ ["--d" as string]: "760ms" }}
            >
              {files.length > 0 ? (
                <div className="flex flex-wrap gap-2 px-4 pt-4">
                  {files.map((file) => (
                    <span
                      key={`${file.name}-${file.size}`}
                      className="flex items-center gap-2 rounded-[6px] bg-ink-foreground/8 px-2.5 py-1.5 font-mono text-[11px]"
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
                <TypingPlaceholder visible={!draft && !listening} />
                {listening && !draft ? (
                  <span className="pointer-events-none absolute left-5 top-5 font-sans text-base text-ink-muted">Listening…</span>
                ) : null}
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
                      send(draft);
                    }
                  }}
                  className="block h-20 max-h-56 min-h-20 w-full resize-none bg-transparent p-5 font-sans text-base leading-relaxed text-ink-foreground outline-none"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-3 pb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={startBrief}
                    className="flex items-center gap-2 rounded-[8px] bg-accent/15 px-3 py-2 font-mono text-[12px] text-accent ring-1 ring-accent/30 transition-colors hover:bg-accent hover:text-black"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 4h8l3 3v13H5V4h3M9 11h6M9 15h4" />
                    </svg>
                    Start a brief
                  </button>
                  {voiceOk ? (
                    <button
                      type="button"
                      onClick={toggleVoice}
                      aria-label={listening ? "Stop voice input" : "Voice input"}
                      aria-pressed={listening}
                      className={`grid size-9 place-items-center rounded-[8px] transition-colors [&>svg]:block ${
                        listening
                          ? "animate-pulse bg-red-500/20 text-red-400"
                          : "text-ink-foreground/70 hover:bg-ink-foreground/10 hover:text-ink-foreground"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="3.5" width="6" height="11" rx="3" />
                        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={pending || (!draft.trim() && files.length === 0)}
                  className="grid size-10 place-items-center rounded-full bg-white text-black transition-opacity hover:opacity-85 disabled:opacity-30 [&>svg]:block"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M6 11l6-6 6 6" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center border-t border-ink-foreground/10 px-3 py-2">
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
                  className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 font-mono text-[12px] text-ink-muted transition-colors hover:bg-ink-foreground/8 hover:text-ink-foreground"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7" />
                  </svg>
                  Attach
                </button>
              </div>
            </div>

            {empty ? (
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {suggestions.map((item, i) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => (item.title === "I want to start a project" ? startBrief() : send(item.title))}
                    className="chat-rise group flex flex-col gap-3 rounded-[12px] bg-[#1c1c1c] p-4 text-left ring-1 ring-ink-foreground/[0.06] transition-colors hover:bg-[#262626]"
                    style={{ ["--d" as string]: `${900 + i * 90}ms` }}
                  >
                    <span className="flex size-8 items-center justify-center rounded-[6px] bg-ink-foreground/10 text-ink-foreground transition-colors group-hover:bg-ink-foreground/20 [&>svg]:block">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        {item.icon}
                      </svg>
                    </span>
                    <span>
                      <span className="block text-sm text-ink-foreground">{item.title}</span>
                      <span className="mt-1 block text-[12px] leading-snug text-ink-muted">{item.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>
        </div>

        {empty ? <div aria-hidden="true" className="hidden min-h-0 flex-1 md:block" /> : null}

        <p className="relative z-[1] px-[var(--gutter)] pb-4 text-center font-mono text-[11px] text-ink-muted">
          Still have questions? Write to us at{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            {site.email}
          </a>
        </p>

        <nav aria-label="Social" className="absolute bottom-4 right-5 z-[1] hidden gap-5 font-mono text-[11px] xl:flex">
          {site.cornerSocial.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-ink-foreground/70 transition-opacity hover:opacity-60">
              {link.label}
            </a>
          ))}
        </nav>
      </section>
    </div>
  );
}
