import { describe, expect, it } from "vitest";
import { allowedFillers, contactSchema, leadRequestSchema, normalizePhone } from "./lead-schema";

describe("normalizePhone", () => {
  it.each([
    ["730 170 804", "+48730170804"],
    ["+48 730-170-804", "+48730170804"],
    ["0048730170804", "+48730170804"],
    ["48730170804", "+48730170804"],
    ["+49 151 23456789", "+4915123456789"],
  ])("%s → %s", (input, out) => expect(normalizePhone(input)).toBe(out));
  it.each(["123", "abc", "0730170804", "73017080", "+48 12345"])("rejects %s", (i) => expect(normalizePhone(i)).toBeNull());
});

const contact = { name: "Anna", phone: "600 123 456", email: "anna@example.pl", contactMethod: "phone", message: "", filler: "parent", fillerConfirm: true, marketingConsent: false };
const quiz = { who: "child", stage: "sp78", problems: ["exam8"], topics: ["fractions"], goal: "exam", start: "asap" };
const req = { idempotencyKey: "6f1c1d1e-8a3b-4c5d-9e6f-1a2b3c4d5e6f", contact, quiz, attribution: { gclid: "abc" }, history: [], startedAt: Date.now() };

describe("contact + request validation", () => {
  it("accepts a valid request; marketing consent is optional and false by default", () => {
    const { marketingConsent: _m, ...noMarketing } = contact;
    expect(contactSchema.parse(noMarketing).marketingConsent).toBe(false);
    expect(leadRequestSchema.safeParse(req).success).toBe(true);
  });
  it("requires valid e-mail, phone and confirmation", () => {
    expect(contactSchema.safeParse({ ...contact, email: "x@y" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...contact, phone: "12" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...contact, fillerConfirm: false }).success).toBe(false);
  });
  it("rejects answers that are not valid for the chosen stage", () => {
    expect(leadRequestSchema.safeParse({ ...req, quiz: { ...quiz, problems: ["matura_ext"] } }).success).toBe(false);
  });
  it("a minor student can't be the contact person", () => {
    expect(allowedFillers("self", "sp78")).toEqual(["guardian_of_minor"]);
    const bad = { ...req, quiz: { ...quiz, who: "self" }, contact: { ...contact, filler: "adult_student" } };
    expect(leadRequestSchema.safeParse(bad).success).toBe(false);
  });
});
