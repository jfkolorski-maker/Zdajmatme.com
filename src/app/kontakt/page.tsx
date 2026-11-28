import type { Metadata } from "next";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { Tracking } from "@/components/ads/Tracking";
import { KontaktDirect, KontaktHero } from "@/components/kontakt/KontaktSections";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCall } from "@/components/layout/StickyCall";
import { Providers } from "@/components/Providers";
import { QuizSection } from "@/components/sections/QuizSection";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Kontakt – umów pierwszą lekcję | ZdajMatme.com",
  description: `Zadzwoń (${BRAND.phone}), napisz e-mail lub wypełnij krótki formularz – oddzwonimy i ustalimy pierwszą lekcję matematyki online.`,
  alternates: { canonical: `${BRAND.url}/kontakt` },
};

/** Sub-page transferred from zdajmatme.com/kontakt: phone + e-mail, then the form (quiz). */
export default function KontaktPage() {
  return (
    <Providers>
      <Tracking />
      <Header />
      <main>
        <KontaktHero />
        <KontaktDirect />
        <QuizSection />
      </main>
      <Footer />
      <StickyCall />
      <ConsentBanner />
    </Providers>
  );
}
