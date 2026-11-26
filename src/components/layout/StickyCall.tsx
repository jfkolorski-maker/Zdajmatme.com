"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { track } from "@/lib/ads/track";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Mobile-only action bar: "Pierwsza lekcja" + call button. Appears after the
 * hero, steps aside while the quiz / form or the final CTA are on screen,
 * keeps clear of the home indicator (safe-area inset).
 */
export function StickyCall() {
  const [heroOut, setHeroOut] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("start");
    const blockers = ["zapisy", "kontakt", "proces-stories"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<Element>();
    const io1 = new IntersectionObserver(([e]) => setHeroOut(!e.isIntersecting), { rootMargin: "-25% 0px 0px 0px" });
    const io2 = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setBlocked(visible.size > 0);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    if (hero) io1.observe(hero);
    blockers.forEach((b) => io2.observe(b));
    return () => {
      io1.disconnect();
      io2.disconnect();
    };
  }, []);

  const show = heroOut && !blocked;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sticky"
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: DUR.ui, ease: EASE_OUT }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 md:hidden"
        >
          <div className="flex items-center gap-2 rounded-full bg-surface/90 p-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-md">
            <a
              href="#zapisy"
              onClick={() => track({ name: "cta_click", placement: "sticky_bar", label: "quiz" })}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[0.98rem] font-bold text-night transition-colors active:bg-accent-bright"
            >
              Umów pierwszą lekcję
              <Icon name="arrow" size={17} />
            </a>
            <PhoneLink placement="sticky_bar" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors active:bg-white/20">
              <Icon name="phone" size={19} />
              <span className="sr-only">Zadzwoń do Oliwii</span>
            </PhoneLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
