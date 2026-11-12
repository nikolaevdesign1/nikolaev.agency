"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoCube } from "@/components/logo-cube";
import { ChatPanel } from "@/components/chat-panel";
import { AmbientTextField } from "@/components/ambient-text-field";
import { SoundBars, useSound } from "@/components/sound";
import { pixelSwap } from "@/lib/pixel-swap";
import { site } from "@/lib/data/site";

const links = [
  { label: "Work", href: "/projects" },
  { label: "Agency", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Media", href: "/media" },
] as const;

const BLEND = "isolate text-white mix-blend-difference";
const PLAIN = "text-white";
const INK = "#0a0a0a";
const PAPER = "#f3f1ea";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const busy = useRef(false);
  const blendFor = (over: boolean) => (over ? PLAIN : BLEND);
  const inMedia = pathname?.startsWith("/media") ?? false;

  // The header stays pinned. Over the home video it is plain white; past it, it inverts against the page.
  const [overHero, setOverHero] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setOverHero(pathname === "/" && y < window.innerHeight * 0.85);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);


  // The page under the open menu stays put.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /** Every big switch (menu, chat) goes through the same pixel cover as the preloader. */
  const cover = (then: () => void, zIndex = 95) => {
    if (busy.current) return;
    busy.current = true;
    pixelSwap(
      INK,
      PAPER,
      () => {
        then();
        window.setTimeout(() => {
          busy.current = false;
        }, 400);
      },
      { zIndex },
    );
  };

  const openChat = () => cover(() => setChatOpen(true), 110);
  const closeChat = () => cover(() => setChatOpen(false), 110);
  const toggleMenu = () => (open ? setOpen(false) : cover(() => setOpen(true)));

  return (
    <>
      <header
        data-site-header=""
        className={`fixed inset-x-0 top-0 z-50 isolate bg-transparent gutter py-5 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:py-6 ${
          overHero ? "" : "mix-blend-difference"
        }`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          <Link href="/" onClick={() => setOpen(false)} className={`flex w-fit flex-col font-sans ${blendFor(overHero)}`}>
            <span className="text-xl font-normal leading-none">{inMedia ? "nikolaev.media" : "nikolaev.agency"}</span>
            <span className="mt-1 text-[10px] font-normal leading-none">by Oleg Nikolaev</span>
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
                className={`font-normal ${blendFor(overHero)}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="col-start-3 justify-self-end">
            <button
              type="button"
              onClick={openChat}
              className={`hidden cursor-pointer font-sans text-xl font-normal leading-none transition-opacity hover:opacity-60 md:block ${blendFor(overHero)}`}
            >
              Let&apos;s chat
            </button>

            <button
              type="button"
              onClick={toggleMenu}
              className={`font-sans text-base md:hidden ${blendFor(overHero)}`}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <MobileMenu
          pathname={pathname}
          inMedia={inMedia}
          onClose={() => setOpen(false)}
          onChat={() => {
            setOpen(false);
            openChat();
          }}
        />
      ) : null}

      <ChatPanel open={chatOpen} onClose={closeChat} />
    </>
  );
}

function MobileMenu({
  pathname,
  inMedia,
  onClose,
  onChat,
}: {
  pathname: string | null;
  inMedia: boolean;
  onClose: () => void;
  onChat: () => void;
}) {
  const [sound, setSound] = useSound();
  return (
    <div
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink text-ink-foreground md:hidden"
    >
      <AmbientTextField phrase="Small team · direct access · no account managers" />
      <div className="relative flex items-start justify-between gutter py-5">
        <Link href="/" onClick={onClose} className="flex w-fit flex-col font-sans">
          <span className="text-xl leading-none">{inMedia ? "nikolaev.media" : "nikolaev.agency"}</span>
          <span className="mt-1 text-[10px] leading-none">by Oleg Nikolaev</span>
          <LogoCube body={PAPER} face={INK} className="mt-4 size-8" />
        </Link>
        <button type="button" onClick={onClose} className="font-sans text-base">
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="relative mt-10 flex flex-col gap-1 gutter">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            aria-current={pathname === link.href ? "page" : undefined}
            className="w-fit font-serif text-[clamp(2.8rem,14vw,4.2rem)] font-medium leading-[1.02] transition-opacity active:opacity-60 aria-[current=page]:text-accent"
          >
            <span data-scramble="">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="relative mt-auto flex flex-col gap-6 gutter pb-8 pt-12">
        <button
          type="button"
          onClick={onChat}
          className="h-12 w-full rounded-[6px] bg-white font-mono text-[13px] text-black transition-opacity active:opacity-80"
        >
          Let&apos;s chat
        </button>
        <div className="flex items-center justify-between font-mono text-[12px]">
          <a href={`mailto:${site.email}`} className="text-ink-foreground/80">
            {site.email}
          </a>
          <button
            type="button"
            onClick={() => setSound(!sound)}
            aria-pressed={sound}
            className="flex items-center gap-2 text-ink-foreground/80"
          >
            <SoundBars playing={sound} />
            {sound ? "Sound on" : "Sound off"}
          </button>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-ink-foreground/60">
          {site.cornerSocial.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
