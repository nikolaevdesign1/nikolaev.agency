"use client";

import { usePathname } from "next/navigation";

/** Fades the page content in on each navigation. */
export function PageReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // A project popup over /projects must not count as a new page.
  const section = "/" + (pathname.split("/")[1] ?? "");

  return (
    <div key={section} className="page-in">
      {children}
    </div>
  );
}
