"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatPanel } from "@/components/chat-panel";

const links = [
  { label: "Work", href: "/projects" },
  { label: "Agency", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Media", href: "/media", distinct: true },
] as const;

const blend = "isolate text-white mix-blend-difference";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const inMedia = pathname?.startsWith("/media") ?? false;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 isolate bg-transparent px-6 py-5 mix-blend-difference md:px-10 md:py-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`flex w-fit flex-col font-sans ${blend}`}
          >
            <span className="text-2xl font-normal leading-none tracking-tight">
              {inMedia ? "nikolaev.media" : "nikolaev.agency"}
            </span>
            <span className="mt-1 text-[11px] font-normal leading-none">
              by Oleg Nikolaev
            </span>
          </Link>

          <nav
            className="col-start-2 hidden translate-x-16 items-baseline gap-8 font-sans text-2xl leading-none md:flex"
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`inline-flex items-center gap-2 font-normal ${blend}`}
              >
                {"distinct" in link && link.distinct ? (
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                ) : null}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="col-start-3 justify-self-end">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className={`hidden cursor-pointer font-sans text-2xl font-normal leading-none md:block ${blend}`}
            >
              Let&apos;s chat
            </button>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className={`font-sans text-base md:hidden ${blend}`}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            className="mt-6 flex flex-col gap-4 font-sans text-2xl md:hidden"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`inline-flex items-center gap-2 ${blend}`}
              >
                {"distinct" in link && link.distinct ? (
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                ) : null}
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setChatOpen(true);
              }}
              className={`cursor-pointer text-left font-sans text-2xl ${blend}`}
            >
              Let&apos;s chat
            </button>
          </nav>
        )}
      </header>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
