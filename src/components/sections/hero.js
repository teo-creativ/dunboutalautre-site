// Hero d'une page secondaire : même motif que la landing Noël (fond de feuilles, H1 avec un title tag, sous-titre, CTA), sans photo.
// Le tag est une sous-chaîne exacte du titre : la phrase du copywriting n'est jamais modifiée (contrôlé par scripts/check-site.js).
// src/scripts/intro.js anime ce hero : il attend .hero__bg, .hero__title et .hero__inner .cta.
import { cta } from "../cta.js";
import { tag } from "../tag.js";
import { esc, fr } from "../utils.js";

export default ({ title, tag: tagText, lead, cta: label }) => {
  const at = tagText ? title.indexOf(tagText) : -1;
  const heading =
    at < 0
      ? esc(fr(title))
      : `${esc(fr(title.slice(0, at)))}${tag({ text: tagText, variant: "orange" })}${esc(fr(title.slice(at + tagText.length)))}`;
  return `<section id="hero" class="hero hero--noel hero--page">
        <div class="hero__bg" aria-hidden="true"><div class="hero__leaves"><span></span></div></div>
        <div class="hero__inner">
          <h1 class="hero__title">${heading}</h1>
          ${lead ? `<p class="hero__lead">${esc(fr(lead))}</p>` : ""}
          ${label ? cta({ label, variant: "on-olive" }) : ""}
        </div>
      </section>`;
};
