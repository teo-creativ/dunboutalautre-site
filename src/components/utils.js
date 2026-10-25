// Échappement minimal pour le texte et les attributs générés depuis src/data/site.js.
export const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
