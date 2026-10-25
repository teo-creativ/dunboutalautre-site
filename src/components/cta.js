// Bouton CTA en pilule. Variantes : on-olive, on-orange, on-cream (voir DESIGN.md §5.2).
// Deux couches au même contenu : la base, et un calque de remplissage (aria-hidden) que src/scripts/cta.js révèle
// en cercle depuis le point au survol. Le texte est dupliqué pour rester parfaitement aligné entre les deux couches.
import { site, href } from "../data/site.js";
import { esc } from "./utils.js";

const layer = (kind, label, hidden) =>
  `<span class="cta__layer cta__layer--${kind}"${hidden ? ' aria-hidden="true"' : ""}><span class="cta__dot"></span><span class="cta__text">${esc(label)}</span></span>`;

export const cta = ({ label, variant = "on-olive", href: to, tag = "a", className = "", attrs = "" }) => {
  const classes = `cta${className ? ` ${className}` : ""}`;
  const target = tag === "a" ? ` href="${esc(to ?? href(site.contact))}"` : ' type="button"';
  return `<${tag} class="${classes}" data-variant="${variant}"${target}${attrs ? ` ${attrs}` : ""}>${layer("base", label)}${layer("fill", label, true)}</${tag}>`;
};

// Utilisable dans une page : <!--@cta label="Discutons de votre projet" variant="on-olive"-->
export default (props) => cta(props);
