"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { ChatPanel } from "@/components/chat-panel";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-6 py-5 mix-blend-difference md:px-10 md:py-7">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink-foreground"
          >
            <ScrambleText text={site.name} trigger="hover" />
            <span className="text-ink-foreground/50">.agency</span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex md:justify-center md:pl-[12%]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.15em] text-ink-foreground/60 transition-colors hover:text-ink-foreground",
                  pathname === link.href && "text-ink-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="hidden font-mono text-xs uppercase tracking-[0.15em] text-ink-foreground md:block"
          >
            Let&apos;s talk
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="col-start-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            className="mt-6 flex flex-col gap-4 border-t-2 border-ink-foreground/20 pt-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-mono text-base uppercase tracking-[0.1em] text-ink-foreground"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setChatOpen(true);
              }}
              className="text-left font-mono text-base uppercase tracking-[0.1em] text-ink-foreground"
            >
              Let&apos;s talk
            </button>
          </nav>
        )}
      </header>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
