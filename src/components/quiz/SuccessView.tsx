"use client";
import { m } from "motion/react";
import { site } from "@/config/site";
import { CallCta } from "../ui/Cta";
import { Check } from "../ui/Icons";

export function SuccessView({ leadId, onHome, headingRef }: { leadId: string; onHome: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[2rem] bg-white px-6 py-12 text-center text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] sm:px-12 sm:py-16"
      role="status"
    >
      <m.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-yellow-400 text-navy-950 shadow-[var(--shadow-glow)]"
      >
        <Check className="h-10 w-10" strokeWidth={3} />
      </m.span>
      <h3 ref={headingRef} tabIndex={-1} className="mx-auto mt-7 max-w-xl text-3xl font-extrabold outline-none sm:text-4xl">
        Dziękujemy! To pierwszy krok do lepszej matematyki.
      </h3>
      <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-ink-muted">
        Otrzymaliśmy Twoje zgłoszenie. {site.owner.firstName} skontaktuje się z Tobą, aby omówić potrzeby ucznia i dopasować odpowiednie korepetycje.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <CallCta location="success" variant="primary">
          Zadzwoń teraz: {site.phone.display}
        </CallCta>
        <button type="button" onClick={onHome} className="btn btn-ghost-light">
          Wróć na stronę główną
        </button>
      </div>
      <p className="mt-6 text-xs font-semibold text-ink-muted">Numer zgłoszenia: {leadId}</p>
    </m.div>
  );
}
