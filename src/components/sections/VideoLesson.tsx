"use client";

import Image from "next/image";
import { useState } from "react";
import { FadeUp, RevealText } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/icons";
import { VIDEO } from "@/data/content";
import { track } from "@/lib/ads/track";

/**
 * Przykładowa lekcja – just the title and the film. Thumbnail = the film's own YouTube thumbnail
 * (served from our domain, so nothing loads from Google until play). Bright orange frame.
 * On tap: youtube-nocookie with autoplay.
 */
export function VideoLesson({
  title = VIDEO.title,
  accent = ["lekcja"],
  youtubeId = VIDEO.youtubeId,
  poster = VIDEO.poster,
}: { title?: string; accent?: string[]; youtubeId?: string; poster?: string } = {}) {
  const [play, setPlay] = useState(false);
  return (
    <section id="lekcja" aria-labelledby="video-title" className="section-y bg-surface text-white">
      <div className="shell">
        <RevealText id="video-title" text={title} accent={accent} className="t-h2 text-center" />
        <FadeUp soft className="mx-auto mt-7 max-w-4xl md:mt-10">
          <div className="relative aspect-video overflow-hidden rounded-[22px] bg-night ring-[5px] ring-accent shadow-[0_0_0_8px_rgba(255,165,80,0.14),0_0_48px_-10px_rgba(255,165,80,0.55)] md:ring-[6px]">
            {play ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Przykładowa lekcja – film"
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
                className="group absolute inset-0 block"
                aria-label="Odtwórz przykładową lekcję (YouTube)"
              >
                <Image src={poster} alt="" fill sizes="(min-width: 896px) 896px, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                <span aria-hidden="true" className="absolute inset-0 bg-night/25 transition-colors group-hover:bg-night/15" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-accent text-night shadow-[0_18px_40px_-10px_rgba(255,165,80,0.9)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 md:h-20 md:w-20">
                    <span aria-hidden="true" className="ping absolute inset-0 rounded-full bg-accent/40" />
                    <Icon name="play" size={30} className="relative translate-x-[2px] fill-current" />
                  </span>
                </span>
              </button>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
