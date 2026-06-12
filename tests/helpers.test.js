import { describe, it, expect } from "vitest";
import { shuffle, rng, safePath } from "../RhythmCheck.tsx";

describe("shuffle(arr, seed)", () => {
  it("is a permutation — same elements, nothing lost or duplicated", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input, 42);
    expect([...out].sort((a, b) => a - b)).toEqual(input);
  });

  it("is deterministic for a fixed seed", () => {
    const input = ["a", "b", "c", "d", "e"];
    expect(shuffle(input, 99)).toEqual(shuffle(input, 99));
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4];
    const copy = [...input];
    shuffle(input, 7);
    expect(input).toEqual(copy);
  });

  it("generally produces a different order for a different seed", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Not guaranteed in theory, but these two seeds differ in practice.
    expect(shuffle(input, 1)).not.toEqual(shuffle(input, 2));
  });

  it("handles empty and single-element arrays", () => {
    expect(shuffle([], 5)).toEqual([]);
    expect(shuffle([42], 5)).toEqual([42]);
  });
});

describe("rng(arr, seed)", () => {
  const arr = ["x", "y", "z"];

  it("returns an in-bounds element for seed 0", () => {
    expect(arr).toContain(rng(arr, 0));
  });

  it("returns an in-bounds element for negative seeds", () => {
    expect(arr).toContain(rng(arr, -7));
    expect(rng(arr, -7)).toBe(rng(arr, 7)); // Math.abs makes these equal
  });

  it("returns an in-bounds element for large seeds", () => {
    for (const seed of [1, 50, 999, 1234567]) {
      expect(arr).toContain(rng(arr, seed));
    }
  });
});

describe("safePath(d)", () => {
  it("returns the default flatline for non-string input", () => {
    expect(safePath(undefined)).toBe("M0 90 L720 90");
    expect(safePath(null)).toBe("M0 90 L720 90");
    expect(safePath(42)).toBe("M0 90 L720 90");
  });

  it("returns the default flatline when nothing matches", () => {
    expect(safePath("garbage with no commands")).toBe("M0 90 L720 90");
  });

  it("preserves a clean path's commands (modulo whitespace)", () => {
    const clean = "M0 90 L10 90 L20 80";
    // safePath re-joins tokens and may collapse to different spacing; the
    // commands and coordinates must survive intact.
    expect(safePath(clean).replace(/\s+/g, " ").trim()).toBe(clean);
  });

  it("strips commands containing NaN or Infinity coordinates", () => {
    const out = safePath("M0 90 L10 NaN L20 80 L30 Infinity L40 70");
    expect(out).not.toMatch(/NaN|Infinity/);
    expect(out).toContain("M0 90");
    expect(out).toContain("L20 80");
    expect(out).toContain("L40 70");
  });

  it("prepends a leading M when the surviving path lacks one", () => {
    // The only M command carries a bad coordinate and gets filtered out.
    const out = safePath("M0 NaN L10 90 L20 80");
    expect(out.startsWith("M")).toBe(true);
    expect(out).toContain("M0 90");
  });
});
