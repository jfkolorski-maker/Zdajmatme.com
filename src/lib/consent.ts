"use client";
import { useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./storage";

/**
 * Minimal consent store + Google Consent Mode v2 bridge.
 * Default (before choice): everything denied (set inline in <head>, see ConsentDefaults).
 */
export interface ConsentState {
  analytics: boolean;
  ads: boolean;
  decidedAt: number;
}

const KEY = "zm_consent_v1";
const listeners = new Set<() => void>();
let cache: ConsentState | null | undefined;

function read(): ConsentState | null {
  if (cache === undefined) cache = readJSON<ConsentState>(KEY);
  return cache;
}

export function getConsent(): ConsentState | null {
  return read();
}

export function setConsent(analytics: boolean, ads: boolean) {
  const state: ConsentState = { analytics, ads, decidedAt: Date.now() };
  cache = state;
  writeJSON(KEY, state);
  applyConsentMode(state);
  listeners.forEach((l) => l());
}

export function applyConsentMode(state: ConsentState) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  const g = (s: boolean) => (s ? "granted" : "denied");
  w.gtag?.("consent", "update", {
    analytics_storage: g(state.analytics),
    ad_storage: g(state.ads),
    ad_user_data: g(state.ads),
    ad_personalization: g(state.ads),
  });
}

export function useConsent(): ConsentState | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => null,
  );
}

/** Lets any component (e.g. the footer link) reopen the consent panel. */
export const OPEN_CONSENT_EVENT = "zm:open-consent";
export const openConsentSettings = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
