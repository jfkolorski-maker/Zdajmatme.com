"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "motion/react";
import { Chapter } from "../ui/Chapter";
import { ArrowRight, Check } from "../ui/Icons";
import { ParabolaBoard } from "./ParabolaBoard";

type Who = "tutor" | "student";
interface Line {
  who: Who;
  text: string;
  note?: string;
}

const LINES: Line[] = [
  { who: "tutor", text: "x² − 5x + 6 = 0", note: "Zadanie: rozwiąż równanie." },
  { who: "tutor", text: "", note: "Zacznij od współczynników. Co widzisz?" },
  { who: "student", text: "a = 1,  b = −5,  c = 6" },
  { who: "student", text: "Δ = b² − 4ac = 25 − 24 = 1" },
  { who: "student", text: "√Δ = 1" },
  { who: "student", text: "x₁ = (5 − 1) / 2 = 2,   x₂ = (5 + 1) / 2 = 3" },
  { who: "tutor", text: "", note: "Świetnie. Sprawdźmy na wykresie." },
];
const QUIZ_AT = 3;
const CHOICES = ["49", "1", "−1"];

const W = 260, H = 170;
const sx = (x: number) => ((x + 0.5) / 5.5) * W;
const sy = (y: number) => H - ((y + 1) / 7) * H;
const parabola = Array.from({ length: 61 }, (_, i) => {
  const x = -0.5 + (5.5 * i) / 60;
  const y = x * x - 5 * x + 6;
  return `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(Math.min(y, 7)).toFixed(1)}`;
}).join("");

function Avatar({ who, active }: { who: Who; active: boolean }) {
  const isT = who === "tutor";
  return (
    <div className={`flex items-center gap-2.5 rounded-2xl p-2.5 transition-all sm:gap-3 sm:p-3 ${active ? "bg-surface-2 ring-2 ring-yellow-400/70" : "bg-surface ring-1 ring-white/10"}`}>
      <span className={`grid h-11 w-11 place-items-center rounded-full text-sm font-extrabold ${isT ? "bg-base text-yellow-400 ring-1 ring-white/15" : "bg-yellow-400 text-navy-950"}`}>
        {isT ? "K" : "U"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-extrabold">{isT ? "Korepetytor" : "Uczeń"}</span>
        <span className="block text-[0.8125rem] font-semibold text-text-3">{active ? (isT ? "tłumaczy…" : "rozwiązuje…") : "online"}</span>
      </span>
      <span aria-hidden className="hidden items-end gap-0.5 sm:flex">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`w-1 rounded-full ${active ? "bg-success" : "bg-white/15"}`} style={{ height: active ? `${8 + ((i * 5) % 9)}px` : "6px", transition: "height .3s" }} />
        ))}
      </span>
    </div>
  );
}

export function LessonDemo() {
  const [shown, setShown] = useState(1);
  const [answer, setAnswer] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boardRef, { once: true, margin: "0px 0px -25% 0px" });

  const waitingForAnswer = shown === QUIZ_AT && answer !== "1";
  const done = shown >= LINES.length;

  useEffect(() => {
    if (!inView || shown >= QUIZ_AT) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), 1300);
    return () => window.clearTimeout(t);
  }, [inView, shown]);

  const activeWho = LINES[Math.max(0, Math.min(shown, LINES.length) - 1)].who;

  return (
    <Chapter
      id="lekcja"
      titleText="Nie tylko oglądasz rozwiązanie. Uczysz się samodzielnie je tworzyć."
      title="Nie tylko oglądasz rozwiązanie. Uczysz się samodzielnie je tworzyć."
      lead="Korepetytor naprowadza, uczeń rozwiązuje — na wspólnej wirtualnej tablicy. Spróbuj sam."
    >
      <div className="grid gap-3 lg:grid-cols-[15rem_1fr] lg:gap-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:content-start">
          <Avatar who="tutor" active={activeWho === "tutor" && !done} />
          <Avatar who="student" active={activeWho === "student" || waitingForAnswer} />
        </div>

        <div ref={boardRef} className="overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-lift)] ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="text-sm font-extrabold">Lekcja · funkcja kwadratowa</span>
            <span className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[0.8125rem] font-bold text-text-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#f04438]" /> na żywo
            </span>
          </div>
          <div className="grid-paper-light grid gap-6 bg-base/50 p-5 sm:p-7 md:grid-cols-[1fr_auto]">
            <ol className="min-h-[18rem] space-y-3" aria-live="polite">
              <AnimatePresence initial={false}>
                {LINES.slice(0, shown).map((l, i) => (
                  <m.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="flex gap-3">
                    <span className={`mt-1 h-6 w-1 shrink-0 rounded-full ${l.who === "tutor" ? "bg-white/40" : "bg-yellow-400"}`} aria-hidden />
                    <div>
                      {l.note && <p className="text-sm font-bold text-text-2">{l.who === "tutor" ? "Korepetytor: " : ""}{l.note}</p>}
                      {l.text && <p className={`math text-xl sm:text-2xl ${l.who === "student" ? "text-yellow-100" : "text-white"}`}>{l.text}</p>}
                    </div>
                  </m.li>
                ))}
              </AnimatePresence>

              {waitingForAnswer && (
                <m.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-yellow-400/10 p-4 ring-1 ring-yellow-400/40">
                  <p className="font-extrabold">Twoja kolej: ile wynosi Δ?</p>
                  <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Wybierz wartość delty">
                    {CHOICES.map((c) => {
                      const wrong = answer === c && c !== "1";
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setAnswer(c);
                            if (c === "1") window.setTimeout(() => setShown((s) => s + 1), 350);
                          }}
                          className={`math min-h-11 min-w-16 rounded-xl px-4 text-lg font-semibold ring-2 transition ${wrong ? "bg-base text-danger ring-danger" : "bg-base ring-white/15 hover:ring-yellow-400"}`}
                        >
                          Δ = {c}
                        </button>
                      );
                    })}
                  </div>
                  {answer && answer !== "1" && <p className="mt-2 text-sm font-semibold text-text-2">Podpowiedź: b² = 25, a 4ac = 4 · 1 · 6 = 24.</p>}
                </m.li>
              )}
            </ol>

            <div className="md:w-[16.5rem]">
              <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-xl bg-base/80 ring-1 ring-white/10" role="img" aria-label="Wykres funkcji x² − 5x + 6 z miejscami zerowymi 2 i 3">
                <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} stroke="#5b6f8f" />
                <line x1={sx(0)} x2={sx(0)} y1={0} y2={H} stroke="#5b6f8f" />
                {done && (
                  <>
                    <m.path d={parabola} fill="none" stroke="#FFC928" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
                    {[2, 3].map((r, i) => (
                      <m.g key={r} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 + i * 0.15 }} style={{ transformOrigin: `${sx(r)}px ${sy(0)}px` }}>
                        <circle cx={sx(r)} cy={sy(0)} r={6} fill="#07162E" stroke="#FFC928" strokeWidth={2.5} />
                        <text x={sx(r)} y={sy(0) + 22} textAnchor="middle" className="math" fontSize="14" fill="#F3F6FB">
                          {r}
                        </text>
                      </m.g>
                    ))}
                  </>
                )}
              </svg>
              <div className="mt-4 flex flex-col gap-2">
                {!done ? (
                  <button type="button" className="btn btn-ghost-light w-full" disabled={waitingForAnswer || shown < QUIZ_AT} onClick={() => setShown((s) => s + 1)}>
                    {waitingForAnswer ? "Najpierw odpowiedz" : "Następny krok"}
                    <ArrowRight className="arrow" />
                  </button>
                ) : (
                  <>
                    <p className="flex items-center gap-2 font-extrabold text-success">
                      <Check /> Rozwiązane samodzielnie!
                    </p>
                    <button type="button" className="min-h-11 text-left text-sm font-bold text-text-2 underline underline-offset-4" onClick={() => { setShown(1); setAnswer(null); }}>
                      Zacznij od nowa
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div>
          <h3 className="h-card">Pobaw się parabolą</h3>
          <p className="mt-3 max-w-xl text-text-2">
            Przesuń suwaki <span className="math">a</span>, <span className="math">b</span> i <span className="math">c</span> — zobacz, jak zmienia się wykres, delta i miejsca zerowe.
            Na lekcjach sprawdzamy matematykę w praktyce, zamiast uczyć się wzorów na pamięć.
          </p>
        </div>
        <div className="w-full max-w-sm lg:mx-auto">
          <ParabolaBoard />
        </div>
      </div>
    </Chapter>
  );
}
