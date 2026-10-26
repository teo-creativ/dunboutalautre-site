// Footer sur fond olive. En desktop il est fixé derrière le contenu, qui se décolle pour le révéler (footer-reveal.js ; la classe
// footer-reveal est posée dès le <head>, voir components/head.js).
import { site, href } from "../data/site.js";
import { cta } from "./cta.js";
import { esc } from "./utils.js";
import { wordmark } from "./logo.js";
import { tag } from "./tag.js";

const nav = site.nav.map((item) => `<li><a href="${esc(href(item))}">${esc(item.label)}</a></li>`).join("\n              ");

export default () => `<footer class="footer" id="footer">
      <div class="footer__main">
        <div class="footer__top">
          <h2 class="footer__title">Parlons de votre espace ${tag({ text: "ensemble", variant: "orange" })}.</h2>
          ${cta({ label: "Parlons de votre projet", variant: "on-olive" })}
        </div>
        <div class="footer__mid">
          <address class="footer__contact">
            <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
            <a href="${esc(site.phone.href)}">${esc(site.phone.display)}</a>
          </address>
          <nav class="footer__nav" aria-label="Pied de page">
            <ul>
              ${nav}
            </ul>
          </nav>
        </div>
        <div class="footer__bottom">
          <p>${esc(site.copyright)}</p>
          <p>${esc(site.zone)}</p>
          <a href="${esc(site.instagram.href)}" target="_blank" rel="noopener" aria-label="Instagram : ${esc(site.instagram.label)} (nouvel onglet)">${esc(site.instagram.label)}</a>
        </div>
      </div>
      <div class="footer__wordmark">${wordmark("footer__wordmark-svg")}</div>
    </footer>`;
