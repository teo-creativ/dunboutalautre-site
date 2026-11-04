// Page Design végétal sur mesure : les textes viennent de docs/copywriting/03-design-vegetal-sur-mesure.md (premier jet, à retravailler
// avec la cliente), le title et la meta de docs/arborescence-et-strategie.md, les noms de clients de la même arborescence (la page de
// copywriting n'en liste pas). Une valeur inconnue est un todo(), jamais un texte inventé.
// V6 (retours-v6, maquette de la cliente) : l'ordre est celui de retours-v6/docs/00-RETOURS-V6.md ; les textes que la maquette change sont
// listés dans `designTexts` (scripts/check-site.js les compte au lieu de les refuser).
import { todo } from "../../components/placeholder.js";
import { avisFictif, clientsCouleur } from "../clients.js";

export const designVegetal = {
  id: "design-vegetal",
  path: "/design-vegetal-sur-mesure-paris/",
  source: "03-design-vegetal-sur-mesure.md",
  title: "Design végétal sur mesure à Paris | D'un Bout À L'autre",
  description:
    "Tableaux végétalisés, logos végétaux, murs végétaux, structures et suspensions sur mesure à Paris. Naturel, stabilisé ou artificiel. Devis gratuit.",
  // Textes pris sur la maquette V6 (frames design-01 à 44), absents ou modifiés par rapport au copywriting 03.
  designTexts: [
    "Design végétal sur mesure à Paris : tableaux, logos et suspensions.",
    "Nous concevons et fabriquons des créations végétales uniques pour vos bureaux, commerces, hôtels et événements.",
    "De vraies plantes dont la sève a été remplacée par de la glycérine végétale. Résultat : aucun arrosage, aucune luminosité requise, une durée de vie de plusieurs années. Elles gardent leur aspect naturel sans le moindre entretien.",
    // Bas de page : bouton de la galerie, 5e étape du processus (celle de Bureaux), clients, avis fictif (Bureaux) et 3e question de la FAQ.
    "Discutons de votre projet",
    "Suivi et entretien",
    "Pour les plantes naturelles, nous proposons des passages d'entretien réguliers, sous forme d'abonnement (fréquence à définir selon vos besoins). En cas de problème sur un végétal, nous assurons son remplacement.",
    "NOS CLIENTS",
    "Thunes",
    "D'un Bout À L'autre a su capter l'esprit de notre marque en apportant un équilibre végétal remarquable dans notre siège parisien. Les équipes sont ravies et l'entretien hebdomadaire est d'une discrétion absolue.",
    "Hélène Mercier",
    "Directrice Environnement de Travail & RSE,",
    "On peut installer un mur dans un espace sans lumière ?",
  ],
  sections: [
    {
      type: "hero",
      bx: true,
      variant: "design",
      keywords: ["Plantes naturelles", "Végétaux stabilisés", "Végétaux artificiels"], // en capitales à l'écran (bureaux-hero.css)
      title: "Design végétal sur mesure à Paris : tableaux, logos et suspensions.",
      tag: "sur mesure",
      lead: "Nous concevons et fabriquons des créations végétales uniques pour vos bureaux, commerces, hôtels et événements.",
      cta: "Demander un devis",
    },
    {
      // « Nos 5 créations » (V6 §2, frames 04 à 08) : la liste de « Pourquoi végétaliser » de Bureaux (lignes titre et paragraphe, ligne active en
      // olive soulignée d'orange). `hold` : la liste reste en place un écran pendant que la section orange monte par-dessus (frames 05 à 08).
      type: "bureaux-pourquoi",
      variant: "design",
      hold: true,
      endRule: true,
      label: "NOS 5 CRÉATIONS",
      title: "Cinq façons d'apporter une création végétale unique chez vous.",
      tag: "unique",
      items: [
        {
          title: "Tableaux végétaux",
          text: "Une composition artistique encadrée, dans l'esprit d'un tableau mural, mais réalisée avec de vrais végétaux. Plus compact, plus simple à installer, il convient parfaitement à une salle de réunion, un couloir, un accueil ou un appartement.",
        },
        {
          title: "Logos végétalisés",
          text: "Votre logo ou vos initiales reconstitués en végétaux stabilisés ou artificiels, sur un panneau ou directement sur votre mur. Immédiatement reconnaissable, visuellement fort, mémorable.",
        },
        {
          title: "Murs végétaux",
          text: "Une installation murale de grande dimension : les plantes sont fixées sur un panneau ou une structure murale, et couvrent une cloison entière ou une partie de mur. Le mur végétal devient l'élément central d'un espace.",
        },
        {
          title: "Structures végétales",
          text: "Arches, cadres, volumes posés au sol : des structures qui donnent du relief et délimitent des espaces. Elles conviennent aussi bien à un événement qu'à un lieu permanent.",
        },
        {
          title: "Suspensions végétales",
          text: "Des compositions suspendues au plafond, pour habiller un hall, un restaurant ou une salle de réception. Elles libèrent le sol et attirent le regard vers le haut.",
        },
      ],
    },
    {
      // « Naturel, stabilisé ou artificiel » (V6 §3, frames 09 à 24) : section orange, photo qui grandit jusqu'au plein écran, puis slider des
      // trois matières (titres seuls, sans pastille) sur trois fonds. Les lignes « Idéal pour » du copywriting (`use`) ne sont pas sur la maquette.
      type: "bureaux-matieres",
      variant: "design",
      label: "NATUREL, STABILISÉ OU ARTIFICIEL ?",
      title: "Naturel, stabilisé ou artificiel... Comment choisir ce qui vous convient vraiment ?",
      tag: "vraiment",
      items: [
        {
          title: "Naturel",
          text: "De vraies plantes vivantes avec tout ce que ça implique : entretien régulier, lumière nécessaire, remplacement ponctuel. Mais elles imposent une atmosphère visuelle forte, une vraie présence végétale, et l'énergie que seul le vivant apporte à un espace.",
          photo: "design-vegetal/fond-01",
          alt: "Mur blanc portant le logo Studapart en relief, avec deux plantes vertes et des chaises couleur terre cuite autour d'une table en bois.",
        },
        {
          title: "Stabilisé",
          text: "De vraies plantes dont la sève a été remplacée par de la glycérine végétale. Résultat : aucun arrosage, aucune luminosité requise, une durée de vie de plusieurs années. Elles gardent leur aspect naturel sans le moindre entretien.",
          photo: "design-vegetal/fond-02",
          alt: "Grand palmier dans une pièce aux murs blancs moulurés, devant une fenêtre à volets, à côté d'un lampadaire noir et doré.",
        },
        {
          title: "Artificiel",
          text: "En tissu ou plastique haut de gamme. Des couleurs vives, des formes complexes, des volumes importants, sans aucune contrainte technique. La solution la plus robuste et la plus adaptée aux façades, aux espaces humides, aux logos végétalisés et aux installations exigeantes.",
          photo: "design-vegetal/fond-03",
          alt: "Logo reconstitué en feuillages artificiels sur un mur blanc, avec une enseigne néon jaune et de grandes feuilles de monstera.",
        },
      ],
    },
    {
      // « Logo reconstitué en végétaux » (V6 §4, frames 24 à 28) puis « Le branding végétal » (§5, frames 27 à 33) : une seule scène épinglée. La galerie de
      // « Vos bureaux deviennent vivant » de Bureaux, sans étiquette : 4 photos qui montent derrière le titre et le bouton, fixes au centre. Position
      // (x et w en vw, y de départ en svh sous le haut de l'écran), proportions et vitesse (svh montés par écran de scroll, 100 = la vitesse de la page)
      // relevées sur les frames 24 à 27 à 1728 x 1030 (la frame 24 est 42 px avant le début du pin : départs de 42 px plus haut) : les trois dernières photos montent ensemble (la maquette les fait défiler d'un bloc, le doc 01
      // demande des vitesses différentes : les frames priment), la première 13 % moins vite. `mobile` : les trois photos gardées sous 900 px. `grow` :
      // la grande photo qui grandit jusqu'au plein écran, puis l'étiquette et le texte à deux pastilles (frame 31).
      type: "bureaux-galerie",
      variant: "design",
      title: "Votre logo ou identité de marque reconstitué en végétaux.",
      tag: "en végétaux",
      cta: "Discutons de votre projet",
      photos: [
        {
          photo: "design-vegetal/galerie-03",
          alt: "Bureau Studapart : mur blanc au logo en relief au-dessus d'une table en bois et de chaises couleur terre cuite, sous des suspensions à rayons bleus et orange.",
          x: 3.82, y: 25.4, w: 18.06, ratio: 0.879, speed: 118,
          mobile: { x: 6, y: 78, w: 36, speed: 120 },
        },
        {
          photo: "design-vegetal/galerie-01",
          alt: "Lettre U en bois couronnée d'un bouquet de fleurs séchées rouges et roses, sur un mur beige.",
          x: 80.32, y: 34.6, w: 19.68, ratio: 0.75, speed: 136,
          mobile: { x: 22, y: 142, w: 36, speed: 125 },
        },
        {
          photo: "design-vegetal/galerie-04",
          alt: "Mur de feuillages variés reconstituant un logo blanc, avec une enseigne néon jaune et de grandes feuilles de monstera.",
          x: -3.125, y: 75.4, w: 27.14, ratio: 1.333, speed: 136,
        },
        {
          photo: "design-vegetal/galerie-02",
          alt: "Pièce de bureau lumineuse aux grandes fenêtres, avec des fauteuils en bois sur un tapis kilim, un cactus et des plantes.",
          x: 66.6, y: 87.9, w: 20.08, ratio: 0.75, speed: 136,
          mobile: { x: 58, y: 104, w: 36, speed: 122 },
        },
      ],
      grow: {
        photo: "design-vegetal/fond-04",
        alt: "Grand palmier et plantes à feuilles rouges et vertes à côté de chaises cannées dorées et d'une table ronde noire.",
        label: "LE BRANDING VÉGÉTAL",
        text: "Nous reconstituons votre logo, vos initiales ou un élément de votre identité visuelle en végétaux stabilisés ou artificiels, sur un panneau mural ou directement fixé sur votre mur. Le résultat est immédiatement reconnaissable, visuellement fort, et mémorable.",
        tags: [
          { text: "votre identité visuelle", variant: "orange" },
          { text: "mémorable", variant: "cream" },
        ],
      },
    },
    {
      type: "process",
      label: "NOTRE PROCESSUS DE CRÉATION",
      title: "De votre idée à la pose, on travaille en collaboration.",
      tag: "en collaboration",
      steps: [
        {
          title: "Échange",
          text: "L'espace, le style, les contraintes (luminosité, humidité, accès). Si c'est un logo végétalisé, on demande votre charte graphique et les dimensions envisagées. On définit ensemble le périmètre de la réalisation.",
        },
        {
          title: "Conception",
          text: "Sélection des végétaux, des couleurs, des matériaux. On réalise une maquette visuelle si nécessaire pour vous permettre de vous projeter. On ajuste jusqu'à ce que ce soit exactement ce que vous voulez.",
        },
        {
          title: "Fabrication",
          text: "Chaque composition est assemblée à la main. Le cadre ou le support est fabriqué sur mesure aux dimensions de votre mur. Chaque création est unique.",
        },
        {
          title: "Installation",
          text: "Pose sur site, fixations définitives, finitions. Pour les créations naturelles, on vous donne toutes les instructions d'entretien. Pour le stabilisé et l'artificiel, vous n'avez rien à faire, on vous laisse en profiter.",
        },
        {
          title: "Suivi et entretien",
          text: "Pour les plantes naturelles, nous proposons des passages d'entretien réguliers, sous forme d'abonnement (fréquence à définir selon vos besoins). En cas de problème sur un végétal, nous assurons son remplacement.",
        },
      ],
    },
    {
      // « Nos clients » (V6 §7, frame 36) : les six logos en couleur de Bureaux (clés « -svg » de data/logos.js, pas de doublon), dans le défilé des
      // pages de services. Pas de bouton sous le défilé : la maquette n'en montre pas.
      type: "logos",
      color: true,
      variant: "design",
      label: "NOS CLIENTS",
      title: "Ils nous ont fait confiance pour leurs créations végétales.",
      tag: "leurs créations végétales",
      items: clientsCouleur,
    },
    {
      // Avis de la maquette (frames 36 et 37) : le même avis fictif que Bureaux, à remplacer avant la mise en ligne (`fictif`, point 4 des points à
      // valider V6). Flèches visibles et inertes avec un seul avis, logo du client après le poste (`bx`). L'avis n'est pas épinglé ici : la FAQ qui
      // le suit n'a rien à recouvrir.
      type: "testimonials",
      bx: true,
      items: [avisFictif],
    },
    {
      type: "faq",
      label: "FAQ",
      title: "Les questions qu'on nous pose fréquemment.",
      tag: "fréquemment",
      items: [
        {
          q: "Combien coûte un mur végétal à Paris ?",
          a: "Le prix dépend de la surface, du type de végétaux et de la complexité de l'installation. On établit systématiquement un devis personnalisé après échange sur votre projet. N'hésitez pas à nous contacter pour avoir une première estimation.",
        },
        {
          q: "Un mur végétal stabilisé, ça dure combien de temps ?",
          a: "Entre 5 et 10 ans selon les conditions d'exposition. Il ne supporte pas la lumière directe du soleil ni l'humidité excessive. Dans un intérieur sec et sans lumière directe, il garde son aspect naturel pendant de nombreuses années sans aucune intervention.",
        },
        {
          q: "On peut installer un mur dans un espace sans lumière ?",
          a: "Oui, c'est même l'un des grands avantages du stabilisé et de l'artificiel. Couloirs, bureaux en sous-sol, espaces uniquement en lumière artificielle : le mur végétal ne pose aucun problème.",
        },
        {
          q: "Quelle différence concrète entre stabilisé et artificiel ?",
          a: "Le stabilisé, c'est une vraie plante transformée : aspect et toucher naturels, palette de couleurs limitée (principalement des verts). L'artificiel, c'est fabriqué : liberté totale sur les couleurs et les formes, mais texture moins naturelle au toucher. Les deux ne nécessitent aucun entretien.",
        },
        {
          q: "Vous faites vraiment des logos végétalisés sur mesure ?",
          a: "Oui. Transmettez-nous votre logo et les dimensions souhaitées, on vous propose une conception sur mesure.",
        },
      ],
    },
    {
      type: "cta-final",
      variant: "design",
      title: "Vous avez un projet de tableau, de mur, de logo ou de suspension végétale ? Discutons-en.",
      tag: "Discutons-en",
      cta: "Demander un devis",
      // Pas de ligne de téléphone : la maquette n'en montre pas (frames 41 à 44), les coordonnées sont dans le footer et le menu.
    },
  ],
};
