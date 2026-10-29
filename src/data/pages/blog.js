// Page Blog (index) : textes de docs/copywriting/11-blog.md (premier jet, à retravailler avec la cliente), title et meta de
// docs/arborescence-et-strategie.md. Les 4 articles de lancement ont leur titre et leur URL ; photo, date et extrait sont à fournir (todo).
// Pas de filtres par thème : le copywriting les juge optionnels « si assez d'articles », et il y en a 4. Un seul article a une page (le modèle,
// T28) ; les autres cartes pointent vers « # ». Libellés des liens : docs/arborescence-et-strategie.md.
import { todo } from "../../components/placeholder.js";

export const blog = {
  id: "blog",
  path: "/blog/",
  source: "11-blog.md",
  title: "Blog végétal : conseils & inspirations | D'un Bout À L'autre",
  description:
    "Conseils, guides et inspirations sur la végétalisation de bureaux, le design végétal, les décors d'événements et de Noël. Le blog de D'un Bout À L'autre.",
  sections: [
    {
      type: "hero",
      compact: true,
      title: "Le blog de D'un Bout À L'autre",
      tag: "D'un Bout À L'autre",
      lead: "Conseils, guides et inspirations autour du végétal, de la scénographie et de la décoration saisonnière.",
    },
    {
      type: "articles",
      featuredLabel: "ARTICLE MIS EN AVANT",
      gridLabel: "LES 4 ARTICLES DE LANCEMENT",
      readFeatured: "Lire l'article",
      readMore: "Lire la suite",
      items: [
        {
          title: "Végétaliser ses bureaux à Paris : tout ce qu'il faut savoir avant de se lancer",
          path: "/blog/vegetaliser-bureaux-paris-guide/",
          date: todo("date de publication"),
          excerpt: todo("extrait de l'article"),
          photo: null,
        },
        {
          title: "Team building à Paris : 5 idées d'ateliers végétaux pour fédérer vos équipes",
          path: "/blog/team-building-nature-paris-ateliers-vegetaux/",
          date: todo("date de publication"),
          excerpt: todo("extrait de l'article"),
          photo: null,
        },
        {
          title: "Pourquoi les plantes en open space améliorent la concentration (et comment bien les choisir)",
          path: "/blog/plantes-open-space-productivite-bien-etre/",
          date: todo("date de publication"),
          excerpt: todo("extrait de l'article"),
          photo: null,
        },
        {
          title: "Quelles plantes choisir pour des bureaux sans lumière naturelle ?",
          path: "/blog/plantes-bureaux-sans-lumiere/",
          date: todo("date de publication"),
          excerpt: todo("extrait de l'article"),
          photo: null,
        },
      ],
    },
    {
      type: "cta-final",
      title: "Vous avez un projet ? On en discute.",
      tag: "On en discute",
      cta: "Demander un devis",
    },
  ],
};
