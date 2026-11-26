"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
        <SectionHead chapter="proces" title="Poznaj nasz proces nauczania" accent={["proces", "nauczania"]} lead="Cztery etapy, które prowadzą od pierwszej lekcji do pewności siebie." id="process-title" />
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

/* ───────────────────────── mobile: stacked cards on scroll ───────────────────────── */

/** Sticky offset under the 68 px header. */
const STACK_TOP = 80;
/** Each further card peeks a little lower, so the stack is visible. */
const STACK_STEP = 8;

/**
 * Phones: the stages as a vertical stack. Scrolling down, each next card
 * slides up over the previous one (which shrinks and dims) – the visitor cannot
 * skim past without seeing every stage. Inside the stack a swipe drags the cards
 * with the finger and on release the next (or previous) card glides into place
 * and locks – one card per swipe. Above the first / below the last card the
 * page scrolls natively. The card on top plays
 * its clip once; the others are paused.
 */
function Stories() {
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    let anim = 0;
    let idle = 0;
    // one stage = the real height of one card slot (100svh − header), not innerHeight (iOS toolbars)
    const step = () => (el.querySelector("li") as HTMLElement | null)?.offsetHeight || window.innerHeight - STACK_TOP;
    const origin = () => el.getBoundingClientRect().top + window.scrollY - STACK_TOP;
    const posOf = (y: number) => (y - origin()) / step();
    const yOf = (i: number) => origin() + i * step();
    const jump = (y: number) => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });

    const paint = () => {
      raf = 0;
      const pos = posOf(window.scrollY); // 0 … N-1 while inside
      cards.current.forEach((c, i) => {
        if (!c) return;
        const over = Math.min(1, Math.max(0, pos - i));
        const depth = Math.max(0, pos - i);
        c.style.transform = reduce ? "" : `scale(${1 - Math.min(depth, 3) * 0.05})`;
        (c.querySelector("[data-dim]") as HTMLElement | null)?.style.setProperty("opacity", String(over * 0.55));
      });
    };

    /** Glide the page to a card and lock it there (ease-out, ~0.5 s). */
    const glideTo = (i: number) => {
      cancelAnimationFrame(anim);
      const from = window.scrollY;
      const to = yOf(Math.min(N - 1, Math.max(0, i)));
      if (reduce || Math.abs(to - from) < 2) return jump(to);
      const dur = 520;
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        jump(from + (to - from) * e);
        if (k < 1) anim = requestAnimationFrame(tick);
      };
      anim = requestAnimationFrame(tick);
    };

    // ── touch paging: inside the stack the finger drags the cards, release = next / previous card
    let drag: { y0: number; s0: number; i0: number; p0: number; mode: "undecided" | "page" | "free"; t0: number } | null = null;
    /** A finger is on the screen – never move the page under it. */
    let touching = false;
    const onStart = (e: TouchEvent) => {
      touching = true;
      window.clearTimeout(idle);
      const pos = posOf(window.scrollY);
      // only when a card is (almost) locked on screen – or the first card is on its way in from
      // above, so a swipe down the page stops on card 1 instead of overshooting and coming back
      if (pos < -0.6 || pos > N - 1 + 0.08) return (drag = null);
      cancelAnimationFrame(anim);
      drag = { y0: e.touches[0].clientY, s0: window.scrollY, i0: Math.round(pos), p0: pos, mode: "undecided", t0: performance.now() };
    };
    const onMove = (e: TouchEvent) => {
      if (!drag) return;
      const dy = e.touches[0].clientY - drag.y0; // > 0 finger down = scroll up
      if (drag.mode === "undecided") {
        if (Math.abs(dy) < 6) return;
        // leaving the stack: above the first card or below the last one – let the page scroll natively
        const leaving = (drag.p0 <= 0.02 && dy > 0) || (drag.p0 >= N - 1 - 0.02 && dy < 0);
        drag.mode = leaving ? "free" : "page";
      }
      if (drag.mode !== "page") return;
      e.preventDefault();
      // follow the finger, but never past the neighbouring card in either direction
      const p = drag.p0;
      const lo = yOf(Math.max(0, Math.ceil(p - 0.02) - 1));
      const hi = yOf(Math.min(N - 1, Math.floor(p + 0.02) + 1));
      jump(Math.max(lo, Math.min(hi, drag.s0 - dy)));
    };
    const onEnd = (e: TouchEvent) => {
      touching = e.touches.length > 0;
      if (!drag || drag.mode !== "page") {
        drag = null;
        settleLater();
        return;
      }
      const dy = e.changedTouches[0].clientY - drag.y0;
      const fast = Math.abs(dy) / Math.max(1, performance.now() - drag.t0) > 0.2;
      const go = Math.abs(dy) > 30 || (fast && Math.abs(dy) > 10) ? (dy < 0 ? 1 : -1) : 0;
      // always the neighbouring card in the swipe's direction – never two at once, even when the
      // swipe started between two cards (e.g. arriving from below with momentum)
      const p = drag.p0;
      const to = go > 0 ? Math.floor(p + 0.02) + 1 : go < 0 ? Math.ceil(p - 0.02) - 1 : Math.round(p);
      glideTo(to);
      drag = null;
    };

    // momentum from outside (entering the stack mid-way) – settle on the nearest card once it has
    // really stopped: no finger on the screen and no scroll event for a while
    const repaint = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    function settleLater() {
      window.clearTimeout(idle);
      if (touching) return;
      idle = window.setTimeout(() => {
        if (drag || touching) return;
        const pos = posOf(window.scrollY);
        // only when a card is mostly on screen – a page passing by is left alone
        if (pos > 0.15 && pos < N - 1 - 0.15 && Math.abs(pos - Math.round(pos)) > 0.04) glideTo(Math.round(pos));
      }, 220);
    }
    const onScroll = () => {
      repaint();
      settleLater();
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Safari's toolbar showing/hiding fires resize – repaint only, never move the page
    window.addEventListener("resize", repaint);
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", repaint);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(anim);
      window.clearTimeout(idle);
    };
  }, [reduce]);


  return (
    <div ref={wrap} id="proces-stories" className="mt-7">
      <ol className="shell relative">
        {PROCESS.map((s, i) => (
          <li
            key={s.stage}
            className="sticky"
            style={{ top: STACK_TOP + i * STACK_STEP, height: i < N - 1 ? `calc(100svh - ${STACK_TOP}px)` : "auto" }}
          >
            <div
              ref={(n) => {
                cards.current[i] = n;
              }}
              className="relative mx-auto aspect-[4/5] max-h-[calc(100svh-120px)] w-full max-w-[28rem] origin-top overflow-hidden rounded-[22px] bg-surface shadow-[0_-24px_50px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10 will-change-transform"
              aria-label={s.stage}
            >
              <FilmLayer i={i} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[64%] bg-[linear-gradient(180deg,transparent_0%,rgba(30,34,40,0.74)_42%,rgba(30,34,40,0.97)_100%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-5 text-left">
                {/* same layout as before, proportions swapped: the accent stage line leads, the white promise is the subheading */}
                <h3 className="text-[clamp(1.45rem,6.6vw,1.75rem)] font-[760] leading-[1.08] tracking-[-0.03em] text-accent-bright text-balance">
                  {s.stage}
                </h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-white/75">{s.text}</p>
              </div>
              {/* darkens as the next card slides over */}
              <div data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 bg-night opacity-0" />
            </div>
          </li>
        ))}
      </ol>

      <div className="shell mt-8 flex flex-col items-center gap-3">
        <QuoteLink placement="process_mobile" className="w-full max-w-[24rem]" />
      </div>
    </div>
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
            <div className="relative mx-auto aspect-square w-[min(100%,calc((100vh-68px)*0.84))] overflow-hidden rounded-[24px] bg-surface ring-1 ring-white/10">
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
