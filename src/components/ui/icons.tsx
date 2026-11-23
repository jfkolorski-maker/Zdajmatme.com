import type { SVGProps } from "react";

/** One icon set, 24px grid, 1.8 stroke – used everywhere for visual consistency. */
const PATHS: Record<string, string> = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  back: "M19 12H5M11 18l-6-6 6-6",
  check: "M4 12.5l5 5L20 6.5",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6L6 18",
  phone:
    "M5 4h3.5l1.6 4.2-2.1 1.4a11 11 0 0 0 6.4 6.4l1.4-2.1L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z",
  roller: "M4 4h13v5H4zM17 6.5h3v5.5h-8v3M11 15h2v6h-2z",
  shield: "M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6zM8.5 12l2.5 2.5 4.5-5",
  spatula: "M5 3h9l-1.5 7h-6zM9.5 10v4M8 14h3v7H8z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  broom: "M15 3l-4.5 9M7 12h7l2 9H5zM9 16v5M12 16v5",
  home: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  apartment: "M5 21V4h10v17M15 9h4v12M3 21h18M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1",
  house: "M3 11l9-7 9 7M5 10v11h14V10M10 21v-6h4v6",
  door: "M6 21V3h12v18M3 21h18M14 12h.5",
  chat: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5",
  single: "M5 5h14v14H5z",
  two: "M5 5h14v14H5zM12 5v14",
  ceiling: "M3 6h18M6 6v13h12V6M3 21h18",
  minor: "M5 5h14v14H5zM9 9l2 2-1 2 2 2",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  area: "M4 4h16v16H4zM4 9h5M15 20v-5",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.8-4 4-6 8-6s7.2 2 8 6",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.8c2 .6 3.2 2.4 3.5 5.2",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
  cap: "M2 9l10-5 10 5-10 5zM6 11v5c3.5 2.5 8.5 2.5 12 0v-5M22 9v6",
  book: "M12 6.5C10 5 7 4.5 3 5v14c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5v14",
  monitor: "M3 4h18v12H3zM8 21h8M12 16v5",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  spark: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  thumb: "M7 10v11H3V10zM7 10l4-7c1.7 0 2.7 1.3 2.4 3L13 9h6a2 2 0 0 1 2 2.3l-1.3 8A2 2 0 0 1 17.7 21H7",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  play: "M7 4.5v15l13-7.5z",
  soundOn: "M4 9h4l5-4v14l-5-4H4zM16.5 9a4 4 0 0 1 0 6M19.5 6a8 8 0 0 1 0 12",
  soundOff: "M4 9h4l5-4v14l-5-4H4zM17 9.5l5 5M22 9.5l-5 5",
  graph: "M3 3v18h18M7 15c2-6 4-9 6-9s3 3 4 6",
};

export function Icon({ name, size = 22, ...p }: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d={PATHS[name] ?? PATHS.check} />
    </svg>
  );
}
