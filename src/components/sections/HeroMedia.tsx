"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroStill, heroVideo, type VideoVariant } from "@/config/hero";

/**
 * Hero background media.
 * - The still image is server-rendered with `priority` → it (or the H1) is the LCP element, video never delays it.
 * - The video mounts only after the page has loaded, and only when: enabled in config, no
 *   prefers-reduced-motion, no Save-Data, not on a 2G connection.
 * - Mobile (<1024px) gets the 9:16 cut, desktop the 16:9 cut (chosen once at mount).
 * - It fades in on the first `playing` event and pauses when scrolled out of view.
 */
export function HeroMedia() {
  const [variant, setVariant] = useState<VideoVariant | null>(null);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!heroVideo.enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (reduce || conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;
    const start = () => setVariant(window.matchMedia("(min-width: 1024px)").matches ? heroVideo.desktop : heroVideo.mobile);
    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 2500 });
      else setTimeout(cb, 1200);
    };
    if (document.readyState === "complete") idle(start);
    else window.addEventListener("load", () => idle(start), { once: true });
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, [variant]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-navy-950">
      {/* still image: full-bleed portrait on mobile, right-side cinematic panel on desktop */}
      <div className={`absolute inset-x-0 top-0 h-[64%] transition-opacity duration-1000 lg:inset-y-0 lg:left-auto lg:h-full lg:w-[60%] ${playing ? "opacity-0" : "opacity-100"}`}>
        <Image src={heroStill.src} alt="" fill priority fetchPriority="high" quality={60} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[55%_42%] lg:object-[50%_28%]" />
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-navy-950 to-transparent lg:block" />
      </div>

      {variant && (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          poster={variant.poster}
          onPlaying={() => setPlaying(true)}
          onError={() => setVariant(null)}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
        >
          <source src={variant.webm} type="video/webm" />
          <source src={variant.mp4} type="video/mp4" />
        </video>
      )}

      {/* readability gradients: bottom-up on mobile, left-to-right on desktop */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/20 via-navy-950/10 via-25% to-navy-950 to-[62%] lg:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-navy-950 via-navy-950/80 via-40% to-navy-950/10 lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  );
}
