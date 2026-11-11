import type { CrmAdapter, CrmResult, LeadRecord } from "./types";

/**
 * Base44 adapter – writes the lead into an EXISTING entity of the ZdajMatme CRM app.
 *
 * Uses the Base44 entities REST API:
 *   POST {BASE44_API_URL}/apps/{BASE44_APP_ID}/entities/{BASE44_LEAD_ENTITY}
 *   header: api_key: {BASE44_API_KEY}
 *
 * The CRM's existing Lead entity field names are unknown at build time, so the default
 * mapping below can be overridden with BASE44_FIELD_MAP (JSON: {"ourField":"theirField"}).
 * Fields mapped to "" are skipped. See DEPLOYMENT.md → "Base44".
 */
const DEFAULT_MAP: Record<string, string> = {
  leadId: "lead_id",
  idempotencyKey: "idempotency_key",
  createdAt: "submitted_at",
  parentName: "name",
  phone: "phone",
  email: "email",
  source: "source",
  campaignSource: "campaign_source",
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmContent: "utm_content",
  utmTerm: "utm_term",
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  fbclid: "fbclid",
  landingPage: "landing_page",
  referrer: "referrer",
  clientType: "client_type",
  studentGrade: "student_grade",
  mathLevel: "math_level",
  mainProblems: "main_problem",
  topics: "topics",
  goal: "goal",
  preferredStart: "preferred_start",
  contactMethod: "preferred_contact",
  message: "message",
  status: "status",
  qualification: "qualification",
  formHistory: "form_history",
  marketingConsent: "marketing_consent",
  privacyNoticeShownAt: "privacy_notice_shown_at",
  assignedTo: "assigned_to",
};

/** How complex values are serialised (Base44 entity fields are often plain strings). */
const asString = process.env.BASE44_ARRAYS_AS_STRING !== "false";

function serialise(key: string, v: unknown): unknown {
  if (v === undefined || v === null || v === "") return undefined;
  if (key === "qualification" && typeof v === "object") {
    const q = v as LeadRecord["qualification"];
    return asString ? `${q.tier} (${q.score} pkt) — ${q.reasons.join("; ")}` : q;
  }
  if (key === "formHistory") return asString ? JSON.stringify(v) : v;
  if (Array.isArray(v)) return asString ? v.join(", ") : v;
  return v;
}

export function mapLeadToBase44(lead: LeadRecord): Record<string, unknown> {
  let overrides: Record<string, string> = {};
  if (process.env.BASE44_FIELD_MAP) {
    try {
      overrides = JSON.parse(process.env.BASE44_FIELD_MAP);
    } catch {
      console.error("[crm:base44] BASE44_FIELD_MAP is not valid JSON – using defaults");
    }
  }
  const map = { ...DEFAULT_MAP, ...overrides };
  const out: Record<string, unknown> = {};
  for (const [ours, value] of Object.entries(lead)) {
    const theirs = map[ours];
    if (!theirs) continue;
    const s = serialise(ours, value);
    if (s !== undefined) out[theirs] = s;
  }
  return out;
}

export function createBase44Adapter(): CrmAdapter {
  const base = (process.env.BASE44_API_URL || "https://app.base44.com/api").replace(/\/$/, "");
  const appId = process.env.BASE44_APP_ID;
  const apiKey = process.env.BASE44_API_KEY;
  const entity = process.env.BASE44_LEAD_ENTITY || "Lead";
  if (!appId || !apiKey) throw new Error("BASE44_APP_ID and BASE44_API_KEY must be set when CRM_PROVIDER=base44");

  return {
    name: "base44",
    async createLead(lead): Promise<CrmResult> {
      const url = `${base}/apps/${encodeURIComponent(appId)}/entities/${encodeURIComponent(entity)}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", api_key: apiKey },
          body: JSON.stringify(mapLeadToBase44(lead)),
          signal: AbortSignal.timeout(10_000),
          cache: "no-store",
        });
        if (!res.ok) {
          const text = (await res.text().catch(() => "")).slice(0, 300);
          return { ok: false, error: `Base44 HTTP ${res.status}: ${text}`, retryable: res.status >= 500 || res.status === 429 };
        }
        const body = (await res.json().catch(() => ({}))) as { id?: string; _id?: string };
        return { ok: true, externalId: body.id ?? body._id };
      } catch (e) {
        return { ok: false, error: `Base44 request failed: ${(e as Error).message}`, retryable: true };
      }
    },
  };
}
