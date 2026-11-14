"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { site } from "@/config/site";
import { openQuiz } from "@/lib/quiz-bus";
import { track, trackCall, trackingConfig } from "@/lib/tracking";
import { useConsent } from "@/lib/consent";
import { ArrowRight, PhoneIcon } from "./Icons";

/**
 * Phone-only bottom bar: "Dobierz korepetycje" + round call button.
 * Hidden while hero buttons, the quiz or the contact chapter ([data-hide-sticky]) are on screen;
 * the footer reserves space so it never covers content.
 */
export function MobileStickyCta() {
  const [blocked, setBlocked] = useState(true);
  const consent = useConsent();

  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setBlocked(visible.size > 0);
      },
      { threshold: 0.05 },
    );
    document.querySelectorAll("[data-hide-sticky]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const show = !blocked && (trackingConfig.mode === "off" || consent !== null);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-navy-950/92 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
        >
          <div className="flex gap-2.5">
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={() => {
                track("cta_click", { cta_location: "mobile_sticky", cta_target: "quiz" });
                openQuiz();
              }}
            >
              Dobierz korepetycje <ArrowRight className="arrow" />
            </button>
            <a href={site.phone.href} onClick={() => trackCall("mobile_sticky")} aria-label={`Zadzwoń do ${site.owner.firstNameGenitive}: ${site.phone.display}`} className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/[0.08] text-yellow-400 ring-1 ring-white/25">
              <PhoneIcon />
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
