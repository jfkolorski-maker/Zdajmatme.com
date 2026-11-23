/**
 * FLIPOR motion system – one language for the whole page.
 * Durations in seconds. Only transform and opacity are animated (GPU-composited,
 * smooth on phones) – no clip-path, filters or layout properties.
 */
export const DUR = {
  micro: 0.2, // taps, hovers, toggles
  ui: 0.38, // quiz screens, dialogs
  section: 0.7, // text & block reveals
  image: 0.95, // cinematic photo reveals
} as const;

/** Smooth expo-out for entrances. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Gentle in-out for things that move across the screen. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Springs for interactive elements – no visible bounce. */
export const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 26 } as const;

/** Stagger between siblings (words, list items). */
export const STAGGER = 0.06;

/** Reveal once, a little before the element is fully in view. */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
