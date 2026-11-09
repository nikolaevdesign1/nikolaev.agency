import { LinkButton } from "@/components/button";

export function ServiceBanner() {
  return (
    <div className="my-12 flex flex-col items-start gap-5 rounded-2xl bg-ink gutter py-10 text-ink-foreground md:flex-row md:items-center md:justify-between">
      <p className="max-w-sm font-serif text-2xl font-medium leading-snug">
        Have a project like this in mind?
      </p>
      <LinkButton href="/contact">Request a project</LinkButton>
    </div>
  );
}
