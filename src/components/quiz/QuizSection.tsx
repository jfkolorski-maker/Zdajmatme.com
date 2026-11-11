"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { QUIZ_ANCHOR, QUIZ_EVENT } from "@/lib/quiz-bus";
import { site } from "@/config/site";

/** The quiz bundle loads only when the user approaches the section or clicks any CTA. */
const Quiz = dynamic(() => import("./Quiz").then((m) => m.Quiz), {
  ssr: false,
  loading: () => <QuizSkeleton />,
});

function QuizSkeleton() {
  return (
    <div className="min-h-[34rem] animate-pulse rounded-[2rem] bg-white/[0.06] ring-1 ring-white/10" aria-busy="true" aria-label="Ładowanie quizu" />
  );
}

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
    // restore when returning mid-quiz (session) or arriving at #dopasuj
    if (window.location.hash === `#${QUIZ_ANCHOR}`) setLoad(true);
    return () => {
      io.disconnect();
      window.removeEventListener(QUIZ_EVENT, onOpen);
    };
  }, []);

  return (
    <section
      ref={ref}
      id={QUIZ_ANCHOR}
      tabIndex={-1}
      data-hide-sticky
      aria-labelledby="quiz-heading"
      className="relative scroll-mt-16 overflow-hidden bg-navy-950 py-16 text-white outline-none sm:py-24"
    >
      <div aria-hidden className="grid-paper absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div aria-hidden className="absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-yellow-400/[0.08] blur-3xl" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-yellow-400">Dopasowanie w ok. 60 sekund</p>
          <h2 id="quiz-heading" className="h-section mt-3">
            Dopasuj korepetycje do ucznia
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Kilka krótkich pytań, bez zakładania konta. Na końcu {site.owner.firstName} skontaktuje się z Tobą i dobierze korepetytora.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">{load ? <Quiz /> : <QuizSkeleton />}</div>
      </div>
    </section>
  );
}
