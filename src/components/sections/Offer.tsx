"use client";

import { FadeUp, ImageReveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { OFFER, type OfferId } from "@/data/content";
import { track } from "@/lib/ads/track";

/** Each offer card pre-selects its answer in the quiz and jumps there. */
export const PRESET_EVENT = "zdajmatme:preset";
export function presetQuiz(offer: OfferId) {
  window.dispatchEvent(new CustomEvent(PRESET_EVENT, { detail: { offer } }));
}

/**
 * 02 · Wybierz ścieżkę – three paths from zdajmatme.com. Phones: native swipe rail with snap
 * (FLIPOR .rail, no scroll hijacking); desktop: three columns.
 */
export function Offer() {
  return (
    <section id="oferta" aria-labelledby="offer-title" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead chapter="oferta" title={OFFER.title} accent={OFFER.accent} id="offer-title" />
      </div>
      <ul className="rail no-scrollbar mt-8 md:mx-auto md:mt-12 md:!grid md:w-[var(--shell)] md:grid-cols-3 md:!gap-5 md:!overflow-visible md:!px-0">
        {OFFER.items.map((o, i) => (
          <li key={o.id} id={o.anchor} className="w-[82%] max-w-[22rem] scroll-mt-24 md:w-auto md:max-w-none">
            <FadeUp soft delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[28px] border-2 border-accent bg-white/[0.04] text-center shadow-[0_18px_40px_-24px_rgba(255,165,80,0.55)]">
                <ImageReveal src={o.photo.src} alt={o.photo.alt} delay={i * 0.06} sizes="(min-width: 768px) 30vw, 82vw" className="aspect-[4/3] w-full" />
                <div className="flex flex-1 flex-col px-5 pb-5 pt-5 md:px-6 md:pb-6">
                  <h3 className="t-h3">{o.title}</h3>
                  <p className="mt-2 flex-1 text-[0.98rem] leading-relaxed text-white/65">{o.text}</p>
                  <a
                    href="#zapisy"
                    onClick={() => {
                      presetQuiz(o.id);
                      track({ name: "cta_click", placement: `offer_${o.id}`, label: "quiz" });
                    }}
                    className="btn btn-primary mt-5 w-full"
                  >
                    {o.cta}
                    <Icon name="arrow" size={18} />
                  </a>
                </div>
              </article>
            </FadeUp>
          </li>
        ))}
      </ul>
      <p className="swipe-hint mt-4 flex items-center justify-center gap-1.5 text-sm text-white/50 md:hidden" aria-hidden="true">
        Przesuń <Icon name="arrow" size={15} />
      </p>
    </section>
  );
}
