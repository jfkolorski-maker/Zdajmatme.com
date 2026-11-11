"use client";
import { m } from "motion/react";
import type { QuizOption } from "@/config/quiz";
import { Check } from "../ui/Icons";

export function OptionButton({ option, selected, multi, onClick, index }: { option: QuizOption; selected: boolean; multi: boolean; onClick: () => void; index: number }) {
  return (
    <m.button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex min-h-[4.25rem] w-full items-center gap-4 rounded-2xl p-3.5 pr-12 text-left transition-[background-color,box-shadow] duration-200 sm:p-4 sm:pr-12 ${
        selected
          ? "bg-yellow-400/[0.12] shadow-[inset_0_0_0_2px_var(--color-yellow-400)]"
          : "bg-white/[0.05] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] hover:bg-white/[0.09] hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)]"
      }`}
    >
      {option.glyph && (
        <span
          aria-hidden
          className={`grid h-11 min-w-11 shrink-0 place-items-center rounded-xl px-2 text-[0.95rem] font-extrabold transition-colors ${
            selected ? "bg-yellow-400 text-navy-950" : "bg-white/[0.08] text-yellow-400"
          }`}
        >
          {option.glyph}
        </span>
      )}
      <span className="flex-1">
        <span className="block text-[1.0625rem] font-bold leading-snug text-white">{option.label}</span>
        {option.hint && <span className="mt-0.5 block text-sm font-medium text-white/55">{option.hint}</span>}
      </span>
      <span
        aria-hidden
        className={`absolute right-4 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center border-2 transition-all ${multi ? "rounded-md" : "rounded-full"} ${
          selected ? "border-yellow-400 bg-yellow-400 text-navy-950" : "border-white/30"
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
      </span>
    </m.button>
  );
}
