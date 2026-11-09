// Contenu de la landing Noël V2 (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md), texte repris tel quel.
// Le texte du hero, de « Notre volonté » et du titre du flux est dans la page (decoration-noel-entreprises-paris/index.html), car il
// porte des title tags. Ici : les photos, les univers, les étapes, les témoignages et la FAQ.

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

  // Flux vertical (retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md §4) : les photos montent du bas, derrière le titre, et sortent par le haut.
  // x et w : en vw, mesurés sur les frames noel-vertical-04 à 08 (1728 px de large) ; ratio : largeur sur hauteur du cadre, pour que la
  // photo garde ses proportions à toutes les hauteurs d'écran. y : en svh, position de départ de la montée, sous le bord bas de l'écran
  // (au moins 100) : plus elle est grande, plus la photo arrive tard. speed : svh montés par écran de scroll (100 = la vitesse de la page),
  // la profondeur. V8 (G5, components/gallery.js) : deux colonnes de chaque côté du titre (il occupe de 24 à 76 vw), jamais de photo sur le titre ni
  // sur le bouton ni l'une sur l'autre. Deux photos de la même colonne forment une pile : celle du dessous porte `under` (l'indice de celle du
  // dessus) et `gap` (écart en vw) : elle part sous elle, à l'écart de sa hauteur, et ne monte jamais plus vite qu'elle, à toute taille d'écran.
  // À gauche : branches, plafond puis salon ; à droite : portail puis sapins (le salon, au centre sur les frames, passe à gauche : au centre il traversait le
  // titre). mobile : x, w et y sous 900 px (`under`, `gap` comme sur ordinateur), ou null (photo absente) ; trois photos seulement.
  flux: {
    photos: [
      {
        id: "branches",
        src: "noel-v2/noel-bw-branches-givrees",
        alt: "Branches givrées, bûches de bouleau et bougies dans un salon baigné de lumière",
        x: 4, y: 100, w: 16, ratio: 0.75, speed: 104,
        mobile: { x: 4, w: 42, under: 3, gap: 30 },
      },
      {
        id: "portail",
        src: "noel-v2/noel-bw-portail-couronne",
        alt: "Grille de fer noir entourée d'une grande couronne de sapin avec un nœud, dans une cour parisienne",
        x: 78, y: 112, w: 22, ratio: 0.726, speed: 100,
        mobile: { x: 54, w: 42, y: 156 },
      },
      {
        id: "plafond",
        src: "noel-v2/noel-bw-eataly-plafond-large",
        alt: "Plafond d'un restaurant recouvert de lierre, de fougères blanches et de suspensions en verre",
        x: 0, w: 20, ratio: 0.95, speed: 100, under: 0, gap: 4,
        mobile: null,
      },
      {
        id: "salon",
        src: "noel-v2/noel-bw-salon-dore",
        alt: "Salon aux boiseries sculptées et au grand miroir, avec des branches givrées devant la cheminée",
        x: 5, w: 17, ratio: 0.75, speed: 96, under: 2, gap: 4,
        mobile: { x: 4, w: 42, y: 100 },
      },
      {
        id: "sapins",
        src: "noel-v2/noel-bw-sapins-verriere",
        alt: "Trois grands sapins décorés de guirlandes lumineuses et de lanternes, sous une grande verrière métallique",
        x: 84, w: 16, ratio: 0.65, speed: 92, under: 1, gap: 4,
        mobile: null,
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

  // Témoignages (04 §6). FICTIF : ces quatre avis sont inventés pour la démonstration (noms fictifs, entreprises de la liste des
  // réalisations). À remplacer par de vrais avis de clients avant toute mise en ligne (docs/POINTS-A-VALIDER.md, ligne 68).
  testimonials: {
    label: "TÉMOIGNAGES",
    items: [
      {
        fictif: true, // FICTIF : à remplacer avant mise en ligne
        quote: "Pour Noël, D'un Bout À L'autre a transformé notre plafond en véritable forêt suspendue. Les équipes comme les clients s'arrêtaient pour regarder. L'installation était soignée et le démontage impeccable en janvier.",
        name: "Camille Laurent",
        role: "Responsable communication, Eataly Paris",
      },
      {
        fictif: true, // FICTIF : à remplacer avant mise en ligne
        quote: "Elles ont su respecter l'élégance de notre établissement tout en apportant une vraie chaleur à l'accueil. Nos clients nous ont parlé de la décoration dès leur arrivée.",
        name: "Julien Moreau",
        role: "Directeur d'exploitation, Hôtel Cluny Square",
      },
      {
        fictif: true, // FICTIF : à remplacer avant mise en ligne
        quote: "Un interlocuteur unique, des délais tenus et un résultat qui nous ressemble. Nous renouvelons l'expérience cette année.",
        name: "Sophie Garnier",
        role: "Cheffe de projet événementiel, BHV Marais",
      },
      {
        fictif: true, // FICTIF : à remplacer avant mise en ligne
        quote: "La personnalisation aux couleurs de notre maison m'a bluffée. Tout était prêt le jour J, sans que nous ayons à coordonner quoi que ce soit.",
        name: "Antoine Delmas",
        role: "Directeur, Hôtel des Grands Boulevards",
      },
    ],
  },

  // FAQ (04 §7) : alimente la section et le JSON-LD FAQPage de noel-seo.js. Délai de contact : « octobre ou novembre » (la maquette
  // prime sur le copywriting, docs/POINTS-A-VALIDER.md ligne 71).
  faq: {
    label: "FAQ",
    help: {
      title: "Toujours une question ?",
      text: "Une question spécifique sur les normes de sécurité de votre lieu ou une contrainte de montage ? Nous vous répondons en moins de 24h.",
      cta: "Réserver un appel",
    },
    items: [
      {
        q: "À partir de quand faut-il nous contacter pour Noël ?",
        a: "Idéalement, prenez contact dès octobre ou novembre. La période de Noël est notre saison la plus chargée et les créneaux d'installation partent vite, surtout pour les premières semaines de décembre. Plus vous nous contactez tôt, plus on a de liberté pour concevoir quelque chose d'ambitieux.",
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
        q: "Quel budget prévoir pour des décorations de Noël ?",
        a: "Cela dépend de la surface, du type de décoration souhaité et du nombre d'espaces à habiller. Nos prestations commencent à quelques centaines d'euros pour une décoration simple et peuvent aller jusqu'à plusieurs milliers pour la décoration complète d'un hôtel ou d'un grand commerce. Contactez-nous pour un devis personnalisé.",
      },
      {
        q: "Intervenez-vous en dehors de Paris ?",
        a: "Oui, nous intervenons dans toute l'Île-de-France et en dehors pour les projets d'envergure.",
      },
    ],
  },
};
