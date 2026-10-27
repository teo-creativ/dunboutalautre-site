// Notre fonctionnement (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md §5, retours-v3/docs/02-FONCTIONNEMENT-TIMELINE.md) : titre à gauche,
// timeline verticale à droite avec sa ligne de progression et ses cinq étapes, générées depuis src/data/noel.js. Chaque étape porte son
// point et son rang (--i, sur --n étapes) : sans animation, les étapes se suivent en liste ; avec (process.js), elles sont empilées dans la
// même zone, un seul point par rang le long de la ligne, et une seule étape à la fois est visible. L'état de chaque étape (atteinte,
// courante) est piloté par process.js ; sans lui, la ligne et toutes les étapes sont affichées en entier.
import { noel } from "../data/noel.js";
import { esc, fr } from "./utils.js";
import { tag } from "./tag.js";

const { label, steps } = noel.process;

const items = steps
  .map(
    (s, i) => `<li class="step" style="--i: ${i}">
            <span class="step__dot" aria-hidden="true"></span>
            <div class="step__body">
              <h3 class="step__title"><span class="step__name">${esc(s.title)}<span class="uline" aria-hidden="true"></span></span></h3>
              <p class="step__desc">${esc(fr(s.text))}</p>
            </div>
          </li>`,
  )
  .join("\n          ");

export default () => `<section id="fonctionnement" class="process" style="--n: ${steps.length}" data-header-theme="light" data-header-gradient="cream" aria-labelledby="process-title">
        <div class="process__head">
          <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="section-title process__title" id="process-title">Du premier ${tag({ text: "échange", variant: "orange" })} au démontage.</h2>
        </div>
        <ol class="process__timeline" role="list">
          <li class="process__line" aria-hidden="true"><span class="process__fill"></span></li>
          ${items}
        </ol>
      </section>`;
