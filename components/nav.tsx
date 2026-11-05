"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatPanel } from "@/components/chat-panel";

const links = [
  { label: "Work", href: "/projects" },
  { label: "Agency", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

function WordmarkMark() {
  return (
    <span className="relative block h-px w-8 shrink-0" aria-hidden="true">
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2"
      >
        <g fill="currentColor">
          {[0, 90, 180, 270].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 32 32)`}>
              <circle cx="32" cy="8.5" r="4.7" />
              <rect x="27.3" y="11.8" width="9.4" height="10.2" rx="4.6" />
              <rect
                x="21"
                y="12.6"
                width="7.5"
                height="4.3"
                rx="2.15"
                transform="rotate(-38 28.5 14.75)"
              />
              <rect
                x="35.5"
                y="12.6"
                width="7.5"
                height="4.3"
                rx="2.15"
                transform="rotate(38 35.5 14.75)"
              />
              <rect
                x="27.5"
                y="18.4"
                width="3.9"
                height="9.4"
                rx="1.95"
                transform="rotate(-9 29.45 19.2)"
              />
              <rect
                x="32.6"
                y="18.4"
                width="3.9"
                height="9.4"
                rx="1.95"
                transform="rotate(9 34.55 19.2)"
              />
            </g>
          ))}
        </g>
      </svg>
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-transparent px-6 py-5 text-[#161616] md:px-10 md:py-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex w-fit flex-col font-sans text-[#161616]"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-[15px] font-normal leading-none tracking-tight">
                nikolaev.agency
              </span>
              <WordmarkMark />
            </span>
            <span className="mt-1 text-[11px] font-normal leading-none">
              by Oleg Nikolaev
            </span>
          </Link>

          <nav
            className="col-start-2 hidden translate-x-16 items-baseline font-sans text-2xl md:flex"
            aria-label="Primary"
          >
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="font-normal text-[#161616] transition-colors hover:text-black"
              >
                {index > 0 ? ",\u00a0" : null}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="col-start-3 justify-self-end">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="hidden font-sans text-2xl font-normal text-[#161616] md:block"
            >
              Let&apos;s talk
            </button>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="font-sans text-base text-[#161616] md:hidden"
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
            className="mt-6 flex flex-col gap-4 font-sans text-2xl text-[#161616] md:hidden"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
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
              className="text-left font-sans text-2xl text-[#161616]"
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
