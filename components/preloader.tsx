"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoCube } from "@/components/logo-cube";

const CELL = 16;
const DIGITS = "0123456789";
const MIN_MS = 1800;
const MIN_MS_NAV = 1800;
const EXIT_MS = 1100;

function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

export function Preloader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [percent, setPercent] = useState(0);
  const [gone, setGone] = useState(false);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const stateRef = useRef({ loaded: false, exitAt: 0, progress: 0 });
  const pathname = usePathname();
  const lastTop = useRef<string | null>(null);

  const restart = () => {
    stateRef.current = { loaded: true, exitAt: 0, progress: 0 };
    setPercent(0);
    setStarted(false);
    setGone(false);
    setRun((value) => value + 1);
  };

  // Run again on every route change (a popup over /projects is not a new page).
  useEffect(() => {
    const top = "/" + (pathname.split("/")[1] ?? "");
    if (lastTop.current === null) {
      lastTop.current = top;
      return;
    }
    if (lastTop.current === top) return;
    lastTop.current = top;
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Pages can ask for the loader too (Field / List switch on the projects page).
  useEffect(() => {
    window.addEventListener("studio:preload", restart);
    return () => window.removeEventListener("studio:preload", restart);
  }, []);

  useEffect(() => {
    // The admin is a tool, not a page to show off: no loader there.
    if (window.location.pathname.startsWith("/admin")) {
      setGone(true);
      return;
    }
    const repeat = run > 0;
    const minMs = repeat ? MIN_MS_NAV : MIN_MS;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const state = stateRef.current;
    document.documentElement.setAttribute("data-preloading", "");

    const onLoad = () => {
      state.loaded = true;
    };
    if (repeat || document.readyState === "complete") state.loaded = true;
    else window.addEventListener("load", onLoad, { once: true });

    let width = 0;
    let height = 0;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const font = getComputedStyle(document.body).fontFamily;
    let frame = 0;

    const draw = (now: number) => {
      setStarted(true);
      const t = (now - start) / 1000;
      const elapsed = now - start;

      if (!state.loaded && elapsed > 6000) state.loaded = true;
      // progress: eases toward 90% while loading, completes once the page is loaded
      if (!state.exitAt) {
        const target = state.loaded && elapsed > minMs ? 100 : Math.min(90, elapsed / 22);
        state.progress += (target - state.progress) * 0.08;
        if (state.loaded && elapsed > minMs && state.progress > 99.4) {
          state.progress = 100;
          state.exitAt = now;
        }
        setPercent(Math.round(state.progress));
      }
      const out = state.exitAt ? Math.min(1, (now - state.exitAt) / EXIT_MS) : 0;

      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 11px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const key = c * 131 + r * 17;
          // dissolve: cells vanish along a chaotic front that travels top to bottom
          const gate = (r / rows) * 0.55 + hash(key + 7) * 0.45;
          if (gate < out * 1.15 - 0.05) continue;
          const x = c * CELL;
          const y = r * CELL;
          ctx.fillStyle = "#0a0a0a";
          ctx.fillRect(x, y, CELL + 0.5, CELL + 0.5);

          // wave: two travelling bands of brighter digits
          const wave =
            Math.sin(c * 0.09 + t * 1.6) * 0.5 +
            Math.sin(r * 0.12 - t * 1.1 + c * 0.03) * 0.5;
          const strength = Math.max(0, wave * 0.5 + 0.5) ** 2.2;
          const flicker = hash(key + Math.floor(t * 8 + hash(key) * 6));
          if (flicker > 0.25 + strength * 0.7) continue;
          const alpha = 0.12 + strength * 0.75;
          ctx.fillStyle = `rgba(243, 241, 234, ${alpha.toFixed(3)})`;
          ctx.fillText(
            DIGITS[Math.floor(hash(key + Math.floor(t * 12)) * 10)] ?? "0",
            x + CELL / 2,
            y + CELL / 2,
          );
        }
      }

      if (out >= 1) {
        setGone(true);
        return;
      }
      frame = requestAnimationFrame(draw);
    };

    if (reduce) {
      setPercent(100);
      setGone(true);
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", onLoad);
      document.documentElement.removeAttribute("data-preloading");
    };
  }, [run]);

  useEffect(() => {
    if (gone) document.documentElement.removeAttribute("data-preloading");
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[200] text-ink-foreground ${started ? "" : "bg-ink"}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute left-[var(--gutter)] top-5 md:top-6">
        <p className="font-sans text-xl leading-none">nikolaev.agency</p>
        <p className="mt-1 font-sans text-[10px] leading-none">by Oleg Nikolaev</p>
        <LogoCube
          body="#f3f1ea"
          face="#0a0a0a"
          className="mt-4 size-8"
        />
      </div>
      <div className="absolute bottom-4 right-[var(--gutter)] font-mono text-[11px] tabular-nums">
        {String(percent).padStart(3, "0")}%
      </div>
    </div>
  );
}
