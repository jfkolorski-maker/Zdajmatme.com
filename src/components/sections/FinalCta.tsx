"use client";

import Image from "next/image";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { BRAND } from "@/config/brand";
import { FINAL_CTA } from "@/data/content";
import { PHOTOS } from "@/data/assets";
import { track } from "@/lib/ads/track";

/** 09 · Gotowy na zmianę? – big phone number (FLIPOR) + the person who answers it. */
export function FinalCta() {
  return (
    <section id="kontakt" aria-labelledby="final-title" className="section-y relative overflow-hidden bg-night text-white">
      <div className="shell relative text-center">
        <SectionHead chapter="kontakt" title={FINAL_CTA.title} accent={FINAL_CTA.accent} lead={FINAL_CTA.lead} id="final-title" />
        <FadeUp delay={0.12} className="mt-8 flex items-center justify-center gap-3">
          <span className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-accent/60">
            <Image src={PHOTOS.oliwia.src} alt={PHOTOS.oliwia.alt} fill sizes="56px" className="object-cover object-[50%_28%]" />
          </span>
          <span className="text-left">
            <span className="block font-semibold">{BRAND.owner.name}</span>
            <span className="block text-sm text-white/60">Założycielka · odbiera telefon</span>
          </span>
        </FadeUp>
        <FadeUp delay={0.18}>
          <PhoneLink placement="final_number" className="mt-5 inline-block text-[clamp(2.2rem,11vw,4.5rem)] font-bold tracking-tight text-white tabular-nums transition-colors hover:text-accent">
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
