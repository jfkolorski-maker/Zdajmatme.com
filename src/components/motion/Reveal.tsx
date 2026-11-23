"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useIntroDone } from "./Intro";
import { DUR, EASE_OUT, STAGGER, VIEWPORT } from "@/lib/motion";

/**
 * Headline mask reveal: each word slides up from behind its own mask.
 * `immediate` plays on mount (hero) instead of on scroll.
 */
export function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
  id,
  accent,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  id?: string;
  /** Words (exact match) rendered in the accent colour. */
  accent?: string[];
}) {
  // Polish typography: a one-letter word (w, i, z, o, a, u) never ends a line – glue it to the next word.
  const words = text.split(" ").reduce<string[]>((acc, w) => {
    const prev = acc[acc.length - 1];
    if (prev !== undefined && /(^|\u00A0)\S$/u.test(prev)) acc[acc.length - 1] = `${prev}\u00A0${w}`;
    else acc.push(w);
    return acc;
  }, []);
  const ready = useIntroDone();
  const trigger = immediate ? { animate: ready ? "show" : "hide" } : { whileInView: "show", viewport: VIEWPORT };
  return (
    <Tag id={id} className={className} aria-label={text}>
      <motion.span className="block" initial="hide" {...trigger} transition={{ staggerChildren: STAGGER, delayChildren: delay }} aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${accent?.includes(w) ? "text-accent" : ""}`}
              variants={{ hide: { y: "105%" }, show: { y: "0%", transition: { duration: DUR.section, ease: EASE_OUT } } }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Block entrance: short rise + fade. */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  immediate = false,
  as = "div",
  soft = false,
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  as?: "div" | "li" | "p";
  /** Tiles: a longer, softer float-in with a slight scale. */
  soft?: boolean;
}) {
  const M = motion[as];
  const ready = useIntroDone();
  const hidden = soft ? { opacity: 0, y: 32, scale: 0.96 } : { opacity: 0, y: 24 };
  const shown = soft ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0 };
  const trigger = immediate ? { animate: ready ? shown : hidden } : { whileInView: shown, viewport: VIEWPORT };
  return (
    <M className={className} initial={hidden} {...trigger} transition={{ duration: soft ? DUR.image : DUR.section, ease: EASE_OUT, delay }}>
      {children}
    </M>
  );
}

/**
 * Cinematic photo reveal: a mask slides open while the photo stays put and
 * settles from a slight zoom. Transforms only (no clip-path) so it is
 * GPU-composited and stays smooth on phones. Uses next/image (lazy, responsive).
 */
export function ImageReveal({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "object-cover",
  priority = false,
  immediate = false,
  delay = 0,
  from = "bottom",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  immediate?: boolean;
  delay?: number;
  from?: "bottom" | "left";
}) {
  const off = (v: string) => (from === "bottom" ? { x: "0%", y: v } : { x: v, y: "0%" });
  const ready = useIntroDone();
  const trigger = immediate ? { animate: ready ? "show" : "hide" } : { whileInView: "show", viewport: VIEWPORT };
  const t = { duration: DUR.image * 1.15, ease: EASE_OUT, delay };
  return (
    <motion.div className={`relative overflow-hidden ${className}`} initial="hide" {...trigger}>
      {/* the mask moves in… */}
      <motion.div className="absolute inset-0 overflow-hidden will-change-transform" variants={{ hide: off("100%"), show: { ...off("0%"), transition: t } }}>
        {/* …while the photo moves the opposite way, so it appears to stay still */}
        <motion.div className="absolute inset-0 will-change-transform" variants={{ hide: { ...off("-100%"), scale: 1.12 }, show: { ...off("0%"), scale: 1, transition: { ...t, scale: { duration: DUR.image * 1.6, ease: EASE_OUT, delay } } } }}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={imgClassName} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Number that counts up once it scrolls into view. */
export function CountUp({ to, decimals = 0, className = "" }: { to: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduced = useReducedMotion();
  const fmt = (v: number) => v.toFixed(decimals).replace(".", ",");
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = fmt(to);
      return;
    }
    const c = animate(0, to, { duration: 1.4, ease: EASE_OUT, onUpdate: (v) => (el.textContent = fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, to]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmt(to)}
    </span>
  );
}
