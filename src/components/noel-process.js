// Notre fonctionnement (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md §5, retours-v3/docs/02-FONCTIONNEMENT-TIMELINE.md) : titre à gauche
// (sticky sur ordinateur), timeline verticale à droite avec sa ligne de progression et ses cinq étapes, générées depuis src/data/noel.js.
// Toutes les étapes sont dans le flux, les unes sous les autres, chacune avec sa pastille sur la ligne. La pastille est sable avec une
// couche orange par-dessus : sans animation (mouvement réduit, JavaScript absent) la couche est visible, la ligne est pleine et les
// pastilles sont orange. process.js pilote la ligne, les pastilles et l'arrivée des étapes au scroll.
// processSection() rend n'importe quelle démarche (titre déjà balisé, étapes) pour les pages secondaires ; l'export par défaut rend
// celle de Noël, octet pour octet comme avant.
import { noel } from "../data/noel.js";
import { esc, fr } from "./utils.js";
import { tag } from "./tag.js";

const { label, steps } = noel.process; // valeurs par défaut : la démarche de la landing Noël

const renderSteps = (steps) =>
  steps
    .map(
      (s) => `<li class="step">
            <span class="step__dot" aria-hidden="true"><span class="step__dot-on"></span></span>
            <div class="step__body">
              <h3 class="step__title">${esc(s.title)}</h3>
              <p class="step__desc">${esc(fr(s.text))}</p>
            </div>
          </li>`,
    )
    .join("\n          ");

export const processSection = ({ label, titleHtml, steps }) => `<section id="fonctionnement" class="process" data-header-theme="light" data-header-gradient="cream" aria-labelledby="process-title">
        <div class="process__head">
          <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="section-title process__title" id="process-title">${titleHtml}</h2>
        </div>
        <ol class="process__timeline" role="list">
          <li class="process__line" aria-hidden="true"><span class="process__fill"></span></li>
          ${renderSteps(steps)}
        </ol>
      </section>`;

export default () =>
  processSection({ label, titleHtml: `Du premier ${tag({ text: "échange", variant: "orange" })} au démontage.`, steps });
