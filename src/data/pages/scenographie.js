// Page Scénographie végétale & événementiel : tous les textes viennent de docs/copywriting/04-scenographie-vegetale-et-evenementiel.md
// (premier jet, à retravailler avec la cliente), le title et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un
// todo(), jamais un texte inventé. Les clients sans logo fourni (Eataly, ONF, Ambassade d'Italie) ont `logo: null` : [À compléter].
import { todo } from "../../components/placeholder.js";

export const scenographie = {
  id: "scenographie",
  path: "/scenographie-vegetale-evenementiel-paris/",
  source: "04-scenographie-vegetale-et-evenementiel.md",
  title: "Scénographie végétale & événementiel | D'un Bout À L'autre",
  description:
    "Scénographie végétale pour vos événements d'entreprise à Paris : lancements, soirées, salons, shootings, ateliers. Conception, fabrication, installation.",
  sections: [
    {
      type: "hero",
      title: "Scénographie végétale et événementiel à Paris : on transforme vos événements en décors sur mesure.",
      tag: "décors sur mesure",
      lead: "Lancements, soirées, salons, shootings : nous concevons, fabriquons, installons et démontons votre décor végétal.",
      cta: "Parlons de votre événement",
    },
    {
      type: "cards",
      label: "POUR QUEL TYPE D'ÉVÉNEMENT ?",
      title: "Un décor végétal pour chacun de vos événements.",
      tag: "chacun de vos événements",
      lead: "Nous transformons vos événements en décors végétaux sur mesure.",
      items: [
        {
          title: "Événements d'entreprise",
          text: "Lancement de produit, conférence, salon professionnel, inauguration, showroom : nous habillons vos événements professionnels avec des décors en accord avec votre identité de marque. Des compositions de table à l'installation scénographique complète, nous nous adaptons à la taille et à l'ambiance de chaque événement.",
        },
        {
          title: "Soirées et cocktails",
          text: "Soirée d'entreprise, cocktail, scénographie de Noël : nous créons l'ambiance de A à Z. Façades fleuries, plafonds végétalisés, arches, tables : chaque élément est pensé pour que vos invités se souviennent du lieu.",
        },
        {
          title: "Photocalls et shootings",
          text: "Photocall, shooting photo : un décor pensé pour être photographié. Fonds végétaux, structures, compositions suspendues : ils font toujours leur effet à l'image, et sur les réseaux.",
        },
        {
          title: "Ateliers végétaux",
          text: "Terrarium, bouquet, atelier sur mesure : une animation créative pour vos équipes ou vos invités. Les formats sont détaillés plus bas, dans la section Ateliers.",
        },
      ],
    },
    {
      type: "cards",
      label: "NOS RÉFÉRENCES",
      title: "Ils nous ont fait confiance pour leurs événements.",
      tag: "leurs événements",
      lead: "Nous avons eu la chance de travailler sur des projets d'exception avec des clients qui nous ont fait confiance pour des événements exigeants. En voici quelques-uns dont nous sommes particulièrement fiers.",
      items: [
        {
          logo: null,
          title: "Eataly Paris",
          text: "Façade entièrement fleurie pour le printemps et l'été, plafond végétalisé pour la période de Noël, décoration de la press day. Des projets de scénographie de grande échelle, réalisés à plusieurs reprises avec les équipes d'Eataly au BHV Marais.",
        },
        {
          logo: "bhv-marais",
          title: "BHV Marais",
          text: "Décoration de la terrasse du soleil du Marais, scénographie du réveillon du Nouvel An. Des interventions visuellement fortes dans l'un des lieux les plus fréquentés de Paris.",
        },
        {
          logo: null,
          title: "Ambassade d'Italie",
          text: "Décoration florale pour des événements officiels et décoration de Noël, des projets qui demandent rigueur, élégance et respect du protocole.",
        },
        {
          logo: null,
          title: "ONF",
          text: "Reconstitution d'un décor forestier complet dans le Pavillon du Climat à Paris. Un projet de scénographie immersive hors norme, alliant technique et sens artistique.",
        },
        {
          title: "Floral Fashion Show",
          text: "Scénographie florale complète pour un défilé de mode, habillage de podium, arches et compositions florales suspendues, ambiance végétale totale.",
        },
      ],
    },
    {
      type: "process",
      label: "NOTRE APPROCHE",
      title: "Conception, fabrication, installation, démontage : on s'occupe de tout.",
      tag: "on s'occupe de tout",
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
      type: "cards",
      label: "LES ATELIERS VÉGÉTAUX",
      title: "Animez vos équipes avec un atelier végétal.",
      tag: "un atelier végétal",
      lead: "Créer quelque chose de ses mains, en groupe, autour du végétal, c'est à la fois simple et puissant. Nos ateliers végétaux sont conçus pour ça : offrir un moment de détente et de lien social, loin des écrans et des réunions. Que vous soyez une startup de 15 personnes, une grande entreprise cherchant une animation originale pour son séminaire ou même une famille voulant découvrir ce que l'on peut faire des plantes, nous adaptons le format et le contenu à votre groupe.",
      items: [
        {
          title: "Atelier Terrarium",
          text: "Chaque participant crée son propre écosystème miniature en bocal. Après une courte introduction sur les plantes et leurs besoins, chacun compose son terrarium à sa façon, avec les végétaux et les éléments décoratifs mis à disposition. On repart avec sa création, prête à vivre sur un bureau ou une étagère.",
          facts: [
            { label: "Durée", value: "2h environ" },
            { label: "Participants", value: "10 à 80 personnes" },
            { label: "Lieu", value: "dans vos locaux ou à Paris" },
            { label: "Ce qu'on repart avec", value: "son terrarium personnalisé, prêt à vivre" },
          ],
        },
        {
          title: "Atelier Bouquet",
          text: "Initiation aux techniques de composition florale guidée par notre équipe. Chaque participant apprend à sélectionner ses fleurs, à les composer et à conditionner son bouquet. On repart avec sa création, ficelée et prête à offrir.",
          facts: [
            { label: "Durée", value: "1h30 à 2h" },
            { label: "Participants", value: "8 à 50 personnes" },
            { label: "Lieu", value: "dans vos locaux ou à Paris" },
            { label: "Ce qu'on repart avec", value: "son bouquet ou sa composition florale" },
          ],
        },
        {
          title: "Atelier sur mesure",
          text: "Séminaire, onboarding, journée d'équipe, événement CSE : on conçoit un atelier végétal taillé pour votre groupe. Thème, durée, nombre de participants, lieu : tout est défini ensemble. On peut aussi combiner plusieurs ateliers sur une même journée pour un programme complet.",
          facts: [
            { label: "Durée", value: "selon le programme défini ensemble" },
            { label: "Participants", value: "15 à 150 personnes" },
            { label: "Lieu", value: "dans vos locaux (toute France) ou à Paris" },
            { label: "Formules", value: "demi-journée, journée, soirée" },
          ],
        },
      ],
    },
    {
      type: "gallery",
      label: "GALERIE",
      items: [
        { photo: { src: "photos/event-floral-fashion-show-ailes", alt: "Femme entre deux grandes ailes végétales en herbes de la pampa" } },
        { photo: { src: "photos/event-floral-fashion-show-roses", alt: "Mannequin devant des arches de roses roses et rouges lors du Floral Fashion Show" } },
        { photo: { src: "photos/noel-eataly-plafond-vegetalise", alt: "Plafond d'un restaurant recouvert de lierre, de fougères blanches et de suspensions en verre" } },
        { photo: null },
        { photo: null },
        { photo: null },
      ],
      cta: { label: "Voir toutes nos réalisations événementielles", to: "/realisations/" },
    },
    {
      type: "faq",
      label: "FAQ",
      title: "Les questions les plus fréquentes sur la scénographie et l'événementiel.",
      tag: "les plus fréquentes",
      items: [
        {
          q: "Quel délai prévoir pour organiser un décor végétal ?",
          a: "Pour un événement d'entreprise standard, comptez idéalement 2 à 3 semaines de préparation. Pour les scénographies de grande envergure, 2 à 3 mois sont préférables pour avoir le temps de concevoir, de fabriquer et de commander les végétaux adaptés. On peut cependant intervenir sur des délais plus courts pour des projets simples.",
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
          q: "Quels sont les budgets minimum pour un événement d'entreprise ?",
          a: "Nos prestations événementielles commencent à quelques centaines d'euros pour un décor simple (compositions de table, quelques arrangements) et peuvent aller jusqu'à plusieurs milliers pour une scénographie complète. Contactez-nous avec votre brief pour recevoir un devis adapté.",
        },
        {
          q: "Combien de personnes minimum pour un atelier ?",
          a: "À partir de 8 pour l'atelier bouquet, 10 pour le terrarium. Pour les formats sur mesure, contactez-nous selon votre configuration.",
        },
        {
          q: "Faites-vous aussi des mariages et des événements privés ?",
          a: "Oui, sur demande. Notre activité se concentre sur les entreprises, mais nous créons aussi des décors pour des événements privés : mariages, anniversaires, enterrements de vie de jeune fille. Contactez-nous avec votre projet.",
        },
      ],
    },
    {
      type: "cta-final",
      title: "Votre prochain événement mérite un décor à la hauteur.",
      tag: "un décor à la hauteur",
      cta: "Demander un devis",
      phone: { label: "Téléphone :", value: todo("téléphone") },
    },
  ],
};
