import { NextResponse, after, type NextRequest } from "next/server";
import { leadRequestSchema } from "@/lib/lead-schema";
import { getCrmAdapter } from "@/server/crm";
import { kv } from "@/server/kv";
import { buildLeadRecord, newLeadId } from "@/server/lead-service";
import { notifyLead } from "@/server/notify/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 24_000;
const MIN_FILL_MS = 3_000;
const GENERIC_ERROR = "Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę lub zadzwoń.";

const json = (status: number, body: Record<string, unknown>) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function clientIp(req: NextRequest) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

function originAllowed(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set(
    [process.env.NEXT_PUBLIC_SITE_URL, ...(process.env.ALLOWED_ORIGINS || "").split(",")]
      .map((o) => o?.trim().replace(/\/$/, ""))
      .filter(Boolean) as string[],
  );
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  try {
    const o = new URL(origin);
    return allowed.has(o.origin) || o.host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // 1. Origin / CSRF protection
  if (!originAllowed(req)) return json(403, { ok: false, error: "Forbidden" });

  // 2. Rate limiting per IP (burst + daily)
  const ip = clientIp(req);
  try {
    const [burst, daily] = await Promise.all([kv.incr(`rl:10m:${ip}`, 600), kv.incr(`rl:1d:${ip}`, 86_400)]);
    if (burst > 5 || daily > 20) return json(429, { ok: false, error: "Zbyt wiele prób. Spróbuj ponownie później lub zadzwoń." });
  } catch (e) {
    console.error("[leads] rate-limit store unavailable", (e as Error).message);
  }

  // 3. Parse + validate
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: GENERIC_ERROR });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: GENERIC_ERROR });
  }
  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "contact" && issue.path[1]) fieldErrors[String(issue.path[1])] ??= issue.message;
    }
    return json(422, { ok: false, error: "Sprawdź poprawność danych w formularzu.", fieldErrors });
  }
  const data = parsed.data;

  // 4. Anti-spam: honeypot + minimum fill time
  if (data.hp || Date.now() - data.startedAt < MIN_FILL_MS) {
    console.warn("[leads] spam heuristics triggered");
    return json(422, { ok: false, error: GENERIC_ERROR });
  }

  // 5. Idempotency – the same submission (retry / double click) never creates two leads
  const idemKey = `idem:${data.idempotencyKey}`;
  try {
    const existing = await kv.get(idemKey);
    if (existing?.startsWith("done:")) return json(200, { ok: true, leadId: existing.slice(5), duplicate: true });
    if (existing === "pending") return json(409, { ok: false, error: "Zgłoszenie jest właśnie wysyłane…", retry: true });
    await kv.setNx(idemKey, "pending", 60);
  } catch (e) {
    console.error("[leads] idempotency store unavailable", (e as Error).message);
  }

  // 6. Save in CRM – success is returned ONLY after the CRM confirmed the write
  const crm = getCrmAdapter();
  if (!crm) {
    await kv.del(idemKey).catch(() => {});
    return json(503, { ok: false, error: GENERIC_ERROR });
  }
  const leadId = newLeadId();
  const lead = buildLeadRecord(data, leadId);
  let result = await crm.createLead(lead);
  if (!result.ok && result.retryable) {
    await new Promise((r) => setTimeout(r, 600));
    result = await crm.createLead(lead);
  }
  if (!result.ok) {
    console.error(`[leads] CRM(${crm.name}) write failed for ${leadId}: ${result.error}`);
    await kv.del(idemKey).catch(() => {});
    return json(502, { ok: false, error: GENERIC_ERROR });
  }

  await kv.set(idemKey, `done:${leadId}`, 86_400).catch(() => {});
  console.info(`[leads] saved ${leadId} via ${crm.name} tier=${lead.qualification.tier}`);

  // 7. Optional e-mails after the response is sent (never block / never fail the lead)
  after(() => notifyLead(lead));

  return json(201, { ok: true, leadId });
}

export function GET() {
  return json(405, { ok: false });
}
