// Page Végétalisation de bureaux : tous les textes viennent de docs/copywriting/02-vegetalisation-de-bureaux.md (premier jet, à retravailler
// avec la cliente), le title et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
import { todo } from "../../components/placeholder.js";

export const bureaux = {
  id: "bureaux",
  path: "/vegetalisation-bureaux-paris/",
  source: "02-vegetalisation-de-bureaux.md",
  title: "Végétalisation de bureaux à Paris | D'un Bout À L'autre",
  description:
    "D'un Bout À L'autre végétalise vos bureaux à Paris : plantes naturelles, stabilisées ou artificielles, bacs, cloisons et murs végétaux. Devis gratuit.",
  sections: [
    {
      type: "hero",
      title: "Végétalisation de bureaux à Paris : on s'occupe de tout, de la conception à l'entretien.",
      tag: "on s'occupe de tout",
      lead: "Plantes naturelles, végétaux stabilisés ou artificiels : nous concevons, fournissons, installons et entretenons le végétal de vos bureaux, selon vos contraintes et votre style.",
      cta: "Demander un devis gratuit",
      secondary: { label: "Voir nos réalisations", to: "/realisations/" },
    },
    {
      type: "figures",
      label: "CHIFFRES CLÉS",
      items: [
        { head: ["+", todo("nombre de projets"), " projets"], text: "de végétalisation de bureaux réalisés" },
        { head: ["+10 ans"], text: "d'expérience à Paris et en Île-de-France" },
        { head: ["Startups, grands groupes, hôtels, restaurants"], text: "tous types de locaux" },
        { head: ["Paris & Île-de-France"], text: "zone d'intervention principale" },
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
      type: "cards",
      label: "CE QU'ON INSTALLE DANS VOS BUREAUX",
      title: "Plantes, bacs, cloisons, murs : le végétal là où vous en avez besoin.",
      tag: "le végétal là où vous en avez besoin",
      lead: "Tous les espaces ne se ressemblent pas. On choisit avec vous la solution végétale la mieux adaptée à votre lieu : sa lumière, sa surface, son usage.",
      items: [
        {
          title: "Plantes",
          text: "Grandes plantes ou plantes de bureau, choisies selon la lumière et le volume de votre espace. Elles apportent de la vie, tout de suite.",
          use: "open spaces, salles de réunion, bureaux individuels",
        },
        {
          title: "Bacs",
          text: "Des bacs sur mesure, fixes ou sur roulettes, pour structurer l'espace, créer un passage ou habiller un couloir. Le végétal devient un élément d'aménagement à part entière.",
          use: "couloirs, zones de passage, séparation d'espaces",
        },
        {
          title: "Cloisons végétales",
          text: "Une séparation vivante ou stabilisée entre deux espaces : plus légère qu'une cloison classique, et plus belle aussi. Elle isole du regard sans fermer la pièce.",
          use: "open spaces, salles de réunion ouvertes, espaces de pause",
        },
        {
          title: "Murs végétaux",
          text: "Un mur entier végétalisé, naturel, stabilisé ou artificiel. C'est souvent la pièce centrale d'un espace, celle dont on se souvient. Les murs sur mesure, les tableaux et les logos végétalisés sont présentés sur la page Design végétal sur mesure.",
          use: "halls, espaces de représentation, salles de réunion",
        },
        {
          title: "Espaces d'accueil",
          text: "Votre accueil est la première chose que voient vos clients et vos candidats. Un décor végétal donne le ton dès l'entrée : accueillant, soigné, à votre image.",
          use: "réception, showroom, salle d'attente",
        },
      ],
    },
    {
      type: "cards",
      label: "NATUREL, STABILISÉ OU ARTIFICIEL ?",
      title: "Trois matières, un même objectif : un espace qui vous ressemble.",
      tag: "un espace qui vous ressemble",
      items: [
        {
          title: "Plantes naturelles",
          text: "De vraies plantes vivantes, sélectionnées en fonction de la luminosité et du volume de votre espace. Un entretien régulier est possible grâce à nos offres de suivi : vous ne vous occupez de rien.",
          use: "open spaces lumineux, salles de réunion, halls d'accueil",
        },
        {
          title: "Végétaux stabilisés",
          text: "De vraies plantes dont la sève a été remplacée par de la glycérine végétale. Résultat : aucun arrosage, aucune luminosité requise, une durée de vie de plusieurs années. Elles gardent leur aspect naturel sans le moindre entretien.",
          use: "couloirs, bureaux, espaces de représentation, zones sans fenêtre",
        },
        {
          title: "Végétaux artificiels",
          text: "La solution la plus libre techniquement. Formes, couleurs, volumes : tout est possible. Robustesse maximale, aucune contrainte de pose ni d'emplacement.",
          use: "grands volumes, espaces exigeants, installations sur mesure",
        },
      ],
    },
    {
      type: "process",
      label: "NOTRE DÉMARCHE PROJET",
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
      more: { label: "Découvrir nos abonnements", to: "/entretien-abonnement-plantes-entreprise-paris/" },
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
    {
      type: "cta-final",
      title: "Parlons de votre projet",
      tag: "votre projet",
      cta: "Demander un devis",
      phone: { label: "Téléphone :", value: todo("téléphone") },
    },
  ],
};
