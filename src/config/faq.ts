import { site } from "./site";

/**
 * FAQ — 5 questions parents really ask before calling. Only confirmed information.
 * (Also rendered as FAQPage JSON-LD.)
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Ile kosztuje lekcja?",
    a: `Indywidualna lekcja online 1:1 kosztuje ${site.price.amount} zł za ${site.price.minutes} minut. Wysłanie zgłoszenia i rozmowa o potrzebach ucznia są bezpłatne.`,
  },
  {
    q: "Jak wyglądają korepetycje online?",
    a: "To lekcje 1:1 — jeden uczeń i jeden korepetytor na wspólnej wirtualnej tablicy. Korepetytor tłumaczy i naprowadza, a uczeń rozwiązuje zadania krok po kroku.",
  },
  {
    q: "Dla kogo są zajęcia?",
    a: "Dla uczniów szkoły podstawowej (klasy 4–8) oraz liceum i technikum — na poziomie podstawowym i rozszerzonym. Przygotowujemy też do egzaminu ósmoklasisty i matury.",
  },
  {
    q: "Jak dobieracie korepetytora?",
    a: `${site.owner.firstName} rozmawia z Tobą o etapie nauki, poziomie, trudnych tematach i celu ucznia, a potem dobiera korepetytora z naszego zespołu.`,
  },
  {
    q: "Co się dzieje po wypełnieniu quizu?",
    a: `${site.owner.firstName} kontaktuje się z Tobą w wybranej formie, żeby omówić potrzeby ucznia i dopasować zajęcia. Nie zakładasz konta i niczego nie płacisz z góry.`,
  },
];
