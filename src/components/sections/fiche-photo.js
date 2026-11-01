// Photo de la fiche projet : un cadre aux coins arrondis (clip-path et overflow), et dedans l'image, plus haute que lui (115 %) pour que la
// parallaxe de src/scripts/fiche.js ne laisse jamais de bande vide. `frame` est le cadre de la maquette (largeur / hauteur) : le cadre garde
// ses proportions même si la photo rognée a un ratio un peu différent (object-fit: cover). La photo du haut de page (`hero`) se charge tout
// de suite ; les autres à l'approche. Réutilisée par la galerie (fiche-galerie.js), où la section parente porte déjà le thème du header.
import img from "../img.js";

export const figure = ({ photo, frame, hero = false, className = "", solo = false }) =>
  `<figure class="fphoto${solo ? " fphoto--solo" : ""}${hero ? " fphoto--hero" : ""}${className ? ` ${className}` : ""}" style="--frame: ${frame}" data-fiche="photo"${
    solo ? ' data-header-theme="light" data-header-gradient="cream"' : ""
  }>
          <div class="fphoto__frame">${img({
            src: photo.src,
            alt: photo.alt,
            class: "fphoto__img",
            sizes: "(min-width: 901px) 80vw, 92vw",
            loading: hero ? "eager" : "lazy",
            ...(hero && { fetchpriority: "high" }),
          })}</div>
        </figure>`;

// Photo seule entre deux blocs : section de premier niveau, avec son thème de header (aucun intervalle sans thème entre deux sections).
export default (section) => figure({ photo: section.photo, frame: section.frame, hero: section.hero, solo: true });
