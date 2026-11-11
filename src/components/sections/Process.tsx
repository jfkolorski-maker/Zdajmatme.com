"use client";
import { useRef } from "react";
import { m, useScroll, useSpring, useTransform } from "motion/react";
import { QuizCta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";

const STEPS = [
  { t: "Poznajemy potrzeby ucznia.", d: "Krótki quiz i rozmowa z Oliwią: etap nauki, poziom, trudne tematy i cel.", g: "?" },
  { t: "Dobieramy odpowiedniego korepetytora.", d: "Na podstawie potrzeb ucznia wybieramy osobę z naszego zespołu.", g: "↔" },
  { t: "Prowadzimy indywidualne lekcje online 1:1.", d: "Jeden uczeń, jeden korepetytor, wspólna wirtualna tablica.", g: "1:1" },
  { t: "Pracujemy nad celem i monitorujemy postępy.", d: "Lekcje są podporządkowane celowi: ocenom, egzaminowi lub maturze.", g: "↗" },
  { t: "Rodzic otrzymuje informacje o postępach.", d: "Wiesz, nad czym pracujemy i jak idzie nauka.", g: "✓" },
];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="wspolpraca" className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <div aria-hidden className="grid-paper absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-yellow-400">Jak wygląda współpraca?</p>
          <h2 className="h-section mt-3">Od pierwszej rozmowy do celu — krok po kroku.</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            Bez zakładania kont i bez zgadywania. Zaczynamy od potrzeb ucznia, a nie od gotowego pakietu.
          </p>
          <QuizCta location="process" className="mt-8">
            Rozpocznij quiz
          </QuizCta>
        </Reveal>

        <ol ref={ref} className="relative space-y-4 pl-14 sm:pl-16">
          <span aria-hidden className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] rounded-full bg-white/10 sm:left-[1.6rem]" />
          <m.span
            aria-hidden
            style={{ scaleY }}
            className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] origin-top rounded-full bg-yellow-400 sm:left-[1.6rem]"
          />
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 0.05} className="relative">
              <span className="absolute -left-14 top-5 grid h-11 w-11 place-items-center rounded-full bg-navy-800 text-sm font-extrabold text-yellow-400 ring-4 ring-navy-950 sm:-left-16 sm:h-[3.25rem] sm:w-[3.25rem]">
                {s.g}
              </span>
              <div className="rounded-2xl bg-white/[0.045] p-5 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.07] sm:p-6">
                <p className="text-sm font-bold text-yellow-400">Krok {i + 1}</p>
                <h3 className="mt-1 text-xl font-extrabold sm:text-2xl">{s.t}</h3>
                <p className="mt-2 text-white/65">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
