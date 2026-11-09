"use client";

import { useEffect, useRef, useState } from "react";

const STEP = 96;
const MAX_DOTS = 220;

function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

type Dot = { x: number; y: number; delay: number };
type Star = { path: { x: number; y: number }[]; begin: number };

/**
 * SVG layer over a dotted block: dots pulse in a diagonal wave and a few
 * stars hop from dot to dot. The static dots come from the CSS background.
 */
export function DotField({ className = "text-foreground" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [field, setField] = useState<{ w: number; h: number; dots: Dot[]; stars: Star[] } | null>(
    null,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const build = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 1 || h < 1) return;
      const cols = Math.ceil(w / STEP);
      const rows = Math.ceil(h / STEP);
      const stride = Math.max(1, Math.ceil((cols * rows) / MAX_DOTS));
      const dots: Dot[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r * cols + c) % stride !== 0) continue;
          dots.push({ x: c * STEP, y: r * STEP, delay: (c + r) * 0.28 });
        }
      }
      const stars: Star[] = [];
      for (let i = 0; i < 4; i++) {
        let c = Math.floor(hash(i * 7 + 1) * cols);
        let r = Math.floor(hash(i * 13 + 5) * rows);
        const path = [{ x: c * STEP, y: r * STEP }];
        for (let k = 0; k < 6; k++) {
          const dir = Math.floor(hash(i * 31 + k * 3) * 4);
          if (dir === 0) c = Math.min(cols - 1, c + 1);
          else if (dir === 1) c = Math.max(0, c - 1);
          else if (dir === 2) r = Math.min(rows - 1, r + 1);
          else r = Math.max(0, r - 1);
          path.push({ x: c * STEP, y: r * STEP });
        }
        stars.push({ path, begin: i * 1.7 });
      }
      setField({ w, h, dots, stars });
    };

    build();
    const observer = new ResizeObserver(build);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    >
      {field ? (
        <svg width={field.w} height={field.h} className="absolute inset-0">
          {field.dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x + 0.5}
              cy={dot.y + 0.5}
              r="1"
              fill="currentColor"
              opacity="0.08"
            >
              <animate
                attributeName="r"
                values="1;1.5;1"
                dur="6s"
                begin={`${dot.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.08;0.32;0.08"
                dur="6s"
                begin={`${dot.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
          {field.stars.map((star, i) =>
            [
              { r: 1.5, lag: 0, peak: 0.4 },
              { r: 1.1, lag: 0.14, peak: 0.22 },
              { r: 0.8, lag: 0.28, peak: 0.12 },
            ].map((part, k) => (
              <circle key={`s${i}-${k}`} r={part.r} fill="currentColor" opacity="0">
                <animate
                  attributeName="opacity"
                  values={`0;${part.peak};${part.peak};${part.peak};${part.peak};${part.peak};${part.peak};0`}
                  dur="7s"
                  begin={`${star.begin + part.lag}s`}
                  repeatCount="indefinite"
                />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={star.path.map((p) => `${p.x + 0.5} ${p.y + 0.5}`).join(";")}
                  keyTimes={star.path
                    .map((_, n) => (n / (star.path.length - 1)).toFixed(3))
                    .join(";")}
                  calcMode="spline"
                  keySplines={star.path
                    .slice(1)
                    .map(() => "0.5 0 0.2 1")
                    .join(";")}
                  dur="7s"
                  begin={`${star.begin + part.lag}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )),
          )}
        </svg>
      ) : null}
    </div>
  );
}
