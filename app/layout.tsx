import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CornerSocial } from "@/components/corner-social";
import { CookieNotice } from "@/components/cookie-notice";
import { PageReveal } from "@/components/page-transition";
import { Preloader } from "@/components/preloader";
import { AutoScramble } from "@/components/auto-scramble";
import { BottomBlur } from "@/components/bottom-blur";
import { SoundToggle } from "@/components/sound";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, shareImage } from "@/lib/seo";

// next@16.4.5 exports Geist_Mono, but not Libre_Caslon_Condensed
// (only Libre_Caslon_Display and Libre_Caslon_Text). These files are the
// Google Fonts latin subset: 400/700, roman and italic.
const caslon = localFont({
  src: [
    {
      path: "./fonts/LibreCaslonCondensed-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LibreCaslonCondensed-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/LibreCaslonCondensed-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/LibreCaslonCondensed-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  adjustFontFallback: "Times New Roman",
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono-display",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.domain}` },
  description: site.description,
  icons: {
    icon: [
      { url: "/icon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  // Canonical links and share tags are set per page with `pageMeta`; these are the fallback.
  openGraph: { title: site.title, description: site.description, siteName: site.domain, locale: "en_US", type: "website", images: [shareImage] },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: [shareImage] },
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.domain,
      alternateName: [site.name, site.legalName],
      url: site.url,
      logo: absoluteUrl("/icon-192.png"),
      image: absoluteUrl(shareImage.url),
      description: site.description,
      email: site.email,
      foundingDate: site.founded,
      areaServed: "Worldwide",
      sameAs: site.social.map((link) => link.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.domain,
      url: site.url,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${caslon.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SmoothScroll>
          <>
            <Preloader />
            <Nav />
            <main className="flex-1">
              <PageReveal>{children}</PageReveal>
            </main>
            <Footer />
            {modal}
            <CornerSocial />
            <CookieNotice />
            <BottomBlur />
            <SoundToggle />
            <AutoScramble />
            <JsonLd data={organization} />
            <Analytics id={site.analyticsId} />
          </>
        </SmoothScroll>
      </body>
    </html>
  );
}
