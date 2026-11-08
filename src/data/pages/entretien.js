// Page Entretien & abonnements végétal : les textes viennent de docs/copywriting/08-entretien-et-abonnements-vegetal.md (premier jet, à
// retravailler avec la cliente), le title et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un
// texte inventé.
// V7 (retours-v7, maquette de la cliente) : l'ordre des sections est celui de retours-v7/docs/04-ENTRETIEN.md ; les textes que la maquette change
// sont listés dans `designTexts` (scripts/check-site.js les compte au lieu de les refuser). Pas de CTA final : la maquette n'en montre pas.
import { todo } from "../../components/placeholder.js";
import { clientsCouleur } from "../clients.js";

const devis = { label: "Demander un devis", to: "/contact/" };

export const entretien = {
  id: "entretien",
  path: "/entretien-abonnement-plantes-entreprise-paris/",
  source: "08-entretien-et-abonnements-vegetal.md",
  title: "Entretien de plantes de bureau à Paris | D'un Bout À L'autre",
  description:
    "Entretien de plantes de bureau à Paris : abonnement, arrosage, taille, remplacement et renouvellement des décors végétaux. Devis gratuit sur mesure.",
  // Textes pris sur la maquette V7 (frames entretien-01 à 32) ou sur le doc 04, absents du copywriting 08 ou modifiés par rapport à lui.
  designTexts: [
    "Entretien",
    "Remplacement",
    "Renouvellement des décors",
    "Entretien de végétaux pour entreprises à Paris",
    "végétaux",
    "On s'occupe de vos végétaux toute l'année, pour que vous n'ayez rien à gérer.",
    "Demander un devis",
    "CE QUI EST INCLUS",
    "On s'occupe de tout passage après passage.",
    "tout",
    "Conseils",
    "NOS FORMULES D'ABONNEMENT",
    "Une formule adaptée à vos locaux.",
    "adaptée",
    "Un passage régulier pour entretenir vos plantes naturelles :",
    "Des passages plus fréquents, le remplacement des plantes abîmées inclus :",
    "Plusieurs sites, murs végétaux, décors saisonniers :",
    "Arrosage",
    "Taille",
    "Nettoyage des feuilles",
    "Contrôle de l'état des plantes",
    "Remplacement des plantes abîmées",
    "Formule construite avec vous",
    "QUELS VÉGÉTAUX ENTRETIENT-ON ?",
    "Chaque installation a ses besoins.",
    "ses besoins",
    "Plantes naturelles",
    "naturelles",
    "Murs végétaux",
    "Thunes",
    "Végétaux stabilisés",
    "stabilisés",
    "Les trois végétaux entretenus",
    "NOTRE FONCTIONNEMENT",
    "Un suivi simple, en quatre étapes.",
    "simple",
    "Choix de la formule",
    "Bilan annuel",
    "NOS CLIENTS",
    "Ils nous confient leurs plantes.",
    "leurs plantes",
    "Les questions qu'on nous pose fréquemment.",
    "fréquemment",
    "Entretenez-vous les murs végétaux ?",
    "Intervenez-vous en dehors de Paris ?",
  ],
  sections: [
    {
      // Hero de Bureaux et Design (frames 01 à 03) : mots-clés en capitales à l'écran, titre à pastille, il reste en place et s'estompe sous le crème.
      type: "hero",
      bx: true,
      variant: "entretien",
      keywords: ["Entretien", "Remplacement", "Renouvellement des décors"],
      title: "Entretien de végétaux pour entreprises à Paris",
      tag: "végétaux",
      lead: "On s'occupe de vos végétaux toute l'année, pour que vous n'ayez rien à gérer.",
      cta: "Demander un devis",
    },
    {
      // « Ce qui est inclus » (frames 02 à 05, zoom 04) : la liste à ligne active de Scénographie, quatre entrées.
      type: "bureaux-pourquoi",
      variant: "entretien",
      label: "CE QUI EST INCLUS",
      title: "On s'occupe de tout passage après passage.",
      tag: "tout",
      items: [
        {
          title: "Entretien",
          text: "Arrosage, taille, nettoyage des feuilles, contrôle de l'état des plantes : nos équipes passent à la fréquence qui convient à vos locaux.",
        },
        {
          title: "Remplacement",
          text: "Une plante abîmée ou qui ne reprend pas est remplacée. Vous gardez un espace toujours soigné, sans avoir à y penser.",
        },
        {
          title: "Renouvellement des décors",
          text: "On change les compositions à chaque saison ou à chaque événement, pour que votre décor ne se fige pas.",
        },
        {
          title: "Conseils",
          text: "Un interlocuteur unique qui vous dit quoi faire, quand, et ce qui vaut vraiment le coup.",
        },
      ],
    },
    {
      // « Nos formules d'abonnement » (frames 05 à 09, zoom 06) : trois cartes de même hauteur, Confort (orange) mise en avant, pas de prix. Les trois
      // boutons mènent au formulaire de contact. Le disque orange qui suit est dans cette section (scripts/bureaux-formules.js).
      type: "bureaux-formules",
      variant: "entretien",
      label: "NOS FORMULES D'ABONNEMENT",
      title: "Une formule adaptée à vos locaux.",
      tag: "adaptée",
      cards: [
        {
          title: "Essentiel",
          text: "Un passage régulier pour entretenir vos plantes naturelles :",
          items: ["Arrosage", "Taille", "Nettoyage des feuilles", "Contrôle de l'état des plantes"],
          cta: devis,
        },
        {
          title: "Confort",
          text: "Des passages plus fréquents, le remplacement des plantes abîmées inclus :",
          items: ["Arrosage", "Taille", "Nettoyage des feuilles", "Contrôle de l'état des plantes", "Remplacement des plantes abîmées"],
          cta: devis,
          featured: true,
        },
        {
          title: "Sur mesure",
          text: "Plusieurs sites, murs végétaux, décors saisonniers :",
          items: ["Arrosage", "Taille", "Nettoyage des feuilles", "Contrôle de l'état des plantes", "Formule construite avec vous"],
          cta: devis,
        },
      ],
    },
    {
      // « Quels végétaux entretient-on ? » (frames 09 à 24) : « Trois matières » de Bureaux (profil « entretien »), titres à pastille italique. La photo
      // de départ est le fond du premier slide ; le fond change en fondu avec le slide actif.
      type: "bureaux-matieres",
      variant: "entretien",
      sliderLabel: "Les trois végétaux entretenus",
      label: "QUELS VÉGÉTAUX ENTRETIENT-ON ?",
      title: "Chaque installation a ses besoins.",
      tag: "ses besoins",
      items: [
        {
          title: "Plantes naturelles",
          tag: "naturelles",
          text: "Arrosage, taille, rempotage, remplacement. C'est le cœur de l'abonnement.",
          photo: "entretien/bg-01",
          alt: "Verrière d'un hall aux murs clairs, garnie de plantes retombantes, avec une porte vitrée à cadre noir.",
        },
        {
          title: "Murs végétaux",
          tag: "végétaux",
          text: "Contrôle de l'arrosage, taille, remplacement des plantes fatiguées pour les murs naturels. Dépoussiérage pour les murs stabilisés ou artificiels.",
          photo: "entretien/bg-02",
          alt: "Grand massif de plantes vertes et de monsteras installé dans un espace de bureaux.",
        },
        {
          title: "Végétaux stabilisés",
          tag: "stabilisés",
          text: "Pas d'arrosage, mais un dépoussiérage et un remplacement après quelques années, quand ils ont perdu de leur éclat.",
          photo: "entretien/bg-03",
          alt: "Mur de feuillages et de fougères retombantes devant des panneaux de bois clair, sous des suspensions noires.",
        },
      ],
    },
    {
      // « Notre fonctionnement » (frames 24 à 27) : la timeline de la landing Noël, non épinglée (valeur par défaut retenue : le titre reste sticky pendant que les étapes défilent). Étiquette à 206 px
      // comme le composant de Noël (frame 25), titre sur deux lignes (variante « entretien »).
      type: "process",
      variant: "entretien",
      label: "NOTRE FONCTIONNEMENT",
      title: "Un suivi simple, en quatre étapes.",
      tag: "simple",
      steps: [
        { title: "Diagnostic", text: "On passe voir vos installations et on fait l'état des lieux : plantes, lumière, arrosage, besoins." },
        { title: "Choix de la formule", text: "On définit ensemble la fréquence des passages et ce qui est inclus." },
        { title: "Passages réguliers", text: "Toujours la même équipe, qui connaît vos locaux et vos plantes." },
        { title: "Bilan annuel", text: "Une fois par an, on fait le point et on vous propose de renouveler ce qui en a besoin." },
      ],
    },
    {
      // « Nos clients » (frames 27 à 31) : le défilé de logos en couleur de Bureaux et Design, la même liste (src/data/clients.js), aucun logo ajouté.
      type: "logos",
      color: true,
      variant: "entretien",
      label: "NOS CLIENTS",
      title: "Ils nous confient leurs plantes.",
      tag: "leurs plantes",
      items: clientsCouleur,
    },
    {
      // FAQ à 5 questions (frames 28 à 32, zoom 30). Les réponses sont celles du copywriting ; seule la résiliation, que le copywriting ne
      // renseigne pas (conditions à définir avec la cliente), est en [À compléter].
      type: "faq",
      variant: "v7e",
      label: "FAQ",
      title: "Les questions qu'on nous pose fréquemment.",
      tag: "fréquemment",
      items: [
        {
          q: "À quelle fréquence passez-vous ?",
          a: "La fréquence dépend de votre espace, de la lumière et du type de végétaux. On la définit ensemble lors du premier passage, puis on l'ajuste si besoin.",
        },
        {
          q: "Que se passe-t-il si une plante meurt ?",
          a: "On la remplace. Le remplacement des plantes abîmées est prévu dans nos offres de suivi.",
        },
        {
          q: "Peut-on résilier l'abonnement ?",
          a: todo("durée d'engagement et conditions de résiliation"),
        },
        {
          q: "Entretenez-vous les murs végétaux ?",
          a: "Oui. Un mur végétal naturel demande un arrosage contrôlé, une taille et le remplacement occasionnel de plantes. Les murs stabilisés ou artificiels demandent seulement un dépoussiérage.",
        },
        {
          q: "Intervenez-vous en dehors de Paris ?",
          a: "Nous intervenons principalement à Paris et en Île-de-France. Pour plusieurs sites ou un projet d'envergure, contactez-nous.",
        },
      ],
    },
  ],
};
