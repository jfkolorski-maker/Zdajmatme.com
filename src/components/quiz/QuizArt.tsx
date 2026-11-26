/**
 * Illustrated (duotone) quiz icons for the answers that matter most – what the person is looking for and who
 * the lessons are for. Ink outlines + paper + brand orange, so they read as small pictures, not generic glyphs.
 * Other answers fall back to the line icon set.
 */
const INK = "#1e2228";
const OR = "#FFA550";
const OR2 = "#F07F1A";
const PAPER = "#FFFFFF";
const s = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

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
  e8: (
    <>
      <path d="M10 4h19l9 9v29a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={PAPER} {...s} />
      <path d="M29 4v9h9" fill="none" {...s} />
      <path d="M13 11h10M13 16h8" {...s} strokeWidth={1.6} stroke="#c9c2b8" />
      <text x="20.5" y="37" textAnchor="middle" fontSize="20" fontWeight="800" fill={OR2} fontFamily="Poppins, sans-serif">8</text>
      <circle cx="36" cy="36" r="8" fill={OR} {...s} />
      <path d="M32.4 36.2l2.6 2.6 4.8-5" fill="none" {...s} stroke={INK} strokeWidth={2.2} />
    </>
  ),
  /* matura – graduation cap over a diploma with a ribbon */
  matura: (
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
  ),
  /* not sure yet – glowing bulb with a question mark */
  other: (
    <>
      <path d="M24 5.5a12.5 12.5 0 0 0-7.4 22.6c1.4 1 2.2 2.6 2.2 4.4v1.5h10.4v-1.5c0-1.8.8-3.4 2.2-4.4A12.5 12.5 0 0 0 24 5.5z" fill={OR} {...s} />
      <path d="M19 38.5h10M20.5 43h7" {...s} />
      <path d="M20.6 15.5a3.6 3.6 0 1 1 5.3 3.2c-1.2.7-1.9 1.6-1.9 3v.8" fill="none" {...s} strokeWidth={2.4} />
      <circle cx="24" cy="27.3" r="1.5" fill={INK} />
      <path d="M5 9l3 2M43 9l-3 2M3.5 20h3.5M41 20h3.5" {...s} stroke={OR2} strokeWidth={2.2} />
    </>
  ),
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
