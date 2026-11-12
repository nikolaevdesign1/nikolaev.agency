/**
 * Hand-drawn 24×24 marks for tools that the icon library does not carry.
 * Simplified after the official logos, single colour (currentColor), so they sit in the grid with the rest.
 */

/** Adobe apps: a filled rounded square with the two letters knocked out. */
function AdobeMark({ letters, id }: { letters: string; id: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7">
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="#fff" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill="#000"
            fontFamily="ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif"
          >
            {letters}
          </text>
        </mask>
      </defs>
      <rect x="1.5" y="2" width="21" height="20" rx="4.5" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

function ChatGptMark() {
  // six interlocking rounded links around the centre, like the OpenAI blossom
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <rect key={angle} x="9.2" y="2.6" width="5.6" height="11" rx="2.8" transform={`rotate(${angle} 12 12)`} />
      ))}
    </svg>
  );
}

function GrokMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M17.6 6.4A8 8 0 1 0 19.7 14" />
      <path d="M8.5 15.5 21 3" />
    </svg>
  );
}

function MidjourneyMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="currentColor">
      <path d="M11.2 2.5c-3 3.4-5.3 8.4-5.7 13.6h5.7V2.5z" />
      <path d="M12.6 5.4c2.6 2.9 4.2 6.6 4.5 10.7h-4.5V5.4z" />
      <path d="M3 18c2.4 1.6 5.3 2.4 9 2.4s6.6-.8 9-2.4c-.3.9-.9 1.7-1.8 2.3-2 1.4-4.5 2.1-7.2 2.1s-5.2-.7-7.2-2.1C3.9 19.7 3.3 18.9 3 18z" />
    </svg>
  );
}

function RunwayMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="currentColor">
      <path d="M4 3h9.5a5.5 5.5 0 0 1 2.6 10.35L20.5 21h-4.1l-4-7H7.6v7H4V3zm3.6 3.3v4.4h5.8a2.2 2.2 0 0 0 0-4.4H7.6z" />
    </svg>
  );
}

function SplineMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.4 9.5C7 12 17 12 20.6 9.5" />
      <path d="M4.6 16.5c4.2-2.6 10.6-2.6 14.8 0" />
      <path d="M12 3c-2.6 3-3.4 6.4-2.6 9s2.6 6 2.6 9" />
    </svg>
  );
}

export const drawnLogos: Record<string, () => React.ReactElement> = {
  Photoshop: () => <AdobeMark letters="Ps" id="mark-ps" />,
  Illustrator: () => <AdobeMark letters="Ai" id="mark-ai" />,
  "After Effects": () => <AdobeMark letters="Ae" id="mark-ae" />,
  ChatGPT: ChatGptMark,
  Grok: GrokMark,
  Midjourney: MidjourneyMark,
  Runway: RunwayMark,
  Spline: SplineMark,
};
