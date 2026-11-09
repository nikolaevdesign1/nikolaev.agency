"use client";

import { usePathname } from "next/navigation";

/** Fades the page content in on each navigation. */
export function PageReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
}
