# Hero video — placeholder

Put the encoded hero clips here (see ../../docs/HERO-VIDEO.md):

| File | Format | Size target |
|---|---|---|
| hero-mobile.webm | VP9, 720×1280 (9:16), ~8 s, no audio | ≤ 1.5 MB |
| hero-mobile.mp4 | H.264, 720×1280, ~8 s, no audio, `+faststart` | ≤ 2 MB |
| hero-desktop.webm | VP9, 1920×1080 (16:9), ~8 s, no audio | ≤ 3 MB |
| hero-desktop.mp4 | H.264, 1920×1080, ~8 s, no audio, `+faststart` | ≤ 4 MB |
| hero-*-poster.webp | first frame of each clip | ≤ 120 kB |

Then set `enabled: true` in `src/config/hero.ts`.
