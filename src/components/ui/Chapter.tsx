"use client";
import { forwardRef, useRef } from "react";
import { m, useScroll, useTransform, type Variants } from "motion/react";
import { chapterIndex, chapterNo, nextChapter, CHAPTERS } from "@/config/chapters";

const word: Variants = { hidden: { opacity: 0, y: "0.5em" }, show: { opacity: 1, y: 0 } };

type Tone = "base" | "raised" | "finale";
const TONES: Record<Tone, string> = {
  base: "bg-base",
  raised: "bg-raised",
  finale: "bg-[radial-gradient(120%_80%_at_50%_0%,#14305a_0%,#07162e_60%)]",
};

interface Props extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  id: string;
  title: React.ReactNode;
  /** plain-text title used for the word-by-word reveal; falls back to rendering `title` as-is */
  titleText?: string;
  lead?: React.ReactNode;
  tone?: Tone;
  /** hide the automatic "next chapter" link */
  noNext?: boolean;
  headerExtra?: React.ReactNode;
}

/**
 * A page "chapter": a rounded sheet that overlaps the previous one, with a numbered node on its edge,
 * a consistent H2 + lead, and a link to the next chapter so the page reads as one connected story.
 */
export const Chapter = forwardRef<HTMLElement, Props>(function Chapter(
  { id, title, titleText, lead, tone, noNext, headerExtra, children, className = "", ...rest },
  ref,
) {
  const idx = chapterIndex(id);
  const label = CHAPTERS[idx]?.label ?? "";
  const next = noNext ? undefined : nextChapter(id);
  const t: Tone = tone ?? (idx % 2 === 0 ? "raised" : "base");

  // the edge node + hairline "lock in" as the sheet arrives
  const edgeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: edgeRef, offset: ["start end", "start 35%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const nodeScale = useTransform(scrollYProgress, [0, 0.7, 1], [0.7, 1.06, 1]);

  return (
    <section
      ref={ref}
      id={id}
      data-chapter={id}
      aria-labelledby={`${id}-title`}
      className={`chapter relative -mt-8 rounded-t-[2rem] pb-24 pt-16 shadow-[0_-30px_60px_-30px_rgb(0_0_0/0.75)] sm:rounded-t-[2.75rem] sm:pt-20 lg:pb-32 ${TONES[t]} ${className}`}
      style={{ zIndex: idx + 2 }}
      {...rest}
    >
      {/* edge: hairline + numbered node */}
      <div ref={edgeRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
        <m.div style={{ scaleX: lineScale }} className="mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
      </div>
      <div className="container-x relative">
        <m.p
          style={{ scale: nodeScale }}
          className="absolute -top-[5.05rem] left-4 inline-flex h-10 origin-left items-center gap-2 rounded-full bg-yellow-400 pl-1.5 pr-4 text-sm font-extrabold text-navy-950 shadow-[0_10px_30px_-10px_rgb(255_201_40/0.8)] sm:-top-[6.3rem] sm:left-6 lg:left-8"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-950 text-[0.8125rem] text-yellow-400">{chapterNo(id)}</span>
          {label}
        </m.p>

        <m.header
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
          className="max-w-3xl"
        >
          <h2 id={`${id}-title`} className="h-section">
            {titleText
              ? titleText.split(" ").map((w, i) => (
                  <m.span key={i} variants={word} transition={{ duration: 0.55 }} className="inline-block">
                    {w}&nbsp;
                  </m.span>
                ))
              : title}
          </h2>
          {lead && (
            <m.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, delay: 0.15 }} className="lead mt-4">
              {lead}
            </m.div>
          )}
          {headerExtra}
        </m.header>

        <div className="mt-10 sm:mt-12">{children}</div>

        {next && (
          <a
            href={`#${next.id}`}
            className="group mt-14 flex min-h-14 items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left ring-1 ring-white/10 transition-colors hover:bg-white/[0.04] sm:mt-16"
          >
            <span>
              <span className="block text-[0.8125rem] font-bold uppercase tracking-wider text-text-3">Dalej</span>
              <span className="mt-0.5 block text-lg font-extrabold">
                <span className="text-yellow-400">{chapterNo(next.id)}</span> · {next.label}
              </span>
            </span>
            <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-xl transition-transform duration-300 group-hover:translate-y-1">
              ↓
            </span>
          </a>
        )}
      </div>
    </section>
  );
});
