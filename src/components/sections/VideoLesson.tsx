"use client";

import { useState } from "react";
import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { VIDEO } from "@/data/content";
import { track } from "@/lib/ads/track";

/**
 * 01 · Przykładowa lekcja – the YouTube video from zdajmatme.com behind a light facade:
 * no Google request (and no cookies) until the visitor taps play; then youtube-nocookie with autoplay.
 */
export function VideoLesson() {
  const [play, setPlay] = useState(false);
  return (
    <section id="lekcja" aria-labelledby="video-title" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead chapter="lekcja" title={VIDEO.title} lead={VIDEO.lead} id="video-title" />
        <FadeUp soft className="mx-auto mt-8 max-w-4xl md:mt-12">
          <div className="relative aspect-video overflow-hidden rounded-[22px] bg-night ring-1 ring-white/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
            {play ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${VIDEO.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Przykładowa lekcja wideo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPlay(true);
                  track({ name: "cta_click", placement: "video", label: "play" });
                }}
                className="group absolute inset-0 grid place-items-center bg-[radial-gradient(90%_80%_at_50%_40%,#2f2f2f_0%,#1a1a1a_75%)]"
                aria-label="Odtwórz przykładową lekcję (YouTube)"
              >
                <span aria-hidden="true" className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
                <span aria-hidden="true" className="math absolute left-[8%] top-[14%] text-[clamp(1rem,3.4vw,1.6rem)] text-white/25">Δ = b² − 4ac</span>
                <span aria-hidden="true" className="math absolute bottom-[14%] right-[8%] text-[clamp(1rem,3.4vw,1.6rem)] text-white/25">x₁,₂ = (−b ± √Δ) / 2a</span>
                <span className="relative flex flex-col items-center gap-3">
                  <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-accent text-night shadow-[0_18px_40px_-14px_rgba(255,165,80,0.8)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                    <span aria-hidden="true" className="ping absolute inset-0 rounded-full bg-accent/40" />
                    <Icon name="play" size={28} className="relative translate-x-[2px] fill-current" />
                  </span>
                  <span className="text-sm font-semibold text-white/80">Odtwórz lekcję · YouTube</span>
                </span>
              </button>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
