import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed to GitHub Pages at https://alextecson.github.io/professor-tecson-rhythm-check/
// so assets must be served from that subpath. Use a relative base in any other
// context (e.g. local file preview) by overriding with `--base`.
export default defineConfig({
  base: "/professor-tecson-rhythm-check/",
  plugins: [react()],
  build: {
    outDir: "dist",
    // Single-file embedded base64 component is large; raise the warning ceiling
    // so the legitimate big chunk doesn't spam the build log.
    chunkSizeWarningLimit: 2000,
  },
});
