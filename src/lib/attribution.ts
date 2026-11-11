"use client";
import type { Attribution } from "./lead-schema";
import { readJSON, writeJSON } from "./storage";
import { getConsent } from "./consent";

/**
 * Keeps UTM parameters and click IDs (GCLID / GBRAID / WBRAID / FBCLID) across page reloads
 * so they can be attached to the lead in the CRM.
 *
 * - Always kept in sessionStorage (needed to process the enquiry).
 * - Persisted in localStorage for 90 days only after advertising consent.
 * - Last non-empty campaign wins (matches Google Ads last-click attribution).
 */
const KEY = "zm_attr_v1";
const TTL = 90 * 24 * 60 * 60 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid"] as const;

interface Stored extends Attribution {
  expires?: number;
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const found: Attribution = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) found[p] = v.slice(0, 300);
  }
  const existing = getAttribution();
  const hasNew = Object.keys(found).length > 0;
  const next: Stored = hasNew
    ? {
        ...found,
        landing_page: url.pathname + url.search.slice(0, 250),
        referrer: document.referrer ? new URL(document.referrer).hostname : undefined,
        first_seen_at: new Date().toISOString(),
      }
    : existing.first_seen_at
      ? existing
      : {
          landing_page: url.pathname,
          referrer: document.referrer ? safeHost(document.referrer) : undefined,
          first_seen_at: new Date().toISOString(),
        };
  writeJSON(KEY, next, "session");
  persistIfAllowed(next);
}

export function persistIfAllowed(value?: Stored) {
  const v = value ?? readJSON<Stored>(KEY, "session");
  if (v && getConsent()?.ads) writeJSON(KEY, { ...v, expires: Date.now() + TTL }, "local");
}

export function getAttribution(): Attribution {
  const s = readJSON<Stored>(KEY, "session");
  if (s) return strip(s);
  const l = readJSON<Stored>(KEY, "local");
  if (l && (l.expires ?? 0) > Date.now()) return strip(l);
  return {};
}

function strip(s: Stored): Attribution {
  const { expires: _e, ...rest } = s;
  return rest;
}

function safeHost(u: string) {
  try {
    return new URL(u).hostname;
  } catch {
    return undefined;
  }
}
