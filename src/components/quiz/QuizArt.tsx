/**
 * Illustrated (duotone) quiz icons – one small picture per answer, keyed by the answer value (values are unique
 * across the quiz). Ink outlines + paper + brand orange, so they read as pictures, not generic glyphs.
 * An answer without art falls back to the line icon set.
 */
const INK = "#1e2228";
const OR = "#FFA550";
const OR2 = "#F07F1A";
const PAPER = "#FFFFFF";
const s = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function LevelSheet({ letter, curve = false }: { letter: "P" | "R"; curve?: boolean }) {
  return (
    <>
      <path d="M9 4h19l8 8v28a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={PAPER} {...s} />
      <path d="M28 4v8h8" fill="none" {...s} />
      {curve ? (
        <>
          <path d="M12 30h18M21 17v18" {...s} strokeWidth={1.4} stroke="#c9c2b8" />
          <path d="M12.5 19c3 12 13 12 16 0" fill="none" {...s} stroke={OR2} strokeWidth={2.4} />
        </>
      ) : (
        <text x="20" y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill={OR2} fontFamily="Poppins, sans-serif">x+2</text>
      )}
      <circle cx="36" cy="36" r="8.5" fill={letter === "R" ? INK : OR} {...s} />
      <text x="36" y="40.2" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={letter === "R" ? OR : INK} fontFamily="Poppins, sans-serif">{letter}</text>
    </>
  );
}

function Calendar({ label, marks = false }: { label?: string; marks?: boolean }) {
  return (
    <>
      <rect x="6" y="9" width="36" height="33" rx="4" fill={PAPER} {...s} />
      <path d="M6 13a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v5H6z" fill={OR} {...s} />
      <path d="M15 5v8M33 5v8" {...s} strokeWidth={2.6} />
      {label && (
        <text x="24" y="37.5" textAnchor="middle" fontSize="16" fontWeight="800" fill={INK} fontFamily="Poppins, sans-serif">
          {label}
        </text>
      )}
      {marks && (
        <>
          <path d="M11.5 27.5l2 2 3.5-4M21.5 27.5l2 2 3.5-4M31.5 27.5l2 2 3.5-4" fill="none" {...s} stroke={OR2} strokeWidth={2.2} />
          <path d="M12 36h4M22 36h4M32 36h4" {...s} stroke="#c9c2b8" />
        </>
      )}
    </>
  );
}

function MaturaArt() {
  return (
    <>
      <rect x="9" y="25" width="30" height="17" rx="2.5" fill={PAPER} {...s} />
      <path d="M14 31h14M14 36h9" {...s} strokeWidth={1.6} stroke="#c9c2b8" />
      <circle cx="33" cy="35" r="3.6" fill={OR} {...s} strokeWidth={1.6} />
      <path d="M31.4 38.2l-1 5 2.6-1.4 2.6 1.4-1-5" fill={OR2} {...s} strokeWidth={1.4} />
      <path d="M24 5L4 13.5 24 22l20-8.5z" fill={INK} {...s} />
      <path d="M12 17.5v5.5c6 3.6 18 3.6 24 0v-5.5" fill="none" {...s} />
      <path d="M41 14.8v8" {...s} stroke={OR2} strokeWidth={2.2} />
      <circle cx="41" cy="24.5" r="2.2" fill={OR} stroke={INK} strokeWidth={1.4} />
      <path d="M24 13.5l-9 2.6" {...s} stroke={OR} strokeWidth={1.8} />
    </>
  );
}

function Bulb() {
  return (
    <>
      <path d="M24 5.5a12.5 12.5 0 0 0-7.4 22.6c1.4 1 2.2 2.6 2.2 4.4v1.5h10.4v-1.5c0-1.8.8-3.4 2.2-4.4A12.5 12.5 0 0 0 24 5.5z" fill={OR} {...s} />
      <path d="M19 38.5h10M20.5 43h7" {...s} />
      <path d="M20.6 15.5a3.6 3.6 0 1 1 5.3 3.2c-1.2.7-1.9 1.6-1.9 3v.8" fill="none" {...s} strokeWidth={2.4} />
      <circle cx="24" cy="27.3" r="1.5" fill={INK} />
      <path d="M5 9l3 2M43 9l-3 2M3.5 20h3.5M41 20h3.5" {...s} stroke={OR2} strokeWidth={2.2} />
    </>
  );
}

function ExamSheet() {
  return (
    <>
      <path d="M10 4h19l9 9v29a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={PAPER} {...s} />
      <path d="M29 4v9h9" fill="none" {...s} />
      <path d="M13 11h10M13 16h8" {...s} strokeWidth={1.6} stroke="#c9c2b8" />
      <text x="20.5" y="37" textAnchor="middle" fontSize="20" fontWeight="800" fill={OR2} fontFamily="Poppins, sans-serif">8</text>
      <circle cx="36" cy="36" r="8" fill={OR} {...s} />
      <path d="M32.4 36.2l2.6 2.6 4.8-5" fill="none" {...s} stroke={INK} strokeWidth={2.2} />
    </>
  );
}

const ART: Record<string, React.ReactNode> = {
  /* 1:1 lesson online – laptop with the tutor on screen and a "1:1" bubble */
  indiv: (
    <>
      <rect x="7" y="12" width="30" height="20" rx="3" fill={PAPER} {...s} />
      <circle cx="22" cy="20" r="3.6" fill={OR} {...s} strokeWidth={1.6} />
      <path d="M15.5 31.5c.8-4 3.4-6 6.5-6s5.7 2 6.5 6" fill={OR} {...s} strokeWidth={1.6} />
      <path d="M3.5 32h37l-2.4 4.5H5.9z" fill={INK} {...s} />
      <path d="M30 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3.5v-3.5h-3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill={OR2} {...s} />
      <text x="37" y="13.4" textAnchor="middle" fontSize="7.4" fontWeight="800" fill={PAPER} fontFamily="Poppins, sans-serif">1:1</text>
    </>
  ),
  /* 8th-grade exam – exam sheet with a big 8 and a passed badge */
  e8: <ExamSheet />,
  /* matura – graduation cap over a diploma with a ribbon */
  matura: <MaturaArt />,
  /* not sure yet – glowing bulb with a question mark */
  other: <Bulb />,
  /* for my child – parent and child */
  child: (
    <>
      <circle cx="17" cy="13" r="6" fill={PAPER} {...s} />
      <path d="M5 42c0-9 5.4-15 12-15s12 6 12 15z" fill={INK} {...s} />
      <circle cx="33.5" cy="22" r="4.8" fill={PAPER} {...s} />
      <path d="M24.5 42c0-7 4-11.5 9-11.5s9 4.5 9 11.5z" fill={OR} {...s} />
      <path d="M38 5.5l1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" fill={OR2} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
    </>
  ),
  /* for myself – student with a pencil */
  self: (
    <>
      <circle cx="22" cy="14" r="7" fill={PAPER} {...s} />
      <path d="M8 43c0-10 6.3-16.5 14-16.5S36 33 36 43z" fill={OR} {...s} />
      <path d="M33 30.5l9-9 3.5 3.5-9 9-4.6 1.1z" fill={PAPER} {...s} />
      <path d="M39.5 24l3.5 3.5" {...s} />
      <path d="M42 21.5l1.6-1.6a1.4 1.4 0 0 1 2 0l1.5 1.5a1.4 1.4 0 0 1 0 2L45.5 25" fill={OR2} {...s} />
    </>
  ),
  /* ── stage ── */
  /* classes 4–8 – school backpack with an "8" patch */
  sp48: (
    <>
      <path d="M18 10V7.5a6 6 0 0 1 12 0V10" fill="none" {...s} />
      <path d="M11 20a10 10 0 0 1 10-10h6a10 10 0 0 1 10 10v20a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z" fill={OR} {...s} />
      <rect x="14" y="26.5" width="20" height="12.5" rx="3" fill={PAPER} {...s} />
      <text x="24" y="35.9" textAnchor="middle" fontSize="7.6" fontWeight="800" fill={OR2} fontFamily="Poppins, sans-serif">4–8</text>
      <path d="M16 20h16" {...s} />
    </>
  ),
  e8prep: <ExamSheet />,
  lobasic: <LevelSheet letter="P" />,
  loext: <LevelSheet letter="R" curve />,
  prep: <MaturaArt />,

  /* ── level ── */
  basic: <LevelSheet letter="P" />,
  extended: <LevelSheet letter="R" curve />,
  unsure: <Bulb />,

  /* ── need ── */
  /* better grades – report card with a 5 and an arrow up */
  grades: (
    <>
      <rect x="7" y="6" width="26" height="36" rx="3" fill={PAPER} {...s} />
      <path d="M12 13h12M12 18h8" {...s} strokeWidth={1.6} stroke="#c9c2b8" />
      <circle cx="20" cy="30" r="7.5" fill="none" {...s} stroke={OR2} strokeWidth={2.2} />
      <text x="20" y="34.4" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily="Poppins, sans-serif">5</text>
      <path d="M38 40V16" {...s} stroke={OR2} strokeWidth={3} />
      <path d="M32.5 21.5L38 16l5.5 5.5" fill="none" {...s} stroke={OR2} strokeWidth={3} />
    </>
  ),
  /* understanding – bulb lit up with sparkles */
  understand: (
    <>
      <path d="M24 5.5a12.5 12.5 0 0 0-7.4 22.6c1.4 1 2.2 2.6 2.2 4.4v1.5h10.4v-1.5c0-1.8.8-3.4 2.2-4.4A12.5 12.5 0 0 0 24 5.5z" fill={OR} {...s} />
      <path d="M19 38.5h10M20.5 43h7" {...s} />
      <path d="M24 12.5l1.6 4.2 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill={PAPER} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M5 9l3 2M43 9l-3 2M3.5 20h3.5M41 20h3.5" {...s} stroke={OR2} strokeWidth={2.2} />
    </>
  ),
  /* exam – dartboard with an arrow in the bullseye */
  exam: (
    <>
      <circle cx="22" cy="26" r="17" fill={PAPER} {...s} />
      <circle cx="22" cy="26" r="11" fill={OR} {...s} />
      <circle cx="22" cy="26" r="5" fill={PAPER} {...s} />
      <path d="M22 26L40 8" {...s} strokeWidth={2.4} />
      <path d="M36 5.5l1.2 3.8 3.8 1.2-3 3-4-1-1-4z" fill={OR2} {...s} strokeWidth={1.6} />
    </>
  ),
  /* confidence – trophy */
  confidence: (
    <>
      <path d="M15 6h18v10a9 9 0 0 1-18 0z" fill={OR} {...s} />
      <path d="M15 9H8.5v3a6.5 6.5 0 0 0 7.2 6.4M33 9h6.5v3a6.5 6.5 0 0 1-7.2 6.4" fill="none" {...s} />
      <path d="M24 25v7" {...s} />
      <path d="M17 42v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4z" fill={INK} {...s} />
      <path d="M24 10l1.3 2.8 3 .4-2.2 2.1.6 3-2.7-1.5-2.7 1.5.6-3-2.2-2.1 3-.4z" fill={PAPER} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
    </>
  ),
  /* regular support – calendar with ticked days */
  regular: <Calendar marks />,

  /* ── start ── */
  /* asap – rocket */
  asap: (
    <>
      <path d="M24 4c7 4.5 10 11.5 10 19.5L30 31H18l-4-7.5C14 15.5 17 8.5 24 4z" fill={PAPER} {...s} />
      <circle cx="24" cy="17" r="4" fill={OR} {...s} />
      <path d="M14.5 24L8 30l1.5 6 7.5-5M33.5 24L40 30l-1.5 6-7.5-5" fill={OR2} {...s} />
      <path d="M20 35c0 3 1.5 6 4 8.5 2.5-2.5 4-5.5 4-8.5z" fill={OR} {...s} />
    </>
  ),
  /* within 7 days – calendar page with 7 */
  "7d": <Calendar label="7" />,
  /* in 2–4 weeks – hourglass */
  "2-4w": (
    <>
      <path d="M12 5h24M12 43h24" {...s} strokeWidth={2.6} />
      <path d="M15 5v4.5c0 4.5 3.5 8 7.5 10.5v8C18.5 30.5 15 34 15 38.5V43h18v-4.5c0-4.5-3.5-8-7.5-10.5v-8C29.5 17.5 33 14 33 9.5V5z" fill={PAPER} {...s} />
      <path d="M18.5 12h11c-1 2.5-3 4.3-5.5 5.8-2.5-1.5-4.5-3.3-5.5-5.8zM17.5 41c.4-3.6 3-6 6.5-7.5 3.5 1.5 6.1 3.9 6.5 7.5z" fill={OR} />
    </>
  ),
  /* just looking – magnifier */
  browsing: (
    <>
      <circle cx="20" cy="20" r="13" fill={PAPER} {...s} strokeWidth={2.4} />
      <path d="M13 17a8 8 0 0 1 6-5.5" fill="none" {...s} stroke={OR} strokeWidth={2.6} />
      <path d="M29.5 29.5l11 11" {...s} strokeWidth={5} stroke={INK} />
      <path d="M31 31l8 8" {...s} strokeWidth={2.4} stroke={OR} />
    </>
  ),

};

export function hasQuizArt(value: string) {
  return value in ART;
}

export function QuizArt({ value, size = 46 }: { value: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {ART[value]}
    </svg>
  );
}
