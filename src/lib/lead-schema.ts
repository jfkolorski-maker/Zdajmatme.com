import { z } from "zod";
import { QUIZ_STEPS, isQuizComplete, sanitizeAnswers, type QuizAnswers } from "@/config/quiz";

/** Normalises a Polish (or international) phone number to E.164. Returns null if invalid. */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!/^[+\d][\d\s\-().]{6,22}$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) {
    if (digits.startsWith("48")) digits = digits.slice(2);
    else return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  } else if (digits.startsWith("0048")) digits = digits.slice(4);
  else if (digits.length === 11 && digits.startsWith("48")) digits = digits.slice(2);
  // Polish numbers: 9 digits, never starting with 0
  return /^[1-9]\d{8}$/.test(digits) ? `+48${digits}` : null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const FILLERS = ["parent", "adult_student", "guardian_of_minor"] as const;
export type Filler = (typeof FILLERS)[number];
export const FILLER_LABELS: Record<Filler, string> = {
  parent: "Rodzic / opiekun",
  adult_student: "Uczeń pełnoletni",
  guardian_of_minor: "Rodzic / opiekun (zgłoszenie od ucznia)",
};
export const FILLER_CONFIRM: Record<Filler, string> = {
  parent: "Jestem rodzicem lub opiekunem prawnym ucznia.",
  adult_student: "Oświadczam, że mam ukończone 18 lat.",
  guardian_of_minor: "Podane dane kontaktowe należą do mojego rodzica lub opiekuna prawnego, który wie o zgłoszeniu.",
};

export const CONTACT_METHODS = ["phone", "sms", "email"] as const;
export const CONTACT_LABELS: Record<(typeof CONTACT_METHODS)[number], string> = {
  phone: "Telefon",
  sms: "SMS",
  email: "E-mail",
};

/* ------------------------------- contact form ------------------------------ */

export const contactSchema = z.object({
  name: z
    .string({ error: "Podaj imię." })
    .trim()
    .min(2, "Podaj imię (min. 2 znaki).")
    .max(60, "Imię może mieć maks. 60 znaków.")
    .regex(/^[\p{L}][\p{L}\s'.-]*$/u, "Imię może zawierać tylko litery."),
  phone: z
    .string({ error: "Podaj numer telefonu." })
    .trim()
    .min(1, "Podaj numer telefonu.")
    .refine((v) => normalizePhone(v) !== null, "Podaj poprawny numer telefonu, np. 600 123 456."),
  email: z
    .string({ error: "Podaj adres e-mail." })
    .trim()
    .min(1, "Podaj adres e-mail.")
    .max(120, "Adres e-mail jest za długi.")
    .refine((v) => EMAIL_RE.test(v), "Podaj poprawny adres e-mail, np. jan@przyklad.pl."),
  contactMethod: z.enum(CONTACT_METHODS, { message: "Wybierz preferowaną formę kontaktu." }),
  message: z.string().trim().max(1000, "Wiadomość może mieć maks. 1000 znaków.").optional().default(""),
  /**
   * Who provides the contact data. A minor student must NOT be the contact person –
   * in that case the parent/guardian's data is required.
   */
  filler: z.enum(FILLERS, { message: "Wybierz, kto podaje dane kontaktowe." }),
  fillerConfirm: z.literal(true, { message: "Potwierdź to oświadczenie, aby kontynuować." }),
  marketingConsent: z.boolean().default(false),
});

export type ContactInput = z.input<typeof contactSchema>;

/* ------------------------------ quiz answers ------------------------------- */

const str = z.string().max(40);
export const quizSchema = z
  .object({
    who: z.enum(["child", "self"]),
    stage: z.enum(["sp46", "sp78", "lo12", "lo34", "lomat"]),
    mathLevel: z.enum(["basic", "extended", "unsure"]).optional(),
    problems: z.array(str).min(1).max(10),
    topics: z.array(str).min(1).max(15),
    goal: str,
    start: str,
  })
  .refine((a) => {
    // every value must be a currently valid option and every visible step answered
    const clean = sanitizeAnswers(a as QuizAnswers);
    const sameMulti = (k: "problems" | "topics") => (clean[k]?.length ?? 0) === a[k].length;
    return isQuizComplete(clean) && sameMulti("problems") && sameMulti("topics") && clean.goal === a.goal;
  }, "Niepoprawne odpowiedzi w quizie.");

/* ------------------------------ attribution -------------------------------- */

const attr = z.string().trim().max(300).optional();
export const attributionSchema = z
  .object({
    utm_source: attr,
    utm_medium: attr,
    utm_campaign: attr,
    utm_content: attr,
    utm_term: attr,
    gclid: attr,
    gbraid: attr,
    wbraid: attr,
    fbclid: attr,
    landing_page: attr,
    referrer: attr,
    first_seen_at: attr,
  })
  .default({});

export type Attribution = z.infer<typeof attributionSchema>;

/* ----------------------------- request payload ----------------------------- */

export const historyEventSchema = z.object({
  step: z.string().max(30),
  at: z.number().int().nonnegative(),
  ms: z.number().int().nonnegative().max(86_400_000).optional(),
});

export const leadRequestSchema = z
  .object({
    idempotencyKey: z.string().uuid(),
    contact: contactSchema,
    quiz: quizSchema,
    attribution: attributionSchema,
    history: z.array(historyEventSchema).max(60).default([]),
    /** anti-spam */
    hp: z.string().max(200).optional(),
    startedAt: z.number().int().positive(),
  })
  .refine((r) => allowedFillers(r.quiz.who, r.quiz.stage).includes(r.contact.filler), {
    message: "Dane kontaktowe ucznia niepełnoletniego musi podać rodzic lub opiekun.",
    path: ["contact", "filler"],
  });

/** A parent always fills for a child; a primary-school student is always a minor. */
export function allowedFillers(who?: string, stage?: string): Filler[] {
  if (who !== "self") return ["parent"];
  if (stage === "sp46" || stage === "sp78") return ["guardian_of_minor"];
  return ["adult_student", "guardian_of_minor"];
}

export type LeadRequest = z.infer<typeof leadRequestSchema>;

export { QUIZ_STEPS };
