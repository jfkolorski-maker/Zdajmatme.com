import type { Qualification } from "@/config/quiz";

/** CRM-agnostic lead record. Each adapter maps it to the target system's schema. */
export interface LeadRecord {
  leadId: string;
  idempotencyKey: string;
  createdAt: string; // ISO
  parentName: string;
  phone: string; // E.164
  email: string;
  source: "website";
  campaignSource: string; // e.g. "google / cpc" or "direct"
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  landingPage?: string;
  referrer?: string;
  clientType: string; // "Rodzic / opiekun" | "Uczeń (pełnoletni)" …
  studentGrade: string;
  mathLevel: string;
  mainProblems: string[];
  topics: string[];
  goal: string;
  preferredStart: string;
  contactMethod: string;
  message: string;
  status: string; // "Nowy"
  qualification: Qualification;
  formHistory: { step: string; at: string; ms?: number }[];
  marketingConsent: boolean;
  privacyNoticeShownAt: string;
  assignedTo?: string;
}

export interface CrmResult {
  ok: boolean;
  /** CRM's own record id when available */
  externalId?: string;
  error?: string;
  /** true = retrying might help (network / 5xx) */
  retryable?: boolean;
}

export interface CrmAdapter {
  name: string;
  createLead(lead: LeadRecord): Promise<CrmResult>;
}
