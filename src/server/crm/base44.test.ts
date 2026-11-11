import { describe, expect, it } from "vitest";
import { mapLeadToBase44 } from "./base44";
import { buildLeadRecord } from "../lead-service";
import { leadRequestSchema } from "@/lib/lead-schema";

const req = leadRequestSchema.parse({
  idempotencyKey: "6f1c1d1e-8a3b-4c5d-9e6f-1a2b3c4d5e6f",
  contact: { name: "Anna", phone: "600 123 456", email: "Anna@Example.pl", contactMethod: "sms", message: "", filler: "parent", fillerConfirm: true },
  quiz: { who: "child", stage: "lomat", mathLevel: "extended", problems: ["matura_ext"], topics: ["logs", "derivatives"], goal: "matura", start: "7d" },
  attribution: { utm_source: "google", utm_medium: "cpc", utm_campaign: "matura", gclid: "Cj0K" },
  history: [{ step: "who", at: 1_700_000_000_000, ms: 1200 }],
  startedAt: 1_700_000_000_000,
});

describe("lead record + Base44 mapping", () => {
  const lead = buildLeadRecord(req, "ZM-TEST");
  it("builds a normalised record with status Nowy", () => {
    expect(lead.phone).toBe("+48600123456");
    expect(lead.email).toBe("anna@example.pl");
    expect(lead.status).toBe("Nowy");
    expect(lead.source).toBe("website");
    expect(lead.campaignSource).toBe("google / cpc");
    expect(lead.topics).toEqual(["Logarytmy", "Pochodne i optymalizacja"]);
    expect(lead.qualification.tier).toBe("Gorący");
  });
  it("maps to snake_case Base44 fields and honours BASE44_FIELD_MAP", () => {
    process.env.BASE44_FIELD_MAP = JSON.stringify({ parentName: "full_name", fbclid: "" });
    const out = mapLeadToBase44(lead);
    expect(out.full_name).toBe("Anna");
    expect(out.gclid).toBe("Cj0K");
    expect(out.topics).toBe("Logarytmy, Pochodne i optymalizacja");
    expect(out).not.toHaveProperty("name");
    expect(typeof out.form_history).toBe("string");
    delete process.env.BASE44_FIELD_MAP;
  });
});
