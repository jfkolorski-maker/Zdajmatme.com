import { site } from "./site";

/**
 * FAQ content. Answers contain ONLY information confirmed by ZdajMatme.com.
 * Items marked `needsConfirmation` describe rules that should be confirmed by Oliwia
 * (wording is intentionally general until then).
 */
export interface FaqItem {
  q: string;
  a: string;
  needsConfirmation?: boolean;
}

export const faq: FaqItem[] = [
  {
    q: "Jak wyglądają indywidualne korepetycje online?",
    a: "To lekcje 1:1 — jeden uczeń i jeden korepetytor. Spotykacie się online i pracujecie na wirtualnej tablicy: korepetytor tłumaczy zagadnienie, a uczeń rozwiązuje zadania krok po kroku, z bieżącą pomocą i informacją zwrotną.",
  },
  {
    q: "Jak dobieracie korepetytora?",
    a: `Po wypełnieniu quizu ${site.owner.firstName} kontaktuje się z Tobą, żeby porozmawiać o potrzebach ucznia: etapie nauki, poziomie, trudnych tematach i celu. Na tej podstawie dobiera korepetytora z naszego zespołu.`,
  },
  {
    q: "Czy korepetycje są dla szkoły podstawowej i liceum?",
    a: "Tak. Prowadzimy zajęcia dla uczniów szkoły podstawowej (klasy 4–8) oraz liceum i technikum, łącznie z klasą maturalną.",
  },
  {
    q: "Czy prowadzicie matematykę podstawową i rozszerzoną?",
    a: "Tak — pracujemy zarówno z uczniami realizującymi matematykę na poziomie podstawowym, jak i rozszerzonym.",
  },
  {
    q: "Czy pomagacie w przygotowaniu do matury?",
    a: "Tak. Przygotowujemy do matury z matematyki na poziomie podstawowym i rozszerzonym: porządkujemy materiał, ćwiczymy zadania maturalne i pracujemy nad strategią rozwiązywania.",
  },
  {
    q: "Czy pomagacie w przygotowaniu do egzaminu ósmoklasisty?",
    a: "Tak. Prowadzimy indywidualne przygotowanie do egzaminu ósmoklasisty z matematyki — powtórzenie kluczowych zagadnień i systematyczne ćwiczenie zadań.",
  },
  {
    q: "Ile kosztuje lekcja?",
    a: `Indywidualna lekcja online 1:1 kosztuje ${site.price.amount} zł za ${site.price.minutes} minut.`,
  },
  {
    q: "Czy rodzic otrzymuje informacje o postępach ucznia?",
    a: `Tak, informowanie rodzica o postępach jest częścią naszej współpracy. Formę tych informacji ustalicie podczas pierwszej rozmowy.`,
    needsConfirmation: true,
  },
  {
    q: "Czy można rozpocząć naukę od pojedynczej lekcji?",
    a: `Zasady rozpoczęcia współpracy ustalamy indywidualnie. Zadzwoń pod ${site.phone.display} lub wypełnij quiz — omówimy, jaka forma będzie najlepsza dla ucznia.`,
    needsConfirmation: true,
  },
  {
    q: "Jak wygląda kontakt po wypełnieniu quizu?",
    a: `Po wysłaniu zgłoszenia ${site.owner.firstName} kontaktuje się z Tobą w wybranej przez Ciebie formie (telefon, SMS lub e-mail), żeby omówić potrzeby ucznia i dopasować zajęcia. Nie musisz zakładać konta ani niczego płacić z góry.`,
  },
];
