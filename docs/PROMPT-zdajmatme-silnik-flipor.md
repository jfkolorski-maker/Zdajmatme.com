# PROMPT — ZdajMatme.com na silniku FLIPOR (landing pod Google Ads, mobile-first)

> Skopiuj cały dokument do AI / programisty. Nic nie skracaj — każda liczba poniżej jest celowa.
> Źródła: **https://zdajmatme.com/** (układ, treści, zdjęcia, kolory) oraz **https://malowanie.flipor.pl/** + repozytorium `jfkolorski-maker/Malowanie-wnetrz-strona-` (animacje, kafelki, responsywność, płynność, cały backend).

---

## 0. Rola i zadanie

Jesteś senior front-end + back-end developerem i specjalistą CRO od landing page'y Google Ads.

Zbuduj **nową wersję strony ZdajMatme.com** — jednostronicowy landing dla rodziców i uczniów szukających **indywidualnych korepetycji z matematyki online 1:1**, który przyjmuje ruch z Google Ads i zamienia go w leady przez **krótki quiz + formularz** albo **kliknięcie telefonu**.

Zasada podziału (najważniejsza reguła całego zadania):

| Element | Skąd bierzemy | Co to znaczy w praktyce |
|---|---|---|
| Układ, kolejność i rozstawienie sekcji | **zdajmatme.com** | Ta sama kolejność sekcji, te same bloki w sekcjach, ta sama hierarchia treści. |
| Treści, zdjęcia, logo, dane kontaktowe, cena | **zdajmatme.com** | Teksty i zdjęcia 1:1 (możesz skracać zdania pod mobile, nie zmieniaj faktów). |
| Kolorystyka | **zdajmatme.com** | Granat + żółty ZdajMatme (sekcja 3). Niebieski FLIPOR **nie występuje**. |
| Animacje, przejścia, płynność | **malowanie.flipor.pl** | System ruchu, odsłanianie nagłówków, stos kart, przejścia quizu — dokładnie wg sekcji 5. |
| Responsywność i mobilność | **malowanie.flipor.pl** | Mobile-first 390×844, header, dolny pasek CTA, cele dotyku, `svh`. |
| Kafelki, przyciski, karty, formularze | **malowanie.flipor.pl** | Komponenty z sekcji 4, przemalowane na kolory ZdajMatme. |
| Backend (leady, walidacja, dostarczenie, antyspam) | **malowanie.flipor.pl** | `/api/leads` + webhook + idempotencja wg sekcji 7. |
| Analityka i zgody | **malowanie.flipor.pl** | Consent Mode v2, gtag/Meta Pixel tylko po zgodzie, atrybucja gclid/UTM (sekcja 8). |

**~90% ruchu to telefony.** Projektuj najpierw na 390×844 (iPhone 13), potem rozszerzaj.

---

## 1. KROK 0 — inwentaryzacja zdajmatme.com (obowiązkowa, przed kodem)

Otwórz https://zdajmatme.com/ na 390 px i na 1440 px i przygotuj tabelę:

| # | Sekcja (kolejność) | Nagłówek H1/H2 (dosłownie) | Teksty i przyciski (dosłownie) | Zdjęcia / grafiki (plik + alt) | Uwagi o rozstawieniu |
|---|---|---|---|---|---|

Zasady:
- **Nie zmieniaj kolejności sekcji ani ich zawartości.** Zmieniasz tylko *sposób* wyświetlania i animacji (silnik FLIPOR).
- Zapisz wszystkie kolory (hex), font i logo.
- Pobierz wszystkie zdjęcia w najwyższej dostępnej jakości → `public/images/…` (konwersja do WebP/AVIF, `next/image`).
- Jeśli jakaś sekcja z zdajmatme.com łamie zasady konwersji z sekcji 2 (np. formularz z 10 polami), **nie wycinaj jej sam** — opisz problem i zapytaj.
- Jeśli czegoś nie ma na stronie (np. opinii), **nie dopisuj** — zostaw pustą strukturę.

**Dane znane z obecnego projektu ZdajMatme — potwierdź je z live stroną:**
- Marka: **ZdajMatme.com**; właścicielka i CEO: **Oliwia Siedlec** (zdjęcie: Oliwia przy biurku, tablica z funkcją kwadratową).
- Telefon: **730 170 804** (`tel:+48730170804`).
- Cena referencyjna: **110 zł / 60 min**, lekcja online 1:1.
- Oferta: szkoła podstawowa (kl. 4–8), liceum/technikum, poziom podstawowy i rozszerzony, egzamin ósmoklasisty, matura podstawowa i rozszerzona, nadrabianie zaległości.

---

## 2. Cel konwersji (Google Ads)

- **Główna konwersja:** wysłany formularz po quizie (`lead_submit` → `generate_lead` + konwersja Google Ads).
- **Druga konwersja:** klik w numer telefonu (`phone_click` → konwersja „połączenie”).
- Każdy ekran telefonu ma widoczny kontakt: header z okrągłym przyciskiem telefonu **albo** dolny pasek CTA.
- Pierwszy ekran (bez przewijania, iPhone 13): logo, H1, przycisk „Dobierz korepetycje”, numer telefonu, linijka zaufania.
- Quiz od razu dostępny — **bez podawania danych na start**. Dane kontaktowe dopiero po pytaniach.
- Ton: spokojny, konkretny, premium. Krótkie zdania, bez wykrzykników, bez emoji, bez „najlepsi w Polsce”.
- **Uczciwość (twarda zasada):** nie wymyślaj opinii, ocen, liczby uczniów, wyników egzaminów, certyfikatów ani doświadczenia. **Nie kopiuj liczb zaufania FLIPOR** („4,9/5”, „350+ zleceń”, „OC 1 mln zł”) — to dane innej firmy. Dane do potwierdzenia oznacz `// TODO: potwierdzić`.

---

## 3. Kolory — tokeny FLIPOR przemapowane na ZdajMatme

Zachowaj kolorystykę zdajmatme.com. Jeśli inwentaryzacja pokaże inne odcienie niż poniżej, wygrywa live strona — ale zachowaj **role** kolorów.

| Rola (FLIPOR) | FLIPOR | **ZdajMatme** | Użycie |
|---|---|---|---|
| navy-dark | `#031226` | `#031226` | tło strony, hero, header |
| navy | `#061a32` | `#061a32` | tło sekcji, ciemne karty, tekst na jasnym |
| akcja (blue) | `#087bff` | **`#FFC928`** (żółty) | przyciski główne, zaznaczenia, pasek postępu |
| akcent (blue-bright) | `#159bff` | **`#FFD54F`** | kickery, ikony, akcenty tekstu na ciemnym, hover |
| bg | `#f4f7fb` | `#f4f7fb` | tła w białych kartach (quiz, formularz) |
| muted | `#64748b` | `#64748b` | tekst pomocniczy na jasnym |
| line | `#e2e8f0` | `#e2e8f0` | obramowania na jasnym |

Reguły kontrastu (inaczej niż we FLIPOR, bo żółty ≠ niebieski):
- **Tekst na żółtym zawsze granatowy `#031226`, nigdy biały.** Cień przycisku: `0 14px 30px -12px rgba(255,201,40,.6)`.
- Na białych kartach żółta ramka jest za słaba → **zaznaczony kafelek:** ramka granatowa 1.5 px + `0 0 0 1px #061a32`, tło `#FFF8DB`, ikona na żółtym tle, kółko-checkbox granatowe z żółtym rysowanym ptaszkiem.
- Focus: `outline: 3px solid #FFD54F; outline-offset: 3px`. Zaznaczenie tekstu: żółte tło, granatowy tekst.
- Tekst na granacie: biały + przezroczystości 85 / 75 / 65 / 55% (min. 60% dla tekstu ≤14 px — WCAG AA).

---

## 4. Komponenty (kopiuj z FLIPOR, przemaluj kolory)

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 (`@theme`, `@utility`) + Motion (`motion/react`) + Zod 4 + `@fontsource-variable/inter` (self-hosted) + `server-only`. Bez GSAP, bez WebGL, bez jQuery.

**Typografia (utilities z `globals.css` FLIPOR, bez zmian):**
- `t-h1`: 760, `clamp(2.35rem, 8.6vw, 4.6rem)`, tracking −0.04em, line-height 1.02, `text-wrap: balance`
- `t-h2`: 760, `clamp(1.75rem, 6.8vw, 3.4rem)`, −0.04em, 1.04
- `t-h3`: 720, `clamp(1.3rem, 4.8vw, 1.75rem)`, −0.025em, 1.15
- `t-lead`: `clamp(1.06rem, 3.9vw, 1.18rem)` / 1.65; `t-body`: 1.04rem / 1.6
- `kicker`: 0.78rem, 700, UPPERCASE, tracking 0.18em, kreska 28×2 px przed tekstem
- Polska typografia: jednoliterowe słowa (w, i, z, o, a, u) sklejaj twardą spacją z następnym (jak w `RevealText`).

**Układ:** `--shell: min(1240px, 100% − 2.5rem)`. Jeden rytm sekcji `section-y`: `padding-block: 2.5rem` (mobile) / `4.5rem` (≥768 px) + `border-top: 1px solid rgba(255,255,255,.07)`. Sekcje wyśrodkowane i symetryczne. Bez nachodzących bloków.

**Przyciski** (jedna rodzina, `min-height: 3.5rem`, pigułka 999 px, `:active scale(.97)`):
- `.btn-primary` — żółte tło, granatowy tekst, hover `#FFD54F` + `translateY(-2px)`.
- `.btn-secondary` — białe, ramka 1.5 px `line`, hover ramka granatowa.
- `.btn-on-dark` — `rgba(255,255,255,.08)`, ramka `rgba(255,255,255,.25)`, hover białe tło + granatowy tekst.
- Zawsze z ikoną: strzałka → (quiz) albo słuchawka (telefon). Każdy telefon = `<PhoneLink placement="…">` (`tel:` + event).

**Kafelek quizu `.tile`:** min. wysokość 4.75rem, padding 1rem 1.1rem, radius 20 px, ramka 1.5 px `line`, białe tło; ikona `.tile-icon` 3rem × 3rem, radius 14, tło `bg`; etykieta 600, 1.02rem; po prawej kółko 28 px. Hover tylko na urządzeniach z `@media (hover: hover)`: `translateY(-2px)` + cień. Siatka: 1 kolumna na telefonie, 2 od 640 px; nieparzysty ostatni kafelek na pełną szerokość (`sm:col-span-2`).

**Ciemny kafelek `.dtile`:** radius 22, `rgba(255,255,255,.04)` + `inset 0 0 0 1px rgba(255,255,255,.08)`.

**Pola formularza:** etykieta 600 nad polem; pole min. 3.4rem, radius 14, ramka 1.5 px `line`, font 16 px (bez zoomu iOS); focus: ramka granatowa + poświata `0 0 0 4px rgba(255,201,40,.35)`; błąd: ramka `#dc2626` + komunikat `#b91c1c` pod polem; poprawny telefon: zielone „✓ Poprawny numer”.

**Ikony:** jeden zestaw liniowy (stroke 2, zaokrąglone końce), 18–22 px.

---

## 5. Animacje i płynność — silnik FLIPOR 1:1

Przenieś pliki/wzorce: `src/lib/motion.ts`, `components/motion/Reveal.tsx`, `components/motion/SectionHead.tsx`, `components/motion/Intro.tsx`, `lib/animation/*`, `lib/video.ts`.

**Stałe (`lib/motion.ts`, bez zmian):**
- `DUR = { micro: 0.2, ui: 0.38, section: 0.7, image: 0.95 }`
- `EASE_OUT = [0.16, 1, 0.3, 1]`, `EASE_IN_OUT = [0.65, 0, 0.35, 1]`
- `SPRING = { stiffness: 420, damping: 34, mass: 0.8 }`, `SPRING_SOFT = { stiffness: 180, damping: 26 }`
- `STAGGER = 0.06`, `VIEWPORT = { once: true, margin: "0px 0px -12% 0px" }`
- `<MotionConfig reducedMotion="user">` w Providerze. Animujemy **tylko `transform` i `opacity`**.

**Prymitywy (`Reveal.tsx`):**
- `RevealText` — każde słowo nagłówka wyjeżdża spod własnej maski (`y: 105% → 0`, 0.7 s, stagger 0.06), `aria-label` z pełnym tekstem.
- `FadeUp` — `y: 24 → 0` + opacity (wariant `soft`: `y: 32, scale: .96`, 0.95 s dla kafelków).
- `ImageReveal` — maska zdjęcia przesuwa się, zdjęcie przeciwnie (wygląda na nieruchome) i osiada ze skali 1.12 → 1.
- `CountUp` — liczba odlicza się raz po wejściu w kadr (1.4 s); z reduced-motion od razu wartość końcowa.

**Nagłówek-rozdział `SectionHead` (każda sekcja zaczyna się tak samo):** cienka linia rośnie w dół od separatora (`scaleY 0→1`, 0.7 s) → kropka (`scale 0→1`, obramowanie w kolorze akcentu) → kicker `03 / 07 — DOPASOWANIE` (numer akcentem, „/ 07” 35% bieli, kreska, nazwa 75%) → H2 przez `RevealText` → lead `FadeUp`. Wyśrodkowane. Numeracja rozdziałów z jednego pliku (`CHAPTERS`), ta sama w headerze.

**Header (`layout/Header.tsx`):** fixed, wysokość 68 px; na starcie `bg-navy-dark/40 + backdrop-blur-md`, po 24 px przewinięcia `bg-navy-dark/85 + blur-xl + border-white/10 + cień`. Wjazd `y: −12 → 0`. Na telefonie między logo a telefonem etykieta rozdziału (`02 · Wycena` → u nas np. `03 · Dopasowanie`), zmiana pionowym slajdem (`y: 100% → 0 → −100%`, 0.38 s). Rozdział aktywny = ten, który przecina środek ekranu (`IntersectionObserver rootMargin "-45% 0px -50% 0px"`). Desktop: menu z kropką `layoutId="nav-dot"` pod aktywnym linkiem. Pod headerem pasek postępu 2 px w kolorze akcentu (`useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.4 })`). Przycisk telefonu: żółta pigułka (mobile: sama ikona 44 px).

**Hero (`sections/Hero.tsx`):**
- Telefon: `min-height: 100svh`, zdjęcie na całą wysokość (u nas zdjęcie Oliwii / klatka filmu), cień `HERO_SHADE` (mocny tylko na dole: `rgba(3,18,38,.5) 0% → .08 16% → .12 48% → .85 100%`), tekst i przyciski na dole, wyśrodkowane, `text-shadow: 0 2px 18px rgba(3,18,38,.65)`.
- H1 malowany od pierwszej klatki (bez JS, LCP) w 2 liniach `whitespace-nowrap`: linia 1 biała, linia 2 w kolorze akcentu; pod nimi podtytuł 0.56em. **Dobierz krótkie linie** (≤ ~20 znaków na linię przy 390 px) — jeśli H1 z zdajmatme.com jest dłuższy, podziel go na linie i ewentualnie zmniejsz `clamp`, ale nie zmieniaj treści.
- Przyciski jeden pod drugim (od 640 px obok siebie): „Dobierz korepetycje →” (`btn-primary`) i numer telefonu z ikoną (`btn-on-dark`, `tabular-nums`).
- Kicker `ZDAJMATME.COM · KOREPETYCJE ONLINE` (jedna linia, `max-[400px]` mniejszy tracking) i linijka zaufania z ✓ (tylko prawdziwe fakty, np. „Lekcje online 1:1 · 110 zł / 60 min · Podstawa i rozszerzenie”).
- Wejście w CSS (`.hero-rise`, 0.7 s, opóźnienia 0.15 / 0.3 / 0.4 s), wstrzymane do końca intro (`animationPlayState`). Desktop: dyskretny wskaźnik „Zobacz, jak pracujemy” z kroplą akcentu spływającą po linii (`.scroll-cue`).

**Intro (opcjonalne, tylko gdy jest film):** `Intro.tsx` 1:1 — film 2–3 s (pion) renderowany w HTML serwera (`autoplay muted playsinline`), kończy się na klatce identycznej z tłem hero (ten sam box, cień i pozycja H1 — `HeroBody ghost`), „Pomiń” w miejscu przycisku telefonu, tap = pomiń, limit 7.5 s, zablokowane wideo → przenikanie zdjęć (1.8 s), raz na sesję, wyłączone przy reduced-motion, CSS failsafe po 8 s. **Bez filmu: pomiń intro całkowicie.**

**Etapy współpracy „Jak działamy” (`sections/Process.tsx`):**
- Telefon — **stos kart**: każda karta 4:5 `position: sticky` (top = `STACK_TOP + i × STACK_STEP`), każda następna nachodzi na poprzednią; poprzednia zmniejsza się o 5% na poziom i przyciemnia do 55% (`[data-dim]`). Stronicowanie dotykiem jak we FLIPOR: jedno przesunięcie = jedna karta, dociągnięcie po puszczeniu, nigdy dwie karty naraz, poza stosem zwykłe przewijanie, nic się nie rusza, gdy palec jest na ekranie / przy zmianie paska Safari.
- Na karcie: numer w żółtym kółku (lewy górny róg, granatowa cyfra), „3 / 5” (prawy górny róg), na dole na gradiencie: duży nagłówek w akcencie „Etap 03 / Nazwa”, biały podtytuł-obietnica, opis 75%.
- Desktop — przypięta scena (`sticky top-[68px]`, `h-[calc(100vh-68px)]`), po lewej tekst etapu i paski postępu jak „stories” (wypełnianie `scaleX` od przewijania), po prawej obraz z przenikaniem 0.9 s.
- ZdajMatme nie ma klipów etapów → `FilmLayer` tylko z obrazem/grafiką (bez `<video>`), `preload="none"` nie dotyczy.

**Quiz:** ekrany przesuwają się w bok (`x: ±28 px` + opacity, 0.38 s, kierunek wg „dalej/wstecz”), pasek segmentowy (`scaleX`, aktualny segment 0.35), kafelki wchodzą kaskadowo (0.05 s), zaznaczenie sprężyną do `scale 1.015`, `whileTap scale .97`, ptaszek rysowany (`pathLength`, 0.25 s), cena odlicza się (1.2 s).

**Zakazane:** samoczynne przewijanie/zatrzaskiwanie całej strony (`scroll-snap` na stronie), parallax na telefonie, animacje `height`/`top`/`filter`/`box-shadow` przy przewijaniu, karuzele z autoprzewijaniem, efekty „AI-glow”, pop-upy, fałszywe liczniki czasu.

---

## 6. Mobilność i responsywność (kryteria FLIPOR)

- Testuj: **320** (iPhone SE), **360** (Android), **390** (iPhone 13), **430** (Pro Max), 768, 1280, 1440. **Zero poziomego przewijania** (`body { overflow-x: clip }`).
- Wysokości pełnoekranowe w `svh` (nie `dvh`).
- Cele dotyku min. 48×48 px, przyciski główne 56 px, odstęp ≥ 10 px.
- `scroll-padding-top: 84px` (header 68 + oddech).
- **Dolny pasek CTA (`layout/StickyCall.tsx`, tylko < 768 px):** pigułka `inset-x-3`, `bottom: max(.75rem, env(safe-area-inset-bottom))`, tło `navy/90 + blur`, w środku żółty przycisk „Dobierz korepetycje →” (h 48) + okrągły przycisk telefonu (48×48). Pojawia się po wyjechaniu hero (`rootMargin -25%`), chowa się nad quizem, nad stosem kart etapów i nad kontaktem. Wjazd `y: 120% → 0`, 0.38 s.
- Klawiatura: `type="tel" inputMode="tel" autoComplete="tel"`, `type="email" inputMode="email"`, `autoComplete="given-name"`.
- iOS: wideo przez `playInline()` (ustawia atrybut `muted` + `playsinline` — React sam tego nie robi).
- Wydajność: LCP < 2.5 s na 4G, CLS < 0.05, INP < 200 ms. Zdjęcie hero `priority`, reszta lazy (`next/image`, AVIF/WebP, poprawne `sizes`). Wejście hero w CSS (bez czekania na JS). Brak ciężkich bibliotek.

---

## 7. Quiz i formularz ZdajMatme (logika na reducerze FLIPOR)

**Architektura (z FLIPOR):** `quizReducer` + `useReducer` (`answer`, `next`, `back`, `goTo`, `reset`, `hydrate`), stan w `sessionStorage` (klucz np. `zdajmatme.quiz.v1`), auto-przejście **340 ms** po wyborze pojedynczym, ukrywanie pytań, które nie mają sensu (`isHidden`), czyszczenie odpowiedzi do ukrytych pytań, po zmianie z podsumowania powrót do pierwszego otwartego pytania. Przewijanie karty do góry i focus na tytuł ekranu po każdej zmianie.

**Pytania** (przenieś z zdajmatme.com; jeśli tam ich nie ma — użyj tych; nagłówki wyśrodkowane, `t-h3`):
1. **Dla kogo szukasz korepetycji?** — Dla dziecka („Jestem rodzicem lub opiekunem”) · Dla siebie („Jestem uczniem / uczennicą”).
2. **Na jakim etapie nauki jest uczeń?** (dla „siebie”: „…jesteś?”) — Szkoła podstawowa kl. 4–6 · kl. 7–8 · Liceum/technikum kl. 1–2 · kl. 3–4 · klasa maturalna.
3. **Jaki poziom matematyki?** — Podstawowy · Rozszerzony · Nie wiem — potrzebuję pomocy w dopasowaniu. *(tylko liceum/technikum; dla podstawówki ukryte)*
4. **Co obecnie sprawia największą trudność?** *(wielokrotny wybór + przycisk „Dalej”)* — Niskie oceny i słabe wyniki · Zaległości z wcześniejszych tematów · Trudności ze zrozumieniem matematyki · Stres przed sprawdzianami · Przygotowanie do egzaminu ósmoklasisty *(tylko kl. 7–8)* · Przygotowanie do matury podstawowej *(tylko liceum)* · Przygotowanie do matury rozszerzonej *(liceum, poziom ≠ podstawowy)* · Potrzebuję regularnej pomocy w nauce.
5. **Z czym uczeń ma największy problem?** *(wielokrotny wybór, „Trudno określić” wyklucza resztę)* — podstawówka: Ułamki · Procenty · Równania · Geometria · Zadania tekstowe · Potęgi i pierwiastki · Egzamin ósmoklasisty *(kl. 7–8)* · Trudno określić; liceum: Funkcje · Funkcja kwadratowa · Równania i nierówności · Trygonometria · Ciągi · Geometria analityczna · Logarytmy · Prawdopodobieństwo i statystyka · Pochodne i optymalizacja *(poziom ≠ podstawowy)* · Zadania maturalne · Trudno określić.
6. **Jaki rezultat chcecie osiągnąć?** — Poprawić oceny · Przygotować się do egzaminu *(kl. 7–8)* · Przygotować się do matury *(liceum)* · Nadrobić zaległości · Zbudować solidne podstawy · Zwiększyć pewność siebie w matematyce.
7. **Kiedy najlepiej rozpocząć naukę?** — Jak najszybciej · W ciągu 7 dni · W ciągu 2–4 tygodni · Dopiero szukam odpowiedniego rozwiązania.

Pasek: „Pytanie X z N” + procent; dopóki etap nauki nie jest znany, N = maksymalna liczba pytań (licznik nigdy nie skacze w górę).

**Ekran podsumowania (jeden ekran, bez przewijania listy — wzór `Summary` FLIPOR):**
1. Rysowany ptaszek + „Gotowe! Oto Twoje dopasowanie.”
2. Ciemny box (`navy`, radius 22, wejście sprężyną): kicker „Lekcja online 1:1”, cena **110 zł / 60 min** z odliczaniem (zamiast widełek FLIPOR — cena jest stała), jedno zdanie: „Pomożemy uczniowi w obszarze: [wybrane zagadnienia]. Akceptujesz? Zostaw dane — Oliwia oddzwoni i dobierze korepetytora.” (to podsumowanie odpowiedzi, **nie diagnoza**).
3. Od razu formularz (karta `bg`, radius 22):
   - **Imię rodzica / opiekuna*** (albo „Twoje imię”, gdy pełnoletni uczeń),
   - **Telefon*** (normalizacja jak `normalizePhone` FLIPOR → `+48…`, „✓ Poprawny numer”),
   - **E-mail** (opcjonalnie; wymagany tylko przy wyborze kontaktu e-mailem),
   - **Preferowany kontakt**: Telefon / SMS / E-mail (segmenty),
   - **Dodatkowe informacje** (opcjonalnie, maks. 1500 znaków),
   - **Oświadczenie*** zależne od odpowiedzi 1–2: rodzic/opiekun · „Mam ukończone 18 lat” · przy uczniu niepełnoletnim dane podaje rodzic (szkoła podstawowa = zawsze niepełnoletni),
   - **Zgoda RODO*** z linkiem do `/polityka-prywatnosci`,
   - zgoda marketingowa — **opcjonalna, domyślnie odznaczona**,
   - honeypot o neutralnej nazwie (`hp_x7q`, `tabIndex=-1`, `autoComplete="off"`, `data-lpignore`, `data-1p-ignore`) — **nie** „company/firma” (przeglądarki to autouzupełniają),
   - przycisk: **„Dopasuj korepetytora →”** (spinner w trakcie, blokada podwójnego wysłania).
   - **Bez kodu pocztowego** (lekcje online).
4. Pod formularzem: link „Wolisz porozmawiać? Zadzwoń teraz”, niżej zwinięte `<details>` „Twoje odpowiedzi (N) · zmień” z chipami — klik w chip = powrót do tego pytania.
5. Sukces **tylko po `ok: true` z serwera**: duży rysowany ptaszek, „Dziękujemy! Zgłoszenie dotarło.”, „Oliwia skontaktuje się z Tobą, aby omówić potrzeby ucznia.”, przyciski „Zadzwoń teraz” / „Nowe zgłoszenie”. Błąd: czytelny komunikat + numer telefonu, dane zostają w formularzu.

---

## 8. Backend i analityka (FLIPOR 1:1, pola ZdajMatme)

**`POST /api/leads` (`runtime = "nodejs"`, `maxDuration = 30`):**
- Walidacja Zod po stronie klienta i serwera (te same schematy): `contactSchema`, `answersSchema` (enumy z pliku quizu, reguły warunkowe), `submissionId: z.uuid()`.
- Honeypot wypełniony → odpowiedz `ok: true`, ale **nic nie dostarczaj**.
- Idempotencja: klucz `${submissionId}:${stage}`, mapa `delivered` (TTL 24 h) + `inFlight` (współbieżne retry czekają na ten sam zapis).
- Limit: 12 żądań / 10 min / IP (na produkcji z wieloma instancjami — Redis/Upstash).
- Dostarczenie: `LEAD_WEBHOOK_URL` (+ `X-Webhook-Secret: LEAD_WEBHOOK_SECRET`, `Idempotency-Key`), timeout 25 s, `cache: "no-store"`. Dla Google Apps Script wymagaj w treści `{"ok": true}` (Apps Script zawsze zwraca 200). Brak URL → 503 „Formularz nie jest jeszcze podłączony. Zadzwoń…” — **nigdy fałszywy sukces**.
- Payload dla CRM ZdajMatme (Base44): leadId, data, imię, telefon (E.164), e-mail, `source` (`google_ads` przy gclid/gbraid/wbraid, `meta_ads` przy fbclid, inaczej `website`), UTM ×5, gclid/gbraid/wbraid/fbclid, landing page, typ klienta, klasa, poziom, główne trudności, zagadnienia, cel, termin startu, preferowany kontakt, wiadomość, status „Nowy”, przypisanie do Oliwii (jeśli CRM to wspiera), wynik kwalifikacji, zgody z datą. Klucze API wyłącznie w env po stronie serwera.
- Opcjonalnie (FLIPOR `capture()`): wczesny zapis etapu „quiz ukończony” z tym samym `submissionId`, żeby CRM aktualizował jeden wiersz. Włącz tylko, jeśli Oliwia chce dzwonić do niedokończonych zgłoszeń.

**Tracking (`lib/ads/track.ts`, `AdsScripts.tsx`, `ConsentBanner.tsx`, `attribution.ts`):**
- Eventy: `phone_click` (+ konwersja Ads `NEXT_PUBLIC_GADS_CALL_LABEL`, Meta `Contact`), `cta_click`, `quiz_start`, `quiz_step` (numer kroku + id pytania), `quiz_complete`, `lead_submit` (→ `generate_lead` + konwersja Ads `NEXT_PUBLIC_GADS_LEAD_LABEL` z `transaction_id` = submissionId, Meta `Lead`).
- **Bez danych osobowych i bez odpowiedzi o uczniu w analityce** (dziecko = dane wrażliwe dla rodzica) — `quiz_step` wysyła tylko numer kroku i id pytania, bez wartości.
- Consent Mode v2: domyślnie wszystko `denied` (inline przed gtag.js), baner „Tylko niezbędne / Akceptuję” pokazuje się tylko, gdy ustawiono ID; Meta `fbq('consent', 'revoke'|'grant')`.
- Atrybucja: gclid, gbraid, wbraid, fbclid, utm_* + landing page, referrer, first_seen w `sessionStorage`; nowy klik reklamy nadpisuje poprzedni.
- Env: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_PRIVACY_URL`, `NEXT_PUBLIC_GADS_ID`, `NEXT_PUBLIC_GADS_LEAD_LABEL`, `NEXT_PUBLIC_GADS_CALL_LABEL`, `NEXT_PUBLIC_META_PIXEL_ID`, `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`.

**SEO:** title z usługą („Korepetycje z matematyki online 1:1 — podstawówka, liceum, matura | ZdajMatme.com”), meta description, canonical i Open Graph z prawdziwego adresu, JSON-LD (`EducationalOrganization` + `Service` z ceną 110 PLN / 60 min + `FAQPage`), sitemap, robots, `/polityka-prywatnosci`, `/regulamin`.

---

## 9. Mapowanie sekcji (uzupełnij po KROKU 0)

Kolejność bierzesz z zdajmatme.com. Każdej sekcji przypisz wzorzec FLIPOR:

| Typ sekcji na zdajmatme.com | Wzorzec FLIPOR do użycia |
|---|---|
| Hero (zdjęcie Oliwii, H1, CTA) | `Hero` + `HeroBody` (+ `Intro`, jeśli jest film) |
| Kroki współpracy / jak działamy | `Process` (stos kart na telefonie, „stories” na desktopie) |
| Element interaktywny (np. tablica, przykład zadania) | miejsce `ColorPreview` (sekcja 02) — jeden interaktywny moduł |
| Quiz / formularz | `QuizSection` + `Quiz` + `LeadForm` |
| Zalety / zasady / „dlaczego my” | `Standard` (siatka 2×3 kafelków `dtile`, ikona + tytuł + 1–2 zdania) |
| Zespół / zdjęcia | `Gallery` (telefon: poziomy rail ze `scroll-snap-type: x mandatory`, desktop: siatka, lightbox) lub karta z `ImageReveal` |
| Liczby / dowody | `Proof` z `CountUp` — **tylko prawdziwe liczby** |
| Opinie | lista `dtile` — tylko prawdziwe, z autorem; brak = sekcja ukryta |
| FAQ | `Faq` (`<details>` w `dtile`, plus obrót o 45° przy otwarciu, pod spodem „Nie ma tu Twojego pytania? Zadzwoń”) |
| Kontakt / końcowe CTA | `FinalCta` (duży numer telefonu + „Dobierz korepetycje”) |
| Stopka | `Footer` (logo, kotwice, telefon, e-mail, Polityka prywatności, Regulamin, ustawienia cookies) |

---

## 10. Kolejność pracy

1. KROK 0 — tabela inwentaryzacji zdajmatme.com + zrzuty 390 / 1440 px.
2. Design tokens (kolory ZdajMatme w rolach FLIPOR) + typografia + komponenty.
3. Silnik ruchu (`motion.ts`, `Reveal`, `SectionHead`), header, sticky bar.
4. Sekcje w kolejności zdajmatme.com na wzorcach z tabeli w sekcji 9.
5. Quiz + formularz + ekran sukcesu.
6. Backend `/api/leads`, webhook do CRM, idempotencja, limit, honeypot.
7. Tracking + zgody + atrybucja.
8. SEO, strony prawne.
9. Testy (`node --test` dla logiki quizu, walidacji i payloadu; Playwright na emulacji iPhone 13 i Galaxy 360 px) + Lighthouse mobile.
10. README z instrukcją env i wdrożenia na Vercel.

---

## 11. Kryteria odbioru

- [ ] Kolejność sekcji, teksty, zdjęcia i kolory zgodne z zdajmatme.com (tabela z KROKU 0 odhaczona).
- [ ] Na iPhonie 13 pierwszy ekran: logo, H1, „Dobierz korepetycje”, numer telefonu, linijka zaufania — bez przewijania.
- [ ] Każda sekcja otwiera się `SectionHead` (linia → kropka → kicker „0n / N — Nazwa” → H2 słowo po słowie → lead); ta sama numeracja w headerze.
- [ ] Stos kart etapów: 1 przesunięcie = 1 karta, w obie strony; strona nigdy nie przewija się sama.
- [ ] Quiz: ukryte pytania działają, „Wstecz” działa, stan przetrwa odświeżenie, cena + formularz na jednym ekranie, sukces tylko po `ok: true`, błąd webhooka = komunikat z telefonem.
- [ ] 320 / 360 / 390 / 430 px: nic nie wystaje, brak poziomego scrolla; cele dotyku ≥ 48 px; dolny pasek nie zasłania formularza.
- [ ] LCP < 2.5 s, CLS < 0.05, INP < 200 ms (mobile, 4G); brak błędów w konsoli.
- [ ] `prefers-reduced-motion`: wszystko natychmiast, bez intro.
- [ ] Zgody: baner tylko przy skonfigurowanych ID; zgoda marketingowa domyślnie odznaczona; brak danych osobowych i odpowiedzi o uczniu w GA/Meta.
- [ ] Zero wymyślonych liczb, opinii i wyników; brak danych FLIPOR na stronie.
- [ ] Jeden granat, jeden żółty akcent, Inter, te same zaokrąglenia, odstępy i numeracja w każdej sekcji.

**Dane do podstawienia / potwierdzenia:** tabela z KROKU 0, adres URL produkcyjny, dane firmy do polityki prywatności i regulaminu (nazwa, adres, NIP, e-mail), adres webhooka CRM (Base44) i sekret, ID Google Ads + etykiety konwersji, ID Meta Pixel (jeśli używany), prawdziwe opinie i liczby (jeśli są), film do intro (jeśli jest).
