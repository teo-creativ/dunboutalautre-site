// Les 3 cartes de chiffres clés, générées depuis src/data/site.js.
// Le signe (+, %) et l'unité (ans) sont en orange, le nombre seul reste en olive (frame de référence).
import { site } from "../data/site.js";
import { esc } from "./utils.js";

const card = ({ value, prefix, suffix, text }, i) => {
  const unit = suffix.trim();
  const isWord = /[a-z]/i.test(unit);
  return `<li class="stat-card stat-card--${i + 1}">
          <p class="stat-card__num">${prefix ? `<span class="stat-card__sign">${esc(prefix)}</span>` : ""}<span class="stat-card__value" data-value="${value}">${value}</span>${unit ? `<span class="${isWord ? "stat-card__unit" : "stat-card__sign"}">${esc(unit)}</span>` : ""}</p>
          <p class="stat-card__text">${esc(text)}</p>
        </li>`;
};

export default () => `<ul class="stats__cards">
        ${site.stats.map(card).join("\n        ")}
      </ul>`;
