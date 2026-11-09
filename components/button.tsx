import Link from "next/link";
import { cn } from "@/lib/utils";

export function PillArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
      <path
        d="M2 7h9.5M8 3.5 11.5 7 8 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const pillClass =
  "inline-flex items-center gap-2.5 rounded bg-white px-5 py-2.5 font-sans text-[11px] font-medium uppercase text-black ring-1 ring-black/10";

type LinkButtonProps = {
  href: string;
  variant?: "default" | "ink";
  className?: string;
  children: React.ReactNode;
};

export function LinkButton({ href, className, children }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(pillClass, className)}>
      {children}
      <PillArrow />
    </Link>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ink";
};

export function Button({ className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(pillClass, className)} {...rest}>
      {children}
      <PillArrow />
    </button>
  );
}
