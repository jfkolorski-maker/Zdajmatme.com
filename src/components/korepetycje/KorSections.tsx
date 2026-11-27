"use client";

import Image from "next/image";
import { QuizArt } from "@/components/quiz/QuizArt";
import { presetQuiz } from "@/components/sections/Offer";
import { track } from "@/lib/ads/track";

/**
 * Transferred from zdajmatme.com/korepetycje-indywidualne.php – same order and copy; restyled step by step to match the home page
 * (dark sections, white cards, pill tags, black/orange buttons). To be reworked later to match the new home page.
 * "Umów się teraz" leads to the quiz at the bottom of this page (on the old site: contact form), preset to 1:1 lessons.
 */
const ORANGE = "text-[#FFA550]";
const sectionTitle = "text-center text-[clamp(1.9rem,6.5vw,2.6rem)] font-bold leading-tight text-white";

function toQuiz(placement: string) {
  presetQuiz("indiv");
  track({ name: "cta_click", placement, label: "quiz" });
}

const svg = { width: 44, height: 44, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export function KorHero() {
  return (
    <section id="start" aria-labelledby="kor-title" className="relative overflow-hidden text-white">
      <Image src="/images/kor-hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(26,26,26,0.7)]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-[100px] pt-[168px] text-center">
        <h1 id="kor-title" className="text-[clamp(2.2rem,8.5vw,3.5rem)] font-bold leading-[1.15]">
          Indywidualne korepetycje online
        </h1>
        <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-white/90 md:text-[1.25rem]">
          Pełne skupienie tylko na Tobie. Zajęcia jeden na jeden to najlepszy sposób na dopasowanie tempa i materiału do ucznia.
        </p>
        <a
          href="#cennik"
          onClick={() => track({ name: "cta_click", placement: "kor_hero", label: "pricing" })}
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#FFA550] px-9 text-[1.1rem] font-semibold text-[#1a1a1a] transition-transform hover:-translate-y-0.5"
        >
          Sprawdź cennik
        </a>
      </div>
    </section>
  );
}

export function KorLevels() {
  const items = ["Przygotowanie do egzaminu ósmoklasisty", "Szkoła podstawowa", "Szkoła ponadpodstawowa", "Przygotowanie do matury podstawowej", "Przygotowanie do matury rozszerzonej"];
  return (
    <section aria-labelledby="kor-levels" className="bg-surface px-5 py-16 text-white md:py-20">
      <h2 id="kor-levels" className={sectionTitle}>
        Dla uczniów na <span className={ORANGE}>każdym poziomie</span>
      </h2>
      <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
        {items.map((t) => (
          <li key={t} className="flex min-h-11 w-full items-center justify-center rounded-full border-2 border-accent bg-white/[0.04] px-5 py-2.5 text-center text-[0.8rem] font-semibold uppercase tracking-[0.08em] sm:w-auto">
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

const BENEFITS = [
  {
    title: "Nadrobić zaległości",
    text: "Spokojnie i we własnym tempie uzupełnimy luki w materiale, abyś poczuł/a się pewnie na każdej lekcji w szkole.",
    art: "grades",
  },
  {
    title: "Przygotować się do sprawdzianu",
    text: "Intensywnie przerobimy materiał przed ważnym testem, kartkówką czy egzaminem, skupiając się na kluczowych zadaniach.",
    art: "kor-test",
  },
  {
    title: "Odrabiać prace domowe",
    text: "Zapewniamy regularne wsparcie w rozwiązywaniu zadań domowych, tłumacząc krok po kroku, jak dojść do prawidłowego wyniku.",
    art: "kor-homework",
  },
  {
    title: "Rozwinąć swoje umiejętności",
    text: "Jeśli matematyka to Twoja pasja, pomożemy Ci wejść na wyższy poziom i przygotować się do konkursów i olimpiad.",
    art: "confidence",
  },
];

export function KorForWhom() {
  return (
    <section aria-labelledby="kor-who" className="bg-night px-5 py-16 text-white md:py-20">
      <h2 id="kor-who" className={sectionTitle}>
        Dla kogo są te <span className={ORANGE}>zajęcia</span>?
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-center text-[1.05rem] leading-relaxed text-white/90">Dla uczniów szkół podstawowych i średnich - na każdym poziom zaawansowania. Pomagamy:</p>
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-[28px] border-2 border-accent bg-white px-7 py-9 text-center text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            <span className="tile-art mx-auto !h-20 !w-20 !rounded-[22px]">
              <QuizArt value={b.art} size={60} />
            </span>
            <h3 className="mt-5 text-[1.25rem] font-bold leading-snug">{b.title}</h3>
            <p className="mt-3 text-[0.98rem] leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const WHY = [
  {
    lead: "Indywidualne podejście:",
    body: (
      <>
        Cała lekcja jest <span className={ORANGE}>poświęcona Tobie</span>. Skupiamy się na Twoich problemach i celach.
      </>
    ),
    d: ["M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", "M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"],
  },
  {
    lead: "Elastyczny grafik:",
    body: (
      <>
        Terminy lekcji <span className={ORANGE}>dopasowujemy</span> do Twojego planu zajęć, a nie na odwrót.
      </>
    ),
    d: ["M12.5 21h-7.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v5", "M16 3v4", "M8 3v4", "M4 11h16", "M16 19h6", "M19 16v6"],
  },
  {
    lead: "Nowoczesne narzędzia:",
    body: (
      <>
        Uczymy z wykorzystaniem <span className={ORANGE}>wirtualnej tablicy</span>, dzięki czemu nauka jest efektywna i angażująca.
      </>
    ),
    d: ["M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a1 1 0 0 1 -1 -1"],
  },
  {
    lead: "Budowanie pewności siebie:",
    body: (
      <>
        W atmosferze bez stresu i presji <span className={ORANGE}>przełamujemy strach</span> przed matematyką.
      </>
    ),
    d: ["M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6", "M16 3v4", "M8 3v4", "M4 11h16", "M15 19l2 2l4 -4"],
  },
];

export function KorWhy() {
  return (
    <section aria-labelledby="kor-why" className="bg-night px-5 py-16 text-white md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <Image src="/images/kor-uczen.webp" alt="Uczeń pracujący nad zadaniami z matematyki na laptopie" width={1200} height={1200} sizes="(min-width: 768px) 46vw, 92vw" className="w-full rounded-lg" />
        <div>
          <h2 id="kor-why" className="text-center text-[clamp(1.9rem,6.5vw,2.6rem)] font-bold leading-tight md:text-left">
            Pełna uwaga i <span className={ORANGE}>elastyczność</span>
          </h2>
          <ul className="mt-8 space-y-7">
            {WHY.map((w) => (
              <li key={w.lead} className="flex gap-4 text-[1.02rem] leading-relaxed">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFF5E6] ${ORANGE}`}>
                  <svg {...svg} width={22} height={22}>
                    {w.d.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                <div>
                  <strong>{w.lead}</strong> {w.body}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const blackBtn = "mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-black px-8 font-semibold text-[#FFA550] transition-transform hover:-translate-y-0.5";

export function KorPricing() {
  const plans = [
    { id: "basic", name: "Poziom podstawowy", price: "110 zł", text: "Indywidualne zajęcia dopasowane do poziomu ucznia, jego potrzeb i aktualnych celów. Idealna opcja zarówno na regularną naukę, jak i doraźną pomoc." },
    { id: "extended", name: "Poziom rozszerzony", price: "125 zł", text: "Indywidualne zajęcia dla uczniów, którzy chcą dobrze przygotować się do matury rozszerzonej, uporządkować materiał i swobodniej radzić sobie z wymagającymi zadaniami." },
  ];
  return (
    <section id="cennik" aria-labelledby="kor-price" className="scroll-mt-16 bg-surface px-5 py-16 text-white md:py-20">
      <h2 id="kor-price" className={sectionTitle}>
        Cennik
      </h2>
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className="flex flex-col items-center rounded-[28px] border-2 border-accent bg-white px-7 py-10 text-center text-[#1a1a1a]">
            <h3 className="text-[1.4rem] font-semibold">{p.name}</h3>
            <p className="mt-6 text-[2.8rem] font-bold leading-none text-[#FFA550]">{p.price}</p>
            <p className="mt-4 text-[1.05rem]">za 60 minut korepetycji online</p>
            <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-[#333]">{p.text}</p>
            <a href="#zapisy" onClick={() => toQuiz(`kor_price_${p.id}`)} className={blackBtn}>
              Umów się teraz
            </a>
          </div>
        ))}
        <div className="relative flex flex-col items-center rounded-[28px] border-2 border-accent bg-white px-7 py-10 text-center text-[#1a1a1a]">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#FFA550] px-4 py-1.5 text-[0.9rem] font-bold">-10%</span>
          <h3 className="text-[1.4rem] font-semibold">Pakiet 10 lekcji</h3>
          <ul className="mt-5 w-full space-y-3">
            {[
              ["Poziom podstawowy", "1100 zł", "990 zł"],
              ["Poziom rozszerzony", "1250 zł", "1125 zł"],
            ].map(([lvl, old, now]) => (
              <li key={lvl} className="flex items-center justify-between gap-3 rounded-md bg-[#FFF5E6] px-4 py-3 text-left">
                <span className="text-[0.95rem] text-[#555]">{lvl}</span>
                <span className="whitespace-nowrap">
                  <s className="mr-2 text-[0.85rem] text-[#adb5bd]">{old}</s>
                  <span className="text-[1.25rem] font-bold text-[#FFA550]">{now}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[1.05rem]">10 spotkań po 60 minut online</p>
          <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-[#333]">
            Wybierz pakiet i zaplanuj naukę na dłużej, korzystając z 10% rabatu. Pakiet może być wykorzystany zarówno na zajęciach na poziomie podstawowym, jak i rozszerzonym.
          </p>
          <a href="#zapisy" onClick={() => toQuiz("kor_price_pack")} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#FFA550] px-8 font-semibold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
            Wybieram pakiet
          </a>
        </div>
      </div>
    </section>
  );
}
