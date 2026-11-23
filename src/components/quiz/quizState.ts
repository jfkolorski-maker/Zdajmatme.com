import { QUIZ, QUIZ_IDS, isHidden, type QuizAnswers, type QuizId } from "../../data/quiz.ts";

export const SUMMARY_STEP = QUIZ.length;

export interface QuizState {
  step: number;
  direction: 1 | -1;
  answers: QuizAnswers;
  /** Phone typed before the quiz – unlocks the questions. */
  phone?: string;
  /** One id for this visitor's lead: the phone, the finished quiz and the full form share it. */
  leadId?: string;
  /** Answers last sent as a "finished quiz" capture (JSON), so it is not sent twice. */
  quizSent?: string;
}

export type QuizAction =
  | { type: "answer"; id: QuizId; value: string }
  | { type: "next" }
  | { type: "back" }
  | { type: "goTo"; step: number }
  | { type: "unlock"; phone: string; leadId: string }
  | { type: "quizSent"; key: string }
  | { type: "reset" }
  | { type: "hydrate"; state: QuizState };

export const initialQuizState: QuizState = { step: 0, direction: 1, answers: {} };

/** First unanswered step (or the summary once everything is answered). */
export function firstOpenStep(answers: QuizAnswers): number {
  const i = QUIZ_IDS.findIndex((id) => !isHidden(id, answers) && !answers[id]);
  return i === -1 ? SUMMARY_STEP : i;
}

const nextVisible = (from: number, a: QuizAnswers) => {
  let i = from + 1;
  while (i < QUIZ_IDS.length && isHidden(QUIZ_IDS[i], a)) i++;
  return i;
};
const prevVisible = (from: number, a: QuizAnswers) => {
  let i = Math.min(from, QUIZ_IDS.length) - 1;
  while (i > 0 && isHidden(QUIZ_IDS[i], a)) i--;
  return Math.max(0, i);
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "answer": {
      const answers = { ...state.answers, [action.id]: action.value };
      // drop answers to questions that no longer apply (e.g. colours when only walls are painted)
      for (const id of QUIZ_IDS) if (isHidden(id, answers)) delete answers[id];
      return { ...state, answers };
    }
    case "next": {
      const current = QUIZ_IDS[state.step];
      if (current && !state.answers[current]) return state;
      // All answered (first pass done, or an edit from the summary) → summary; otherwise one step on.
      const open = firstOpenStep(state.answers);
      const step = open === SUMMARY_STEP ? SUMMARY_STEP : Math.min(nextVisible(state.step, state.answers), open);
      return { ...state, step, direction: 1 };
    }
    case "back":
      return { ...state, step: prevVisible(state.step, state.answers), direction: -1 };
    case "goTo": {
      const step = Math.max(0, Math.min(action.step, firstOpenStep(state.answers)));
      return { ...state, step, direction: step >= state.step ? 1 : -1 };
    }
    case "unlock":
      return { ...state, phone: action.phone, leadId: action.leadId };
    case "quizSent":
      return { ...state, quizSent: action.key };
    case "reset":
      return initialQuizState;
    case "hydrate":
      return action.state;
  }
}

const KEY = "zdajmatme.quiz.v1";

export function loadQuiz(): QuizState | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as QuizState;
    if (typeof s.step !== "number" || typeof s.answers !== "object") return null;
    return { ...s, step: Math.min(s.step, firstOpenStep(s.answers)), direction: 1 };
  } catch {
    return null;
  }
}

export function saveQuiz(s: QuizState) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode – works in memory */
  }
}

export function clearQuiz() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
