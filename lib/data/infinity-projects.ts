const PREFIXES = [
  "Nova",
  "Arc",
  "Driftwood",
  "Hollow",
  "Cedar",
  "Signal",
  "Quiet",
  "Northline",
  "Vantage",
  "Pale",
  "Marrow",
  "Fieldstone",
];

const SUFFIXES = [
  "Studio",
  "Collective",
  "Works",
  "& Co.",
  "Labs",
  "House",
  "Supply",
  "Atelier",
  "Goods",
  "Group",
];

const CATEGORIES = [
  "Brand",
  "Web",
  "Product",
  "Motion",
  "Packaging",
  "Editorial",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export type InfinityProject = {
  id: string;
  name: string;
  category: string;
  seed: string;
  span: "sm" | "md" | "lg" | "blank";
};

export function generateInfinityProjects(
  start: number,
  count: number,
): InfinityProject[] {
  const spans: InfinityProject["span"][] = ["sm", "md", "lg", "blank"];

  return Array.from({ length: count }, (_, i) => {
    const index = start + i;
    const prefix = PREFIXES[Math.floor(seededRandom(index * 1.1) * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(seededRandom(index * 2.3) * SUFFIXES.length)];
    const category =
      CATEGORIES[Math.floor(seededRandom(index * 3.7) * CATEGORIES.length)];
    const spanRoll = seededRandom(index * 4.9);
    const span =
      spanRoll < 0.12 ? "blank" : spans[Math.floor(seededRandom(index * 5.3) * 3)];

    return {
      id: `infinity-${index}`,
      name: `${prefix} ${suffix}`,
      category,
      seed: `infinity-${index}`,
      span,
    };
  });
}
