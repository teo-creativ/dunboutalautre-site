// Wordmark en SVG inline : la couleur suit `currentColor`, donc le thème du header et du footer, sans hex en dur.
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../../public/assets/brand/logo-wordmark-cream.svg", import.meta.url), "utf8");
const paths = source
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .replace(/(fill|stroke)="#[0-9A-Fa-f]{6}"/g, '$1="currentColor"');

export const wordmark = (className) =>
  `<svg class="${className}" viewBox="0 0 936 86" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${paths}</svg>`;
