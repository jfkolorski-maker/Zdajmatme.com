import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Paths } from "@/components/sections/Paths";
import { Process } from "@/components/sections/Process";
import { QuizSection } from "@/components/quiz/QuizSection";
import { LessonDemo } from "@/components/sections/LessonDemo";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { MobileStickyCta } from "@/components/ui/MobileStickyCta";
import { structuredData } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }} />
      <Header />
      <main id="main">
        <Hero />
        <Paths />
        <Process />
        <QuizSection />
        <LessonDemo />
        <Team />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
