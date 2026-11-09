import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About",
  description:
    "nikolaev.agency is a small digital-first studio. Direct access, no account managers.",
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
