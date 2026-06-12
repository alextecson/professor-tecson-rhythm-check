import { defineConfig } from "vitest/config";

// The pure layer (waveform generators, helpers, data banks) lives inline in
// RhythmCheck.tsx and is imported directly by the tests, so there is a single
// source of truth and no risk of the tested code drifting from the app.
// esbuild's default JSX transform (React.createElement) handles the component
// definitions in that file; nothing is rendered, so a Node environment is enough.
export default defineConfig({
  esbuild: { jsx: "transform" },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{js,jsx}"],
  },
});
