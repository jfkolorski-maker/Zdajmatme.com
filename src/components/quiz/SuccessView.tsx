"use client";
import { m } from "motion/react";
import { site } from "@/config/site";
import { CallCta } from "../ui/Cta";

export function SuccessView({ leadId, onNew, headingRef }: { leadId: string; onNew: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="card-app px-5 py-10 text-center sm:px-10 sm:py-14" role="status">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-yellow-400">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#061a32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <m.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.2 }} />
        </svg>
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="h3 mt-5 text-ink outline-none">
        Dziękujemy! Zgłoszenie dotarło.
      </h3>
      <p className="mx-auto mt-3 max-w-md text-muted">
        {site.owner.firstName} skontaktuje się z Tobą, aby omówić potrzeby ucznia i dopasować korepetycje.
      </p>
      <div className="mx-auto mt-7 flex max-w-sm flex-col gap-2.5">
        <CallCta location="success" variant="primary">Zadzwoń teraz</CallCta>
        <button type="button" onClick={onNew} className="btn btn-secondary">
          Nowe zgłoszenie
        </button>
      </div>
      <p className="mt-5 text-[0.85rem] text-muted">Numer zgłoszenia: {leadId}</p>
    </m.div>
  );
}
