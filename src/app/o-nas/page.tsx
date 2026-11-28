import type { Metadata } from "next";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { Tracking } from "@/components/ads/Tracking";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCall } from "@/components/layout/StickyCall";
import { OnasHero, OnasJoin, OnasMission, OnasStory } from "@/components/onas/OnasSections";
import { Providers } from "@/components/Providers";
import { FinalCta } from "@/components/sections/FinalCta";
import { QuizSection } from "@/components/sections/QuizSection";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "O nas – szkoła matematyki online | ZdajMatme.com",
  description: "ZdajMatme.com – szkoła matematyki online stworzona z myślą o uczniu. Poznaj założycielkę Oliwię Siedlec i naszą misję: pewność siebie przez liczby.",
  alternates: { canonical: `${BRAND.url}/o-nas` },
};

/** Sub-page transferred from zdajmatme.com/o-nas; ends with the quiz + contact. */
export default function OnasPage() {
  return (
    <Providers>
      <Tracking />
      <Header />
      <main>
        <OnasHero />
        <OnasStory />
        <OnasMission />
        <OnasJoin />
        <QuizSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyCall />
      <ConsentBanner />
    </Providers>
  );
}
