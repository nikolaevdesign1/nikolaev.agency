"use client";

import { useEffect, useState } from "react";

/** True while the site footer is on screen: floating bars step aside for it. */
export function useFooterInView() {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)));
    io.observe(footer);
    return () => io.disconnect();
  }, []);
  return inView;
}
