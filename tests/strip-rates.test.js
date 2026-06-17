import { describe, it, expect } from "vitest";
import { STRIPS } from "../RhythmCheck.tsx";

// Each strip is drawn in a 720-unit-wide SVG. We treat that as a standard
// 6-second rhythm strip, so the ventricular rate ≈ (QRS complexes in the
// window) × 10 — the same rule a nurse uses at the bedside. These tests guard
// that every rate-diagnostic rhythm renders a count that lands in its clinical
// band, so the picture can't silently drift away from the label/criteria text.
const WINDOW = 720;
const BASELINE = 90;

function points(d) {
  const pts = [];
  const re = /([MLQ])([^MLQ]*)/g;
  let m;
  while ((m = re.exec(d))) {
    const nums = m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (m[1] === "Q" && nums.length >= 4) pts.push([nums[2], nums[3]]);
    else if ((m[1] === "M" || m[1] === "L") && nums.length >= 2) pts.push([nums[0], nums[1]]);
  }
  return pts;
}

// Count QRS complexes: sharp upward spikes (amplitude > 25 above baseline)
// inside the visible window, collapsing points of the same complex together.
function qrsCount(d) {
  const spikes = points(d).filter(([x, y]) => x >= 0 && x <= WINDOW && y <= BASELINE - 25);
  let n = 0,
    last = -Infinity;
  for (const [x] of spikes) {
    if (x - last >= 18) {
      n++;
      last = x;
    }
  }
  return n;
}

function rrSpread(d) {
  const peaks = [];
  let last = -Infinity;
  for (const [x, y] of points(d)) {
    if (x >= 0 && x <= WINDOW && y <= BASELINE - 25 && x - last >= 18) {
      peaks.push(x);
      last = x;
    }
  }
  const rr = peaks.slice(1).map((x, i) => x - peaks[i]);
  if (rr.length < 2) return 0;
  const med = [...rr].sort((a, b) => a - b)[Math.floor(rr.length / 2)];
  return (Math.max(...rr) - Math.min(...rr)) / med;
}

// rhythm -> [minComplexes, maxComplexes] expected on a 6s strip (rate / 10)
const RATE_BANDS = {
  nsr: [6, 10], //  60–100  Normal Sinus Rhythm
  sinusBrady: [3, 5], //  <60     Sinus Bradycardia
  sinusTach: [11, 15], //  110–150 Sinus Tachycardia
  psvt: [15, 22], //  150–220 PSVT
  flutter: [13, 16], //  ~150    Atrial Flutter, 2:1 ventricular
  junctional: [4, 6], //  40–60   Junctional
  thirdDegree: [3, 5], //  20–50   3rd-degree (ventricular escape)
  vtach: [16, 26], //  160–260 Ventricular Tachycardia
};

describe("rhythm-strip rate calibration (720u = 6-second strip)", () => {
  for (const [key, [lo, hi]] of Object.entries(RATE_BANDS)) {
    it(`${key} renders ${lo}-${hi} complexes (${lo * 10}-${hi * 10} bpm)`, () => {
      const n = qrsCount(STRIPS[key]);
      expect(n, `${key} drew ${n} complexes (=${n * 10} bpm)`).toBeGreaterThanOrEqual(lo);
      expect(n, `${key} drew ${n} complexes (=${n * 10} bpm)`).toBeLessThanOrEqual(hi);
    });
  }

  it("asystole renders no complexes (flatline)", () => {
    expect(qrsCount(STRIPS.asystole)).toBe(0);
  });

  it("afib is irregularly irregular (R-R varies markedly)", () => {
    expect(rrSpread(STRIPS.afib)).toBeGreaterThan(0.3);
  });

  it("nsr is regular (R-R nearly constant)", () => {
    expect(rrSpread(STRIPS.nsr)).toBeLessThan(0.15);
  });
});
