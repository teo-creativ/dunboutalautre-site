// Article modèle du blog : « Végétaliser ses bureaux à Paris : tout ce qu'il faut savoir avant de se lancer » (article 1 de lancement,
// docs/copywriting/11-blog.md et docs/arborescence-et-strategie.md, qui le relie à la page Végétalisation de bureaux). Seul le titre est
// connu : auteur, date, temps de lecture, photo, chapô, corps et meta sont à fournir (todo), aucun texte d'article n'est inventé. Le title
// est « <titre> | <site> » (titlePrefix). Les libellés de navigation et de métadonnées sont de la microcopie (`micro`), à valider.
import { todo } from "../../components/placeholder.js";

export const articleVegetaliserBureaux = {
  id: "article-bureaux",
  path: "/blog/vegetaliser-bureaux-paris-guide/",
  source: "11-blog.md",
  titlePrefix: "Végétaliser ses bureaux à Paris : tout ce qu'il faut savoir avant de se lancer",
  description: todo("meta description de l'article"),
  sections: [
    {
      type: "hero",
      compact: true,
      title: "Végétaliser ses bureaux à Paris : tout ce qu'il faut savoir avant de se lancer",
      tag: "tout ce qu'il faut savoir",
      lead: todo("chapô de l'article"),
    },
    {
      type: "article-body",
      photo: null,
      meta: { author: todo("auteur"), date: todo("date de publication"), reading: todo("temps de lecture") },
      body: [
        { heading: todo("intertitre 1"), text: todo("paragraphe 1") },
        { heading: todo("intertitre 2"), text: todo("paragraphe 2") },
        { heading: todo("intertitre 3"), text: todo("paragraphe 3") },
      ],
      service: { label: "Végétalisation de bureaux", to: "/vegetalisation-bureaux-paris/" },
      micro: {
        back: { label: "Tous les articles", to: "/blog/" },
        meta: { author: "Auteur", date: "Publié le", reading: "Temps de lecture" },
        serviceLead: "Page de service liée :",
      },
    },
    {
      type: "cta-final",
      title: "Vous avez un projet ? On en discute.",
      tag: "On en discute",
      cta: "Demander un devis",
    },
  ],
};
