"use client";
import { getConsent } from "./consent";

/**
 * Tracking adapter: GTM **or** direct gtag – never both (prevents duplicate conversions).
 *
 *  NEXT_PUBLIC_TRACKING_MODE=gtm   → events are pushed to dataLayer; GA4 + Google Ads tags live in GTM.
 *  NEXT_PUBLIC_TRACKING_MODE=gtag  → events are sent with gtag(); Google Ads conversions sent from code.
 *  NEXT_PUBLIC_TRACKING_MODE=off   → nothing is sent (default when no IDs are configured).
 *
 * PRIVACY: never pass personal data (name, phone, e-mail, message) or student details here.
 * `sanitize()` drops suspicious keys as a safety net.
 */

export type TrackingEvent =
  | "page_view"
  | "quiz_start"
  | "quiz_step_complete"
  | "quiz_complete"
  | "lead_form_start"
  | "lead_form_submit"
  | "generate_lead"
  | "click_to_call"
  | "tutor_profile_view"
  | "cta_click";

type Params = Record<string, string | number | boolean | undefined>;

export const trackingConfig = {
  mode: (process.env.NEXT_PUBLIC_TRACKING_MODE || "off") as "gtm" | "gtag" | "off",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
  adsId: process.env.NEXT_PUBLIC_GADS_ID || "",
  adsLeadLabel: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL || "",
  adsCallLabel: process.env.NEXT_PUBLIC_GADS_CALL_LABEL || "",
  leadValue: Number(process.env.NEXT_PUBLIC_LEAD_VALUE || 0),
  enhancedConversions: process.env.NEXT_PUBLIC_ENHANCED_CONVERSIONS === "true",
  consentMode: (process.env.NEXT_PUBLIC_CONSENT_MODE || "basic") as "basic" | "advanced",
};

const FORBIDDEN = /(name|imie|imię|phone|tel|mail|message|wiadomo|address|adres)/i;

function sanitize(p: Params): Params {
  const out: Params = {};
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined || FORBIDDEN.test(k)) continue;
    if (typeof v === "string" && (/@/.test(v) || /\d{7,}/.test(v.replace(/\D/g, "")))) continue;
    out[k] = v;
  }
  return out;
}

interface W {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
const w = () => (typeof window === "undefined" ? null : (window as unknown as W));

export function track(event: TrackingEvent, params: Params = {}) {
  const win = w();
  if (!win) return;
  const clean = sanitize(params);
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, clean);
  if (trackingConfig.mode === "gtm") {
    (win.dataLayer = win.dataLayer || []).push({ event, ...clean });
  } else if (trackingConfig.mode === "gtag") {
    if (event === "page_view") return; // GA4 config sends page_view automatically
    win.gtag?.("event", event, clean);
  }
}

/* --------------------------- primary conversions --------------------------- */

async function sha256(value: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Fired ONLY after the CRM confirmed the lead was saved.
 * Enhanced conversions: hashed (SHA-256) e-mail/phone are attached only when
 * NEXT_PUBLIC_ENHANCED_CONVERSIONS=true AND the user granted advertising consent.
 * They are meant for the Google Ads tag only – do NOT map them into GA4.
 */
export async function trackLead(leadId: string, pii?: { email: string; phoneE164: string }) {
  const win = w();
  if (!win) return;
  let userData: Record<string, string> | undefined;
  if (pii && trackingConfig.enhancedConversions && getConsent()?.ads && crypto?.subtle) {
    userData = {
      sha256_email_address: await sha256(pii.email.trim().toLowerCase()),
      sha256_phone_number: await sha256(pii.phoneE164),
    };
  }
  const value = trackingConfig.leadValue || undefined;
  if (trackingConfig.mode === "gtm") {
    (win.dataLayer = win.dataLayer || []).push({
      event: "generate_lead",
      lead_id: leadId,
      value,
      currency: value ? "PLN" : undefined,
      ...(userData ? { enhanced_conversion_data: userData } : {}),
    });
  } else if (trackingConfig.mode === "gtag") {
    win.gtag?.("event", "generate_lead", { transaction_id: leadId, value, currency: value ? "PLN" : undefined });
    if (trackingConfig.adsId && trackingConfig.adsLeadLabel) {
      if (userData) win.gtag?.("set", "user_data", userData);
      win.gtag?.("event", "conversion", {
        send_to: `${trackingConfig.adsId}/${trackingConfig.adsLeadLabel}`,
        transaction_id: leadId,
        value,
        currency: value ? "PLN" : undefined,
      });
    }
  }
}

export function trackCall(location: string) {
  track("click_to_call", { cta_location: location });
  if (trackingConfig.mode === "gtag" && trackingConfig.adsId && trackingConfig.adsCallLabel) {
    w()?.gtag?.("event", "conversion", { send_to: `${trackingConfig.adsId}/${trackingConfig.adsCallLabel}` });
  }
}
