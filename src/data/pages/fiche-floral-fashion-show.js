// Fiche projet « Floral Fashion Show » : le parcours Avant, Projet, Après de docs/copywriting/09-realisations.md (premier jet, à retravailler
// avec la cliente). Seuls le titre du projet, sa catégorie (le copywriting classe ce projet en Scénographie & événementiel) et sa photo
// de résultat existent : tout le reste est à fournir, donc todo(). L'exemple « Siège social, Paris 8e » du copywriting ne sert qu'à caler
// la forme des champs : il n'est pas publié comme un projet. La fiche est pilotée par ces données : une autre fiche = un autre fichier
// de ce type. Le title est « <projet> | <site> » (titlePrefix) ; la meta est à fournir. Textes de navigation : sous `micro`.
import { todo } from "../../components/placeholder.js";

export const ficheFloralFashionShow = {
  id: "floral-fashion-show",
  path: "/realisations/floral-fashion-show/",
  source: "09-realisations.md",
  titlePrefix: "Floral Fashion Show",
  description: todo("meta description de la fiche"),
  sections: [
    {
      type: "hero",
      compact: true,
      title: "Floral Fashion Show",
      tag: "Fashion Show", // intro.js attend au moins un title tag dans le H1 (sans tag, GSAP avertit)
      lead: "Scénographie & événementiel",
    },
    {
      type: "project",
      micro: { back: { label: "Toutes les réalisations", to: "/realisations/" } },
      avant: {
        heading: "Avant",
        photo: null,
        facts: [{ label: "le besoin du client", value: todo("besoin du client") }],
      },
      projet: {
        heading: "Projet",
        facts: [
          { label: "Les contraintes rencontrées", value: todo("contraintes rencontrées") },
          { label: "Notre proposition", value: todo("proposition") },
          { label: "Les matériaux et plantes utilisés", value: todo("matériaux et plantes utilisés") },
          { label: "Mission", value: todo("mission (conception, fourniture, installation, entretien)") },
        ],
      },
      apres: {
        heading: "Après",
        photo: { src: "realisations/real-floral-fashion-show", alt: "Mannequin devant des arches de roses roses et rouges lors du Floral Fashion Show" },
        facts: [
          { label: "Le résultat", value: todo("résultat") },
          { label: "Surface", value: todo("surface") },
          { label: "Durée du projet", value: todo("durée du projet") },
          { label: "Budget", value: todo("budget à partir de") },
        ],
      },
    },
    {
      type: "cta-final",
      title: "Un projet en tête ? Parlons-en.",
      tag: "Parlons-en",
      cta: "Demander un devis",
    },
  ],
};
