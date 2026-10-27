// Notre fonctionnement (retours-v3/docs/02-FONCTIONNEMENT-TIMELINE.md, comportement de la timeline de référence
// retours-v3/references/timeline-relume/) : pas d'épinglage, le scroll est naturel. Les étapes sont dans le flux, très espacées, et c'est
// le centre de l'écran qui sert de repère :
//   - la ligne se remplit (scaleY, origine en haut) du premier point au dernier : elle commence quand le premier point atteint le centre
//     de l'écran et finit quand le dernier l'atteint, en suivant le scroll (scrub) ;
//   - un point qui franchit le centre passe du sable à l'orange en grossissant un peu, et le reste ; en remontant, il redevient sable ;
//   - une étape monte du bas en apparaissant (y et opacité, scrub) pendant son entrée dans l'écran ; une fois montée dans le tiers haut
//     de l'écran, elle s'estompe doucement sans disparaître.
// Tout est lié à la position de scroll (ScrollTrigger) : réversible, sans état à tenir. Seuls transform et opacité bougent.
// Mouvement réduit (et sans JavaScript) : rien ne s'anime, la ligne est pleine, les points sont orange, les étapes sont visibles.
import { gsap, ScrollTrigger, SplitText } from "./core.js";
import { fillTag, hideTags } from "./tag.js";

const CENTER = "center 50%"; // repère de la ligne et des points : le centre de l'écran
const RISE = { from: "top 85%", to: "top 55%", y: 48 }; // montée d'une étape qui entre dans l'écran
const FADE = { from: "top 33%", to: "top 10%", opacity: 0.3 }; // une étape passée, dans le tiers haut de l'écran
const OFFSET = 0.06; // la description suit le titre à 0,06 (en part de la montée)
const POP = { scale: 1.25, duration: 0.4, ease: "power2.out" }; // point atteint

export function initProcess() {
  const section = document.getElementById("fonctionnement");
  const timeline = section?.querySelector(".process__timeline");
  if (!timeline) return;

  const steps = [...timeline.querySelectorAll(".step")];
  const dots = steps.map((step) => step.querySelector(".step__dot"));
  const line = timeline.querySelector(".process__line");

  // La ligne va du premier au dernier point, quelle que soit la hauteur du texte de la dernière étape (offsetTop : insensible aux
  // transformations). Relue avant chaque calcul des positions : nouvelle largeur, polices arrivées.
  const dotY = (i) => steps[i].offsetTop + dots[i].offsetTop + dots[i].offsetHeight / 2;
  const layout = () => {
    line.style.top = `${dotY(0)}px`;
    line.style.bottom = `${timeline.offsetHeight - dotY(steps.length - 1)}px`;
  };
  layout();
  ScrollTrigger.addEventListener("refreshInit", layout);
  // Polices arrivées après l'initialisation (réseau lent, événement de main.js) : les textes changent de hauteur, donc les points de place.
  // Quand elles sont déjà là, main.js fait son recalcul unique après le chargement.
  window.addEventListener("dbal:relayout", () => ScrollTrigger.refresh());

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    head(section);
    progress(timeline, dots);
    steps.forEach((step, i) => arrival(step, dots[i]));
  });
}

// ---------- Apparition du titre : label, mots, tags qui se remplissent ----------
function head(section) {
  const label = section.querySelector(".label");
  const title = section.querySelector(".process__title");
  const tags = title.querySelectorAll(".tag");
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  gsap.set(label, { opacity: 0, y: 12 });
  gsap.set(split.words, { yPercent: 110 });
  hideTags(tags);
  const entry = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  entry.to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0).to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.1);
  tags.forEach((tag, i) => fillTag(entry, tag, 0.55 + i * 0.12));
  // end: "max" : si on saute au-delà du titre, l'apparition est quand même jouée.
  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "max",
    onToggle: (self) => (self.isActive ? entry.play() : entry.reverse()),
  });
}

// ---------- Progression : la ligne se remplit jusqu'au centre de l'écran ----------
function progress(timeline, dots) {
  const fill = timeline.querySelector(".process__fill");
  gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: dots[0], start: CENTER, endTrigger: dots.at(-1), end: CENTER, scrub: true, invalidateOnRefresh: true },
    },
  );
}

// ---------- Une étape : son point, sa montée, puis son effacement ----------
function arrival(step, dot) {
  const on = dot.querySelector(".step__dot-on");
  const body = step.querySelector(".step__body");
  const parts = [step.querySelector(".step__title"), step.querySelector(".step__desc")];

  // Point : sable, puis orange et un peu plus gros au franchissement du centre. La couche orange est une opacité, jamais une couleur
  // animée. end: "max" : le point reste atteint pour tout le scroll qui suit ; en remontant, la timeline se rejoue à l'envers.
  gsap.set(on, { opacity: 0 });
  const reach = gsap
    .timeline({ paused: true, defaults: { duration: POP.duration, ease: POP.ease } })
    .to(dot, { scale: POP.scale }, 0)
    .to(on, { opacity: 1 }, 0);
  ScrollTrigger.create({
    trigger: dot,
    start: CENTER,
    end: "max",
    onToggle: (self) => (self.isActive ? reach.play() : reach.reverse()),
  });

  // Montée : le titre, puis la description à 0,06 d'écart (une durée de 1 par morceau : la montée dure 1 + OFFSET).
  const rise = gsap.timeline({
    defaults: { ease: "none", duration: 1 },
    scrollTrigger: { trigger: step, start: RISE.from, end: RISE.to, scrub: true, invalidateOnRefresh: true },
  });
  parts.forEach((part, k) => rise.fromTo(part, { opacity: 0, y: RISE.y }, { opacity: 1, y: 0 }, k * OFFSET));

  // Effacement doux, sur l'enveloppe du texte (le point reste plein) : l'opacité du titre et celle de la description ne se mélangent pas.
  gsap.fromTo(
    body,
    { opacity: 1 },
    {
      opacity: FADE.opacity,
      ease: "none",
      scrollTrigger: { trigger: step, start: FADE.from, end: FADE.to, scrub: true, invalidateOnRefresh: true },
    },
  );
}
