"use client";

/**
 * Conversion tracking for Google Ads (gtag.js) and Meta Pixel.
 * Both are opt-in via env vars and gated by cookie consent; with no IDs
 * configured every call is a harmless no-op. No placeholder IDs.
 * PRIVACY: no personal data and no answers about the student are ever sent (only step numbers / ids).
 */
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const LEAD_LABEL = process.env.NEXT_PUBLIC_GADS_LEAD_LABEL || "";
const CALL_LABEL = process.env.NEXT_PUBLIC_GADS_CALL_LABEL || "";
export const TRACKING_ENABLED = Boolean(GADS_ID || META_PIXEL_ID);

type Fn = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Fn;
    fbq?: Fn;
    dataLayer?: unknown[];
  }
}

const gtag: Fn = (...args) => window.gtag?.(...args);
const fbq: Fn = (...args) => window.fbq?.(...args);

export type TrackEvent =
  | { name: "phone_click"; placement: string }
  | { name: "cta_click"; placement: string; label: string }
  | { name: "quiz_start" }
  | { name: "phone_capture" }
  | { name: "quiz_step"; step: number; question: string }
  | { name: "lead_form_start" }
  | { name: "quiz_complete" }
  | { name: "lead_submit"; transactionId: string };

export function track(e: TrackEvent) {
  if (typeof window === "undefined") return;
  const { name, ...params } = e;
  gtag("event", name, params);
  switch (name) {
    case "phone_click":
      if (GADS_ID && CALL_LABEL) gtag("event", "conversion", { send_to: `${GADS_ID}/${CALL_LABEL}` });
      fbq("track", "Contact");
      break;
    case "quiz_start":
      fbq("trackCustom", "QuizStart");
      break;
    case "quiz_complete":
      fbq("trackCustom", "QuizComplete");
      break;
    case "lead_submit":
      gtag("event", "generate_lead", { currency: "PLN" });
      if (GADS_ID && LEAD_LABEL) gtag("event", "conversion", { send_to: `${GADS_ID}/${LEAD_LABEL}`, transaction_id: e.transactionId });
      fbq("track", "Lead");
      break;
  }
}

export type ConsentChoice = "granted" | "denied";
export function updateConsent(choice: ConsentChoice) {
  gtag("consent", "update", { ad_storage: choice, ad_user_data: choice, ad_personalization: choice, analytics_storage: choice });
  fbq("consent", choice === "granted" ? "grant" : "revoke");
}
