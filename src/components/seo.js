// Title, description, canonical et Open Graph d'une page secondaire, depuis src/data/pages/<page>.js (comme noel-seo.js pour Noël, qui
// reste intact). <!--@seo page="terrasses"-->. Pas d'image de partage : aucune n'est fournie pour ces pages.
// Une page qui a une FAQ reçoit aussi le JSON-LD FAQPage, tiré des mêmes questions et réponses que la section affichée (hors réponses
// à compléter : un placeholder n'entre pas dans les données structurées).
import { origin, pages } from "../data/pages/index.js";
import { site } from "../data/site.js";
import { esc } from "./utils.js";

export default ({ page }) => {
  const data = pages[page];
  if (!data) throw new Error(`seo : page « ${page} » absente de src/data/pages/index.js`);
  const url = `${origin}${data.path}`;
  const faq = data.sections.find((section) => section.type === "faq");
  // « < » est échappé pour qu'aucun texte ne puisse refermer la balise script.
  const json = faq
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.items.filter(({ a }) => typeof a === "string").map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      }).replace(/</g, "\\u003c")
    : "";
  const interactive = data.sections.some((section) => section.type === "faq" || section.type === "testimonials");
  return `<title>${esc(data.title)}</title>
    <meta name="description" content="${esc(data.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="${esc(site.name)}" />
    <meta property="og:title" content="${esc(data.title)}" />
    <meta property="og:description" content="${esc(data.description)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary" />${faq ? `\n    <script type="application/ld+json">${json}</script>` : ""}${
      interactive ? `\n    <noscript><style>.faq__panel[hidden], .testi__slide[hidden] { display: block; } .faq__chev { display: none; }</style></noscript>` : ""
    }`;
};
