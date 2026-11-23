import { z } from "zod";
import { QUIZ, isComplete, isHidden, isMinorStudent, type QuizAnswers } from "../../data/quiz.ts";

/**
 * Normalises a phone number. Returns "+48XXXXXXXXX" for Polish numbers,
 * "+<digits>" for international ones, or null when invalid. (FLIPOR)
 */
export function normalizePhone(input: string): string | null {
  const trimmed = input.trim();
  if (!/^[+\d\s()\-./]+$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, "");
  const hadPlus = trimmed.startsWith("+");
  if (!hadPlus && digits.startsWith("00")) digits = digits.slice(2);
  const international = hadPlus || trimmed.startsWith("00");
  if (!international && digits.length === 9) return /^[1-9]\d{8}$/.test(digits) ? `+48${digits}` : null;
  if (digits.startsWith("48") && digits.length === 11) return /^[1-9]\d{8}$/.test(digits.slice(2)) ? `+${digits}` : null;
  if (international && digits.length >= 8 && digits.length <= 15 && !digits.startsWith("0")) return `+${digits}`;
  return null;
}

const enumOf = (id: (typeof QUIZ)[number]["id"]) => {
  const values = QUIZ.find((s) => s.id === id)!.options.map((o) => o.value) as [string, ...string[]];
  return z.enum(values);
};

/** Every answer must be a real option and every question that applies must be answered. */
export const answersSchema = z
  .object({
    offer: enumOf("offer"),
    who: enumOf("who"),
    stage: enumOf("stage").optional(),
    level: enumOf("level").optional(),
    need: enumOf("need").optional(),
    start: enumOf("start"),
  })
  .refine((a) => isComplete(a as QuizAnswers) && Object.keys(a).every((k) => !isHidden(k as never, a as QuizAnswers)), "Niepełne odpowiedzi w quizie.");

/** Preferred lesson hours – zdajmatme.com form ("Preferowany przedział godzinowy", 7:00–22:00). */
export const HOURS = [
  { value: "morning", label: "7–12" },
  { value: "afternoon", label: "12–17" },
  { value: "evening", label: "17–22" },
  { value: "any", label: "Dowolnie" },
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię (min. 2 znaki).").max(80, "Imię jest za długie."),
  phone: z
    .string()
    .trim()
    .min(1, "Podaj numer telefonu.")
    .refine((v) => normalizePhone(v) !== null, "Podaj poprawny numer, np. 730 170 804."),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .default("")
    .refine((v) => v === "" || z.email().safeParse(v).success, "Podaj poprawny adres e-mail lub zostaw puste."),
  hours: z.enum(HOURS.map((h) => h.value) as [string, ...string[]]).optional(),
  message: z.string().trim().max(1500, "Wiadomość może mieć maks. 1500 znaków.").optional().default(""),
  /** Student filling in for themselves: adult, or the contact data belongs to a parent/guardian. */
  adultOrGuardian: z.boolean().optional().default(false),
  consent: z.literal(true, { error: "Zgoda jest wymagana, abyśmy mogli się skontaktować." }),
  marketing: z.boolean().optional().default(false),
});

export const leadRequestSchema = z
  .object({
    submissionId: z.uuid(),
    contact: contactSchema,
    answers: answersSchema,
    /** Honeypot – real users never fill this. */
    company: z.string().max(0).optional().default(""),
    pageUrl: z.string().max(500).optional(),
    /** Ad click ids and UTM tags captured on landing. */
    attribution: z.record(z.string(), z.string().max(300)).optional(),
  })
  .refine((l) => l.answers.who !== "self" || l.contact.adultOrGuardian === true, {
    path: ["contact", "adultOrGuardian"],
    message: "Potwierdź, że masz 18 lat albo dane podaje rodzic lub opiekun.",
  });

/**
 * Early capture (FLIPOR): the finished quiz with a phone, before the full form.
 * Same submissionId as the final lead, so the CRM updates one row.
 */
export const partialLeadSchema = z.object({
  stage: z.enum(["phone", "quiz"]),
  submissionId: z.uuid(),
  phone: z
    .string()
    .trim()
    .refine((v) => normalizePhone(v) !== null, "Podaj poprawny numer, np. 730 170 804."),
  answers: z.record(z.string(), z.string().max(40)).optional().default({}),
  company: z.string().max(0).optional().default(""),
  pageUrl: z.string().max(500).optional(),
  attribution: z.record(z.string(), z.string().max(300)).optional(),
});

export type PartialLeadRequest = z.infer<typeof partialLeadSchema>;
export type LeadStage = PartialLeadRequest["stage"] | "complete";

export type ContactInput = z.input<typeof contactSchema>;
export type LeadRequest = z.infer<typeof leadRequestSchema>;
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Client-side check; `answers` decide whether the adult/guardian statement is required. */
export function validateContact(values: ContactInput, answers: QuizAnswers = {}): FieldErrors {
  const result = contactSchema.safeParse(values);
  const errors: FieldErrors = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      if (!errors[key]) errors[key] = issue.message;
    }
  }
  if (answers.who === "self" && !values.adultOrGuardian) errors.adultOrGuardian = "Potwierdź, aby kontynuować.";
  return errors;
}

export { isMinorStudent };
