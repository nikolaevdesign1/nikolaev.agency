"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const KEY = "studio-sound";

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  blip: () => void;
};

/** A quiet pad: a low sine and detuned triangles through a slowly breathing filter, plus a click blip. */
function createEngine(): Engine | null {
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const ambient = ctx.createGain();
  ambient.gain.value = 0.05;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.Q.value = 0.7;
  ambient.connect(filter);
  filter.connect(master);

  const lfo = ctx.createOscillator();
  const lfoDepth = ctx.createGain();
  lfo.frequency.value = 0.05;
  lfoDepth.gain.value = 260;
  lfo.connect(lfoDepth);
  lfoDepth.connect(filter.frequency);
  lfo.start();

  // A2, E3 (twice, detuned), B3, C4: low and soft.
  const voices: { f: number; type: OscillatorType; g: number }[] = [
    { f: 110, type: "sine", g: 0.9 },
    { f: 164.8, type: "triangle", g: 0.35 },
    { f: 165.4, type: "triangle", g: 0.35 },
    { f: 246.9, type: "sine", g: 0.25 },
    { f: 261.6, type: "sine", g: 0.12 },
  ];
  for (const { f, type, g } of voices) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    gain.gain.value = g;
    osc.connect(gain);
    gain.connect(ambient);
    osc.start();
  }

  const blip = () => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.1);
  };

  return { ctx, master, blip };
}

/* One engine and one switch for the whole page, shared by every toggle. */
let on = false;
let engine: Engine | null = null;
const listeners = new Set<() => void>();

function wake() {
  if (!on) return;
  if (!engine) engine = createEngine();
  if (!engine) return;
  void engine.ctx.resume();
  engine.master.gain.setTargetAtTime(1, engine.ctx.currentTime, 0.6);
}

function onPress(event: PointerEvent) {
  if (!on) return;
  wake(); // a restored "on" needs one gesture before the browser lets it play
  const target = event.target as Element | null;
  if (target?.closest("a, button, [role='button'], summary, select, label")) engine?.blip();
}

export function setSound(next: boolean) {
  on = next;
  try {
    localStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    /* storage blocked */
  }
  if (next) wake();
  else if (engine) engine.master.gain.setTargetAtTime(0, engine.ctx.currentTime, 0.25);
  listeners.forEach((listener) => listener());
}

let installed = false;
function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  try {
    on = localStorage.getItem(KEY) === "on";
  } catch {
    /* storage blocked */
  }
  window.addEventListener("pointerdown", onPress, true);
}

function subscribe(listener: () => void) {
  install();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSound() {
  const value = useSyncExternalStore(
    subscribe,
    () => on,
    () => false,
  );
  return [value, setSound] as const;
}

/** Four bars that move while sound plays. */
export function SoundBars({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-current"
          style={{
            height: "3px",
            animation: playing ? `eq-bar 0.9s ease-in-out ${i * 0.15}s infinite alternate` : "none",
          }}
        />
      ))}
    </span>
  );
}

/**
 * Sound switch in the bottom-left corner (desktop; on phones it lives in the menu).
 * Off until the visitor turns it on; the choice is remembered.
 */
export function SoundToggle() {
  const pathname = usePathname();
  const [playing, set] = useSound();
  useEffect(() => install(), []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <button
      type="button"
      onClick={() => set(!playing)}
      aria-pressed={playing}
      aria-label={playing ? "Turn sound off" : "Turn sound on"}
      className="group fixed bottom-4 left-[var(--gutter)] z-[55] hidden h-9 items-center gap-2 rounded-full bg-[#0a0a0a]/80 px-3 font-mono text-[11px] text-white ring-1 ring-white/15 backdrop-blur-md transition-[background-color,transform] duration-300 hover:bg-[#0a0a0a] active:scale-95 md:flex"
    >
      <SoundBars playing={playing} />
      <span className="opacity-70 transition-opacity group-hover:opacity-100">{playing ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
