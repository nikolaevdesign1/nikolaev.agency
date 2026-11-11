"use client";

import { useEffect, useState } from "react";

/** Calls back once the preloader has let go of the page (right away if it is not running). */
export function whenPreloaderDone(callback: () => void): () => void {
  const html = document.documentElement;
  if (!html.hasAttribute("data-preloading")) {
    callback();
    return () => {};
  }
  const mo = new MutationObserver(() => {
    if (html.hasAttribute("data-preloading")) return;
    mo.disconnect();
    callback();
  });
  mo.observe(html, { attributes: true, attributeFilter: ["data-preloading"] });
  return () => mo.disconnect();
}

/** True once the preloader is gone, so entrances do not play behind it. */
export function usePreloaderDone() {
  const [done, setDone] = useState(false);
  useEffect(() => whenPreloaderDone(() => setDone(true)), []);
  return done;
}
