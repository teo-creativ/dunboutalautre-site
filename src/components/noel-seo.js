// Title, description, canonical, Open Graph et données structurées FAQPage de la landing Noël. Tout vient de src/data/noel.js :
// la FAQ du JSON-LD est la même que celle affichée dans la page.
import { noel } from "../data/noel.js";
import { site } from "../data/site.js";
import { esc } from "./utils.js";

const url = `${noel.origin}${noel.path}`;
const image = `${noel.origin}/assets/images/${noel.photos.arche.src}.jpg`;

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: noel.faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

// « < » est échappé pour qu'aucun texte ne puisse refermer la balise script.
const json = JSON.stringify(faqPage).replace(/</g, "\\u003c");

export default () => `<title>${esc(noel.title)}</title>
    <meta name="description" content="${esc(noel.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="${esc(site.name)}" />
    <meta property="og:title" content="${esc(noel.title)}" />
    <meta property="og:description" content="${esc(noel.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${esc(noel.photos.arche.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${json}</script>
    <noscript><style>.faq__panel[hidden] { display: block; } .faq__icon { display: none; }</style></noscript>`;
