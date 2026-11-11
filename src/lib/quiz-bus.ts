"use client";
import { PATH_PRESETS, sanitizeAnswers, type PathPreset, type QuizAnswers } from "@/config/quiz";
import { readJSON, writeJSON } from "./storage";

/** Decoupled "open the quiz" bus: any CTA can open/prefill the quiz without shared React state. */
export const QUIZ_EVENT = "zm:open-quiz";
export const QUIZ_STORAGE = "zm_quiz_v1";
export const QUIZ_ANCHOR = "dopasuj";

export interface PersistedQuiz {
  answers: QuizAnswers;
  stepIndex: number;
  phase: "quiz" | "result";
  history: { step: string; at: number; ms?: number }[];
  startedAt?: number;
  presetFrom?: PathPreset;
}

export function openQuiz(preset?: PathPreset) {
  if (preset) {
    const cur = readJSON<PersistedQuiz>(QUIZ_STORAGE, "session");
    const answers = sanitizeAnswers({ ...(cur?.answers ?? {}), ...PATH_PRESETS[preset] });
    writeJSON(QUIZ_STORAGE, { answers, stepIndex: 0, phase: "quiz", history: cur?.history ?? [], startedAt: cur?.startedAt, presetFrom: preset } satisfies PersistedQuiz, "session");
  }
  window.dispatchEvent(new CustomEvent(QUIZ_EVENT, { detail: { preset } }));
  const el = document.getElementById(QUIZ_ANCHOR);
  if (el) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    // move focus for keyboard / screen-reader users once scrolling has settled
    window.setTimeout(() => el.focus({ preventScroll: true }), reduce ? 0 : 700);
  }
}
