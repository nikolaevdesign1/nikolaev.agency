"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SCRAMBLE_SELECTOR, scrambleElement } from "@/lib/scramble-dom";
import { whenPreloaderDone } from "@/lib/use-preloader-done";

/**
 * One text reveal for the whole site. Every heading (and anything marked
 * `data-scramble`) assembles from digits the first time it scrolls into view.
 * Waits for the preloader to finish so nothing plays behind it.
 */
export function AutoScramble() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    if (pathname?.startsWith("/admin")) {
      html.removeAttribute("data-scr");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    html.setAttribute("data-scr", "");

    const seen = new WeakSet<Element>();
    const stops: (() => void)[] = [];

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.setAttribute("data-scr-done", "");
          stops.push(scrambleElement(el));
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    const skip = (el: Element) =>
      el.closest("header, [data-no-scramble], [contenteditable]") !== null ||
      (el.parentElement?.closest(SCRAMBLE_SELECTOR) ?? null) !== null;

    const collect = (scope: ParentNode) => {
      scope.querySelectorAll(SCRAMBLE_SELECTOR).forEach((el) => {
        if (seen.has(el) || el.hasAttribute("data-scr-done")) return;
        seen.add(el);
        if (skip(el)) {
          el.setAttribute("data-scr-done", "");
          return;
        }
        io.observe(el);
      });
    };

    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => collect(document.body));
    });

    const start = () => {
      collect(document.body);
      mo.observe(document.body, { childList: true, subtree: true });
    };

    // Hold everything until the preloader lets go of the page. On a route change the
    // preloader restarts a moment later, so give it that moment before asking.
    let stopWaiting = () => {};
    const kick = window.setTimeout(() => {
      stopWaiting = whenPreloaderDone(start);
    }, 80);

    return () => {
      window.clearTimeout(kick);
      stopWaiting();
      mo.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      stops.forEach((stop) => stop());
    };
  }, [pathname]);

  return null;
}
