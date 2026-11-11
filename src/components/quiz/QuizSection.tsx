"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { QUIZ_ANCHOR, QUIZ_EVENT } from "@/lib/quiz-bus";
import { Chapter } from "../ui/Chapter";

/** The quiz bundle loads only when the user approaches the chapter or clicks any CTA. */
const Quiz = dynamic(() => import("./Quiz").then((m) => m.Quiz), {
  ssr: false,
  loading: () => <QuizSkeleton />,
});

function QuizSkeleton() {
  return <div className="min-h-[34rem] animate-pulse rounded-[2rem] bg-white/[0.05] ring-1 ring-white/10" role="status" aria-busy="true" aria-label="Ładowanie quizu" />;
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
      tone="base"
      className="outline-none"
      titleText="Dopasuj korepetycje do ucznia"
      title="Dopasuj korepetycje do ucznia"
      lead="Kilka pytań, około 60 sekund, bez zakładania konta."
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-40 mx-auto h-80 max-w-2xl rounded-full bg-yellow-400/[0.06] blur-3xl" />
      <div className="relative max-w-4xl">{load ? <Quiz /> : <QuizSkeleton />}</div>
    </Chapter>
  );
}
