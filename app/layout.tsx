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
  title: {
    default: `${site.name} — Design Studio, Los Angeles`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: [
      { url: "/icon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: `${site.name} — Design Studio, Los Angeles`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Design Studio, Los Angeles`,
    description: site.description,
  },
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
          </>
        </SmoothScroll>
      </body>
    </html>
  );
}
