// Liens internes des pages secondaires. Le chemin vient du copywriting (ou de l'arborescence) ; l'URL rendue suit la règle de tout le
// site (src/data/site.js, href()) : « # » tant que la page cible n'est pas `live`, son chemin ensuite. Un chemin inconnu de site.js
// (fiche projet, article) est « # » sauf si sa page le déclare `live` dans src/data/pages/.
import { href, site } from "../data/site.js";
import { pages } from "../data/pages/index.js";

const withSlash = (path) => (path.endsWith("/") ? path : `${path}/`);
const entries = [...site.nav, ...site.services, ...site.menuServices].filter((item) => item.path);

export const linkTo = (path) => {
  const wanted = withSlash(path);
  const entry = entries.find((item) => withSlash(item.path) === wanted);
  if (entry) return href(entry);
  const page = Object.values(pages).find((p) => withSlash(p.path) === wanted);
  return page?.live ? page.path : "#";
};
