// Fiche projet « Floral Fashion Show », V4 (retours-v4/docs/02-CASE-STUDY.md, case-study-full.png et frames case-study-01 à 07). Les textes
// (ligne d'infos, intro, défi) sont lus sur la maquette : le document « Étude de cas Floral Fashion Show » n'existe pas dans le dépôt. Ils
// ne figurent pas dans le copywriting 09 : ils sont listés dans `designTexts`, que scripts/check-site.js compte au lieu de les refuser. Les
// valeurs de la ligne d'infos (Date 2025, Lieu Paris) sont celles de la maquette, à confirmer. Une étoile entoure un mot clé affiché en orange.
// Les photos sont celles de retours-v4/assets/case-study (coins rognés), `frame` leur cadre sur la maquette (largeur / hauteur). Meta de la
// page : à fournir. La page reste pilotée par ces données : une autre fiche = un autre fichier de ce type.
import { todo } from "../../components/placeholder.js";

export const ficheFloralFashionShow = {
  id: "floral-fashion-show",
  path: "/realisations/floral-fashion-show/",
  source: "09-realisations.md",
  titlePrefix: "Floral Fashion Show",
  description: todo("meta description de la fiche"),
  designTexts: [
    "NOS RÉALISATIONS",
    "2025",
    "Client",
    "Secteur",
    "Mode et événementiel",
    "Prestation",
    "Scénographie florale",
    "Date",
    "Lieu",
    "Un défilé qui prend racine.",
    "Un défilé",
    "la scénographie",
    "nos projets",
    "Pour le Floral Fashion Show, nous avons imaginé *une scénographie florale complète* : un podium habillé, des arches florales suspendues et *une ambiance végétale* totale du premier au dernier passage.",
    "Ici, les fleurs ne décorent pas le défilé : elles en sont *le décor, le rythme et la signature*. Un projet qui nous a autant amusés que nos clients.",
    "Le défi de la scénographie florale d'un défilé",
    "Faire entrer le végétal dans *un univers* fait de lignes nettes, de lumière et de mouvement, sans voler la vedette aux tenues.",
    "Découvrez nos projets les plus iconiques.",
    "Voir plus de réalisations",
  ],
  sections: [
    {
      type: "fiche-entete",
      back: { label: "NOS RÉALISATIONS", to: "/realisations/", filter: "scenographie" }, // la fiche mène à la liste, filtre Scénographie déjà choisi
      category: "Scénographie & événementiel", // la catégorie du copywriting (le style .label la met en majuscules, comme la maquette)
      heading: "Floral Fashion Show",
      infos: [
        { label: "Client", value: "Floral Fashion Show" },
        { label: "Secteur", value: "Mode et événementiel" },
        { label: "Prestation", value: "Scénographie florale" },
        { label: "Date", value: "2025" },
        { label: "Lieu", value: "Paris" },
      ],
    },
    {
      type: "fiche-photo",
      hero: true,
      frame: "1390 / 613",
      photo: {
        src: "case-study/case-study-01",
        alt: "Mannequin en veste noire et lunettes roses devant des arches de roses roses et rouges",
      },
    },
    {
      type: "fiche-texte",
      variant: "intro",
      heading: "Un défilé qui prend racine.",
      tag: "Un défilé",
      paragraphs: [
        "Pour le Floral Fashion Show, nous avons imaginé *une scénographie florale complète* : un podium habillé, des arches florales suspendues et *une ambiance végétale* totale du premier au dernier passage.",
        "Ici, les fleurs ne décorent pas le défilé : elles en sont *le décor, le rythme et la signature*. Un projet qui nous a autant amusés que nos clients.",
      ],
    },
    {
      type: "fiche-photo",
      frame: "1390 / 652",
      photo: {
        src: "case-study/case-study-02",
        alt: "Mannequin souriante devant deux grandes ailes de pampas roses et un pilier de roses rouges",
      },
    },
    {
      type: "fiche-texte",
      variant: "defi",
      heading: "Le défi de la scénographie florale d'un défilé",
      tag: "la scénographie",
      paragraphs: ["Faire entrer le végétal dans *un univers* fait de lignes nettes, de lumière et de mouvement, sans voler la vedette aux tenues."],
    },
    {
      type: "fiche-galerie",
      // Deux photos côte à côte, puis une large (sens de parallaxe opposés pour les deux premières).
      photos: [
        { frame: "680 / 652", src: "case-study/case-study-03", alt: "Mannequin en robe verte tenant un bouquet rouge devant un mur de roses" },
        { frame: "680 / 653", src: "case-study/case-study-04", alt: "Mannequin accoudée à une rambarde devant des ailes de pampas roses, sous un ciel bleu" },
        { frame: "1390 / 653", src: "case-study/case-study-05", alt: "Mannequin vêtu d'un manteau de feuillage devant une arche de roses" },
      ],
    },
    {
      type: "fiche-autres",
      label: "NOS RÉALISATIONS",
      heading: "Découvrez nos projets les plus iconiques.",
      tag: "nos projets",
      // Deux cartes de la page Réalisations, reprises par leur titre (une seule source : src/data/pages/realisations.js).
      featured: ["Façade Végétalisée Atelier DGE", "Décor Saint Tropez"],
      more: { label: "Voir plus de réalisations", to: "/realisations/" },
    },
  ],
};
