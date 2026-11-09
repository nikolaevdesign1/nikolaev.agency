type Credit = { role: string; name: string; top: string; left: string };

type CreditsOverlayProps = {
  credits: Credit[];
};

/** Small film-credit style labels scattered over a project hero image. */
export function CreditsOverlay({ credits }: CreditsOverlayProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {credits.map((credit, i) => (
        <div
          key={i}
          className="absolute max-w-[160px] font-mono text-[10px] leading-tight text-ink-foreground/80"
          style={{ top: credit.top, left: credit.left }}
        >
          <p className="italic text-ink-foreground/50">{credit.role}</p>
          <p>{credit.name}</p>
        </div>
      ))}
    </div>
  );
}
