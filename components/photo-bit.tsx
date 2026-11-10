type PhotoBitProps = {
  src: string;
  title: string;
  seed?: number;
  theme?: "light" | "dark";
};

export function PhotoBit({ src, title, theme = "light" }: PhotoBitProps) {
  return (
    <div
      className="h-full w-full cursor-pointer"
      style={{ background: theme === "dark" ? "#141414" : "#f3f1ea" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        draggable={false}
        className="pointer-events-none h-full w-full select-none object-cover"
        loading="lazy"
      />
    </div>
  );
}
