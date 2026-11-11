import { describe, expect, it } from "vitest";
import { QUIZ_STEPS, isQuizComplete, qualify, sanitizeAnswers, toggleOption, visibleSteps } from "./quiz";

const step = (id: string) => QUIZ_STEPS.find((s) => s.id === id)!;
const values = (id: string, a: object) => step(id).options(a).map((o) => o.value);

describe("quiz conditional logic", () => {
  it("skips the math level step for primary school", () => {
    expect(visibleSteps({ stage: "sp78" }).map((s) => s.id)).not.toContain("mathLevel");
    expect(visibleSteps({ stage: "lo34" }).map((s) => s.id)).toContain("mathLevel");
  });
  it("hides matura options for primary school and E8 for high school", () => {
    expect(values("problems", { stage: "sp78" })).toContain("exam8");
    expect(values("problems", { stage: "sp78" })).not.toContain("matura_ext");
    expect(values("problems", { stage: "sp46" })).not.toContain("exam8");
    expect(values("problems", { stage: "lomat", mathLevel: "extended" })).toContain("matura_ext");
    expect(values("problems", { stage: "lomat", mathLevel: "basic" })).not.toContain("matura_ext");
  });
  it("shows topic list matching the stage", () => {
    expect(values("topics", { stage: "sp78" })).toContain("fractions");
    expect(values("topics", { stage: "lo12", mathLevel: "basic" })).toContain("quadratic");
    expect(values("topics", { stage: "lo12", mathLevel: "basic" })).not.toContain("derivatives");
    expect(values("topics", { stage: "lo12", mathLevel: "extended" })).toContain("derivatives");
  });
  it("prunes answers invalidated by an earlier change", () => {
    const a = sanitizeAnswers({ stage: "sp78", mathLevel: "extended", problems: ["matura_ext", "gaps"], topics: ["logs"], goal: "matura" });
    expect(a.mathLevel).toBeUndefined();
    expect(a.problems).toEqual(["gaps"]);
    expect(a.topics).toBeUndefined();
    expect(a.goal).toBeUndefined();
  });
  it("'Trudno określić' is exclusive", () => {
    const s = step("topics");
    let a = toggleOption(s, { stage: "sp78" }, "fractions");
    a = toggleOption(s, a, "unknown");
    expect(a.topics).toEqual(["unknown"]);
    a = toggleOption(s, a, "percent");
    expect(a.topics).toEqual(["percent"]);
  });
  it("detects a complete quiz", () => {
    const full = { who: "child", stage: "sp78", problems: ["exam8"], topics: ["fractions"], goal: "exam", start: "asap" } as const;
    expect(isQuizComplete({ ...full, problems: [...full.problems], topics: [...full.topics] })).toBe(true);
    expect(isQuizComplete({ who: "child", stage: "lomat", problems: ["gaps"], topics: ["logs"], goal: "matura", start: "asap" })).toBe(false); // missing mathLevel
  });
  it("scores urgent exam leads higher", () => {
    expect(qualify({ stage: "lomat", goal: "matura", start: "asap", topics: ["logs"], problems: ["gaps", "matura_basic"] }).tier).toBe("Gorący");
    expect(qualify({ stage: "lo12", goal: "grades", start: "browsing", topics: ["unknown"], problems: ["gaps"] }).tier).toBe("Zimny");
  });
});
