import { describe, it, expect } from "vitest";
import {
  CASES,
  CASE_STUDIES,
  STRIPS,
  RHYTHM_OPTIONS,
  ROUNDS,
  MODES,
} from "../RhythmCheck.tsx";

// The quiz banks are hand-authored objects. A single typo (an edited `correct`
// answer that no longer appears in `choices`, a misspelled `strip` key) breaks a
// question silently at runtime. These tests are the guardrail.

const QUESTION_ROUNDS = ["symptoms", "causes", "intervention"]; // ROUNDS[0] (rhythm) is special

describe("CASES bank integrity", () => {
  it("has the expected shape", () => {
    expect(Array.isArray(CASES)).toBe(true);
    expect(CASES.length).toBeGreaterThan(0);
  });

  CASES.forEach((c, i) => {
    describe(`CASES[${i}] (${c.rhythm})`, () => {
      it("references a strip that exists in STRIPS", () => {
        expect(STRIPS).toHaveProperty(c.strip);
        expect(typeof STRIPS[c.strip]).toBe("string");
      });

      it("has a non-empty rhythm label", () => {
        // NB: RHYTHM_OPTIONS is a legacy pool the Engine no longer reads (it
        // uses per-case rhythmChoices), and it omits STEMI / Hyperkalemia — so
        // membership in it is intentionally NOT asserted here.
        expect(typeof c.rhythm).toBe("string");
        expect(c.rhythm.trim().length).toBeGreaterThan(0);
      });

      it("includes the correct rhythm among rhythmChoices", () => {
        expect(c.rhythmChoices).toContain(c.rhythm);
      });

      it("offers exactly 4 unique rhythm choices", () => {
        expect(c.rhythmChoices).toHaveLength(4);
        expect(new Set(c.rhythmChoices).size).toBe(4);
      });

      it("has non-empty criteria and pearl", () => {
        expect(c.criteria.trim().length).toBeGreaterThan(0);
        expect(c.pearl.trim().length).toBeGreaterThan(0);
      });

      QUESTION_ROUNDS.forEach((key) => {
        describe(`round "${key}"`, () => {
          it("exists with correct + choices", () => {
            expect(c[key]).toBeDefined();
            expect(typeof c[key].correct).toBe("string");
            expect(Array.isArray(c[key].choices)).toBe(true);
          });

          it("includes the correct answer among the choices", () => {
            expect(c[key].choices).toContain(c[key].correct);
          });

          it("offers exactly 4 unique choices", () => {
            expect(c[key].choices).toHaveLength(4);
            expect(new Set(c[key].choices).size).toBe(4);
          });
        });
      });
    });
  });
});

describe("CASE_STUDIES bank integrity", () => {
  it("has the expected shape", () => {
    expect(Array.isArray(CASE_STUDIES)).toBe(true);
    expect(CASE_STUDIES.length).toBeGreaterThan(0);
  });

  CASE_STUDIES.forEach((cs, i) => {
    describe(`CASE_STUDIES[${i}]`, () => {
      it("references a strip that exists in STRIPS", () => {
        expect(STRIPS).toHaveProperty(cs.strip);
      });

      it("includes the correct answer among the choices", () => {
        expect(cs.choices).toContain(cs.correct);
      });

      it("offers exactly 4 unique choices", () => {
        expect(cs.choices).toHaveLength(4);
        expect(new Set(cs.choices).size).toBe(4);
      });

      it("has non-empty scenario, prompt and rationale", () => {
        expect(cs.scenario.trim().length).toBeGreaterThan(0);
        expect(cs.q.trim().length).toBeGreaterThan(0);
        expect(cs.why.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

describe("STRIPS / RHYTHM_OPTIONS / ROUNDS / MODES", () => {
  it("every STRIP is a non-empty path string", () => {
    for (const [key, path] of Object.entries(STRIPS)) {
      expect(typeof path, key).toBe("string");
      expect(path.length, key).toBeGreaterThan(0);
    }
  });

  it("RHYTHM_OPTIONS has no duplicates", () => {
    expect(new Set(RHYTHM_OPTIONS).size).toBe(RHYTHM_OPTIONS.length);
  });

  it("ROUNDS keys line up with the per-case fields the Engine reads", () => {
    const keys = ROUNDS.map((r) => r.key);
    expect(keys[0]).toBe("rhythm");
    QUESTION_ROUNDS.forEach((k) => expect(keys).toContain(k));
  });

  it("every MODE points at valid round indices", () => {
    for (const m of MODES) {
      if (m.rounds === null) continue; // case-study mode has no ROUNDS indices
      for (const idx of m.rounds) {
        expect(ROUNDS[idx], `mode ${m.id} round ${idx}`).toBeDefined();
      }
    }
  });
});
