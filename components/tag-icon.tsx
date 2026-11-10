const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const icons: { match: RegExp; node: React.ReactNode }[] = [
  { match: /mobile|app/i, node: (<><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></>) },
  { match: /ui|ux|design system|interface/i, node: (<><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M3.5 9h17M9 9v11" /></>) },
  { match: /web|site|saas/i, node: (<><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M3 9h18M7 6.8h.01M10 6.8h.01" /></>) },
  { match: /commerce|shop|store/i, node: (<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>) },
  { match: /art|direction|brand|identity|logo/i, node: (<><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2.2-.5-1.2.2-2.3 1.5-2.3H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3Z" /><path d="M8 11h.01M12 8h.01M16 10h.01" /></>) },
  { match: /media|video|motion|film/i, node: (<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m10 9.5 5 2.5-5 2.5v-5Z" /></>) },
  { match: /tech|ai|integration|code|dev/i, node: (<><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13" /></>) },
  { match: /product|package|box/i, node: (<><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></>) },
  { match: /agency|studio|consult/i, node: (<><rect x="3.5" y="7" width="17" height="12" rx="2" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" /></>) },
];

/** Small line icon picked by keyword; falls back to a dot grid. */
export function TagIcon({ label }: { label: string }) {
  const hit = icons.find((icon) => icon.match.test(label));
  return (
    <svg {...base}>
      {hit ? hit.node : <path d="M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01" />}
    </svg>
  );
}
