// FAQ (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md §7, frame noel-page-17), générée depuis src/data/noel.js : titre et carte d'aide à
// gauche, accordéon de cartes blanches à droite. Un bouton par question (aria-expanded, aria-controls), un panneau par réponse
// (role region, aria-labelledby). Un seul panneau est ouvert à la fois, le premier d'emblée : les autres portent hidden. Sans
// JavaScript, toutes les réponses sont affichées (feuille <noscript> de noel-seo.js). Le JSON-LD FAQPage vient des mêmes données.
import { noel } from "../data/noel.js";
import { esc, fr } from "./utils.js";
import { cta } from "./cta.js";
import { tag } from "./tag.js";

const { label, help, items } = noel.faq;

const chevron = `<svg viewBox="0 0 14 8" width="14" height="8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M1.5 1.5 7 6.5l5.5-5"/></svg>`;

const list = items
  .map(
    ({ q, a }, i) => `<li class="faq__item" data-reveal="up" data-reveal-y="24" data-reveal-step="0.07">
            <h3 class="faq__q"><button class="faq__trigger" type="button" id="faq-q-${i}" aria-expanded="${i === 0}" aria-controls="faq-a-${i}"><span class="faq__q-text">${esc(fr(q))}</span><span class="faq__chev" aria-hidden="true">${chevron}</span></button></h3>
            <div class="faq__panel" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"${i ? " hidden" : ""}><div class="faq__answer"><p>${esc(fr(a))}</p></div></div>
          </li>`,
  )
  .join("\n          ");

export default () => `<section id="faq" class="faq" data-header-theme="light" data-header-gradient="cream" aria-labelledby="faq-title">
        <div class="faq__inner">
          <div class="faq__intro">
            <div class="faq__head" data-reveal="head">
              <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
              <h2 class="section-title faq__title" id="faq-title">Les questions qu'on nous pose ${tag({ text: "fréquemment", variant: "orange" })}.</h2>
            </div>
            <aside class="faq__help" data-reveal="up" aria-labelledby="faq-help-title">
              <h3 class="faq__help-title" id="faq-help-title">${esc(fr(help.title))}</h3>
              <p class="faq__help-text">${esc(fr(help.text))}</p>
              ${cta({ label: help.cta, variant: "solid" })}
            </aside>
          </div>
          <ul class="faq__list">
          ${list}
          </ul>
        </div>
      </section>`;
