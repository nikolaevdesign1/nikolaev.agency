import { directions } from "@/lib/data/services";
import { Reveal } from "@/components/reveal";

export function ServicesGrid() {
  return (
    <section className="relative border-y-2 border-border px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Directions of work — {String(directions.length).padStart(2, "0")}
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 md:gap-x-10">
        {directions.map((direction, i) => (
          <Reveal key={direction} delay={i * 40} className="inline-block">
            <span className="text-3xl font-medium leading-tight tracking-tight text-foreground/30 transition-colors duration-300 hover:text-foreground sm:text-4xl md:text-6xl">
              {direction}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
