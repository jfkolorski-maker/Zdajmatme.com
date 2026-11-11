import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { seo } from "@/lib/seo";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { ConsentDefaults } from "@/components/tracking/ConsentDefaults";
import { TrackingScripts } from "@/components/tracking/TrackingScripts";
import { ConsentBanner } from "@/components/tracking/ConsentBanner";
import { Boot } from "@/components/tracking/Boot";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope", // variable font: one file per subset covers weights 200–800
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: "/" },
  applicationName: site.name,
  authors: [{ name: site.owner.name }],
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: "Matematyka przestaje być problemem — korepetycje online 1:1 | ZdajMatme.com",
    description: seo.description,
  },
  twitter: { card: "summary_large_image", title: "Matematyka przestaje być problemem | ZdajMatme.com", description: seo.description },
  robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
};

export const viewport: Viewport = {
  themeColor: "#07162E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={manrope.variable}>
      <head>
        <ConsentDefaults />
      </head>
      <body>
        <MotionProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-yellow-400 focus:px-4 focus:py-2 focus:font-bold focus:text-navy-950">
            Przejdź do treści
          </a>
          {children}
          <ConsentBanner />
        </MotionProvider>
        <Boot />
        <TrackingScripts />
      </body>
    </html>
  );
}
