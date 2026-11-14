"use client";
import { forwardRef } from "react";
import { m } from "motion/react";
import { chapterLabel, chapterNo, chapterTotal } from "@/config/chapters";

const ENTER = { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };

interface Props extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  id: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** extra content under the lead, still inside the centered header */
  headerExtra?: React.ReactNode;
}

/**
 * Chapter = one section. Same header everywhere:
 * vertical line + dot → kicker "03 / 07 — Dopasowanie" → centered H2 → 1–2 sentence lead.
 * Sections are separated by a hairline only (no overlaps, no negative margins, no scroll-snap).
 */
export const Chapter = forwardRef<HTMLElement, Props>(function Chapter({ id, title, lead, headerExtra, children, className = "", ...rest }, ref) {
  return (
    <section ref={ref} id={id} data-chapter={id} aria-labelledby={`${id}-title`} className={`section ${className}`} {...rest}>
      <div className="container-x">
        <m.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={ENTER}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <span aria-hidden className="flex flex-col items-center">
            <span className="h-8 w-px bg-gradient-to-b from-transparent to-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_0_4px_rgb(255_201_40/0.15)]" />
          </span>
          <p className="kicker kicker-plain mt-4 text-yellow-300">
            {chapterNo(id)} / {chapterTotal()} — {chapterLabel(id)}
          </p>
          <h2 id={`${id}-title`} className="h2 mt-3 text-white">
            {title}
          </h2>
          {lead && <div className="lead mt-4 max-w-2xl text-white/75">{lead}</div>}
          {headerExtra}
        </m.header>
        <div className="mt-8 lg:mt-12">{children}</div>
      </div>
    </section>
  );
});
