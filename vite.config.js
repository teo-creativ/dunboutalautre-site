import { defineConfig } from "vite";
import { resolve } from "node:path";
import injectComponents from "./vite-plugins/inject-components.js";
import { base } from "./src/data/base.js";

// Preview non indexée (VITE_NOINDEX=1, workflow GitHub Pages) : robots.txt à la racine du site construit. Rien dans le build normal.
const previewRobots = {
  name: "preview-robots",
  generateBundle() {
    this.emitFile({ type: "asset", fileName: "robots.txt", source: "User-agent: *\nDisallow: /\n" });
  },
};

// base : VITE_BASE ("/dunboutalautre-site/" sur GitHub Pages), "/" par défaut.
export default defineConfig({
  base,
  plugins: [injectComponents(), ...(process.env.VITE_NOINDEX === "1" ? [previewRobots] : [])],
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
        ateliers: resolve(__dirname, "ateliers-vegetaux-paris/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        realisations: resolve(__dirname, "realisations/index.html"),
        "floral-fashion-show": resolve(__dirname, "realisations/floral-fashion-show/index.html"),
        blog: resolve(__dirname, "blog/index.html"),
        "article-bureaux": resolve(__dirname, "blog/vegetaliser-bureaux-paris-guide/index.html"),
      },
    },
  },
});
