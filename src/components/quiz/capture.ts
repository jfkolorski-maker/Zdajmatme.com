import type { QuizAnswers } from "@/data/quiz";
import { readAttribution } from "@/lib/ads/attribution";

export const newLeadId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (Number(c) ^ ((Math.random() * 16) >> (Number(c) / 4))).toString(16));

/**
 * Early capture – the phone typed before the quiz, then the finished quiz – so a
 * visitor who never sends the final form is still a lead. Fire-and-forget: the
 * quiz never waits for it, and a failure never blocks the visitor.
 */
export function capture(stage: "phone" | "quiz", leadId: string, phone: string, answers: QuizAnswers = {}) {
  const attribution = readAttribution();
  void fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      stage,
      submissionId: leadId,
      phone,
      answers,
      pageUrl: window.location.href,
      attribution: attribution ? Object.fromEntries(Object.entries(attribution).filter(([, v]) => typeof v === "string" && v)) : undefined,
    }),
  }).catch(() => {});
}
