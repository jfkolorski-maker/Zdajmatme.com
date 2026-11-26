import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Quiz } from "@/components/quiz/Quiz";

/** 04 · Umów pierwszą lekcję – replaces the long zdajmatme.com form with the FLIPOR quiz. */
export function QuizSection() {
  return (
    <section id="zapisy" aria-labelledby="quiz-title" className="section-y relative overflow-hidden bg-surface text-white">
      <div className="shell relative text-center">
        <SectionHead
          chapter="zapisy"
          title="Umów pierwszą lekcję!"
          accent={["pierwszą", "lekcję!"]}
          lead="Kilka krótkich pytań, bez zakładania konta. Na końcu krótki formularz – oddzwonimy i ustalimy termin."
          id="quiz-title"
        />
        <FadeUp className="-mx-2 mt-8 sm:mx-0 md:mt-12" delay={0.12}>
          <Quiz />
        </FadeUp>
      </div>
    </section>
  );
}
