// Page Réalisations, V4 (retours-v4/docs/01-REALISATIONS.md et frames realisations-01 à 19). Les textes viennent de la maquette V4, pas du
// copywriting 09-realisations.md : ceux qui n'y figurent pas sont listés dans `designTexts`, et scripts/check-site.js les compte au lieu
// de les refuser. Title et meta sont ceux de docs/arborescence-et-strategie.md.
// Les 7 filtres suivent la maquette (« Décoration de Noël » séparée de « Décoration saisonnière », pas d'« Ateliers végétaux »).
// 32 projets en tout (le compteur « (32) » du titre et du menu est supprimé en V8) : 8 sont fournis, les 24 autres sont des cartes `todo` (titre
// [À compléter], photos réutilisées) à remplacer par les vrais projets. Leurs catégories suivent les compteurs de la maquette
// (12, 3, 4, 5, 6 et 2), pour que chaque filtre affiche son nombre. La microcopie fonctionnelle est sous `micro`, à valider.
import { todo } from "../../components/placeholder.js";

// Photos des cartes (retours-v4/assets/realisations/portfolio-01 à 08, coins rognés), avec leur texte alternatif.
const photos = [
  { src: "projets/portfolio-01", alt: "Mannequin devant des arches de roses roses et rouges lors du Floral Fashion Show" },
  { src: "projets/portfolio-02", alt: "Composition florale bleue, jaune et orange suspendue sur une façade, vue d'en bas" },
  { src: "projets/portfolio-03", alt: "Enseigne de l'Atelier Du Geste à l'Emotion entourée de tournesols" },
  { src: "projets/portfolio-04", alt: "Table dressée avec bouquets d'oiseaux de paradis et verres en cristal" },
  { src: "projets/portfolio-05", alt: "Décor d'Halloween chez Felicita : citrouilles, chrysanthèmes et fausses toiles d'araignée" },
  { src: "projets/portfolio-06", alt: "Arche de sapin ornée d'un grand nœud rouge devant une grille de fer noir" },
  { src: "projets/portfolio-07", alt: "Lavande au premier plan, tour Eiffel au loin" },
  { src: "projets/portfolio-08", alt: "Salon aux boiseries dorées décoré de branches givrées" },
];

// Les 8 projets fournis. Les titres 6 à 8 et les catégories 5 à 8 sont provisoires (la maquette y répète « Façade fleurie Eataly ») :
// `todo: true` les signale. Seul Floral Fashion Show a sa fiche pour l'instant.
const first = [
  { title: "Floral Fashion Show", category: "scenographie", photo: photos[0], to: "/realisations/floral-fashion-show/" },
  { title: "Façade fleurie Eataly", category: "scenographie", photo: photos[1] },
  { title: "Façade Végétalisée Atelier DGE", category: "saisonniere", photo: photos[2] },
  { title: "Décor Saint Tropez", category: "design-vegetal", photo: photos[3] },
  { title: "Felicita, Halloween", category: "saisonniere", photo: photos[4], todo: true },
  { title: todo("nom du projet"), category: "noel", photo: photos[5], todo: true },
  { title: todo("nom du projet"), category: "terrasses", photo: photos[6], todo: true },
  { title: todo("nom du projet"), category: "noel", photo: photos[7], todo: true },
];

// Les 24 autres : catégories restantes pour atteindre 12, 3, 4, 5, 6 et 2, servies à tour de rôle pour que chaque lot de 8 soit varié.
const remaining = { bureaux: 12, "design-vegetal": 3, terrasses: 2, saisonniere: 3, noel: 4 };
const categories = [];
while (categories.length < 24) {
  for (const key of Object.keys(remaining)) if (remaining[key] > 0) (remaining[key]--, categories.push(key));
}
const fillers = categories.map((category, i) => ({ title: todo("nom du projet"), category, photo: photos[i % photos.length], todo: true }));

export const realisationsPage = {
  id: "realisations",
  path: "/realisations/",
  source: "09-realisations.md",
  title: "Réalisations de design végétal à Paris | D'un Bout À L'autre",
  description:
    "Découvrez les réalisations de D'un Bout À L'autre : bureaux végétalisés, design végétal sur mesure, scénographies, terrasses et décors de saison à Paris.",
  // Textes pris sur la maquette V4 (frames realisations-01 à 19) et absents du copywriting : comptés par check-site, jamais ignorés.
  designTexts: [
    "Nos projets.",
    "NOS RÉALISATIONS",
    "Discutons de votre projet",
    "Façade Végétalisée Atelier DGE",
    "Décor Saint Tropez",
    "Voir plus de réalisations",
  ],
  sections: [
    {
      type: "projets-hero",
      heading: "Nos projets.", // pas `title` : check-site y chercherait la pastille de la phrase (statement), qui est un autre texte
      // Photos du hero (frame 01, 1728 x 1030) : x et w en vw, y en svh, ratio largeur sur hauteur ; speed en svh par écran de scroll
      // (100 = la vitesse de la page) : 02 rapide, 03 lente, 01 et 04 moyennes. mobile : x, y, w sous 900 px, ou null (3 photos seulement) ;
      // b : bas maximal de la photo en svh, la photo rétrécit plutôt que de toucher le titre (44 : au-dessus de lui) sur une tablette en
      // portrait, où la largeur en vw donne des photos plus hautes que l'espace libre.
      // V8 (G5, components/gallery.js) : la photo 03 est sous la 01 (`under` : indice de la photo du dessus, `gap` : écart en vw) et la 04 sous la 02 : elles se recouvraient sur un
      // écran plus large que 1728 x 1030 (rapport 2,1) ; l'écart est maintenant en vw, donc le même à toute taille d'écran, et la photo du dessous ne monte pas plus vite que celle du dessus.
      photos: [
        {
          src: "projets/realisation-01",
          alt: "Arche de sapin ornée d'un grand nœud rouge devant une grille de fer noir",
          x: 7.93, y: 21.84, w: 17.36, ratio: 0.75, speed: 100,
          mobile: { x: 5, y: 15, w: 36, b: 44 },
        },
        {
          src: "projets/realisation-02",
          alt: "Composition florale bleue, jaune et orange suspendue sur une façade, vue d'en bas",
          x: 82.64, y: 27.77, w: 19.68, ratio: 0.7506, speed: 118,
          mobile: { x: 60, y: 21, w: 36, b: 44 },
        },
        {
          src: "projets/realisation-03",
          alt: "Mannequin devant des arches de roses roses et rouges lors du Floral Fashion Show",
          x: 0, w: 20.72, ratio: 0.8627, speed: 84, under: 0, gap: 4.9,
          mobile: { x: 6, y: 66, w: 34, b: 98 },
        },
        {
          src: "projets/realisation-04",
          alt: "Table dressée avec bouquets d'oiseaux de paradis et verres en cristal",
          x: 68.69, w: 20.02, ratio: 0.7828, speed: 100, under: 1, gap: 7.9,
          mobile: null,
        },
      ],
      // Photo qui grandit jusqu'au plein écran (frames 03 à 07), puis sert de fond au texte.
      big: { src: "projets/realisation-05", alt: "Enseigne de l'Atelier Du Geste à l'Emotion entourée de tournesols" },
      label: "NOS RÉALISATIONS",
      statement: "Nous travaillons chaque projet avec la même passion.",
      tag: "la même passion",
      cta: "Discutons de votre projet",
    },
    {
      type: "projets-grid",
      label: "NOS RÉALISATIONS",
      filters: [
        { key: "all", label: "Tous les projets" },
        { key: "bureaux", label: "Végétalisation de bureaux" },
        { key: "terrasses", label: "Terrasses" },
        { key: "design-vegetal", label: "Design végétal sur mesure" },
        { key: "saisonniere", label: "Décoration saisonnière" },
        { key: "noel", label: "Décoration de Noël" },
        { key: "scenographie", label: "Scénographie & événementiel" },
      ],
      items: [...first, ...fillers],
      pageSize: 8,
      more: "Voir plus de réalisations",
      micro: {
        groupLabel: "Filtrer les réalisations par catégorie",
        shown: "{n} réalisations affichées",
        shownOne: "1 réalisation affichée",
        more: "{n} réalisations de plus affichées",
        moreOne: "1 réalisation de plus affichée",
      },
    },
  ],
};
