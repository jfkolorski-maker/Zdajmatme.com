"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useIntroDone } from "@/components/motion/Intro";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { BRAND } from "@/config/brand";
import { HERO, TRUST } from "@/data/content";
import { PHOTOS } from "@/data/assets";
import { track } from "@/lib/ads/track";

/** Phones: strong shade only at the bottom (copy + buttons). Desktop: even shade, copy centred (zdajmatme.com). */
export const HERO_SHADE =
  "bg-[linear-gradient(180deg,rgba(18,18,18,0.55)_0%,rgba(18,18,18,0.15)_18%,rgba(18,18,18,0.25)_45%,rgba(18,18,18,0.92)_100%)] md:bg-[linear-gradient(180deg,rgba(18,18,18,0.72)_0%,rgba(18,18,18,0.62)_60%,rgba(18,18,18,0.9)_100%)]";

/**
 * zdajmatme.com typewriter ("prosta" → "łatwa" → "intuicyjna"). The first word is server-rendered,
 * so the full headline is readable on the first paint (LCP) and without JavaScript. Off with reduced motion.
 */
function Typewriter({ words }: { words: readonly string[] }) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0;
    let i = words[0].length;
    let deleting = true;
    let t = 0;
    const tick = () => {
      const word = words[w];
      if (deleting) {
        i -= 1;
        setText(word.slice(0, i));
        if (i === 0) {
          deleting = false;
          w = (w + 1) % words.length;
        }
        t = window.setTimeout(tick, 70);
      } else {
        const next = words[w];
        i += 1;
        setText(next.slice(0, i));
        if (i === next.length) {
          deleting = true;
          t = window.setTimeout(tick, 1800);
        } else t = window.setTimeout(tick, 110);
      }
    };
    t = window.setTimeout(tick, 2600);
    return () => window.clearTimeout(t);
  }, [words]);
  return (
    <span className="inline-flex items-baseline whitespace-nowrap text-accent">
      {text}
      <span aria-hidden="true" className="caret ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] rounded-full bg-accent" />
    </span>
  );
}

export function Hero() {
  const ready = useIntroDone();
  const go = (delay: string) => ({ animationDelay: delay, animationPlayState: ready ? "running" : "paused" }) as const;
  return (
    <section id="start" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night text-white md:min-h-[44rem] md:justify-center">
      <div aria-hidden="true" className="absolute inset-0">
        <Image src={PHOTOS.hero.src} alt="" fill priority sizes="100vw" className="object-cover object-[50%_40%] md:object-[50%_32%]" />
        <div className={`absolute inset-0 ${HERO_SHADE}`} />
      </div>

      <div className="shell relative pb-5 pt-28 text-center [text-shadow:0_2px_18px_rgba(18,18,18,0.6)] md:pb-16 md:pt-32">
        <div className="mx-auto w-full max-w-[46rem]">
          {/* painted on the first frame (no JS needed) – the offer is readable before anything animates */}
          <h1 id="hero-title" aria-label={`${HERO.title} ${HERO.words[0]}`} className="font-bold leading-[1.08] tracking-[-0.03em] text-[clamp(2.1rem,9vw,4.2rem)]">
            <span className="block">{HERO.title}</span>
            <span className="block" aria-hidden="true">
              <Typewriter words={HERO.words} />
            </span>
          </h1>
          <p className="t-lead mx-auto mt-4 max-w-[36rem] text-white/85 md:mt-5">{HERO.lead}</p>

          <div style={go("0.15s")} className="hero-rise mx-auto mt-6 grid max-w-[24rem] gap-2.5 sm:max-w-[34rem] sm:grid-cols-2 md:mt-8 md:gap-3">
            <a href="#zapisy" className="btn btn-primary w-full" onClick={() => track({ name: "cta_click", placement: "hero", label: "quiz" })}>
              {HERO.ctaQuiz}
              <Icon name="arrow" size={18} />
            </a>
            <PhoneLink placement="hero" className="btn btn-on-dark w-full tabular-nums">
              <Icon name="phone" size={18} className="text-accent" />
              {BRAND.phone}
            </PhoneLink>
          </div>
          <p style={go("0.3s")} className="hero-rise kicker mt-4 whitespace-nowrap text-accent max-[400px]:text-[0.7rem] max-[400px]:tracking-[0.12em] md:mt-7">
            {HERO.eyebrow}
          </p>
          <div style={go("0.4s")} className="hero-rise">
            <ul className="mx-auto mt-2.5 flex max-w-[22rem] flex-wrap justify-center gap-x-3 gap-y-1 text-[0.8rem] text-white/80 sm:max-w-none sm:gap-x-4 sm:text-[0.88rem]">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-1 whitespace-nowrap">
                  <Icon name="check" size={13} strokeWidth={3} className="text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          {/* desktop: quiet cue into the offer (zdajmatme.com "Zobacz naszą ofertę") */}
          <a href="#oferta" style={go("0.7s")} className="hero-rise group mt-9 hidden flex-col items-center gap-2 text-[0.85rem] font-semibold text-white/60 transition-colors hover:text-white md:inline-flex" onClick={() => track({ name: "cta_click", placement: "hero", label: "offer_cue" })}>
            {HERO.cue}
            <span className="relative block h-9 w-px overflow-hidden bg-white/15">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
