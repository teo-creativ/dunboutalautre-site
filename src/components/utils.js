// Typographie française : une espace fine insécable (U+202F) avant « ? », « ! », « : » et « ; », pour qu'un signe de ponctuation ne se
// retrouve jamais seul en début de ligne. Réservée à l'affichage : les données (et le JSON-LD) gardent leur texte d'origine.
const NARROW_NBSP = String.fromCharCode(0x202f);
export const fr = (value) => String(value).replace(/ ([?!:;])/g, `${NARROW_NBSP}$1`);

// Échappement minimal pour le texte et les attributs générés depuis src/data/site.js.
export const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
