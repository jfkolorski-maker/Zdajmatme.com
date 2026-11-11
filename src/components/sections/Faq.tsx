"use client";
import { useId, useState } from "react";
import { faq } from "@/config/faq";
import { site } from "@/config/site";
import { trackCall } from "@/lib/tracking";
import { Plus } from "../ui/Icons";
import { Chapter } from "../ui/Chapter";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <Chapter
      id="faq"
      titleText="Najczęściej zadawane pytania"
      title="Najczęściej zadawane pytania"
      lead={
        <>
          Nie ma tu Twojego pytania?{" "}
          <a href={site.phone.href} onClick={() => trackCall("faq")} className="font-bold text-yellow-400 underline underline-offset-4">
            Zadzwoń: {site.phone.display}
          </a>
        </>
      }
    >
      <ul className="max-w-3xl divide-y divide-white/10 overflow-hidden rounded-[var(--radius-card)] bg-surface ring-1 ring-white/10">
        {faq.map((item, i) => {
          const on = open === i;
          return (
            <li key={item.q}>
              <h3>
                <button
                  type="button"
                  id={`${id}-q${i}`}
                  aria-expanded={on}
                  aria-controls={`${id}-a${i}`}
                  onClick={() => setOpen(on ? null : i)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[1.0625rem] font-bold transition-colors hover:bg-white/[0.03] sm:px-7"
                >
                  {item.q}
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${on ? "rotate-45 bg-yellow-400 text-navy-950" : "bg-white/[0.07]"}`}>
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              </h3>
              <div
                id={`${id}-a${i}`}
                role="region"
                aria-labelledby={`${id}-q${i}`}
                className={`grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-expo)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-6 leading-relaxed text-text-2 sm:px-7">{item.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Chapter>
  );
}
