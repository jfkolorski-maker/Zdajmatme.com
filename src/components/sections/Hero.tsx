"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { BRAND } from "@/config/brand";
import { HERO, TRUST } from "@/data/content";
import { track } from "@/lib/ads/track";
import { playInline } from "@/lib/video";

const VIDEO = { mp4: "/video/hero.mp4", webm: "/video/hero.webm", poster: "/video/hero-poster.webp" };

/**
 * zdajmatme.com typewriter ("prosta" → "łatwa" → "intuicyjna"). The first word is server-rendered,
 * so the full headline is readable on the first paint and without JavaScript. Off with reduced motion.
 */
function Typewriter({ words }: { words: readonly string[] }) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0;
    let i = words[0].length;
    let deleting = true;
    let t = 0;
    const tick = () => {
      if (deleting) {
        i -= 1;
        setText(words[w].slice(0, i));
        if (i === 0) {
          deleting = false;
          w = (w + 1) % words.length;
        }
        t = window.setTimeout(tick, 70);
      } else {
        i += 1;
        setText(words[w].slice(0, i));
        if (i === words[w].length) {
          deleting = true;
          t = window.setTimeout(tick, 1800);
        } else t = window.setTimeout(tick, 110);
      }
    };
    t = window.setTimeout(tick, 2600);
    return () => window.clearTimeout(t);
  }, [words]);
  return (
    <span className="inline-flex items-baseline whitespace-nowrap text-accent">
      {text}
      <span aria-hidden="true" className="caret ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] rounded-full bg-accent" />
    </span>
  );
}

/**
 * Hero film (Oliwia + a problem solved on the tablet). Autoplays muted, inline and in a loop – the only way
 * browsers allow autoplay – with a large sound toggle. The poster (first frame) is server-rendered
 * underneath, so the first paint never waits for the video. Pauses when scrolled away.
 */
function HeroFilm({ videoRef: ref }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) void playInline(v);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!reduce || !v.muted) void v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [ref]);

  return (
    <>
      <Image src={VIDEO.poster} alt="" fill priority sizes="(min-width: 768px) 26rem, 100vw" className="object-cover" />
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
        poster={VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onPlaying={() => setPlaying(true)}
        aria-label="Film: Oliwia z ZdajMatme.com rozwiązuje zadanie z procentów na tablecie"
      >
        <source src={VIDEO.webm} type="video/webm" />
        <source src={VIDEO.mp4} type="video/mp4" />
      </video>
    </>
  );
}

/** Mute state of the hero film; the first unmute restarts it so the greeting is heard. */
function useSound(ref: React.RefObject<HTMLVideoElement | null>) {
  const [muted, setMuted] = useState(true);
  const heard = useRef(false);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      if (!heard.current) {
        heard.current = true;
        v.currentTime = 0;
      }
      void v.play().catch(() => {});
    }
    track({ name: "cta_click", placement: "hero_video", label: next ? "sound_off" : "sound_on" });
  };
  return { muted, toggle };
}

function SoundButton({ muted, onClick, className = "" }: { muted: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!muted}
      className={`h-11 items-center gap-2 rounded-full bg-black/45 px-4 text-[0.88rem] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-black/60 active:scale-95 ${className}`}
    >
      <Icon name={muted ? "soundOff" : "soundOn"} size={19} className="text-accent" />
      {muted ? "Włącz dźwięk" : "Wycisz"}
    </button>
  );
}

/** Phones: full-screen film, copy + buttons at the bottom. Desktop: copy left, the portrait film as a card on the right. */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sound = useSound(videoRef);
  return (
    <section id="start" aria-labelledby="hero-title" className="relative overflow-hidden bg-night text-white">
      <div className="md:shell md:grid md:min-h-[min(100svh,58rem)] md:grid-cols-[1fr_auto] md:items-center md:gap-14 md:pb-12 md:pt-[6.5rem]">
        {/* film: full-bleed background on phones, portrait card on desktop */}
        <div className="absolute inset-x-0 top-0 aspect-[9/16] w-full md:relative md:order-2 md:w-auto md:aspect-[9/16] md:h-[min(76svh,46rem)] md:overflow-hidden md:rounded-[24px] md:shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] md:ring-1 md:ring-white/10">
          <HeroFilm videoRef={videoRef} />
          {/* desktop: sound toggle at the bottom edge of the film card */}
          <SoundButton muted={sound.muted} onClick={sound.toggle} className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 md:inline-flex" />
          {/* phones: shade only at the bottom, where the copy sits */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(30,34,40,0.35)_0%,rgba(30,34,40,0)_14%,rgba(30,34,40,0)_46%,rgba(30,34,40,0.8)_70%,rgba(30,34,40,0.96)_100%)] md:hidden" />
        </div>

        {/* copy */}
        <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col justify-end md:order-1 md:block md:min-h-0">
          <div className="shell pointer-events-auto pb-4 pt-28 text-center [text-shadow:0_2px_16px_rgba(30,34,40,0.7)] md:w-auto md:p-0 md:text-left md:[text-shadow:none]">
            <h1 id="hero-title" aria-label={`${HERO.title} ${HERO.words[0]}`} className="font-bold leading-[1.1] tracking-[-0.03em] text-[clamp(1.6rem,6.8vw,3.4rem)] md:max-w-[34rem]">
              <span className="block">{HERO.title}</span>
              <span className="block" aria-hidden="true">
                <Typewriter words={HERO.words} />
              </span>
            </h1>
            <SoundButton muted={sound.muted} onClick={sound.toggle} className="mt-3 inline-flex md:hidden" />

            <div className="hero-rise mx-auto mt-4 grid max-w-[26rem] grid-cols-[1.3fr_1fr] gap-2 md:mx-0 md:mt-7 md:max-w-[31rem] md:grid-cols-2 md:gap-3" style={{ animationDelay: "0.15s" }}>
              <a
                href="#zapisy"
                className="btn btn-primary !min-h-12 !gap-1.5 !px-2.5 !py-2 !text-[clamp(0.76rem,3.55vw,0.9rem)] md:!min-h-14 md:!px-5 md:!text-[0.98rem]"
                onClick={() => track({ name: "cta_click", placement: "hero", label: "quiz" })}
              >
                {HERO.ctaQuiz}
                <Icon name="arrow" size={16} className="hidden shrink-0 sm:block" />
              </a>
              <PhoneLink placement="hero" className="btn btn-on-dark !min-h-12 !gap-1.5 !px-2.5 !py-2 !text-[clamp(0.76rem,3.55vw,0.9rem)] tabular-nums md:!min-h-14 md:!px-5 md:!text-[0.98rem]">
                <Icon name="phone" size={16} className="shrink-0 text-accent" />
                {BRAND.phone}
              </PhoneLink>
            </div>
            <ul aria-label="Co oferujemy" className="hero-rise mx-auto mt-3 flex max-w-[24rem] flex-wrap justify-center gap-x-3 gap-y-0.5 text-[0.74rem] text-white/80 md:mx-0 md:mt-5 md:max-w-none md:justify-start md:text-[0.85rem]" style={{ animationDelay: "0.3s" }}>
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-1 whitespace-nowrap">
                  <Icon name="check" size={12} strokeWidth={3} className="text-accent" />
                  {t}
                </li>
              ))}
            </ul>
            <a href="#oferta" className="hero-rise group mt-8 hidden items-center gap-3 text-[0.85rem] font-semibold text-white/60 transition-colors hover:text-white md:inline-flex" style={{ animationDelay: "0.5s" }} onClick={() => track({ name: "cta_click", placement: "hero", label: "offer_cue" })}>
              <span className="relative block h-px w-9 overflow-hidden bg-white/15">
                <span className="absolute inset-y-0 left-0 w-1/2 bg-accent" />
              </span>
              {HERO.cue}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
