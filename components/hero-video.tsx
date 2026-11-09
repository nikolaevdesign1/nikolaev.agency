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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 gutter pb-16 md:pb-24">
        <h1 className="font-serif text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.9] text-white mix-blend-difference">
          <span className="block">nikolaev.agency</span>
          <span className="block">Worldwide first Ai design studio agency.</span>
        </h1>
      </div>
    </section>
  );
}
