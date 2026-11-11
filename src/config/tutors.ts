/**
 * Tutor directory.
 *
 * RULES
 *  - Add ONLY real people with photos supplied by ZdajMatme.com.
 *  - Never invent education, certificates, years of experience or results.
 *  - Optional fields left `undefined` are simply not rendered.
 *
 * To add a tutor: put the photo in /public/team/<slug>.webp (portrait, min. 800px tall)
 * and append an object to `tutors`.
 */
export type TeachingLevel =
  | "Szkoła podstawowa 4–6"
  | "Szkoła podstawowa 7–8"
  | "Liceum / technikum — podstawa"
  | "Liceum / technikum — rozszerzenie";

export interface Tutor {
  slug: string;
  name: string;
  /** e.g. "CEO / koordynatorka" – shown as a badge */
  role?: string;
  photo: { src: string; alt: string; width: number; height: number };
  /** e.g. "Matura rozszerzona, funkcje i analiza" */
  specialization?: string;
  levels?: TeachingLevel[];
  /** 1–3 sentences, factual, written/approved by the tutor */
  bio?: string;
  /** Free-text experience description, ONLY if supplied by the tutor */
  experience?: string;
  featured?: boolean;
}

export const tutors: Tutor[] = [
  {
    slug: "oliwia-siedlec",
    name: "Oliwia Siedlec",
    role: "Założycielka i CEO · koordynatorka",
    featured: true,
    photo: {
      src: "/team/oliwia-siedlec.webp",
      alt: "Oliwia Siedlec, założycielka ZdajMatme.com, przy biurku z tablicą z funkcją kwadratową",
      width: 864,
      height: 1536,
    },
    bio: "To z Oliwią rozmawiasz po wysłaniu zgłoszenia — poznaje potrzeby ucznia i dobiera korepetytora z zespołu.",
    // TODO: uzupełnij specjalizację, poziomy i doświadczenie wg danych od Oliwii
    specialization: undefined,
    levels: undefined,
    experience: undefined,
  },
  // {
  //   slug: "imie-nazwisko",
  //   name: "Imię",
  //   photo: { src: "/team/imie-nazwisko.webp", alt: "…", width: 800, height: 1000 },
  //   specialization: "…",
  //   levels: ["Liceum / technikum — rozszerzenie"],
  //   bio: "…",
  // },
];
