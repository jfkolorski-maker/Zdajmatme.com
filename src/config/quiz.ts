/**
 * Central quiz configuration + conditional logic.
 * Pure functions only (no React) – shared by the client quiz, the API validation and the tests.
 */

export type Who = "child" | "self";
export type Stage = "sp46" | "sp78" | "lo12" | "lo34" | "lomat";
export type MathLevel = "basic" | "extended" | "unsure";

export interface QuizAnswers {
  who?: Who;
  stage?: Stage;
  mathLevel?: MathLevel;
  problems?: string[];
  topics?: string[];
  goal?: string;
  start?: string;
}

export type AnswerKey = keyof QuizAnswers;

export interface QuizOption {
  value: string;
  label: string;
  hint?: string;
  /** short glyph rendered as the option "icon" */
  glyph?: string;
  /** selecting it deselects all other options (multi-select only) */
  exclusive?: boolean;
}

export interface QuizStep {
  id: string;
  key: AnswerKey;
  multi: boolean;
  title: (a: QuizAnswers) => string;
  subtitle?: (a: QuizAnswers) => string | undefined;
  options: (a: QuizAnswers) => QuizOption[];
  isVisible: (a: QuizAnswers) => boolean;
}

export const isPrimary = (s?: Stage) => s === "sp46" || s === "sp78";
export const isHighSchool = (s?: Stage) => s === "lo12" || s === "lo34" || s === "lomat";
const self = (a: QuizAnswers) => a.who === "self";

/* ---------------------------------- labels --------------------------------- */

export const LABELS = {
  who: { child: "Dla dziecka", self: "Dla siebie" } as Record<string, string>,
  stage: {
    sp46: "Szkoła podstawowa — klasy 4–6",
    sp78: "Szkoła podstawowa — klasy 7–8",
    lo12: "Liceum / technikum — klasy 1–2",
    lo34: "Liceum / technikum — klasy 3–4",
    lomat: "Liceum / technikum — klasa maturalna",
  } as Record<string, string>,
  mathLevel: {
    basic: "Podstawowy",
    extended: "Rozszerzony",
    unsure: "Nie wiem — potrzebuję pomocy w dopasowaniu",
  } as Record<string, string>,
  problems: {
    low_grades: "Niskie oceny i słabe wyniki",
    gaps: "Zaległości z wcześniejszych tematów",
    understanding: "Trudności ze zrozumieniem matematyki",
    test_stress: "Stres przed sprawdzianami",
    exam8: "Przygotowanie do egzaminu ósmoklasisty",
    matura_basic: "Przygotowanie do matury podstawowej",
    matura_ext: "Przygotowanie do matury rozszerzonej",
    regular: "Potrzebuję regularnej pomocy w nauce",
  } as Record<string, string>,
  topics: {
    // szkoła podstawowa
    fractions: "Ułamki",
    percent: "Procenty",
    equations_sp: "Równania",
    geometry_sp: "Geometria",
    word_problems: "Zadania tekstowe",
    powers_roots: "Potęgi i pierwiastki",
    exam8_prep: "Przygotowanie do egzaminu ósmoklasisty",
    // liceum
    functions: "Funkcje",
    quadratic: "Funkcja kwadratowa",
    equations_ineq: "Równania i nierówności",
    trig: "Trygonometria",
    sequences: "Ciągi",
    analytic_geo: "Geometria analityczna",
    logs: "Logarytmy",
    probability: "Prawdopodobieństwo i statystyka",
    derivatives: "Pochodne i optymalizacja",
    matura_tasks: "Zadania maturalne",
    // wspólne
    unknown: "Trudno określić",
  } as Record<string, string>,
  goal: {
    grades: "Poprawić oceny",
    exam: "Przygotować się do egzaminu",
    matura: "Przygotować się do matury",
    gaps: "Nadrobić zaległości",
    foundations: "Zbudować solidne podstawy",
    confidence: "Zwiększyć pewność siebie w matematyce",
  } as Record<string, string>,
  start: {
    asap: "Jak najszybciej",
    "7d": "W ciągu 7 dni",
    "2-4w": "W ciągu 2–4 tygodni",
    browsing: "Dopiero szukam odpowiedniego rozwiązania",
  } as Record<string, string>,
};

const opt = (key: keyof typeof LABELS, value: string, extra: Partial<QuizOption> = {}): QuizOption => ({
  value,
  label: LABELS[key][value],
  ...extra,
});

/* ---------------------------------- steps ---------------------------------- */

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "who",
    key: "who",
    multi: false,
    title: () => "Dla kogo szukasz korepetycji?",
    options: () => [
      opt("who", "child", { glyph: "👪", hint: "Jestem rodzicem lub opiekunem" }),
      opt("who", "self", { glyph: "🎓", hint: "Jestem uczniem / uczennicą" }),
    ],
    isVisible: () => true,
  },
  {
    id: "stage",
    key: "stage",
    multi: false,
    title: (a) => (self(a) ? "Na jakim etapie nauki jesteś?" : "Na jakim etapie nauki jest uczeń?"),
    options: () => [
      opt("stage", "sp46", { glyph: "4–6" }),
      opt("stage", "sp78", { glyph: "7–8" }),
      opt("stage", "lo12", { glyph: "I–II" }),
      opt("stage", "lo34", { glyph: "III–IV" }),
      opt("stage", "lomat", { glyph: "M" }),
    ],
    isVisible: () => true,
  },
  {
    id: "mathLevel",
    key: "mathLevel",
    multi: false,
    title: () => "Jaki poziom matematyki?",
    subtitle: () => "Chodzi o poziom realizowany w szkole lub planowany na maturze.",
    options: () => [
      opt("mathLevel", "basic", { glyph: "P" }),
      opt("mathLevel", "extended", { glyph: "R" }),
      opt("mathLevel", "unsure", { glyph: "?" }),
    ],
    // Szkoła podstawowa nie ma poziomu rozszerzonego – krok pomijamy.
    isVisible: (a) => isHighSchool(a.stage),
  },
  {
    id: "problems",
    key: "problems",
    multi: true,
    title: () => "Co obecnie sprawia największą trudność?",
    subtitle: () => "Możesz zaznaczyć kilka odpowiedzi.",
    options: (a) => {
      const list: QuizOption[] = [
        opt("problems", "low_grades", { glyph: "↘" }),
        opt("problems", "gaps", { glyph: "⟲" }),
        opt("problems", "understanding", { glyph: "?" }),
        opt("problems", "test_stress", { glyph: "!" }),
      ];
      if (a.stage === "sp78") list.push(opt("problems", "exam8", { glyph: "E8" }));
      if (isHighSchool(a.stage)) {
        list.push(opt("problems", "matura_basic", { glyph: "MP" }));
        if (a.mathLevel !== "basic") list.push(opt("problems", "matura_ext", { glyph: "MR" }));
      }
      list.push(opt("problems", "regular", { glyph: "∞" }));
      return list;
    },
    isVisible: () => true,
  },
  {
    id: "topics",
    key: "topics",
    multi: true,
    title: (a) => (self(a) ? "Z czym masz największy problem?" : "Z czym uczeń ma największy problem?"),
    subtitle: () => "Zaznacz wszystkie pasujące tematy.",
    options: (a) => {
      if (isPrimary(a.stage)) {
        const list = [
          opt("topics", "fractions", { glyph: "½" }),
          opt("topics", "percent", { glyph: "%" }),
          opt("topics", "equations_sp", { glyph: "x=" }),
          opt("topics", "geometry_sp", { glyph: "△" }),
          opt("topics", "word_problems", { glyph: "Aa" }),
          opt("topics", "powers_roots", { glyph: "√" }),
        ];
        if (a.stage === "sp78") list.push(opt("topics", "exam8_prep", { glyph: "E8" }));
        list.push(opt("topics", "unknown", { glyph: "…", exclusive: true }));
        return list;
      }
      const list = [
        opt("topics", "functions", { glyph: "f(x)" }),
        opt("topics", "quadratic", { glyph: "x²" }),
        opt("topics", "equations_ineq", { glyph: "≤" }),
        opt("topics", "trig", { glyph: "sin" }),
        opt("topics", "sequences", { glyph: "aₙ" }),
        opt("topics", "analytic_geo", { glyph: "xy" }),
        opt("topics", "logs", { glyph: "log" }),
        opt("topics", "probability", { glyph: "P(A)" }),
      ];
      if (a.mathLevel !== "basic") list.push(opt("topics", "derivatives", { glyph: "f′" }));
      list.push(opt("topics", "matura_tasks", { glyph: "M" }));
      list.push(opt("topics", "unknown", { glyph: "…", exclusive: true }));
      return list;
    },
    isVisible: () => true,
  },
  {
    id: "goal",
    key: "goal",
    multi: false,
    title: () => "Jaki rezultat chcecie osiągnąć?",
    options: (a) => {
      const list = [opt("goal", "grades", { glyph: "↗" })];
      if (a.stage === "sp78") list.push(opt("goal", "exam", { glyph: "E8" }));
      if (isHighSchool(a.stage)) list.push(opt("goal", "matura", { glyph: "M" }));
      list.push(
        opt("goal", "gaps", { glyph: "⟲" }),
        opt("goal", "foundations", { glyph: "▦" }),
        opt("goal", "confidence", { glyph: "✓" }),
      );
      return list;
    },
    isVisible: () => true,
  },
  {
    id: "start",
    key: "start",
    multi: false,
    title: () => "Kiedy najlepiej rozpocząć naukę?",
    options: () => [
      opt("start", "asap", { glyph: "⚡" }),
      opt("start", "7d", { glyph: "7" }),
      opt("start", "2-4w", { glyph: "2–4" }),
      opt("start", "browsing", { glyph: "◎" }),
    ],
    isVisible: () => true,
  },
];

/* ---------------------------------- logic ---------------------------------- */

export const visibleSteps = (a: QuizAnswers) => QUIZ_STEPS.filter((s) => s.isVisible(a));

export function isStepAnswered(step: QuizStep, a: QuizAnswers): boolean {
  const v = a[step.key];
  if (step.multi) return Array.isArray(v) && v.length > 0;
  return typeof v === "string" && v.length > 0;
}

/**
 * Removes answers that are no longer valid after an earlier answer changed
 * (e.g. "matura rozszerzona" after switching to szkoła podstawowa).
 */
export function sanitizeAnswers(input: QuizAnswers): QuizAnswers {
  const a: QuizAnswers = { ...input };
  for (const step of QUIZ_STEPS) {
    if (!step.isVisible(a)) {
      delete a[step.key];
      continue;
    }
    const allowed = new Set(step.options(a).map((o) => o.value));
    const v = a[step.key];
    if (step.multi) {
      if (Array.isArray(v)) {
        const filtered = v.filter((x) => allowed.has(x));
        (a as Record<string, unknown>)[step.key] = filtered.length ? filtered : undefined;
      }
    } else if (typeof v === "string" && !allowed.has(v)) {
      delete a[step.key];
    }
  }
  return a;
}

/** Applies a click on an option, honouring multi-select + exclusive options. */
export function toggleOption(step: QuizStep, a: QuizAnswers, value: string): QuizAnswers {
  if (!step.multi) return sanitizeAnswers({ ...a, [step.key]: value });
  const options = step.options(a);
  const clicked = options.find((o) => o.value === value);
  const current = (a[step.key] as string[] | undefined) ?? [];
  let next: string[];
  if (current.includes(value)) next = current.filter((x) => x !== value);
  else if (clicked?.exclusive) next = [value];
  else {
    const exclusive = new Set(options.filter((o) => o.exclusive).map((o) => o.value));
    next = [...current.filter((x) => !exclusive.has(x)), value];
  }
  return sanitizeAnswers({ ...a, [step.key]: next });
}

export function isQuizComplete(a: QuizAnswers): boolean {
  return visibleSteps(a).every((s) => isStepAnswered(s, a));
}

export const labelOf = (key: keyof typeof LABELS, v?: string) => (v ? LABELS[key][v] ?? v : "");
export const labelsOf = (key: keyof typeof LABELS, v?: string[]) => (v ?? []).map((x) => labelOf(key, x));

/* ----------------------- presets used by "path" CTAs ----------------------- */

export type PathPreset = "grades" | "exam8" | "matura_basic" | "matura_ext";

export const PATH_PRESETS: Record<PathPreset, QuizAnswers> = {
  grades: { problems: ["low_grades", "gaps"], goal: "grades" },
  exam8: { stage: "sp78", problems: ["exam8"], goal: "exam" },
  matura_basic: { stage: "lomat", mathLevel: "basic", problems: ["matura_basic"], goal: "matura" },
  matura_ext: { stage: "lomat", mathLevel: "extended", problems: ["matura_ext"], goal: "matura" },
};

/* ------------------------------ qualification ------------------------------ */

export type LeadTier = "Gorący" | "Ciepły" | "Zimny";

export interface Qualification {
  score: number;
  tier: LeadTier;
  reasons: string[];
}

/**
 * Simple, transparent lead scoring stored in the CRM ("Wynik kwalifikacji").
 * It ranks follow-up priority – it is NOT shown to the user and is NOT an educational diagnosis.
 */
export function qualify(a: QuizAnswers): Qualification {
  let score = 0;
  const reasons: string[] = [];
  const startPts: Record<string, number> = { asap: 4, "7d": 3, "2-4w": 2, browsing: 0 };
  if (a.start) {
    score += startPts[a.start] ?? 0;
    reasons.push(`Start: ${labelOf("start", a.start)}`);
  }
  if (a.topics?.length && !a.topics.includes("unknown")) {
    score += 1;
    reasons.push("Wskazane konkretne zagadnienia");
  }
  const examDeadline =
    (a.stage === "sp78" && (a.goal === "exam" || a.problems?.includes("exam8"))) ||
    (a.stage === "lomat" && (a.goal === "matura" || a.problems?.some((p) => p.startsWith("matura"))));
  if (examDeadline) {
    score += 2;
    reasons.push("Zbliżający się egzamin");
  }
  if ((a.problems?.length ?? 0) >= 2) {
    score += 1;
    reasons.push("Kilka obszarów trudności");
  }
  const tier: LeadTier = score >= 5 ? "Gorący" : score >= 3 ? "Ciepły" : "Zimny";
  return { score, tier, reasons };
}
