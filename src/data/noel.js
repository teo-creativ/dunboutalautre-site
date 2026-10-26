// Contenu de la landing Noël V2 (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md), texte repris tel quel.
// Le texte du hero, de « Notre volonté » et du titre du flux est dans la page (decoration-noel-entreprises-paris/index.html), car il
// porte des title tags. Ici : les photos, les univers, les étapes et la FAQ. Témoignages et FAQ sont complétées au prompt 06.

export const noel = {
  path: "/decoration-noel-entreprises-paris/",
  origin: "https://dunboutalautre.co", // domaine final supposé, voir docs/POINTS-A-VALIDER.md
  title: "Décoration de Noël entreprise à Paris | D'un Bout À L'autre",
  description:
    "Décoration de Noël pour entreprises à Paris : sapins, scénographies, décors aux couleurs de votre marque. Conception, fabrication, installation, démontage.",
  // Image de partage (Open Graph) : à remplacer par un visuel 1200 x 630, voir docs/POINTS-A-VALIDER.md ligne 54.
  share: {
    src: "noel-v2/noel-salon-dore-couleur",
    alt: "Salon aux boiseries dorées décoré de branches givrées, de bûches de bouleau et de bougies devant une cheminée",
  },

  // Flux horizontal. Positions de départ en % du viewport (x et w : de la largeur, y et h : de la hauteur), mesurées sur la
  // frame noel-page-07 (1728 x 849). speed : vitesse relative de défilement de droite à gauche (profondeur), mesurée sur les frames 09
  // et 11 (portail 1,5, sapins 1,2, salon 1,15 ; le tableau du doc donnait 1,5 / 1,3 / 1,1).
  flux: {
    photos: [
      // Vignette : pas d'image propre. C'est la photo « Notre volonté » (le même plafond, en grand) qui rétrécit jusqu'à cette position
      // et défile avec le flux, ce qui assure la continuité. noel-bw-eataly-plafond.jpg (sa moitié gauche) n'est pas utilisé.
      { id: "plafond", thumb: true, x: -2, y: 61, w: 20, h: 39, speed: 1 },
      {
        id: "branches",
        src: "noel-v2/noel-bw-branches-givrees",
        alt: "Branches givrées, bûches de bouleau et bougies dans un salon baigné de lumière",
        x: 15, y: -4, w: 16, h: 27, speed: 1.25,
      },
      {
        id: "salon",
        src: "noel-v2/noel-bw-salon-dore",
        alt: "Salon aux boiseries sculptées et au grand miroir, avec des branches givrées devant la cheminée",
        x: 47, y: 74, w: 17, h: 33, speed: 1.15,
      },
      {
        id: "portail",
        src: "noel-v2/noel-bw-portail-couronne",
        alt: "Grille de fer noir entourée d'une grande couronne de sapin avec un nœud, dans une cour parisienne",
        x: 78, y: -8, w: 21, h: 42, speed: 1.5,
      },
      {
        id: "sapins",
        src: "noel-v2/noel-bw-sapins-verriere",
        alt: "Trois grands sapins décorés de guirlandes lumineuses et de lanternes, sous une grande verrière métallique",
        x: 84, y: 66, w: 17, h: 38, speed: 1.2,
      },
    ],
  },

  // Nos univers (04 §4). Une seule photo-carte pour les cinq univers pour l'instant : un champ `photo` ({ src, alt }) sur un univers
  // la remplace, la photo change alors en fondu enchaîné de 0,5 s à chaque changement d'univers (universes.js).
  // default : indice de l'univers ouvert au chargement sur ordinateur (« Noël immersif », comme sur la maquette) ; sur tactile, le premier.
  univers: {
    label: "NOS UNIVERS",
    photo: {
      src: "noel-v2/noel-salon-dore-couleur",
      alt: "Salon aux boiseries dorées décoré de branches givrées, de bûches de bouleau et de bougies devant une cheminée",
    },
    default: 2,
    items: [
      { title: "Noël naturel", text: "Sapin, branches, pommes de pin et végétaux naturels. Une ambiance chaleureuse, qui sent la forêt." },
      { title: "Noël chic", text: "Blanc, doré et végétal. Un Noël élégant et sobre, pour les lieux qui reçoivent une clientèle exigeante." },
      { title: "Noël immersif", text: "Forêt, arche, plafond végétalisé, scénographie complète. On transforme le lieu entier : vos clients entrent dans un décor." },
      { title: "Noël corporate", text: "Un décor aux couleurs de votre marque, avec votre logo. Votre Noël devient une extension de votre identité." },
      { title: "Noël responsable", text: "Location, réutilisation d'une année sur l'autre, végétaux artificiels ou stabilisés. Un décor beau, sans gaspillage." },
    ],
  },

  // Notre fonctionnement (04 §5).
  process: {
    label: "NOTRE FONCTIONNEMENT",
    steps: [
      { title: "Brief", text: "Vous nous indiquez le lieu, la surface, le budget et l'univers qui vous plaît. On peut aussi passer sur place pour mesurer." },
      { title: "Proposition visuelle", text: "On vous envoie un moodboard et un devis. On ajuste ensemble jusqu'à validation." },
      { title: "Fabrication", text: "Les éléments du décor sont préparés en atelier : couronnes, compositions, structures, décors aux couleurs de votre marque." },
      { title: "Installation", text: "Notre équipe installe sur site, dans vos délais, avec le moins de gêne possible pour votre activité." },
      { title: "Démontage", text: "Après les fêtes, on revient tout démonter, au moment qui vous arrange." },
    ],
  },

  // FAQ de la V1, gardée le temps du prompt 06 : elle alimente le JSON-LD de noel-seo.js, la section n'est plus dans la page.
  faq: [
    {
      q: "À partir de quand faut-il nous contacter pour Noël ?",
      a: "Idéalement, prenez contact dès septembre ou octobre. La période de Noël est notre saison la plus chargée et les créneaux d'installation partent vite, surtout pour les premières semaines de décembre. Plus vous nous contactez tôt, plus on a de liberté pour concevoir quelque chose d'ambitieux.",
    },
    {
      q: "Proposez-vous le démontage après les fêtes ?",
      a: "Oui, c'est inclus dans toutes nos prestations de Noël. On vient récupérer tout le matériel après les fêtes, au moment qui vous arrange.",
    },
    {
      q: "Peut-on personnaliser aux couleurs de notre marque ?",
      a: "Absolument. C'est même ce qu'on préfère faire. Nous adaptons les couleurs des boules, des rubans, des guirlandes et de tous les éléments décoratifs à votre charte graphique. Votre décoration de Noël devient une extension cohérente de votre identité de marque.",
    },
    {
      q: "Peut-on louer le décor plutôt que l'acheter ?",
      a: "Oui. La location est possible, et elle est au cœur de notre offre Noël responsable : le décor est réutilisé d'une année sur l'autre. Contactez-nous pour voir ce qui est possible selon votre projet.",
    },
    {
      q: "Intervenez-vous en dehors de Paris ?",
      a: "Oui, nous intervenons dans toute l'Île-de-France et en dehors pour les projets d'envergure.",
    },
    {
      q: "Quel budget prévoir pour décorer nos bureaux pour Noël ?",
      a: "Cela dépend de la surface, du type de décoration souhaité et du nombre d'espaces à habiller. Nos prestations commencent à quelques centaines d'euros pour une décoration simple et peuvent aller jusqu'à plusieurs milliers pour la décoration complète d'un hôtel ou d'un grand commerce. Contactez-nous pour un devis personnalisé.",
    },
  ],
};
