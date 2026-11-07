// Page Décoration saisonnière : les textes viennent de docs/copywriting/06-decoration-saisonniere.md (premier jet, à retravailler avec la
// cliente), le title et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
// V7 (retours-v7, maquette de la cliente) : l'ordre des sections est celui de retours-v7/docs/03-DECORATION.md ; les textes que la maquette change
// sont listés dans `designTexts` (scripts/check-site.js les compte au lieu de les refuser). `proposition: true` : texte proposé par le fondateur
// (doc 03), à valider ; il n'est pas dans le copywriting.

export const saisonniere = {
  id: "saisonniere",
  path: "/decoration-vegetale-saisonniere-paris/",
  source: "06-decoration-saisonniere.md",
  title: "Décoration saisonnière en entreprise | D'un Bout À L'autre",
  description:
    "Décoration saisonnière pour entreprises, hôtels et commerces à Paris : Noël, printemps, événements internes, vitrines. Conception, installation, démontage.",
  // Textes pris sur la maquette V7 (frames decoration-01 à 21) ou proposés par le fondateur, absents du copywriting 06 ou modifiés par rapport à lui.
  designTexts: [
    "Noël",
    "Printemps",
    "Événements internes",
    "Vitrines",
    "Décoration saisonnière pour entreprises : un décor végétal qui change avec les saisons.",
    "un décor végétal",
    "Nous concevons, fabriquons, installons et démontons. Vous n'avez rien à gérer.",
    "Demander un devis",
    "Notre volonté",
    "Vous recevez vos clients dans un espace qui change avec l'année. Les fêtes, les lancements de saison, les temps forts internes… On s'occupe de tout : sélection des végétaux en accord avec votre identité, fabrication, livraison, installation dans vos délais, et démontage.",
    "On s'occupe de tout",
    "vos délais",
    "Nos styles d'aménagement",
    "Une décoration pour chaque moment de l'année.",
    "chaque moment",
    "Sapins, guirlandes végétales, suspensions et touches de rouge. Un décor chaleureux pour les fêtes de fin d'année.",
    "Compositions fleuries, façades et halls qui se renouvellent avec les beaux jours. Un décor frais pour accueillir la nouvelle saison.",
    "Séminaires, soirées d'équipe, journées clients : un décor végétal qui marque le temps fort et se démonte ensuite.",
    "Compositions de vitrine et de façade renouvelées à chaque saison, pour attirer l'œil des passants.",
    "Vous recevez vos clients dans un espace qui change avec l'année.",
    "vos clients",
    "Découvrez nos formules d'entretiens",
    "NOS RÉALISATIONS",
    "Ils nous ont confié leurs saisons.",
    "Voir plus de réalisations",
    "Les questions qu'on nous pose fréquemment.",
    "fréquemment",
    "Une saison approche ? Préparons votre décor dès maintenant.",
  ],
  sections: [
    {
      // Hero de Bureaux et Design : mots-clés en capitales à l'écran, titre à pastille, il reste en place et s'estompe sous la photo qui monte.
      type: "hero",
      bx: true,
      variant: "saisonniere",
      keywords: ["Noël", "Printemps", "Événements internes", "Vitrines"],
      title: "Décoration saisonnière pour entreprises : un décor végétal qui change avec les saisons.",
      tag: "un décor végétal",
      lead: "Nous concevons, fabriquons, installons et démontons. Vous n'avez rien à gérer.",
      cta: "Demander un devis",
    },
    {
      // « Notre volonté » (frames 02 à 06) : le texte sur photo de Terrasses (bureaux-photo-texte), la photo monte sur le hero puis est tenue un écran.
      type: "bureaux-photo-texte",
      variant: "saisonniere",
      label: "Notre volonté",
      photo: "decoration/volonte-01",
      alt: "Grand palmier et fauteuils cannés autour d'une table ronde, dans un espace de réception aux murs clairs.",
      text: "Vous recevez vos clients dans un espace qui change avec l'année. Les fêtes, les lancements de saison, les temps forts internes… On s'occupe de tout : sélection des végétaux en accord avec votre identité, fabrication, livraison, installation dans vos délais, et démontage.",
      tags: [
        { text: "On s'occupe de tout", variant: "orange" },
        { text: "vos délais", variant: "cream" },
      ],
    },
    {
      // « Nos styles d'aménagement » (frames 06 à 09 et zoom 08) : le composant de Terrasses (bureaux-styles). La frame 08 montre Printemps actif ; avec une entrée
      // active qui avance avec le scroll, Printemps l'est au deuxième quart de l'épinglage (point 2 des points à valider V7). `overlap` : la galerie orange
      // monte par-dessus pendant le dernier écran. Seule la description de Printemps vient de la maquette : les trois autres sont des propositions du doc 03.
      type: "bureaux-styles",
      variant: "saisonniere",
      overlap: true,
      label: "Nos styles d'aménagement",
      title: "Une décoration pour chaque moment de l'année.",
      tag: "chaque moment",
      photo: "decoration/style-01",
      alt: "Plafond d'un restaurant garni de feuillages, de branches blanches givrées, de rubans rouges et de suspensions en verre.",
      items: [
        {
          title: "Noël",
          text: "Sapins, guirlandes végétales, suspensions et touches de rouge. Un décor chaleureux pour les fêtes de fin d'année.",
          proposition: true,
        },
        {
          title: "Printemps",
          text: "Compositions fleuries, façades et halls qui se renouvellent avec les beaux jours. Un décor frais pour accueillir la nouvelle saison.",
        },
        {
          title: "Événements internes",
          text: "Séminaires, soirées d'équipe, journées clients : un décor végétal qui marque le temps fort et se démonte ensuite.",
          proposition: true,
        },
        {
          title: "Vitrines",
          text: "Compositions de vitrine et de façade renouvelées à chaque saison, pour attirer l'œil des passants.",
          proposition: true,
        },
      ],
    },
    {
      // « Vous recevez vos clients » (frames 08 à 14) : la galerie orange de Bureaux et Design, sans étiquette. Position (x et w en vw, y de départ en svh sous le haut
      // de la section au début du pin), proportions et vitesse relevées sur les frames 09 à 14 à 1728 x 1030 : les quatre photos montent ensemble (même écart à
      // chaque instant d'une frame à l'autre : 313 px entre les frames 10 et 11 pour les quatre), le doc 03 demande des vitesses différentes, les frames priment.
      // Le texte est devant les photos sur les frames 11 et 12 (comme Bureaux). `mobile` : les trois photos gardées sous 900 px.
      type: "bureaux-galerie",
      variant: "saisonniere",
      title: "Vous recevez vos clients dans un espace qui change avec l'année.",
      tag: "vos clients",
      cta: { label: "Découvrez nos formules d'entretiens", to: "/entretien-abonnement-plantes-entreprise-paris/" },
      photos: [
        {
          photo: "decoration/gallery-03",
          alt: "Portail en fer noir encadré d'une grande couronne de feuillages et de fruits rouges, avec un ruban rouge, dans une cour d'immeuble parisien.",
          x: 2.26, y: 39.5, w: 18, ratio: 0.7456, speed: 39,
          mobile: { x: 6, y: 78, w: 36, speed: 40 },
        },
        {
          photo: "decoration/gallery-04",
          alt: "Façade d'immeuble parisien couverte de fleurs bleues, jaunes et rouges, vue d'en bas sous un ciel bleu.",
          x: 81.37, y: 45, w: 18.75, ratio: 0.75, speed: 39,
          mobile: { x: 22, y: 142, w: 36, speed: 40 },
        },
        {
          photo: "decoration/gallery-02",
          alt: "Table dressée avec des verres en cristal et des bouquets d'oiseaux de paradis, dans un restaurant aux murs tapissés.",
          x: -7, y: 86.1, w: 30.15, ratio: 1.5819, speed: 39,
        },
        {
          photo: "decoration/gallery-01",
          alt: "Enseigne de l'Atelier Du Geste à l'Emotion entourée de guirlandes de tournesols.",
          x: 66.84, y: 97.8, w: 19.85, ratio: 0.8793, speed: 39,
          mobile: { x: 58, y: 104, w: 36, speed: 40 },
        },
      ],
    },
    {
      // « Nos réalisations » (frames 14 à 17) : les deux cartes de Scénographie, reprises par leur titre dans src/data/pages/realisations.js.
      type: "fiche-autres",
      variant: "v7",
      label: "NOS RÉALISATIONS",
      heading: "Ils nous ont confié leurs saisons.",
      tag: "leurs saisons",
      featured: ["Façade Végétalisée Atelier DGE", "Décor Saint Tropez"],
      more: { label: "Voir plus de réalisations", to: "/realisations/" },
    },
    {
      // FAQ à 4 questions (frames 17 à 19). Les réponses sont celles du copywriting (valeur par défaut retenue pour le point 6 des points à valider V7).
      type: "faq",
      variant: "v7",
      label: "FAQ",
      title: "Les questions qu'on nous pose fréquemment.",
      tag: "fréquemment",
      items: [
        {
          q: "Proposez-vous le démontage après la période ?",
          a: "Oui, il est prévu dans nos prestations. On vient récupérer tout le matériel au moment qui vous arrange.",
        },
        {
          q: "Peut-on personnaliser aux couleurs de notre marque ?",
          a: "Absolument. C'est même ce qu'on préfère faire. Nous adaptons les couleurs, les rubans, les guirlandes et tous les éléments décoratifs à votre charte graphique.",
        },
        {
          q: "Quel budget prévoir pour décorer nos locaux ?",
          a: "Cela dépend de la surface, du type de décoration et du nombre d'espaces à habiller. Nos prestations commencent à quelques centaines d'euros pour une décoration simple et peuvent aller jusqu'à plusieurs milliers pour la décoration complète d'un hôtel ou d'un grand commerce. Contactez-nous pour un devis personnalisé.",
        },
        {
          q: "Intervenez-vous en dehors de Paris ?",
          a: "Oui, nous intervenons dans toute l'Île-de-France et en dehors pour les projets d'envergure.",
        },
      ],
    },
    {
      // Bandeau final (frames 19 à 21) : « dès maintenant » porte la pastille ; pas de ligne de téléphone (les coordonnées sont dans le footer et le menu).
      type: "cta-final",
      variant: "saisonniere",
      title: "Une saison approche ? Préparons votre décor dès maintenant.",
      tag: "dès maintenant",
      cta: "Demander un devis",
    },
  ],
};
