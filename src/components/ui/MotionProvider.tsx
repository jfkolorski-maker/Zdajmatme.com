"use client";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/** LazyMotion keeps the animation bundle small (domAnimation ≈ 15kb) and `m.*` components tree-shakeable. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.7 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
