"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { IntroProvider } from "./motion/Intro";

/** Motion honours the OS "reduce motion" setting everywhere (transforms are skipped). */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <IntroProvider>{children}</IntroProvider>
    </MotionConfig>
  );
}
