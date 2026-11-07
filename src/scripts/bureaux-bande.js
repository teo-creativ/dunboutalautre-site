// Bande de photos de la page Terrasses (V7, retours-v7/docs/02-TERRASSES.md §4, frames terrasses-08 à 20), première moitié de la scène de scripts/bureaux-matieres.js
// (profil « terrasses ») : la section est épinglée et cette phase est pilotée par un seul nombre, b, de 0 à 1, que la scène fait avancer avec le scroll.
//   - b de 0 à RISE : le contenu (titre, phrase, deux rangées) monte à la vitesse du scroll jusqu'à ce que la 2e rangée soit presque en haut de l'écran
//     (frames 13 à 16 : la 1re rangée sort, il n'en reste qu'un liséré sous le header) ; les rangées défilent toujours (CSS, bureaux-bande.css).
//   - à RISE : les rangées s'arrêtent (animation-play-state) et la photo de l'olivier la plus proche du centre est mesurée ; le cadre agrandi de la scène (la photo
//     du premier fond, de même rapport) prend sa place au pixel près et l'original est masqué (frame 16).
//   - b de RISE à 1 : les autres photos s'estompent pendant que le cadre se recentre et passe de la taille de la rangée (570 x 360 px) à celle de la frame 17
//     (702 x 441 px, centrée). À b = 1 la scène reprend la main : la photo grandit jusqu'au plein écran.
// Les rangées montent et s'estompent sans mesure fixe en px : tout est relu à chaque recalcul des positions (sync), l'échelle suit la largeur de l'écran.
import { gsap } from "./core.js";
import { clamp, lerp } from "./bureaux-scene.js";

const RISE = 0.66; // part de la phase où le contenu monte (le reste : fondu et recentrage)
const STOP = 105 / 1030; // la 2e rangée s'arrête avec son bord haut à cette part de la hauteur (frames 15 et 16 : 105 px sur 1030)
const FADE_FROM = 0.5; // les voisines commencent à s'estomper à cette part de la phase (frame 16 : à moitié, frame 17 : presque effacées)
const ease = gsap.parseEase("power2.inOut");

export function createBand(section, { target }) {
  const band = section.querySelector(".mat__band");
  const content = band?.querySelector(".band__content");
  const heroes = band ? [...band.querySelectorAll("[data-band-hero]")] : [];
  if (!band || !content || !heroes.length) return null;
  const heroRow = heroes[0].closest(".band__row");
  const setY = gsap.quickSetter(content, "y", "px");

  let rise = 0; // px dont le contenu monte
  let taken = null; // { item, left, top, w } : la photo de l'olivier mesurée au moment du relais (px, repère de la section)

  const unfreeze = () => {
    if (!taken) return;
    taken.item.classList.remove("is-taken");
    band.classList.remove("is-paused");
    taken = null;
  };

  // Recalcul : de combien le contenu doit monter. Mesuré contenu à plat, relativement à la bande (la position de la page n'y change rien).
  const sync = () => {
    unfreeze();
    gsap.set(content, { y: 0 });
    const top = heroRow.getBoundingClientRect().top - band.getBoundingClientRect().top;
    rise = Math.max(0, top - STOP * band.getBoundingClientRect().height);
  };

  const freeze = () => {
    if (taken) return;
    band.classList.add("is-paused");
    const middle = window.innerWidth / 2;
    const item = heroes.reduce((best, el) => {
      const r = el.getBoundingClientRect();
      const b = best.getBoundingClientRect();
      return Math.abs(r.left + r.width / 2 - middle) < Math.abs(b.left + b.width / 2 - middle) ? el : best;
    });
    const r = item.getBoundingClientRect();
    taken = { item, left: r.left, top: r.top - band.getBoundingClientRect().top, w: r.width };
    item.classList.add("is-taken");
  };

  // b : progression de la phase. Renvoie null tant que le cadre de la photo n'a pas pris le relais, sinon son rectangle { left, top, w } (px, repère de la section).
  const render = (b) => {
    setY(-rise * clamp(b / RISE));
    band.style.setProperty("--band-fade", String(1 - clamp((b - FADE_FROM) / (1 - FADE_FROM))));
    if (b < RISE) {
      unfreeze();
      return null;
    }
    freeze();
    const to = target();
    const t = ease(clamp((b - RISE) / (1 - RISE)));
    return { left: lerp(taken.left, to.left, t), top: lerp(taken.top, to.top, t), w: lerp(taken.w, to.w, t) };
  };

  const destroy = () => {
    unfreeze();
    band.style.removeProperty("--band-fade");
    gsap.set(content, { clearProps: "transform" });
  };

  return { sync, render, destroy };
}
