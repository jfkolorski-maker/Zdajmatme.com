import type { Metadata } from "next";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { Tracking } from "@/components/ads/Tracking";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCall } from "@/components/layout/StickyCall";
import { MaturaCourse, MaturaHow } from "@/components/matura/MaturaSections";
import { Providers } from "@/components/Providers";
import { FinalCta } from "@/components/sections/FinalCta";
import { QuizSection } from "@/components/sections/QuizSection";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Kurs maturalny z matematyki online – podstawa i rozszerzenie | ZdajMatme.com",
  description: "Kurs maturalny z matematyki online na poziomie podstawowym i rozszerzonym: 22 spotkania po 2 godziny, nagrania, prace domowe, małe grupy. Zapisy na rok szkolny 2027/2028.",
  alternates: { canonical: `${BRAND.url}/kurs-maturalny` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Kurs maturalny z matematyki – poziom podstawowy i rozszerzony",
  description: "Kurs online przygotowujący do matury z matematyki, zgodny z wymaganiami CKE.",
  provider: { "@type": "EducationalOrganization", name: BRAND.name, url: BRAND.url },
  offers: [
    { "@type": "Offer", name: "Pojedyncza lekcja", price: 45, priceCurrency: "PLN" },
    { "@type": "Offer", name: "Cały kurs – jednorazowa opłata", price: 1780, priceCurrency: "PLN" },
  ],
};

/** Sub-page transferred from zdajmatme.com/kurs-maturalny.php; ends with the quiz (preset to the course) + contact. */
export default function KursMaturalnyPage() {
  return (
    <Providers>
      <Tracking />
      <Header />
      <main>
        <MaturaCourse />
        <MaturaHow />
        <QuizSection defaultOffer="matura" />
        <FinalCta />
      </main>
      <Footer />
      <StickyCall />
      <ConsentBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Providers>
  );
}
