import { testimonials } from "./testimonials";

/**
 * Page chapters — single source for order, numbering ("03 / 07") and labels.
 * Used by section headers, the mobile header label and the desktop menu.
 */
export interface ChapterMeta {
  id: string;
  label: string;
}

export const CHAPTERS: ChapterMeta[] = [
  { id: "jak-dzialamy", label: "Jak działamy" },
  { id: "lekcja", label: "Lekcja online" },
  { id: "dopasuj", label: "Dopasowanie" },
  { id: "standard", label: "Standard" },
  { id: "zespol", label: "Zespół" },
  ...(testimonials.length ? [{ id: "opinie", label: "Opinie" }] : []),
  { id: "faq", label: "FAQ" },
  { id: "kontakt", label: "Kontakt" },
];

const pad = (n: number) => String(n).padStart(2, "0");
export const chapterIndex = (id: string) => CHAPTERS.findIndex((c) => c.id === id);
export const chapterNo = (id: string) => pad(chapterIndex(id) + 1);
export const chapterTotal = () => pad(CHAPTERS.length);
export const chapterLabel = (id: string) => CHAPTERS[chapterIndex(id)]?.label ?? "";
