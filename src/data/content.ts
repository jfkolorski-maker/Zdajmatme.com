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
  ctaQuiz: "Umów lekcję próbną",
  cue: "Zobacz naszą ofertę",
};

/** Hero trust line – facts from zdajmatme.com (offer + FAQ: ZOOM, virtual whiteboard). */
export const TRUST = ["Lekcje 1-na-1 online", "Zajęcia na ZOOM", "Kurs 8-klasisty i maturalny"];

export const VIDEO = {
  title: "Przykładowa lekcja próbna",
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
      title: "Korepetycje indywidualne online",
      text: "Elastyczne zajęcia 1-na-1 dopasowane do Twoich potrzeb. Nadrobimy zaległości.",
      cta: "Dowiedz się więcej",
      photo: { src: "/images/oferta-korepetycje.webp", alt: "Korepetycje indywidualne online", width: 1024, height: 1024 },
    },
    {
      id: "e8" as OfferId,
      anchor: "kurs-8-klasisty",
      title: "Kurs do Egzaminu Ósmoklasisty",
      text: "Intensywne przygotowanie w małej grupie. Skupiamy się na „pewniakach egzaminacyjnych” i strategiach CKE.",
      cta: "Sprawdź szczegóły kursu",
      photo: { src: "/images/oferta-kurs-8.webp", alt: "Kurs do Egzaminu Ósmoklasisty", width: 1024, height: 1024 },
    },
    {
      id: "matura" as OfferId,
      anchor: "kurs-maturalny",
      title: "Kurs Maturalny 2026",
      // TODO: potwierdzić – zdajmatme.com: „zdaj maturę na 100%” to obietnica wyniku; złagodzone do celu.
      text: "Kompleksowy kurs na poziomie podstawowym i rozszerzonym. Poznaj strategie rozwiązywania zadań i przygotuj się do matury.",
      cta: "Poznaj program maturalny",
      photo: { src: "/images/oferta-kurs-maturalny.webp", alt: "Kurs Maturalny 2026", width: 1536, height: 1024 },
    },
  ],
};

/** "Poznaj nasz proces nauczania" – four stages, verbatim from zdajmatme.com. */
export const PROCESS = [
  {
    stage: "Dostosowujemy poziom nauczania",
    title: "Tempo dopasowane do ucznia.",
    text: "Doświadczony korepetytor nie tylko tłumaczy materiał, ale też poznaje mocne i słabe strony ucznia, dopasowując tempo pracy.",
  },
  {
    stage: "Utrwalanie wiedzy po lekcji",
    title: "Zadania i stały kontakt.",
    text: "Po zajęciach uczeń otrzymuje zadania do samodzielnego ćwiczenia i ma stały kontakt z nauczycielem – w razie pytań zawsze może liczyć na wsparcie.",
  },
  {
    stage: "Regularne raporty dla rodziców",
    title: "Pełen obraz postępów.",
    text: "Rodzice regularnie dostają informacje o postępach, przerobionym materiale i zaangażowaniu dziecka.",
  },
  {
    stage: "Sukces i poczucie pewności",
    title: "Uczeń naprawdę rozumie.",
    text: "Celem jest nie tylko lepsza ocena czy zdany egzamin, ale poczucie, że uczeń naprawdę potrafi. Budujemy realne umiejętności i pewność siebie.",
  },
];

/** "Jak uczymy?" – two principles from zdajmatme.com. */
export const HOW = {
  title: "Jak uczymy?",
  accent: ["uczymy?"],
  items: [
    { icon: "book", title: "Wiedza i dobra energia", text: "Skuteczna nauka to połączenie merytoryki i dobrej energii. Dzięki nowoczesnym rozwiązaniom online lekcje są dynamiczne, wciągające i skuteczne." },
    { icon: "monitor", title: "Komfort nauki online", text: "Zajęcia prowadzimy online – dzieci i młodzież uczą się w komfortowych warunkach, bez dojazdów, korków i niepotrzebnego stresu." },
  ],
};

/** "Spokój i pewność dla każdego rodzica" – parents' questions from zdajmatme.com. */
export const PARENTS = {
  title: "Spokój i pewność dla każdego rodzica",
  accent: ["dla", "każdego", "rodzica"],
  lead: "Wiemy, jak ważny jest dla Ciebie rozwój i komfort Twojego dziecka. Stawiamy na partnerstwo, przejrzystość i realne efekty.",
  items: [
    { q: "Jak będę informowany/a o postępach dziecka?", a: "Jesteś zawsze na bieżąco. Po każdej serii zajęć otrzymasz od nas szczegółowe podsumowanie postępów, przerobionego materiału oraz obszarów, nad którymi aktualnie pracujemy. Stawiamy na pełną transparentność." },
    { q: "Kto będzie uczyć moje dziecko?", a: "Twoim dzieckiem opiekują się wyłącznie doświadczeni i zweryfikowani korepetytorzy. To pasjonaci, którzy potrafią budować relacje, motywować i tłumaczyć matematykę w przystępny, ciekawy sposób." },
    { q: "Jakie są zalety nauki w formie online?", a: "Zajęcia online to przede wszystkim oszczędność Twojego czasu i pełen komfort dla dziecka. Nauka odbywa się w znanym i bezpiecznym otoczeniu, bez stresu i logistyki związanej z dojazdami." },
  ],
};

/** "Uczymy inaczej – uczymy skutecznie" (O nas) – zdajmatme.com. */
export const ABOUT = {
  title: "Uczymy inaczej – uczymy skutecznie",
  accent: ["Uczymy"],
  lead: "Naszą misją jest nie tylko przekazywanie wiedzy, ale budowanie pewności siebie. Pokazujemy, że matematyka jest logiczna i każdy może ją zrozumieć.",
  photo: { src: "/images/o-nas.webp", alt: "Nowoczesne i przyjazne podejście do nauki matematyki online", width: 1536, height: 1024 },
  points: [
    { icon: "eye", title: "Indywidualne podejście", text: "Skupiamy się na Tobie, a nie na sztywnym programie." },
    { icon: "spark", title: "Doświadczeni nauczyciele", text: "Uczymy z pasją i potrafimy tłumaczyć najtrudniejsze zagadnienia." },
    { icon: "thumb", title: "Nowoczesne narzędzia", text: "Korzystamy z wirtualnej tablicy, dzięki czemu lekcje online są efektywne i angażujące." },
  ],
};

/** FAQ – verbatim answers from zdajmatme.com (real practice: ZOOM, recordings, payments, cancellations). */
export const FAQ = [
  {
    q: "Jak wyglądają lekcje online?",
    a: "Zajęcia odbywają się na platformie ZOOM. Korzystamy z interaktywnej wirtualnej tablicy, na której wspólnie rozwiązujemy zadania, tak jakbyśmy siedzieli obok siebie. Każdy uczeń ma możliwość aktywnego udziału w lekcji.",
  },
  {
    q: "Czy otrzymam jakieś materiały po zajęciach?",
    a: "Tak. Po każdych zajęciach kursowych otrzymujesz pracę domową do utrwalenia wiedzy oraz dostęp do nagrania z całej lekcji. Możesz powtórzyć materiał w dowolnym momencie przed egzaminem.",
  },
  {
    q: "Ile kosztuje lekcja i jak mogę zapłacić?",
    a: "Lekcja indywidualna online 1-na-1 kosztuje 110 zł za 60 minut; za lekcje indywidualne rozliczamy się po każdym miesiącu nauki. Za kursy grupowe można płacić jednorazowo (ze zniżką) lub w ratach miesięcznych. Szczegóły ustalamy indywidualnie.",
  },
  {
    q: "Co jeśli będę musiał/a odwołać lekcję?",
    a: "Prosimy o informację najpóźniej 24 godziny przed planowanym terminem lekcji indywidualnej. Wtedy zajęcia można bezpłatnie przełożyć na inny, dogodny termin.",
  },
];

export const FINAL_CTA = {
  title: "Gotowy na zmianę?",
  accent: ["zmianę?"],
  // zdajmatme.com also says „liczba miejsc w grupach jest ograniczona” – TODO: potwierdzić, dopiero wtedy dodać.
  lead: "Nie odkładaj sukcesu na później. Pierwszy krok jest najważniejszy. Skontaktuj się z nami już dziś, a pomożemy Ci osiągnąć Twój cel.",
  ctaQuiz: "Porozmawiajmy o Twoich celach",
  ctaCall: "Zadzwoń do Oliwii",
};

/** Desktop menu – labels from zdajmatme.com; each points at its place on the landing. */
export const NAV = [
  { href: "#korepetycje", label: "Korepetycje" },
  { href: "#kurs-8-klasisty", label: "Kurs 8-klasisty" },
  { href: "#kurs-maturalny", label: "Kurs Maturalny" },
  { href: "#o-nas", label: "O Nas" },
  { href: "#kontakt", label: "Kontakt" },
];

/**
 * The page as chapters – order = zdajmatme.com. One numbering for every section
 * heading and for the "where am I" label in the header.
 */
export const CHAPTERS = [
  { id: "lekcja", label: "Przykładowa lekcja", short: "Lekcja" },
  { id: "oferta", label: "Oferta", short: "Oferta" },
  { id: "proces", label: "Proces nauczania", short: "Proces" },
  { id: "zapisy", label: "Lekcja próbna", short: "Zapisy" },
  { id: "jak-uczymy", label: "Jak uczymy", short: "Metoda" },
  { id: "dla-rodzica", label: "Dla rodzica", short: "Rodzic" },
  { id: "o-nas", label: "O nas", short: "O nas" },
  { id: "faq", label: "FAQ", short: "FAQ" },
  { id: "kontakt", label: "Kontakt", short: "Kontakt" },
] as const;
export type ChapterId = (typeof CHAPTERS)[number]["id"];
export const chapterOf = (id: ChapterId) => {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return { n: String(i + 1).padStart(2, "0"), total: String(CHAPTERS.length).padStart(2, "0"), label: CHAPTERS[i].label, short: CHAPTERS[i].short };
};
