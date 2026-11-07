// Page Scénographie végétale & événementiel : les textes viennent de docs/copywriting/04-scenographie-vegetale-et-evenementiel.md (premier jet,
// à retravailler avec la cliente), le title et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
// V7 (retours-v7, maquette de la cliente) : l'ordre est celui de retours-v7/docs/01-SCENOGRAPHIE.md ; les textes que la maquette change sont
// listés dans `designTexts` (scripts/check-site.js les compte au lieu de les refuser). Les ateliers végétaux auront leur propre page : ils ne
// figurent plus ici (ni liste, ni cartes, ni galerie, ni question de FAQ), et aucun lien ne mène à cette page future.

export const scenographie = {
  id: "scenographie",
  path: "/scenographie-vegetale-evenementiel-paris/",
  source: "04-scenographie-vegetale-et-evenementiel.md",
  title: "Scénographie végétale & événementiel | D'un Bout À L'autre",
  // Sans « ateliers » : la page Ateliers végétaux n'existe pas encore (retours-v7/docs/01-SCENOGRAPHIE.md).
  description:
    "Scénographie végétale pour vos événements d'entreprise à Paris : lancements, soirées, salons, shootings. Conception, fabrication, installation.",
  // Textes pris sur la maquette V7 (frames scenographie-01 à 13), absents du copywriting 04 ou modifiés par rapport à lui.
  designTexts: [
    "Scénographie végétale pour vos événements d'entreprise à Paris : lancements, soirées, salons, shootings. Conception, fabrication, installation.",
    "Lancements",
    "Soirées",
    "Salons",
    "Shootings",
    "Scénographie végétale à Paris : on transforme vos événements en décors sur mesure.",
    "Nous concevons, fabriquons, installons et démontons votre décor végétal.",
    "Parlons de votre événement",
    "NOS 3 CRÉATIONS",
    "Un décor végétal pour chacun de vos événements.",
    "Lancement de produit, conférence, salon professionnel, inauguration, showroom : nous habillons vos événements professionnels avec des décors en accord avec votre identité de marque.",
    "NOS RÉALISATIONS",
    "Voir plus de réalisations",
    "NOTRE PROCESSUS DE CRÉATION",
    "De votre idée à la pose, on travaille en collaboration.",
    "en collaboration",
    "Les questions qu'on nous pose fréquemment.",
    "fréquemment",
    "Quels sont les budgets minimum pour un événement ?",
    "Faites-vous aussi des mariages ?",
    "Pour un événement d'entreprise standard, comptez idéalement 2 à 3 semaines de préparation. Pour les scénographies de grande envergure, 2 à 3 mois sont préférables pour avoir le temps de concevoir, de fabriquer et de commander les végétaux adaptés.",
    "Votre prochain événement mérite un décor à la hauteur.",
  ],
  sections: [
    {
      // Hero de Bureaux et Design (V5, V6) : mots-clés en capitales à l'écran, titre à pastille, il reste en place et s'estompe sous la liste.
      type: "hero",
      bx: true,
      variant: "scenographie",
      keywords: ["Lancements", "Soirées", "Salons", "Shootings"],
      title: "Scénographie végétale à Paris : on transforme vos événements en décors sur mesure.",
      tag: "vos événements",
      lead: "Nous concevons, fabriquons, installons et démontons votre décor végétal.",
      cta: "Parlons de votre événement",
    },
    {
      // « Nos créations » (frames 03 à 05) : la liste à ligne active de Bureaux et Design, sans tenue. La frame montre une 4e ligne « Ateliers
      // végétaux » : retirée (point 2 des points à valider V7), il reste trois entrées, donc « NOS 3 CRÉATIONS ». La 1re ligne perd sa seconde phrase,
      // absente de la maquette.
      type: "bureaux-pourquoi",
      variant: "scenographie",
      endRule: true,
      label: "NOS 3 CRÉATIONS",
      title: "Un décor végétal pour chacun de vos événements.",
      tag: "vos événements",
      items: [
        {
          title: "Événements d'entreprise",
          text: "Lancement de produit, conférence, salon professionnel, inauguration, showroom : nous habillons vos événements professionnels avec des décors en accord avec votre identité de marque.",
        },
        {
          title: "Soirées et cocktails",
          text: "Soirée d'entreprise, cocktail, scénographie de Noël : nous créons l'ambiance de A à Z. Façades fleuries, plafonds végétalisés, arches, tables : chaque élément est pensé pour que vos invités se souviennent du lieu.",
        },
        {
          title: "Photocalls et shootings",
          text: "Photocall, shooting photo : un décor pensé pour être photographié. Fonds végétaux, structures, compositions suspendues : ils font toujours leur effet à l'image, et sur les réseaux.",
        },
      ],
    },
    {
      // « Nos réalisations » (frames 05 à 07) : deux cartes de la page Réalisations, reprises par leur titre (une seule source :
      // src/data/pages/realisations.js), et le bouton vers la liste.
      type: "fiche-autres",
      variant: "v7",
      label: "NOS RÉALISATIONS",
      heading: "Ils nous ont fait confiance pour leurs événements.",
      tag: "leurs événements",
      featured: ["Façade Végétalisée Atelier DGE", "Décor Saint Tropez"],
      more: { label: "Voir plus de réalisations", to: "/realisations/" },
    },
    {
      type: "process",
      variant: "v7",
      label: "NOTRE PROCESSUS DE CRÉATION",
      title: "De votre idée à la pose, on travaille en collaboration.",
      tag: "en collaboration",
      steps: [
        {
          title: "Consultation",
          text: "On échange sur votre projet : le lieu, la date, le nombre d'invités, l'ambiance souhaitée, le budget indicatif. C'est la base qui nous permet de vous proposer quelque chose qui vous ressemble vraiment.",
        },
        {
          title: "Conception",
          text: "Nous créons un moodboard et une proposition visuelle : références, palette de couleurs, types de végétaux envisagés, disposition des éléments dans l'espace. On affine ensemble jusqu'à validation.",
        },
        {
          title: "Fabrication",
          text: "Les éléments du décor sont préparés en atelier avant le jour J : structures, compositions, suspensions. Le jour de l'événement, il ne reste qu'à installer.",
        },
        {
          title: "Jour J et démontage",
          text: "Notre équipe prend en charge l'installation complète sur site, dans les délais convenus. Nous pouvons rester sur place pendant l'événement si nécessaire, et nous revenons tout démonter ensuite.",
        },
      ],
    },
    {
      // FAQ à 5 questions (frames 09 à 13), dans l'ordre de la maquette. Les réponses sont celles du copywriting (valeur par défaut retenue
      // pour le point 6 des points à valider V7) ; la première perd sa dernière phrase, comme sur la frame 10. La question sur les ateliers
      // (copywriting) n'est plus affichée.
      type: "faq",
      variant: "v7",
      label: "FAQ",
      title: "Les questions qu'on nous pose fréquemment.",
      tag: "fréquemment",
      items: [
        {
          q: "Quel délai prévoir pour organiser un décor végétal ?",
          a: "Pour un événement d'entreprise standard, comptez idéalement 2 à 3 semaines de préparation. Pour les scénographies de grande envergure, 2 à 3 mois sont préférables pour avoir le temps de concevoir, de fabriquer et de commander les végétaux adaptés.",
        },
        {
          q: "Proposez-vous le démontage après l'événement ?",
          a: "Oui, le démontage est prévu dans notre prestation complète. On s'occupe de tout récupérer après le passage de vos invités.",
        },
        {
          q: "Intervenez-vous hors Paris ?",
          a: "Oui. Nous intervenons dans toute l'Île-de-France et en dehors pour les projets d'envergure. N'hésitez pas à nous contacter même si votre lieu de réception est en région.",
        },
        {
          q: "Quels sont les budgets minimum pour un événement ?",
          a: "Nos prestations événementielles commencent à quelques centaines d'euros pour un décor simple (compositions de table, quelques arrangements) et peuvent aller jusqu'à plusieurs milliers pour une scénographie complète. Contactez-nous avec votre brief pour recevoir un devis adapté.",
        },
        {
          q: "Faites-vous aussi des mariages ?",
          a: "Oui, sur demande. Notre activité se concentre sur les entreprises, mais nous créons aussi des décors pour des événements privés : mariages, anniversaires, enterrements de vie de jeune fille. Contactez-nous avec votre projet.",
        },
      ],
    },
    {
      // Bandeau final (frames 11 à 13) : « mérite » porte la pastille ; pas de ligne de téléphone, la frame 12 n'en montre pas (les coordonnées
      // sont dans le footer et le menu).
      type: "cta-final",
      variant: "v7",
      title: "Votre prochain événement mérite un décor à la hauteur.",
      tag: "mérite",
      cta: "Demander un devis",
    },
  ],
};
