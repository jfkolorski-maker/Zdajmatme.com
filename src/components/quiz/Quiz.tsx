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
const AUTO_ADVANCE_MS = 280;

export function Quiz() {
  const [state, setState] = useState<PersistedQuiz>(() => readJSON<PersistedQuiz>(QUIZ_STORAGE, "session") ?? EMPTY);
  const [success, setSuccess] = useState<string | null>(null);
  const [dir, setDir] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const enteredAt = useRef(Date.now());
  const timer = useRef<number | undefined>(undefined);
  const interacted = useRef(false);

  // presets from path CTAs (written to storage by openQuiz before the event fires)
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

  // a11y + mobile: after each transition, keep the question in view and move focus to it
  useEffect(() => {
    enteredAt.current = Date.now();
    if (!interacted.current) return;
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.5) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    const startedAt = state.startedAt ?? Date.now();
    if (!state.startedAt) track("quiz_start", { path_preset: state.presetFrom });
    setState((s) => ({ ...s, answers, startedAt }));
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
        <SuccessView leadId={success} headingRef={headingRef} onHome={() => { restart(); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </div>
    );
  }

  // until the stage is known, assume the longest path so the counter never jumps up
  const total = state.answers.stage ? steps.length : QUIZ_STEPS.length;
  const progress = state.phase === "result" ? 1 : idx / total;
  const answered = step ? isStepAnswered(step, state.answers) : false;
  const selected = step ? state.answers[step.key] : undefined;

  return (
    <div ref={rootRef} className="scroll-mt-24 overflow-hidden rounded-[2rem] bg-navy-900/80 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/10 backdrop-blur">
      {/* progress */}
      <div className="flex items-center gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Postęp quizu" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <m.div className="h-full rounded-full bg-yellow-400" initial={false} animate={{ width: `${Math.max(progress * 100, 4)}%` }} transition={{ duration: 0.5 }} />
        </div>
        <span className="shrink-0 text-sm font-bold tabular-nums text-white/70">
          {state.phase === "result" ? "Gotowe" : `Krok ${idx + 1} z ${total}`}
        </span>
      </div>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        {state.phase === "quiz" && step ? (
          <m.div
            key={step.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -36 }}
            transition={{ duration: 0.32 }}
            className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8"
          >
            <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold outline-none sm:text-[2rem] sm:leading-tight">
              {step.title(state.answers)}
            </h3>
            {step.subtitle?.(state.answers) && <p className="mt-2 text-white/60">{step.subtitle(state.answers)}</p>}

            <div role="group" aria-label={step.title(state.answers)} className={`mt-6 grid gap-3 ${step.options(state.answers).length > 4 ? "sm:grid-cols-2" : ""}`}>
              {step.options(state.answers).map((o, i) => (
                <OptionButton
                  key={o.value}
                  index={i}
                  option={o}
                  multi={step.multi}
                  selected={Array.isArray(selected) ? selected.includes(o.value) : selected === o.value}
                  onClick={() => select(o.value)}
                />
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              {idx > 0 ? (
                <button type="button" onClick={back} className="btn btn-ghost-dark !min-h-12 !px-4">
                  <ArrowLeft /> Wstecz
                </button>
              ) : (
                <span />
              )}
              {(step.multi || answered) && (
                <button
                  type="button"
                  disabled={!answered}
                  onClick={() => {
                    interacted.current = true;
                    window.clearTimeout(timer.current);
                    advance(state.answers, idx);
                  }}
                  className="btn btn-primary !min-h-12"
                >
                  Dalej <ArrowRight className="arrow" />
                </button>
              )}
            </div>
            {step.multi && !answered && <p className="mt-3 text-right text-sm text-white/50">Zaznacz co najmniej jedną odpowiedź.</p>}
          </m.div>
        ) : (
          <m.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <ResultView
              answers={state.answers}
              history={state.history}
              headingRef={headingRef}
              onBack={back}
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
