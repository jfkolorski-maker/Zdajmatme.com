"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { PROCESS } from "@/data/content";
import { track as trackEvent } from "@/lib/ads/track";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { StepArt } from "./StepArt";

/** Stage number in the top-left corner of the film – changes with the stage. */
const N = PROCESS.length;
/** One crossfade length for every scene change – the sequence breathes at one pace. */
const FADE = 0.9;

const desktopQuery = "(min-width: 1024px)";
function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(desktopQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(desktopQuery).matches,
    () => false,
  );
}

/**
 * The four stages of teaching (zdajmatme.com), told as one story.
 * Desktop: a pinned stage – story bars fill with the scroll, the clips
 * crossfade, the text follows in the same rhythm (≈ 4 screens, no scroll-jacking).
 * Mobile: its own layout – "stories": one full-width film that advances by
 * itself, tap / swipe to move. Only one layout is rendered, so no video loads twice.
 */
export function Process() {
  const desktop = useDesktop();
  return (
    <section id="proces" aria-labelledby="process-title" className="section-y relative bg-surface text-white">
      <div className="shell">
        <SectionHead chapter="proces" title="Poznaj nasz proces nauczania" accent={["proces", "nauczania"]} lead="Cztery kroki: od pierwszej lekcji do pewności siebie." id="process-title" />
      </div>
      {desktop ? <Stage /> : <Stories />}
    </section>
  );
}

/* ───────────────────────── shared film layer ───────────────────────── */

/** Illustrated stage (ZdajMatme has no step films – no fake footage). */
function FilmLayer({ i }: { i: number }) {
  const photo = PROCESS[i].photo;
  if (photo)
    return (
      <div className="absolute inset-0 bg-[#1f2226]">
        {/* square artwork pinned to the top; on phones the copy sits over its lower edge */}
        <div className="absolute inset-x-0 top-0 aspect-square">
          <Image src={photo} alt={PROCESS[i].alt ?? ""} fill sizes="(min-width: 1024px) 40vw, 92vw" className="object-cover" />
        </div>
      </div>
    );
  return (
    <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#3a4048_0%,#262a30_70%)]">
      <div aria-hidden="true" className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-x-[12%] top-[12%] h-[44%]">
        <StepArt step={i} />
      </div>
    </div>
  );
}

function QuoteLink({ placement, className = "" }: { placement: string; className?: string }) {
  return (
    <a href="#zapisy" className={`btn btn-primary ${className}`} onClick={() => trackEvent({ name: "cta_click", placement, label: "quiz" })}>
      Umów pierwszą lekcję <Icon name="arrow" size={18} />
    </a>
  );
}

/* ───────────────────────── mobile: swipe rail ───────────────────────── */

/**
 * Phones: the four stages as a native swipe rail with snap (same pattern as the offer),
 * compact cards – picture, title, one sentence. No scroll hijacking, ~1 screen tall.
 */
function Stories() {
  return (
    <FadeUp className="mt-8">
      <ol className="rail no-scrollbar">
        {PROCESS.map((p) => (
          <li key={p.stage} className="w-[78%] max-w-[20rem]">
              <article className="flex h-full flex-col overflow-hidden rounded-[28px] border-2 border-accent bg-white/[0.04] shadow-[0_18px_40px_-24px_rgba(255,165,80,0.55)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1f2226]">
                  {p.photo && <Image src={p.photo} alt={p.alt ?? ""} fill sizes="78vw" className="object-cover object-top" />}
                </div>
                <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
                  <h3 className="text-[1.2rem] font-bold leading-tight tracking-[-0.02em]">{p.stage}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-white/65">{p.text}</p>
                </div>
              </article>
          </li>
        ))}
      </ol>
      <p className="swipe-hint mt-4 flex items-center justify-center gap-1.5 text-sm text-white/50" aria-hidden="true">
        Przesuń <Icon name="arrow" size={15} />
      </p>
      <div className="shell mt-6 flex flex-col items-center">
        <QuoteLink placement="process_mobile" className="w-full max-w-[24rem]" />
      </div>
    </FadeUp>
  );
}

/* ───────────────────────── desktop: pinned stage ───────────────────────── */

function Stage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const steps = useTransform(scrollYProgress, (v) => Math.min(N, Math.max(0, v * N)));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((cur) => (cur === next ? cur : next));
  });


  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const k = Math.min(N - 1, Math.max(0, i));
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + range * ((k + 0.3) / N), behavior: reduce ? "auto" : "smooth" });
  };

  const s = PROCESS[active];

  return (
    <div ref={trackRef} className="relative mt-12" style={{ height: `${N * 80 + 20}vh` }}>
      <div className="sticky top-[68px] flex h-[calc(100vh-68px)] items-center">
        <div className="shell grid grid-cols-12 items-center gap-14">
          {/* text column */}
          <div className="col-span-5">
            <div className="flex gap-1.5" role="tablist" aria-label="Etapy">
              {PROCESS.map((p, i) => (
                <Bar key={p.stage} i={i} steps={steps} label={p.stage} selected={i === active} onClick={() => goTo(i)} />
              ))}
            </div>
            <div className="relative mt-10 min-h-[17rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active} initial="in" animate="show" exit="out" variants={{ in: {}, show: { transition: { staggerChildren: 0.07 } }, out: {} }}>
                  <motion.h3
                    className="text-[clamp(2rem,2.9vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-accent-bright text-balance"
                    variants={{ in: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }, out: { opacity: 0, y: -10, transition: { duration: 0.22 } } }}
                  >
                    {s.stage}
                  </motion.h3>
                  <motion.p
                    className="t-lead mt-3 max-w-md text-white/65"
                    variants={{ in: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }, out: { opacity: 0, transition: { duration: 0.2 } } }}
                  >
                    {s.text}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-8 flex items-center gap-5">
              <QuoteLink placement="process_desktop" />
            </div>
          </div>

          {/* film column */}
          <div className="col-span-7">
            <div className="relative mx-auto aspect-square w-[min(100%,calc((100vh-68px)*0.84))] overflow-hidden rounded-[28px] border-2 border-accent bg-surface">
              {PROCESS.map((f, i) => (
                <motion.div
                  key={f.stage}
                  className="absolute inset-0 will-change-transform"
                  initial={false}
                  animate={i === active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: i < active ? 0.98 : 1.05 }}
                  transition={{ duration: FADE, ease: EASE_IN_OUT }}
                  style={{ zIndex: i === active ? 2 : 1 }}
                  aria-hidden={i !== active}
                >
                  <FilmLayer i={i} />
                </motion.div>
              ))}
              <button type="button" aria-label="Poprzedni etap" onClick={() => goTo(active - 1)} className="absolute inset-y-0 left-0 z-20 w-1/3 cursor-w-resize" />
              <button type="button" aria-label="Następny etap" onClick={() => goTo(active + 1)} className="absolute inset-y-0 right-0 z-20 w-2/3 cursor-e-resize" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One story bar: fills as you scroll through its stage; click to jump there. */
function Bar({ i, steps, label, selected, onClick }: { i: number; steps: MotionValue<number>; label: string; selected: boolean; onClick: () => void }) {
  const fill = useTransform(steps, (v) => Math.min(1, Math.max(0, v - i)));
  return (
    <button type="button" role="tab" aria-selected={selected} aria-label={label} onClick={onClick} className="group flex-1 py-2">
      <span className="block h-[3px] overflow-hidden rounded-full bg-white/15 transition-colors group-hover:bg-white/25">
        <motion.span className="block h-full origin-left rounded-full bg-accent-bright" style={{ scaleX: fill }} />
      </span>
    </button>
  );
}
