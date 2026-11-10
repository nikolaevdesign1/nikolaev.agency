import { projectIsAwarded, type Project } from "@/lib/data/projects";

/** Dark info plate with a dithered edge; shown by a `group` parent on hover. */
export function HoverPlate({ project }: { project: Pick<Project, "year" | "services" | "credits" | "award"> }) {
  const rows: { label: string; value: string }[] = [
    { label: "Year", value: project.year },
    project.credits?.length
      ? { label: "Credits", value: project.credits.join(" · ") }
      : { label: "Services", value: project.services.join(" · ") },
  ];
  if (projectIsAwarded(project as Project)) {
    rows.push({ label: "Awards", value: project.award ?? "" });
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-4 bottom-[4.5rem] z-20 translate-y-2 rounded-[10px] p-[4px] opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      style={{
        background:
          "repeating-conic-gradient(#0a0a0a 0% 25%, #3b3b3b 0% 50%) 0 0 / 4px 4px",
      }}
    >
      <dl className="flex flex-col gap-2.5 rounded-[7px] bg-[#161616] px-4 py-3.5 font-mono text-[12px] leading-none text-white">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6">
            <dt className="shrink-0 text-white/45">{row.label}</dt>
            <dd className="min-w-0 truncate text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
