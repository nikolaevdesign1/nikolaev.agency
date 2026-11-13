import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Project addresses changed when the case texts were added; old links keep working.
  async redirects() {
    return [
      { source: "/projects/tud", destination: "/projects/tud-ecommerce", permanent: true },
      { source: "/projects/litt", destination: "/projects/litt-ecommerce", permanent: true },
      { source: "/projects/atelier-40", destination: "/projects/atelier-40-fashion-journal", permanent: true },
      { source: "/projects/pynai", destination: "/projects/pyn-ai-navigation-app", permanent: true },
      { source: "/projects/alnima-io", destination: "/projects/alnima-mobile-app", permanent: true },
      { source: "/projects/structura", destination: "/projects/structura-family-website", permanent: true },
      { source: "/projects/shuttle-pro", destination: "/projects/shuttle-pro-car-wash-app", permanent: true },
      { source: "/projects/alnima", destination: "/projects/alnima-ecommerce", permanent: true },
      { source: "/projects/froki", destination: "/projects/froki-brand-identity", permanent: true },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
