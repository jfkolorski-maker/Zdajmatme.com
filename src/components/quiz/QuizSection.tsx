"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { PathPreset } from "@/config/quiz";
import { QUIZ_ANCHOR, QUIZ_EVENT, openQuiz } from "@/lib/quiz-bus";
import { track } from "@/lib/tracking";
import { Chapter } from "../ui/Chapter";

/** The quiz bundle loads only when the user approaches the chapter or clicks any CTA. */
const Quiz = dynamic(() => import("./Quiz").then((m) => m.Quiz), { ssr: false, loading: () => <QuizSkeleton /> });

function QuizSkeleton() {
  return <div role="status" aria-busy="true" aria-label="Ładowanie quizu" className="min-h-[34rem] rounded-[24px] bg-white/[0.06]" />;
}

/** Quick start = the four "Dla kogo" paths; each pre-fills the quiz. */
const QUICK: { id: PathPreset; label: string }[] = [
  { id: "grades", label: "Poprawa ocen" },
  { id: "exam8", label: "Egzamin ósmoklasisty" },
  { id: "matura_basic", label: "Matura podstawowa" },
  { id: "matura_ext", label: "Matura rozszerzona" },
];

export function QuizSection() {
  const ref = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "800px 0px" });
    io.observe(el);
    const onOpen = () => setLoad(true);
    window.addEventListener(QUIZ_EVENT, onOpen);
    if (window.location.hash === `#${QUIZ_ANCHOR}`) setLoad(true);
    return () => {
      io.disconnect();
      window.removeEventListener(QUIZ_EVENT, onOpen);
    };
  }, []);

  return (
    <Chapter
      ref={ref}
      id={QUIZ_ANCHOR}
      tabIndex={-1}
      data-hide-sticky
      className="outline-none"
      title={<>Dopasuj korepetycje<br />w około 60 sekund.</>}
      lead="Jedno pytanie na ekran, bez zakładania konta. Na końcu cena i krótki formularz."
      headerExtra={
        <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Szybki start">
          {QUICK.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                track("cta_click", { cta_location: "quiz_quickstart", cta_target: "quiz", path_preset: q.id });
                openQuiz(q.id);
              }}
              className="min-h-12 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/[0.14]"
            >
              {q.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="mx-auto max-w-2xl">{load ? <Quiz /> : <QuizSkeleton />}</div>
    </Chapter>
  );
}
