"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";
import { track } from "@/lib/ads/track";

/**
 * Opinie – real messages from parents and students (screenshots sent by the owner).
 * Cards in white frames with the orange border, "scattered" (slight tilts) like notes on a desk;
 * a tap opens the message large. Phones: swipe rail; desktop: masonry.
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

/** gentle, irregular tilts – "scattered", never messy */
const TILT = [-2.2, 1.6, -1.1, 2.1, -1.7, 1.2, -2.4, 1.8, -0.9];

function Card({
  o,
  i,
  onOpen,
  rail = false,
}: {
  o: (typeof OPINIONS)[number];
  i: number;
  onOpen: (i: number) => void;
  rail?: boolean;
}) {
  const reduce = useReducedMotion();
  const tilt = reduce ? 0 : TILT[i % TILT.length] * (rail ? 0.6 : 1);
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(i)}
      aria-label={`Powiększ opinię: ${o.alt}`}
      // phones (swipe rail): no entrance / hover motion – cards entering from the side must not jump
      initial={rail || reduce ? false : { opacity: 0, y: 26, rotate: 0 }}
      animate={rail ? { rotate: tilt } : undefined}
      whileInView={rail ? undefined : { opacity: 1, y: 0, rotate: tilt }}
      viewport={VIEWPORT}
      whileHover={
        rail || reduce ? undefined : { rotate: 0, scale: 1.035, y: -4, zIndex: 10 }
      }
      transition={{
        duration: 0.7,
        ease: EASE_OUT,
        delay: rail ? 0 : (i % 3) * 0.08,
      }}
      className="group relative block w-full cursor-zoom-in rounded-[22px] border-2 border-accent bg-white p-2 text-left shadow-[0_24px_50px_-28px_rgba(0,0,0,0.75),0_14px_34px_-22px_rgba(255,165,80,0.7)] md:p-2.5"
    >
      {/* a small "pin" – like a note on a board */}
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-white bg-accent shadow-[0_4px_10px_-2px_rgba(0,0,0,0.5)]"
      />
      <Image
        src={o.src}
        alt={o.alt}
        width={o.w}
        height={o.h}
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 86vw"
        className="h-auto w-full rounded-[14px]"
      />
      <span className="flex items-center justify-between px-1.5 pb-0.5 pt-2.5 text-[0.78rem] font-semibold">
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[#b4600f]">
          {o.who}
        </span>
        <span className="inline-flex items-center gap-1 text-muted transition-colors group-hover:text-accent">
          <Icon name="plus" size={14} /> Powiększ
        </span>
      </span>
    </motion.button>
  );
}

export function Testimonials() {
  const [open, setOpen] = useState<number | null>(null);
  const show = useCallback((i: number) => {
    setOpen(i);
    track({
      name: "cta_click",
      placement: "opinion_open",
      label: String(i + 1),
    });
  }, []);
  const step = useCallback(
    (d: number) =>
      setOpen((o) =>
        o === null ? o : (o + d + OPINIONS.length) % OPINIONS.length,
      ),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.documentElement.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const cur = open === null ? null : OPINIONS[open];

  return (
    <section
      id="opinie"
      aria-labelledby="opinie-title"
      className="section-y relative overflow-hidden bg-night text-white"
    >
      {/* warm glow behind the "desk" */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,165,80,0.12),transparent)] blur-2xl"
      />
      <div className="shell relative">
        <SectionHead
          chapter="opinie"
          title="Poznaj opinie naszych uczniów i rodziców"
          accent={["uczniów", "i", "rodziców"]}
          lead="Prawdziwe wiadomości, które dostajemy po zajęciach."
          id="opinie-title"
        />
      </div>

      {/* phones: swipe rail */}
      <FadeUp className="md:hidden">
        <ul className="rail no-scrollbar relative mt-8 !gap-4 pb-6 pt-4">
          {OPINIONS.map((o, i) => (
            <li key={o.src} className="w-[84%] max-w-[22rem]">
              <Card o={o} i={i} onOpen={show} rail />
            </li>
          ))}
        </ul>
        <p
          className="swipe-hint flex items-center justify-center gap-1.5 text-sm text-white/50 md:hidden"
          aria-hidden="true"
        >
          Przesuń <Icon name="arrow" size={15} />
        </p>
      </FadeUp>

      {/* tablet / desktop: scattered masonry */}
      <div className="shell relative hidden md:block">
        <ul className="mx-auto mt-14 max-w-6xl columns-2 gap-x-8 lg:columns-3 lg:gap-x-10">
          {OPINIONS.map((o, i) => (
            <li key={o.src} className="mb-10 break-inside-avoid px-1">
              <Card o={o} i={i} onOpen={show} />
            </li>
          ))}
        </ul>
      </div>

      <FadeUp className="relative mt-4 text-center md:mt-2">
        <a
          href="#zapisy"
          onClick={() =>
            track({ name: "cta_click", placement: "opinions", label: "quiz" })
          }
          className="btn btn-primary"
        >
          Dołącz do nich – umów pierwszą lekcję <Icon name="arrow" size={18} />
        </a>
      </FadeUp>

      {/* lightbox */}
      <AnimatePresence>
        {cur && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Opinia"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(12,14,17,0.88)] px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure
              key={cur.src}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="relative w-full max-w-3xl rounded-[24px] border-2 border-accent bg-white p-2.5 shadow-[0_40px_120px_-30px_rgba(255,165,80,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={cur.src}
                alt={cur.alt}
                width={cur.w}
                height={cur.h}
                sizes="(min-width: 800px) 760px, 92vw"
                className="h-auto max-h-[72svh] w-full rounded-[16px] object-contain"
              />
              <figcaption className="flex items-center justify-between gap-3 px-2 pt-3 text-sm text-surface">
                <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-[#b4600f]">
                  {cur.who}
                </span>
                <span className="tabular-nums text-muted">
                  {open! + 1} / {OPINIONS.length}
                </span>
              </figcaption>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Zamknij"
                className="absolute -right-2 -top-3 grid h-11 w-11 place-items-center rounded-full bg-accent text-night shadow-lg"
              >
                <Icon name="close" size={20} />
              </button>
            </motion.figure>
            <button
              type="button"
              onClick={(e) => (e.stopPropagation(), step(-1))}
              aria-label="Poprzednia opinia"
              className="absolute bottom-6 left-1/2 grid h-12 w-12 -translate-x-[calc(100%+8px)] place-items-center rounded-full border-2 border-accent bg-night text-white md:bottom-auto md:left-6 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2"
            >
              <Icon name="back" size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => (e.stopPropagation(), step(1))}
              aria-label="Następna opinia"
              className="absolute bottom-6 left-1/2 grid h-12 w-12 translate-x-2 place-items-center rounded-full border-2 border-accent bg-night text-white md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
            >
              <Icon name="arrow" size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
