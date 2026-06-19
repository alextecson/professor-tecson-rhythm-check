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

Live at <https://alextecson.github.io/professor-tecson-rhythm-check/>.

The Vite entry lives in `src/` and the app builds two interchangeable ways so it
works regardless of how GitHub Pages is configured:

- **Branch source ("Deploy from a branch", main/root):** `npm run build` inlines
  the whole bundle into a single self-contained `index.html` at the repo root
  (via `vite-plugin-singlefile`) and that file is committed — so the branch-served
  root just works, no asset paths or build step required. Re-run `npm run build`
  and commit the regenerated `index.html` after changing the app.
- **GitHub Actions source:** `.github/workflows/deploy.yml` builds on push to
  `main` and publishes `dist/` (also self-contained). To use this cleaner mode,
  set Settings → Pages → Source to **GitHub Actions**; future edits then deploy on
  merge with nothing to commit by hand.

`base` is `/professor-tecson-rhythm-check/` so assets resolve under the subpath.

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
