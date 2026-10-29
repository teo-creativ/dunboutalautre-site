// Valeurs manquantes (contenus à fournir par la cliente). Jamais de texte inventé : une valeur inconnue est un marqueur visible
// `[À compléter]`, repérable par l'attribut data-placeholder (liste : node scripts/check-site.js --placeholders).
// Dans les fichiers de données : todo("citation client"). Les composants rendent les valeurs avec text() ou frText().
import { esc, fr } from "./utils.js";

export const PLACEHOLDER = "[À compléter]";

export const todo = (label) => ({ todo: label });
export const isTodo = (value) => typeof value === "object" && value !== null && typeof value.todo === "string";

export const placeholder = (label) => `<span class="placeholder" data-placeholder="${esc(label)}">${PLACEHOLDER}</span>`;

// Texte échappé, ou marqueur si la valeur manque.
export const text = (value) => (isTodo(value) ? placeholder(value.todo) : esc(value));

// Idem avec la typographie française (espace fine insécable avant « : », « ? », « ! » et « ; »).
export const frText = (value) => (isTodo(value) ? placeholder(value.todo) : esc(fr(value)));
