const CELL = 16;
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";

function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

/**
 * Covers the screen with square cells of `color`, spreading from the centre along a ragged front
 * with letters on its edge (the same language as the seams and the preloader). Calls `onCovered`
 * once the screen is full, then dissolves.
 */
export function pixelSwap(color: string, ink: string, onCovered: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onCovered();
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "95",
    pointerEvents: "none",
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    onCovered();
    return;
  }
  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const cols = Math.ceil(width / CELL);
  const rows = Math.ceil(height / CELL);
  const cx = cols / 2;
  const cy = rows / 2;
  const maxD = Math.hypot(cx, cy);
  // arrival time of each cell, 0..1: distance from centre plus clumped jitter for a ragged front
  const arrive = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const d = Math.hypot(c - cx, r - cy) / maxD;
      const clump = hash(Math.floor(c / 4) * 31 + Math.floor(r / 3) * 67);
      arrive[r * cols + c] = Math.min(1, d * 0.8 + clump * 0.12 + hash(c * 17 + r * 53) * 0.08);
    }
  }

  const font = getComputedStyle(document.body).fontFamily;
  const FILL_MS = 620;
  const OUT_MS = 360;
  const start = performance.now();
  let covered = false;

  const tick = (now: number) => {
    const elapsed = now - start;
    if (elapsed < FILL_MS) {
      const p = elapsed / FILL_MS;
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 10px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = arrive[r * cols + c];
          if (a > p) continue;
          const x = c * CELL;
          const y = r * CELL;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, CELL + 0.5, CELL + 0.5);
          if (p - a < 0.07 && hash(c * 29 + r * 7 + Math.floor(elapsed / 60)) < 0.55) {
            ctx.fillStyle = ink;
            ctx.fillText(GLYPHS[Math.floor(hash(c * 9 + r * 3) * GLYPHS.length)] ?? "a", x + CELL / 2, y + CELL / 2);
          }
        }
      }
      requestAnimationFrame(tick);
      return;
    }
    if (!covered) {
      covered = true;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      onCovered();
    }
    const out = (elapsed - FILL_MS) / OUT_MS;
    if (out >= 1) {
      canvas.remove();
      return;
    }
    canvas.style.opacity = String(1 - out);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
