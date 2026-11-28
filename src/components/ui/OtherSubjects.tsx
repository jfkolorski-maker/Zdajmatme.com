"use client";

import { presetQuiz } from "@/components/sections/Offer";
import { Icon } from "@/components/ui/icons";
import { track } from "@/lib/ads/track";

export const OTHER_SUBJECTS = ["Fizyka", "Chemia", "Biologia"] as const;

/**
 * Extra services, deliberately quiet: maths stays the main offer. One slim line with three chips;
 * the link pre-selects "Fizyka, chemia lub biologia" in the quiz.
 */
export function OtherSubjects({ placement, className = "" }: { placement: string; className?: string }) {
  return (
    <div className={`mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-[22px] border border-accent/40 bg-white/[0.04] px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left ${className}`}>
      <p className="text-[0.95rem] leading-snug text-white/80">
        <span className="mb-0.5 block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent">Uczymy też</span>
        Korepetycje 1-na-1 online z innych przedmiotów:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {OTHER_SUBJECTS.map((s) => (
          <span key={s} className="rounded-full border-2 border-accent bg-white px-3.5 py-1 text-[0.88rem] font-semibold text-night">
            {s}
          </span>
        ))}
        <a
          href="#zapisy"
          onClick={() => {
            presetQuiz("science");
            track({ name: "cta_click", placement, label: "science" });
          }}
          className="inline-flex min-h-10 items-center gap-1 px-1 text-[0.88rem] font-semibold text-accent hover:text-accent-bright"
        >
          Zapytaj <Icon name="arrow" size={15} />
        </a>
      </div>
    </div>
  );
}
