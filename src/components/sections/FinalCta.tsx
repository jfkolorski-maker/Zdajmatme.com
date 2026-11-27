"use client";

import Image from "next/image";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { BRAND } from "@/config/brand";
import { FINAL_CTA } from "@/data/content";
import { track } from "@/lib/ads/track";

/** 09 · Gotowy na zmianę? – big phone number (FLIPOR) + the person who answers it. */
export function FinalCta() {
  return (
    <section id="kontakt" aria-labelledby="final-title" className="section-y relative overflow-hidden bg-night text-white">
      <div className="shell relative text-center">
        <SectionHead chapter="kontakt" title={FINAL_CTA.title} accent={FINAL_CTA.accent} lead={FINAL_CTA.lead} id="final-title" />
        <FadeUp delay={0.12} className="mt-9 flex flex-col items-center">
          <span className="relative block h-40 w-40 overflow-hidden rounded-full border-4 border-accent shadow-[0_0_0_8px_rgba(255,165,80,0.14),0_0_44px_-8px_rgba(255,165,80,0.6)] md:h-48 md:w-48">
            <Image src="/team/oliwia-kontakt.webp" alt={`${BRAND.owner.name} – założycielka ZdajMatme.com`} fill sizes="(min-width: 768px) 192px, 160px" className="object-cover" />
          </span>
          <span className="mt-4 block text-[1.25rem] font-semibold">{BRAND.owner.name}</span>
          <span className="block text-sm text-white/60">Założycielka · odbiera telefon</span>
        </FadeUp>
        <FadeUp delay={0.18}>
          <PhoneLink
            placement="final_number"
            className="phone-pulse mt-7 inline-flex items-center gap-3 rounded-full border-2 border-accent bg-accent/[0.06] px-7 py-3 text-[clamp(1.9rem,9.5vw,3.8rem)] font-bold tracking-tight text-white tabular-nums transition-colors hover:text-accent md:px-10 md:py-4"
          >
            <Icon name="phone" size={30} className="shrink-0 text-accent" />
            {BRAND.phone}
          </PhoneLink>
        </FadeUp>
        <FadeUp delay={0.24} className="mx-auto mt-6 flex max-w-[24rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <a href="#zapisy" className="btn btn-primary text-[1.02rem]" onClick={() => track({ name: "cta_click", placement: "final", label: "quiz" })}>
            {FINAL_CTA.ctaQuiz}
            <Icon name="arrow" size={18} />
          </a>
          <PhoneLink placement="final" className="btn btn-on-dark text-[1.02rem]">
            <Icon name="phone" size={19} className="text-accent" />
            {FINAL_CTA.ctaCall}
          </PhoneLink>
        </FadeUp>
      </div>
    </section>
  );
}
