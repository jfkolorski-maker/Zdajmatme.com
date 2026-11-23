# ZdajMatme.com — landing pod Google Ads (silnik FLIPOR)

Układ, treści, zdjęcia i kolory z **zdajmatme.com**; animacje, kafelki, mobilność i backend z **malowanie.flipor.pl**
(repo `jfkolorski-maker/Malowanie-wnetrz-strona-`). Specyfikacja: [`docs/PROMPT-zdajmatme-silnik-flipor.md`](docs/PROMPT-zdajmatme-silnik-flipor.md).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Motion · Zod · Poppins (self-hosted)

```bash
npm install
cp .env.example .env.local   # LEAD_WEBHOOK_URL – bez niego formularz pokazuje błąd i telefon
npm run dev
```
Sprawdzenia: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## Kolejność strony (= zdajmatme.com)
| # | Rozdział | Plik | Wzorzec FLIPOR |
|---|---|---|---|
| — | Hero „Matematyka w końcu staje się prosta/łatwa/intuicyjna” | `sections/Hero.tsx` | pełny ekran na telefonie, H1 bez JS, wejście CSS |
| 01 | Przykładowa lekcja (YouTube) | `sections/VideoLesson.tsx` | fasada – film ładuje się dopiero po kliknięciu |
| 02 | Wybierz ścieżkę (3 oferty) | `sections/Offer.tsx` | rail ze snapem na telefonie, 3 kolumny na desktopie, `ImageReveal` |
| 03 | Proces nauczania (4 etapy) | `sections/Process.tsx` | stos kart (1 przesunięcie = 1 karta) / „stories” na desktopie |
| 04 | Umów pierwszą lekcję próbną | `sections/QuizSection.tsx`, `quiz/*` | quiz-aplikacja + formularz |
| 05 | Jak uczymy? | `sections/Standard.tsx` | kafelki `dtile` |
| 06 | Spokój i pewność dla każdego rodzica | `sections/Parents.tsx` | akordeon |
| 07 | Uczymy inaczej (O nas) | `sections/About.tsx` | zdjęcie + lista |
| 08 | FAQ | `sections/Faq.tsx` | akordeon |
| 09 | Gotowy na zmianę? | `sections/FinalCta.tsx` | duży numer telefonu |

Treści: `src/data/content.ts` · quiz: `src/data/quiz.ts` · dane firmy: `src/config/brand.ts` · ruch: `src/lib/motion.ts`.

## Quiz (3–6 pytań)
Czego szukasz? → Dla kogo? → (etap nauki – tylko korepetycje) → (poziom – liceum / kurs maturalny) → (cel – tylko korepetycje) → Kiedy start? → cena 110 zł / 60 min (korepetycje) lub informacja o kursie → formularz (imię, telefon, e-mail opc., godziny opc., wiadomość opc., oświadczenie 18+/rodzic przy uczniu, zgoda RODO, zgoda marketingowa opc.). Karty oferty ustawiają pierwszą odpowiedź.

## Leady — `POST /api/leads`
Zod (klient + serwer), honeypot (`hp_x7q` → cicha odpowiedź `ok`), idempotencja `submissionId:stage`, limit 12 / 10 min / IP, webhook `LEAD_WEBHOOK_URL` z `X-Webhook-Secret` i `Idempotency-Key`, timeout 25 s, wymagane `{"ok":true}` od Google Apps Script. Payload: status „Nowy”, `source` (google_ads / meta_ads / website), oferta, etap, poziom, cel, start, godziny, UTM + gclid/gbraid/wbraid/fbclid, zgody.

## Tracking
`NEXT_PUBLIC_GADS_ID` (+ etykiety) i/lub `NEXT_PUBLIC_META_PIXEL_ID`. Eventy: `phone_click`, `cta_click`, `quiz_start`, `quiz_step` (bez treści odpowiedzi), `quiz_complete`, `lead_form_start`, `lead_submit` (→ `generate_lead` + konwersja Ads, Meta `Lead`). Consent Mode v2 – domyślnie „denied”, baner tylko gdy ustawiono ID.

## Przed startem kampanii
- `LEAD_WEBHOOK_URL` (+ sekret) – CRM ZdajMatme.
- Dane firmy (`NEXT_PUBLIC_LEGAL_*`) i weryfikacja `/polityka-prywatnosci`, `/regulamin` (pola `[UZUPEŁNIJ]`).
- ID Google Ads / Meta i etykiety konwersji.
- Potwierdzić (TODO w `content.ts`): zdanie o ograniczonej liczbie miejsc w grupach; „zdaj maturę na 100%” zostało złagodzone.
