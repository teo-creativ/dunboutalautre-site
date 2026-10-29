// Hero d'une page secondaire : même motif que la landing Noël (fond de feuilles, H1 avec un title tag, sous-titre, CTA), sans photo.
// src/scripts/intro.js anime ce hero : il attend .hero__bg, .hero__title et .hero__inner .cta.
import { cta } from "../cta.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

export default ({ title, tag, lead, cta: label }) =>
  `<section id="hero" class="hero hero--noel hero--page">
        <div class="hero__bg" aria-hidden="true"><div class="hero__leaves"><span></span></div></div>
        <div class="hero__inner">
          <h1 class="hero__title">${titleHtml(title, tag)}</h1>
          ${lead ? `<p class="hero__lead">${esc(fr(lead))}</p>` : ""}
          ${label ? cta({ label, variant: "on-olive" }) : ""}
        </div>
      </section>`;
