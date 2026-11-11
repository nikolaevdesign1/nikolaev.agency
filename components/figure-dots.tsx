"use client";

import { useEffect, useRef } from "react";

/**
 * Oleg as a cloud of dots, in the same language as the globe and the chat orb:
 * 180 cm, big build with a soft belly, black hoodie with hands in the pocket,
 * mustard beanie with a cuff, square glasses, a short beard. Framed from the knees up.
 * Built from simple shapes sampled into points, so there is no model file to load.
 */

type Kind = "body" | "hat" | "glasses" | "beard" | "string";
type P = { x: number; y: number; z: number; kind: Kind; seed: number };

const TAU = Math.PI * 2;

function rand(seed: number) {
  let x = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

/** Points on a capsule between two points. */
function capsule(out: P[], a: number[], b: number[], r: number, n: number, kind: Kind) {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const len = Math.hypot(dx, dy, dz) || 1;
  // two axes perpendicular to the segment
  const ux = dx / len;
  const uy = dy / len;
  const uz = dz / len;
  let px = -uy;
  let py = ux;
  let pz = 0;
  if (Math.abs(uz) > 0.9) {
    px = 1;
    py = 0;
    pz = 0;
  }
  const pl = Math.hypot(px, py, pz) || 1;
  px /= pl;
  py /= pl;
  pz /= pl;
  const qx = uy * pz - uz * py;
  const qy = uz * px - ux * pz;
  const qz = ux * py - uy * px;
  for (let i = 0; i < n; i++) {
    const s = rand(out.length * 7 + i);
    const t = (i + 0.5) / n;
    const ang = i * 2.39996;
    const c = Math.cos(ang) * r;
    const d = Math.sin(ang) * r;
    out.push({
      x: ax + dx * t + px * c + qx * d,
      y: ay + dy * t + py * c + qy * d,
      z: az + dz * t + pz * c + qz * d,
      kind,
      seed: s,
    });
  }
}

/** Points on an ellipsoid; `keep` filters by position. */
function ellipsoid(
  out: P[],
  c: number[],
  r: number[],
  n: number,
  kind: Kind,
  keep: (x: number, y: number, z: number) => boolean = () => true,
) {
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const rr = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    const x = Math.cos(a) * rr;
    const z = Math.sin(a) * rr;
    const px = c[0] + x * r[0];
    const py = c[1] + y * r[1];
    const pz = c[2] + z * r[2];
    if (keep(px, py, pz)) out.push({ x: px, y: py, z: pz, kind, seed: rand(out.length * 13 + i) });
  }
}

function buildFigure(): P[] {
  const pts: P[] = [];

  // Torso in the hoodie: stacked ellipses, wide shoulders, round belly pushed forward.
  for (let y = 0.86; y <= 1.47; y += 0.012) {
    const t = (y - 0.86) / (1.47 - 0.86); // 0 hips, 1 shoulders
    const belly = Math.exp(-((y - 1.06) ** 2) / 0.012);
    const rx = 0.2 + 0.05 * Math.sin(t * Math.PI * 0.9) + belly * 0.025 + (t > 0.85 ? (t - 0.85) * 0.25 : 0);
    const rz = 0.135 + belly * 0.07 - (t > 0.8 ? (t - 0.8) * 0.18 : 0);
    const zoff = belly * 0.045;
    const ring = Math.round(46 + rx * 90);
    for (let k = 0; k < ring; k++) {
      const a = (k / ring) * TAU + y * 9;
      pts.push({ x: Math.cos(a) * rx, y, z: Math.sin(a) * rz + zoff, kind: "body", seed: rand(pts.length) });
    }
  }
  // Shoulder caps and the hood bunched round the neck.
  ellipsoid(pts, [-0.25, 1.44, 0], [0.09, 0.07, 0.11], 90, "body");
  ellipsoid(pts, [0.25, 1.44, 0], [0.09, 0.07, 0.11], 90, "body");
  for (let k = 0; k < 220; k++) {
    const a = (k / 220) * TAU;
    const b = (k * 0.618 * TAU) % TAU;
    const R = 0.13;
    const r = 0.045;
    pts.push({
      x: (R + r * Math.cos(b)) * Math.cos(a),
      y: 1.5 + r * Math.sin(b),
      z: (R + r * Math.cos(b)) * Math.sin(a) - 0.02,
      kind: "body",
      seed: rand(pts.length),
    });
  }
  // Kangaroo pocket edge.
  for (let k = 0; k < 60; k++) {
    const t = k / 59;
    pts.push({ x: -0.15 + t * 0.3, y: 1.0 + Math.sin(t * Math.PI) * 0.02, z: 0.2, kind: "body", seed: rand(pts.length) });
  }

  // Arms: shoulder to elbow, then the forearm bends in to the pocket.
  capsule(pts, [-0.29, 1.42, 0], [-0.31, 1.13, 0.03], 0.065, 200, "body");
  capsule(pts, [-0.31, 1.13, 0.03], [-0.13, 1.0, 0.17], 0.058, 170, "body");
  capsule(pts, [0.29, 1.42, 0], [0.31, 1.13, 0.03], 0.065, 200, "body");
  capsule(pts, [0.31, 1.13, 0.03], [0.13, 1.0, 0.17], 0.058, 170, "body");

  // Legs from the hips down to the frame edge at the knees.
  capsule(pts, [-0.11, 0.9, 0.01], [-0.12, 0.46, 0.02], 0.1, 260, "body");
  capsule(pts, [0.11, 0.9, 0.01], [0.12, 0.46, 0.02], 0.1, 260, "body");

  // Drawstrings.
  for (const side of [-1, 1]) {
    for (let k = 0; k < 24; k++) {
      const t = k / 23;
      pts.push({ x: side * (0.045 + t * 0.008), y: 1.47 - t * 0.16, z: 0.16 + t * 0.015, kind: "string", seed: rand(pts.length) });
    }
  }

  // Neck and a full round face.
  capsule(pts, [0, 1.5, 0], [0, 1.57, 0.01], 0.06, 50, "body");
  ellipsoid(pts, [0, 1.64, 0.01], [0.105, 0.12, 0.11], 520, "body", (_x, y) => y < 1.69);
  // Beard: lower face and chin, a little fuller.
  ellipsoid(pts, [0, 1.6, 0.025], [0.108, 0.075, 0.1], 260, "beard", (_x, y, z) => y < 1.615 && z > 0.0);
  // Ears.
  ellipsoid(pts, [-0.107, 1.645, 0], [0.012, 0.025, 0.018], 16, "body");
  ellipsoid(pts, [0.107, 1.645, 0], [0.012, 0.025, 0.018], 16, "body");

  // Beanie: a short fisherman cap sitting high, with a folded cuff.
  ellipsoid(pts, [0, 1.69, 0.005], [0.118, 0.105, 0.122], 520, "hat", (_x, y) => y > 1.69);
  for (let y = 1.665; y <= 1.715; y += 0.006) {
    for (let k = 0; k < 64; k++) {
      const a = (k / 64) * TAU;
      pts.push({ x: Math.cos(a) * 0.121, y, z: Math.sin(a) * 0.125 + 0.005, kind: "hat", seed: rand(pts.length) });
    }
  }

  // Square glasses: two frames and a bridge on the front of the face.
  const frame = (cx: number) => {
    const w = 0.072;
    const h = 0.046;
    const n = 40;
    for (let k = 0; k < n; k++) {
      const t = k / n;
      let x: number;
      let y: number;
      if (t < 0.25) {
        x = -w / 2 + (t / 0.25) * w;
        y = h / 2;
      } else if (t < 0.5) {
        x = w / 2;
        y = h / 2 - ((t - 0.25) / 0.25) * h;
      } else if (t < 0.75) {
        x = w / 2 - ((t - 0.5) / 0.25) * w;
        y = -h / 2;
      } else {
        x = -w / 2;
        y = -h / 2 + ((t - 0.75) / 0.25) * h;
      }
      const px = cx + x;
      const pz = Math.sqrt(Math.max(0, 1 - (px / 0.105) ** 2)) * 0.11 + 0.022;
      pts.push({ x: px, y: 1.648 + y, z: pz, kind: "glasses", seed: rand(pts.length) });
    }
  };
  frame(-0.047);
  frame(0.047);
  for (let k = 0; k < 6; k++) pts.push({ x: -0.011 + k * 0.0044, y: 1.655, z: 0.132, kind: "glasses", seed: rand(pts.length) });

  return pts;
}

const COLORS: Record<Kind, [number, number, number]> = {
  body: [22, 22, 22],
  string: [120, 118, 112],
  beard: [150, 96, 56],
  glasses: [10, 10, 10],
  hat: [214, 160, 28],
};

export function FigureDots({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts = buildFigure();
    const offset = pts.map(() => ({ x: 0, y: 0 }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let ratio = 1;
    const resize = () => {
      ratio = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);

    const pointer = { x: -9999, y: -9999, inside: false, look: 0 };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
      // head and body turn a little towards the cursor anywhere on the page
      pointer.look = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let frame = 0;
    let yaw = 0;
    const start = performance.now();

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || w === 0) return;
      const t = (now - start) / 1000;
      const targetYaw = Math.sin(t * 0.35) * 0.45 + pointer.look * 0.35;
      yaw += (targetYaw - yaw) * 0.05;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const breath = 1 + Math.sin(t * 1.4) * 0.008;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // fit 0.44 m .. 1.82 m of height into the frame
      const scale = (h * 0.94) / (1.82 - 0.44);
      const ox = w / 2;
      const oy = h * 0.03 + 1.82 * scale;
      const dot = Math.max(1, w / 260);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const shimmer = Math.sin(t * 2 + p.seed * 40) * 0.0025;
        const bx = p.x * (p.kind === "body" && p.y < 1.5 ? breath : 1);
        const bz = p.z * (p.kind === "body" && p.y < 1.5 ? breath : 1);
        const x = bx * cy + bz * sy;
        const z = -bx * sy + bz * cy;
        const persp = 1 / (1 - z * 0.25);
        let sx = ox + x * scale * persp;
        // perspective around the chest, not the floor, so the face stays on the head
        let sy2 = oy - (1.15 + (p.y + shimmer - 1.15) * persp) * scale;

        // scatter away from the cursor, then spring back
        const o = offset[i];
        if (pointer.inside && !reduce) {
          const dx = sx - pointer.x;
          const dy = sy2 - pointer.y;
          const d2 = dx * dx + dy * dy;
          const reach = 70 * 70;
          if (d2 < reach) {
            const f = (1 - d2 / reach) * 1.6;
            const d = Math.sqrt(d2) || 1;
            o.x += (dx / d) * f;
            o.y += (dy / d) * f;
          }
        }
        o.x *= 0.9;
        o.y *= 0.9;
        sx += o.x;
        sy2 += o.y;

        const depth = (z + 0.3) / 0.6; // 0 back, 1 front
        const front = Math.max(0, Math.min(1, depth));
        const [r, g, b] = COLORS[p.kind];
        const strong = p.kind === "glasses" || p.kind === "hat";
        const alpha = strong ? 0.35 + front * 0.65 : 0.1 + front * 0.6;
        const size = dot * (p.kind === "glasses" ? 1.3 : 0.8 + front * 0.6);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.fillRect(sx - size / 2, sy2 - size / 2, size, size);
      }
    };

    if (reduce) {
      draw(performance.now());
      cancelAnimationFrame(frame);
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Oleg Nikolaev drawn in dots: beanie, glasses, black hoodie"
      className={className}
      style={{ display: "block" }}
    />
  );
}
