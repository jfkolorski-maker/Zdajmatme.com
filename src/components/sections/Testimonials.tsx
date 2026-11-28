"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { EASE_OUT } from "@/lib/motion";
import { track } from "@/lib/ads/track";

/**
 * Opinie – real messages from parents and students (screenshots sent by the owner).
 * A deck of cards: one message on top, the next two peeking out behind it. Swipe / drag the top
 * card away (or use the arrows / dots) – it flies off like a shuffled card and the next one comes up.
 * Plays by itself every few seconds until the visitor touches it. One compact block, same on all screens.
 */
const OPINIONS = [
  {
    src: "/opinie/opinia-2.webp",
    w: 1100,
    h: 732,
    who: "Rodzic",
    alt: "Wiadomość od rodzica: Borys miał dziś sprawdzian z równań i dostał 5. Widać, że nabrał pewności siebie. Syn w końcu przestał się stresować matematyką.",
  },
  {
    src: "/opinie/opinia-7.webp",
    w: 852,
    h: 459,
    who: "Uczeń",
    alt: "Wiadomość od ucznia: Mega dobry korepetytor, świetnie tłumaczysz i w końcu nie stresuję się przed sprawdzianem. Dostałem 5!",
  },
  {
    src: "/opinie/opinia-4.webp",
    w: 775,
    h: 571,
    who: "Rodzic",
    alt: "Wiadomość od rodzica: Córka powiedziała, że pierwszy raz ktoś tak spokojnie i dokładnie wytłumaczył jej ułamki. Świetna współpraca i realne efekty.",
  },
  {
    src: "/opinie/opinia-6.webp",
    w: 1100,
    h: 779,
    who: "Rodzic",
    alt: "Wiadomość od rodzica: Moja córka dostała dziś 5 ze sprawdzianu z procentów. Jeszcze miesiąc temu miała z tym duży problem, a teraz widać ogromny postęp. Dziękujemy za cierpliwość i świetne podejście.",
  },
  {
    src: "/opinie/opinia-8.webp",
    w: 1100,
    h: 464,
    who: "Rodzic",
    alt: "Wiadomość od rodzica: Jesteśmy zachwyceni współpracą. Wszystko jest spokojnie i dokładnie tłumaczone, a Lena po zajęciach naprawdę wie, co robić.",
  },
  {
    src: "/opinie/opinia-3.webp",
    w: 700,
    h: 325,
    who: "Rodzic",
    alt: "Wiadomość od rodzica: Oliwier mówi, że w końcu rozumie funkcje i czuje się pewniej przed sprawdzianem.",
  },
  {
    src: "/opinie/opinia-9.webp",
    w: 1100,
    h: 479,
    who: "Rodzic",
    alt: "Wiadomość od rodzica: Dziękuję za świetne podejście do Igora. W końcu przestał stresować się matematyką i sam mówi, że zaczyna ją rozumieć. Widać ogromną różnicę.",
  },
  {
    src: "/opinie/opinia-5.webp",
    w: 941,
    h: 477,
    who: "Uczeń",
    alt: "Wiadomość od ucznia: Super zajęcia, wszystko w końcu rozumiem! Dzięki za cierpliwość.",
  },
  {
    src: "/opinie/opinia-10.webp",
    w: 1100,
    h: 372,
    who: "Rodzic",
    alt: "Wiadomość od rodzica: Antek mówi, że w końcu rozumie dział z ułamkami i czuje się dużo pewniej przed sprawdzianem.",
  },
];

const N = OPINIONS.length;
const AUTO_MS = 5200;
/** the cards behind the top one: offset, scale and tilt */
const BEHIND = [
  { y: 0, scale: 1, rotate: 0 },
  { y: 16, scale: 0.94, rotate: 3.6 },
  { y: 30, scale: 0.88, rotate: -4.2 },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState(false);
  const reduce = useReducedMotion();
  const deck = useRef<HTMLDivElement>(null);
  /** a drag must never end as a "tap to zoom" */
  const dragged = useRef(false);
  const inView = useInView(deck, { amount: 0.5 });

  const go = useCallback((d: 1 | -1) => {
    setDir(d);
    setIndex((i) => (i + d + N) % N);
  }, []);
  const user = (fn: () => void) => {
    setPaused(true);
    fn();
  };

  // gentle autoplay while the deck is on screen, until the first touch
  useEffect(() => {
    if (paused || !inView || reduce || zoom) return;
    const t = window.setTimeout(() => go(1), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, inView, reduce, zoom, go]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.documentElement.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 450;
    if (swipe) user(() => go(info.offset.x < 0 ? 1 : -1));
    window.setTimeout(() => (dragged.current = false), 60);
  };

  const cur = OPINIONS[index];

  return (
    <section id="opinie" aria-labelledby="opinie-title" className="section-y relative overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[55%] h-[55%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,165,80,0.14),transparent)] blur-2xl" />
      <div className="shell relative">
        <SectionHead chapter="opinie" title="Poznaj opinie naszych uczniów i rodziców" accent={["uczniów", "i", "rodziców"]} lead="Prawdziwe wiadomości, które dostajemy po zajęciach." id="opinie-title" />

        <FadeUp className="mx-auto mt-8 max-w-[34rem] md:mt-12">
          {/* the deck */}
          <div
            ref={deck}
            role="region"
            aria-roledescription="karuzela"
            aria-label="Opinie"
            className="relative mx-auto h-[clamp(15rem,64vw,21rem)] w-full"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") user(() => go(1));
              if (e.key === "ArrowLeft") user(() => go(-1));
            }}
          >
            {/* cards behind (static, no swipe) */}
            {[2, 1].map((k) => {
              const o = OPINIONS[(index + k) % N];
              const b = BEHIND[k];
              return (
                <motion.div
                  key={`behind-${k}`}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[24px] border-2 border-accent/70 bg-white p-2 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)]"
                  initial={false}
                  animate={{ y: b.y, scale: b.scale, rotate: b.rotate }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[16px] opacity-60">
                    <Image src={o.src} alt="" fill sizes="34rem" className="object-contain" />
                  </div>
                </motion.div>
              );
            })}

            {/* top card – drag it away */}
            <AnimatePresence initial={false} custom={dir}>
              <motion.figure
                key={cur.src}
                custom={dir}
                className="absolute inset-0 z-10 flex cursor-grab touch-pan-y flex-col rounded-[24px] border-2 border-accent bg-white p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85),0_18px_44px_-24px_rgba(255,165,80,0.75)] active:cursor-grabbing"
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.85}
                dragSnapToOrigin
                onDragStart={() => {
                  dragged.current = true;
                  setPaused(true);
                }}
                onDragEnd={onDragEnd}
                whileDrag={{ scale: 1.02 }}
                initial={reduce ? { opacity: 0 } : { y: BEHIND[1].y, scale: BEHIND[1].scale, rotate: BEHIND[1].rotate, opacity: 1 }}
                animate={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
                variants={{ out: (d: number) => (reduce ? { opacity: 0 } : { x: d * -420, y: 30, rotate: d * -16, opacity: 0, transition: { duration: 0.45, ease: EASE_OUT } }) }}
                exit="out"
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <span aria-hidden="true" className="absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-white bg-accent shadow-[0_4px_10px_-2px_rgba(0,0,0,0.5)]" />
                <button type="button" onClick={() => !dragged.current && user(() => setZoom(true))} className="relative min-h-0 flex-1 cursor-zoom-in overflow-hidden rounded-[16px]" aria-label={`Powiększ opinię: ${cur.alt}`}>
                  <Image src={cur.src} alt={cur.alt} fill sizes="(min-width: 640px) 34rem, 90vw" className="pointer-events-none select-none object-contain" draggable={false} />
                </button>
                <figcaption className="flex items-center justify-between px-1.5 pt-2 text-[0.78rem] font-semibold">
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[#b4600f]">{cur.who}</span>
                  <span className="text-muted">Przesuń · dotknij, by powiększyć</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* arrows + dots */}
          <div className="mt-9 flex items-center justify-center gap-4">
            <button type="button" onClick={() => user(() => go(-1))} aria-label="Poprzednia opinia" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-accent text-white transition-colors hover:bg-accent hover:text-night">
              <Icon name="back" size={18} />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-1.5" role="tablist" aria-label="Wybierz opinię">
              {OPINIONS.map((o, i) => (
                <button
                  key={o.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Opinia ${i + 1} z ${N}`}
                  onClick={() => user(() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  })}
                  className="grid h-6 place-items-center px-0.5"
                >
                  <span className={`block h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-accent" : "w-2 bg-white/30 hover:bg-white/60"}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => user(() => go(1))} aria-label="Następna opinia" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-accent text-white transition-colors hover:bg-accent hover:text-night">
              <Icon name="arrow" size={18} />
            </button>
          </div>
          <p className="mt-2 text-center text-sm tabular-nums text-white/50" aria-live="polite">
            {index + 1} / {N}
          </p>
        </FadeUp>

        <FadeUp className="mt-7 text-center">
          <a href="#zapisy" onClick={() => track({ name: "cta_click", placement: "opinions", label: "quiz" })} className="btn btn-primary !whitespace-normal">
            Umów pierwszą lekcję <Icon name="arrow" size={18} />
          </a>
        </FadeUp>
      </div>

      {/* zoom */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Opinia"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(12,14,17,0.88)] px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
          >
            <motion.figure
              key={cur.src}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="relative w-full max-w-3xl rounded-[24px] border-2 border-accent bg-white p-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={cur.src} alt={cur.alt} width={cur.w} height={cur.h} sizes="(min-width: 800px) 760px, 92vw" className="h-auto max-h-[72svh] w-full rounded-[16px] object-contain" />
              <figcaption className="flex items-center justify-between px-2 pt-3 text-sm text-surface">
                <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-[#b4600f]">{cur.who}</span>
                <span className="tabular-nums text-muted">
                  {index + 1} / {N}
                </span>
              </figcaption>
              <button type="button" onClick={() => setZoom(false)} aria-label="Zamknij" className="absolute -right-2 -top-3 grid h-11 w-11 place-items-center rounded-full bg-accent text-night shadow-lg">
                <Icon name="close" size={20} />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
