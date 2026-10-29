// Hero d'une page secondaire : même motif que la landing Noël (fond de feuilles, H1 avec un title tag, sous-titre, CTA), sans photo.
// src/scripts/intro.js anime ce hero : il attend .hero__bg, .hero__title et .hero__inner .cta. Un lien secondaire (« Voir nos
// réalisations ») n'est pas un .cta : page.css le fait apparaître en fondu, en phase avec le CTA. `compact` : hero plus bas, sans CTA
// (Contact, Réalisations, Blog) ; intro.js n'anime alors que le titre, le sous-titre et les feuilles.
import { cta } from "../cta.js";
import { linkTo } from "../links.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

export default ({ title, tag, lead, cta: label, secondary, compact = false }) => {
  const primary = label ? cta({ label, variant: "on-olive" }) : "";
  const link = secondary ? `<a class="hero__link" href="${esc(linkTo(secondary.to))}">${esc(fr(secondary.label))}</a>` : "";
  return `<section id="hero" class="hero hero--noel hero--page${compact ? " hero--compact" : ""}">
        <div class="hero__bg" aria-hidden="true"><div class="hero__leaves"><span></span></div></div>
        <div class="hero__inner">
          <h1 class="hero__title">${titleHtml(title, tag)}</h1>
          ${lead ? `<p class="hero__lead">${esc(fr(lead))}</p>` : ""}
          ${secondary ? `<div class="hero__actions">${primary}${link}</div>` : primary}
        </div>
      </section>`;
};
