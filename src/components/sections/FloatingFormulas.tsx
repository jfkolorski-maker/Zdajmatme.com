"use client";
import { m, useScroll, useTransform } from "motion/react";

const FORMULAS = [
  { t: "Δ = b² − 4ac", x: "6%", y: "18%", d: "11s", r: "-6deg", s: "text-lg" },
  { t: "a² + b² = c²", x: "40%", y: "8%", d: "13s", r: "4deg", s: "text-base" },
  { t: "sin²α + cos²α = 1", x: "70%", y: "14%", d: "12s", r: "-3deg", s: "text-sm" },
  { t: "log₂ 8 = 3", x: "3%", y: "78%", d: "10s", r: "5deg", s: "text-base" },
  { t: "aₙ = a₁ + (n − 1)r", x: "30%", y: "90%", d: "14s", r: "-4deg", s: "text-sm" },
  { t: "π", x: "52%", y: "46%", d: "9s", r: "0deg", s: "text-4xl" },
  { t: "x = −b / 2a", x: "88%", y: "86%", d: "12s", r: "6deg", s: "text-base" },
  { t: "√2", x: "92%", y: "40%", d: "10s", r: "-8deg", s: "text-2xl" },
];

/** Decorative formulas with subtle scroll parallax. aria-hidden – purely visual. */
export function FloatingFormulas() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -90]);
  return (
    <m.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-0 select-none">
      {FORMULAS.map((f, i) => (
        <span
          key={f.t}
          className={`math float absolute whitespace-nowrap text-white/[0.13] ${f.s} ${i % 2 ? "hidden md:block" : ""}`}
          style={{ left: f.x, top: f.y, ["--d" as string]: f.d, ["--r" as string]: f.r, ["--delay" as string]: `${i * -1.3}s` }}
        >
          {f.t}
        </span>
      ))}
    </m.div>
  );
}
