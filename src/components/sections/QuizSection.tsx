import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Quiz } from "@/components/quiz/Quiz";

/** Umów pierwszą lekcję – the quiz; always starts from the first question. */
export function QuizSection() {
  return (
    <section id="zapisy" aria-labelledby="quiz-title" className="section-y relative overflow-hidden bg-surface text-white">
      <div className="shell relative text-center">
        <SectionHead
          chapter="zapisy"
          title="Umów pierwszą lekcję!"
          accent={["pierwszą", "lekcję!"]}
          lead="Kilka kliknięć, około minuty. Oddzwonimy i ustalimy termin."
          id="quiz-title"
        />
        <FadeUp className="-mx-2 mt-8 sm:mx-0 md:mt-12" delay={0.12}>
          <Quiz />
        </FadeUp>
      </div>
    </section>
  );
}
