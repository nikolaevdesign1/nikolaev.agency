import Link from "next/link";
import { ScrambleText } from "@/components/scramble-text";
import { StudioChatButton } from "@/components/ambient-text-field";
import { pillClass } from "@/components/button";

/** 404 and error screens: a big code that assembles from digits, one line, two ways out. */
export function StatusPage({
  code,
  title,
  text,
  action,
}: {
  code: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="bg-dot-grid relative flex min-h-[100svh] flex-col justify-end bg-background gutter pb-20 pt-36 text-foreground">
      <p className="font-mono text-[11px] text-muted">Error {code}</p>
      <ScrambleText
        as="p"
        trigger="mount"
        text={code}
        className="mt-2 font-serif text-[clamp(7rem,28vw,22rem)] font-medium leading-[0.8]"
      />
      <h1 className="mt-8 max-w-2xl font-serif text-3xl font-medium leading-tight md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{text}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {action}
        <Link href="/" className={pillClass}>
          Back to home
        </Link>
        <StudioChatButton className={pillClass}>Let&apos;s chat</StudioChatButton>
      </div>
    </section>
  );
}
