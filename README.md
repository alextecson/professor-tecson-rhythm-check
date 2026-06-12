# Rhythm Check

Open `index.html` in a browser to run the fixed app.

This standalone HTML uses React/Babel from unpkg, so it needs internet access the first time it loads. The fixed React source is included as `RhythmCheck.tsx`.

## Tests

The pure logic (waveform generators, helpers, and the question banks) is unit-tested with [Vitest]. The tests import directly from `RhythmCheck.tsx`, so they exercise the real app code with no duplicated copy to drift out of sync.

```sh
npm install
npm test        # one-off run
npm run test:watch
```

Coverage focuses on:

- **Data integrity** (`tests/data.test.js`) — every quiz question's `correct` answer appears in its `choices`, every `strip` key resolves to a real waveform, choices are unique and four-wide.
- **Helpers** (`tests/helpers.test.js`) — `shuffle` is a non-mutating deterministic permutation, `rng` stays in bounds, `safePath` strips non-finite coordinates.
- **Waveform generators** (`tests/generators.test.js`) — every generated SVG path is well-formed and free of `NaN`/`Infinity`.

[Vitest]: https://vitest.dev
