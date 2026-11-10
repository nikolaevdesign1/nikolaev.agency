"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoCube } from "@/components/logo-cube";
import { ChatPanel } from "@/components/chat-panel";

const links = [
  { label: "Work", href: "/projects" },
  { label: "Agency", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Media", href: "/media" },
] as const;

const blend = "isolate text-white mix-blend-difference";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const inMedia = pathname?.startsWith("/media") ?? false;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 isolate bg-transparent gutter py-5 mix-blend-difference md:py-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`flex w-fit flex-col font-sans ${blend}`}
          >
            <span className="text-xl font-normal leading-none">
              {inMedia ? "nikolaev.media" : "nikolaev.agency"}
            </span>
            <span className="mt-1 text-[10px] font-normal leading-none">
              by Oleg Nikolaev
            </span>
            <LogoCube body="#ffffff" face="#000000" className="mt-4 size-8" />
          </Link>

          <nav
            className="col-start-2 hidden translate-x-16 items-baseline gap-7 font-sans text-xl leading-none md:flex"
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`font-normal ${blend}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="col-start-3 justify-self-end">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className={`hidden cursor-pointer font-sans text-xl font-normal leading-none transition-opacity hover:opacity-60 md:block ${blend}`}
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
                className={blend}
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
