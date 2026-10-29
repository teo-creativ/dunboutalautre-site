// Page Réalisations : textes de docs/copywriting/09-realisations.md (premier jet, à retravailler avec la cliente), title et meta de
// docs/arborescence-et-strategie.md. Les 5 projets (titres, photos, alt) sont ceux de la section Réalisations de l'accueil
// (src/data/realisations.js, jamais modifié) : une seule source. Le copywriting ne classe que Floral Fashion Show et Eataly (Scénographie
// & événementiel) ; les trois autres projets ont une catégorie à fournir : badge [À compléter], visibles sous « Tous les projets » seulement.
// La microcopie du filtre (décompte, état vide, nom du groupe) n'est pas du copywriting : sous `micro`, à valider (docs/POINTS-A-VALIDER.md).
export const realisationsPage = {
  id: "realisations",
  path: "/realisations/",
  source: "09-realisations.md",
  title: "Réalisations de design végétal à Paris | D'un Bout À L'autre",
  description:
    "Découvrez les réalisations de D'un Bout À L'autre : bureaux végétalisés, design végétal sur mesure, scénographies, terrasses et décors de saison à Paris.",
  sections: [
    {
      type: "hero",
      compact: true,
      title: "Nous travaillons chaque projet avec la même passion.",
      tag: "la même passion",
      lead: "Bureaux, design végétal, scénographies, terrasses, décors de saison... Découvrez tous nos projets, de l'avant à l'après.",
    },
    {
      type: "filters-grid",
      label: "GRILLE DE PROJETS",
      filters: [
        { key: "all", label: "Tous les projets" },
        { key: "bureaux", label: "Végétalisation de bureaux" },
        { key: "design-vegetal", label: "Design végétal sur mesure" },
        { key: "scenographie", label: "Scénographie & événementiel" },
        { key: "terrasses", label: "Terrasses" },
        { key: "saisonniere-noel", label: "Décoration saisonnière & Noël" },
        { key: "ateliers", label: "Ateliers végétaux" },
      ],
      // Catégorie de chaque projet de l'accueil, par nom de fichier de photo (aucune catégorie : à fournir).
      categories: { "real-floral-fashion-show": "scenographie", "real-facade-fleurie-bleue": "scenographie" },
      // Page du projet, quand elle existe (T26).
      links: { "real-floral-fashion-show": "/realisations/floral-fashion-show/" },
      micro: {
        groupLabel: "Filtrer les projets par catégorie",
        countOne: "1 projet affiché",
        countMany: "{n} projets affichés",
        empty: "Aucun projet dans cette catégorie pour le moment.",
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
