// Section Réalisations de l'accueil (retours-v2/docs/02-SECTION-REALISATIONS.md) : une seule source pour les titres, les photos
// et leurs textes alternatifs. L'ordre est celui du PDF du fondateur (lien titre et photo voulu par lui).
// Pages de réalisation fictives pour l'instant : pas de `path`, href() de site.js renvoie « # ».
// À confirmer (docs/POINTS-A-VALIDER.md, ligne 67) : les photos de « Eataly » (façade fleurie bleue) et de « Saint-Tropez, BHV »
// (table dressée) suivent le PDF ; pour les inverser, échanger les deux champs `photo` et `alt` de ces deux entrées.

export const realisations = [
  {
    title: "Floral Fashion Show",
    photo: "realisations/real-floral-fashion-show",
    alt: "Mannequin devant des arches de roses roses et rouges lors du Floral Fashion Show",
  },
  {
    title: "Felicita, Halloween",
    photo: "realisations/real-felicita-halloween",
    alt: "Décor d'Halloween chez Felicita : citrouilles, chrysanthèmes et fausses toiles d'araignée",
  },
  {
    title: "Eataly",
    photo: "realisations/real-facade-fleurie-bleue",
    alt: "Composition florale bleue, jaune et orange suspendue sur une façade, vue d'en bas",
  },
  {
    title: "Saint-Tropez, BHV",
    photo: "realisations/real-table-restaurant",
    alt: "Table dressée avec bouquets d'oiseaux de paradis et verres en cristal",
  },
  {
    title: "Atelier Du Geste à l’Emotion",
    photo: "realisations/real-atelier-geste-emotion",
    alt: "Enseigne de l'Atelier Du Geste à l'Emotion entourée de tournesols",
  },
];
