"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeUp, ImageReveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { FeatureList, WHITE } from "@/components/ui/Premium";
import { BRAND } from "@/config/brand";
import { OFFER } from "@/data/content";
import { track } from "@/lib/ads/track";

/** O nas – content from zdajmatme.com/o-nas, in the house style (dark sections, white tiles, orange borders). */

export function OnasHero() {
  return (
    <section id="start" aria-labelledby="onas-title" className="relative overflow-hidden text-white">
      <Image src="/images/o-nas-hero.webp" alt="" fill priority sizes="100vw" className="object-cover object-[60%_40%]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,24,28,0.72),rgba(21,24,28,0.8)_70%,var(--color-night))]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-[148px] text-center md:pb-24 md:pt-[180px]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-accent">O nas</p>
        <h1 id="onas-title" className="t-h1 mt-4">
          Szkoła stworzona z myślą o <span className="text-accent">uczniu</span>
        </h1>
        <p className="t-lead mt-4 max-w-xl text-white/80">
          Każdy uczeń ma inne potrzeby, cele i tempo nauki. Pomagamy znaleźć sposób, który naprawdę działa.
        </p>
        <a href="#zapisy" onClick={() => track({ name: "cta_click", placement: "onas_hero", label: "quiz" })} className="btn btn-primary mt-8">
          Umów pierwszą lekcję <Icon name="arrow" size={18} />
        </a>
      </div>
    </section>
  );
}

export function OnasStory() {
  return (
    <section aria-labelledby="onas-story" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Nasze podejście" title="Nauka, która zaczyna się od ucznia" accent={["ucznia"]} id="onas-story" />
        <div className="mx-auto mt-8 grid max-w-5xl items-center gap-8 md:mt-12 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
          <FadeUp className="mx-auto w-full max-w-[22rem] md:max-w-none">
            <div className="relative overflow-hidden rounded-[28px] border-2 border-accent shadow-[0_30px_70px_-35px_rgba(255,165,80,0.7)]">
              <Image src="/team/oliwia-o-nas.webp" alt={`${BRAND.owner.name} – założycielka ZdajMatme.com`} width={900} height={1350} sizes="(min-width: 768px) 40vw, 88vw" className="aspect-[4/5] w-full object-cover object-top" />
            </div>
          </FadeUp>
          <div>
            <FadeUp>
              <p className="t-lead text-white/85">
                Tworzymy miejsce, w którym matematyka przestaje być tylko kolejnym szkolnym obowiązkiem. Każdy uczeń dostaje indywidualne podejście, rozumie materiał i – przede wszystkim – wierzy, że naprawdę da radę.
              </p>
              <p className="mt-4 leading-relaxed text-white/65">
                Nie chodzi tylko o lepsze oceny. Chcemy, żeby uczeń wychodził z zajęć z poczuciem, że wie więcej, rozumie więcej i potrafi więcej, niż mu się wydawało.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <figure className={`${WHITE} mt-7 px-6 py-6 md:px-7`}>
                <span aria-hidden="true" className="absolute -top-3 left-5 text-[4.5rem] font-bold leading-none text-accent/30">„</span>
                <blockquote className="relative text-[0.98rem] leading-relaxed text-[#2b2f36]">
                  Zawsze zależało mi na tym, żeby matematyka była dla ucznia czymś więcej niż przedmiotem do zaliczenia. Bardzo często problem nie tkwi w braku zdolności, ale w tym, że materiał przedstawiono w sposób, który do kogoś po prostu nie trafia.
                </blockquote>
                <figcaption className="mt-4 border-t border-accent/30 pt-3">
                  <span className="block font-bold text-[#1e2228]">{BRAND.owner.name}</span>
                  <span className="block text-sm text-[#6b7078]">Założycielka ZdajMatme.com</span>
                </figcaption>
              </figure>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

const MISSION = [
  { art: "understand", title: "Przełamujemy strach", text: "Matematyka jest logiczna i zrozumiała – strach zastępujemy ciekawością." },
  { art: "confidence", title: "Wzmacniamy wiarę w siebie", text: "Każde samodzielnie rozwiązane zadanie to krok do dużej zmiany." },
  { art: "grades", title: "Realne wyniki", text: "Lepsze oceny i egzaminy to efekt prawdziwego zrozumienia materiału." },
  { art: "group", title: "Nauka z empatią", text: "Bez stresu i presji. Nie ma głupich pytań – każdy błąd czegoś uczy." },
];

export function OnasMission() {
  return (
    <section aria-labelledby="onas-mission" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead kicker="Nasza misja" title="Budujemy pewność siebie przez liczby" accent={["pewność", "siebie"]} lead="Nie „odbębniamy” materiału. Chcemy realnej zmiany w życiu ucznia." id="onas-mission" />
        <FeatureList items={MISSION} />
      </div>
    </section>
  );
}

export function OnasJoin() {
  return (
    <section aria-labelledby="onas-join" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Oferta" title="Dołącz do grona naszych uczniów!" accent={["naszych", "uczniów!"]} lead="Wybierz ścieżkę dla siebie." id="onas-join" />
        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 md:mt-12 md:grid-cols-3 md:gap-4">
          {OFFER.items.map((o, i) => (
            <FadeUp as="li" key={o.id} delay={i * 0.06}>
              <Link
                href={o.href}
                onClick={() => track({ name: "cta_click", placement: `onas_offer_${o.id}`, label: "subpage" })}
                className={`${WHITE} group flex h-full items-center gap-4 px-4 py-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:flex-col md:px-5 md:py-6 md:text-center`}
              >
                <ImageReveal src={o.photo.src} alt="" sizes="(min-width: 768px) 260px, 96px" className="aspect-square w-20 shrink-0 rounded-[16px] md:aspect-[4/3] md:w-full" />
                <span className="flex-1">
                  <span className="block text-[1.05rem] font-bold leading-snug">{o.title}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[0.9rem] font-semibold text-accent">
                    Zobacz <Icon name="arrow" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
