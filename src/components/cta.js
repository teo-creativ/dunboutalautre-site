// Bouton CTA en pilule. Variantes : on-olive, on-orange, on-cream (voir DESIGN.md §5.2).
// Le remplissage animé au survol est ajouté au prompt 03, dans ce seul fichier.
import { site, href } from "../data/site.js";
import { esc } from "./utils.js";

export const cta = ({ label, variant = "on-olive", href: to, tag = "a", className = "", attrs = "" }) => {
  const classes = `cta${className ? ` ${className}` : ""}`;
  const target = tag === "a" ? ` href="${esc(to ?? href(site.contact))}"` : ' type="button"';
  return `<${tag} class="${classes}" data-variant="${variant}"${target}${attrs ? ` ${attrs}` : ""}><span class="cta__dot" aria-hidden="true"></span><span class="cta__text">${esc(label)}</span></${tag}>`;
};

// Utilisable dans une page : <!--@cta label="Discutons de votre projet" variant="on-olive"-->
export default (props) => cta(props);
