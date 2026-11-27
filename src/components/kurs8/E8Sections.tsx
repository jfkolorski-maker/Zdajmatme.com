"use client";

import Image from "next/image";
import { presetQuiz } from "@/components/sections/Offer";
import { CourseSchedule } from "@/components/ui/CourseSchedule";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { FactList, PriceCard } from "@/components/ui/Premium";
import { track } from "@/lib/ads/track";

/**
 * Transferred from zdajmatme.com/kurs-osmoklasisty.php – same order and copy, already in the
 * house style of the "Korepetycje indywidualne" sub-page (grey backgrounds, orange borders).
 * "Zapisz się" leads to the quiz at the bottom of this page, preset to the 8th-grade course.
 */
const ORANGE = "text-[#FFA550]";

function toQuiz(placement: string) {
  presetQuiz("e8");
  track({ name: "cta_click", placement, label: "quiz" });
}

export function E8Hero() {
  return (
    <section id="start" aria-labelledby="e8-title" className="relative overflow-hidden text-white">
      <Image src="/images/e8-hero.webp" alt="" fill priority sizes="100vw" className="object-cover object-[60%_50%]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,26,26,0.7)]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-[100px] pt-[168px] text-center">
        <h1 id="e8-title" className="text-[clamp(2.2rem,8.5vw,3.5rem)] font-bold leading-[1.15]">
          Egzamin ósmoklasisty <span className={ORANGE}>bez stresu</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-white/90 md:text-[1.2rem]">
          Mała grupa online, setki przerobionych zadań i sprawdzone strategie egzaminacyjne.
        </p>
      </div>
    </section>
  );
}

/** Banner right under the hero photo: enrolment for the next school year is open. */
export function E8Enrol() {
  return (
    <section aria-label="Zapisy" className="relative z-10 -mt-12 bg-[linear-gradient(transparent_3rem,var(--color-surface)_3rem)] px-5">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[28px] border-2 border-accent bg-night px-6 py-6 text-center text-white shadow-[0_0_0_8px_rgba(255,165,80,0.12),0_24px_60px_-24px_rgba(255,165,80,0.6)] md:flex-row md:justify-between md:px-8 md:text-left">
        <p className="text-[1.15rem] font-semibold leading-snug md:text-[1.3rem]">
          <span className="mb-1 flex items-center justify-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-accent-bright md:justify-start">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="ping absolute inset-0 rounded-full bg-accent/60" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            Rok szkolny 2027/2028
          </span>
          Zapisy na kurs do egzaminu ósmoklasisty <span className={ORANGE}>już otwarte!</span>
        </p>
        <a href="#zapisy" onClick={() => toQuiz("e8_enrol_banner")} className="btn btn-primary shrink-0">
          Zapisz się
        </a>
      </div>
    </section>
  );
}

const INFO = [
  "22 spotkania po 60 minut",
  "45 zł za lekcję",
  "Poniedziałki o 18:00, online na Teams",
  "Nagrania i notatki przez cały kurs",
  "Zadanie domowe po każdej lekcji",
  "Materiały zgodne z wymaganiami CKE",
  "Nie możesz być na żywo? Obejrzysz nagranie",
  "Pomagamy też w zadaniach spoza kursu",
];

export function E8Info() {
  return (
    <section aria-labelledby="e8-info" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Kurs w skrócie" title="Najważniejsze informacje" accent={["informacje"]} id="e8-info" />
        <FactList items={INFO} />
      </div>
    </section>
  );
}

const LESSONS = [
  "Liczby i działania 1",
  "Liczby i działania 2",
  "Liczby i działania 3",
  "Liczby i działania 4",
  "Procenty",
  "Potęgi",
  "Pierwiastki",
  "Proporcje",
  "Wyrażenia algebraiczne",
  "Równania",
  "Układ współrzędnych",
  "Kąty i własności figur",
  "Trójkąty",
  "Czworokąty",
  "Graniastosłupy",
  "Ostrosłupy",
  "Statystyka",
  "Kombinatoryka i prawdopodobieństwo",
  "Zadania praktyczne",
  "Powtórzenie 1",
  "Powtórzenie 2",
  "Powtórzenie 3",
];

export function E8Schedule() {
  return (
    <section aria-labelledby="e8-schedule" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead kicker="Program" title="Terminarz kursu" accent={["kursu"]} id="e8-schedule" />
        <CourseSchedule
          lessons={LESSONS}
          facts={[
            { value: "60 min", label: "jedna lekcja" },
            { value: "Pon. 18:00", label: "online na żywo" },
            { value: "Teams", label: "+ nagrania i notatki" },
          ]}
          onCta={() => toQuiz("e8_schedule")}
        />
      </div>
    </section>
  );
}

export function E8Pricing() {
  return (
    <section id="cennik" aria-labelledby="e8-price" className="section-y scroll-mt-16 bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Cennik" title="Wybierz sposób płatności" accent={["płatności"]} id="e8-price" />
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
          <FadeUp className="h-full">
            <PriceCard name="Pojedyncza lekcja" price="45 zł" unit="za 60 minut" note="Płacisz w trakcie – koszt rozłożony w czasie." cta="Zapisz się" onClick={() => toQuiz("e8_price_single")} />
          </FadeUp>
          <FadeUp delay={0.06} className="h-full">
            <PriceCard name="Cały kurs" badge="−10%" featured old="990 zł" price="890 zł" unit="płatność jednorazowa" note="Oszczędzasz 100 zł i masz pewne miejsce w grupie." cta="Wybieram z rabatem" onClick={() => toQuiz("e8_price_full")} />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
