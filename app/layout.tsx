import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { PageTransition } from "@/components/page-transition";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SmoothScroll>
          <PageTransition>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
