import { defineConfig } from "vite";
import { resolve } from "node:path";
import injectComponents from "./vite-plugins/inject-components.js";

export default defineConfig({
  plugins: [injectComponents()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        noel: resolve(__dirname, "decoration-noel-entreprises-paris/index.html"),
      },
    },
  },
});
