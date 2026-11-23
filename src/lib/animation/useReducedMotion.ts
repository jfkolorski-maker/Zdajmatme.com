"use client";
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(QUERY).matches;

/** True when the user asked the OS to minimise motion. SSR-safe (false on server). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
