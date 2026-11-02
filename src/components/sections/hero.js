// Hero d'une page secondaire : même motif que la landing Noël (fond de feuilles, H1 avec un title tag, sous-titre, CTA), sans photo.
// src/scripts/intro.js anime ce hero : il attend .hero__bg, .hero__title et .hero__inner .cta. Un lien secondaire (« Voir nos
// réalisations ») n'est pas un .cta : page.css le fait apparaître en fondu, en phase avec le CTA. `compact` : hero plus bas, sans CTA
// (Contact, Réalisations, Blog) ; intro.js n'anime alors que le titre, le sous-titre et les feuilles.
// `keywords` : la ligne de mots-clés de l'accueil (ul.hero__tagline, que intro.js fait apparaître en fondu). `bx` : hero de la page
// Bureaux V5, qui s'estompe sous la section crème (scripts/bureaux-hero.js) ; il porte data-bx, qui charge ce chunk.
import { cta } from "../cta.js";
import { linkTo } from "../links.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

export default ({ title, tag, lead, cta: label, secondary, compact = false, keywords, bx = false }) => {
  const primary = label ? cta({ label, variant: "on-olive" }) : "";
  const link = secondary ? `<a class="hero__link" href="${esc(linkTo(secondary.to))}">${esc(fr(secondary.label))}</a>` : "";
  const tagline = keywords?.length ? `<ul class="hero__tagline">${keywords.map((word) => `<li>${esc(word)}</li>`).join("")}</ul>\n          ` : "";
  return `<section id="hero" class="hero hero--noel hero--page${compact ? " hero--compact" : ""}${bx ? " hero--bx" : ""}"${bx ? ' data-bx="hero"' : ""}>
        <div class="hero__bg" aria-hidden="true"><div class="hero__leaves"><span></span></div></div>
        <div class="hero__inner">
          ${tagline}<h1 class="hero__title">${titleHtml(title, tag)}</h1>
          ${lead ? `<p class="hero__lead">${frText(lead)}</p>` : ""}
          ${secondary ? `<div class="hero__actions">${primary}${link}</div>` : primary}
        </div>
      </section>`;
};
