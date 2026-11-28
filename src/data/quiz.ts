/**
 * Quiz definition (FLIPOR engine: one question per screen, auto-advance, hidden questions).
 * Topics mirror the zdajmatme.com contact form ("Temat wiadomości"): individual lessons
 * (basic / extended), 8th-grade course, matura course (basic / extended).
 * 2–5 questions depending on the path – then the form (courses: fixed day/time;
 * 1:1 lessons: date of the first lesson + an hour range).
 */
export const QUIZ = [
  {
    id: "offer",
    question: "Czego szukasz?",
    summary: "Oferta",
    options: [
      { value: "indiv", label: "Korepetycje indywidualne", hint: "Matematyka · 1-na-1 online", icon: "user" },
      { value: "e8", label: "Kurs do Egzaminu Ósmoklasisty", hint: "Rok szkolny 2027/2028", icon: "target" },
      { value: "matura", label: "Kurs maturalny", hint: "Rok szkolny 2027/2028", icon: "cap" },
      { value: "science", label: "Fizyka, chemia, biologia", hint: "Korepetycje 1-na-1 online", icon: "spark" },
    ],
  },
  {
    id: "subject",
    question: "Z jakich przedmiotów?",
    summary: "Przedmioty",
    /** multiple choice – the answer is a comma-separated list, e.g. "physics,math" */
    multi: true,
    options: [
      { value: "physics", label: "Fizyka", icon: "bolt" },
      { value: "chemistry", label: "Chemia", icon: "sparkle" },
      { value: "biology", label: "Biologia", icon: "spark" },
      { value: "math", label: "Matematyka", icon: "graph" },
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
      { value: "sp48", label: "Szkoła podstawowa, klasy 4–8", icon: "book" },
      { value: "e8prep", label: "Przygotowanie do egzaminu ósmoklasisty", icon: "target" },
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
    ],
  },
  {
    id: "need",
    question: "Co jest teraz najważniejsze?",
    summary: "Cel",
    options: [
      { value: "grades", label: "Lepsze oceny i nadrobienie zaległości", icon: "trend" },
      { value: "understand", label: "Zrozumienie materiału", icon: "spark" },
      { value: "confidence", label: "Pewność siebie i mniej stresu", icon: "thumb" },
      { value: "regular", label: "Regularne wsparcie w nauce", icon: "calendar" },
    ],
  },
] as const;

export type QuizStepDef = (typeof QUIZ)[number];
export type QuizId = QuizStepDef["id"];
export type QuizAnswers = Partial<Record<QuizId, string>>;

export const QUIZ_IDS = QUIZ.map((s) => s.id) as QuizId[];

export function labelOf(id: QuizId, value?: string): string {
  const step = QUIZ.find((s) => s.id === id);
  const opts = step?.options as readonly { value: string; label: string }[] | undefined;
  if (!value || !opts) return "";
  // multiple choice: "physics,math" → "Fizyka, Matematyka" (every part must be a real option)
  const labels = value.split(",").map((v) => opts.find((o) => o.value === v)?.label);
  return labels.every(Boolean) ? labels.join(", ") : "";
}

export const isMulti = (step: QuizStepDef) => "multi" in step && step.multi === true;

const isCourse = (o?: string) => o === "e8" || o === "matura";

/**
 * Questions that only make sense after certain answers:
 * – courses fix the stage (8th grade / final year) → no stage question, no "need" question;
 * – the level question only for the matura course or matura preparation in 1:1 lessons
 *   (the high-school answers already say "podstawowy" / "rozszerzony").
 */
export function isHidden(id: QuizId, a: QuizAnswers): boolean {
  if (id === "subject") return a.offer !== "science";
  if (id === "stage") return isCourse(a.offer);
  if (id === "need") return isCourse(a.offer);
  if (id === "level") return a.offer !== "matura" && !(a.offer !== "e8" && a.stage === "prep");
  return false;
}
export const visibleIds = (answers: QuizAnswers) => QUIZ_IDS.filter((id) => !isHidden(id, answers));

/** Question title can address a student directly. */
export function questionOf(step: QuizStepDef, a: QuizAnswers): string {
  if (step.id === "stage" && a.who === "self") return "Na jakim etapie nauki jesteś?";
  if (step.id === "level" && a.offer === "science") return "Jaki poziom – podstawa czy rozszerzenie?";
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
  return a.who === "self" && (a.stage === "sp48" || a.stage === "e8prep" || a.offer === "e8");
}

/** 1:1 price list (owner): extended level 125 zł, everything else (primary school, 8th grade, basic level) 110 zł / 60 min. */
export function lessonPrice(a: QuizAnswers): number {
  const extended = a.stage === "loext" || (a.stage === "prep" && a.level === "extended");
  return extended ? 125 : 110;
}

/** What the summary box shows: the 1:1 price (maths or other subjects), courses are fixed. */
export function offerSummary(a: QuizAnswers): { title: string; price: number | null; note: string } {
  if (a.offer === "e8") return { title: "Kurs do Egzaminu Ósmoklasisty 2027/2028", price: null, note: "Szczegóły kursu i cenę omówimy w krótkiej rozmowie." };
  if (a.offer === "matura") return { title: `Kurs maturalny 2027/2028${a.level === "extended" ? " · rozszerzenie" : a.level === "basic" ? " · podstawa" : ""}`, price: null, note: "Szczegóły kursu i cenę omówimy w krótkiej rozmowie." };
  const price = lessonPrice(a);
  const level = price === 125 ? " · poziom rozszerzony" : "";
  if (a.offer === "science") {
    const subjects = labelOf("subject", a.subject).toLowerCase();
    return { title: `Korepetycje 1-na-1${subjects ? ` · ${subjects}` : ""}${level}`, price, note: "/ 60 min" };
  }
  return { title: `Lekcja indywidualna 1-na-1${level}`, price, note: "/ 60 min" };
}

/* ───────── courses: fixed schedule (no date / hour picking) ───────── */

export const SCHOOL_YEAR = "2027/2028";

export interface CourseInfo {
  name: string;
  /** e.g. "Poniedziałki" */
  day: string;
  time: string;
  length: string;
  lesson: string;
  full: string;
}

export const COURSES = {
  e8: { name: "Kurs do Egzaminu Ósmoklasisty", day: "Poniedziałki", time: "18:00", length: "22 spotkania po 60 minut", lesson: "45 zł / lekcja", full: "890 zł za cały kurs" },
  "matura-basic": { name: "Kurs maturalny · poziom podstawowy", day: "Poniedziałki", time: "18:00", length: "22 spotkania po 2 godziny", lesson: "45 zł / godzina", full: "1780 zł za cały kurs" },
  "matura-extended": { name: "Kurs maturalny · poziom rozszerzony", day: "Środy", time: "18:00", length: "22 spotkania po 2 godziny", lesson: "45 zł / godzina", full: "1780 zł za cały kurs" },
} satisfies Record<string, CourseInfo>;

export const isCourseOffer = (a: QuizAnswers) => a.offer === "e8" || a.offer === "matura";

/** The course(s) the answers point to – both matura levels while the level is still open. */
export function coursesFor(a: QuizAnswers): CourseInfo[] {
  if (a.offer === "e8") return [COURSES.e8];
  if (a.offer !== "matura") return [];
  if (a.level === "basic") return [COURSES["matura-basic"]];
  if (a.level === "extended") return [COURSES["matura-extended"]];
  if (!a.level) return [COURSES["matura-basic"], COURSES["matura-extended"]];
  return [];
}

/* ───────── 1:1 lessons: preferred hours (slider) ───────── */

export const HOUR_MIN = 7;
export const HOUR_MAX = 22;
export const hourLabel = (h: number) => `${h}:00`;
export function hoursLabel(from?: number, to?: number): string {
  if (from === undefined || to === undefined) return "";
  if (from <= HOUR_MIN && to >= HOUR_MAX) return "Dowolna pora";
  return `${hourLabel(from)}–${hourLabel(to)}`;
}
