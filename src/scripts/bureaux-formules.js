// « Nos formules d'abonnement » de la page Entretien (V7, frames entretien-05 à 09) : avec mouvement sur ordinateur, la section est épinglée un écran
// et le disque orange (scripts/bureaux-cercle.js) part du centre de l'écran et grandit jusqu'à la recouvrir ; il est le fond de la section orange qui suit
// (« Quels végétaux entretient-on ? », scripts/bureaux-matieres.js). Mesures lues sur les frames 07 et 08 (1728 x 1030) : centre du disque à 860,5 et 522 px,
// soit 3,5 px à gauche et 7 px sous le centre de l'écran. Header : la frame cache le logo et le bouton sous le disque (frames 08 et 09), le doc demande qu'ils
// restent lisibles ; le header reste donc au-dessus et passe au blanc (thème sombre, dégradé orange) quand le disque a recouvert le logo et le bouton, jusqu'à ce que la
// section sorte de la zone du header. Les cartes deviennent inertes (plus de focus clavier) quand le disque les recouvre.
// Sous 900 px ou en mouvement réduit : aucun épinglage, aucun disque (display: none), la section orange suivante suit directement le fond crème.
import { gsap, ScrollTrigger } from "./core.js";
import { MEDIA, monotone } from "./bureaux-scene.js";
import { claimHeader } from "./bureaux-header.js";
import { circleReveal } from "./bureaux-cercle.js";

const REF_W = 1728;
const REF_H = 1030;
const CENTER = { x: -3.5, y: 7 }; // px à 1728 x 1030, depuis le centre de l'écran
// Longueur du pin et rayon du disque : les frames 06 à 09 sont espacées de 410 px de scroll (les lignes de la liste montent de 411 px entre les frames 04 et 05, l'étiquette de 410 px entre les 05 et 06),
// soit 0,4 écran : disque absent sur la frame 06, de 398,5 px sur la 07, de 730 px sur la 08, plein écran sur la 09 : le pin dure 1,2 écran (p = 1/3 et 2/3 sur les frames 07 et 08).
const LENGTH = 1.2;
const R_FULL = 1014.4; // rayon au plein écran à 1728 x 1030 (coin le plus éloigné du centre du disque, + 2 px)
const radiusAt = monotone([0, 1 / 3, 2 / 3, 1], [0, 398.5 / R_FULL, 730 / R_FULL, 1]);
const COVERED = 0.985; // part du rayon à partir de laquelle les cartes sont recouvertes (inertes)
const HEADER_CENTER = 55; // le trait de changement du header (header-theme.js)

export function initBureauxFormules() {
  const section = document.querySelector('[data-bx="formules"]');
  const disc = section?.querySelector(".fml__disc");
  if (!section || !disc) return;
  const inner = section.querySelector(".fml__inner");

  const mm = gsap.matchMedia();
  mm.add(MEDIA.wide, () => {
    const root = document.documentElement;
    const scale = () => Math.min(document.documentElement.clientWidth / REF_W, window.innerHeight / REF_H);
    let u = scale();
    section.style.setProperty("--bx-u", `${u}px`);
    root.classList.add("bx-fml-anim");

    // Part du rayon qui recouvre le logo et le bouton du header (leur coin le plus éloigné du centre du disque).
    const header = document.getElementById("header");
    const gradient = header?.querySelector(".header__grad");
    let headerFrom = 0.93;
    let inZone = false;
    let headerState = null;
    let covered = false;
    let edge = false; // le disque atteint le dégradé du header
    let progress = 0;

    const apply = () => {
      // Deux temps : le disque atteint le dégradé crème du header (on le coupe : il ferait un voile crème sur l'orange, le logo olive reste lisible sur le crème), puis il
      // recouvre le logo et le bouton (thème sombre : texte blanc sur l'orange).
      const want = !inZone ? null : progress >= headerFrom ? "covered" : edge ? "edge" : null;
      if (want !== headerState) {
        headerState = want;
        claimHeader("cercle", want === "covered" ? { theme: "dark", gradient: "orange" } : want === "edge" ? { theme: "light", gradient: "off" } : null);
      }
      // Le disque a tout recouvert : la section orange dessous (de la même couleur, déjà en place) prend le relais, la section épinglée disparaît au lieu de défiler par-dessus.
      section.style.visibility = progress >= 1 ? "hidden" : "";
      const nowCovered = progress >= COVERED;
      if (nowCovered !== covered) {
        covered = nowCovered;
        if (inner) inner.inert = covered;
      }
    };

    // Écran court ou étroit : les cartes (corps de texte minimal) dépassent le bas de la section de la hauteur d'un écran, qui rogne : on réduit le bloc (échelle, depuis le haut) pour qu'il tienne.
    const lastCard = section.querySelector(".fml-card:last-child");
    const fit = () => {
      if (!inner || !lastCard) return;
      inner.style.transform = "";
      const top = section.getBoundingClientRect().top;
      const from = inner.getBoundingClientRect().top - top; // haut du bloc dans la section
      const bottom = lastCard.getBoundingClientRect().bottom - top; // bas des cartes dans la section
      const k = Math.min(1, (window.innerHeight - 8 - from) / (bottom - from));
      if (k < 1) {
        inner.style.transformOrigin = "50% 0";
        inner.style.transform = `scale(${k.toFixed(4)})`;
      }
    };

    const scene = circleReveal(section, {
      disc,
      length: LENGTH,
      radius: radiusAt,
      center: ({ w, h }) => {
        u = scale(); // le centre est recalculé à chaque rafraîchissement : l'échelle de la scène aussi
        section.style.setProperty("--bx-u", `${u}px`);
        fit();
        return { x: w / 2 + CENTER.x * u, y: h / 2 + CENTER.y * u };
      },
      onProgress: (p, { cx, cy, r, rMax }) => {
        progress = p;
        edge = cy - r <= (gradient?.offsetHeight ?? 0);
        if (header) {
          let far = 0;
          header.querySelectorAll("a, button").forEach((el) => {
            const box = el.getBoundingClientRect();
            if (!box.width) return;
            for (const x of [box.left, box.right]) for (const y of [box.top, box.bottom]) far = Math.max(far, Math.hypot(x - cx, y - cy));
          });
          if (far) headerFrom = Math.min(1, far / rMax + 0.01);
        }
        apply();
      },
    });

    // La section orange qui suit remonte d'un écran (marge négative) et reste SOUS la section épinglée : elle est en place, sous le disque, au moment où le pin finit (bureaux-formules.css).
    const next = (section.closest(".pin-spacer") ?? section).nextElementSibling;
    next?.classList.add("bx-follow");

    // Zone où la section est sous le header : du début du pin jusqu'à ce que son bas passe par le centre du header (comme header-theme.js).
    const zone = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `bottom+=${Number(section.dataset.pinLength) || 0} ${HEADER_CENTER}px`,
      refreshPriority: -1,
      onToggle: (self) => {
        inZone = self.isActive;
        apply();
      },
    });

    return () => {
      next?.classList.remove("bx-follow");
      zone.kill();
      scene.destroy();
      claimHeader("cercle", null);
      if (inner) {
        inner.inert = false;
        inner.style.transform = "";
        inner.style.transformOrigin = "";
      }
      section.style.visibility = "";
      root.classList.remove("bx-fml-anim");
      section.style.removeProperty("--bx-u");
    };
  });
}
