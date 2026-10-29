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
        entretien: resolve(__dirname, "entretien-abonnement-plantes-entreprise-paris/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        realisations: resolve(__dirname, "realisations/index.html"),
        "floral-fashion-show": resolve(__dirname, "realisations/floral-fashion-show/index.html"),
        blog: resolve(__dirname, "blog/index.html"),
        "article-bureaux": resolve(__dirname, "blog/vegetaliser-bureaux-paris-guide/index.html"),
      },
    },
  },
});
