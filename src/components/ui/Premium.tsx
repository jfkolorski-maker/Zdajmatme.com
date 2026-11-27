"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { QuizArt } from "@/components/quiz/QuizArt";
import { Icon } from "@/components/ui/icons";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

/**
 * One premium language for every sub-page: dark graphite cards with the orange border,
 * a soft top sheen, thin orange hairlines and calm reveal motion. Compact on phones.
 */
export const CARD =
  "relative overflow-hidden rounded-[28px] border-2 border-accent bg-[linear-gradient(180deg,#30353d_0%,#23272d_60%,#1e2126_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_70px_-40px_rgba(0,0,0,0.85),0_20px_50px_-30px_rgba(255,165,80,0.35)]";

function Sheen() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(255,255,255,0.07),transparent)]" />;
}

function useRise(i: number) {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition: { duration: 0.6, ease: EASE_OUT, delay: Math.min(i, 8) * 0.04 },
  } as const;
}

/** Short facts with an orange check – one card, two columns on desktop. */
export function FactList({ items }: { items: ReactNode[] }) {
  return (
    <div className={`${CARD} mx-auto mt-8 max-w-4xl md:mt-12`}>
      <Sheen />
      <ul className="relative grid px-5 py-3 md:grid-cols-2 md:gap-x-10 md:px-9 md:py-6">
        {items.map((t, i) => (
          <Rise key={i} i={i} className="flex items-start gap-3.5 border-b border-accent/20 py-3.5 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-night">
              <Icon name="check" size={14} strokeWidth={2.6} />
            </span>
            <span className="text-[0.98rem] leading-snug text-white/90">{t}</span>
          </Rise>
        ))}
      </ul>
    </div>
  );
}

function Rise({ i, className, children }: { i: number; className: string; children: ReactNode }) {
  const m = useRise(i);
  return (
    <motion.li {...m} className={className}>
      {children}
    </motion.li>
  );
}

/** Benefits / features: icon + title + one line. Compact rows (2 columns from tablet up). */
export function FeatureList({ items }: { items: { art: string; title: string; text: string }[] }) {
  return (
    <div className={`${CARD} mx-auto mt-8 max-w-5xl md:mt-12`}>
      <Sheen />
      <ul className="relative grid px-4 py-2 sm:grid-cols-2 sm:gap-x-8 md:px-8 md:py-5">
        {items.map((b, i) => (
          <Rise key={b.title} i={i} className="flex items-center gap-4 border-b border-accent/20 py-4 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[16px] bg-[#fff5e6] shadow-[0_8px_20px_-10px_rgba(255,165,80,0.8)]">
              <QuizArt value={b.art} size={40} />
            </span>
            <span>
              <span className="block text-[1.05rem] font-semibold leading-snug text-white">{b.title}</span>
              <span className="mt-0.5 block text-[0.92rem] leading-snug text-white/60">{b.text}</span>
            </span>
          </Rise>
        ))}
      </ul>
    </div>
  );
}

/** Price card. `featured` = the recommended option (orange glow + badge). */
export function PriceCard({
  name,
  price,
  old,
  unit,
  note,
  badge,
  featured = false,
  cta,
  onClick,
  children,
  compact = false,
}: {
  name: string;
  price?: string;
  old?: string;
  unit?: string;
  note?: ReactNode;
  badge?: string;
  featured?: boolean;
  cta: string;
  onClick: () => void;
  children?: ReactNode;
  /** narrow card (two side by side on phones) */
  compact?: boolean;
}) {
  return (
    <div className={`${CARD} flex flex-col text-center md:px-8 md:pb-8 md:pt-9 ${compact ? "px-3.5 pb-4 pt-6" : "px-6 pb-6 pt-7"} ${featured ? "ring-4 ring-accent/15" : ""}`}>
      <Sheen />
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-night">{badge}</span>
      )}
      <h3 className={`relative font-semibold uppercase text-white/60 ${compact ? "text-[0.66rem] tracking-[0.14em] md:text-[0.78rem] md:tracking-[0.24em]" : "text-[0.78rem] tracking-[0.24em]"}`}>{name}</h3>
      {price && (
        <p className="relative mt-4 flex items-baseline justify-center gap-3">
          {old && <s className="text-[1.15rem] text-white/35">{old}</s>}
          <span className={`font-semibold leading-none tracking-[-0.03em] text-accent ${compact ? "text-[clamp(2rem,9vw,3.4rem)]" : "text-[clamp(2.6rem,11vw,3.4rem)]"}`}>{price}</span>
        </p>
      )}
      {unit && <p className="relative mt-2 text-[0.95rem] text-white/80">{unit}</p>}
      {children}
      {note && <p className={`relative mt-4 flex-1 leading-relaxed text-white/55 ${compact ? "text-[0.82rem] md:text-[0.92rem]" : "text-[0.92rem]"}`}>{note}</p>}
      <a href="#zapisy" onClick={onClick} className={`btn relative mt-5 w-full !whitespace-normal ${compact ? "!min-h-12 !px-3 text-[0.92rem]" : ""} ${featured ? "btn-primary" : "btn-on-dark"}`}>
        {cta}
        <Icon name="arrow" size={18} />
      </a>
    </div>
  );
}
