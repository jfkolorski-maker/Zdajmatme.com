"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { site } from "@/config/site";
import { openQuiz } from "@/lib/quiz-bus";
import { track, trackCall, trackingConfig } from "@/lib/tracking";
import { useConsent } from "@/lib/consent";
import { ArrowRight, PhoneIcon } from "./Icons";

/**
 * Mobile-only bottom bar. Hidden while any [data-hide-sticky] element (hero, quiz, footer) is on screen,
 * so it never covers the quiz, the form or the footer links. Also hidden while the consent banner is open.
 */
export function MobileStickyCta() {
  const [blocked, setBlocked] = useState(true);
  const consent = useConsent();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-hide-sticky]"));
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setBlocked(visible.size > 0);
      },
      { threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // wait for the consent banner to be dismissed so the two never overlap
  const show = !blocked && (trackingConfig.mode === "off" || consent !== null);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.35 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg md:hidden"
        >
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-primary !min-h-12 flex-1"
              onClick={() => {
                track("cta_click", { cta_location: "mobile_sticky", cta_target: "quiz" });
                openQuiz();
              }}
            >
              Dopasuj korepetycje <ArrowRight className="arrow" />
            </button>
            <a href={site.phone.href} onClick={() => trackCall("mobile_sticky")} className="btn btn-ghost-dark !min-h-12 !px-4" aria-label={`Zadzwoń: ${site.phone.display}`}>
              <PhoneIcon className="text-yellow-400" /> Zadzwoń
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
