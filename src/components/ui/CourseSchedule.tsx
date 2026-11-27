"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

/**
 * Premium course schedule (8th-grade and matura courses): one dark card with an orange
 * border, a "spec strip" with the key facts and the lessons as an ordered list –
 * two columns on desktop (read top to bottom), one on phones. No dates by design.
 */
export type ScheduleFact = { value: string; label: string };

/** "Funkcja kwadratowa 2" → { name: "Funkcja kwadratowa", part: "2" } */
function split(title: string) {
  const m = title.match(/^(.*\S)\s+(\d+)$/);
  return m ? { name: m[1], part: m[2] } : { name: title, part: null };
}

export function CourseSchedule({
  lessons,
  facts,
  eyebrow = "Rok szkolny 2027/2028",
  onCta,
}: {
  lessons: string[];
  facts: ScheduleFact[];
  eyebrow?: string;
  onCta?: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto mt-10 max-w-5xl">
      {/* soft orange halo behind the card */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-10 bottom-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,165,80,0.16),transparent)] blur-2xl" />

      <div className="relative overflow-hidden rounded-[32px] border-2 border-accent bg-[linear-gradient(180deg,#2f343c_0%,#22262c_55%,#1c1f24_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_80px_-40px_rgba(0,0,0,0.8),0_24px_60px_-30px_rgba(255,165,80,0.35)]">
        {/* fine sheen on the top edge */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(255,255,255,0.07),transparent)]" />

        {/* header */}
        <div className="relative px-6 pb-8 pt-9 text-center md:px-12 md:pt-11">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-accent">{eyebrow}</p>
          <p className="mt-3 text-[clamp(1.35rem,4.6vw,1.85rem)] font-light leading-tight tracking-[-0.01em] text-white">
            Cały program. <span className="whitespace-nowrap font-semibold">Krok po kroku.</span>
          </p>

          <dl className="mx-auto mt-8 grid max-w-3xl grid-cols-1 divide-y divide-accent/25 rounded-[22px] border border-accent/40 bg-white/[0.03] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col items-center px-4 py-4 sm:py-5">
                <dt className="order-2 mt-1 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/55">{f.label}</dt>
                <dd className="order-1 text-[1.2rem] font-semibold tracking-[-0.01em] text-white md:text-[1.35rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div aria-hidden="true" className="mx-6 h-px bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)] md:mx-12" />

        {/* lessons – one list; two columns on desktop, read top to bottom */}
        <ol className="relative px-4 py-6 md:columns-2 md:gap-x-10 md:px-10 md:py-8">
          {lessons.map((title, i) => {
            const { name, part } = split(title);
            const review = /^powtórzenie/i.test(name);
            return (
              <motion.li
                key={title}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: (i % 12) * 0.03 }}
                className="group relative flex break-inside-avoid items-center gap-4 border-b border-accent/20 px-2 py-[0.95rem] transition-colors duration-300 last:border-b-0 hover:bg-white/[0.035] md:px-4"
              >
                <span aria-hidden="true" className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-all duration-300 group-hover:h-7" />
                <span className="w-9 shrink-0 text-right text-[1.55rem] font-light leading-none tabular-nums text-accent transition-transform duration-300 group-hover:translate-x-1">
                  {i + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-[1rem] font-medium leading-snug text-white">{name}</span>
                  {part && <span className="text-[0.8rem] font-normal text-white/50">część {part}</span>}
                </span>
                {review && (
                  <span className="hidden shrink-0 rounded-full border border-accent/60 px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent sm:inline-flex">
                    Powtórka
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>

        {onCta && (
          <div className="flex flex-col items-center gap-3 border-t border-accent/25 bg-black/15 px-6 py-7 text-center md:flex-row md:justify-between md:px-12 md:text-left">
            <p className="text-[0.95rem] text-white/75">
              Wszystkie lekcje są nagrywane – <span className="text-white">wracasz do nich, kiedy chcesz.</span>
            </p>
            <a href="#zapisy" onClick={onCta} className="btn btn-primary shrink-0">
              Zapisz się
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
