# ZdajMatme.com — landing page (Google Ads)

Landing page z interaktywnym quizem kwalifikującym, formularzem leadowym, adapterem CRM (Base44), trackingiem GA4 / Google Ads / GTM i Consent Mode v2.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion (LazyMotion) · Zod 4 · Vitest

```bash
npm install
cp .env.example .env.local   # CRM_PROVIDER=console wystarczy lokalnie
npm run dev                  # http://localhost:3000
npm test                     # testy jednostkowe (logika quizu, walidacja, mapowanie CRM)
npm run build && npm start   # build produkcyjny
```

Pełna instrukcja wdrożenia: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Struktura

```
src/
  app/
    page.tsx                 strona główna (kolejność sekcji)
    layout.tsx               fonty, metadata SEO, Consent Mode, tracking
    api/leads/route.ts       POST /api/leads — walidacja, anty-spam, rate limit, idempotency, zapis do CRM
    polityka-prywatnosci/    szablon polityki prywatności (do uzupełnienia)
    sitemap.ts robots.ts opengraph-image.tsx icon.svg
  config/                    ← TU EDYTUJESZ TREŚCI
    site.ts                  telefon, cena, dane właścicielki, dane prawne
    quiz.ts                  pytania, opcje, logika warunkowa, presety ścieżek, scoring leada
    tutors.ts                zespół korepetytorów
    testimonials.ts          opinie (pusta tablica = sekcja ukryta)
    faq.ts                   FAQ
  components/
    sections/                Hero, Paths, Process, LessonDemo, Team, Faq, …
    quiz/                    Quiz, LeadForm, ResultView, SuccessView (ładowane leniwie)
    tracking/                Consent defaults/banner, skrypty GTM/gtag, Boot (UTM)
    ui/                      przyciski CTA, sticky CTA, ikony, animacje Reveal
  lib/                       tracking, atrybucja UTM/GCLID, zgody, schemat leada (wspólny front/back)
  server/                    adaptery CRM (base44, webhook, console), KV (rate limit), e-maile
```
