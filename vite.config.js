import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  build: {
    target: "es2020",
  },
  plugins: [
    react(),
    crx({ manifest })
  ],
  optimizeDeps: {
    exclude: ["koffi", "re2"]
  },
});
