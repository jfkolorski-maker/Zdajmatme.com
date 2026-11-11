# Wdrożenie — ZdajMatme.com

## 0. Checklista przed uruchomieniem kampanii

- [ ] **CRM** skonfigurowany (`CRM_PROVIDER=base44` lub `webhook`) i przetestowany jednym prawdziwym zgłoszeniem — sekcja 2.
- [ ] **Dane prawne** w env (`NEXT_PUBLIC_LEGAL_*`) + weryfikacja `/polityka-prywatnosci` (miejsca `[UZUPEŁNIJ: …]`: dostawca CRM, okres przechowywania). Najlepiej przez prawnika.
- [ ] **Zespół** — uzupełnij `src/config/tutors.ts` (zdjęcia, imiona, specjalizacje, poziomy) wyłącznie prawdziwymi danymi. Uzupełnij też specjalizację/poziomy Oliwii.
- [ ] **Opinie** — tylko prawdziwe, za zgodą autorów → `src/config/testimonials.ts`. Bez nich sekcja się nie wyświetla.
- [ ] **FAQ** — Oliwia potwierdza odpowiedzi oznaczone `needsConfirmation` w `src/config/faq.ts` (informacje o postępach, start od pojedynczej lekcji).
- [ ] **Tracking** — GTM lub gtag (sekcja 3), test w Tag Assistant, konwersja `generate_lead` widoczna w Google Ads.
- [ ] **Upstash Redis** dla rate limitu / idempotency, jeśli hosting jest serverless (Vercel) — sekcja 4.
- [ ] `NEXT_PUBLIC_SITE_URL` = docelowa domena (canonical, sitemap, Open Graph, CORS).

## 1. Hosting

Zalecany **Vercel** (natywne wsparcie Next.js): import repozytorium → ustaw zmienne z `.env.example` → deploy.
Działa też każdy hosting Node 20+ (`npm run build && npm start`).

Zmienne `NEXT_PUBLIC_*` trafiają do przeglądarki — **nigdy** nie umieszczaj tam kluczy API. Klucze CRM / Resend / Upstash są tylko po stronie serwera.

## 2. CRM (Base44)

### Co zostało sprawdzone, a co nie
W tej sesji **nie było dostępu** do projektu CRM w Base44 (brak repozytorium i kluczy), więc nie mogłem przeanalizować istniejącej encji leadów ani workflow. Zamiast tworzyć drugi CRM przygotowałem **adapter**, który zapisuje lead do *istniejącej* encji i pozwala dopasować nazwy pól bez zmiany kodu.

Gwarancje przepływu (`src/app/api/leads/route.ts`):
- sukces jest pokazywany **tylko** gdy CRM potwierdził zapis (HTTP 2xx); w przeciwnym razie użytkownik widzi błąd, a dane zostają w formularzu,
- 1 automatyczny ponowny zapis przy błędach sieci / 5xx / 429,
- `idempotencyKey` (UUID z przeglądarki) — podwójne kliknięcie / retry nie tworzy duplikatu; klucz jest też zapisywany w CRM (`idempotency_key`),
- walidacja Zod po stronie serwera (te same reguły co na froncie, w tym poprawność odpowiedzi quizu dla danego etapu nauki),
- anty-spam: honeypot, minimalny czas wypełnienia, kontrola `Origin`, rate limit (5 / 10 min i 20 / dobę na IP),
- `CRM_PROVIDER=console` jest **blokowany w produkcji** — strona nie może „udawać” zapisu.

### Opcja A — Base44 Entities API (`CRM_PROVIDER=base44`)
```
POST {BASE44_API_URL}/apps/{BASE44_APP_ID}/entities/{BASE44_LEAD_ENTITY}
Header: api_key: {BASE44_API_KEY}
```
1. W Base44 otwórz aplikację CRM → ustawienia API: skopiuj **App ID** i **API key**.
2. Sprawdź nazwę istniejącej encji leadów (np. `Lead`) → `BASE44_LEAD_ENTITY`.
3. Porównaj pola encji z domyślnym mapowaniem (`src/server/crm/base44.ts`, `DEFAULT_MAP`). Różnice ustaw w `BASE44_FIELD_MAP`, np.:
   ```
   BASE44_FIELD_MAP={"parentName":"full_name","mainProblems":"problem","fbclid":""}
   ```
   (`""` = pole pomijane — np. gdy encja go nie ma). Pól nie dodawaj „na zapas” w CRM, jeśli nie są potrzebne.
4. `CRM_STATUS_NEW` — wartość statusu początkowego w istniejącym workflow (domyślnie `Nowy`).
5. `CRM_ASSIGNEE` — jeśli encja ma pole przypisania, wpisz identyfikator Oliwii (np. e-mail użytkownika w Base44).
6. `BASE44_ARRAYS_AS_STRING=false`, jeśli pola listowe w encji są typu array.

Zapisywane dane: leadId, data, imię rodzica, telefon (E.164), e-mail, źródło `website`, campaign source, UTM ×5, GCLID/GBRAID/WBRAID, FBCLID, landing page, referrer, typ klienta, klasa, poziom, główny problem, zagadnienia, cel, termin startu, forma kontaktu, wiadomość, status, wynik kwalifikacji (Gorący/Ciepły/Zimny + punkty i powody), historia formularza (kroki + czasy), zgoda marketingowa, data wyświetlenia klauzuli.

> Jeśli wersja API Base44 w Waszym koncie różni się od powyższej, ustaw właściwy `BASE44_API_URL` lub użyj opcji B.

### Opcja B — webhook / funkcja backendowa Base44 (`CRM_PROVIDER=webhook`)
Jeśli w CRM istnieje już funkcja backendowa tworząca leada (z własnym workflow, przypisaniem itp.), wskaż ją w `CRM_WEBHOOK_URL`. Body = pełny `LeadRecord` (JSON). Nagłówki:
- `X-ZM-Signature: sha256=<HMAC-SHA256(body, CRM_WEBHOOK_SECRET)>` — **zweryfikuj** w funkcji,
- `Idempotency-Key` — użyj do deduplikacji.
Funkcja powinna zwrócić 2xx i opcjonalnie `{ "id": "…" }`.

### E-maile (opcjonalnie, Resend)
`RESEND_API_KEY` + `EMAIL_FROM` (zweryfikowana domena). `LEAD_NOTIFY_EMAIL` — powiadomienie do Oliwii; `SEND_CONFIRMATION_EMAIL=true` — potwierdzenie do klienta. Bez konfiguracji nic nie jest wysyłane; błąd e-maila nigdy nie wpływa na zapis leada.

## 3. Tracking — GA4, Google Ads, GTM

Wybierz **jeden** tryb (`NEXT_PUBLIC_TRACKING_MODE`) — dzięki temu konwersje nie dublują się:

| Tryb | Co ładuje strona | Gdzie konfigurujesz konwersje |
|---|---|---|
| `gtm` (zalecany) | tylko GTM (`NEXT_PUBLIC_GTM_ID`) | w GTM |
| `gtag` | gtag.js + GA4 + Google Ads | w kodzie (`NEXT_PUBLIC_GADS_*`) |
| `off` | nic | — |

### Eventy (dataLayer / gtag)
| Event | Kiedy | Parametry |
|---|---|---|
| `page_view` | załadowanie strony | `page_path` |
| `cta_click` | klik w CTA | `cta_location`, `cta_target`, `path_preset` |
| `quiz_start` | pierwsza odpowiedź | `path_preset` |
| `quiz_step_complete` | każdy krok | `step_id`, `step_number`, `total_steps` |
| `quiz_complete` | ostatni krok | `total_steps`, `lead_tier` |
| `lead_form_start` | pierwszy focus w formularzu | — |
| `lead_form_submit` | próba wysłania (poprawne dane) | — |
| **`generate_lead`** | **dopiero po potwierdzeniu zapisu w CRM** | `lead_id`, `value`, `currency` |
| **`click_to_call`** | klik w numer telefonu | `cta_location` |
| `tutor_profile_view` | karta korepetytora w ≥60% widoczna | `tutor_slug` |

Uwagi: `cta_click` zapisany małymi literami (konwencja GA4). Do analityki **nie trafiają** dane osobowe ani odpowiedzi o uczniu (dodatkowy filtr w `lib/tracking.ts`). `lead_id` to losowy identyfikator, służy do deduplikacji konwersji.

### Konfiguracja GTM (tryb `gtm`)
1. Tag **Google tag** (GA4, `G-…`) — wyzwalacz: Initialization – All Pages. Nie twórz osobnego tagu dla eventu `page_view` (Google tag wysyła go sam).
2. Tag **GA4 Event** `{{Event}}` — wyzwalacz: Custom Event, regex `^(cta_click|quiz_start|quiz_step_complete|quiz_complete|lead_form_start|lead_form_submit|generate_lead|click_to_call|tutor_profile_view)$`; parametry ze zmiennych Data Layer.
3. Tag **Google Ads Conversion Tracking** (lead) — wyzwalacz: Custom Event `generate_lead`; Transaction ID = `{{DLV - lead_id}}`.
4. Tag **Google Ads Conversion** (telefon) — wyzwalacz: Custom Event `click_to_call` (konwersja dodatkowa, „Secondary”).
5. **Conversion Linker** — All Pages.
6. W Google Ads ustaw `generate_lead` jako konwersję **główną**, `click_to_call` jako dodatkową. Kliknięcie CTA ≠ sprzedaż — nie importuj `cta_click` jako konwersji.

### Tryb `gtag`
Ustaw `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GADS_ID` (`AW-…`), `NEXT_PUBLIC_GADS_LEAD_LABEL`, `NEXT_PUBLIC_GADS_CALL_LABEL` (etykiety z Google Ads → Konwersje → Konfiguracja tagu).

### Consent Mode v2
Domyślnie wszystko `denied` (skrypt w `<head>` przed tagami). Baner (akceptuj / odrzuć / ustawienia) aktualizuje zgody; link „Ustawienia cookies” w stopce otwiera go ponownie.
`NEXT_PUBLIC_CONSENT_MODE=basic` (domyślnie) — tagi ładują się dopiero po zgodzie; `advanced` — ładują się od razu z pingami bez cookies (decyzja prawna po Waszej stronie).

### Enhanced conversions
`NEXT_PUBLIC_ENHANCED_CONVERSIONS=true` → po zgodzie reklamowej strona dołącza **zahashowane SHA-256** e-mail i telefon:
- tryb `gtm`: `enhanced_conversion_data` w evencie `generate_lead` → w GTM zmienna „User-Provided Data” (Code / Data Layer) podpięta **tylko** pod tag Google Ads,
- tryb `gtag`: `gtag('set','user_data', …)` przed konwersją.
Włącz także enhanced conversions w ustawieniach konwersji Google Ads i zaakceptuj warunki. Nigdy nie mapuj tych danych do GA4.

### UTM / GCLID
Parametry `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid` są zapamiętywane w sessionStorage (na potrzeby zgłoszenia), a po zgodzie reklamowej przez 90 dni w localStorage. Wysyłane z leadem do CRM. Zalecane w Google Ads: auto-tagging + szablon śledzenia z UTM.

## 4. Rate limit i idempotency
Domyślnie pamięć procesu (OK dla jednego serwera Node). Na Vercel / serverless ustaw **Upstash Redis**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (darmowy plan wystarcza).

## 5. SEO
- Title, description, canonical, Open Graph (+ generowany obraz `/opengraph-image`), Twitter card — `src/app/layout.tsx`, `src/lib/seo.ts`.
- JSON-LD: EducationalOrganization, Service (Offer 110 PLN / 60 min), WebPage, FAQPage.
- `/sitemap.xml`, `/robots.txt` (blokada `/api/`). Breadcrumbs pominięte — to strona jednopoziomowa.
- Hierarchia: jeden H1 w Hero, H2 dla sekcji, H3 w kartach/FAQ.
Po wdrożeniu: Google Search Console → dodaj domenę i sitemapę.

## 6. Wydajność i dostępność
- LCP: H1 renderowany statycznie, animacja wejścia w CSS (bez czekania na JS); zdjęcie Hero `priority` + AVIF/WebP + `sizes`.
- Quiz (z formularzem) ładowany dynamicznie dopiero przy zbliżeniu do sekcji lub kliknięciu CTA.
- Motion przez `LazyMotion` (`domAnimation`); `prefers-reduced-motion` respektowane globalnie (CSS + `MotionConfig`); na mobile spokojniejsze animacje.
- Brak poziomego scrolla (sprawdzone: 360, 390, 430, 768, 1440, 1920 px); sticky CTA na mobile chowa się nad Hero, quizem i stopką.
- Pola formularza z właściwymi typami (`tel`, `email`, `autocomplete`), font 16 px (bez zoomu na iOS), focus widoczny, `aria-*` dla błędów.

## 7. Edycja treści
| Co | Gdzie |
|---|---|
| Telefon, cena, imię właścicielki | `src/config/site.ts` |
| Pytania quizu i logika warunkowa | `src/config/quiz.ts` (+ testy `quiz.test.ts`) |
| Korepetytorzy | `src/config/tutors.ts` + zdjęcia w `public/team/` |
| Opinie | `src/config/testimonials.ts` |
| FAQ | `src/config/faq.ts` |
| Scoring leada (Gorący/Ciepły/Zimny) | `qualify()` w `src/config/quiz.ts` |

## 8. Testy
- `npm test` — 23 testy: logika warunkowa quizu, czyszczenie odpowiedzi, scoring, walidacja telefonu/e-maila, zasada „niepełnoletni uczeń → dane rodzica”, mapowanie Base44.
- E2E (Playwright, wykonane podczas budowy): pełny przepływ quiz → wynik → walidacja → wysyłka → ekran sukcesu, presety ścieżek, przekazanie UTM/GCLID do API, brak błędów konsoli, brak overflow na 6 szerokościach.
