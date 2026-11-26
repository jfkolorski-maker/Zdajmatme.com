/**
 * "Korepetycje indywidualne" sub-page – content carried over 1:1 from zdajmatme.com/korepetycje-indywidualne.php
 * (to be reworked later with the owner). Prices: 110 zł basic, 125 zł extended, 10-lesson package −10%.
 */
export const KOR = {
  hero: {
    title: "Indywidualne korepetycje online",
    accent: ["online"],
    lead: "Pełne skupienie tylko na Tobie. Zajęcia jeden na jeden to najlepszy sposób na dopasowanie tempa i materiału do ucznia.",
    cta: "Sprawdź cennik",
    photo: { src: "/images/kor-hero.webp", alt: "Uśmiechnięta uczennica podczas lekcji online przy laptopie" },
  },
  levels: {
    title: "Dla uczniów na każdym poziomie",
    accent: ["każdym", "poziomie"],
    items: [
      { label: "Przygotowanie do egzaminu ósmoklasisty", icon: "target" },
      { label: "Szkoła podstawowa", icon: "book" },
      { label: "Szkoła ponadpodstawowa", icon: "cap" },
      { label: "Przygotowanie do matury podstawowej", icon: "single" },
      { label: "Przygotowanie do matury rozszerzonej", icon: "two" },
    ],
  },
  forWhom: {
    title: "Dla kogo są te zajęcia?",
    accent: ["zajęcia?"],
    lead: "Dla uczniów szkół podstawowych i średnich – na każdym poziomie zaawansowania. Pomagamy:",
    items: [
      { icon: "trend", title: "Nadrobić zaległości", text: "Spokojnie i we własnym tempie uzupełnimy luki w materiale, abyś poczuł/a się pewnie na każdej lekcji w szkole." },
      { icon: "target", title: "Przygotować się do sprawdzianu", text: "Intensywnie przerobimy materiał przed ważnym testem, kartkówką czy egzaminem, skupiając się na kluczowych zadaniach." },
      { icon: "doc", title: "Odrabiać prace domowe", text: "Zapewniamy regularne wsparcie w rozwiązywaniu zadań domowych, tłumacząc krok po kroku, jak dojść do prawidłowego wyniku." },
      { icon: "star", title: "Rozwinąć swoje umiejętności", text: "Jeśli matematyka to Twoja pasja, pomożemy Ci wejść na wyższy poziom i przygotować się do konkursów i olimpiad." },
    ],
  },
  why: {
    title: "Pełna uwaga i elastyczność",
    accent: ["elastyczność"],
    photo: { src: "/images/kor-uczen.webp", alt: "Uczeń pracujący nad zadaniami z matematyki na laptopie" },
    points: [
      { icon: "eye", title: "Indywidualne podejście", text: "Cała lekcja jest poświęcona Tobie. Skupiamy się na Twoich problemach i celach." },
      { icon: "calendar", title: "Elastyczny grafik", text: "Terminy lekcji dopasowujemy do Twojego planu zajęć, a nie na odwrót." },
      { icon: "monitor", title: "Nowoczesne narzędzia", text: "Uczymy z wykorzystaniem wirtualnej tablicy, dzięki czemu nauka jest efektywna i angażująca." },
      { icon: "thumb", title: "Budowanie pewności siebie", text: "W atmosferze bez stresu i presji przełamujemy strach przed matematyką." },
    ],
  },
  pricing: {
    title: "Cennik",
    accent: ["Cennik"],
    plans: [
      {
        id: "basic",
        name: "Poziom podstawowy",
        price: "110 zł",
        unit: "za 60 minut korepetycji online",
        text: "Indywidualne zajęcia dopasowane do poziomu ucznia, jego potrzeb i aktualnych celów. Idealna opcja zarówno na regularną naukę, jak i doraźną pomoc.",
        cta: "Umów się teraz",
      },
      {
        id: "extended",
        name: "Poziom rozszerzony",
        price: "125 zł",
        unit: "za 60 minut korepetycji online",
        text: "Indywidualne zajęcia dla uczniów, którzy chcą dobrze przygotować się do matury rozszerzonej, uporządkować materiał i swobodniej radzić sobie z wymagającymi zadaniami.",
        cta: "Umów się teraz",
      },
    ],
    pack: {
      badge: "-10%",
      name: "Pakiet 10 lekcji",
      rows: [
        { level: "Poziom podstawowy", old: "1100 zł", price: "990 zł" },
        { level: "Poziom rozszerzony", old: "1250 zł", price: "1125 zł" },
      ],
      unit: "10 spotkań po 60 minut online",
      text: "Wybierz pakiet i zaplanuj naukę na dłużej, korzystając z 10% rabatu. Pakiet może być wykorzystany zarówno na zajęciach na poziomie podstawowym, jak i rozszerzonym.",
      cta: "Wybieram pakiet",
    },
  },
} as const;
