// Page Entretien & abonnements végétal : tous les textes viennent de docs/copywriting/08-entretien-et-abonnements-vegetal.md (premier jet,
// à retravailler avec la cliente), le title et la meta de docs/arborescence-et-strategie.md. Les formules, la liste des clients suivis et
// les conditions de résiliation sont « à définir avec la cliente » : todo(), jamais un texte inventé.
import { todo } from "../../components/placeholder.js";

export const entretien = {
  id: "entretien",
  path: "/entretien-abonnement-plantes-entreprise-paris/",
  source: "08-entretien-et-abonnements-vegetal.md",
  title: "Entretien de plantes de bureau à Paris | D'un Bout À L'autre",
  description:
    "Entretien de plantes de bureau à Paris : abonnement, arrosage, taille, remplacement et renouvellement des décors végétaux. Devis gratuit sur mesure.",
  sections: [
    {
      type: "hero",
      title: "Entretien et abonnement de plantes pour entreprises à Paris : vos plantes toujours belles.",
      tag: "vos plantes toujours belles",
      lead: "Entretien, remplacement, renouvellement des décors : on s'occupe de vos végétaux toute l'année, pour que vous n'ayez rien à gérer.",
      cta: "Demander une formule",
    },
    {
      type: "cards",
      label: "CE QUI EST INCLUS",
      title: "On s'occupe de tout, passage après passage.",
      tag: "passage après passage",
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
      type: "cards",
      label: "NOS FORMULES D'ABONNEMENT",
      title: "Une formule adaptée à vos locaux.",
      tag: "adaptée à vos locaux",
      items: [
        {
          title: "Essentiel",
          text: "Un passage régulier pour entretenir vos plantes naturelles.",
          note: todo("fréquence et contenu de la formule Essentiel"),
        },
        {
          title: "Confort",
          text: "Des passages plus fréquents, le remplacement des plantes abîmées inclus.",
          note: todo("fréquence et contenu de la formule Confort"),
        },
        {
          title: "Sur mesure",
          text: "Plusieurs sites, murs végétaux, décors saisonniers : une formule construite avec vous.",
          note: todo("contenu de la formule Sur mesure"),
        },
      ],
    },
    {
      type: "cards",
      label: "QUELS VÉGÉTAUX ENTRETIENT-ON ?",
      title: "Chaque installation a ses besoins.",
      tag: "ses besoins",
      items: [
        {
          title: "Plantes naturelles",
          text: "Arrosage, taille, rempotage, remplacement. C'est le cœur de l'abonnement.",
        },
        {
          title: "Murs végétaux",
          text: "Contrôle de l'arrosage, taille, remplacement des plantes fatiguées pour les murs naturels. Dépoussiérage pour les murs stabilisés ou artificiels.",
        },
        {
          title: "Végétaux stabilisés et artificiels",
          text: "Pas d'arrosage, mais un dépoussiérage et un remplacement après quelques années, quand ils ont perdu de leur éclat.",
        },
      ],
    },
    {
      type: "process",
      label: "COMMENT ÇA MARCHE",
      title: "Un suivi simple, en quatre étapes.",
      tag: "en quatre étapes",
      steps: [
        { title: "Diagnostic", text: "On passe voir vos installations et on fait l'état des lieux : plantes, lumière, arrosage, besoins." },
        { title: "Choix de la formule", text: "On définit ensemble la fréquence des passages et ce qui est inclus." },
        { title: "Passages réguliers", text: "Toujours la même équipe, qui connaît vos locaux et vos plantes." },
        { title: "Bilan annuel", text: "Une fois par an, on fait le point et on vous propose de renouveler ce qui en a besoin." },
      ],
    },
    {
      type: "logos",
      label: "RÉFÉRENCES CLIENTS",
      title: "Ils nous confient leurs plantes.",
      tag: "leurs plantes",
      items: [],
      empty: { text: "Logos et noms des clients déjà suivis", value: todo("liste des clients suivis") },
    },
    {
      type: "faq",
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
          q: "Entretenez-vous aussi des plantes que vous n'avez pas installées ?",
          a: "Oui, après une visite pour faire le point sur leur état. On peut aussi vous proposer de les remplacer ou de les compléter.",
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
    {
      type: "cta-final",
      title: "Vos plantes méritent un suivi régulier.",
      tag: "un suivi régulier",
      cta: "Demander une formule",
      phone: { label: "Téléphone :", value: todo("téléphone") },
    },
  ],
};
