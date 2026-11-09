export function TerminalNotes({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <pre
      aria-hidden="true"
      className={
        className ??
        "pointer-events-none absolute left-6 top-28 m-0 select-none font-mono text-[11px] leading-[1.5] text-foreground/35 md:left-10"
      }
    >
      {lines.join("\n")}
    </pre>
  );
}
