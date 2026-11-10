/** Pins the globe while the list beside it scrolls; it releases when the block ends, right before the video. */
export function GlobeSticky({ children }: { children: React.ReactNode }) {
  return <div className="lg:sticky lg:top-20 lg:self-start">{children}</div>;
}
