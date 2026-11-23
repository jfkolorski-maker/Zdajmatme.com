"use client";

import { prefersReducedMotion } from "./useReducedMotion";

/** Scrolls to a section (native smooth scroll; instant with reduced motion). */
export function scrollToId(id: string, focusSelector?: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  const target = (focusSelector && el.querySelector<HTMLElement>(focusSelector)) || null;
  if (target) window.setTimeout(() => target.focus({ preventScroll: true }), 600);
}
