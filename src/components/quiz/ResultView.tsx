"use client";
import { isHighSchool, labelOf, labelsOf, type QuizAnswers } from "@/config/quiz";
import { site } from "@/config/site";
import { ArrowLeft } from "../ui/Icons";
import { LeadForm } from "./LeadForm";

/**
 * Personalised summary = a restatement of the user's answers (NOT an educational diagnosis).
 */
export function ResultView({
  answers,
  history,
  headingRef,
  onBack,
  onSuccess,
}: {
  answers: QuizAnswers;
  history: PersistedHistory;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onSuccess: (leadId: string) => void;
}) {
  const self = answers.who === "self";
  const topics = (answers.topics ?? []).filter((t) => t !== "unknown");
  const topicLabels = labelsOf("topics", topics);
  const subject = self ? "potrzebujesz" : "uczeń potrzebuje";

  const rows: [string, string][] = [
    ["Etap nauki", labelOf("stage", answers.stage)],
    ...(isHighSchool(answers.stage) ? [["Poziom", labelOf("mathLevel", answers.mathLevel)] as [string, string]] : []),
    ["Główna trudność", labelsOf("problems", answers.problems).join(", ")],
    ["Zagadnienia", topicLabels.length ? topicLabels.join(", ") : "Do ustalenia podczas rozmowy"],
    ["Cel", labelOf("goal", answers.goal)],
    ["Start", labelOf("start", answers.start)],
  ];

  return (
    <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
      <div className="border-b border-white/10 px-5 pb-7 pt-6 sm:px-8 lg:border-b-0 lg:border-r">
        <p className="eyebrow text-yellow-400">Twoje dopasowanie</p>
        <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-extrabold outline-none sm:text-3xl">
          Przygotujemy indywidualną ścieżkę nauki.
        </h3>
        <p className="mt-4 leading-relaxed text-white/75">
          {topicLabels.length ? (
            <>
              Na podstawie Twoich odpowiedzi wiemy, że {subject} wsparcia w obszarze:{" "}
              <b className="text-white">{topicLabels.join(", ")}</b>.
            </>
          ) : (
            <>Na podstawie Twoich odpowiedzi wiemy, że {subject} wsparcia — konkretne obszary pomoże ustalić rozmowa.</>
          )}{" "}
          Dobierzemy korepetytora, który pomoże uporządkować materiał, zrozumieć trudniejsze zagadnienia i pracować nad określonym celem.
        </p>
        <dl className="mt-6 divide-y divide-white/10 rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-white/55">{k}</dt>
              <dd className="font-bold text-white">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-yellow-400 px-4 py-3 text-navy-950">
          <span className="text-sm font-bold">Indywidualna lekcja online 1:1</span>
          <span className="text-lg font-extrabold">{site.price.label}</span>
        </div>
        <button type="button" onClick={onBack} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Zmień odpowiedzi
        </button>
      </div>
      <div className="px-5 pb-8 pt-6 sm:px-8">
        <LeadForm answers={answers} history={history} onSuccess={onSuccess} />
      </div>
    </div>
  );
}

type PersistedHistory = { step: string; at: number; ms?: number }[];
