import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginRewriteAll from "vite-plugin-rewrite-all";

export default defineConfig({
  plugins: [react(), vitePluginRewriteAll()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
