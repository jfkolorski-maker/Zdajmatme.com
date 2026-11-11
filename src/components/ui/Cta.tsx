"use client";
import type { PathPreset } from "@/config/quiz";
import { site } from "@/config/site";
import { openQuiz } from "@/lib/quiz-bus";
import { track, trackCall } from "@/lib/tracking";
import { ArrowRight, PhoneIcon } from "./Icons";

type Variant = "primary" | "ghost-dark" | "ghost-light" | "navy";

/** Opens (and optionally pre-fills) the quiz. */
export function QuizCta({
  children,
  location,
  preset,
  variant = "primary",
  className = "",
  arrow = true,
}: {
  children: React.ReactNode;
  location: string;
  preset?: PathPreset;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
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
      {arrow && <ArrowRight className="arrow" />}
    </button>
  );
}

/** tel: link with click_to_call tracking. */
export function CallCta({
  location,
  variant = "ghost-dark",
  className = "",
  children,
}: {
  location: string;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a href={site.phone.href} className={`btn btn-${variant} ${className}`} onClick={() => trackCall(location)}>
      <PhoneIcon />
      {children ?? <>Zadzwoń do {site.owner.firstNameGenitive}</>}
    </a>
  );
}
