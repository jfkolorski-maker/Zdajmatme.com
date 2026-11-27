/**
 * All page copy in one place. Texts come from zdajmatme.com (kept verbatim where possible,
 * shortened only for phones). Nothing invented: no ratings, no student counts, no results.
 */

export const HERO = {
  /** "Matematyka w końcu staje się" + typewriter word (zdajmatme.com script.js). */
  title: "Matematyka w końcu staje się",
  words: ["prosta", "łatwa", "intuicyjna"],
  lead: "Niezależnie od tego, czy przygotowujesz się do egzaminu, czy nadrabiasz zaległości – mamy kurs dla Ciebie.",
  eyebrow: "ZdajMatme.com · matematyka online",
  ctaQuiz: "Umów pierwszą lekcję",
  cue: "Zobacz naszą ofertę",
};

/** Hero trust line – facts from zdajmatme.com (offer + FAQ: Microsoft Teams, virtual whiteboard). */
export const TRUST = ["Lekcje 1-na-1 online", "Zajęcia na Teamsie", "Kurs 8-klasisty i maturalny"];

export const VIDEO = {
  title: "Przykładowa lekcja",
  youtubeId: "8fBZJu4RNss",
  /** the film's own YouTube thumbnail, stored locally */
  poster: "/video/lekcja-poster.webp",
};

export type OfferId = "indiv" | "e8" | "matura";
export const OFFER = {
  title: "Wybierz ścieżkę idealną dla siebie",
  accent: ["ścieżkę"],
  items: [
    {
      id: "indiv" as OfferId,
      anchor: "korepetycje",
      href: "/korepetycje-indywidualne",
      title: "Korepetycje indywidualne online",
      text: "Zajęcia 1-na-1 w Twoim tempie. Od 110 zł za 60 minut.",
      cta: "Zobacz korepetycje",
      photo: { src: "/images/oferta-korepetycje.webp", alt: "Korepetycje indywidualne online", width: 1024, height: 1024 },
    },
    {
      id: "e8" as OfferId,
      anchor: "kurs-8-klasisty",
      href: "/kurs-osmoklasisty",
      title: "Kurs do Egzaminu Ósmoklasisty",
      text: "Mała grupa online, pewniaki egzaminacyjne i strategie CKE. Rok szkolny 2027/2028.",
      cta: "Zobacz kurs",
      photo: { src: "/images/oferta-kurs-8-v2.webp", alt: "Uczeń rozwiązuje zadanie z egzaminu ósmoklasisty podczas lekcji online", width: 1536, height: 1024 },
    },
    {
      id: "matura" as OfferId,
      anchor: "kurs-maturalny",
      href: "/kurs-maturalny",
      title: "Kurs maturalny",
      // TODO: potwierdzić – zdajmatme.com: „zdaj maturę na 100%” to obietnica wyniku; złagodzone do celu.
      text: "Poziom podstawowy i rozszerzony. Typowe zadania maturalne i strategie ich rozwiązywania. Rok szkolny 2027/2028.",
      cta: "Zobacz kurs",
      photo: { src: "/images/oferta-kurs-maturalny-v2.webp", alt: "Uczennica przygotowuje się do matury z matematyki podczas kursu online", width: 1536, height: 1024 },
    },
  ],
};

/** "Poznaj nasz proces nauczania" – four stages (zdajmatme.com). `photo` = optional stage picture (else line art). */
export const PROCESS: { stage: string; text: string; photo?: string; alt?: string }[] = [
  {
    stage: "Dopasowujemy poziom ucznia",
    photo: "/images/proces-2.webp",
    alt: "Grafika poglądowa: lekcja online – korepetytor dopasowuje tempo do poziomu ucznia",
    text: "Poznajemy mocne i słabe strony ucznia i dopasowujemy tempo pracy.",
  },
  {
    stage: "Utrwalanie wiedzy po lekcji",
    photo: "/images/proces-1.webp",
    alt: "Grafika poglądowa: uczeń ćwiczy po lekcji i ma kontakt z nauczycielką",
    text: "Po lekcji uczeń dostaje zadania do ćwiczeń, a w razie pytań – szybką pomoc.",
  },
  {
    stage: "Regularne raporty dla rodziców",
    photo: "/images/proces-3.webp",
    alt: "Grafika poglądowa: rodzice przeglądają raport postępów ucznia",
    text: "Rodzice regularnie dostają informacje o postępach i przerobionym materiale.",
  },
  {
    stage: "Sukces i poczucie komfortu",
    photo: "/images/proces-4.webp",
    alt: "Grafika poglądowa: uczeń cieszy się z dobrego wyniku",
    text: "Lepsze oceny i zdany egzamin – a przede wszystkim pewność, że uczeń naprawdę potrafi.",
  },
];

/** "Uczymy inaczej – uczymy skutecznie" (O nas) – zdajmatme.com, merged with "Jak uczymy?". */
export const ABOUT = {
  title: "Uczymy inaczej – uczymy skutecznie",
  accent: ["Uczymy"],
  lead: "Pokazujemy, że matematyka jest logiczna i każdy może ją zrozumieć.",
  photo: { src: "/images/o-nas.webp", alt: "Nowoczesne i przyjazne podejście do nauki matematyki online", width: 1536, height: 1024 },
  points: [
    { icon: "eye", title: "Indywidualne podejście", text: "Skupiamy się na uczniu, nie na sztywnym programie." },
    { icon: "spark", title: "Doświadczeni nauczyciele", text: "Tłumaczymy trudne tematy prosto i z pasją." },
    { icon: "thumb", title: "Wirtualna tablica na Teams", text: "Rozwiązujemy zadania razem – jak przy jednym biurku." },
    { icon: "monitor", title: "Nauka z domu", text: "Bez dojazdów, korków i niepotrzebnego stresu." },
  ],
};

/** FAQ – answers from zdajmatme.com (incl. the parents' questions), shortened. */
export const FAQ = [
  {
    q: "Ile kosztuje lekcja i jak mogę zapłacić?",
    a: "Lekcja 1-na-1 kosztuje 110 zł za 60 minut, na poziomie rozszerzonym 125 zł. Za lekcje indywidualne rozliczamy się po każdym miesiącu. Kursy grupowe można opłacić jednorazowo (taniej) lub w ratach miesięcznych.",
  },
  {
    q: "Jak wyglądają lekcje online?",
    a: "Na Microsoft Teams, z wirtualną tablicą – rozwiązujemy zadania razem, tak jakbyśmy siedzieli obok siebie.",
  },
  {
    q: "Kto będzie uczyć moje dziecko?",
    a: "Wyłącznie doświadczeni i zweryfikowani korepetytorzy, którzy potrafią motywować i tłumaczyć matematykę przystępnie.",
  },
  {
    q: "Jak będę informowany/a o postępach dziecka?",
    a: "Po każdej serii zajęć dostajesz podsumowanie: postępy, przerobiony materiał i to, nad czym teraz pracujemy.",
  },
  {
    q: "Czy dostanę materiały po zajęciach?",
    a: "Tak. Po zajęciach kursowych dostajesz pracę domową i nagranie całej lekcji – możesz wrócić do niego w dowolnym momencie.",
  },
  {
    q: "Co jeśli muszę odwołać lekcję?",
    a: "Daj znać najpóźniej 24 godziny wcześniej – przełożymy lekcję indywidualną bezpłatnie na inny termin.",
  },
];

export const FINAL_CTA = {
  title: "Gotowy na zmianę?",
  accent: ["zmianę?"],
  // zdajmatme.com also says „liczba miejsc w grupach jest ograniczona” – TODO: potwierdzić, dopiero wtedy dodać.
  lead: "Zadzwoń albo zostaw numer – oddzwonimy i ustalimy pierwszą lekcję.",
  ctaQuiz: "Umów pierwszą lekcję",
};

/** Desktop menu – labels from zdajmatme.com; each points at its place on the landing. */
export const NAV = [
  { href: "/korepetycje-indywidualne", label: "Korepetycje indywidualne" },
  { href: "/kurs-osmoklasisty", label: "Kurs 8-klasisty" },
  { href: "/kurs-maturalny", label: "Kurs Maturalny" },
  { href: "/#o-nas", label: "O Nas" },
  { href: "/#kontakt", label: "Kontakt" },
];

/**
 * The page as chapters – order = zdajmatme.com. One numbering for every section
 * heading and for the "where am I" label in the header.
 */
export const CHAPTERS = [
  { id: "oferta", label: "Oferta", short: "Oferta" },
  { id: "lekcja", label: "Przykładowa lekcja", short: "Lekcja" },
  { id: "proces", label: "Proces nauczania", short: "Proces" },
  { id: "zapisy", label: "Pierwsza lekcja", short: "Zapisy" },
  { id: "o-nas", label: "O nas", short: "O nas" },
  { id: "faq", label: "FAQ", short: "FAQ" },
  { id: "kontakt", label: "Kontakt", short: "Kontakt" },
] as const;
export type ChapterId = (typeof CHAPTERS)[number]["id"];
export const chapterOf = (id: ChapterId) => {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return { n: String(i + 1).padStart(2, "0"), total: String(CHAPTERS.length).padStart(2, "0"), label: CHAPTERS[i].label, short: CHAPTERS[i].short };
};
