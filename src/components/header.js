// Header fixe : logo à gauche, bouton Menu à droite. L'ouverture du menu est branchée au prompt 04.
import { site } from "../data/site.js";
import { cta } from "./cta.js";
import { esc } from "./utils.js";
import { wordmark } from "./logo.js";

export default () => `<header class="header" id="header">
      <a class="header__logo" href="/" aria-label="${esc(site.name)}, accueil">${wordmark("header__logo-svg")}</a>
      ${cta({ label: "Menu", tag: "button", className: "header__menu", attrs: 'aria-expanded="false"' })}
    </header>`;
