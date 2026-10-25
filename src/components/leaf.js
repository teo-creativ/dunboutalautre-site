// Feuille décorative (public/assets/brand/leaf.svg) en SVG inline : le trait suit currentColor, donc les tokens de couleur.
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../../public/assets/brand/leaf.svg", import.meta.url), "utf8");
const viewBox = source.match(/viewBox="([^"]+)"/)[1];
const path = source.match(/<path[^>]*\/>/)[0];

export const leaf = (className) =>
  `<svg class="${className}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${path}</svg>`;

// Utilisable dans une page : <!--@leaf class="cta-final__leaf"-->
export default ({ class: className = "" } = {}) => leaf(className);
