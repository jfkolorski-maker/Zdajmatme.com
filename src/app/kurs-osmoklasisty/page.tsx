import type { Metadata } from "next";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { Tracking } from "@/components/ads/Tracking";
import { E8Enrol, E8Hero, E8Info, E8Pricing, E8Schedule } from "@/components/kurs8/E8Sections";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCall } from "@/components/layout/StickyCall";
import { Providers } from "@/components/Providers";
import { FinalCta } from "@/components/sections/FinalCta";
import { QuizSection } from "@/components/sections/QuizSection";
import { VideoLesson } from "@/components/sections/VideoLesson";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Kurs do egzaminu ósmoklasisty z matematyki online | ZdajMatme.com",
  description: "Kurs online do egzaminu ósmoklasisty z matematyki: 60-minutowe spotkania w poniedziałki o 18:00, nagrania, notatki i zadania domowe. 45 zł za lekcję lub 890 zł za cały kurs.",
  alternates: { canonical: `${BRAND.url}/kurs-osmoklasisty` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Kurs do egzaminu ósmoklasisty z matematyki",
  description: "Kurs online przygotowujący do egzaminu ósmoklasisty z matematyki, oparty na wymaganiach CKE.",
  provider: { "@type": "EducationalOrganization", name: BRAND.name, url: BRAND.url },
  offers: [
    { "@type": "Offer", name: "Pojedyncza lekcja", price: 45, priceCurrency: "PLN" },
    { "@type": "Offer", name: "Cały kurs – jednorazowa opłata", price: 890, priceCurrency: "PLN" },
  ],
};

/** Sub-page transferred from zdajmatme.com/kurs-osmoklasisty.php; ends with the quiz (preset to the course) + contact. */
export default function Kurs8Page() {
  return (
    <Providers>
      <Tracking />
      <Header />
      <main>
        <E8Hero />
        <E8Enrol />
        <E8Info />
        <VideoLesson title="Przykładowy fragment lekcji" accent={["fragment", "lekcji"]} youtubeId="mLvQZZW3XYI" poster="/video/e8-fragment-poster.webp" />
        <E8Schedule />
        <E8Pricing />
        <QuizSection defaultOffer="e8" />
        <FinalCta />
      </main>
      <Footer />
      <StickyCall />
      <ConsentBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Providers>
  );
}
