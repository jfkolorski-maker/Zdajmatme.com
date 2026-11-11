"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "motion/react";
import { QuizCta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";
import { ArrowRight, Check } from "../ui/Icons";

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
const QUIZ_AT = 3; // before showing Δ the visitor answers the question
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
    <div className={`flex items-center gap-3 rounded-2xl p-3 ring-1 transition-colors ${active ? "bg-white ring-yellow-400 shadow-[var(--shadow-soft)]" : "bg-white/70 ring-line"}`}>
      <span className={`grid h-11 w-11 place-items-center rounded-full text-sm font-extrabold ${isT ? "bg-navy-950 text-yellow-400" : "bg-yellow-400 text-navy-950"}`}>
        {isT ? "K" : "U"}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-extrabold">{isT ? "Korepetytor" : "Uczeń"}</span>
        <span className="block text-xs font-semibold text-ink-muted">{active ? (isT ? "tłumaczy…" : "rozwiązuje…") : "online"}</span>
      </span>
      <span aria-hidden className="flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1 rounded-full ${active ? "bg-success" : "bg-line"}`}
            style={{ height: active ? `${8 + ((i * 5) % 9)}px` : "6px", transition: "height .3s" }}
          />
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

  // gentle autoplay of the first steps once the board is visible
  useEffect(() => {
    if (!inView || shown >= QUIZ_AT) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), 1300);
    return () => window.clearTimeout(t);
  }, [inView, shown]);

  const activeWho = LINES[Math.max(0, Math.min(shown, LINES.length) - 1)].who;

  return (
    <section id="lekcja" className="py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-navy-600">Jak wygląda lekcja online?</p>
          <h2 className="h-section mt-3">Nie tylko oglądasz rozwiązanie. Uczysz się samodzielnie je tworzyć.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
            Korepetytor naprowadza, a uczeń rozwiązuje. Spróbuj sam — to ten sam schemat pracy, który stosujemy na lekcjach.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid gap-4 lg:grid-cols-[15rem_1fr]">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:content-start">
            <Avatar who="tutor" active={activeWho === "tutor" && !done} />
            <Avatar who="student" active={activeWho === "student" || waitingForAnswer} />
            <p className="col-span-2 hidden rounded-2xl bg-white/70 p-4 text-sm text-ink-muted ring-1 ring-line lg:col-span-1 lg:block">
              <b className="text-ink">Wirtualna tablica</b> — obie osoby piszą na tej samej tablicy w czasie rzeczywistym.
            </p>
          </div>

          <div ref={boardRef} className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] ring-1 ring-black/5">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="text-sm font-extrabold">Lekcja · funkcja kwadratowa</span>
              <span className="flex items-center gap-2 text-xs font-bold text-ink-muted">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#f04438]" /> na żywo
              </span>
            </div>
            <div className="grid-paper-light grid gap-6 p-5 sm:p-7 md:grid-cols-[1fr_auto]">
              <ol className="min-h-[19rem] space-y-3" aria-live="polite">
                <AnimatePresence initial={false}>
                  {LINES.slice(0, shown).map((l, i) => (
                    <m.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="flex gap-3">
                      <span className={`mt-1 h-6 w-1 shrink-0 rounded-full ${l.who === "tutor" ? "bg-navy-950" : "bg-yellow-400"}`} aria-hidden />
                      <div>
                        {l.note && <p className={`text-sm font-bold ${l.who === "tutor" ? "text-navy-700" : "text-ink-muted"}`}>{l.who === "tutor" ? "Korepetytor: " : ""}{l.note}</p>}
                        {l.text && <p className="math text-xl text-ink sm:text-2xl">{l.text}</p>}
                      </div>
                    </m.li>
                  ))}
                </AnimatePresence>

                {waitingForAnswer && (
                  <m.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-yellow-100 p-4">
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
                            className={`math min-h-11 min-w-16 rounded-xl px-4 text-lg font-semibold ring-2 transition ${
                              wrong ? "bg-white text-danger ring-danger" : "bg-white ring-navy-950/10 hover:ring-navy-950"
                            }`}
                          >
                            Δ = {c}
                          </button>
                        );
                      })}
                    </div>
                    {answer && answer !== "1" && (
                      <p className="mt-2 text-sm font-semibold text-navy-700">
                        Podpowiedź: b² = 25, a 4ac = 4 · 1 · 6 = 24.
                      </p>
                    )}
                  </m.li>
                )}
              </ol>

              <div className="md:w-[16.5rem]">
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-xl bg-white ring-1 ring-line" role="img" aria-label="Wykres funkcji x² − 5x + 6 z miejscami zerowymi 2 i 3">
                  <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} stroke="#98a2b3" />
                  <line x1={sx(0)} x2={sx(0)} y1={0} y2={H} stroke="#98a2b3" />
                  {done && (
                    <>
                      <m.path d={parabola} fill="none" stroke="#102849" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
                      {[2, 3].map((r, i) => (
                        <m.g key={r} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 + i * 0.15 }} style={{ transformOrigin: `${sx(r)}px ${sy(0)}px` }}>
                          <circle cx={sx(r)} cy={sy(0)} r={6} fill="#FFC928" stroke="#07162E" strokeWidth={2} />
                          <text x={sx(r)} y={sy(0) + 22} textAnchor="middle" className="math" fontSize="14" fill="#101828">
                            {r}
                          </text>
                        </m.g>
                      ))}
                    </>
                  )}
                </svg>
                <div className="mt-4 flex flex-col gap-2">
                  {!done ? (
                    <button
                      type="button"
                      className="btn btn-navy w-full"
                      disabled={waitingForAnswer || shown < QUIZ_AT}
                      onClick={() => setShown((s) => s + 1)}
                    >
                      {waitingForAnswer ? "Najpierw odpowiedz" : "Następny krok"}
                      <ArrowRight className="arrow" />
                    </button>
                  ) : (
                    <>
                      <p className="flex items-center gap-2 font-extrabold text-success">
                        <Check /> Rozwiązane samodzielnie!
                      </p>
                      <button type="button" className="text-sm font-bold text-navy-700 underline underline-offset-4" onClick={() => { setShown(1); setAnswer(null); }}>
                        Zacznij od nowa
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <QuizCta location="lesson_demo">Znajdź korepetytora</QuizCta>
        </Reveal>
      </div>
    </section>
  );
}
