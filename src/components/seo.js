// Title, description, canonical et Open Graph d'une page secondaire, depuis src/data/pages/<page>.js (comme noel-seo.js pour Noël, qui
// reste intact). <!--@seo page="terrasses"-->. Pas d'image de partage : aucune n'est fournie pour ces pages.
import { origin, pages } from "../data/pages/index.js";
import { site } from "../data/site.js";
import { esc } from "./utils.js";

export default ({ page }) => {
  const data = pages[page];
  if (!data) throw new Error(`seo : page « ${page} » absente de src/data/pages/index.js`);
  const url = `${origin}${data.path}`;
  return `<title>${esc(data.title)}</title>
    <meta name="description" content="${esc(data.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="${esc(site.name)}" />
    <meta property="og:title" content="${esc(data.title)}" />
    <meta property="og:description" content="${esc(data.description)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary" />`;
};
