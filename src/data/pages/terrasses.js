// Page Terrasses : tous les textes viennent de docs/copywriting/05-terrasses.md (premier jet, à retravailler avec la cliente), le title
// et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
import { todo } from "../../components/placeholder.js";

export const terrasses = {
  id: "terrasses",
  path: "/amenagement-terrasse-paris/",
  source: "05-terrasses.md",
  title: "Aménagement de terrasse à Paris | D'un Bout À L'autre",
  description:
    "D'un Bout À L'autre aménage votre terrasse à Paris : conception, plantation et suivi, pour appartements, hôtels, restaurants et entreprises. Devis gratuit.",
  sections: [
    {
      type: "hero",
      title: "Aménagement de terrasse à Paris : votre espace extérieur, de la conception au suivi.",
      tag: "votre espace extérieur",
      lead: "Du choix des végétaux à l'installation, en passant par le suivi saisonnier : on s'occupe de tout. Appartement, hôtel, restaurant ou entreprise.",
      cta: "Demander un devis gratuit",
    },
    {
      type: "intro",
      paragraphs: [
        "Dans nos villes bétonnées, posséder une terrasse, c'est avoir la chance de répondre à l'appel du vert. Encore faut-il qu'elle soit pensée pour la ville : charge limitée, vent, accès compliqué. On s'occupe de tout, pour que votre terrasse devienne une vraie parenthèse végétale.",
      ],
    },
    {
      type: "offers",
      label: "NOS STYLES D'AMÉNAGEMENT",
      title: "Votre terrasse mérite un style d'aménagement qui lui ressemble.",
      tag: "qui lui ressemble",
      photo: { src: "photos/terrasse-graminees-sacre-coeur", alt: "Terrasse parisienne plantée de graminées, avec le Sacré-Cœur au loin" },
      initial: 0,
      items: [
        {
          title: "Méditerranéen",
          text: "Olivier, lavande, agapanthes, romarin, pittosporum. Des couleurs douces, des matières naturelles, une ambiance chaleureuse. Pour ceux qui veulent se téléporter en Provence dès qu'ils ouvrent leur porte-fenêtre.",
        },
        {
          title: "Tropical",
          text: "Fougères arborescentes, bambous, palmiers, philodendrons, cannas. Une végétation dense et contrastée, qui fait voyager.",
        },
        {
          title: "Épuré & contemporain",
          text: "Des lignes nettes, une palette verte sobre, des végétaux structurants. Une composition simple mais rassurante.",
        },
        {
          title: "Fleuri",
          text: "Rosiers, lavandes, hortensias, cosmos. Pour ceux qui veulent une terrasse vivante, qui évolue au fil des saisons.",
        },
      ],
    },
    {
      type: "cards",
      label: "L'EXPERTISE DES TERRASSES PARISIENNES",
      title: "Les spécificités des terrasses parisiennes",
      tag: "terrasses parisiennes",
      lead: "Aménager une terrasse à Paris, c'est devoir travailler avec des contraintes propres à la ville.",
      items: [
        {
          title: "Poids et charges",
          text: "Chaque dalle de terrasse a une charge maximale autorisée, souvent bien inférieure à ce qu'on imagine. On travaille avec des substrats allégés et des contenants adaptés pour rester dans les limites structurelles de votre immeuble, sans vous exposer à aucun risque.",
        },
        {
          title: "Ensoleillement et vent",
          text: "Selon l'orientation, l'étage et les bâtiments voisins, une terrasse peut être très ensoleillée, très ombragée, ou les deux selon les heures. On sélectionne les végétaux en fonction de votre exposition réelle.",
        },
        {
          title: "Accès et logistique",
          text: "Ascenseur, escalier, monte-charge : on gère la logistique d'approvisionnement de A à Z pour que vous n'ayez rien à coordonner.",
        },
      ],
    },
    {
      type: "process",
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
      more: { label: "Découvrir nos abonnements", to: "/entretien-abonnement-plantes-entreprise-paris/" },
    },
    {
      type: "gallery",
      label: "GALERIE APERÇU",
      items: [
        { photo: { src: "photos/terrasse-graminees-sacre-coeur", alt: "Graminées de plusieurs teintes sur une terrasse, avec les toits de Paris et le Sacré-Cœur au fond" } },
        { photo: { src: "photos/terrasse-lavande-tour-eiffel", alt: "Brins de lavande en fleur sur une terrasse, avec la tour Eiffel floue à l'arrière-plan" } },
        { photo: { src: "photos/terrasse-olivier-carex", alt: "Touffe de carex au pied d'un olivier en pot, sur un balcon parisien" } },
        { photo: { src: "photos/terrasse-pot-manuka-balcon", alt: "Pot fleuri de manuka rose et d'iris violets sur un balcon à garde-corps blanc" } },
        { photo: null },
        { photo: null },
      ],
      cta: { label: "Voir tous nos projets", to: "/realisations/" },
    },
    {
      type: "faq",
      label: "FAQ",
      title: "Les questions qu'on nous pose fréquemment.",
      tag: "fréquemment",
      items: [
        {
          q: "Ma terrasse peut supporter quel poids ?",
          a: "La charge maximale dépend de la structure de votre immeuble. En règle générale, on recommande de ne pas dépasser 150 à 200 kg/m². On travaille avec des substrats allégés et des contenants adaptés pour rester dans ces limites. En cas de doute, un bureau d'études peut être consulté.",
        },
        {
          q: "Quelles plantes pour une terrasse très ensoleillée / peu ensoleillée ?",
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
      type: "cta-final",
      title: "Votre terrasse mérite d'être aménagée.",
      tag: "d'être aménagée",
      cta: "Demander un devis",
      phone: { label: "Téléphone :", value: todo("téléphone") },
    },
  ],
};
