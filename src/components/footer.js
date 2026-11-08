// Footer V2 (retours-v2 03, design footer-v2-design.png) : titre et CTA à gauche, wordmark en bas, trois colonnes de liens à
// droite, barre basse. Une seule source pour toutes les pages. En desktop il est fixé derrière le contenu, qui se décolle pour
// le révéler (footer-reveal.js ; la classe footer-reveal est posée dès le <head>, voir components/head.js).
// Les liens viennent de src/data/site.js, comme ceux du menu.
import { site, href } from "../data/site.js";
import { cta } from "./cta.js";
import { esc } from "./utils.js";
import { wordmark } from "./logo.js";
import { tag } from "./tag.js";

// Picto de 16 px en currentColor : un carré arrondi pour Instagram (le seul réseau du footer depuis la V8).
const icons = {
  instagram: `<svg class="footer__icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true" focusable="false"><rect x="1.6" y="1.6" width="12.8" height="12.8" rx="3.6"/><circle cx="8" cy="8" r="3.1"/><circle cx="11.8" cy="4.2" r="0.5" fill="currentColor" stroke="none"/></svg>`,
};

const link = (item, extra = "") => `<a class="footer__link" href="${esc(href(item))}"${extra}>${esc(item.label)}</a>`;
const external = (item) =>
  `<a class="footer__link footer__link--social" href="${esc(item.href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(item.label)} (nouvel onglet)">${icons[item.icon]}<span>${esc(item.label)}</span></a>`;
const list = (items, render) => `<ul>\n              ${items.map((item) => `<li>${render(item)}</li>`).join("\n              ")}\n            </ul>`;

// Colonne NAVIGATION : les entrées de la navigation sans « Services », qui a sa propre colonne.
const navigation = site.nav.filter((item) => !item.children);

export default () => `<footer class="footer" id="footer">
      <div class="footer__top">
        <div class="footer__main">
          <div class="footer__intro">
            <h2 class="footer__title">Parlons de ${tag({ text: "votre espace", variant: "orange" })} ensemble.</h2>
            ${cta({ label: "Discutons de votre projet", variant: "on-olive" })}
          </div>
          <nav class="footer__cols" aria-label="Pied de page">
            <div class="footer__col">
              <h3 class="footer__label">Services</h3>
              ${list(site.menuServices, link)}
            </div>
            <div class="footer__col">
              <h3 class="footer__label">Navigation</h3>
              ${list(navigation, link)}
            </div>
            <div class="footer__col">
              <h3 class="footer__label">Réseaux</h3>
              ${list(site.social, external)}
            </div>
          </nav>
          <div class="footer__wordmark">${wordmark("footer__wordmark-svg")}</div>
        </div>
      </div>
      <div class="footer__bar">
        <p>${esc(site.copyright)}</p>
        <ul class="footer__legal">
          ${site.legal.map((item) => `<li>${link(item)}</li>`).join("\n          ")}
        </ul>
      </div>
    </footer>`;
