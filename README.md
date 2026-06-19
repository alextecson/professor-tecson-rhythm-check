# Rhythm Check

ECG rhythm-training quiz app (NURS 444), built with Vite + React. The whole app —
component, question banks, mascot art, and EKG waveforms — lives in `RhythmCheck.tsx`
with all images embedded as base64, so there are no external asset dependencies.

## Develop

```sh
npm install
npm run dev      # local dev server with HMR
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
```

`src/main.jsx` mounts the `RhythmCheck` component into `#root` in `index.html`.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and
publishes `dist/` to GitHub Pages at
<https://alextecson.github.io/professor-tecson-rhythm-check/>. The Vite `base` is set
to `/professor-tecson-rhythm-check/` so assets resolve under that subpath. (Repo
Settings → Pages → Source must be set to **GitHub Actions**.)

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
