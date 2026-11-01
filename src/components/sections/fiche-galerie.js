// Galerie de la fiche projet (V4) : deux photos côte à côte, puis une large. Sur ordinateur, la photo de gauche se révèle avant celle de droite et
// leurs parallaxes vont en sens opposés (src/scripts/fiche.js) ; sous 900 px elles passent sur une colonne (fiche.css).
import { figure } from "./fiche-photo.js";

export default ({ photos }, { index }) => {
  const [left, right, wide] = photos;
  const make = (photo, className) => figure({ photo, frame: photo.frame, className });
  return `<section class="fgallery" data-header-theme="light" data-header-gradient="cream" aria-label="Galerie du projet" id="fgallery-${index}">
        <div class="fgallery__row">
          ${make(left, "fphoto--left")}
          ${make(right, "fphoto--right")}
        </div>
        ${make(wide, "fphoto--wide")}
      </section>`;
};
