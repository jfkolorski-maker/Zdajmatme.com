import { NextResponse, type NextRequest } from "next/server";
import { deliverLead, LeadDeliveryError, toLeadShape } from "@/lib/lead/deliver";
import { leadRequestSchema, partialLeadSchema, type LeadRequest, type LeadStage } from "@/lib/lead/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Google Apps Script can take 10–20 s on a cold start. */
export const maxDuration = 30;

/* Best-effort, per-instance guards. Put a shared store (Redis/KV) behind
 * these if the site runs on many instances. The webhook also receives an
 * Idempotency-Key header so the destination can de-duplicate too. */
const delivered = new Map<string, number>();
const inFlight = new Map<string, Promise<void>>();
const hits = new Map<string, number[]>();
const DEDUPE_TTL = 24 * 60 * 60 * 1000;
const RATE_WINDOW = 10 * 60 * 1000;
/** Each visitor sends up to three requests (phone, finished quiz, full form). */
const RATE_MAX = 12;

function prune(now: number) {
  for (const [id, at] of delivered) if (now - at > DEDUPE_TTL) delivered.delete(id);
  for (const [ip, list] of hits) {
    const recent = list.filter((t) => now - t < RATE_WINDOW);
    if (recent.length) hits.set(ip, recent);
    else hits.delete(ip);
  }
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  prune(now);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Nieprawidłowe dane." }, { status: 400 });
  }

  // early capture (phone before the quiz, finished quiz) or the full lead
  const isPartial = typeof body === "object" && body !== null && "stage" in body;
  const parsed = isPartial ? partialLeadSchema.safeParse(body) : leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot hit: answer like a success so bots learn nothing, but deliver nothing.
    if (parsed.error.issues.some((i) => i.path[0] === "company")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: "Sprawdź poprawność danych w formularzu.", issues: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 422 },
    );
  }

  const lead: LeadRequest & { stage?: LeadStage } = "stage" in parsed.data ? toLeadShape(parsed.data) : parsed.data;
  // one key per lead and stage: the phone, the quiz and the full form are separate deliveries
  const key = `${lead.submissionId}:${lead.stage ?? "complete"}`;

  if (delivered.has(key)) return NextResponse.json({ ok: true, duplicate: true });
  const pending = inFlight.get(key);
  if (pending) {
    try {
      await pending;
      return NextResponse.json({ ok: true, duplicate: true });
    } catch (error) {
      return errorResponse(error);
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const recent = hits.get(ip) ?? [];
  if (recent.length >= RATE_MAX) {
    return NextResponse.json({ ok: false, error: "Zbyt wiele zapytań. Spróbuj ponownie za kilka minut." }, { status: 429 });
  }
  hits.set(ip, [...recent, now]);

  const job = deliverLead(lead);
  inFlight.set(key, job);
  try {
    await job;
    delivered.set(key, Date.now());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  } finally {
    inFlight.delete(key);
  }
}

function errorResponse(error: unknown) {
  if (error instanceof LeadDeliveryError) {
    return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
  }
  console.error("[leads] unexpected error", error);
  return NextResponse.json({ ok: false, error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." }, { status: 500 });
}
