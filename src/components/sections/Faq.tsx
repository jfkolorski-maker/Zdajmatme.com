"use client";
import { useId, useState } from "react";
import { faq } from "@/config/faq";
import { Plus } from "../ui/Icons";
import { Chapter } from "../ui/Chapter";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <Chapter id="faq" title={<>Pytania, które słyszymy<br />najczęściej.</>} lead="Krótko i konkretnie — zanim zadzwonisz.">
      <ul className="card-dark mx-auto max-w-3xl divide-y divide-white/[0.08] overflow-hidden">
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
                  className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[1.06rem] font-semibold text-white sm:px-6"
                >
                  {item.q}
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-200 ${on ? "rotate-45 bg-yellow-400 text-navy-950" : "bg-white/[0.08]"}`}>
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              </h3>
              <div id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} hidden={!on}>
                <p className="px-5 pb-5 text-white/75 sm:px-6">{item.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Chapter>
  );
}
