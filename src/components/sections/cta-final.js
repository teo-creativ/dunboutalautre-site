// Bandeau final orange (même balisage et mêmes classes que la landing Noël, dont le CSS est réutilisé tel quel) : titre avec title tag,
// CTA on-orange, et le téléphone que le copywriting ajoute en fin de page (valeur à confirmer : [À compléter]).
import { cta } from "../cta.js";
import { leaf } from "../leaf.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { fr, esc } from "../utils.js";

export default ({ title, tag, cta: label, phone }) =>
  `<section id="devis" class="cta-final" data-header-gradient="orange" aria-labelledby="cta-final-title">
        ${leaf("cta-final__leaf")}
        <div class="cta-final__inner">
          <h2 class="cta-final__title" id="cta-final-title" data-reveal="title">${titleHtml(title, tag, "cream")}</h2>
          <div class="cta-final__actions" data-reveal="up">
            ${cta({ label, variant: "on-orange" })}
            ${phone ? `<p class="cta-final__phone">${esc(fr(phone.label))} ${frText(phone.value)}</p>` : ""}
          </div>
        </div>
      </section>`;
