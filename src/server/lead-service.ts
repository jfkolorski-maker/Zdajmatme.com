import { randomBytes } from "node:crypto";
import { LABELS, labelOf, labelsOf, qualify } from "@/config/quiz";
import { FILLER_LABELS, CONTACT_LABELS, normalizePhone, type LeadRequest } from "@/lib/lead-schema";
import type { LeadRecord } from "./crm/types";

const B32 = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newLeadId(now = new Date()) {
  const d = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rnd = Array.from(randomBytes(6), (b) => B32[b % B32.length]).join("");
  return `ZM-${d}-${rnd}`;
}

export function buildLeadRecord(req: LeadRequest, leadId: string, now = new Date()): LeadRecord {
  const { contact, quiz, attribution: a, history } = req;
  const campaignSource = a.utm_source
    ? `${a.utm_source} / ${a.utm_medium ?? "(none)"}`
    : a.gclid || a.gbraid || a.wbraid
      ? "google / cpc"
      : a.fbclid
        ? "facebook / referral"
        : a.referrer
          ? `${a.referrer} / referral`
          : "(direct)";
  return {
    leadId,
    idempotencyKey: req.idempotencyKey,
    createdAt: now.toISOString(),
    parentName: contact.name.trim(),
    phone: normalizePhone(contact.phone)!,
    email: contact.email.trim().toLowerCase(),
    source: "website",
    campaignSource,
    utmSource: a.utm_source,
    utmMedium: a.utm_medium,
    utmCampaign: a.utm_campaign,
    utmContent: a.utm_content,
    utmTerm: a.utm_term,
    gclid: a.gclid,
    gbraid: a.gbraid,
    wbraid: a.wbraid,
    fbclid: a.fbclid,
    landingPage: a.landing_page,
    referrer: a.referrer,
    clientType: FILLER_LABELS[contact.filler],
    studentGrade: labelOf("stage", quiz.stage),
    mathLevel: quiz.mathLevel ? labelOf("mathLevel", quiz.mathLevel) : "Szkoła podstawowa",
    mainProblems: labelsOf("problems", quiz.problems),
    topics: labelsOf("topics", quiz.topics),
    goal: labelOf("goal", quiz.goal),
    preferredStart: labelOf("start", quiz.start),
    contactMethod: CONTACT_LABELS[contact.contactMethod],
    message: contact.message ?? "",
    status: process.env.CRM_STATUS_NEW || "Nowy",
    qualification: qualify(quiz),
    formHistory: history.map((h) => ({ step: h.step, at: new Date(h.at).toISOString(), ms: h.ms })),
    marketingConsent: contact.marketingConsent === true,
    privacyNoticeShownAt: now.toISOString(),
    assignedTo: process.env.CRM_ASSIGNEE || undefined,
  };
}

export { LABELS };
