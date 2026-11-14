"use client";
import { m } from "motion/react";
import type { QuizOption } from "@/config/quiz";

const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
const ICONS: Record<string, React.ReactNode> = {
  "@parent": <svg {...ic}><circle cx="9" cy="7" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5M14.5 20c.4-2.2 1.5-3.6 2.5-3.6s2.1 1.4 2.5 3.6" /></svg>,
  "@student": <svg {...ic}><path d="M2 9l10-5 10 5-10 5Z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></svg>,
};

/** Quiz tile: icon square → label → round checkbox with drawn check. Selected: navy outline, yellow icon, filled circle. */
export function OptionButton({ option, selected, onClick, index, wide }: { option: QuizOption; selected: boolean; onClick: () => void; index: number; wide?: boolean }) {
  const icon = option.glyph && ICONS[option.glyph];
  return (
    <m.button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: selected ? 1.015 : 1 }}
      transition={{ opacity: { delay: 0.04 * index, duration: 0.3 }, y: { delay: 0.04 * index, duration: 0.38, ease: [0.16, 1, 0.3, 1] }, scale: { type: "spring", stiffness: 420, damping: 34 } }}
      className={`flex min-h-[76px] w-full items-center gap-3.5 rounded-[20px] bg-white p-4 text-left transition-shadow duration-200 ${
        selected ? "shadow-[inset_0_0_0_2px_var(--color-ink)]" : "shadow-[inset_0_0_0_1.5px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_#94a3b8]"
      } ${wide ? "sm:col-span-2" : ""}`}
    >
      {option.glyph && (
        <span aria-hidden className={`grid h-11 min-w-11 shrink-0 place-items-center rounded-[14px] px-1.5 text-[0.92rem] font-[760] transition-colors ${selected ? "bg-yellow-400 text-navy-950" : "bg-bg text-ink"}`}>
          {icon ?? option.glyph}
        </span>
      )}
      <span className="flex-1">
        <span className="block font-semibold leading-snug text-ink">{option.label}</span>
        {option.hint && <span className="mt-0.5 block text-sm text-muted">{option.hint}</span>}
      </span>
      <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors ${selected ? "bg-ink" : "shadow-[inset_0_0_0_1.5px_#cbd5e1]"}`}>
        {selected && (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#FFC928" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <m.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
          </svg>
        )}
      </span>
    </m.button>
  );
}
