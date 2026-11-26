import type { Metadata } from "next";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { Tracking } from "@/components/ads/Tracking";
import { KorForWhom, KorHero, KorLevels, KorPricing, KorWhy } from "@/components/korepetycje/KorSections";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCall } from "@/components/layout/StickyCall";
import { Providers } from "@/components/Providers";
import { FinalCta } from "@/components/sections/FinalCta";
import { QuizSection } from "@/components/sections/QuizSection";
import { VideoLesson } from "@/components/sections/VideoLesson";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Korepetycje indywidualne z matematyki online | ZdajMatme.com",
  description: "Lekcje 1-na-1 z matematyki online na ZOOM: szkoła podstawowa, egzamin ósmoklasisty, liceum i matura. Poziom podstawowy 110 zł, rozszerzony 125 zł za 60 minut.",
  alternates: { canonical: `${BRAND.url}/korepetycje-indywidualne` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Korepetycje indywidualne z matematyki online",
  provider: { "@type": "EducationalOrganization", name: BRAND.name, url: BRAND.url },
  offers: [
    { "@type": "Offer", name: "Poziom podstawowy – 60 min", price: 110, priceCurrency: "PLN" },
    { "@type": "Offer", name: "Poziom rozszerzony – 60 min", price: 125, priceCurrency: "PLN" },
    { "@type": "Offer", name: "Pakiet 10 lekcji – poziom podstawowy", price: 990, priceCurrency: "PLN" },
    { "@type": "Offer", name: "Pakiet 10 lekcji – poziom rozszerzony", price: 1125, priceCurrency: "PLN" },
  ],
};

/** Sub-page carried over from zdajmatme.com/korepetycje-indywidualne.php, in the landing-page design; ends with the quiz. */
export default function KorepetycjePage() {
  return (
    <Providers>
      <Tracking />
      <Header />
      <main>
        <KorHero />
        <KorLevels />
        <KorForWhom />
        <VideoLesson />
        <KorWhy />
        <KorPricing />
        <QuizSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyCall />
      <ConsentBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Providers>
  );
}
