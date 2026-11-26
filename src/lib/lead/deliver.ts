import "server-only";
import { labelOf, offerSummary, summarize } from "@/data/quiz";
import { HOURS, normalizePhone, type LeadRequest, type LeadStage, type PartialLeadRequest } from "./schema";

export class LeadDeliveryError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function sourceOf(attr: LeadRequest["attribution"]): string {
  if (!attr) return "website";
  if (attr.gclid || attr.gbraid || attr.wbraid) return "google_ads";
  if (attr.fbclid) return "meta_ads";
  return "website";
}

const STAGE_LABEL: Record<LeadStage, string> = {
  phone: "Sam numer (quiz w toku)",
  quiz: "Quiz ukończony – bez formularza",
  complete: "Pełne zgłoszenie",
};

/** A phone-only / quiz-only capture, shaped like a full lead with the missing fields empty. */
export function toLeadShape(p: PartialLeadRequest): LeadRequest & { stage: LeadStage } {
  return {
    stage: p.stage,
    submissionId: p.submissionId,
    contact: { name: "", phone: p.phone, email: "", message: "", adultOrGuardian: false, consent: true, marketing: false },
    answers: p.answers as LeadRequest["answers"],
    company: "",
    pageUrl: p.pageUrl,
    attribution: p.attribution,
  };
}

/**
 * Payload for LEAD_WEBHOOK_URL (ZdajMatme CRM – e.g. a Base44 backend function or Google Apps Script).
 * Top-level fields are CRM-friendly; `website` carries the full structured quiz + attribution.
 */
export function buildLeadPayload(lead: LeadRequest & { stage?: LeadStage }, receivedAt = new Date()) {
  const { contact, answers } = lead;
  const stage: LeadStage = lead.stage ?? "complete";
  const summary = summarize(answers);
  const offer = offerSummary(answers);
  const hours = HOURS.find((h) => h.value === contact.hours);
  const description = [
    stage === "complete" ? "Zgłoszenie ze strony www (quiz) – pierwsza lekcja." : `Zgłoszenie ze strony www – ${STAGE_LABEL[stage].toLowerCase()}. Oddzwoń.`,
    `Oferta: ${offer.title}${offer.price ? ` (${offer.price} zł / 60 min)` : ""}`,
    ...summary.map((r) => `${r.label}: ${r.value}`),
    hours ? `Preferowane godziny: ${hours.label}` : "",
    contact.message ? `Wiadomość: ${contact.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    lead_stage: stage,
    lead_stage_label: STAGE_LABEL[stage],
    status: "Nowy",
    full_name: stage === "complete" ? contact.name : `(${STAGE_LABEL[stage]})`,
    phone: normalizePhone(contact.phone) ?? contact.phone,
    email: contact.email,
    source: sourceOf(lead.attribution),
    service_type: answers.offer === "e8" || answers.offer === "matura" ? `${labelOf("offer", answers.offer)} 2027/2028` : labelOf("offer", answers.offer),
    service_category: "tutoring_math",
    quoted_price: offerSummary(answers).price ? `${offerSummary(answers).price} zł / 60 min` : "do ustalenia",
    client_type: answers.who === "self" ? "Uczeń" : "Rodzic / opiekun",
    student_stage: labelOf("stage", answers.stage) || (answers.offer === "e8" ? "Szkoła podstawowa, klasa 8" : answers.offer === "matura" ? "Klasa maturalna" : ""),
    math_level: labelOf("level", answers.level) || (answers.stage === "loext" ? "Rozszerzony" : answers.stage === "lobasic" ? "Podstawowy" : ""),
    goal: labelOf("need", answers.need),
    preferred_start: labelOf("start", answers.start),
    preferred_hours: hours?.label ?? "",
    description,
    website: {
      // the Sheets/CRM script skips a repeated submission_id – each stage gets its own row
      submission_id: stage === "complete" ? lead.submissionId : `${lead.submissionId}-${stage}`,
      lead_id: lead.submissionId,
      received_at: receivedAt.toISOString(),
      page_url: lead.pageUrl ?? "",
      attribution: lead.attribution ?? null,
      answers,
      answers_labels: Object.fromEntries(summary.map((r) => [r.id, r.value])),
      price_reference: offer.price ? { amount: offer.price, currency: "PLN", minutes: 60 } : null,
      message: contact.message,
      adult_or_guardian: contact.adultOrGuardian,
      consent: { given: true, at: receivedAt.toISOString() },
      marketing_consent: contact.marketing === true,
    },
  };
}

export async function deliverLead(lead: LeadRequest & { stage?: LeadStage }): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    console.error("[leads] LEAD_WEBHOOK_URL is not configured – lead was NOT delivered.");
    throw new LeadDeliveryError("Formularz nie jest jeszcze podłączony. Zadzwoń do nas – odbieramy.", 503);
  }
  const headers: Record<string, string> = { "Content-Type": "application/json", "Idempotency-Key": `${lead.submissionId}:${lead.stage ?? "complete"}` };
  if (process.env.LEAD_WEBHOOK_SECRET) headers["X-Webhook-Secret"] = process.env.LEAD_WEBHOOK_SECRET;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(buildLeadPayload(lead)),
      signal: AbortSignal.timeout(25_000),
      cache: "no-store",
    });
  } catch (error) {
    console.error("[leads] webhook unreachable", error);
    throw new LeadDeliveryError("Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub zadzwoń.", 502);
  }
  if (!response.ok) {
    console.error(`[leads] webhook responded ${response.status}`, await response.text().catch(() => ""));
    throw new LeadDeliveryError("Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub zadzwoń.", 502);
  }
  // Google Apps Script always answers 200 – even when the script crashed. It reports the outcome in the body.
  const body = await response.text().catch(() => "");
  let reply: { ok?: unknown } | null = null;
  try {
    reply = JSON.parse(body) as { ok?: unknown };
  } catch {
    reply = null;
  }
  const appsScript = /^https:\/\/script\.google(usercontent)?\.com\//.test(url);
  if (reply?.ok === false || (appsScript && reply?.ok !== true)) {
    console.error("[leads] webhook did not confirm the lead", body.slice(0, 500));
    throw new LeadDeliveryError("Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub zadzwoń.", 502);
  }
}
