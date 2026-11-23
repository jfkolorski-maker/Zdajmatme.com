"use client";

/**
 * Captures where a visitor came from (Google Ads click ids + UTM tags) on
 * the first page view of the session, so every lead can be traced back to
 * the campaign / keyword that produced it.
 */
export interface Attribution {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
}

const KEY = "zdajmatme.attribution.v1";
const PARAMS = ["gclid", "gbraid", "wbraid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureAttribution(): void {
  try {
    const url = new URL(window.location.href);
    const fromUrl: Attribution = {};
    for (const p of PARAMS) {
      const v = url.searchParams.get(p);
      if (v) fromUrl[p] = v.slice(0, 200);
    }
    const stored = readAttribution();
    // A new ad click (new click id / utm) replaces the stored touch; otherwise keep the first one.
    if (Object.keys(fromUrl).length || !stored) {
      const value: Attribution = {
        ...fromUrl,
        landing_page: url.pathname + url.search,
        referrer: document.referrer.slice(0, 300),
        first_seen: new Date().toISOString(),
      };
      window.sessionStorage.setItem(KEY, JSON.stringify(value));
    }
  } catch {
    /* storage unavailable */
  }
}

export function readAttribution(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
