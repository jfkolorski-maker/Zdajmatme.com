"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { QUIZ_STEPS, isStepAnswered, qualify, toggleOption, visibleSteps, type QuizAnswers } from "@/config/quiz";
import { QUIZ_EVENT, QUIZ_STORAGE, type PersistedQuiz } from "@/lib/quiz-bus";
import { readJSON, remove, writeJSON } from "@/lib/storage";
import { track } from "@/lib/tracking";
import { ArrowLeft, ArrowRight } from "../ui/Icons";
import { OptionButton } from "./OptionButton";
import { ResultView } from "./ResultView";
import { SuccessView } from "./SuccessView";

const EMPTY: PersistedQuiz = { answers: {}, stepIndex: 0, phase: "quiz", history: [] };
const AUTO_ADVANCE_MS = 340;
const SCREEN = { duration: 0.38, ease: [0.65, 0, 0.35, 1] as const };

/** Segmented progress: each segment fills with scaleX. */
function Segments({ total, done }: { total: number; done: number }) {
  return (
    <div className="mt-4 flex gap-1.5" role="progressbar" aria-label="Postęp quizu" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <m.span className="block h-full origin-left rounded-full bg-yellow-400" initial={false} animate={{ scaleX: i < done ? 1 : 0 }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }} />
        </span>
      ))}
    </div>
  );
}

export function Quiz() {
  const [state, setState] = useState<PersistedQuiz>(() => readJSON<PersistedQuiz>(QUIZ_STORAGE, "session") ?? EMPTY);
  const [success, setSuccess] = useState<string | null>(null);
  const [dir, setDir] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const enteredAt = useRef(Date.now());
  const timer = useRef<number | undefined>(undefined);
  const interacted = useRef(false);

  useEffect(() => {
    const onOpen = () => {
      const s = readJSON<PersistedQuiz>(QUIZ_STORAGE, "session");
      if (s) setState(s);
      setSuccess(null);
    };
    window.addEventListener(QUIZ_EVENT, onOpen);
    return () => window.removeEventListener(QUIZ_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!success) writeJSON(QUIZ_STORAGE, state, "session");
  }, [state, success]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const steps = visibleSteps(state.answers);
  const idx = Math.min(state.stepIndex, steps.length - 1);
  const step = steps[idx];
  // until the stage is known assume the longest path, so "z N" never jumps up
  const total = state.answers.stage ? steps.length : QUIZ_STEPS.length;

  // keep the card in view after each screen (user-initiated only) and move focus for screen readers
  useEffect(() => {
    enteredAt.current = Date.now();
    if (!interacted.current) return;
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 60 || top > window.innerHeight * 0.45) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [idx, state.phase, success]);

  const advance = useCallback((answers: QuizAnswers, fromIdx: number) => {
    setState((s) => {
      const vis = visibleSteps(answers);
      const cur = vis[fromIdx];
      const now = Date.now();
      const history = [...s.history, { step: cur.id, at: now, ms: now - enteredAt.current }].slice(-60);
      track("quiz_step_complete", { step_id: cur.id, step_number: fromIdx + 1, total_steps: vis.length });
      if (fromIdx + 1 >= vis.length) {
        track("quiz_complete", { total_steps: vis.length, lead_tier: qualify(answers).tier, path_preset: s.presetFrom });
        return { ...s, answers, history, phase: "result" };
      }
      return { ...s, answers, history, stepIndex: fromIdx + 1 };
    });
    setDir(1);
  }, []);

  const select = (value: string) => {
    interacted.current = true;
    window.clearTimeout(timer.current);
    const answers = toggleOption(step, state.answers, value);
    if (!state.startedAt) track("quiz_start", { path_preset: state.presetFrom });
    setState((s) => ({ ...s, answers, startedAt: s.startedAt ?? Date.now() }));
    if (!step.multi) timer.current = window.setTimeout(() => advance(answers, idx), AUTO_ADVANCE_MS);
  };

  const back = () => {
    interacted.current = true;
    window.clearTimeout(timer.current);
    setDir(-1);
    setState((s) => (s.phase === "result" ? { ...s, phase: "quiz", stepIndex: steps.length - 1 } : { ...s, stepIndex: Math.max(0, idx - 1) }));
  };

  const restart = () => {
    remove(QUIZ_STORAGE, "session");
    setSuccess(null);
    setState(EMPTY);
  };

  if (success) {
    return (
      <div ref={rootRef} className="scroll-mt-24">
        <SuccessView leadId={success} headingRef={headingRef} onNew={() => { interacted.current = true; restart(); }} />
      </div>
    );
  }

  const answered = step ? isStepAnswered(step, state.answers) : false;
  const selected = step ? state.answers[step.key] : undefined;
  const options = step ? step.options(state.answers) : [];

  return (
    <div ref={rootRef} className="card-app scroll-mt-24 overflow-hidden">
      <div className="px-4 pt-4 sm:px-7 sm:pt-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={back}
            disabled={state.phase === "quiz" && idx === 0}
            aria-label="Wstecz"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)] transition-opacity disabled:opacity-0"
          >
            <ArrowLeft />
          </button>
          <p className="flex-1 text-center text-sm font-semibold text-muted">{state.phase === "result" ? "Gotowe" : `Pytanie ${idx + 1} z ${total}`}</p>
          <span className="w-12" aria-hidden />
        </div>
        <Segments total={total} done={state.phase === "result" ? total : idx} />
      </div>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        {state.phase === "quiz" && step ? (
          <m.div key={step.id} initial={{ opacity: 0, x: dir * 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -28 }} transition={SCREEN} className="px-4 pb-5 pt-5 sm:px-7 sm:pb-7">
            <h3 ref={headingRef} tabIndex={-1} className="h3 text-center text-ink outline-none">
              {step.title(state.answers)}
            </h3>
            {step.subtitle?.(state.answers) && <p className="mt-1.5 text-center text-sm text-muted">{step.subtitle(state.answers)}</p>}

            <div role="group" aria-label={step.title(state.answers)} className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {options.map((o, i) => (
                <OptionButton
                  key={o.value}
                  index={i}
                  option={o}
                  wide={options.length % 2 === 1 && i === options.length - 1}
                  selected={Array.isArray(selected) ? selected.includes(o.value) : selected === o.value}
                  onClick={() => select(o.value)}
                />
              ))}
            </div>

            {step.multi && (
              <button
                type="button"
                disabled={!answered}
                onClick={() => {
                  interacted.current = true;
                  advance(state.answers, idx);
                }}
                className="btn btn-primary mt-5 w-full"
              >
                {answered ? "Dalej" : "Zaznacz co najmniej jedną odpowiedź"} {answered && <ArrowRight className="arrow" />}
              </button>
            )}
          </m.div>
        ) : (
          <m.div key="result" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={SCREEN}>
            <ResultView
              answers={state.answers}
              history={state.history}
              headingRef={headingRef}
              onEdit={back}
              onSuccess={(leadId) => {
                remove(QUIZ_STORAGE, "session");
                setSuccess(leadId);
              }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
