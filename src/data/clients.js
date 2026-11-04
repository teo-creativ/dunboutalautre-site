// Clients et avis communs aux pages Bureaux (V5) et Design végétal (V6) : la maquette montre les mêmes six logos en couleur (clés « -svg » de
// logos.js, fournis avec la V5) et le même avis. Une seule copie, importée par src/data/pages/bureaux.js et design-vegetal.js.

export const clientsCouleur = [
  { name: "Thunes", logo: "thunes-svg" },
  { name: "Chez Simone", logo: "chez-simone-svg" },
  { name: "Inato", logo: "inato-svg" },
  { name: "Eataly", logo: "eataly-svg" },
  { name: "Kéobiz", logo: "keobiz-svg" },
  { name: "Yves Rocher", logo: "yves-rocher-svg" },
];

// Avis de la première version, FICTIF : à remplacer par un vrai avis avant la mise en ligne (retours-v5/docs/05-POINTS-A-VALIDER-V5.md, point 5, et
// docs/POINTS-A-VALIDER.md lignes 223 et 256). `fictif` fait porter data-fictif à l'avis dans le HTML.
export const avisFictif = {
  quote:
    "D'un Bout À L'autre a su capter l'esprit de notre marque en apportant un équilibre végétal remarquable dans notre siège parisien. Les équipes sont ravies et l'entretien hebdomadaire est d'une discrétion absolue.",
  name: "Hélène Mercier",
  role: "Directrice Environnement de Travail & RSE,",
  logo: "thunes-svg",
  fictif: true,
};
