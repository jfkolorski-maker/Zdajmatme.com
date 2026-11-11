"use client";
import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { Chapter } from "../ui/Chapter";
import { Reveal } from "../ui/Reveal";

const STEPS = [
  { t: "Poznajemy potrzeby ucznia", d: "Krótki quiz i rozmowa: etap nauki, poziom, trudne tematy i cel.", g: "?" },
  { t: "Dobieramy korepetytora", d: "Na podstawie tych informacji wybieramy osobę z naszego zespołu.", g: "↔" },
  { t: "Lekcje online 1:1", d: "Jeden uczeń, jeden korepetytor i wspólna wirtualna tablica.", g: "1:1" },
  { t: "Praca nad celem", d: "Każda lekcja służy konkretnemu celowi — ocenom, egzaminowi albo maturze.", g: "↗" },
  { t: "Informacja dla rodzica", d: "Rodzic wie, nad czym pracujemy i jak idą postępy.", g: "✓" },
];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <Chapter
      id="wspolpraca"
      titleText="Od pierwszej rozmowy do celu — krok po kroku."
      title="Od pierwszej rozmowy do celu — krok po kroku."
      lead="Bez zakładania kont i bez gotowych pakietów. Zaczynamy od ucznia."
    >
      <ol ref={ref} className="relative max-w-3xl space-y-3 pl-14 sm:pl-16">
        <span aria-hidden className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] rounded-full bg-white/10 sm:left-[1.6rem]" />
        <m.span aria-hidden style={{ scaleY }} className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] origin-top rounded-full bg-yellow-400 sm:left-[1.6rem]" />
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 0.04} className="relative">
            <span className="absolute -left-14 top-4 grid h-11 w-11 place-items-center rounded-full bg-surface-2 text-sm font-extrabold text-yellow-400 ring-4 ring-[var(--chapter-bg,#07162e)] sm:-left-16 sm:h-[3.25rem] sm:w-[3.25rem]">
              {s.g}
            </span>
            <div className="surface p-5 sm:p-6">
              <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-yellow-400">Krok {i + 1}</p>
              <h3 className="h-card mt-1">{s.t}</h3>
              <p className="mt-1.5 text-text-2">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Chapter>
  );
}
