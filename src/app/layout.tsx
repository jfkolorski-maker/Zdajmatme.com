import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import { AdsScripts } from "@/components/ads/AdsScripts";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: BRAND.seo.title,
  description: BRAND.seo.description,
  applicationName: BRAND.name,
  keywords: [
    "korepetycje matematyka online",
    "korepetycje matematyka liceum",
    "korepetycje matematyka szkoła podstawowa",
    "kurs maturalny matematyka",
    "matura rozszerzona matematyka korepetycje",
    "kurs egzamin ósmoklasisty matematyka",
  ],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pl_PL", url: BRAND.url, siteName: BRAND.name, title: BRAND.seo.title, description: BRAND.seo.description },
  twitter: { card: "summary_large_image", title: BRAND.seo.title, description: BRAND.seo.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#262a30", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <a href="#zapisy" className="skip-link">
          Przejdź do zapisów
        </a>
        {children}
        <AdsScripts />
      </body>
    </html>
  );
}
