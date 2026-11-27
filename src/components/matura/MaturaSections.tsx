"use client";

import Image from "next/image";
import { useState } from "react";
import { QuizArt } from "@/components/quiz/QuizArt";
import { presetQuiz } from "@/components/sections/Offer";
import { VideoLesson } from "@/components/sections/VideoLesson";
import { CourseSchedule } from "@/components/ui/CourseSchedule";
import { track } from "@/lib/ads/track";

/**
 * Transferred from zdajmatme.com/kurs-maturalny.php – same copy and the same two tabs (basic / extended),
 * in the house style of the other sub-pages (grey backgrounds, white tiles with orange borders,
 * schedule without dates). "Zapisz się" leads to the quiz at the bottom, preset to the matura course.
 */
const ORANGE = "text-[#FFA550]";
const sectionTitle = "text-center text-[clamp(1.9rem,6.5vw,2.6rem)] font-bold leading-tight text-white";

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

const LEVELS: Record<Level, { tab: string; infoTitle: string; scheduleTitle: string; day: string; short: string; video: { id: string; poster: string } }> = {
  basic: { tab: "Matura Podstawowa", infoTitle: "kursie podstawowym", scheduleTitle: "kursu podstawowego", day: "w poniedziałki", short: "Pon. 18:00", video: { id: "8fBZJu4RNss", poster: "/video/lekcja-poster.webp" } },
  extended: { tab: "Matura Rozszerzona", infoTitle: "kursie rozszerzonym", scheduleTitle: "kursu rozszerzonego", day: "we środy", short: "Śr. 18:00", video: { id: "C1xyYJieWOE", poster: "/video/matura-r-poster.webp" } },
};

function info(day: string) {
  return [
    "Kurs składa się z 22 spotkań po dwie godziny. Łącznie daje to 44 godzin nauki.",
    "Koszt jednej godziny to jedyne 45 zł.",
    `Zajęcia odbywają się online ${day} o godzinie 18:00.`,
    "Uczestnicy mają dostęp do notatek i filmów z zajęć przez czas trwania kursu.",
    "Po każdej lekcji otrzymujesz zadanie domowe - niezbędny element progresu.",
    "Materiały są opracowane na podstawie wymagań Centralnej Komisji Egzaminacyjnej.",
    "Nie ma obowiązku uczestnictwa w lekcji o określonej godzinie - zajęcia są nagrywane.",
    "Zawsze możesz zwrócić się do nas o pomoc w dowolnym zadaniu - nie tylko z kursu.",
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
            Nasz kurs to Twój sprawdzony plan na sukces. Wybierz poziom i rozpocznij przygotowania z najlepszymi.
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
        <section aria-labelledby="mat-info" className="bg-surface px-5 pb-14 pt-12 text-white md:pb-16 md:pt-14">
          <h2 id="mat-info" className={sectionTitle}>
            Najważniejsze informacje o <span className={ORANGE}>{L.infoTitle}</span>
          </h2>
          <ul className="mx-auto mt-8 grid max-w-5xl gap-2.5 md:grid-cols-2 md:gap-3">
            {info(L.day).map((t) => (
              <li key={t} className="rounded-[18px] border-2 border-accent bg-white px-5 py-3 text-[0.93rem] font-medium leading-snug text-night">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <VideoLesson key={level} title="Przykładowy fragment lekcji" accent={["fragment", "lekcji"]} youtubeId={L.video.id} poster={L.video.poster} />

        <section aria-labelledby="mat-schedule" className="bg-night px-5 py-16 text-white md:py-20">
          <h2 id="mat-schedule" className={sectionTitle}>
            Terminarz <span className={ORANGE}>{L.scheduleTitle}</span>
          </h2>
          <CourseSchedule
            lessons={TOPICS}
            facts={[
              { value: "2 godziny", label: "jedno spotkanie" },
              { value: L.short, label: "online na żywo" },
              { value: "Teams", label: "+ nagrania i notatki" },
            ]}
            onCta={() => toQuiz("matura_schedule")}
          />
        </section>

        <section id="cennik" aria-labelledby="mat-price" className="scroll-mt-16 bg-surface px-5 py-16 text-white md:py-20">
          <h2 id="mat-price" className={sectionTitle}>
            Cennik
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center rounded-[28px] border-2 border-accent bg-white px-7 py-10 text-center text-[#1a1a1a]">
              <h3 className="text-[1.4rem] font-semibold">Pojedyncza lekcja</h3>
              <p className="mt-6 text-[2.8rem] font-bold leading-none text-[#FFA550]">45 zł</p>
              <p className="mt-4 text-[1.05rem]">za 60 minutową lekcje w kursie maturalnym</p>
              <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-[#333]">Kompleksowe przygotowanie do matury. Elastyczna opcja pozwala rozłożyć koszt w czasie.</p>
              <a href="#zapisy" onClick={() => toQuiz(`matura_${level}_single`)} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-black px-8 font-semibold text-[#FFA550] transition-transform hover:-translate-y-0.5">
                Zapisz się
              </a>
            </div>
            <div className="relative flex flex-col items-center rounded-[28px] border-2 border-accent bg-white px-7 py-10 text-center text-[#1a1a1a] shadow-[0_24px_60px_-30px_rgba(255,165,80,0.7)]">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FFA550] px-4 py-1.5 text-[0.9rem] font-bold">Rabat 10%</span>
              <h3 className="text-[1.4rem] font-semibold">Jednorazowa opłata</h3>
              <p className="mt-6 flex items-baseline gap-3">
                <s className="text-[1.4rem] text-[#adb5bd]">1980 zł</s>
                <span className="text-[2.8rem] font-bold leading-none text-[#FFA550]">1780 zł</span>
              </p>
              <p className="mt-4 text-[1.05rem]">za cały kurs maturalny (22 lekcji)</p>
              <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-[#333]">
                Najlepsza oferta! Oszczędź <strong>200 zł</strong>, płacąc za cały kurs z góry i zapewnij sobie miejsce w grupie.
              </p>
              <a href="#zapisy" onClick={() => toQuiz(`matura_${level}_full`)} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#FFA550] px-8 font-semibold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
                Wybieram z rabatem
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const HOW = [
  { art: "exam", title: "„Pewniaki Maturalne”", text: "Skupiamy się na typach zadań, które regularnie pojawiają się na arkuszach CKE. Analizujemy schematy i strategie ich rozwiązywania." },
  { art: "group", title: "Małe, efektywne grupy", text: "Uczysz się w kameralnej, 10-osobowej grupie na Microsoft Teams. Każdy ma szansę zadać pytanie i aktywnie uczestniczyć w lekcji." },
  { art: "kor-homework", title: "Nagrania i prace domowe", text: "Po każdych zajęciach otrzymujesz pracę domową, a nagranie z lekcji jest dostępne 24/7, abyś mógł powtarzać materiał w swoim tempie." },
  { art: "kor-test", title: "Zgodność z CKE", text: "Nasz program jest w 100% zgodny z aktualnymi wymaganiami Centralnej Komisji Egzaminacyjnej dla obu poziomów matury." },
];

export function MaturaHow() {
  return (
    <section aria-labelledby="mat-how" className="bg-night px-5 py-16 text-white md:py-20">
      <h2 id="mat-how" className={sectionTitle}>
        Jak wyglądają zajęcia na <span className={ORANGE}>kursie maturalnym</span>?
      </h2>
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HOW.map((b) => (
          <div key={b.title} className="rounded-[28px] border-2 border-accent bg-white px-7 py-9 text-center text-black">
            <span className="tile-art mx-auto !h-20 !w-20 !rounded-[22px]">
              <QuizArt value={b.art} size={60} />
            </span>
            <h3 className="mt-5 text-[1.2rem] font-bold leading-snug">{b.title}</h3>
            <p className="mt-3 text-[0.96rem] leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
