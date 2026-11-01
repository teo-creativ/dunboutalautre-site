// Animations de la page Contact V4 (retours-v4/docs/03-CONTACT.md, frames contact-01 à 10). Le titre « Parlons de votre projet. » est animé par
// intro.js ; le titre collé est du CSS (form.css). Ici :
// - ouverture : l'étiquette, puis les groupes du formulaire en cascade de haut en bas (fondu, y 24 px, 0,07 s). Les groupes sous la ligne de
//   flottaison se révèlent à leur entrée dans l'écran, une seule fois ;
// - photo : elle monte du bas (y) en s'ouvrant du bord gauche vers la droite (clip-path), l'image intérieure se pose (scale 1,2 vers 1), le
//   tout scrubé sur le scroll entre l'arrivée du bloc en bas de l'écran et son centrage (frames 04 à 07 : 24, 41, 81 puis 100 % de la
//   largeur, ce que reproduit une courbe cubique, power2.in) ;
// - coordonnées : après la photo, l'étiquette puis chaque ligne montent sous leur masque, réversibles au scroll arrière.
// Mouvement réduit : rien n'est caché ni animé, la page est lisible telle quelle. Mobile : la photo s'ouvre sans montée (pas de y).
import { afterIntro } from "./after-intro.js";
import { gsap, ScrollTrigger } from "./core.js";

const RADIUS = 14; // --radius-photo, à droite seulement
const HIDDEN = `inset(0% 100% 0% 0% round 0px ${RADIUS}px ${RADIUS}px 0px)`;
const SHOWN = `inset(0% 0% 0% 0% round 0px ${RADIUS}px ${RADIUS}px 0px)`;

export function initContact() {
  const main = document.querySelector(".contact");
  const coords = document.querySelector(".coords");
  if (!main && !coords) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: "(min-width: 901px)", motion: "(prefers-reduced-motion: no-preference)" }, ({ conditions }) => {
    if (!conditions.motion) return;
    const cleanups = [];

    // ---------- Ouverture : étiquette, puis groupes du formulaire ----------
    if (main) {
      const label = main.querySelector(".contact__label");
      const groups = [...main.querySelectorAll(".cform [data-cgroup]")];
      gsap.set(label, { opacity: 0, y: 12 });
      gsap.set(groups, { opacity: 0, y: 24 });

      const show = (list, delay = 0) => gsap.to(list, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, delay, overwrite: true });
      // Ce qui entre dans l'écran avant le début de l'intro attend : l'étiquette et les groupes visibles à l'ouverture partent après le titre.
      let ready = false;
      const waiting = [];
      afterIntro(() => {
        ready = true;
        gsap.to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.15 });
        if (waiting.length) show(waiting.splice(0), 0.6);
      });
      ScrollTrigger.batch(groups, {
        start: "top 92%",
        end: "max",
        once: true,
        onEnter: (batch) => (ready ? show(batch) : waiting.push(...batch)),
      });

      // Clavier : un groupe pas encore révélé qui reçoit le focus apparaît aussitôt (le focus ne doit jamais se trouver sur un élément invisible).
      const onFocus = (event) => gsap.to(event.currentTarget, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      groups.forEach((group) => group.addEventListener("focusin", onFocus));
      cleanups.push(() => groups.forEach((group) => group.removeEventListener("focusin", onFocus)));
    }

    // ---------- Photo et coordonnées ----------
    if (coords) {
      const photo = coords.querySelector(".coords__photo");
      const frame = coords.querySelector(".coords__frame");
      const image = coords.querySelector(".coords__img");
      const label = coords.querySelector(".coords__label");
      const lines = coords.querySelectorAll(".coords__text");
      const { desktop } = conditions;

      // Le déclencheur est le bloc fixe de la photo : le cadre qui monte (y) ne déplace pas sa propre mesure.
      const open = gsap.timeline({
        scrollTrigger: {
          trigger: photo,
          start: desktop ? "top bottom" : "top 92%",
          end: desktop ? "top 40%" : "top 50%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      open
        .fromTo(frame, { clipPath: HIDDEN }, { clipPath: SHOWN, ease: "power2.in", duration: 1 }, 0)
        .fromTo(image, { scale: 1.2 }, { scale: 1, ease: "power2.out", duration: 1 }, 0);
      if (desktop) open.fromTo(frame, { y: () => window.innerHeight * 0.18 }, { y: 0, ease: "none", duration: 1 }, 0);

      gsap.set(label, { opacity: 0, y: 12 });
      gsap.set(lines, { yPercent: 110 });
      const text = gsap.timeline({ paused: true });
      text
        .to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
        .to(lines, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 0.15);
      // onEnter et onLeaveBack plutôt que onToggle : tout en bas de la page le déclencheur atteint sa fin (end: "max") et se désactive, ce qui
      // refermerait les lignes juste là où on les lit. Si on saute au-delà du départ, onEnter est quand même appelé.
      ScrollTrigger.create({
        trigger: desktop ? photo : coords.querySelector(".coords__body"),
        start: desktop ? "top 46%" : "top 85%",
        end: "max",
        onEnter: () => text.play(),
        onLeaveBack: () => text.reverse(),
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });
}
