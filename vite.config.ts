/// <reference types="vitest" />

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import VueDevTools from "vite-plugin-vue-devtools";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },

  plugins: [
    vue(),
    eslintPlugin(),
    tsconfigPaths(),
    VueDevTools({ componentInspector: false }),
  ],

  server: {
    port: 8080,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js", ".vue"],
  },

  build: {
    outDir: path.join(__dirname, "dist"),
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@use "@/scss/variables.scss" as *; @use "@/scss/mixins.scss" as *;',
      },
    },
  },
});
