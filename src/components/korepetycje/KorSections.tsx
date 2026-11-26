"use client";

import Image from "next/image";
import { FadeUp, ImageReveal, RevealText } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { presetQuiz } from "@/components/sections/Offer";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { BRAND } from "@/config/brand";
import { KOR } from "@/data/korepetycje";
import { track } from "@/lib/ads/track";

/** Every "book" button on this page opens the quiz below, already set to 1:1 lessons. */
function toQuiz(placement: string) {
  presetQuiz("indiv");
  track({ name: "cta_click", placement, label: "quiz" });
}

export function KorHero() {
  const h = KOR.hero;
  return (
    <section id="start" aria-labelledby="kor-title" className="relative overflow-hidden bg-night text-white">
      <Image src={h.photo.src} alt="" fill priority sizes="100vw" className="object-cover object-[60%_55%]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,24,28,0.72)_0%,rgba(21,24,28,0.62)_45%,rgba(38,42,48,0.97)_100%)]" />
      <div className="shell relative flex min-h-[min(88svh,46rem)] flex-col items-center justify-center pb-14 pt-28 text-center">
        <p className="hero-rise text-[0.78rem] font-bold uppercase tracking-[0.22em] text-accent-bright">Lekcje 1-na-1 · ZOOM</p>
        <RevealText as="h1" id="kor-title" immediate text={h.title} accent={[...h.accent]} className="mt-4 max-w-3xl text-[clamp(2rem,8vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.03em]" />
        <p className="hero-rise mt-5 max-w-xl text-[1.02rem] leading-relaxed text-white/80 md:text-[1.12rem]" style={{ animationDelay: "0.2s" }}>
          {h.lead}
        </p>
        <div className="hero-rise mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center" style={{ animationDelay: "0.35s" }}>
          <a href="#cennik" className="btn btn-primary sm:flex-1" onClick={() => track({ name: "cta_click", placement: "kor_hero", label: "pricing" })}>
            {h.cta}
            <Icon name="arrow" size={18} />
          </a>
          <PhoneLink placement="kor_hero" className="btn btn-on-dark tabular-nums sm:flex-1">
            <Icon name="phone" size={18} className="text-accent" />
            {BRAND.phone}
          </PhoneLink>
        </div>
      </div>
    </section>
  );
}

export function KorLevels() {
  const l = KOR.levels;
  return (
    <section aria-labelledby="kor-levels" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead kicker="Korepetycje indywidualne" title={l.title} accent={l.accent} id="kor-levels" />
        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {l.items.map((it, i) => (
            <FadeUp as="li" soft key={it.label} delay={i * 0.06} className={`dtile flex items-center gap-4 px-5 py-4 ${i === l.items.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-accent/12 text-accent">
                <Icon name={it.icon} size={22} />
              </span>
              <span className="text-[1rem] font-semibold leading-snug">{it.label}</span>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function KorForWhom() {
  const f = KOR.forWhom;
  return (
    <section aria-labelledby="kor-who" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Dla kogo" title={f.title} accent={f.accent} lead={f.lead} id="kor-who" />
        <ul className="mx-auto mt-8 grid max-w-5xl gap-3 md:mt-12 md:grid-cols-2 md:gap-5">
          {f.items.map((b, i) => (
            <FadeUp as="li" soft key={b.title} delay={i * 0.08} className="dtile flex flex-col items-center px-6 py-7 text-center md:px-8 md:py-9">
              <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-accent/12 text-accent">
                <Icon name={b.icon} size={24} />
              </span>
              <h3 className="mt-4 text-[1.15rem] font-semibold">{b.title}</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-white/65">{b.text}</p>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function KorWhy() {
  const w = KOR.why;
  return (
    <section aria-labelledby="kor-why" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead kicker="Dlaczego 1-na-1" title={w.title} accent={w.accent} id="kor-why" />
        <div className="mx-auto mt-8 grid max-w-5xl items-center gap-8 md:mt-12 md:grid-cols-2 md:gap-12">
          <ImageReveal src={w.photo.src} alt={w.photo.alt} sizes="(min-width: 768px) 46vw, 92vw" className="aspect-square w-full rounded-[28px] border-2 border-accent" />
          <ol className="border-t border-accent">
            {w.points.map((b, i) => (
              <FadeUp as="li" key={b.title} delay={i * 0.08} className="flex gap-4 border-b border-accent py-5 md:py-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent/12 text-accent">
                  <Icon name={b.icon} size={20} />
                </span>
                <div>
                  <h3 className="text-[1.08rem] font-semibold leading-snug md:text-[1.15rem]">{b.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-white/65">{b.text}</p>
                </div>
              </FadeUp>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function KorPricing() {
  const p = KOR.pricing;
  return (
    <section id="cennik" aria-labelledby="kor-price" className="section-y scroll-mt-16 bg-surface text-white">
      <div className="shell">
        <SectionHead kicker="Ceny" title={p.title} accent={p.accent} id="kor-price" />
        <div className="mx-auto mt-8 grid max-w-6xl gap-4 md:mt-12 lg:grid-cols-3 lg:gap-5">
          {p.plans.map((pl, i) => (
            <FadeUp key={pl.id} delay={i * 0.08} className="dtile flex flex-col p-6 md:p-8">
              <h3 className="text-[1.2rem] font-semibold">{pl.name}</h3>
              <p className="mt-4 text-[2.6rem] font-bold leading-none tracking-tight text-accent-bright tabular-nums">{pl.price}</p>
              <p className="mt-2 text-[0.9rem] text-white/60">{pl.unit}</p>
              <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-white/70">{pl.text}</p>
              <a href="#zapisy" onClick={() => toQuiz(`kor_price_${pl.id}`)} className="btn btn-primary mt-6 w-full">
                {pl.cta}
                <Icon name="arrow" size={18} />
              </a>
            </FadeUp>
          ))}
          <FadeUp delay={0.16} className="relative flex flex-col rounded-[28px] border-2 border-accent bg-accent/[0.08] p-6 shadow-[0_24px_60px_-30px_rgba(255,165,80,0.6)] md:p-8">
            <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-[0.85rem] font-extrabold text-night">{p.pack.badge}</span>
            <h3 className="text-[1.2rem] font-semibold">{p.pack.name}</h3>
            <ul className="mt-4 space-y-3">
              {p.pack.rows.map((r) => (
                <li key={r.level}>
                  <p className="text-[0.85rem] text-white/60">{r.level}</p>
                  <p className="tabular-nums">
                    <s className="mr-2 text-[1rem] text-white/45">{r.old}</s>
                    <span className="text-[1.9rem] font-bold leading-none tracking-tight text-accent-bright">{r.price}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.9rem] text-white/60">{p.pack.unit}</p>
            <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-white/70">{p.pack.text}</p>
            <a href="#zapisy" onClick={() => toQuiz("kor_price_pack")} className="btn btn-primary mt-6 w-full">
              {p.pack.cta}
              <Icon name="arrow" size={18} />
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
