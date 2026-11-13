export type GlobeNode = {
  slug: string;
  city: string;
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
  { slug: "atelier-40", city: "Paris", lat: 48.86, lon: 2.35 },
  { slug: "atelier-40-fashion-journal", city: "Paris", lat: 48.86, lon: 2.35 },
  { slug: "pynai", city: "New York", lat: 40.71, lon: -74.0 },
  { slug: "pyn-ai-navigation-app", city: "New York", lat: 40.71, lon: -74.0 },
  { slug: "litt", city: "London", lat: 51.5, lon: -0.12 },
  { slug: "litt-ecommerce", city: "London", lat: 51.5, lon: -0.12 },
  { slug: "tud", city: "Berlin", lat: 52.52, lon: 13.4 },
  { slug: "tud-ecommerce", city: "Berlin", lat: 52.52, lon: 13.4 },
  { slug: "chris-williams-art-gallery", city: "Stockholm", lat: 59.33, lon: 18.07 },
  { slug: "shuttle-pro", city: "Dubai", lat: 25.2, lon: 55.27 },
  { slug: "shuttle-pro-car-wash-app", city: "Dubai", lat: 25.2, lon: 55.27 },
  { slug: "structura", city: "Bucharest", lat: 44.43, lon: 26.1 },
  { slug: "structura-family-website", city: "Bucharest", lat: 44.43, lon: 26.1 },
  { slug: "alnima", city: "Singapore", lat: 1.35, lon: 103.82 },
  { slug: "alnima-ecommerce", city: "Singapore", lat: 1.35, lon: 103.82 },
  { slug: "alnima-io", city: "Tokyo", lat: 35.68, lon: 139.69 },
  { slug: "alnima-mobile-app", city: "Tokyo", lat: 35.68, lon: 139.69 },
  { slug: "froki", city: "São Paulo", lat: -23.55, lon: -46.63 },
  { slug: "froki-brand-identity", city: "São Paulo", lat: -23.55, lon: -46.63 },
];
