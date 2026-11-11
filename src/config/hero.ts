/**
 * Hero video configuration.
 *
 * The hero shows a cinematic loop: Scene 1 a student struggling with maths → Scene 2 camera/light
 * transition → Scene 3 Oliwia explaining (see docs/HERO-VIDEO.md for prompts & encoding).
 *
 * Until real files exist `enabled` stays false and the hero shows the still photo of Oliwia
 * (no fake "Ken Burns" motion). To switch the video on:
 *   1. put the files in /public/video/ (names below),
 *   2. set `enabled: true`.
 * If a file is missing or fails to load, the hero silently keeps the still image.
 */
export interface VideoVariant {
  webm: string;
  mp4: string;
  /** first frame of the clip (WebP/AVIF), shown until the video plays */
  poster?: string;
}

export const heroVideo: { enabled: boolean; mobile: VideoVariant; desktop: VideoVariant } = {
  enabled: false,
  // 9:16, 720×1280, ~8 s loop, no audio
  mobile: {
    webm: "/video/hero-mobile.webm",
    mp4: "/video/hero-mobile.mp4",
    poster: undefined, // e.g. "/video/hero-mobile-poster.webp"
  },
  // 16:9, 1920×1080 (or 1280×720), ~8 s loop, no audio
  desktop: {
    webm: "/video/hero-desktop.webm",
    mp4: "/video/hero-desktop.mp4",
    poster: undefined, // e.g. "/video/hero-desktop-poster.webp"
  },
};

/** Still image used before / instead of the video. */
export const heroStill = {
  src: "/team/oliwia-siedlec.webp",
  alt: "Oliwia Siedlec, założycielka ZdajMatme.com, przy biurku; w tle tablica z funkcją kwadratową",
};
