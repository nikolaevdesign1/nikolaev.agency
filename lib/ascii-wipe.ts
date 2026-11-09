export const ASCII_CHARS = "01 ABCDEFGHIJKLMNOPQRSTUVWXYZ::/\\";
export const ASCII_CELL = 24;

export function drawAsciiFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);
  ctx.font = `${ASCII_CELL - 8}px var(--font-mono-display), monospace`;
  ctx.fillStyle = "#f3f1ea";
  ctx.textBaseline = "top";

  const cols = Math.ceil(w / ASCII_CELL);
  const rows = Math.ceil(h / ASCII_CELL);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (Math.random() < 0.72) continue;
      const char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      ctx.fillText(char, x * ASCII_CELL, y * ASCII_CELL);
    }
  }
}
