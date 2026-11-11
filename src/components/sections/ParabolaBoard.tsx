"use client";
import { useId, useMemo, useState } from "react";
import { track } from "@/lib/tracking";

/**
 * Mini "digital whiteboard": drag the sliders, the parabola, Δ and the roots update live.
 * Coordinates: x ∈ [-5, 5], y ∈ [-4, 6] mapped to a 300×220 SVG.
 */
const W = 300, H = 220, X0 = -5, X1 = 5, Y0 = -4, Y1 = 6;
const sx = (x: number) => ((x - X0) / (X1 - X0)) * W;
const sy = (y: number) => H - ((y - Y0) / (Y1 - Y0)) * H;
const fmt = (n: number) => (Math.round(n * 100) / 100).toString().replace(".", ",").replace("-", "−");

function term(v: number, suffix: string, first = false) {
  if (v === 0) return "";
  const sign = v < 0 ? " − " : first ? "" : " + ";
  const abs = Math.abs(v);
  const coef = suffix && abs === 1 ? "" : fmt(abs);
  return `${first && v < 0 ? "−" : sign}${coef}${suffix}`;
}

export function ParabolaBoard() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-1);
  const [c, setC] = useState(-2);
  const [touched, setTouched] = useState(false);
  const id = useId();

  const { path, delta, roots, vertex } = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = X0 + ((X1 - X0) * i) / 120;
      const y = Math.max(Y0 - 2, Math.min(Y1 + 2, a * x * x + b * x + c));
      pts.push(`${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
    const delta = b * b - 4 * a * c;
    let roots: number[] = [];
    if (a === 0) roots = b !== 0 ? [-c / b] : [];
    else if (delta > 0) roots = [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)].sort((p, q) => p - q);
    else if (delta === 0) roots = [-b / (2 * a)];
    const vertex = a !== 0 ? { x: -b / (2 * a), y: -delta / (4 * a) } : null;
    return { path: pts.join(""), delta, roots, vertex };
  }, [a, b, c]);

  const onChange = (set: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    set(Number(e.target.value));
    if (!touched) {
      setTouched(true);
      track("cta_click", { cta_location: "hero_board", cta_target: "interaction" });
    }
  };

  const formula = `f(x) = ${term(a, "x²", true) || ""}${term(b, "x", !a)}${term(c, "", !a && !b)}` || "f(x) = 0";

  return (
    <figure className="overflow-hidden rounded-[1.4rem] bg-surface text-text shadow-[var(--shadow-lift)] ring-1 ring-white/10">
      <figcaption className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="text-[0.8125rem] font-bold uppercase tracking-wider text-text-3">Tablica · spróbuj sam</span>
      </figcaption>
      <div className="grid-paper-light bg-base/60 px-3 pt-3">
        <p className="math text-center text-[1.05rem] font-semibold text-white" aria-live="polite">
          {formula}
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 block h-auto w-full" role="img" aria-label={`Wykres funkcji ${formula}`}>
          <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} stroke="#5b6f8f" strokeWidth="1.2" />
          <line x1={sx(0)} x2={sx(0)} y1={0} y2={H} stroke="#5b6f8f" strokeWidth="1.2" />
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((t) => (
            <line key={t} x1={sx(t)} x2={sx(t)} y1={sy(0) - 3} y2={sy(0) + 3} stroke="#5b6f8f" />
          ))}
          <path d={path} fill="none" stroke="#FFC928" strokeWidth="3" strokeLinecap="round" className="underline-draw-path" />
          {vertex && Math.abs(vertex.y) < 7 && <circle cx={sx(vertex.x)} cy={sy(vertex.y)} r="4" fill="#ffffff" />}
          {roots.filter((r) => r >= X0 && r <= X1).map((r) => (
            <circle key={r} cx={sx(r)} cy={sy(0)} r="6" fill="#07162E" stroke="#FFC928" strokeWidth="2.5" />
          ))}
        </svg>
      </div>
      <div className="px-4 pb-4 pt-2">
        {[
          { k: "a", v: a, set: setA, min: -2, max: 2, step: 0.5 },
          { k: "b", v: b, set: setB, min: -4, max: 4, step: 1 },
          { k: "c", v: c, set: setC, min: -4, max: 4, step: 1 },
        ].map((s) => (
          <label key={s.k} htmlFor={`${id}-${s.k}`} className="flex min-h-11 items-center gap-3 text-sm font-semibold">
            <span className="math w-4 text-base">{s.k}</span>
            <input
              id={`${id}-${s.k}`}
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.v}
              onChange={onChange(s.set)}
              className="h-11 flex-1 cursor-pointer touch-pan-y accent-yellow-400"
            />
            <span className="w-9 text-right tabular-nums text-text-3">{fmt(s.v)}</span>
          </label>
        ))}
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-base/70 px-3 py-2 text-sm">
          {a === 0 ? (
            <span className="font-semibold text-text-2">a = 0 → to już funkcja liniowa</span>
          ) : (
            <>
              <span>
                <span className="math">Δ</span> = <b className="tabular-nums">{fmt(delta)}</b>
              </span>
              <span className="text-text-2">
                {roots.length === 0 ? "brak miejsc zerowych" : roots.length === 1 ? `x₀ = ${fmt(roots[0])}` : `x₁ = ${fmt(roots[0])}, x₂ = ${fmt(roots[1])}`}
              </span>
            </>
          )}
        </div>
      </div>
    </figure>
  );
}
