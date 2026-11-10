"use client";

import { useEffect, useRef, useState } from "react";
import { GLOBE_HUB, globeNodes } from "@/lib/data/globe";
import { LAND_B64, LAND_H, LAND_W } from "@/lib/data/land-mask";
import type { Project } from "@/lib/data/projects";

type Card = { x: number; y: number; city: string; count: number; titles: string[] };

type Vec = [number, number, number];

const DEG = Math.PI / 180;
const POINTS = 16000;
const ARC_STEPS = 48;

function decodeLand() {
  const bin = atob(LAND_B64);
  const bits = new Uint8Array(LAND_W * LAND_H);
  for (let i = 0; i < bits.length; i++) {
    bits[i] = (bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  }
  return bits;
}

function toVec(lat: number, lon: number): Vec {
  const la = lat * DEG;
  const lo = lon * DEG;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

function slerp(a: Vec, b: Vec, t: number): Vec {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-4) return a;
  const s = Math.sin(omega);
  const k1 = Math.sin((1 - t) * omega) / s;
  const k2 = Math.sin(t * omega) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

/** Draggable dot globe: studio hub in Los Angeles, projects tied to it with threads. */
export function GlobeNetwork({
  className,
  projects,
}: {
  className?: string;
  projects: Pick<Project, "slug" | "title" | "place">[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const land = decodeLand();
    const isLand = (lat: number, lon: number) => {
      const x = Math.min(LAND_W - 1, Math.max(0, Math.floor(lon + 180)));
      const y = Math.min(LAND_H - 1, Math.max(0, Math.floor(90 - lat)));
      return land[y * LAND_W + x] === 1;
    };

    // fibonacci lattice, keep land cells only
    const dots: Vec[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINTS; i++) {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const v: Vec = [Math.cos(theta) * r, y, Math.sin(theta) * r];
      const lat = Math.asin(y) / DEG;
      const lon = Math.atan2(v[0], v[2]) / DEG;
      if (isLand(lat, lon)) dots.push(v);
    }

    const hub = toVec(GLOBE_HUB.lat, GLOBE_HUB.lon);
    // one point per city; several projects in a city share it
    const byCity = new Map<string, { city: string; lat: number; lon: number; titles: string[] }>();
    for (const project of projects) {
      const place = project.place ?? globeNodes.find((n) => n.slug === project.slug);
      if (!place) continue;
      const key = `${place.city}|${place.lat}|${place.lon}`;
      const entry = byCity.get(key) ?? { city: place.city, lat: place.lat, lon: place.lon, titles: [] };
      entry.titles.push(project.title);
      byCity.set(key, entry);
    }
    const nodes = Array.from(byCity.values()).map((node) => ({ node, v: toVec(node.lat, node.lon) }));
    const arcs = nodes.map(({ v }, index) => {
      const pts: Vec[] = [];
      const angle = Math.acos(Math.min(1, Math.max(-1, hub[0] * v[0] + hub[1] * v[1] + hub[2] * v[2])));
      const lift = 0.04 + 0.1 * (angle / Math.PI);
      for (let s = 0; s <= ARC_STEPS; s++) {
        const t = s / ARC_STEPS;
        const p = slerp(hub, v, t);
        const h = 1 + lift * Math.sin(Math.PI * t);
        pts.push([p[0] * h, p[1] * h, p[2] * h]);
      }
      return { pts, phase: (index * 0.137) % 1 };
    });

    let size = 0;
    let ratio = 1;
    const resize = () => {
      size = Math.floor(wrap.clientWidth);
      ratio = window.devicePixelRatio || 1;
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    // view state: yaw so the hub starts in front, slight tilt
    let yaw = -GLOBE_HUB.lon * DEG - 0.5;
    let pitch = 0.5;
    let velYaw = 0;
    let velPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let hovered = false;
    const screen: { x: number; y: number; z: number; city: string; titles: string[] }[] = [];
    const hubTitles = projects.map((p) => p.title);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let best: (typeof screen)[number] | null = null;
        let bestD = 16;
        for (const s of screen) {
          if (s.z <= 0.02) continue;
          const d = Math.hypot(s.x - mx, s.y - my);
          if (d < bestD) {
            bestD = d;
            best = s;
          }
        }
        hovered = Boolean(best);
        canvas.style.cursor = best ? "pointer" : "grab";
        setCard((prev) =>
          best
            ? prev && prev.city === best.city
              ? prev
              : { x: best.x, y: best.y, city: best.city, count: best.titles.length, titles: best.titles }
            : prev
              ? null
              : prev,
        );
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = (dx / size) * 3.2;
      velPitch = (dy / size) * 3.2;
      yaw += velYaw;
      pitch = Math.max(-1.1, Math.min(1.1, pitch + velPitch));
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      canvas.style.cursor = "grab";
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    const onLeave = () => {
      hovered = false;
      setCard(null);
    };
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(wrap);

    const project = (v: Vec, cy: number, sy: number, cp: number, sp: number): Vec => {
      const x1 = v[0] * cy + v[2] * sy;
      const z1 = -v[0] * sy + v[2] * cy;
      const y2 = v[1] * cp - z1 * sp;
      const z2 = v[1] * sp + z1 * cp;
      return [x1, y2, z2];
    };

    let frame = 0;
    const start = performance.now();
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || size < 2) return;
      const t = (now - start) / 1000;

      if (hovered) {
        velYaw = 0;
        velPitch = 0;
      } else if (!dragging) {
        yaw += velYaw;
        pitch = Math.max(-1.1, Math.min(1.1, pitch + velPitch));
        velYaw *= 0.94;
        velPitch *= 0.94;
        if (!reduce) yaw += 0.0017;
        // ease the tilt back toward a gentle default
        pitch += (0.5 - pitch) * 0.01;
      }

      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const R = size * 0.38;
      const c = size / 2;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // soft sphere body
      const body = ctx.createRadialGradient(c - R * 0.3, c - R * 0.3, R * 0.05, c, c, R);
      body.addColorStop(0, "#26241f");
      body.addColorStop(1, "#0f0e0c");
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(243,241,234,0.12)";
      ctx.stroke();

      // land dots
      for (let i = 0; i < dots.length; i++) {
        const [x, y, z] = project(dots[i], cy, sy, cp, sp);
        if (z <= 0) continue;
        const a = 0.12 + 0.78 * z;
        ctx.fillStyle = `rgba(243,241,234,${a.toFixed(3)})`;
        const r = 1 + z * 0.7;
        ctx.fillRect(c + x * R - r / 2, c - y * R - r / 2, r, r);
      }

      // threads
      for (const arc of arcs) {
        ctx.beginPath();
        let pen = false;
        for (const p of arc.pts) {
          const [x, y, z] = project(p, cy, sy, cp, sp);
          // hide the part that passes behind the sphere
          if (z < 0 && x * x + y * y < 1) {
            pen = false;
            continue;
          }
          const px = c + x * R;
          const py = c - y * R;
          if (!pen) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
          pen = true;
        }
        ctx.strokeStyle = "rgba(240,150,55,0.55)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // a pulse travelling hub -> project
        const u = (t * 0.22 + arc.phase) % 1;
        const idx = Math.min(arc.pts.length - 1, Math.floor(u * arc.pts.length));
        const [px, py, pz] = project(arc.pts[idx], cy, sy, cp, sp);
        if (pz > 0 || px * px + py * py > 1) {
          ctx.beginPath();
          ctx.arc(c + px * R, c - py * R, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,190,110,0.95)";
          ctx.fill();
        }
      }

      // project markers
      screen.length = 0;
      for (const { v, node } of nodes) {
        const [x, y, z] = project(v, cy, sy, cp, sp);
        screen.push({
          x: c + x * R,
          y: c - y * R,
          z,
          city: node.city,
          titles: node.titles,
        });
        if (z <= 0.02) continue;
        const px = c + x * R;
        const py = c - y * R;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#f3f1ea";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(243,241,234,0.35)";
        ctx.stroke();
      }

      // hub
      const [hx, hy, hz] = project(hub, cy, sy, cp, sp);
      screen.push({ x: c + hx * R, y: c - hy * R, z: hz, city: GLOBE_HUB.label, titles: hubTitles });
      if (hz > 0.02) {
        const px = c + hx * R;
        const py = c - hy * R;
        const pulse = (t * 0.8) % 1;
        ctx.beginPath();
        ctx.arc(px, py, 5 + pulse * 18, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,145,0,${(0.6 * (1 - pulse)).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff9100";
        ctx.fill();
        ctx.font = "11px var(--font-mono-display), ui-monospace, monospace";
        ctx.fillStyle = "rgba(243,241,234,0.85)";
        ctx.textAlign = "left";
        ctx.fillText(GLOBE_HUB.label, px + 12, py + 4);
      }
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [projects]);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        aria-label="Globe with the studio in Los Angeles and projects connected to it. Drag to rotate."
        className="block cursor-grab touch-pan-y select-none"
      />
      {card ? (
        <div
          className="pointer-events-none absolute z-10 w-56 rounded-[10px] p-[4px]"
          style={{
            left: Math.min(Math.max(8, card.x + 16), (wrapRef.current?.clientWidth ?? 600) - 232),
            top: Math.max(8, card.y - 70),
            background: "repeating-conic-gradient(#0a0a0a 0% 25%, #3b3b3b 0% 50%) 0 0 / 4px 4px",
          }}
        >
          <div className="rounded-[7px] bg-[#161616] px-4 py-3.5 font-mono text-[12px] leading-none text-white">
            <p className="text-[13px]">{card.city}</p>
            <p className="mt-2 text-white/45">
              {card.count} {card.count === 1 ? "project" : "projects"}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {card.titles.slice(0, 4).map((title) => (
                <li key={title} className="truncate">
                  {title}
                </li>
              ))}
              {card.titles.length > 4 ? (
                <li className="text-white/45">+{card.titles.length - 4}</li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
