import { createBase44Adapter } from "./base44";
import { createWebhookAdapter } from "./webhook";
import type { CrmAdapter } from "./types";

/**
 * CRM_PROVIDER = base44 | webhook | console
 * `console` only logs a redacted record and is REFUSED in production builds,
 * so the production flow can never "succeed" without a real CRM write.
 */
export function getCrmAdapter(): CrmAdapter | null {
  const provider = (process.env.CRM_PROVIDER || "").toLowerCase();
  try {
    if (provider === "base44") return createBase44Adapter();
    if (provider === "webhook") return createWebhookAdapter();
    if (provider === "console") {
      if (process.env.NODE_ENV === "production" && process.env.ALLOW_CONSOLE_CRM !== "true") {
        console.error("[crm] CRM_PROVIDER=console is not allowed in production");
        return null;
      }
      return {
        name: "console",
        async createLead(lead) {
          console.info("[crm:console] lead", lead.leadId, lead.qualification.tier, "(PII redacted)");
          return { ok: true, externalId: `console-${lead.leadId}` };
        },
      };
    }
  } catch (e) {
    console.error("[crm] misconfigured:", (e as Error).message);
    return null;
  }
  console.error("[crm] CRM_PROVIDER not set");
  return null;
}

export type { CrmAdapter, LeadRecord, CrmResult } from "./types";
