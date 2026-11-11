# Hero video — prompty, montaż, eksport

Cel: ~8 s pętla. Problem ucznia (frustracja) → płynne przejście kamery i światła → Oliwia spokojnie tłumaczy (zrozumienie).
Strona jest gotowa (`src/components/sections/HeroMedia.tsx`). Wystarczy wrzucić pliki do `public/video/` i ustawić `enabled: true` w `src/config/hero.ts`.

Generujemy **dwa ujęcia** w narzędziu AI video (np. Kling, Veo, Runway, Higgsfield). Każde ujęcie w dwóch kadrach:
**9:16 (mobile)** i **16:9 (desktop)**. Najlepiej generować osobno, a nie przycinać 16:9 do pionu.

## Zasady kadru (ważne dla czytelności tekstu)
- **Mobile 9:16:** twarz i akcja w **górnych 55%** kadru. Dolne ~40% spokojne i ciemne (biurko w cieniu): tam leży nagłówek i przyciski.
- **Desktop 16:9:** postać w **prawej 1/3–1/2** kadru. Lewa strona to spokojna, ciemniejsza przestrzeń pod tekst.
- Paleta: głęboki granat (#061A33) w cieniach, ciepłe złote/żółte światło lampy (#FFD43B) jako akcent. Bez dźwięku.

## Ujęcie A — problem ucznia (0–4 s)

**Prompt (EN — modele lepiej rozumieją angielski):**
```
Cinematic realistic shot, a 17-year-old high school boy with messy brown hair in a navy hoodie sits at a wooden desk
in a dim evening study room, open math notebook and pen, laptop, a whiteboard behind him with a quadratic function
graph and the formula Δ = b² − 4ac. He tries to solve a problem, stops, stares at the notebook, slightly shakes his
head in quiet frustration, puts the pen down and rubs his forehead. Subtle, natural micro-expressions, natural skin
texture. Slow cinematic push-in towards his face. Deep navy blue shadows, single warm desk lamp, soft depth of field,
shallow focus, 35mm lens, high-end commercial look, realistic human movement. In the last second the camera starts a
slow lateral truck to the right, passing behind the edge of a dark bookshelf in the foreground.
```
**Negative prompt:**
```
cartoon, CGI look, plastic skin, exaggerated acting, crying, text artifacts, extra fingers, distorted hands,
warped notebook text, flicker, fast camera, cuts, logos, watermark
```
Długość 5 s (użyjemy ~4 s). Kadry: 9:16 i 16:9 (dla 16:9 dopisz: *"subject placed on the right third of the frame, empty dark space on the left"*).

## Ujęcie B — Oliwia rozwiązuje problem (4–8 s)

Użyj trybu **image-to-video** ze zdjęciem Oliwii (`public/team/oliwia-siedlec.webp`) jako referencją postaci, żeby wyglądała jak na stronie.
**Wymagana zgoda Oliwii** na generowanie jej wizerunku AI w reklamach.

**Prompt (EN):**
```
Continuation of the same film. The camera finishes a slow lateral truck to the right, emerging from behind the edge of
a dark bookshelf in the foreground, and reveals a young female math tutor with long wavy brown hair in a light blue
striped shirt at a bright, tidy desk with a laptop, notebook and plants; a whiteboard behind her shows a quadratic
function f(x) = ax² + bx + c with a parabola. She is teaching an online 1:1 lesson: she smiles naturally, makes a calm,
subtle explaining gesture with one hand towards the screen, nods slightly. Trustworthy, competent, warm, not a TV-ad
actress. Lighting gradually shifts from cool navy to soft warm golden light. Natural skin texture, realistic movement,
soft depth of field, 35mm lens, premium educational brand film.
```
**Negative prompt:** jak w ujęciu A + `overacting, big toothy grin, thumbs up, looking like a stock photo model`.

## Połączenie ujęć (montaż)
1. **Ukryte cięcie na ruchu kamery (foreground wipe):** A kończy się ruchem w prawo za ciemną krawędź regału, B zaczyna się wyjściem zza tej samej krawędzi. Tniemy w momencie, gdy regał zasłania kadr. To wygląda jak jedno ujęcie.
2. Na styku **cross-dissolve 8–12 klatek** (0,3–0,5 s) plus płynna zmiana koloru z chłodnego granatu na ciepłe złoto (korekcja w montażu, bez efektów).
3. **Pętla:** ostatnie ~0,4 s B ściemnij do granatu #07162E, a pierwsze ~0,4 s A rozjaśnij z granatu. Strona ma ten sam kolor tła, więc pętla jest niewidoczna.
4. Bez napisów, logotypów i dźwięku w wideo: tekst jest w HTML (SEO, dostępność, łatwe zmiany).

## Eksport (ffmpeg)
```bash
# z gotowego montażu master.mov (osobno dla 9:16 i 16:9)
ffmpeg -i master-9x16.mov -an -vf "scale=720:1280,fps=25" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good public/video/hero-mobile.webm
ffmpeg -i master-9x16.mov -an -vf "scale=720:1280,fps=25" -c:v libx264 -profile:v high -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart public/video/hero-mobile.mp4
ffmpeg -i master-16x9.mov -an -vf "scale=1920:1080,fps=25" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good public/video/hero-desktop.webm
ffmpeg -i master-16x9.mov -an -vf "scale=1920:1080,fps=25" -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart public/video/hero-desktop.mp4
# postery (pierwsza klatka)
ffmpeg -i public/video/hero-mobile.mp4 -frames:v 1 -c:v libwebp -q:v 75 public/video/hero-mobile-poster.webp
ffmpeg -i public/video/hero-desktop.mp4 -frames:v 1 -c:v libwebp -q:v 75 public/video/hero-desktop-poster.webp
```
Cele: mobile ≤ 1,5 MB (WebM), desktop ≤ 3 MB. Potem w `src/config/hero.ts` ustaw `enabled: true` i ścieżki posterów.

## Jak strona odtwarza wideo (wydajność)
- LCP to nagłówek H1 i zdjęcie (`priority`). Wideo **nie opóźnia** pierwszego ekranu, bo ładuje się dopiero po `load` i w czasie bezczynności przeglądarki.
- `autoplay muted loop playsInline`, bez kontrolek; płynne pojawienie się po starcie odtwarzania.
- Wideo nie ładuje się przy `prefers-reduced-motion`, w trybie oszczędzania danych i na łączu 2G. Wtedy zostaje zdjęcie.
- Pauza, gdy hero jest poza ekranem. Błąd pliku: automatyczny powrót do zdjęcia.

## Uwagi
- Uczeń w filmie to postać wygenerowana: nie używaj wizerunku prawdziwego niepełnoletniego bez zgody rodziców.
- Google Ads / Meta: materiały AI są dozwolone, ale nie mogą sugerować prawdziwych opinii ani wyników.
