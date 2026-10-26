// Title tag en vraie pilule (voir styles/tag.css). Une seule source du balisage pour toutes les pages :
// <!--@tag text="votre espace" variant="orange"--> suivi directement de la ponctuation, sans espace.
// variant : "cream" (fond crème, texte orange, -2°) ou "orange" (fond orange, texte crème, +2°).
import { esc } from "./utils.js";

export const tag = ({ text, variant = "orange" }) =>
  `<span class="tag tag--${variant}"><span class="tag__bg" aria-hidden="true"></span><span class="tag__text">${esc(text)}</span></span>`;

export default (props) => tag(props);
