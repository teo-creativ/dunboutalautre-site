// Animation de remplissage des CTA au survol et au focus clavier (ANIMATIONS.md §10).
// Une timeline par bouton : lue vers l'avant à l'entrée, inversée à la sortie. Une interruption (survol rapide)
// reprend donc exactement là où en est l'animation, sans saut. Un seul jeu d'écouteurs délégués pour tous les .cta.
import { gsap, SplitText } from "./core.js";

const REVERSE_SPEED = 1.8; // la sortie dure environ 0,5 s pour une entrée de 0,9 s

const states = new Map();

const build = (cta) => {
  const base = cta.querySelector(".cta__layer--base");
  const fill = cta.querySelector(".cta__layer--fill");
  const dot = fill.querySelector(".cta__dot");
  const split = SplitText.create(fill.querySelector(".cta__text"), { type: "chars", aria: "none" });

  // Centre du point et rayon qui couvre toute la pilule. Mesures de mise en page (offset*), insensibles aux
  // transformations du parent (le hero qui se réduit, par exemple). Relues à chaque invalidate().
  const origin = () => dot.offsetLeft + dot.offsetWidth / 2;
  const reach = () => Math.hypot(Math.max(origin(), fill.offsetWidth - origin()), fill.offsetHeight / 2) + 2;

  const tl = gsap
    .timeline({ paused: true })
    .fromTo(
      fill,
      { clipPath: () => `circle(0px at ${origin()}px 50%)` },
      { clipPath: () => `circle(${reach()}px at ${origin()}px 50%)`, duration: 0.6, ease: "power3.inOut" },
      0,
    )
    // Une fois le disque complet, la base est masquée : sinon les bords anti-aliasés des deux couches laissent un liseré clair.
    .set(base, { autoAlpha: 0 }, 0.6)
    .fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.4)
    .fromTo(
      split.chars,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.012 },
      0.3,
    );

  const state = { tl, split, base, fill, dot, hover: false, focus: false, active: false };
  states.set(cta, state);
  return state;
};

const destroy = (cta) => {
  const { tl, split, base, fill, dot } = states.get(cta);
  tl.kill();
  split.revert();
  gsap.set([fill, dot, base], { clearProps: "clipPath,transform,opacity,visibility" });
  states.delete(cta);
};

const setFlag = (cta, key, value) => {
  if (value && cta.getAttribute("aria-expanded") === "true") return; // « Fermer » : plus de pilule à remplir
  const state = states.get(cta) ?? (value ? build(cta) : null);
  if (!state) return;
  state[key] = value;
  const active = state.hover || state.focus;
  if (active === state.active) return;
  state.active = active;
  if (active) state.tl.timeScale(1).play();
  else state.tl.timeScale(REVERSE_SPEED).reverse();
};

// Change le libellé dans les deux couches. Le texte découpé par SplitText est défait : la prochaine interaction le redécoupe.
export function setCtaLabel(cta, label) {
  if (states.has(cta)) destroy(cta);
  cta.querySelectorAll(".cta__text").forEach((text) => { text.textContent = label; });
}

const ctaOf = (event) => event.target.closest?.(".cta");

const onOver = (e) => { const cta = ctaOf(e); if (cta) setFlag(cta, "hover", true); };
const onOut = (e) => { const cta = ctaOf(e); if (cta && !cta.contains(e.relatedTarget)) setFlag(cta, "hover", false); };
const onFocusIn = (e) => { const cta = ctaOf(e); if (cta && e.target.matches(":focus-visible")) setFlag(cta, "focus", true); };
const onFocusOut = (e) => { const cta = ctaOf(e); if (cta) setFlag(cta, "focus", false); };

// Les mesures dépendent de la largeur du bouton : le resize et le chargement des polices les font relire,
// sans toucher à la position de lecture.
let resizeTimer;
const invalidate = () => states.forEach(({ tl }) => tl.invalidate());
const onResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(invalidate, 150);
};

export function initCta() {
  const mm = gsap.matchMedia();
  // Sans survol (tactile) ou en mouvement réduit, le CSS gère seul un simple fondu.
  mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
    document.documentElement.classList.add("cta-anim");
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(invalidate);

    return () => {
      document.documentElement.classList.remove("cta-anim");
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      for (const cta of [...states.keys()]) destroy(cta);
    };
  });
}
