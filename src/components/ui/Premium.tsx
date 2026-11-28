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
    <div className={`${WHITE} mx-auto mt-8 max-w-4xl md:mt-12`}>
      <ul className="relative grid px-5 py-3 md:grid-cols-2 md:gap-x-10 md:px-9 md:py-6">
        {items.map((t, i) => (
          <Rise key={i} i={i} className="flex items-start gap-3.5 border-b border-accent/30 py-3.5 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-night">
              <Icon name="check" size={14} strokeWidth={2.6} />
            </span>
            <span className="text-[0.98rem] font-medium leading-snug text-[#1e2228]">{t}</span>
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

/** Light card – white with the orange border (readable, brightens the dark page). */
export const WHITE = "relative overflow-hidden rounded-[24px] border-2 border-accent bg-white text-[#1e2228] shadow-[0_22px_50px_-30px_rgba(255,165,80,0.65)]";

/** Benefits / features: white tiles – icon + title + one line. 2 columns from tablet up. */
export function FeatureList({ items }: { items: { art: string; title: string; text: string }[] }) {
  return (
    <ul className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2 md:mt-12 md:gap-4">
      {items.map((b, i) => (
        <Rise key={b.title} i={i} className={`${WHITE} flex items-center gap-4 px-4 py-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:px-5 md:py-5`}>
          <span className="tile-art !h-16 !w-16 shrink-0 !rounded-[18px]">
            <QuizArt value={b.art} size={46} />
          </span>
          <span>
            <span className="block text-[1.06rem] font-bold leading-snug">{b.title}</span>
            <span className="mt-0.5 block text-[0.93rem] leading-snug text-[#4a4f57]">{b.text}</span>
          </span>
        </Rise>
      ))}
    </ul>
  );
}

/** Price card (white). `featured` = the recommended option (orange glow + badge + orange button). */
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
    <div className={`${WHITE} flex h-full flex-col text-center md:px-8 md:pb-8 md:pt-9 ${compact ? "px-3.5 pb-4 pt-6" : "px-6 pb-6 pt-7"} ${featured ? "ring-[6px] ring-accent/20" : ""}`}>
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-night">{badge}</span>
      )}
      <h3 className={`font-bold uppercase text-[#6b7078] ${compact ? "text-[0.66rem] tracking-[0.14em] md:text-[0.78rem] md:tracking-[0.22em]" : "text-[0.78rem] tracking-[0.22em]"}`}>{name}</h3>
      {price && (
        <p className="mt-4 flex items-baseline justify-center gap-3">
          {old && <s className="text-[1.15rem] text-[#adb5bd]">{old}</s>}
          <span className={`font-bold leading-none tracking-[-0.03em] text-accent ${compact ? "text-[clamp(2rem,9vw,3.4rem)]" : "text-[clamp(2.6rem,11vw,3.4rem)]"}`}>{price}</span>
        </p>
      )}
      {unit && <p className="mt-2 text-[0.95rem] font-medium text-[#1e2228]">{unit}</p>}
      {children}
      {note && <p className={`mt-4 flex-1 leading-relaxed text-[#5a5f67] ${compact ? "text-[0.82rem] md:text-[0.92rem]" : "text-[0.92rem]"}`}>{note}</p>}
      <a
        href="#zapisy"
        onClick={onClick}
        className={`btn mt-5 w-full !whitespace-normal ${compact ? "!min-h-12 !px-3 text-[0.92rem]" : ""} ${featured ? "btn-primary" : "bg-night text-white hover:bg-[#15181c]"}`}
      >
        {cta}
        <Icon name="arrow" size={18} />
      </a>
    </div>
  );
}
