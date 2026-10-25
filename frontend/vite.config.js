import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginRewriteAll from "vite-plugin-rewrite-all";

export default defineConfig({
  plugins: [react(), vitePluginRewriteAll()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
