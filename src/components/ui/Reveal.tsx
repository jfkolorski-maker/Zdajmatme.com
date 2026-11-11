"use client";
import { m, type Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

/** Scroll-triggered fade-up. Content stays in the DOM (SEO) and keeps its size (no layout shift). */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** Parent that staggers its <RevealItem> children. */
export function Stagger({ children, className, gap = 0.08 }: { children: React.ReactNode; className?: string; gap?: number }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={variants}>
      {children}
    </m.div>
  );
}
