"use client";
import { useId, useState } from "react";
import { faq } from "@/config/faq";
import { Plus } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { CallCta, QuizCta } from "../ui/Cta";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-navy-600">FAQ</p>
          <h2 className="h-section mt-3">Najczęściej zadawane pytania</h2>
          <p className="mt-5 text-lg text-ink-muted">Nie znalazłeś odpowiedzi? Zadzwoń — porozmawiasz bezpośrednio z Oliwią.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <QuizCta location="faq">Dobierz korepetycje</QuizCta>
            <CallCta location="faq" variant="ghost-light" />
          </div>
        </Reveal>
        <Reveal>
          <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-soft)] ring-1 ring-black/5">
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
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[1.0625rem] font-bold transition-colors hover:bg-paper sm:px-7"
                    >
                      {item.q}
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${on ? "rotate-45 bg-yellow-400" : "bg-paper"}`}>
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
                      <p className="px-5 pb-6 leading-relaxed text-ink-muted sm:px-7">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
