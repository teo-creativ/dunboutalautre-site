// Timeline en 5 étapes. La ligne et les points sont dessinés au scroll par src/scripts/process.js.
import { noel } from "../data/noel.js";
import { esc } from "./utils.js";

const step = (s) => `<li class="step">
          <span class="step__dot" aria-hidden="true"></span>
          <div class="step__body">
            <p class="step__n" aria-hidden="true">${s.n}</p>
            <h3 class="step__title">${esc(s.title)}</h3>
            <p class="step__text">${esc(s.text)}</p>
          </div>
        </li>`;

export default () => `<div class="process__timeline">
        <span class="process__line" aria-hidden="true"><span class="process__line-fill"></span></span>
        <ol class="process__steps">
        ${noel.steps.map(step).join("\n        ")}
        </ol>
      </div>`;
