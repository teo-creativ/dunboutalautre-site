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
        terrasses: resolve(__dirname, "amenagement-terrasse-paris/index.html"),
        bureaux: resolve(__dirname, "vegetalisation-bureaux-paris/index.html"),
        "design-vegetal": resolve(__dirname, "design-vegetal-sur-mesure-paris/index.html"),
        scenographie: resolve(__dirname, "scenographie-vegetale-evenementiel-paris/index.html"),
        saisonniere: resolve(__dirname, "decoration-vegetale-saisonniere-paris/index.html"),
      },
    },
  },
});
