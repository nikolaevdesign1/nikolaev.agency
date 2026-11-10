import { ScrambleText } from "@/components/scramble-text";

type HeroVideoProps = {
  src?: string;
  poster?: string;
};

export function HeroVideo({ src, poster }: HeroVideoProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {src ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 to-transparent"
      />

      <div data-scroll data-scroll-speed="0.18" className="pointer-events-none absolute inset-x-0 bottom-0 gutter pb-16 md:pb-24">
        <h1 className="font-serif text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.9] text-white">
          <ScrambleText as="span" trigger="mount" delay={1900} text="nikolaev.agency" className="block" />
          <ScrambleText as="span" trigger="mount" delay={2200} text="Worldwide first Ai design studio." className="block whitespace-nowrap text-[clamp(1.5rem,6vw,7.5rem)]" />
        </h1>
      </div>
    </section>
  );
}
