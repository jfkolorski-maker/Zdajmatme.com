"use client";
import { m } from "motion/react";
import { site } from "@/config/site";
import { Chapter } from "../ui/Chapter";

const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

/** Six quality rules — only what ZdajMatme confirmed in the brief. */
const RULES = [
  { t: "Lekcje 1:1", d: "Cała uwaga korepetytora skupiona na jednym uczniu.", i: <svg {...ic}><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M3 20c.8-3 2.8-5 5-5s4.2 2 5 5M11 20c.8-3 2.8-5 5-5s4.2 2 5 5" /></svg> },
  { t: "Dobór korepetytora", d: `${site.owner.firstName} dobiera osobę do potrzeb, poziomu i celu ucznia.`, i: <svg {...ic}><path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" /></svg> },
  { t: "Uczeń rozwiązuje sam", d: "Korepetytor naprowadza, a uczeń samodzielnie dochodzi do wyniku.", i: <svg {...ic}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg> },
  { t: "Plan pod cel", d: "Oceny, egzamin ósmoklasisty albo matura — wiemy, nad czym pracujemy.", i: <svg {...ic}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg> },
  { t: "Informacja dla rodzica", d: "Rodzic wie, nad czym pracujemy i jak idzie nauka.", i: <svg {...ic}><path d="M4 5h16v11H8l-4 4Z" /><path d="M8 9h8M8 12h5" /></svg> },
  { t: "Jasna cena", d: `${site.price.amount} zł za ${site.price.minutes} minut lekcji. Zgłoszenie jest bezpłatne.`, i: <svg {...ic}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg> },
];

export function Standard() {
  return (
    <Chapter id="standard" title={<>Sześć zasad,<br />których się trzymamy.</>} lead="Tak wygląda każda współpraca z ZdajMatme.com.">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {RULES.map((r, i) => (
          <m.li
            key={r.t}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="card-dark flex gap-4 p-5 lg:flex-col lg:p-6"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-yellow-400 text-navy-950">{r.i}</span>
            <span>
              <span className="block text-[1.08rem] font-semibold text-white">{r.t}</span>
              <span className="mt-1 block text-white/60">{r.d}</span>
            </span>
          </m.li>
        ))}
      </ul>
    </Chapter>
  );
}
