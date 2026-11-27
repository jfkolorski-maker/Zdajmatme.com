"use client";

import Image from "next/image";
import { useState } from "react";
import { presetQuiz } from "@/components/sections/Offer";
import { VideoLesson } from "@/components/sections/VideoLesson";
import { CourseSchedule } from "@/components/ui/CourseSchedule";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { FactList, FeatureList, PriceCard } from "@/components/ui/Premium";
import { track } from "@/lib/ads/track";

/**
 * Transferred from zdajmatme.com/kurs-maturalny.php – same copy and the same two tabs (basic / extended),
 * in the house style of the other sub-pages (grey backgrounds, white tiles with orange borders,
 * schedule without dates). "Zapisz się" leads to the quiz at the bottom, preset to the matura course.
 */
const ORANGE = "text-[#FFA550]";

type Level = "basic" | "extended";

function toQuiz(placement: string) {
  presetQuiz("matura");
  track({ name: "cta_click", placement, label: "quiz" });
}

const TOPICS = [
  "Funkcja kwadratowa 1",
  "Funkcja kwadratowa 2",
  "Wielomiany i wyrażenia wymierne",
  "Granice",
  "Ciągi i szeregi",
  "Logarytmy",
  "Dowodzenie",
  "Wartość bezwzględna",
  "Trygonometria 1",
  "Trygonometria 2",
  "Planimetria 1",
  "Planimetria 2",
  "Geometria analityczna 1",
  "Geometria analityczna 2",
  "Rachunek różniczkowy",
  "Optymalizacja",
  "Kombinatoryka",
  "Prawdopodobieństwo",
  "Stereometria 1",
  "Stereometria 2",
  "Powtórzenie 1",
  "Powtórzenie 2",
];

const LEVELS: Record<Level, { tab: string; infoTitle: string; scheduleTitle: string; short2: string; day: string; short: string; video: { id: string; poster: string } }> = {
  basic: { tab: "Matura Podstawowa", infoTitle: "kursie podstawowym", scheduleTitle: "kursu podstawowego", short2: "poziom podstawowy", day: "w poniedziałki", short: "Pon. 18:00", video: { id: "8fBZJu4RNss", poster: "/video/lekcja-poster.webp" } },
  extended: { tab: "Matura Rozszerzona", infoTitle: "kursie rozszerzonym", scheduleTitle: "kursu rozszerzonego", short2: "poziom rozszerzony", day: "we środy", short: "Śr. 18:00", video: { id: "C1xyYJieWOE", poster: "/video/matura-r-poster.webp" } },
};

function info(day: string) {
  return [
    "22 spotkania po 2 godziny – 44 godziny nauki",
    "45 zł za godzinę",
    `${day[0].toUpperCase()}${day.slice(1)} o 18:00, online na Teams`,
    "Nagrania i notatki przez cały kurs",
    "Zadanie domowe po każdej lekcji",
    "Materiały zgodne z wymaganiami CKE",
    "Nie możesz być na żywo? Obejrzysz nagranie",
    "Pomagamy też w zadaniach spoza kursu",
  ];
}

/** Hero + enrolment box + the two level tabs and everything that depends on the level. */
export function MaturaCourse() {
  const [level, setLevel] = useState<Level>("basic");
  const L = LEVELS[level];
  const pick = (l: Level) => {
    setLevel(l);
    track({ name: "cta_click", placement: "matura_tab", label: l });
  };
  return (
    <>
      <section id="start" aria-labelledby="mat-title" className="relative overflow-hidden text-white">
        <Image src="/images/matura-hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,26,26,0.7)]" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-[100px] pt-[168px] text-center">
          <h1 id="mat-title" className="text-[clamp(2.2rem,8.5vw,3.5rem)] font-bold leading-[1.15]">
            Matura <span className={ORANGE}>bez stresu</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-white/90 md:text-[1.2rem]">
            Wybierz poziom i przygotuj się spokojnie – krok po kroku, w małej grupie online.
          </p>
          <div role="tablist" aria-label="Poziom matury" className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            {(Object.keys(LEVELS) as Level[]).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={level === l}
                aria-controls="matura-level"
                onClick={() => pick(l)}
                className={`min-h-12 flex-1 rounded-full border-2 border-accent px-6 font-semibold transition-colors ${level === l ? "bg-accent text-night" : "bg-night/60 text-white hover:bg-night/80"}`}
              >
                {LEVELS[l].tab}
              </button>
            ))}
          </div>
        </div>
      </section>

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
            Zapisy na kurs maturalny <span className={ORANGE}>już otwarte!</span>
          </p>
          <a href="#zapisy" onClick={() => toQuiz("matura_enrol_banner")} className="btn btn-primary shrink-0">
            Zapisz się
          </a>
        </div>
      </section>

      <div id="matura-level" role="tabpanel" aria-label={L.tab}>
        <section aria-labelledby="mat-info" className="section-y bg-surface text-white">
          <div className="shell">
            <SectionHead kicker={L.short2} title="Najważniejsze informacje" accent={["informacje"]} id="mat-info" />
            <FactList items={info(L.day)} />
          </div>
        </section>

        <VideoLesson key={level} title="Przykładowy fragment lekcji" accent={["fragment", "lekcji"]} youtubeId={L.video.id} poster={L.video.poster} />

        <section aria-labelledby="mat-schedule" className="section-y bg-night text-white">
          <div className="shell">
            <SectionHead kicker="Program" title={`Terminarz ${L.scheduleTitle}`} accent={L.scheduleTitle.split(" ")} id="mat-schedule" key={`h-${level}`} />
            <CourseSchedule
            lessons={TOPICS}
            facts={[
              { value: "2 godziny", label: "jedno spotkanie" },
              { value: L.short, label: "online na żywo" },
              { value: "Teams", label: "+ nagrania i notatki" },
            ]}
            onCta={() => toQuiz("matura_schedule")}
          />
          </div>
        </section>

        <section id="cennik" aria-labelledby="mat-price" className="section-y scroll-mt-16 bg-surface text-white">
          <div className="shell">
            <SectionHead kicker="Cennik" title="Wybierz sposób płatności" accent={["płatności"]} id="mat-price" />
            <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
              <FadeUp className="h-full">
                <PriceCard name="Płatność w trakcie" price="45 zł" unit="za godzinę zajęć" note="Koszt rozłożony w czasie." cta="Zapisz się" onClick={() => toQuiz(`matura_${level}_single`)} />
              </FadeUp>
              <FadeUp delay={0.06} className="h-full">
                <PriceCard name="Cały kurs" badge="−10%" featured old="1980 zł" price="1780 zł" unit="płatność jednorazowa" note="Oszczędzasz 200 zł i masz pewne miejsce w grupie." cta="Wybieram z rabatem" onClick={() => toQuiz(`matura_${level}_full`)} />
              </FadeUp>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const HOW = [
  { art: "exam", title: "„Pewniaki maturalne”", text: "Typy zadań, które regularnie wracają na arkuszach CKE." },
  { art: "group", title: "Małe grupy", text: "Do 10 osób na Teams – każdy może zadać pytanie." },
  { art: "kor-homework", title: "Nagrania i prace domowe", text: "Nagranie dostępne 24/7, praca domowa po każdej lekcji." },
  { art: "kor-test", title: "Zgodnie z CKE", text: "Program zgodny z wymaganiami dla obu poziomów." },
];

export function MaturaHow() {
  return (
    <section aria-labelledby="mat-how" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead kicker="Jak uczymy" title="Jak wyglądają zajęcia?" accent={["zajęcia?"]} id="mat-how" />
        <FeatureList items={HOW} />
      </div>
    </section>
  );
}
