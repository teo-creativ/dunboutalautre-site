// Démarche d'une page secondaire : la timeline de la landing Noël (ligne de progression, pastilles, étapes qui montent au scroll),
// appelée avec les étapes de la page. L'id « fonctionnement » est imposé par src/scripts/process.js : une seule démarche par page.
// `more` : lien vers une autre page (CTA on-cream) sous la timeline, sur le fond crème de la section.
import { cta } from "../cta.js";
import { linkTo } from "../links.js";
import { processSection } from "../noel-process.js";
import { titleHtml } from "../title.js";

export default ({ label, title, tag, steps, more }) =>
  processSection({ label, titleHtml: titleHtml(title, tag), steps }) +
  (more
    ? `\n      <div class="more" data-header-theme="light" data-header-gradient="cream">${cta({ label: more.label, variant: "on-cream", href: linkTo(more.to) })}</div>`
    : "");
