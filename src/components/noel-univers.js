// Nos univers : bloc provisoire du prompt 04 (cream, label et photo-carte), qui arrive par la droite sur l'orange. Le prompt 05 le
// remplace par la vraie section (titre, liste des cinq univers, survol).
import { noel } from "../data/noel.js";
import img from "./img.js";

export default () => `<section id="univers" class="univers" aria-labelledby="univers-label">
        <div class="univers__inner">
          <figure class="univers__card">${img({ src: noel.univers.photo.src, alt: noel.univers.photo.alt, sizes: "(min-width: 901px) 36vw, 90vw" })}</figure>
          <h2 class="label" id="univers-label"><span class="label__dot" aria-hidden="true"></span>${noel.univers.label}</h2>
        </div>
      </section>`;
