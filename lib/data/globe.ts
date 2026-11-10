export type GlobeNode = {
  slug: string;
  lat: number;
  lon: number;
};

/** Main studio point. */
export const GLOBE_HUB = { label: "Los Angeles", lat: 34.05, lon: -118.24 };

/**
 * Where each project sits on the globe.
 * TEMPORARY positions: replace with the real client city of each project.
 */
export const globeNodes: GlobeNode[] = [
  { slug: "atelier-40", lat: 48.86, lon: 2.35 },
  { slug: "pynai", lat: 40.71, lon: -74.0 },
  { slug: "litt", lat: 51.5, lon: -0.12 },
  { slug: "tud", lat: 52.52, lon: 13.4 },
  { slug: "chris-williams-art-gallery", lat: 59.33, lon: 18.07 },
  { slug: "shuttle-pro", lat: 25.2, lon: 55.27 },
  { slug: "structura", lat: 44.43, lon: 26.1 },
  { slug: "alnima", lat: 1.35, lon: 103.82 },
  { slug: "alnima-io", lat: 35.68, lon: 139.69 },
  { slug: "froki", lat: -23.55, lon: -46.63 },
];
