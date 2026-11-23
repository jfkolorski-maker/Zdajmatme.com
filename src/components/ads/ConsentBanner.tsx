"use client";

import { useEffect, useState } from "react";
import { TRACKING_ENABLED, updateConsent, type ConsentChoice } from "@/lib/ads/track";
import { BRAND } from "@/config/brand";

const KEY = "zdajmatme.consent";

/** Minimal cookie consent for Google Ads (Consent Mode v2). Shown only when Ads is configured. */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!TRACKING_ENABLED) return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from storage after mount
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const choose = (c: ConsentChoice) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* ignore */
    }
    updateConsent(c);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div role="dialog" aria-label="Zgoda na pliki cookies" className="fixed inset-x-3 bottom-24 z-[60] mx-auto max-w-xl rounded-3xl border border-line bg-white p-5 text-center shadow-[0_30px_80px_-30px_rgba(10,22,51,0.5)] md:bottom-6">
      <p className="text-sm leading-relaxed text-muted">
        Używamy plików cookies Google i Meta, aby mierzyć skuteczność reklam. Możesz się zgodzić lub zostać tylko przy niezbędnych.
        {BRAND.privacyUrl && (
          <>
            {" "}
            <a href={BRAND.privacyUrl} className="underline underline-offset-4">
              Polityka prywatności
            </a>
          </>
        )}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <button type="button" onClick={() => choose("denied")} className="btn btn-secondary !min-h-12 !px-5 !text-sm">
          Tylko niezbędne
        </button>
        <button type="button" onClick={() => choose("granted")} className="btn btn-primary !min-h-12 !px-5 !text-sm">
          Akceptuję
        </button>
      </div>
    </div>
  );
}
