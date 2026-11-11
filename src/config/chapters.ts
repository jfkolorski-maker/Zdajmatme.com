import { testimonials } from "./testimonials";

/**
 * Single source of truth for the page "chapters" (order, numbering, labels).
 * Used by the sections, the sticky header (current chapter + nav) and the "next chapter" links.
 */
export interface ChapterMeta {
  id: string;
  label: string;
}

export const CHAPTERS: ChapterMeta[] = [
  { id: "sciezki", label: "Dla kogo" },
  { id: "wspolpraca", label: "Jak działamy" },
  { id: "dopasuj", label: "Dopasowanie" },
  { id: "lekcja", label: "Lekcja online" },
  { id: "zespol", label: "Zespół" },
  ...(testimonials.length ? [{ id: "opinie", label: "Opinie" }] : []),
  { id: "faq", label: "FAQ" },
  { id: "start", label: "Start" },
];

export const chapterIndex = (id: string) => CHAPTERS.findIndex((c) => c.id === id);
export const chapterNo = (id: string) => String(chapterIndex(id) + 1).padStart(2, "0");
export const nextChapter = (id: string) => CHAPTERS[chapterIndex(id) + 1];
