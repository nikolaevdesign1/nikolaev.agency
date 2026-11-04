"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/lib/data/site";
import { ScrambleText } from "@/components/scramble-text";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 py-5 mix-blend-difference md:px-10 md:py-7">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-foreground"
        >
          <ScrambleText text={site.name} trigger="hover" />
          <span className="text-foreground/50">.agency</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-xs uppercase tracking-[0.15em] text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="mt-6 flex flex-col gap-4 border-t border-foreground/20 pt-6 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-base uppercase tracking-[0.1em] text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
