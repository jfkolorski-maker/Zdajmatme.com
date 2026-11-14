"use client";
import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { isHighSchool, labelOf, labelsOf, type QuizAnswers } from "@/config/quiz";
import { site } from "@/config/site";
import { trackCall } from "@/lib/tracking";
import { LeadForm } from "./LeadForm";

type History = { step: string; at: number; ms?: number }[];

function Counter({ to }: { to: number }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return setV(to);
    const c = animate(0, to, { duration: 1.2, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to, reduce]);
  return <span className="tabular-nums">{v}</span>;
}

/**
 * One screen: "Gotowe!" → dark box with the price and a restatement of the answers (not a diagnosis)
 * → the contact form right away → call link → collapsed answers with "zmień".
 */
export function ResultView({ answers, history, headingRef, onEdit, onSuccess }: { answers: QuizAnswers; history: History; headingRef: React.RefObject<HTMLHeadingElement | null>; onEdit: () => void; onSuccess: (leadId: string) => void }) {
  const self = answers.who === "self";
  const topics = labelsOf("topics", (answers.topics ?? []).filter((t) => t !== "unknown"));
  const rows: [string, string][] = [
    ["Etap", labelOf("stage", answers.stage)],
    ...(isHighSchool(answers.stage) ? [["Poziom", labelOf("mathLevel", answers.mathLevel)] as [string, string]] : []),
    ["Trudność", labelsOf("problems", answers.problems).join(", ")],
    ["Zagadnienia", topics.length ? topics.join(", ") : "Do ustalenia w rozmowie"],
    ["Cel", labelOf("goal", answers.goal)],
    ["Start", labelOf("start", answers.start)],
  ];

  return (
    <div className="px-4 pb-6 pt-5 sm:px-7 sm:pb-8">
      <h3 ref={headingRef} tabIndex={-1} className="h3 text-center text-ink outline-none">
        Gotowe! Oto Twoje dopasowanie.
      </h3>

      <div className="mt-4 rounded-[20px] bg-navy-900 p-5 text-white">
        <p className="text-sm font-semibold text-white/65">Indywidualna lekcja online 1:1</p>
        <p className="mt-1 text-[2.1rem] font-[760] leading-none tracking-[-0.03em] text-yellow-400">
          <Counter to={site.price.amount} /> zł <span className="text-lg font-semibold text-white/75">/ {site.price.minutes} min</span>
        </p>
        <p className="mt-3 text-[0.98rem] text-white/80">
          {topics.length ? (
            <>
              {self ? "Pomożemy Ci" : "Pomożemy uczniowi"} w obszarze: <b className="text-white">{topics.join(", ")}</b>.
            </>
          ) : (
            <>Konkretne tematy ustalimy w krótkiej rozmowie.</>
          )}{" "}
          Akceptujesz? Zostaw dane — {site.owner.firstName} oddzwoni i dobierze korepetytora.
        </p>
      </div>

      <div className="mt-6">
        <LeadForm answers={answers} history={history} onSuccess={onSuccess} />
      </div>

      <p className="mt-5 text-center text-[0.98rem] text-muted">
        Wolisz porozmawiać?{" "}
        <a href={site.phone.href} onClick={() => trackCall("quiz_result")} className="inline-flex min-h-12 items-center font-semibold text-ink underline underline-offset-4">
          Zadzwoń teraz: {site.phone.display}
        </a>
      </p>

      <details className="group mt-2 rounded-[16px] bg-bg">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-ink">
          Twoje odpowiedzi ({rows.length})
          <span className="text-muted group-open:hidden">pokaż</span>
          <span className="hidden text-muted group-open:inline">ukryj</span>
        </summary>
        <dl className="divide-y divide-line px-4 pb-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-2 py-2">
              <dt className="text-muted">{k}</dt>
              <dd className="font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={onEdit} className="mx-4 mb-3 inline-flex min-h-12 items-center text-sm font-semibold text-ink underline underline-offset-4">
          Zmień odpowiedzi
        </button>
      </details>
    </div>
  );
}
