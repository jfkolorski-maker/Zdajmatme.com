"use client";

import { motion } from "motion/react";
import { chapterOf, type ChapterId } from "@/data/content";
import { DUR, EASE_OUT, VIEWPORT } from "@/lib/motion";
import { FadeUp, RevealText } from "./Reveal";

/**
 * The one way every section opens. A thin line grows down from the divider
 * above (the thread that links all sections), meets a dot, then the chapter
 * number + name, the H2 (word reveal) and the lead. Centred.
 */
export function SectionHead({ chapter, kicker, title, accent, lead, id, className = "" }: { chapter?: ChapterId; kicker?: string; title: string; accent?: readonly string[]; lead?: string; id: string; className?: string }) {
  const c = chapter ? chapterOf(chapter) : null;
  return (
    <header className={`mx-auto -mt-10 max-w-2xl text-center md:-mt-[4.5rem] ${className}`}>
      <motion.div aria-hidden="true" className="mx-auto flex w-3 flex-col items-center" initial="hide" whileInView="show" viewport={VIEWPORT}>
        <motion.span
          className="block h-8 w-px origin-top bg-gradient-to-b from-white/10 to-accent-bright md:h-14"
          variants={{ hide: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: DUR.section, ease: EASE_OUT } } }}
        />
        <motion.span
          className="block h-2.5 w-2.5 rounded-full border-2 border-accent-bright bg-night"
          variants={{ hide: { scale: 0 }, show: { scale: 1, transition: { duration: DUR.ui, ease: EASE_OUT, delay: DUR.section * 0.8 } } }}
        />
      </motion.div>
      <FadeUp delay={0.2}>
        <p className="mt-4 flex items-center justify-center gap-2.5 text-[0.78rem] font-bold uppercase tracking-[0.22em]">
          {c ? (
            <>
              {/* no chapter numbers – just the name between two short lines */}
              <span className="h-px w-6 bg-accent/50" />
              <span className="text-white/75">{c.label}</span>
              <span className="h-px w-6 bg-accent/50" />
            </>
          ) : (
            <>
              <span className="h-px w-6 bg-accent/50" />
              <span className="text-white/75">{kicker}</span>
              <span className="h-px w-6 bg-accent/50" />
            </>
          )}
        </p>
      </FadeUp>
      <RevealText id={id} text={title} accent={accent ? [...accent] : undefined} className="t-h2 mt-3" delay={0.25} />
      {lead && (
        <FadeUp delay={0.35}>
          <p className="t-lead mx-auto mt-4 max-w-xl text-white/65">{lead}</p>
        </FadeUp>
      )}
    </header>
  );
}
