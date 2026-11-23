"use client";

import type { ReactNode } from "react";

/**
 * FLIPOR's welcome film is skipped: ZdajMatme has no intro film yet (see docs/PROMPT – "Bez filmu:
 * pomiń intro całkowicie"). The hook stays so every entrance animation works unchanged; when a film
 * exists, port components/motion/Intro.tsx from the FLIPOR repo back in.
 */
export const useIntroDone = () => true;

export function IntroProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
