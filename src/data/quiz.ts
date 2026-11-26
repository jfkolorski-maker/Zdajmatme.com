/**
 * Quiz definition (FLIPOR engine: one question per screen, auto-advance, hidden questions).
 * Topics mirror the zdajmatme.com contact form ("Temat wiadomości"): individual lessons
 * (basic / extended), 8th-grade course, matura course (basic / extended).
 * 3–6 questions depending on the path – then the contact form.
 */
export const QUIZ = [
  {
    id: "offer",
    question: "Czego szukasz?",
    summary: "Oferta",
    options: [
      { value: "indiv", label: "Korepetycje indywidualne online", icon: "user" },
      { value: "e8", label: "Kurs do Egzaminu Ósmoklasisty", icon: "target" },
      { value: "matura", label: "Kurs Maturalny 2026", icon: "cap" },
      { value: "other", label: "Jeszcze nie wiem – doradźcie", icon: "chat" },
    ],
  },
  {
    id: "who",
    question: "Dla kogo szukasz zajęć?",
    summary: "Dla kogo",
    options: [
      { value: "child", label: "Dla dziecka", icon: "users" },
      { value: "self", label: "Dla siebie", icon: "user" },
    ],
  },
  {
    id: "stage",
    question: "Na jakim etapie nauki jest uczeń?",
    summary: "Etap nauki",
    options: [
      { value: "sp48", label: "Klasy 4–8 i przygotowanie do egzaminu ósmoklasisty", icon: "book" },
      { value: "lobasic", label: "Liceum / technikum – poziom podstawowy", icon: "cap" },
      { value: "loext", label: "Liceum / technikum – poziom rozszerzony", icon: "cap" },
      { value: "prep", label: "Przygotowanie do matury (podstawa lub rozszerzenie)", icon: "cap" },
    ],
  },
  {
    id: "level",
    question: "Jaki poziom matematyki?",
    summary: "Poziom",
    options: [
      { value: "basic", label: "Podstawowy", icon: "single" },
      { value: "extended", label: "Rozszerzony", icon: "two" },
      { value: "unsure", label: "Jeszcze nie wiem", icon: "chat" },
    ],
  },
  {
    id: "need",
    question: "Co jest teraz najważniejsze?",
    summary: "Cel",
    options: [
      { value: "grades", label: "Lepsze oceny i nadrobienie zaległości", icon: "trend" },
      { value: "understand", label: "Zrozumienie materiału", icon: "spark" },
      { value: "exam", label: "Przygotowanie do egzaminu lub matury", icon: "target" },
      { value: "confidence", label: "Pewność siebie i mniej stresu", icon: "thumb" },
      { value: "regular", label: "Regularne wsparcie w nauce", icon: "calendar" },
    ],
  },
  {
    id: "start",
    question: "Kiedy chcesz zacząć?",
    summary: "Start",
    options: [
      { value: "asap", label: "Jak najszybciej", icon: "bolt" },
      { value: "7d", label: "W ciągu 7 dni", icon: "clock" },
      { value: "2-4w", label: "W ciągu 2–4 tygodni", icon: "calendar" },
      { value: "browsing", label: "Dopiero się rozglądam", icon: "eye" },
    ],
  },
] as const;

export type QuizStepDef = (typeof QUIZ)[number];
export type QuizId = QuizStepDef["id"];
export type QuizAnswers = Partial<Record<QuizId, string>>;

export const QUIZ_IDS = QUIZ.map((s) => s.id) as QuizId[];

export function labelOf(id: QuizId, value?: string): string {
  const step = QUIZ.find((s) => s.id === id);
  return (step?.options as readonly { value: string; label: string }[] | undefined)?.find((o) => o.value === value)?.label ?? "";
}

const isCourse = (o?: string) => o === "e8" || o === "matura";

/**
 * Questions that only make sense after certain answers:
 * – courses fix the stage (8th grade / final year) → no stage question, no "need" question;
 * – the level question only for the matura course or matura preparation in 1:1 lessons
 *   (the high-school answers already say "podstawowy" / "rozszerzony").
 */
export function isHidden(id: QuizId, a: QuizAnswers): boolean {
  if (id === "stage") return isCourse(a.offer);
  if (id === "need") return isCourse(a.offer);
  if (id === "level") return a.offer !== "matura" && !(a.offer !== "e8" && a.stage === "prep");
  return false;
}
export const visibleIds = (answers: QuizAnswers) => QUIZ_IDS.filter((id) => !isHidden(id, answers));

/** Question title can address a student directly. */
export function questionOf(step: QuizStepDef, a: QuizAnswers): string {
  if (step.id === "stage" && a.who === "self") return "Na jakim etapie nauki jesteś?";
  return step.question;
}

export function summarize(answers: QuizAnswers) {
  return QUIZ.filter((s) => answers[s.id] && !isHidden(s.id, answers)).map((s) => ({ id: s.id, label: s.summary, value: labelOf(s.id, answers[s.id]) }));
}

export function isComplete(answers: QuizAnswers): boolean {
  return visibleIds(answers).every((id) => Boolean(labelOf(id, answers[id])));
}

/** Minors never leave their own contact data: primary-school students are always minors. */
export function isMinorStudent(a: QuizAnswers): boolean {
  return a.who === "self" && (a.stage === "sp48" || a.offer === "e8");
}

/** What the summary box shows: fixed price for 1:1, courses are discussed on the call. */
export function offerSummary(a: QuizAnswers): { title: string; price: number | null; note: string } {
  if (a.offer === "e8") return { title: "Kurs do Egzaminu Ósmoklasisty", price: null, note: "Szczegóły kursu i cenę omówimy w krótkiej rozmowie." };
  if (a.offer === "matura") return { title: `Kurs Maturalny 2026${a.level === "extended" ? " · rozszerzenie" : a.level === "basic" ? " · podstawa" : ""}`, price: null, note: "Szczegóły kursu i cenę omówimy w krótkiej rozmowie." };
  return { title: "Lekcja indywidualna online 1-na-1", price: 110, note: "zł / 60 min" };
}
