"use client";
import { useEffect, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { Chapter } from "../ui/Chapter";
import { ArrowLeft, ArrowRight } from "../ui/Icons";
import { StepArt } from "./StepArt";

const STEPS = [
  { name: "Poznajemy potrzeby ucznia", promise: "Zaczynamy od rozmowy, nie od pakietu.", desc: "Krótki quiz i rozmowa z Oliwią: etap nauki, poziom, trudne tematy i cel." },
  { name: "Dobieramy korepetytora", promise: "Osoba dopasowana do ucznia.", desc: "Na tej podstawie wybieramy korepetytora z naszego zespołu." },
  { name: "Lekcje online 1:1", promise: "Jeden uczeń, jeden korepetytor.", desc: "Wspólna wirtualna tablica i zadania rozwiązywane krok po kroku." },
  { name: "Praca nad celem", promise: "Każda lekcja ma powód.", desc: "Oceny, egzamin ósmoklasisty albo matura — plan nauki służy konkretnemu celowi." },
  { name: "Informacja dla rodzica", promise: "Wiesz, jak idzie nauka.", desc: "Rodzic otrzymuje informacje o tym, nad czym pracujemy i jakie są postępy." },
];
const N = STEPS.length;
const pad = (n: number) => String(n).padStart(2, "0");

function StepCard({ i, dim = 0 }: { i: number; dim?: number }) {
  const s = STEPS[i];
  return (
    <article className="relative h-full w-full overflow-hidden rounded-[22px] bg-gradient-to-b from-navy-800 to-navy-950 ring-1 ring-white/10">
      <div aria-hidden className="grid-paper absolute inset-0 opacity-70" />
      <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-yellow-400 text-sm font-[760] text-navy-950">{pad(i + 1)}</span>
      <span className="absolute right-4 top-5 text-sm font-semibold text-white/65">
        {i + 1} / {N}
      </span>
      <div className="absolute inset-x-8 top-[12%] h-[46%]">
        <StepArt step={i} />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 via-navy-950/90 to-transparent px-5 pb-6 pt-16">
        <h3 className="h3 text-yellow-400">
          Etap {pad(i + 1)} / {s.name}
        </h3>
        <p className="mt-2 font-semibold text-white">{s.promise}</p>
        <p className="mt-1 text-[0.98rem] text-white/75">{s.desc}</p>
      </div>
      {/* dimming for cards further back in the stack (opacity only) */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-navy-950" style={{ opacity: dim }} />
    </article>
  );
}

/**
 * Mobile: stacked cards. One swipe = one card (follows the finger up to the neighbour, settles in 0.52 s).
 * Swiping outward at the first/last card is handed to the browser → normal page scroll.
 * The page itself is never scrolled programmatically.
 */
function MobileDeck() {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0); // px, negative = towards next
  const [settling, setSettling] = useState(false);
  const deck = useRef<HTMLDivElement>(null);
  const g = useRef<{ x: number; y: number; t: number; mode: "deck" | "native" | null; dir: 1 | -1 }>({ x: 0, y: 0, t: 0, mode: null, dir: 1 });
  const activeRef = useRef(0);
  activeRef.current = active;

  useEffect(() => {
    const el = deck.current;
    if (!el) return;
    const h = () => el.clientHeight;
    const start = (e: TouchEvent) => {
      const t = e.touches[0];
      g.current = { x: t.clientX, y: t.clientY, t: performance.now(), mode: null, dir: 1 };
      setSettling(false);
    };
    const move = (e: TouchEvent) => {
      const st = g.current;
      const t = e.touches[0];
      const dy = t.clientY - st.y;
      const dx = t.clientX - st.x;
      if (st.mode === null) {
        if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          st.mode = "native";
          return;
        }
        st.dir = dy < 0 ? 1 : -1;
        const a = activeRef.current;
        st.mode = (st.dir === 1 && a === N - 1) || (st.dir === -1 && a === 0) ? "native" : "deck";
      }
      if (st.mode !== "deck") return;
      e.preventDefault();
      const H = h();
      setDrag(st.dir === 1 ? Math.max(-H, Math.min(0, dy)) : Math.min(H, Math.max(0, dy)));
    };
    const end = (e: TouchEvent) => {
      const st = g.current;
      if (st.mode !== "deck") return;
      const t = e.changedTouches[0];
      const dy = t.clientY - st.y;
      const v = Math.abs(dy) / Math.max(1, performance.now() - st.t);
      const go = Math.abs(dy) > h() * 0.18 || v > 0.45;
      setSettling(true);
      if (go) setActive((a) => Math.max(0, Math.min(N - 1, a + st.dir)));
      setDrag(0);
      st.mode = null;
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end, { passive: true });
    el.addEventListener("touchcancel", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, []);

  const H = deck.current?.clientHeight ?? 500;
  const p = -drag / H; // 0..1 → next, -1..0 → previous
  const go = (d: 1 | -1) => {
    setSettling(true);
    setActive((a) => Math.max(0, Math.min(N - 1, a + d)));
  };

  return (
    <div className="lg:hidden">
      <div className="mx-auto max-w-md">
        {/* clips the incoming card below; top padding leaves room for the cards stacked behind */}
        <div className="overflow-hidden pt-7">
        <div ref={deck} className="relative aspect-[4/5] touch-pan-y" aria-roledescription="karuzela" aria-label="Etapy współpracy">
          {STEPS.map((_, i) => {
            const pos = i - (active + p); // <=0: current/behind, >0: below
            const level = Math.max(0, -pos);
            const below = Math.max(0, pos);
            const style: React.CSSProperties = {
              transform: pos > 0 ? `translate3d(0, calc(${below * 100}% + ${below * 16}px), 0)` : `translate3d(0, ${-12 * Math.min(level, 2)}px, 0) scale(${1 - 0.05 * Math.min(level, 2)})`,
              transformOrigin: "50% 0%",
              transition: settling ? "transform 0.52s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              zIndex: i + 1,
              visibility: pos > 1.01 || level > 2.5 ? "hidden" : "visible",
            };
            return (
              <div key={i} className="absolute inset-0 will-change-transform" style={style} aria-hidden={i !== active}>
                <StepCard i={i} dim={Math.min(level, 1) * 0.45} />
              </div>
            );
          })}
        </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(-1)} disabled={active === 0} className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/20 disabled:opacity-35" aria-label="Poprzedni etap">
            <ArrowLeft />
          </button>
          <div className="flex gap-2" aria-hidden>
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-yellow-400" : "w-1.5 bg-white/25"}`} />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} disabled={active === N - 1} className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/20 disabled:opacity-35" aria-label="Następny etap">
            <ArrowRight />
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-white/55">Przesuń kartę palcem w górę</p>
      </div>
    </div>
  );
}

/** Desktop: pinned card on the right, "stories" progress on the left — scrolling changes the stage. */
function DesktopStories() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end 70%"] });
  const [prog, setProg] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProg);
  const active = Math.min(N - 1, Math.floor(prog * N));
  const local = Math.min(1, Math.max(0, prog * N - active));

  return (
    <div ref={ref} className="relative hidden h-[260vh] lg:block">
      <div className="sticky top-[calc(68px+6vh)] grid grid-cols-[1fr_minmax(0,26rem)] items-center gap-16">
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.name} className={`rounded-[20px] p-5 transition-colors duration-300 ${i === active ? "bg-white/[0.06]" : ""}`}>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full origin-left bg-yellow-400" style={{ transform: `scaleX(${i < active ? 1 : i === active ? local : 0})` }} />
              </div>
              <p className={`mt-3 text-sm font-bold ${i === active ? "text-yellow-400" : "text-white/50"}`}>Etap {pad(i + 1)}</p>
              <h3 className={`h3 mt-1 transition-colors ${i === active ? "text-white" : "text-white/55"}`}>{s.name}</h3>
              {i === active && (
                <m.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }} className="mt-2 text-white/75">
                  {s.promise} {s.desc}
                </m.p>
              )}
            </li>
          ))}
        </ol>
        <div className="relative aspect-[4/5]">
          <m.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
            <StepCard i={active} />
          </m.div>
        </div>
      </div>
    </div>
  );
}

export function Steps() {
  return (
    <Chapter id="jak-dzialamy" title={<>Pięć etapów.<br />Jeden cel ucznia.</>} lead="Tak wygląda współpraca od pierwszej rozmowy do efektów.">
      <MobileDeck />
      <DesktopStories />
    </Chapter>
  );
}
