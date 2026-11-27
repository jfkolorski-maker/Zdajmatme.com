"use client";

import Image from "next/image";
import { presetQuiz } from "@/components/sections/Offer";
import { CourseSchedule } from "@/components/ui/CourseSchedule";
import { track } from "@/lib/ads/track";

/**
 * Transferred from zdajmatme.com/kurs-osmoklasisty.php – same order and copy, already in the
 * house style of the "Korepetycje indywidualne" sub-page (grey backgrounds, orange borders).
 * "Zapisz się" leads to the quiz at the bottom of this page, preset to the 8th-grade course.
 */
const ORANGE = "text-[#FFA550]";
const sectionTitle = "text-center text-[clamp(1.9rem,6.5vw,2.6rem)] font-bold leading-tight text-white";

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
          Nasz kurs to sprawdzony sposób na sukces. Zobacz, jak w praktyce przygotowujemy do egzaminu, przerabiając setki zadań i budując strategie, które gwarantują wysoki wynik.
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
  "Kurs składa się z 22 spotkań. Pojedyncze spotkanie trwa 60 minut.",
  "Koszt jednej lekcji to jedyne 45 zł.",
  "Zajęcia odbywają się online w poniedziałki o godzinie 18:00.",
  "Uczestnicy mają dostęp do notatek i filmów z zajęć przez czas trwania kursu.",
  "Po każdej lekcji otrzymujesz zadanie domowe - niezbędny element progresu.",
  "Materiały są opracowane na podstawie wymagań Centralnej Komisji Egzaminacyjnej.",
  "Nie ma obowiązku uczestnictwa w lekcji o określonej godzinie - zajęcia są nagrywane.",
  "Zawsze możesz zwrócić się do nas o pomoc w dowolnym zadaniu - nie tylko z kursu.",
];

export function E8Info() {
  return (
    <section aria-labelledby="e8-info" className="bg-surface px-5 pb-14 pt-12 text-white md:pb-16 md:pt-14">
      <h2 id="e8-info" className={sectionTitle}>
        Najważniejsze informacje o <span className={ORANGE}>kursie</span>
      </h2>
      <ul className="mx-auto mt-8 grid max-w-5xl gap-2.5 md:grid-cols-2 md:gap-3">
        {INFO.map((t) => (
          <li key={t} className="rounded-[18px] border-2 border-accent bg-white px-5 py-3 text-[0.93rem] font-medium leading-snug text-night">
            {t}
          </li>
        ))}
      </ul>
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
    <section aria-labelledby="e8-schedule" className="bg-night px-5 py-16 text-white md:py-20">
      <h2 id="e8-schedule" className={sectionTitle}>
        Terminarz <span className={ORANGE}>kursu</span>
      </h2>
      <CourseSchedule
        lessons={LESSONS}
        facts={[
          { value: "60 min", label: "jedna lekcja" },
          { value: "Pon. 18:00", label: "online na żywo" },
          { value: "Teams", label: "+ nagrania i notatki" },
        ]}
        onCta={() => toQuiz("e8_schedule")}
      />
    </section>
  );
}

export function E8Pricing() {
  return (
    <section id="cennik" aria-labelledby="e8-price" className="scroll-mt-16 bg-surface px-5 py-16 text-white md:py-20">
      <h2 id="e8-price" className={sectionTitle}>
        Cennik
      </h2>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-[28px] border-2 border-accent bg-white px-7 py-10 text-center text-[#1a1a1a]">
          <h3 className="text-[1.4rem] font-semibold">Pojedyncza lekcja</h3>
          <p className="mt-6 text-[2.8rem] font-bold leading-none text-[#FFA550]">45 zł</p>
          <p className="mt-4 text-[1.05rem]">za 60 minutową lekcję w kursie</p>
          <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-[#333]">Kompleksowe przygotowanie do egzaminu. Elastyczna opcja pozwala rozłożyć koszt w czasie.</p>
          <a href="#zapisy" onClick={() => toQuiz("e8_price_single")} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-black px-8 font-semibold text-[#FFA550] transition-transform hover:-translate-y-0.5">
            Zapisz się
          </a>
        </div>
        <div className="relative flex flex-col items-center rounded-[28px] border-2 border-accent bg-white px-7 py-10 text-center text-[#1a1a1a] shadow-[0_24px_60px_-30px_rgba(255,165,80,0.7)]">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#FFA550] px-4 py-1.5 text-[0.9rem] font-bold">-10%</span>
          <h3 className="text-[1.4rem] font-semibold">Jednorazowa opłata</h3>
          <p className="mt-6 flex items-baseline gap-3">
            <s className="text-[1.4rem] text-[#adb5bd]">990 zł</s>
            <span className="text-[2.8rem] font-bold leading-none text-[#FFA550]">890 zł</span>
          </p>
          <p className="mt-4 text-[1.05rem]">za cały kurs (25 lekcji)</p>
          <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-[#333]">
            Najlepsza oferta! Oszczędź <strong>100 zł</strong>, płacąc za cały kurs z góry i zapewnij sobie miejsce w grupie.
          </p>
          <a href="#zapisy" onClick={() => toQuiz("e8_price_full")} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#FFA550] px-8 font-semibold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
            Wybieram z rabatem
          </a>
        </div>
      </div>
    </section>
  );
}
