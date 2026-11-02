// Page Végétalisation de bureaux : les textes viennent de docs/copywriting/02-vegetalisation-de-bureaux.md (premier jet, à retravailler
// avec la cliente), le title et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
// V5 (retours-v5, maquette de la cliente) : l'ordre des sections est celui de retours-v5/docs/01-ORDRE-DE-LA-PAGE.md ; les textes que la
// maquette change sont listés dans `designTexts` (scripts/check-site.js les compte au lieu de les refuser).
import { todo } from "../../components/placeholder.js";

export const bureaux = {
  id: "bureaux",
  path: "/vegetalisation-bureaux-paris/",
  source: "02-vegetalisation-de-bureaux.md",
  title: "Végétalisation de bureaux à Paris | D'un Bout À L'autre",
  description:
    "D'un Bout À L'autre végétalise vos bureaux à Paris : plantes naturelles, stabilisées ou artificielles, bacs, cloisons et murs végétaux. Devis gratuit.",
  // Textes pris sur la maquette V5 (frames bureaux-01 à 54), absents du copywriting 02. « +30 », « +10 ans » et « 100% » sont ceux du
  // design, à confirmer avec la cliente (retours-v5/docs/05-POINTS-A-VALIDER-V5.md, point 6).
  designTexts: [
    "Végétalisation de bureaux à Paris : de la conception à l'entretien.",
    "Nous concevons, fournissons, installons et entretenons le végétal de vos bureaux, selon vos contraintes et votre style.",
    "Nous transformons vos bureaux grâce aux végétaux.",
    "d'expérience en végétalisation et en décoration végétale",
    "Startups, grands groupes, restaurants, hôtels... Nous transformons tous types de locaux",
    "NOTRE FONCTIONNEMENT",
    "Des bacs sur mesure, fixes ou sur roulettes, pour structurer l'espace, créer un passage ou habiller un couloir. Le végétal transforme vos espaces.",
  ],
  sections: [
    {
      type: "hero",
      bx: true,
      keywords: ["Plantes naturelles", "Végétaux stabilisés", "Végétaux artificiels"], // en capitales à l'écran (bureaux-hero.css)
      title: "Végétalisation de bureaux à Paris : de la conception à l'entretien.",
      tag: "la conception",
      lead: "Nous concevons, fournissons, installons et entretenons le végétal de vos bureaux, selon vos contraintes et votre style.",
      cta: "Demander un devis",
    },
    {
      type: "bureaux-chiffres",
      label: "CHIFFRES CLÉS",
      title: "Nous transformons vos bureaux grâce aux végétaux.",
      tag: "aux végétaux",
      items: [
        { prefix: "+", value: 30, suffix: "", text: "projets de végétalisation de bureaux réalisés" },
        { prefix: "+", value: 10, suffix: " ans", text: "d'expérience en végétalisation et en décoration végétale" },
        { prefix: "", value: 100, suffix: "%", text: "Startups, grands groupes, restaurants, hôtels... Nous transformons tous types de locaux" },
      ],
    },
    {
      // « Ce qu'on installe » (V5 §3) : 5 cartes en défilement horizontal. Plus de phrase d'introduction (absente de la maquette) ; la
      // dernière phrase de « Bacs » est celle de la maquette (avec sa faute « transforment » corrigée), et celle de « Murs végétaux »
      // (renvoi vers Design végétal) n'est pas sur la maquette. `use` : les trois mots-clés, séparés par une virgule.
      type: "bureaux-installe",
      label: "CE QU'ON INSTALLE DANS VOS BUREAUX",
      title: "Plantes, bacs, cloisons, murs : le végétal là où vous en avez besoin.",
      tag: "vous en avez besoin",
      items: [
        {
          title: "Plantes",
          text: "Grandes plantes ou plantes de bureau, choisies selon la lumière et le volume de votre espace. Elles apportent de la vie, tout de suite.",
          use: "open spaces, salles de réunion, bureaux individuels",
          photo: "bureaux/carte-01",
          alt: "Palmier d'intérieur dans un grand pot, à côté d'une chaise couleur corail devant un mur violet.",
        },
        {
          title: "Bacs",
          text: "Des bacs sur mesure, fixes ou sur roulettes, pour structurer l'espace, créer un passage ou habiller un couloir. Le végétal transforme vos espaces.",
          use: "couloirs, zones de passage, séparation d'espaces",
          photo: "bureaux/carte-02",
          alt: "Grand bac en pierre grise planté de graminées et d'un arbre, devant un immeuble parisien.",
        },
        {
          title: "Cloisons végétales",
          text: "Une séparation vivante ou stabilisée entre deux espaces : plus légère qu'une cloison classique, et plus belle aussi. Elle isole du regard sans fermer la pièce.",
          use: "open spaces, salles de réunion ouvertes, espaces de pause",
          photo: "bureaux/carte-03",
          alt: "Mur de mousse et de plantes colorées, à côté d'une paroi vitrée blanche.",
        },
        {
          title: "Murs végétaux",
          text: "Un mur entier végétalisé, naturel, stabilisé ou artificiel. C'est souvent la pièce centrale d'un espace, celle dont on se souvient.",
          use: "halls, espaces de représentation, salles de réunion",
          photo: "bureaux/carte-04",
          alt: "Massif dense de feuillages verts installé dans un espace de bureau lumineux.",
        },
        {
          title: "Espaces d'accueil",
          text: "Votre accueil est la première chose que voient vos clients et vos candidats. Un décor végétal donne le ton dès l'entrée : accueillant, soigné, à votre image.",
          use: "réception, showroom, salle d'attente",
          photo: "bureaux/carte-05",
          alt: "Hall d'accueil avec portes vitrées à cadre noir et feuillages suspendus sous une verrière.",
        },
      ],
    },
    {
      // « Trois matières » (V5 §4 et §5) : section orange, photo qui grandit jusqu'au plein écran, puis slider des 3 matières sur 3 fonds.
      // Les lignes « Idéal pour » du copywriting (`use`) ne sont pas sur la maquette : retirées. Chaque slide : titre (pastille sur son
      // deuxième mot), paragraphe, et le fond qui lui correspond (`photo`, `alt`).
      type: "bureaux-matieres",
      label: "NATUREL, STABILISÉ OU ARTIFICIEL ?",
      title: "Trois matières, un même objectif : un espace qui vous ressemble.",
      tag: "vous ressemble",
      items: [
        {
          title: "Plantes naturelles",
          tag: "naturelles",
          text: "De vraies plantes vivantes, sélectionnées en fonction de la luminosité et du volume de votre espace. Un entretien régulier est possible grâce à nos offres de suivi : vous ne vous occupez de rien.",
          photo: "bureaux/fond-01",
          alt: "Hall d'accueil avec portes vitrées à cadre noir et feuillages suspendus sous une verrière.",
        },
        {
          title: "Végétaux stabilisés",
          tag: "stabilisés",
          text: "De vraies plantes dont la sève a été remplacée par de la glycérine végétale. Résultat : aucun arrosage, aucune luminosité requise, une durée de vie de plusieurs années. Elles gardent leur aspect naturel sans le moindre entretien.",
          photo: "bureaux/fond-02",
          alt: "Massif dense de feuillages verts installé dans un espace de bureau lumineux.",
        },
        {
          title: "Végétaux artificiels",
          tag: "artificiels",
          text: "La solution la plus libre techniquement. Formes, couleurs, volumes : tout est possible. Robustesse maximale, aucune contrainte de pose ni d'emplacement.",
          photo: "bureaux/fond-03",
          alt: "Mur de feuillages retombants entre des cloisons en bois clair et des suspensions noires.",
        },
      ],
    },
    {
      type: "cards",
      label: "POURQUOI VÉGÉTALISER VOS BUREAUX ?",
      title: "Des plantes dans vos bureaux ? Ce n'est pas juste une question d'esthétique.",
      tag: "pas juste une question d'esthétique",
      lead: "Végétaliser vos bureaux, ce n'est pas un simple choix esthétique. C'est une décision qui touche directement la qualité de vie de vos équipes, l'image que vous renvoyez à vos clients, et l'attractivité de vos locaux pour les nouveaux talents.",
      items: [
        {
          title: "Bien-être des équipes",
          text: "Les plantes en espace de travail réduisent le stress, améliorent la concentration et favorisent la créativité. Certaines études évoquent un gain de productivité pouvant atteindre 15 % dans les espaces végétalisés. Un cadre de travail agréable, c'est aussi moins d'absentéisme et plus d'engagement.",
        },
        {
          title: "Image de marque",
          text: "Vos locaux parlent de vous avant même que vous ayez prononcé un mot. Un hall d'accueil végétalisé, une salle de réunion soignée, un espace de vie pensé : ce sont des signaux forts envoyés à vos clients, partenaires et candidats dès leur arrivée.",
        },
        {
          title: "Qualité de l'air",
          text: "Certaines espèces végétales filtrent les composés organiques volatils (COV) présents dans les intérieurs et contribuent à réguler l'humidité ambiante. C'est un facteur souvent négligé dans les bureaux climatisés.",
        },
        {
          title: "Attractivité des locaux",
          text: "Dans un marché de l'emploi compétitif, un espace de travail agréable et inspirant est devenu un argument de recrutement. Un bureau végétalisé donne envie d'y travailler... et d'y rester.",
        },
      ],
    },
    {
      type: "process",
      label: "NOTRE FONCTIONNEMENT",
      title: "Notre démarche pour végétaliser vos bureaux.",
      tag: "végétaliser vos bureaux",
      steps: [
        {
          title: "Visite sur place",
          text: "On commence toujours par venir chez vous. C'est la seule façon de comprendre réellement votre espace : ses volumes, sa luminosité, ses contraintes techniques, son ambiance. Cette visite est gratuite et sans engagement.",
        },
        {
          title: "Proposition végétale",
          text: "Sur la base de la visite, nous vous soumettons une sélection de végétaux adaptés à votre espace et à vos envies, accompagnée si nécessaire d'une vue 2D ou 3D. Tout est discuté et ajusté ensemble avant de valider.",
        },
        {
          title: "Validation",
          text: "Nous affinons la proposition jusqu'à ce qu'elle vous convienne pleinement. Les allers-retours sont inclus, pas de surprise le jour de l'installation.",
        },
        {
          title: "Installation",
          text: "Notre équipe prend en charge toute la logistique : livraison, pose, fixation, finitions. L'intervention est propre et rapide pour minimiser la gêne dans vos locaux.",
        },
        {
          title: "Suivi et entretien",
          text: "Pour les plantes naturelles, nous proposons des passages d'entretien réguliers, sous forme d'abonnement (fréquence à définir selon vos besoins). En cas de problème sur un végétal, nous assurons son remplacement.",
        },
      ],
      // Pas de lien « Découvrir nos abonnements » sous la timeline : l'image 37 de la maquette n'en montre pas (valeur par défaut validée).
    },
    {
      type: "logos",
      label: "RÉFÉRENCES CLIENTS",
      title: "Ils nous ont confié leurs espaces.",
      tag: "leurs espaces",
      items: [
        { name: "Inato", logo: "inato" },
        { name: "Kéobiz", logo: "keobiz" },
        { name: "AtScale", logo: "atscale" },
        { name: "Orixa Media" },
        { name: "Witbe", logo: "witbe" },
        { name: "Chez Simone", logo: "chez-simone" },
      ],
      cta: { label: "Voir toutes nos réalisations", to: "/realisations/" },
    },
    {
      type: "testimonials",
      items: [{ quote: todo("citation client"), name: todo("prénom et nom"), role: todo("poste, entreprise") }],
    },
    {
      type: "gallery",
      label: "GALERIE APERÇU",
      items: [{ photo: null }, { photo: null }, { photo: null }, { photo: null }],
      cta: { label: "Voir tous nos projets", to: "/realisations/" },
    },
    {
      type: "faq",
      label: "FAQ",
      title: "Les questions qu'on nous pose fréquemment.",
      tag: "fréquemment",
      items: [
        {
          q: "Quelles plantes choisir pour des bureaux sans lumière naturelle ?",
          a: "Les végétaux stabilisés et artificiels sont parfaitement adaptés aux espaces sans fenêtre ou avec peu de lumière. Pour les plantes naturelles, certaines espèces tolèrent bien la lumière artificielle. Lors de notre visite, nous évaluerons précisément l'apport lumineux de chaque zone pour vous conseiller la solution la plus adaptée.",
        },
        {
          q: "Quel budget prévoir pour végétaliser des bureaux ?",
          a: "Le budget dépend de la surface, du type de végétaux choisis et de la complexité de l'installation. Nous intervenons sur des projets allant de quelques centaines d'euros pour une composition ponctuelle à plusieurs milliers pour une végétalisation complète de plateaux. Le devis est toujours gratuit et sans engagement.",
        },
        {
          q: "Combien de temps dure une installation ?",
          a: "Pour un projet standard (20 à 50 m² de bureaux), l'installation se fait généralement en une journée, parfois deux pour les projets plus importants. Nous planifions l'intervention pour minimiser la gêne dans vos locaux.",
        },
        {
          q: "Qui s'occupe de l'entretien des plantes après la pose ?",
          a: "Si vous le souhaitez, c'est nous. Pour les plantes naturelles, nous proposons un abonnement avec des passages réguliers (fréquence à définir selon les besoins). En cas de problème sur un végétal, nous assurons le remplacement. Les végétaux stabilisés et artificiels ne nécessitent aucun entretien régulier.",
        },
        {
          q: "Intervenez-vous en dehors de Paris ?",
          a: "Nous intervenons principalement à Paris et en Île-de-France. Pour les projets d'envergure, nous nous déplaçons partout en France. N'hésitez pas à nous soumettre votre demande.",
        },
        {
          q: "Peut-on avoir un aperçu visuel avant de valider le projet ?",
          a: "Oui. Pour les projets importants, nous proposons en option la réalisation de photomontages ou de vues 3D, qui permettent de visualiser le rendu final avant de passer à l'installation.",
        },
      ],
    },
    // Pas de bandeau final : la maquette V5 enchaîne la FAQ et le footer (frames 49 à 53), qui porte déjà l'appel au devis.
  ],
};
