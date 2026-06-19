import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// The app is published two ways and this config supports both:
//   1. GitHub Pages via the "GitHub Actions" source -> serves dist/.
//   2. GitHub Pages via the "Deploy from a branch" source -> serves the
//      repo-root index.html, which `npm run build` regenerates as a single
//      self-contained file (all JS inlined) so it works with no asset paths.
//
// The Vite entry lives in src/ (root below) so it never collides with the
// generated, deployed repo-root index.html.
export default defineConfig({
  root: "src",
  base: "/professor-tecson-rhythm-check/",
  publicDir: "../public",
  plugins: [react(), viteSingleFile()],
  server: {
    // main.jsx imports ../RhythmCheck.tsx, which sits above the Vite root.
    fs: { allow: [".."] },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
  },
});
