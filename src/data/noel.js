// Contenu de la landing Noël (docs/CONTENU-NOEL.md et docs/copywriting/07-landing-noel.md), texte repris tel quel.
// Les emplacements à compléter portent la mention [À compléter] (photos, logo Eataly, témoignage).

export const noel = {
  path: "/decoration-noel-entreprises-paris/",
  origin: "https://dunboutalautre.co", // domaine final supposé, voir docs/POINTS-A-VALIDER.md
  title: "Décoration de Noël entreprise à Paris | D'un Bout À L'autre",
  description:
    "Décoration de Noël pour entreprises à Paris : sapins, scénographies, décors aux couleurs de votre marque. Conception, fabrication, installation, démontage.",
  quote: "Demander un devis Noël",
  placeholder: "[À compléter]",

  // Photos de Noël disponibles. La photo « arche » ouvre la page, les trois alimentent les univers et la galerie.
  photos: {
    arche: {
      src: "photos/noel-salon-dore-arche-lustre",
      alt: "Salon doré vu à travers une grande arche, avec des branches givrées autour d'une table ronde sous un lustre en cristal",
    },
    givrees: {
      src: "photos/noel-salon-dore-branches-givrees",
      alt: "Salon aux boiseries dorées décoré de branches givrées, de bûches de bouleau et de bougies devant une cheminée",
    },
    eataly: {
      src: "photos/noel-eataly-plafond-vegetalise",
      alt: "Plafond d'un restaurant recouvert de lierre, de feuillage blanc, de nœuds rouges et de suspensions lumineuses",
    },
  },

  // Bandeau de confiance. Le logo d'Eataly manque : texte provisoire (docs/CONTENU-NOEL.md).
  trust: [
    { name: "Hôtel Cluny Square", file: "hotel-cluny-square.png", w: 351, h: 230, tone: "silhouette", size: "lg" },
    { name: "Hôtel des Grands Boulevards", file: "grands-boulevards.jpg", w: 200, h: 200, tone: "multiply", size: "lg" },
    { name: "Eataly", text: true },
    { name: "Botimyst", file: "botimyst.png", w: 432, h: 117, tone: "multiply", size: "sm" },
  ],

  universes: [
    {
      n: "01",
      title: "Noël naturel",
      text: "Sapin, branches, pommes de pin et végétaux naturels. Une ambiance chaleureuse, qui sent la forêt.",
      for: ["bureaux", "accueils", "restaurants"],
      tone: "olive",
    },
    {
      n: "02",
      title: "Noël chic",
      text: "Blanc, doré et végétal. Un Noël élégant et sobre, pour les lieux qui reçoivent une clientèle exigeante.",
      for: ["hôtels", "boutiques", "halls d'entrée"],
      photo: "givrees",
    },
    {
      n: "03",
      title: "Noël immersif",
      text: "Forêt, arche, plafond végétalisé, scénographie complète. On transforme le lieu entier : vos clients entrent dans un décor.",
      for: ["restaurants", "salons", "soirées de fin d'année"],
      photo: "eataly",
    },
    {
      n: "04",
      title: "Noël corporate",
      text: "Un décor aux couleurs de votre marque, avec votre logo. Votre Noël devient une extension de votre identité.",
      for: ["sièges", "showrooms", "événements clients"],
      tone: "orange",
    },
    {
      n: "05",
      title: "Noël responsable",
      text: "Location, réutilisation d'une année sur l'autre, végétaux artificiels ou stabilisés. Un décor beau, sans gaspillage.",
      for: ["bureaux", "commerces", "entreprises engagées"],
      tone: "olive",
    },
  ],

  steps: [
    { n: "01", title: "Brief", text: "Vous nous indiquez le lieu, la surface, le budget et l'univers qui vous plaît. On peut aussi passer sur place pour mesurer." },
    { n: "02", title: "Proposition visuelle", text: "On vous envoie un moodboard et un devis. On ajuste ensemble jusqu'à validation." },
    { n: "03", title: "Fabrication", text: "Les éléments du décor sont préparés en atelier : couronnes, compositions, structures, décors aux couleurs de votre marque." },
    { n: "04", title: "Installation", text: "Notre équipe installe sur site, dans vos délais, avec le moins de gêne possible pour votre activité." },
    { n: "05", title: "Démontage", text: "Après les fêtes, on revient tout démonter, au moment qui vous arrange." },
  ],

  references: [
    {
      name: "Hôtel Cluny Square",
      text: "Décoration complète de la façade et des espaces intérieurs, guirlandes, couronnes, compositions florales. Un projet qui demande discrétion, élégance et respect de l'identité de l'établissement.",
    },
    {
      name: "Hôtel des Grands Boulevards",
      text: "Décoration de Noël intérieure pour les espaces communs et le restaurant, une ambiance festive mais maîtrisée, en accord avec l'ADN de l'hôtel.",
    },
    {
      name: "Eataly Paris",
      text: "Grand sapin et décoration des espaces du restaurant pour la période des fêtes, avec l'installation d'un plafond végétalisé pour le press day de Noël.",
    },
    {
      name: "Botimyst",
      text: "Décoration de Noël pour les espaces de l'enseigne, sapins, guirlandes et compositions florales de saison.",
    },
  ],
  testimonial: { quote: "« [Citation client à intégrer] »", author: "Prénom Nom, Poste, Entreprise" },

  // Galerie : 3 photos disponibles, 3 emplacements provisoires. Ordre de lecture : colonne par colonne.
  gallery: [
    { photo: "eataly" },
    { placeholder: true, ratio: "4 / 3" },
    { photo: "arche" },
    { placeholder: true, ratio: "1 / 1" },
    { photo: "givrees" },
    { placeholder: true, ratio: "4 / 5" },
  ],

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
