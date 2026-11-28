import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SUMMARY_STEP, initialQuizState, quizReducer, type QuizAction, type QuizState } from "../src/components/quiz/quizState.ts";
import { QUIZ, coursesFor, hoursLabel, isComplete, isHidden, isMinorStudent, offerSummary, questionOf, summarize, visibleIds, type QuizAnswers } from "../src/data/quiz.ts";
import { isPlausibleFirstDate, leadRequestSchema, normalizePhone, validateContact } from "../src/lib/lead/schema.ts";

const run = (actions: QuizAction[], s: QuizState = initialQuizState) => actions.reduce(quizReducer, s);
const pick = (id: QuizAnswers extends Partial<Record<infer K, string>> ? K : never, value: string): QuizAction[] => [{ type: "answer", id, value } as QuizAction, { type: "next" }];
const at = (s: QuizState) => (s.step >= SUMMARY_STEP ? "summary" : QUIZ[s.step].id);

describe("quiz paths", () => {
  it("1:1 lessons, matura prep: offer → who → stage → level → need (5)", () => {
    let s = run([...pick("offer", "indiv"), ...pick("who", "child"), ...pick("stage", "prep")]);
    assert.equal(at(s), "level");
    s = run([...pick("level", "extended"), ...pick("need", "understand")], s);
    assert.equal(at(s), "summary");
    assert.equal(isComplete(s.answers), true);
    assert.equal(summarize(s.answers).length, 5);
  });

  it("1:1 lessons, primary school skips the level question (4)", () => {
    const s = run([...pick("offer", "indiv"), ...pick("who", "child"), ...pick("stage", "sp48")]);
    assert.equal(at(s), "need");
    assert.deepEqual(visibleIds(s.answers), ["offer", "who", "stage", "need"]);
  });

  it("1:1 lessons, high school with the level in the answer skips the level question (4)", () => {
    for (const st of ["lobasic", "loext"]) {
      const s = run([...pick("offer", "indiv"), ...pick("who", "child"), ...pick("stage", st)]);
      assert.equal(at(s), "need");
    }
  });

  it("8th-grade course: only offer → who, then the form (2)", () => {
    const s = run([...pick("offer", "e8"), ...pick("who", "child")]);
    assert.equal(s.step, SUMMARY_STEP);
  });

  it("physics / chemistry / biology: offer → subject → who → stage → need, 1:1 form", () => {
    const s = run([...pick("offer", "science")]);
    assert.equal(at(s), "subject");
    const t = run([...pick("subject", "chemistry"), ...pick("who", "child"), ...pick("stage", "sp48"), ...pick("need", "grades")], s);
    assert.equal(at(t), "summary");
    assert.equal(offerSummary(t.answers).price, null);
    assert.equal(coursesFor(t.answers).length, 0);
    assert.equal(isHidden("subject", { offer: "indiv" }), true);
  });

  it("courses show their fixed day and time", () => {
    assert.equal(coursesFor({ offer: "e8" })[0].day, "Poniedziałki");
    assert.equal(coursesFor({ offer: "matura", level: "basic" })[0].day, "Poniedziałki");
    assert.equal(coursesFor({ offer: "matura", level: "extended" })[0].day, "Środy");
    assert.equal(coursesFor({ offer: "matura", level: "unsure" }).length, 2);
    assert.equal(coursesFor({ offer: "indiv" }).length, 0);
  });

  it("matura course asks for the level, not the stage (4)", () => {
    const s = run([...pick("offer", "matura"), ...pick("who", "self")]);
    assert.equal(at(s), "level");
    assert.equal(isHidden("stage", s.answers), true);
  });

  it("changing the offer drops answers that no longer apply", () => {
    let s = run([...pick("offer", "indiv"), ...pick("who", "child"), ...pick("stage", "prep"), ...pick("level", "basic"), ...pick("need", "grades")]);
    s = run([{ type: "answer", id: "offer", value: "e8" }], s);
    assert.equal(s.answers.stage, undefined);
    assert.equal(s.answers.level, undefined);
    assert.equal(s.answers.need, undefined);
  });

  it("addresses a student directly", () => {
    assert.equal(questionOf(QUIZ.find((q) => q.id === "stage")!, { who: "self" }), "Na jakim etapie nauki jesteś?");
  });

  it("shows the 1:1 price, never an invented course price", () => {
    assert.equal(offerSummary({ offer: "indiv" }).price, 110);
    assert.equal(offerSummary({ offer: "indiv", stage: "sp48" }).price, 110);
    assert.equal(offerSummary({ offer: "indiv", stage: "lobasic" }).price, 110);
    assert.equal(offerSummary({ offer: "indiv", stage: "prep", level: "basic" }).price, 110);
    assert.equal(offerSummary({ offer: "indiv", stage: "loext" }).price, 125);
    assert.equal(offerSummary({ offer: "indiv", stage: "prep", level: "extended" }).price, 125);
    assert.equal(offerSummary({ offer: "e8" }).price, null);
    assert.equal(offerSummary({ offer: "matura", level: "extended" }).title, "Kurs maturalny 2027/2028 · rozszerzenie");
  });
});

describe("minors", () => {
  it("primary-school / 8th-grade students are minors", () => {
    assert.equal(isMinorStudent({ who: "self", stage: "sp48" }), true);
    assert.equal(isMinorStudent({ who: "self", offer: "e8" }), true);
    assert.equal(isMinorStudent({ who: "self", stage: "e8prep" }), true);
    assert.equal(isMinorStudent({ who: "self", stage: "prep" }), false);
    assert.equal(isMinorStudent({ who: "child", stage: "sp48" }), false);
  });
});

describe("form", () => {
  const contact = { name: "Anna", phone: "730 170 804", consent: true as const };
  const answers = { offer: "indiv", who: "child", stage: "sp48", need: "grades" };
  const req = { submissionId: "6f1c1d1e-8a3b-4c5d-9e6f-1a2b3c4d5e6f", contact, answers, attribution: { gclid: "x" } };

  it("normalises Polish phones", () => {
    assert.equal(normalizePhone("730 170 804"), "+48730170804");
    assert.equal(normalizePhone("+48 730-170-804"), "+48730170804");
    assert.equal(normalizePhone("0048730170804"), "+48730170804");
    assert.equal(normalizePhone("12345"), null);
  });

  it("e-mail optional, consent required", () => {
    assert.deepEqual(validateContact(contact), {});
    assert.ok(validateContact({ ...contact, email: "x@y" }).email);
    assert.ok(validateContact({ ...contact, consent: false as unknown as true }).consent);
  });

  it("student filling in alone must confirm 18+ / guardian", () => {
    assert.ok(validateContact(contact, { who: "self" }).adultOrGuardian);
    assert.deepEqual(validateContact({ ...contact, adultOrGuardian: true }, { who: "self" }), {});
    const selfReq = { ...req, answers: { offer: "matura", who: "self", level: "basic" } };
    assert.equal(leadRequestSchema.safeParse(selfReq).success, false);
    assert.equal(leadRequestSchema.safeParse({ ...selfReq, contact: { ...contact, adultOrGuardian: true } }).success, true);
  });

  it("server rejects incomplete or impossible answers", () => {
    assert.equal(leadRequestSchema.safeParse(req).success, true);
    assert.equal(leadRequestSchema.safeParse({ ...req, answers: { offer: "indiv", who: "child" } }).success, false);
    assert.equal(leadRequestSchema.safeParse({ ...req, answers: { ...answers, stage: "nope" } }).success, false);
  });

  it("first lesson date: real, from today up to a year ahead", () => {
    const now = new Date("2026-11-28T10:00:00Z");
    assert.equal(isPlausibleFirstDate("2026-12-03", now), true);
    assert.equal(isPlausibleFirstDate("2026-11-28", now), true);
    assert.equal(isPlausibleFirstDate("2026-11-01", now), false);
    assert.equal(isPlausibleFirstDate("2028-01-01", now), false);
    assert.equal(isPlausibleFirstDate("2026-02-30", now), false);
    assert.equal(isPlausibleFirstDate("jutro", now), false);
  });

  it("hour range: from < to, within 7–22", () => {
    assert.deepEqual(validateContact({ ...contact, hoursFrom: 14, hoursTo: 18 }), {});
    assert.ok(validateContact({ ...contact, hoursFrom: 18, hoursTo: 14 }).hoursTo);
    assert.ok(validateContact({ ...contact, hoursFrom: 5, hoursTo: 9 }).hoursFrom);
    assert.equal(hoursLabel(14, 18), "14:00–18:00");
    assert.equal(hoursLabel(7, 22), "Dowolna pora");
  });

  it("honeypot must stay empty", () => {
    assert.equal(leadRequestSchema.safeParse({ ...req, company: "bot" }).success, false);
  });
});
