// Page Terrasses : les textes viennent de docs/copywriting/05-terrasses.md (premier jet, à retravailler avec la cliente), le title et la meta de
// docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
// V7 (retours-v7, maquette de la cliente) : l'ordre des sections est celui de retours-v7/docs/02-TERRASSES.md ; les textes que la maquette change
// sont listés dans `designTexts` (scripts/check-site.js les compte au lieu de les refuser). `proposition: true` : texte proposé par le fondateur
// (doc 02), à valider ; il n'est pas dans le copywriting.

export const terrasses = {
  id: "terrasses",
  path: "/amenagement-terrasse-paris/",
  source: "05-terrasses.md",
  title: "Aménagement de terrasse à Paris | D'un Bout À L'autre",
  description:
    "D'un Bout À L'autre aménage votre terrasse à Paris : conception, plantation et suivi, pour appartements, hôtels, restaurants et entreprises. Devis gratuit.",
  // Textes pris sur la maquette V7 (frames terrasses-01 à 35) ou proposés par le fondateur, absents du copywriting 05 ou modifiés par rapport à lui.
  designTexts: [
    "Appartement",
    "Hôtel",
    "Restaurant",
    "Entreprise.",
    "Du choix des végétaux à l'installation, en passant par le suivi saisonnier : on s'occupe de tout.",
    "Demander un devis",
    "Le branding végétal",
    "Dans nos villes bétonnées, posséder une terrasse, c'est avoir la chance de répondre à l'appel du vert. Encore faut-il qu'elle soit pensée pour la ville : charge limitée, vent, accès compliqué. On s'occupe de tout, pour que votre terrasse devienne une vraie parenthèse végétale.",
    "à l'appel du vert",
    "une vraie parenthèse végétale",
    "Nos styles d'aménagement",
    "Votre terrasse mérite un style d'aménagement qui lui ressemble.",
    "mérite",
    "Oliviers, lavande, romarin, graminées. Une végétation sobre et parfumée, qui supporte le soleil et le vent.",
    "Peu d'espèces, de grands volumes, des contenants sobres. Un jardin graphique qui laisse respirer l'espace.",
    "Vivaces, grimpantes et floraisons qui se succèdent. Une terrasse colorée qui change au fil des mois.",
    "L'expertise des terrasses parisiennes",
    "Les spécificités des terrasses parisiennes.",
    "parisiennes",
    "Aménager une terrasse à Paris, c'est devoir travailler avec des contraintes propres à la ville.",
    "Les trois contraintes",
    "NOTRE PROCESSUS DE CRÉATION",
    "De votre idée à la pose, on travaille en collaboration.",
    "en collaboration",
    "Les questions qu'on nous pose fréquemment.",
    "fréquemment",
    "Ma terrasse peut supporter quel poids ?",
    "La charge maximale dépend de la structure de votre immeuble. En règle générale, on recommande de ne pas dépasser 150 à 200 kg/m². On travaille avec des substrats allégés et des contenants adaptés pour rester dans ces limites.",
    "Quelles plantes pour une terrasse très ensoleillée ?",
    "Votre terrasse mérite d'être aménagée.",
  ],
  sections: [
    {
      // Hero de Bureaux et Design : mots-clés en capitales à l'écran (le point final de « Entreprise. » est sur la maquette), titre à pastille.
      type: "hero",
      bx: true,
      variant: "terrasses",
      keywords: ["Appartement", "Hôtel", "Restaurant", "Entreprise."],
      title: "Aménagement de terrasse à Paris : votre espace extérieur, de la conception au suivi.",
      tag: "votre espace extérieur",
      lead: "Du choix des végétaux à l'installation, en passant par le suivi saisonnier : on s'occupe de tout.",
      cta: "Demander un devis",
    },
    {
      // « Le branding végétal » (frames 02 à 06) : l'intitulé semble sorti d'un autre projet (le texte parle de la ville, pas de branding),
      // reproduit tel quel (point 3 des points à valider V7). La photo monte sur le hero, le texte est tenu avec elle un écran.
      type: "bureaux-photo-texte",
      reveal: true, // V8 : texte (lignes, pastilles droites) et photo (clip-path, parallaxe douce) révélés à l'arrivée (reveal-on-enter)
      label: "Le branding végétal",
      photo: "terrasses/amenagement-01",
      alt: "Olivier dans un grand pot en pierre sur une terrasse parisienne, devant un immeuble aux fenêtres à volets et un canapé crème.",
      text: "Dans nos villes bétonnées, posséder une terrasse, c'est avoir la chance de répondre à l'appel du vert. Encore faut-il qu'elle soit pensée pour la ville : charge limitée, vent, accès compliqué. On s'occupe de tout, pour que votre terrasse devienne une vraie parenthèse végétale.",
      tags: [
        { text: "à l'appel du vert", variant: "orange" },
        { text: "une vraie parenthèse végétale", variant: "cream" },
      ],
    },
    {
      // « Nos styles d'aménagement » (frames 06 à 09) : une seule image fournie pour l'instant (`photo`), la structure accepte une `photo` par entrée
      // (point 4 des points à valider V7). Seule la description du Tropical vient du copywriting : les trois autres sont les propositions du doc 02.
      type: "bureaux-styles",
      label: "Nos styles d'aménagement",
      title: "Votre terrasse mérite un style d'aménagement qui lui ressemble.",
      tag: "mérite",
      photo: "terrasses/style-01",
      alt: "Palmier dans un pot en pierre devant la balustrade d'un balcon, à côté d'un canapé aux coussins crème.",
      items: [
        {
          title: "Méditerranéen",
          text: "Oliviers, lavande, romarin, graminées. Une végétation sobre et parfumée, qui supporte le soleil et le vent.",
          proposition: true,
        },
        {
          title: "Tropical",
          text: "Fougères arborescentes, bambous, palmiers, philodendrons, cannas. Une végétation dense et contrastée, qui fait voyager.",
        },
        {
          title: "Épuré & contemporain",
          text: "Peu d'espèces, de grands volumes, des contenants sobres. Un jardin graphique qui laisse respirer l'espace.",
          proposition: true,
        },
        {
          title: "Fleuri",
          text: "Vivaces, grimpantes et floraisons qui se succèdent. Une terrasse colorée qui change au fil des mois.",
          proposition: true,
        },
      ],
    },
    {
      // « Les spécificités des terrasses parisiennes » (frames 08 à 20) puis la photo qui grandit et le slider des trois contraintes (frames 17 à 28) :
      // une seule scène épinglée (scripts/bureaux-matieres.js, profil « terrasses », bande dans scripts/bureaux-bande.js). Deux rangées de photos en
      // sens opposé (la 1re vers la droite, la 2e vers la gauche, comme sur les frames 10 à 13) ; la photo de l'olivier (`hero`) est le premier fond du
      // slider. L'ordre des rangées est celui des frames : la 2e rangée reprend la photo des graminées après l'olivier (le doc n'en cite que trois).
      // Titres du slider sans pastille (comme Design).
      type: "bureaux-matieres",
      variant: "terrasses",
      sliderLabel: "Les trois contraintes",
      band: {
        label: "L'expertise des terrasses parisiennes",
        title: "Les spécificités des terrasses parisiennes.",
        tag: "parisiennes",
        lead: "Aménager une terrasse à Paris, c'est devoir travailler avec des contraintes propres à la ville.",
        rows: [
          [
            { photo: "terrasses/gallery-05", alt: "Brins de lavande en fleur au premier plan, avec la tour Eiffel floue au loin." },
            { photo: "terrasses/gallery-03", alt: "Graminées de plusieurs teintes sur une terrasse, avec Montmartre et le Sacré-Cœur au fond." },
            { photo: "terrasses/gallery-02", alt: "Branches de pin au premier plan, avec la tour Eiffel au loin." },
            { photo: "terrasses/gallery-06", alt: "Palmier devant la balustrade d'un balcon, à côté d'un canapé crème." },
          ],
          [
            { photo: "terrasses/gallery-01", alt: "Plante verte à longues feuilles sur un balcon, avec les toits de l'Hôtel de Ville de Paris derrière." },
            { photo: "terrasses/gallery-04", alt: "Fleurs de jasmin blanc devant un ciel nuageux et la tour Eiffel." },
            { photo: "terrasses/bg-01", alt: "Olivier dans un pot en pierre sur une terrasse, avec un fauteuil crème et une grande baie vitrée.", hero: true },
            { photo: "terrasses/gallery-03", alt: "Graminées de plusieurs teintes sur une terrasse, avec Montmartre et le Sacré-Cœur au fond." },
          ],
        ],
      },
      items: [
        {
          title: "Poids et charges",
          text: "Chaque dalle de terrasse a une charge maximale autorisée, souvent bien inférieure à ce qu'on imagine. On travaille avec des substrats allégés et des contenants adaptés pour rester dans les limites structurelles de votre immeuble, sans vous exposer à aucun risque.",
          photo: "terrasses/bg-01",
          alt: "Olivier dans un pot en pierre sur une terrasse, avec un fauteuil crème et une grande baie vitrée.",
        },
        {
          title: "Ensoleillement et vent",
          text: "Selon l'orientation, l'étage et les bâtiments voisins, une terrasse peut être très ensoleillée, très ombragée, ou les deux selon les heures. On sélectionne les végétaux en fonction de votre exposition réelle.",
          photo: "terrasses/bg-02",
          alt: "Graminées au premier plan, avec Montmartre et le Sacré-Cœur dans la brume au loin.",
        },
        {
          title: "Accès et logistique",
          text: "Ascenseur, escalier, monte-charge : on gère la logistique d'approvisionnement de A à Z pour que vous n'ayez rien à coordonner.",
          photo: "terrasses/bg-03",
          alt: "Lavande en fleur au premier plan, avec la tour Eiffel et les toits de Paris flous au loin.",
        },
      ],
    },
    {
      type: "process",
      variant: "v7",
      label: "NOTRE PROCESSUS DE CRÉATION",
      title: "De votre idée à la pose, on travaille en collaboration.",
      tag: "en collaboration",
      steps: [
        {
          title: "Visite et analyse",
          text: "On vient sur place pour prendre les mesures, évaluer l'exposition, identifier les contraintes techniques (charge, accès, réseau d'eau) et comprendre l'ambiance que vous voulez créer.",
        },
        {
          title: "Proposition végétale",
          text: "Plan d'aménagement avec sélection des végétaux, recommandations pour les contenants et les substrats, devis détaillé. On discute jusqu'à trouver le bon équilibre entre vos envies et les contraintes de l'espace.",
        },
        {
          title: "Installation",
          text: "On livre et on installe. Préparation des contenants, substrat, plantation, arrosage initial. Vous récupérez une terrasse prête à vivre.",
        },
        {
          title: "Suivi saisonnier",
          text: "Taille, remplacement des végétaux saisonniers, préparation hivernale, adaptation au printemps. Pour que votre terrasse reste belle toute l'année, pas seulement en juin.",
        },
      ],
      // Pas de lien « Découvrir nos abonnements » sous la timeline : la maquette n'en montre pas.
    },
    {
      // FAQ à 5 questions (frames 31 à 33). Les réponses sont celles du copywriting (valeur par défaut retenue pour le point 6 des points à valider V7,
      // comme sur Scénographie) ; la première perd sa dernière phrase, comme sur la maquette. La question sur les plantes ne parle que du soleil sur la
      // maquette : la réponse du copywriting couvre aussi l'ombre.
      type: "faq",
      variant: "v7",
      label: "FAQ",
      title: "Les questions qu'on nous pose fréquemment.",
      tag: "fréquemment",
      items: [
        {
          q: "Ma terrasse peut supporter quel poids ?",
          a: "La charge maximale dépend de la structure de votre immeuble. En règle générale, on recommande de ne pas dépasser 150 à 200 kg/m². On travaille avec des substrats allégés et des contenants adaptés pour rester dans ces limites.",
        },
        {
          q: "Quelles plantes pour une terrasse très ensoleillée ?",
          a: "Ensoleillée : lavande, agapanthes, graminées, olivier, rosiers. Ombragée : fougères, hostas, hortensias, buis. On adapte toujours la sélection à votre exposition réelle, évaluée lors de la visite.",
        },
        {
          q: "Vous proposez un entretien après la plantation ?",
          a: "Oui. Passages réguliers pour la taille, le remplacement des végétaux saisonniers, la préparation hivernale. Votre terrasse reste belle sans que vous ayez à vous en préoccuper.",
        },
        {
          q: "Ma terrasse est en copropriété, est-ce un problème ?",
          a: "Non. On a l'habitude de travailler avec les syndics et de respecter les règlements de copropriété.",
        },
        {
          q: "Quel budget prévoir ?",
          a: "Ça dépend de la surface, des végétaux et de la complexité. On établit un devis personnalisé après chaque visite.",
        },
      ],
    },
    {
      // Bandeau final (frames 33 à 35) : « mérite » porte la pastille ; pas de ligne de téléphone (les coordonnées sont dans le footer et le menu).
      type: "cta-final",
      variant: "terrasses",
      title: "Votre terrasse mérite d'être aménagée.",
      tag: "mérite",
      cta: "Demander un devis",
    },
  ],
};
