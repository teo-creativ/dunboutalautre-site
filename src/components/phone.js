// Lien téléphone, numéro unique défini dans src/data/site.js. <!--@phone class="hero__phone"-->
import { site } from "../data/site.js";
import { esc } from "./utils.js";

export default ({ class: className = "" } = {}) =>
  `<a class="phone${className ? ` ${className}` : ""}" href="${esc(site.phone.href)}">${esc(site.phone.display)}</a>`;
