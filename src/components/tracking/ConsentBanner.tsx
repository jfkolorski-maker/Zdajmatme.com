"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { OPEN_CONSENT_EVENT, setConsent, useConsent } from "@/lib/consent";
import { trackingConfig } from "@/lib/tracking";

/** Non-blocking consent banner (bottom). Equal-weight "accept" / "reject" buttons as required in the EU. */
export function ConsentBanner() {
  const consent = useConsent();
  const [mounted, setMounted] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    setMounted(true);
    const open = () => {
      setForceOpen(true);
      setCustom(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  useEffect(() => {
    if (consent) {
      setAnalytics(consent.analytics);
      setAds(consent.ads);
    }
  }, [consent]);

  // no tracking configured → nothing to ask about
  if (!mounted || trackingConfig.mode === "off") return null;
  const open = forceOpen || consent === null;

  const decide = (a: boolean, d: boolean) => {
    setConsent(a, d);
    setForceOpen(false);
    setCustom(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl bg-white p-5 text-ink shadow-[var(--shadow-lift)] ring-1 ring-black/10 sm:bottom-5"
        >
          <p id="consent-title" className="font-extrabold">Szanujemy Twoją prywatność</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            Używamy plików cookies do analizy ruchu i mierzenia skuteczności reklam. Możesz je zaakceptować, odrzucić lub wybrać.{" "}
            <a href="/polityka-prywatnosci" className="font-semibold text-navy-800 underline">Więcej</a>
          </p>
          {custom && (
            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2.5">
                <span><b>Analityczne</b> — statystyki odwiedzin (Google Analytics)</span>
                <input type="checkbox" className="h-5 w-5 accent-navy-800" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2.5">
                <span><b>Reklamowe</b> — pomiar skuteczności reklam (Google Ads)</span>
                <input type="checkbox" className="h-5 w-5 accent-navy-800" checked={ads} onChange={(e) => setAds(e.target.checked)} />
              </label>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" className="btn btn-navy !min-h-11 !px-4 !text-sm" onClick={() => decide(true, true)}>
              Akceptuję wszystkie
            </button>
            <button type="button" className="btn btn-ghost-light !min-h-11 !px-4 !text-sm" onClick={() => decide(false, false)}>
              Odrzucam
            </button>
            {custom ? (
              <button type="button" className="btn btn-ghost-light col-span-2 !min-h-11 !px-4 !text-sm" onClick={() => decide(analytics, ads)}>
                Zapisz wybór
              </button>
            ) : (
              <button type="button" className="col-span-2 text-sm font-bold text-navy-800 underline underline-offset-4 sm:ml-auto" onClick={() => setCustom(true)}>
                Ustawienia
              </button>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
