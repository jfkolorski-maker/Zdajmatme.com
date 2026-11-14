import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Steps } from "@/components/sections/Steps";
import { LessonDemo } from "@/components/sections/LessonDemo";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Standard } from "@/components/sections/Standard";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { MobileStickyCta } from "@/components/ui/MobileStickyCta";
import { structuredData } from "@/lib/seo";

/** Order = CHAPTERS in src/config/chapters.ts */
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }} />
      <Header />
      <main id="main">
        <Hero />
        <Steps />
        <LessonDemo />
        <QuizSection />
        <Standard />
        <Team />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
