// « Pourquoi végétaliser vos bureaux ? » de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §6, frames bureaux-34 et 35), et toutes les
// listes du même composant : « Nos créations » (Scénographie, Design), « Ce qui est inclus » (Entretien). Pas de pin : la section est celle qui
// monte par-dessus « Trois matières » (marque posée par bureaux-matieres.js). Ici : les filets, et le clavier.
// Retours V8 (G7) : AUCUNE ligne n'est active au chargement ni au scroll. Toutes les lignes sont au même état de repos et seule la ligne survolée à la
// souris (ou focalisée au clavier) s'allume, comme la liste de l'accueil : c'est du CSS pur (bureaux-pourquoi.css, :hover et :focus-visible), plus
// aucune classe d'état posée par le script. Sans souris (tactile), sous 900 px ou sans JavaScript, toutes les lignes restent lisibles, sans ligne active.
// Ce script ne fait donc que deux choses : rendre les lignes atteignables au clavier quand elles réagissent au survol (le focus allume la ligne,
// anneau de focus-visible de base.css), et dessiner les filets de la gauche vers la droite à l'entrée de leur ligne (scaleX de 0 à 1). L'entrée du
// titre et des lignes (fondu, y 24 px, cascade de 0,1 s) est celle de reveal.js (data-reveal).
import { gsap, ScrollTrigger } from "./core.js";

const RULE_START = "top 88%";

export function initBureauxPourquoi() {
  const section = document.querySelector('[data-bx="pourquoi"]');
  if (!section) return;
  const rows = [...section.querySelectorAll(".why-row")];
  if (!rows.length) return;

  const mm = gsap.matchMedia();

  // Clavier : seulement là où le survol existe (même condition que bureaux-pourquoi.css). Sinon les lignes ne sont pas des contrôles.
  mm.add("(hover: hover) and (min-width: 901px)", () => {
    rows.forEach((row) => (row.tabIndex = 0));
    return () => rows.forEach((row) => row.removeAttribute("tabindex"));
  });

  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    // Filets : de la gauche vers la droite, quand leur ligne entre. Le premier trait n'existe pas (les filets sont entre les lignes).
    const rules = rows.flatMap((row) => [...row.querySelectorAll(".why-row__rule")]);
    gsap.set(rules, { scaleX: 0, transformOrigin: "0% 50%" });
    // Entrée : le filet se dessine en 1 s ; au scroll arrière il se retire vite (0,4 s), comme les autres révélations (reveal.js).
    // (un filet de plus sous la dernière ligne pour la page Design : il se dessine avec le filet de sa ligne.)
    const triggers = rows.flatMap((row) => {
      const own = [...row.querySelectorAll(".why-row__rule")];
      if (!own.length) return [];
      return ScrollTrigger.create({
        trigger: row,
        start: RULE_START,
        end: "max",
        onEnter: () => gsap.to(own, { scaleX: 1, duration: 1, ease: "expo.out", overwrite: true }),
        onLeaveBack: () => gsap.to(own, { scaleX: 0, duration: 0.4, ease: "power2.in", overwrite: true }),
      });
    });
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      gsap.set(rules, { clearProps: "transform" });
    };
  });
}
