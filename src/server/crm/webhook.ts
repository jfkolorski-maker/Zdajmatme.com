import { createHmac } from "node:crypto";
import type { CrmAdapter, CrmResult } from "./types";

/**
 * Generic signed webhook – use it to call an existing Base44 backend function
 * (or any other endpoint) that already implements the CRM lead workflow.
 * Body: the full LeadRecord as JSON. Headers:
 *   X-ZM-Signature: sha256=<hex HMAC of raw body using CRM_WEBHOOK_SECRET>
 *   Idempotency-Key: <idempotencyKey>
 */
export function createWebhookAdapter(): CrmAdapter {
  const url = process.env.CRM_WEBHOOK_URL;
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (!url || !secret) throw new Error("CRM_WEBHOOK_URL and CRM_WEBHOOK_SECRET must be set when CRM_PROVIDER=webhook");
  return {
    name: "webhook",
    async createLead(lead): Promise<CrmResult> {
      const body = JSON.stringify(lead);
      const sig = createHmac("sha256", secret).update(body).digest("hex");
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-ZM-Signature": `sha256=${sig}`, "Idempotency-Key": lead.idempotencyKey },
          body,
          signal: AbortSignal.timeout(10_000),
          cache: "no-store",
        });
        if (!res.ok) return { ok: false, error: `Webhook HTTP ${res.status}`, retryable: res.status >= 500 || res.status === 429 };
        const data = (await res.json().catch(() => ({}))) as { id?: string };
        return { ok: true, externalId: data.id };
      } catch (e) {
        return { ok: false, error: `Webhook failed: ${(e as Error).message}`, retryable: true };
      }
    },
  };
}
