"use client";

import Image from "next/image";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { WHITE } from "@/components/ui/Premium";
import { BRAND } from "@/config/brand";
import { track } from "@/lib/ads/track";

/** Kontakt – from zdajmatme.com/kontakt: phone + e-mail (9:00–18:00), then the form (= the quiz below). */

export function KontaktHero() {
  return (
    <section id="start" aria-labelledby="kontakt-title" className="relative overflow-hidden text-white">
      <Image src="/images/kontakt-hero.webp" alt="" fill priority sizes="100vw" className="object-cover object-[30%_35%]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,24,28,0.72),rgba(21,24,28,0.82)_70%,var(--color-night))]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-[148px] text-center md:pb-24 md:pt-[180px]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-accent">Kontakt</p>
        <h1 id="kontakt-title" className="t-h1 mt-4">
          Umów się na <span className="text-accent">pierwszą lekcję</span>
        </h1>
        <p className="t-lead mt-4 max-w-xl text-white/80">Jesteśmy tu, aby Ci pomóc. Wybierz najwygodniejszą formę kontaktu.</p>
      </div>
    </section>
  );
}

export function KontaktDirect() {
  return (
    <section aria-labelledby="kontakt-direct" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Bezpośrednio" title="Zadzwoń lub napisz" accent={["napisz"]} lead="Wolisz rozmowę lub e-mail? Jesteśmy dostępni w godzinach 9:00–18:00." id="kontakt-direct" />
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:mt-12 md:grid-cols-2">
          <FadeUp className="h-full">
            <div className={`${WHITE} flex h-full flex-col items-center px-6 py-7 text-center`}>
              <span className="relative block h-20 w-20 overflow-hidden rounded-full border-[3px] border-accent shadow-[0_0_0_6px_rgba(255,165,80,0.15)]">
                <Image src="/team/oliwia-kontakt.webp" alt={BRAND.owner.name} fill sizes="80px" className="object-cover" />
              </span>
              <h3 className="mt-3 text-[0.78rem] font-bold uppercase tracking-[0.22em] text-[#6b7078]">Telefon</h3>
              <p className="mt-1 text-sm text-[#4a4f57]">Odbiera {BRAND.owner.name}</p>
              <PhoneLink
                placement="kontakt_page"
                className="phone-pulse mt-4 inline-flex items-center gap-2.5 rounded-full border-2 border-accent bg-white px-6 py-3 text-[1.6rem] font-bold tabular-nums text-[#1e2228] transition-colors hover:bg-accent"
              >
                <Icon name="phone" size={22} className="text-accent" />
                {BRAND.phone}
              </PhoneLink>
            </div>
          </FadeUp>
          <FadeUp delay={0.06} className="h-full">
            <div className={`${WHITE} flex h-full flex-col items-center justify-center px-6 py-7 text-center`}>
              <span className="tile-art !h-20 !w-20 !rounded-full">
                <Icon name="mail" size={34} className="text-accent" />
              </span>
              <h3 className="mt-3 text-[0.78rem] font-bold uppercase tracking-[0.22em] text-[#6b7078]">E-mail</h3>
              <p className="mt-1 text-sm text-[#4a4f57]">Napisz w dowolnej sprawie</p>
              <a
                href={`mailto:${BRAND.email}`}
                onClick={() => track({ name: "cta_click", placement: "kontakt_page", label: "email" })}
                className="mt-4 inline-flex min-h-12 max-w-full items-center break-all rounded-full border-2 border-accent px-5 text-[1rem] font-semibold text-[#1e2228] transition-colors hover:bg-accent"
              >
                {BRAND.email}
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
