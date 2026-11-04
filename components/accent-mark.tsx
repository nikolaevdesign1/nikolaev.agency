import { cn } from "@/lib/utils";

type AccentMarkProps = {
  className?: string;
  size?: number;
};

/**
 * The rare red mark — use sparingly (a handful of times across the whole
 * site), never as a repeating decorative motif.
 */
export function AccentMark({ className, size = 24 }: AccentMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("text-accent-red", className)}
    >
      <path
        d="M12 2L12 8M12 2L9 5M12 2L15 5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 12L16 12M22 12L19 9M22 12L19 15"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22L12 16M12 22L9 19M12 22L15 19"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L8 12M2 12L5 9M2 12L5 15"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
