/**
 * Runs the site's text reveal on any element without React knowing about it:
 * every character flickers through digits, then settles, left to right.
 *
 * Text nodes are swapped for temporary spans and put back untouched at the end,
 * so React keeps its own nodes and can update them later.
 */

const GLYPHS = "0123456789";
const CYCLE = 220; // ms each character spends flickering
const MAX_STEP = 22; // ms between character starts
const MAX_SPREAD = 650; // the last character starts no later than this

export function scrambleElement(root: HTMLElement, delay = 0): () => void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest("[data-no-scramble], script, style, svg")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  if (!nodes.length) return () => {};

  type Cell = { el: HTMLSpanElement; ch: string; index: number };
  const cells: Cell[] = [];
  const swaps: { original: Text; wrapper: HTMLSpanElement }[] = [];
  let index = 0;

  for (const original of nodes) {
    const wrapper = document.createElement("span");
    wrapper.setAttribute("aria-hidden", "true");
    for (const ch of original.nodeValue ?? "") {
      if (/\s/.test(ch)) {
        wrapper.appendChild(document.createTextNode(ch));
        continue;
      }
      const el = document.createElement("span");
      el.textContent = ch;
      el.style.visibility = "hidden";
      wrapper.appendChild(el);
      cells.push({ el, ch, index: index++ });
    }
    original.parentNode?.replaceChild(wrapper, original);
    swaps.push({ original, wrapper });
  }

  const step = Math.min(MAX_STEP, MAX_SPREAD / Math.max(1, cells.length));
  const begin = performance.now() + delay;
  let frame = 0;
  let done = false;

  const restore = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    for (const { original, wrapper } of swaps) {
      if (wrapper.parentNode) wrapper.parentNode.replaceChild(original, wrapper);
    }
  };

  const tick = (now: number) => {
    const t = now - begin;
    let finished = true;
    for (const cell of cells) {
      const from = cell.index * step;
      if (t < from) {
        finished = false;
        continue;
      }
      if (t < from + CYCLE) {
        finished = false;
        cell.el.style.visibility = "visible";
        cell.el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
      } else if (cell.el.textContent !== cell.ch) {
        cell.el.textContent = cell.ch;
        cell.el.style.visibility = "visible";
      }
    }
    if (finished) restore();
    else frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return restore;
}

/** Elements that get the reveal by default. */
export const SCRAMBLE_SELECTOR = "h1, h2, h3, .reveal-line, .reveal-type, .type-in, [data-scramble]";
