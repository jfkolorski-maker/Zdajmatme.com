import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { Tracking } from "@/components/ads/Tracking";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCall } from "@/components/layout/StickyCall";
import { Providers } from "@/components/Providers";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import { Process } from "@/components/sections/Process";
import { QuizSection } from "@/components/sections/QuizSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoLesson } from "@/components/sections/VideoLesson";
import { BRAND } from "@/config/brand";
import { FAQ, OFFER } from "@/data/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${BRAND.url}/#org`,
      name: BRAND.name,
      slogan: BRAND.tagline,
      url: BRAND.url,
      telephone: `+48${BRAND.phone.replace(/\D/g, "")}`,
      email: BRAND.email,
      image: `${BRAND.url}/opengraph-image.jpg`,
      description: BRAND.seo.description,
      founder: { "@type": "Person", name: BRAND.owner.name },
      knowsAbout: ["Matematyka", "Egzamin ósmoklasisty", "Matura z matematyki", "Korepetycje online"],
    },
    {
      "@type": "Service",
      name: "Korepetycje indywidualne z matematyki online",
      provider: { "@id": `${BRAND.url}/#org` },
      offers: { "@type": "Offer", price: BRAND.price.amount, priceCurrency: "PLN", description: BRAND.price.label },
    },
    ...OFFER.items
      .filter((o) => o.id !== "indiv")
      .map((o) => ({ "@type": "Course", name: o.title, description: o.text, provider: { "@id": `${BRAND.url}/#org` } })),
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

/** Google Ads order: hero → oferta → przykładowa lekcja → proces → opinie → zapisy → o nas → FAQ → kontakt. */
export default function LandingPage() {
  return (
    <Providers>
      <Tracking />
      <Header />
      <main>
        <Hero />
        <Offer />
        <VideoLesson />
        <Process />
        <Testimonials />
        <QuizSection />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCall />
      <ConsentBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Providers>
  );
}
