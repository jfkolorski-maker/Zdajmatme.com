"use client";

import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { QuizArt, hasQuizArt } from "./QuizArt";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { QUIZ, isHidden, offerSummary, questionOf, summarize, type QuizAnswers, type QuizStepDef } from "@/data/quiz";
import { track } from "@/lib/ads/track";
import { DUR, EASE_OUT, SPRING } from "@/lib/motion";
import { PRESET_EVENT } from "@/components/sections/Offer";
import { LeadForm } from "./LeadForm";
import { SUMMARY_STEP, clearQuiz, initialQuizState, loadQuiz, quizReducer, saveQuiz } from "./quizState";

const ADVANCE_MS = 340;

/** Quiz as a small app: one screen per question, segmented progress, spring feedback. */
export function Quiz() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [sent, setSent] = useState(false);
  const reduced = useReducedMotion();
  const hydrated = useRef(false);
  const started = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const card = useRef<HTMLDivElement>(null);
  const prevStep = useRef(0);

  useEffect(() => {
    const saved = loadQuiz();
    if (saved) {
      started.current = Object.keys(saved.answers).length > 0;
      prevStep.current = saved.step;
      dispatch({ type: "hydrate", state: saved });
    }
    hydrated.current = true;
    return () => window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (hydrated.current) saveQuiz(state);
  }, [state]);

  // offer cards pre-select "Czego szukasz?" and open the next question
  useEffect(() => {
    const onPreset = (e: Event) => {
      const offer = (e as CustomEvent<{ offer: string }>).detail?.offer;
      if (!offer) return;
      if (!started.current) {
        started.current = true;
        track({ name: "quiz_start" });
      }
      setSent(false);
      dispatch({ type: "answer", id: "offer", value: offer });
      dispatch({ type: "goTo", step: 1 });
    };
    window.addEventListener(PRESET_EVENT, onPreset);
    return () => window.removeEventListener(PRESET_EVENT, onPreset);
  }, []);

  // Keep the card's top in view on small screens and move focus to the new screen.
  useEffect(() => {
    if (prevStep.current === state.step) return;
    prevStep.current = state.step;
    const el = card.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.4) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    const t = window.setTimeout(() => el.querySelector<HTMLElement>("[data-screen-title]")?.focus({ preventScroll: true }), 380);
    return () => window.clearTimeout(t);
  }, [state.step, reduced]);

  // After a successful send the card gets much shorter – bring the thank-you message into view.
  useEffect(() => {
    if (!sent) return;
    const el = card.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [sent, reduced]);

  const onSummaryNow = state.step >= SUMMARY_STEP;

  const choose = (step: QuizStepDef, index: number, value: string) => {
    if (!started.current) {
      started.current = true;
      track({ name: "quiz_start" });
    }
    track({ name: "quiz_step", step: index + 1, question: step.id });
    dispatch({ type: "answer", id: step.id, value });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        dispatch({ type: "next" });
        if (step.id === "start") track({ name: "quiz_complete" });
      },
      reduced ? 0 : ADVANCE_MS,
    );
  };

  const restart = () => {
    clearQuiz();
    setSent(false);
    started.current = false;
    dispatch({ type: "reset" });
  };

  // questions that apply to these answers (e.g. no colour question when only walls are painted)
  const visible = QUIZ.filter((q) => !isHidden(q.id, state.answers));
  const total = visible.length;
  const onSummary = onSummaryNow;
  const pos = onSummary ? total : Math.max(0, visible.findIndex((q) => q.id === QUIZ[state.step]?.id));
  const dir = state.direction;

  return (
    <div ref={card} className="mx-auto w-full max-w-2xl scroll-mt-20 overflow-hidden rounded-[24px] bg-white text-left shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)]">
      {/* App bar */}
      <div className="flex items-center gap-3 px-4 pt-4 sm:px-7 sm:pt-6">
        <motion.button
          type="button"
          onClick={() => dispatch({ type: "back" })}
          disabled={state.step === 0 || sent}
          whileTap={{ scale: 0.9 }}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bg text-surface transition-opacity disabled:pointer-events-none disabled:opacity-0"
          aria-label="Wstecz"
        >
          <Icon name="back" size={20} />
        </motion.button>
        <div className="flex-1">
          <div className="flex justify-between text-[0.8rem] font-semibold">
            <span className="text-surface">{onSummary ? "Gotowe" : `Pytanie ${pos + 1} z ${total}`}</span>
            <span className="text-muted">{onSummary ? "100%" : `${Math.round((pos / total) * 100)}%`}</span>
          </div>
          <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0,1fr))` }} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={pos} aria-label="Postęp quizu">
            {visible.map((q, i) => (
              <span key={q.id} className="h-1.5 overflow-hidden rounded-full bg-bg">
                <motion.span
                  className="block h-full origin-left rounded-full bg-accent"
                  initial={false}
                  animate={{ scaleX: i < pos || onSummary ? 1 : i === pos ? 0.35 : 0 }}
                  transition={{ duration: DUR.ui, ease: EASE_OUT }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-5 sm:px-7 sm:pt-8 sm:pb-8">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={onSummary ? (sent ? "sent" : "summary") : state.step}
            custom={dir}
            initial={{ opacity: 0, x: reduced ? 0 : 28 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -28 * dir }}
            transition={{ duration: DUR.ui, ease: EASE_OUT }}
          >
            {!onSummary ? (
              <Question step={QUIZ[state.step]} title={questionOf(QUIZ[state.step], state.answers)} index={state.step} selected={state.answers[QUIZ[state.step].id]} onChoose={choose} />
            ) : sent ? (
              <Done onRestart={restart} />
            ) : (
              <Summary answers={state.answers} onEdit={(i) => dispatch({ type: "goTo", step: i })} onSent={() => setSent(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Question({ step, title, index, selected, onChoose }: { step: QuizStepDef; title: string; index: number; selected?: string; onChoose: (s: QuizStepDef, i: number, v: string) => void }) {
  return (
    <fieldset>
      <legend data-screen-title tabIndex={-1} className="t-h3 w-full text-center text-surface outline-none">
        {title}
      </legend>
      <div role="radiogroup" aria-label={title} className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {step.options.map((o, i) => {
          const on = selected === o.value;
          const wide = step.options.length % 2 === 1 && i === step.options.length - 1;
          return (
            <motion.button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChoose(step, index, o.value)}
              className={`tile ${on ? "is-on" : ""} ${wide ? "sm:col-span-2" : ""}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, scale: on ? 1.015 : 1 }}
              transition={{ opacity: { duration: DUR.ui, delay: 0.05 * i }, y: { duration: DUR.ui, ease: EASE_OUT, delay: 0.05 * i }, scale: SPRING }}
              whileTap={{ scale: 0.97 }}
            >
              {hasQuizArt(o.value) ? (
                <span className="tile-art">
                  <QuizArt value={o.value} />
                </span>
              ) : (
                <span className="tile-icon">
                  <Icon name={o.icon} size={22} />
                </span>
              )}
              <span className="flex-1 leading-snug">{o.label}</span>
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${on ? "border-accent bg-accent text-night" : "border-line"}`}>
                <AnimatePresence>
                  {on && (
                    <motion.svg key="c" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <motion.path d="M4 12.5l5 5L20 6.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, ease: EASE_OUT }} />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

function DrawCheck({ size = 64 }: { size?: number }) {
  return (
    <motion.span className="mx-auto grid place-items-center rounded-full bg-accent text-night" style={{ width: size, height: size }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING}>
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <motion.path d="M4 12.5l5 5L20 6.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.15 }} />
      </svg>
    </motion.span>
  );
}

/**
 * Price first, the contact form right under it (no scrolling past a list of
 * answers to find it), the answers folded into one line at the bottom.
 */
function Summary({ answers, onEdit, onSent }: { answers: QuizAnswers; onEdit: (i: number) => void; onSent: () => void }) {
  const rows = summarize(answers);
  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <DrawCheck size={36} />
        <h3 data-screen-title tabIndex={-1} className="text-[1.2rem] font-bold leading-tight text-surface outline-none sm:text-[1.35rem]">
          Gotowe! Oto Twoje dopasowanie.
        </h3>
      </div>

      <PriceBox answers={answers} />

      <div className="mt-4 rounded-[22px] bg-bg p-4 sm:p-6">
        <LeadForm answers={answers} onSent={onSent} />
      </div>

      <PhoneLink placement="quiz_summary" className="mt-3 flex items-center justify-center gap-2 py-2 text-[0.95rem] font-semibold text-surface hover:text-accent">
        <Icon name="phone" size={17} className="text-accent" />
        Wolisz porozmawiać? Zadzwoń teraz
      </PhoneLink>

      {/* the answers, folded: one line, open to change one */}
      <details className="group mt-2 rounded-2xl border border-line">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm text-surface [&::-webkit-details-marker]:hidden">
          <span>
            <span className="font-semibold">Twoje odpowiedzi</span> <span className="text-muted">({rows.length}) · zmień</span>
          </span>
          <span className="text-muted transition-transform group-open:rotate-180" aria-hidden="true">
            ▾
          </span>
        </summary>
        <ul className="flex flex-wrap gap-2 px-4 pb-4">
          {rows.map((r, i) => (
            <li key={r.id}>
              <button type="button" onClick={() => onEdit(i)} className="rounded-full bg-bg px-3 py-1.5 text-left text-[0.82rem] text-surface transition-colors hover:bg-accent/10" aria-label={`Zmień – ${r.label}: ${r.value}`}>
                <span className="text-muted">{r.label}: </span>
                <span className="font-semibold">{r.value}</span>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function Done({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="py-4 text-center" role="status">
      <DrawCheck size={76} />
      <h3 data-screen-title tabIndex={-1} className="t-h3 mt-6 text-surface outline-none">
        Dziękujemy! Zgłoszenie dotarło.
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-muted">Oddzwonimy, aby umówić pierwszą lekcję. Wolisz porozmawiać od razu? Zadzwoń.</p>
      <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
        <PhoneLink placement="quiz_success" className="btn btn-primary w-full">
          <Icon name="phone" size={18} />
          Zadzwoń teraz
        </PhoneLink>
        <button type="button" onClick={onRestart} className="btn btn-secondary w-full">
          Nowe zgłoszenie
        </button>
      </div>
    </div>
  );
}

/** Price for 1:1 lessons (counts up), or the chosen course – the answers restated, not a diagnosis. */
function PriceBox({ answers }: { answers: QuizAnswers }) {
  const o = offerSummary(answers);
  return (
    <motion.div
      className="mt-3 rounded-[22px] bg-surface px-5 py-4 text-center text-white"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING, delay: 0.25 }}
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{o.title}</p>
      {o.price !== null ? (
        <p className="mt-2 text-[clamp(1.9rem,8vw,2.6rem)] font-bold leading-none tracking-tight tabular-nums">
          <Count to={o.price} /> <span className="text-[0.5em] font-semibold text-white/70">{o.note}</span>
        </p>
      ) : (
        <p className="mt-2 text-[1.15rem] font-semibold leading-snug">{o.note}</p>
      )}
      <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-snug text-white/80">
        Akceptujesz? <strong className="text-white">Zostaw dane poniżej</strong> – oddzwonimy i umówimy pierwszą lekcję.
      </p>
    </motion.div>
  );
}

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = `${to} zł`;
      return;
    }
    const c = animate(0, to, { duration: 1.2, ease: EASE_OUT, delay: 0.35, onUpdate: (v) => (el.textContent = `${Math.round(v)} zł`) });
    return () => c.stop();
  }, [to, reduced]);
  return <span ref={ref}>{to} zł</span>;
}
