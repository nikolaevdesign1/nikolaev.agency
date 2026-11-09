"use client";

type CircularTextProps = {
  phrase: string;
  size?: number;
  className?: string;
};

/** A repeating phrase set along a circle — decorative, used sparingly in dark sections. */
export function CircularText({ phrase, size = 220, className }: CircularTextProps) {
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const text = `${phrase} · `.repeat(3);
  const id = `circular-text-path-${phrase.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <path
          id={id}
          d={`M ${size / 2}, ${size / 2} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
        />
      </defs>
      <text
        fill="currentColor"
        fontFamily="var(--font-mono-display), monospace"
        fontSize={size * 0.045}
        letterSpacing="0"
      >
        <textPath href={`#${id}`} startOffset="0" textLength={circumference}>
          {text}
        </textPath>
      </text>
    </svg>
  );
}
