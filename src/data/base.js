// Préfixe de déploiement du site (GitHub Pages : /dunboutalautre-site/). Lu dans la variable d'environnement VITE_BASE au build (la valeur par
// défaut est "/", le build et le dev local sont alors strictement ceux d'avant). Les composants sont rendus par Node : process.env y existe.
// Vite préfixe seul les images, scripts, feuilles de style et url() du CSS ; ce fichier sert aux liens internes écrits à la main par les
// composants (href() de site.js, linkTo de links.js, logo du header).
const raw = (typeof process !== "undefined" && process.env?.VITE_BASE) || "/";
const slashed = raw.endsWith("/") ? raw : `${raw}/`;

export const base = slashed.startsWith("/") ? slashed : `/${slashed}`;

// "/realisations/" devient "/dunboutalautre-site/realisations/" ; "#", les URL complètes et les chemins relatifs restent tels quels.
export const withBase = (path) => (typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? base + path.slice(1) : path);
