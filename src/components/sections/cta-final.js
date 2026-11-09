// Bandeau final orange (même balisage et mêmes classes que la landing Noël, dont le CSS est réutilisé tel quel) : titre avec title tag,
// CTA on-orange, et le téléphone que le copywriting ajoute en fin de page (valeur à confirmer : [À compléter]). `variant` : jeu de mesures propre
// à une page (data-bx-variant, V6 : « design », styles/page.css) ; l'animation (titre, boutons) est celle de Noël, inchangée. V8 : `reveal` (Ateliers) la remplace par reveal-on-enter (scripts/reveal-on-enter.js).
import { cta } from "../cta.js";
import { leaf } from "../leaf.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { fr, esc } from "../utils.js";

export default ({ title, tag, cta: label, phone, variant, reveal }) =>
  `<section id="devis" class="cta-final"${reveal ? ' data-reveal="enter" data-reveal-start="top 70%"' : ""}${variant ? ` data-bx-variant="${esc(variant)}"` : ""} data-header-gradient="orange" aria-labelledby="cta-final-title">
        ${leaf("cta-final__leaf")}
        <div class="cta-final__inner">
          <h2 class="cta-final__title" id="cta-final-title"${reveal ? ' data-reveal-part="title"' : ' data-reveal="title"'}>${titleHtml(title, tag, "cream")}</h2>
          <div class="cta-final__actions"${reveal ? ' data-reveal-part="cta"' : ' data-reveal="up"'}>
            ${cta({ label, variant: "on-orange" })}
            ${phone ? `<p class="cta-final__phone">${esc(fr(phone.label))} ${frText(phone.value)}</p>` : ""}
          </div>
        </div>
      </section>`;
