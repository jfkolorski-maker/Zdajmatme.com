"use client";
import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import type { PathPreset } from "@/config/quiz";
import { QuizCta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";

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
    art: ["2 → 3 → 4 → 5", "½ + ⅓ = ⅚", "15% z 80 = 12"],
  },
  {
    id: "exam8",
    title: "Egzamin ósmoklasisty",
    who: "Klasy 7–8",
    text: "Indywidualne przygotowanie do egzaminu, powtórzenie kluczowych zagadnień i systematyczne ćwiczenie zadań.",
    cta: "Przygotuj się do egzaminu",
    art: ["P = ½ · a · h", "2x + 5 = 17", "√49 = 7"],
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

function Panel({ p }: { p: Path }) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-navy-950 p-6 text-white sm:p-9">
      <div aria-hidden className="grid-paper absolute inset-0 opacity-70" />
      <div className="relative">
        <p className="eyebrow text-yellow-400">{p.who}</p>
        <h3 className="mt-3 text-2xl font-extrabold sm:text-[2rem] sm:leading-tight">{p.title}</h3>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">{p.text}</p>
        <ul aria-hidden className="mt-7 flex flex-wrap gap-2.5">
          {p.art.map((a, i) => (
            <m.li
              key={a}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.08 }}
              className="math rounded-xl bg-white/[0.07] px-3.5 py-2 text-[0.95rem] text-white/85 ring-1 ring-white/10"
            >
              {a}
            </m.li>
          ))}
        </ul>
        <QuizCta location={`path_${p.id}`} preset={p.id} className="mt-8 w-full sm:w-auto">
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
    <section id="sciezki" className="py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-navy-600">Dla kogo są nasze korepetycje?</p>
          <h2 className="h-section mt-3">Wybierz cel. Resztę dopasujemy do ucznia.</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <ul className="space-y-3" role="list">
            {PATHS.map((p, i) => {
              const on = p.id === active;
              return (
                <Reveal as="li" key={p.id} delay={i * 0.06}>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setActive(p.id)}
                    className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 sm:p-5 ${
                      on ? "bg-white shadow-[var(--shadow-lift)] ring-1 ring-black/5" : "hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-extrabold transition-colors ${
                        on ? "bg-yellow-400 text-navy-950" : "bg-navy-950/[0.06] text-navy-700 group-hover:bg-navy-950/10"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-extrabold leading-snug sm:text-xl">{p.title}</span>
                      <span className="mt-0.5 block text-sm font-semibold text-ink-muted">{p.who}</span>
                    </span>
                    <span aria-hidden className={`text-2xl text-navy-600 transition-transform duration-300 ${on ? "rotate-90 lg:rotate-0 lg:translate-x-1" : ""}`}>
                      →
                    </span>
                  </button>
                  {/* mobile: panel inline under the selected item */}
                  <AnimatePresence initial={false}>
                    {on && (
                      <m.div
                        id={`path-panel-${p.id}`}
                        className="overflow-hidden lg:hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45 }}
                      >
                        <div className="pt-3">
                          <Panel p={p} />
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </ul>
          {/* desktop: sticky side panel */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <m.div key={current.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                  <Panel p={current} />
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
