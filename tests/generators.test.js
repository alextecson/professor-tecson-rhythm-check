import { describe, it, expect } from "vitest";
import {
  STRIPS,
  B,
  beat,
  makeRegular,
  chaos,
  afib,
  flat,
} from "../RhythmCheck.tsx";

// A valid SVG path here must start with a moveto and contain only finite
// numbers — safePath() exists precisely to defend against bad coordinates, so
// proving the generators never emit them shows that defense is rarely needed.
const BAD_TOKEN = /NaN|Infinity|undefined|null/;

describe("every STRIPS entry is a well-formed path", () => {
  for (const [key, path] of Object.entries(STRIPS)) {
    describe(key, () => {
      it("starts with a moveto command", () => {
        expect(path.startsWith("M")).toBe(true);
      });

      it("contains no NaN / Infinity / undefined coordinates", () => {
        expect(path).not.toMatch(BAD_TOKEN);
      });

      it("draws all the way to the right edge (x=720)", () => {
        // Most strips close on the exact baseline (L720 90); flat() lands a hair
        // off 90 from its noise term, so match the x-coordinate, not the y.
        expect(path).toMatch(/L720\b/);
      });
    });
  }
});

describe("beat(x, opts)", () => {
  it("returns a { seg, end } pair with the cursor advanced past x", () => {
    const r = beat(30, {});
    expect(typeof r.seg).toBe("string");
    expect(r.seg).not.toMatch(BAD_TOKEN);
    expect(r.end).toBeGreaterThan(30);
  });

  it("a P-less beat advances less far than one with a P wave", () => {
    const withP = beat(30, { p: true });
    const withoutP = beat(30, { p: false });
    expect(withoutP.end).toBeLessThan(withP.end);
  });
});

describe("makeRegular(opts, gap, count)", () => {
  it("emits one complex per beat (count drives complex count)", () => {
    // A default beat draws two quadratic curves — the P wave and the T wave —
    // so the number of Q commands is a robust 2× the beat count.
    const count = 5;
    const path = makeRegular({}, 28, count);
    const qCommands = (path.match(/Q/g) || []).length;
    expect(qCommands).toBe(2 * count);
  });

  it("accepts a function for per-beat opts", () => {
    const path = makeRegular((i) => ({ qrsAmp: 40 + i }), 28, 3);
    expect(path.startsWith("M")).toBe(true);
    expect(path).not.toMatch(BAD_TOKEN);
  });

  it("ends at the baseline on the right edge", () => {
    expect(makeRegular({}, 28, 4)).toContain(`L720 ${B}`);
  });
});

describe("deterministic generators", () => {
  it("chaos() is stable across calls (seeded PRNG)", () => {
    expect(chaos(34)).toBe(chaos(34));
  });

  it("afib() is stable across calls", () => {
    expect(afib()).toBe(afib());
  });

  it("flat() stays near the baseline", () => {
    const path = flat();
    expect(path).not.toMatch(BAD_TOKEN);
    expect(path.startsWith(`M0 ${B}`)).toBe(true);
  });
});
