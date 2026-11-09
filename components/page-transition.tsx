"use client";

import { usePathname } from "next/navigation";
import { DigitalWave } from "@/components/digital-wave";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <DigitalWave key={pathname} />
      {children}
    </>
  );
}
