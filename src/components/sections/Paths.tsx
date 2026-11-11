"use client";
import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import type { PathPreset } from "@/config/quiz";
import { QuizCta } from "../ui/Cta";
import { Chapter } from "../ui/Chapter";

interface Path {
  id: PathPreset;
  title: string;
  who: string;
  text: string;
  cta: string;
  art: string[];
}

const PATHS: Path[] = [
  {
    id: "grades",
    title: "Poprawa ocen i nadrabianie zaległości",
    who: "Szkoła podstawowa i liceum",
    text: "Pomagamy uczniom uporządkować materiał, zrozumieć trudne zagadnienia i przygotować się do bieżących sprawdzianów.",
    cta: "Znajdź korepetytora",
    art: ["½ + ⅓ = ⅚", "15% z 80 = 12", "2x + 5 = 17"],
  },
  {
    id: "exam8",
    title: "Egzamin ósmoklasisty",
    who: "Klasy 7–8",
    text: "Indywidualne przygotowanie do egzaminu, powtórzenie kluczowych zagadnień i systematyczne ćwiczenie zadań.",
    cta: "Przygotuj się do egzaminu",
    art: ["P = ½ · a · h", "√49 = 7", "a² + b² = c²"],
  },
  {
    id: "matura_basic",
    title: "Matura podstawowa",
    who: "Liceum i technikum",
    text: "Przygotowanie do matury z matematyki na poziomie podstawowym. Praca nad zadaniami, strategiami i rozumieniem materiału.",
    cta: "Przygotuj się do matury",
    art: ["Δ = b² − 4ac", "aₙ = a₁·qⁿ⁻¹", "sin 30° = ½"],
  },
  {
    id: "matura_ext",
    title: "Matura rozszerzona",
    who: "Liceum i technikum — rozszerzenie",
    text: "Indywidualna praca nad bardziej wymagającymi zagadnieniami, zadaniami maturalnymi i rozwijaniem umiejętności rozwiązywania problemów.",
    cta: "Wybierz ścieżkę rozszerzoną",
    art: ["f′(x) = 3x² − 2", "log₃ 81 = 4", "lim (1 + 1/n)ⁿ = e"],
  },
];

/** Panel body. `withTitle` only on desktop (on mobile the title is already on the selected row). */
function Panel({ p, withTitle }: { p: Path; withTitle: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-white/10 sm:p-8">
      <div aria-hidden className="grid-paper absolute inset-0 opacity-60" />
      <div className="relative">
        {withTitle && (
          <>
            <p className="eyebrow text-yellow-400">{p.who}</p>
            <h3 className="h-card mt-2 !text-[1.75rem]">{p.title}</h3>
          </>
        )}
        <p className={`text-text-2 ${withTitle ? "mt-4 text-lg leading-relaxed" : "text-base leading-relaxed"}`}>{p.text}</p>
        <ul aria-hidden className="mt-5 flex flex-wrap gap-2">
          {p.art.map((a, i) => (
            <m.li
              key={a}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="math rounded-xl bg-white/[0.06] px-3 py-1.5 text-[0.95rem] text-text ring-1 ring-white/10"
            >
              {a}
            </m.li>
          ))}
        </ul>
        <QuizCta location={`path_${p.id}`} preset={p.id} className="mt-6 w-full sm:w-auto">
          {p.cta}
        </QuizCta>
      </div>
    </div>
  );
}

export function Paths() {
  const [active, setActive] = useState<PathPreset>("grades");
  const current = PATHS.find((p) => p.id === active)!;

  return (
    <Chapter id="sciezki" titleText="Wybierz cel. Resztę dopasujemy do ucznia." title="Wybierz cel. Resztę dopasujemy do ucznia." lead="Cztery ścieżki — każda od razu ustawia quiz pod Twoją sytuację.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <ul className="space-y-3">
          {PATHS.map((p, i) => {
            const on = p.id === active;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setActive(p.id)}
                  className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 sm:p-5 ${
                    on ? "bg-surface-2 ring-2 ring-yellow-400/80" : "bg-surface/60 ring-1 ring-white/10 hover:bg-surface"
                  }`}
                >
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-extrabold transition-colors ${on ? "bg-yellow-400 text-navy-950" : "bg-white/[0.07] text-text-2"}`}>
                    0{i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-extrabold leading-snug">{p.title}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-text-3">{p.who}</span>
                  </span>
                  <span aria-hidden className={`text-xl text-text-3 transition-transform duration-300 ${on ? "rotate-90 text-yellow-400 lg:rotate-0" : ""}`}>
                    →
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <m.div className="overflow-hidden lg:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }}>
                      <div className="pt-3">
                        <Panel p={p} withTitle={false} />
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <AnimatePresence mode="wait">
              <m.div key={current.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <Panel p={current} withTitle />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
