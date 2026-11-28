# Prompt startowy do nowego czatu – ZdajMatme.com

Skopiuj wszystko poniżej linii do nowego czatu (w sesji z dołączonym repozytorium `jfkolorski-maker/Zdajmatme.com`).

---

Kontynuujemy pracę nad stroną **ZdajMatme.com** (korepetycje i kursy z matematyki online, właścicielka: Oliwia Siedlec, tel. 730 170 804). Odpowiadaj po polsku, krótko i konkretnie. Najpierw przeczytaj `README.md` i ten plik (`docs/PROMPT-nowy-czat.md`), potem czekaj na moje polecenia.

## Projekt
- Repo: `jfkolorski-maker/Zdajmatme.com`, gałąź `main` (każdy push mirroruj też na `flipor-engine`: `git push origin main && git push origin main:flipor-engine`).
- Hosting: Vercel, produkcja: https://zdajmatme-com.vercel.app/ (auto-deploy z `main`, ~1–3 min). Po wdrożeniu sprawdź produkcję (curl/Playwright), zanim napiszesz, że jest online.
- Stara strona (źródło treści, zdjęć, filmów): https://zdajmatme.com/ (`korepetycje-indywidualne.php`, `kurs-osmoklasisty.php`, `kurs-maturalny.php`, `o-nas.php`, `kontakt.php`).
- Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 (`src/app/globals.css`: tokeny `--color-accent #ffa550`, `night #262a30`, `surface #30353d`, `header #15181c`), Motion, Zod, Poppins. Testy: `npm test` (node --test), `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Silnik wzorowany na malowanie.flipor.pl (animacje, quiz, backend leadów).

## Struktura
- `/` – strona główna (`src/app/page.tsx`, kolejność pod Google Ads): Hero (film Oliwii) → Oferta (3 karty – cała karta to link do podstrony) → Przykładowa lekcja → Proces nauczania (4 karty, na telefonie przesuwane w bok) → Opinie (`Testimonials.tsx` – talia kart: przeciąganie, strzałki, kropki, autoodtwarzanie do pierwszego dotyku; zrzuty z `public/opinie/`) → Quiz (`#zapisy`) → O nas (połączone z „Jak uczymy”) → FAQ (połączone z „Dla rodzica”) → Kontakt.
- Podstrony (przeniesione z zdajmatme.com i dopasowane stylem):
  - `/korepetycje-indywidualne` – `src/components/korepetycje/KorSections.tsx`
  - `/kurs-osmoklasisty` – `src/components/kurs8/E8Sections.tsx`
  - `/kurs-maturalny` – `src/components/matura/MaturaSections.tsx` (przełącznik poziomu `LevelSwitch` – pulsuje, dopóki ktoś nie kliknie; drugi przełącznik nad terminarzem)
  - `/o-nas` – `src/components/onas/OnasSections.tsx` (z zdajmatme.com/o-nas: podejście, cytat Oliwii, misja, oferta)
  - `/kontakt` – `src/components/kontakt/KontaktSections.tsx` (telefon, e-mail, godziny 9–18, potem quiz jako formularz)
  - Każda kończy się quizem + kontaktem; quiz zawsze startuje od pierwszego pytania (bez zapamiętywania postępu), przyciski „Zapisz się/Umów się” przewijają do `#zapisy`.
  - Wspólne elementy premium podstron: `src/components/ui/Premium.tsx` (FactList, FeatureList, PriceCard) i `src/components/ui/CourseSchedule.tsx` (terminarz). Nagłówki sekcji: `SectionHead` (kicker z kreskami).
- Menu: `NAV` w `src/data/content.ts` (O nas → `/o-nas`, Kontakt → `/kontakt`); nagłówek `src/components/layout/Header.tsx` (na telefonie menu ☰). Stopka: `Footer.tsx`.
- Treści strony głównej: `src/data/content.ts`; quiz: `src/data/quiz.ts` (+ `src/components/quiz/*`, ilustrowane ikonki `QuizArt.tsx`); marka/telefon: `src/config/brand.ts`.
- Leady: `src/app/api/leads/route.ts` → webhook `LEAD_WEBHOOK_URL` (zmienna w Vercel – **jeszcze nieustawiona przez właściciela**; bez niej formularz uczciwie pokazuje błąd i proponuje telefon).

- Dodatkowo (dyskretnie, matematyka na pierwszym planie): korepetycje z fizyki, chemii i biologii – opcja „Fizyka, chemia lub biologia” w quizie (+ pytanie o przedmiot, formularz jak 1:1, cena „ustalimy w rozmowie”), pasek „Uczymy też” (`src/components/ui/OtherSubjects.tsx`) pod ofertą na stronie głównej i na podstronie korepetycji, wzmianka w stopce.

## Ustalone zasady / preferencje
- Jeden pomarańcz: #FFA550. Tła ciemnoszare (night/surface), nagłówek ciemniejszy. Kafelki, ceny, FAQ, „Najważniejsze informacje” i terminarz: **białe karty** (jaśniej, czytelniej) z **pomarańczową obwódką** (`border-2 border-accent`, zaokrąglone ~28px). Linie podziału też pomarańczowe.
- Paski przesuwane w bok (oferta, proces, opinie): bez animacji wjazdu pojedynczych kart (podskakiwały przy przesuwaniu) – animuje się tylko cały pasek.
- Bez numeracji sekcji i etapów („01”, „Etap 01” itp.).
- „Pierwsza lekcja” (nie „lekcja próbna”). Zajęcia na **Microsoft Teams** (nie ZOOM).
- Ceny 1-na-1: 110 zł / 60 min, poziom rozszerzony 125 zł / 60 min; pakiet 10 lekcji −10% (990 / 1125 zł). Kurs 8-klasisty: 45 zł/lekcja, 890 zł cały kurs. Kurs maturalny: 45 zł, 1780 zł cały kurs.
- Kursy (E8, matura) oznaczone jako **rok szkolny 2027/2028**; na podstronach kursów boks „zapisy już otwarte”, terminarz **bez dat**.
- Numer telefonu zawsze w pomarańczowej obwódce (hero, kontakt, stopka).
- Przejście na każdą podstronę zawsze na samą górę (`data-scroll-behavior="smooth"` w `<html>`; quiz przewija stronę tylko po kliknięciu w quiz).
- Kontakt: okrągłe zdjęcie Oliwii (`public/team/oliwia-kontakt.webp`, z zdajmatme.com) w pomarańczowej obwódce, pod nim imię i nazwisko; numer telefonu pulsuje (`.phone-pulse`).
- Nie wymyślać opinii, wyników ani danych; grafiki AI oznaczać jako poglądowe. Bez danych osobowych w analityce. Nie podawać sekretów w czacie.
- Po każdej zmianie: build + szybki test na telefonie (Playwright, iPhone 13 i 320 px – brak poziomego przewijania), commit z czytelnym opisem, push na `main` i `flipor-engine`, weryfikacja produkcji.

## Otwarte sprawy (do decyzji właścicielki)
- Kurs 8-klasisty: „22 spotkania” vs „cały kurs (25 lekcji)” w cenniku – która liczba jest prawidłowa?
- Kurs maturalny: „45 zł za 60-minutową lekcję” vs „22 spotkania po 2 godziny” – czy cena ma być „za godzinę”?
- Ustawienie `LEAD_WEBHOOK_URL` w Vercel, dane firmy do polityki prywatności/regulaminu (`NEXT_PUBLIC_LEGAL_*`).
