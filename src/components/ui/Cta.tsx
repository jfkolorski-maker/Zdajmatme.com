"use client";
import type { PathPreset } from "@/config/quiz";
import { site } from "@/config/site";
import { openQuiz } from "@/lib/quiz-bus";
import { track, trackCall } from "@/lib/tracking";
import { ArrowRight, PhoneIcon } from "./Icons";

type Variant = "primary" | "dark" | "secondary";

/** Opens (and optionally pre-fills) the quiz. Always with an arrow. */
export function QuizCta({ children, location, preset, variant = "primary", className = "" }: { children: React.ReactNode; location: string; preset?: PathPreset; variant?: Variant; className?: string }) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${className}`}
      onClick={() => {
        track("cta_click", { cta_location: location, cta_target: "quiz", path_preset: preset });
        openQuiz(preset);
      }}
    >
      {children}
      <ArrowRight className="arrow" />
    </button>
  );
}

/** tel: link with the handset icon + click_to_call event. Default label = the phone number. */
export function CallCta({ location, variant = "dark", className = "", children }: { location: string; variant?: Variant; className?: string; children?: React.ReactNode }) {
  return (
    <a href={site.phone.href} className={`btn btn-${variant} ${className}`} onClick={() => trackCall(location)} aria-label={`Zadzwoń do ${site.owner.firstNameGenitive}: ${site.phone.display}`}>
      <PhoneIcon />
      {children ?? site.phone.display}
    </a>
  );
}
