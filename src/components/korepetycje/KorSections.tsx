"use client";

import Image from "next/image";
import { FadeUp, ImageReveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { presetQuiz } from "@/components/sections/Offer";
import { Icon } from "@/components/ui/icons";
import { OtherSubjects } from "@/components/ui/OtherSubjects";
import { FeatureList, PriceCard } from "@/components/ui/Premium";
import { track } from "@/lib/ads/track";

/**
 * Korepetycje indywidualne – content from zdajmatme.com/korepetycje-indywidualne.php, shortened for
 * Google Ads visitors and set in the premium sub-page language (dark cards, orange hairlines).
 * Every CTA leads to the quiz at the bottom, preset to 1:1 lessons.
 */
function toQuiz(placement: string) {
  presetQuiz("indiv");
  track({ name: "cta_click", placement, label: "quiz" });
}

export function KorHero() {
  return (
    <section id="start" aria-labelledby="kor-title" className="relative overflow-hidden text-white">
      <Image src="/images/kor-hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,24,28,0.75),rgba(21,24,28,0.82)_70%,var(--color-night))]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-[148px] text-center md:pb-24 md:pt-[180px]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-accent">Matematyka 1-na-1 · online</p>
        <h1 id="kor-title" className="t-h1 mt-4">
          Korepetycje indywidualne <span className="text-accent">online</span>
        </h1>
        <p className="t-lead mt-4 max-w-xl text-white/80">Cała lekcja tylko dla Ciebie – w Twoim tempie, z Twoim materiałem.</p>
        <p className="mt-5 inline-flex items-baseline gap-2 rounded-full border border-accent/50 bg-night/50 px-5 py-2 backdrop-blur">
          <span className="text-white/70">od</span>
          <span className="text-[1.35rem] font-semibold text-accent">110 zł</span>
          <span className="text-white/70">/ 60 min</span>
        </p>
        <div className="mt-7 flex w-full max-w-[24rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <a href="#zapisy" onClick={() => toQuiz("kor_hero")} className="btn btn-primary">
            Umów pierwszą lekcję <Icon name="arrow" size={18} />
          </a>
          <a href="#cennik" onClick={() => track({ name: "cta_click", placement: "kor_hero", label: "pricing" })} className="btn btn-on-dark">
            Zobacz cennik
          </a>
        </div>
      </div>
    </section>
  );
}

const LEVELS = ["Szkoła podstawowa", "Egzamin ósmoklasisty", "Liceum i technikum", "Matura podstawowa", "Matura rozszerzona"];

const BENEFITS = [
  { art: "grades", title: "Nadrobić zaległości", text: "Spokojnie uzupełnimy luki w materiale." },
  { art: "kor-test", title: "Przygotować się do sprawdzianu", text: "Kartkówka, test czy egzamin – skupiamy się na kluczowych zadaniach." },
  { art: "kor-homework", title: "Zrozumieć prace domowe", text: "Krok po kroku – jak dojść do wyniku." },
  { art: "confidence", title: "Wejść na wyższy poziom", text: "Konkursy i olimpiady dla pasjonatów." },
];

/** Levels (chips) + what the lessons help with – one section instead of two. */
export function KorForWhom() {
  return (
    <section aria-labelledby="kor-who" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead kicker="Dla kogo" title="Dla uczniów na każdym poziomie" accent={["każdym", "poziomie"]} id="kor-who" />
        <FadeUp delay={0.1}>
          <ul className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2">
            {LEVELS.map((t) => (
              <li key={t} className="rounded-full border-2 border-accent bg-white px-4 py-2 text-[0.88rem] font-semibold text-night">
                {t}
              </li>
            ))}
          </ul>
        </FadeUp>
        <FeatureList items={BENEFITS} />
        <FadeUp className="mt-6 md:mt-8">
          <OtherSubjects placement="kor_science" />
        </FadeUp>
      </div>
    </section>
  );
}

const WHY = [
  { icon: "eye", title: "Pełna uwaga", text: "Cała lekcja jest poświęcona Tobie i Twoim celom." },
  { icon: "monitor", title: "Elastyczny grafik", text: "Terminy dopasowujemy do Twojego planu, nie odwrotnie." },
  { icon: "thumb", title: "Wirtualna tablica", text: "Nauka online, która jest naprawdę angażująca." },
  { icon: "spark", title: "Bez stresu", text: "Przełamujemy strach przed matematyką." },
];

export function KorWhy() {
  return (
    <section aria-labelledby="kor-why" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Dlaczego 1-na-1" title="Pełna uwaga i elastyczność" accent={["elastyczność"]} id="kor-why" />
        <div className="mx-auto mt-8 grid max-w-5xl items-center gap-8 md:mt-12 md:grid-cols-2 md:gap-12">
          <ImageReveal src="/images/kor-uczen.webp" alt="Uczeń pracujący nad zadaniami z matematyki na laptopie" sizes="(min-width: 768px) 46vw, 92vw" className="aspect-[16/9] w-full rounded-[22px] md:aspect-square" />
          <ul className="border-t border-accent/40">
            {WHY.map((w, i) => (
              <FadeUp as="li" key={w.title} delay={i * 0.06} className="flex gap-4 border-b border-accent/40 py-4 md:py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent/12 text-accent">
                  <Icon name={w.icon} size={20} />
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-semibold leading-snug">{w.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-white/65">{w.text}</p>
                </div>
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function KorPricing() {
  return (
    <section id="cennik" aria-labelledby="kor-price" className="section-y scroll-mt-16 bg-night text-white">
      <div className="shell">
        <SectionHead kicker="Cennik" title="Prosto i przejrzyście" accent={["przejrzyście"]} lead="Lekcja trwa 60 minut. Rozliczamy się po każdym miesiącu." id="kor-price" />
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-5">
          <FadeUp className="h-full">
            <PriceCard name="Poziom podstawowy" price="110 zł" unit="za 60 minut" note="Regularna nauka lub doraźna pomoc." compact cta="Umów się" onClick={() => toQuiz("kor_price_basic")} />
          </FadeUp>
          <FadeUp delay={0.06} className="h-full">
            <PriceCard name="Poziom rozszerzony" price="125 zł" unit="za 60 minut" note="Matura rozszerzona i wymagające zadania." compact cta="Umów się" onClick={() => toQuiz("kor_price_extended")} />
          </FadeUp>
          <FadeUp delay={0.12} className="col-span-2 h-full md:col-span-1">
            <PriceCard name="Pakiet 10 lekcji" badge="−10%" featured cta="Wybieram pakiet" onClick={() => toQuiz("kor_price_pack")} note="Do wykorzystania na obu poziomach.">
              <ul className="mt-5 space-y-2 text-left">
                {[
                  ["Podstawowy", "1100 zł", "990 zł"],
                  ["Rozszerzony", "1250 zł", "1125 zł"],
                ].map(([lvl, old, now]) => (
                  <li key={lvl} className="flex items-center justify-between gap-3 rounded-[14px] bg-[#fff5e6] px-4 py-3">
                    <span className="text-[0.92rem] text-[#4a4f57]">{lvl}</span>
                    <span className="whitespace-nowrap">
                      <s className="mr-2 text-[0.82rem] text-[#adb5bd]">{old}</s>
                      <span className="text-[1.25rem] font-bold text-accent">{now}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.92rem] font-medium">10 lekcji po 60 minut</p>
            </PriceCard>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

