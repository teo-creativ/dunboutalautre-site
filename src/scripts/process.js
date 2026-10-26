// Notre fonctionnement (retours-v2/docs/05-NOEL-ANIMATIONS.md §H) : la section est épinglée (≈ 250 vh de scroll, scrub) et la ligne de la
// timeline se remplit de haut en bas. L'état de chaque étape dépend de la progression de la ligne :
//   - pas encore atteinte : point sable, texte atténué ;
//   - atteinte (la ligne a dépassé son point) : texte plein, point orange qui « pop » ;
//   - courante (la dernière atteinte) : titre en olive-deep avec soulignement orange qui se dessine, description pleine.
// Les changements d'état sont des classes (couleurs : transitions CSS de 0,35 s, process.css) plus le pop du point et le trait, en GSAP :
// pas de bascule brusque, et tout est réversible, car l'indice courant se déduit de la progression, pas d'un événement.
// Un temps de tenue au début et à la fin : la première étape est courante avant que la ligne ne se remplisse, la dernière le reste.
// Mobile et mouvement réduit : pas d'épinglage, la timeline est statique (toutes les étapes affichées en entier), les étapes apparaissent
// au scroll (fondu et montée), sauf en mouvement réduit (reduced-motion.js).
import { gsap, ScrollTrigger, SplitText } from "./core.js";
import { createMark } from "./mark.js";
import { fillTag, hideTags } from "./tag.js";

const PIN = 2.5; // écrans de scroll
const HOLD = 0.08; // part de la timeline tenue au début et à la fin

export function initProcess() {
  const section = document.getElementById("fonctionnement");
  const timeline = section?.querySelector(".process__timeline");
  if (!timeline) return;

  const steps = [...timeline.querySelectorAll(".step")];
  const line = timeline.querySelector(".process__line");
  const fill = timeline.querySelector(".process__fill");

  // Position verticale du point d'une étape dans la timeline (offsetTop : insensible aux transformations).
  const dotY = (step) => {
    const dot = step.querySelector(".step__dot");
    return step.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
  };
  // Part de la ligne (0 à 1) où chaque point se trouve, relue à chaque calcul des positions.
  let fractions = [];
  // La ligne va du premier au dernier point, quelle que soit la hauteur du texte de la dernière étape.
  const layout = () => {
    const first = dotY(steps[0]);
    const last = dotY(steps.at(-1));
    line.style.top = `${first}px`;
    line.style.bottom = `${timeline.offsetHeight - last}px`;
    fractions = steps.map((step) => (dotY(step) - first) / (last - first));
  };
  layout();
  // Avant le calcul des positions des triggers : la mise en page d'une nouvelle largeur ou des polices est relue.
  ScrollTrigger.addEventListener("refreshInit", layout);

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => pinned(section, steps, fill, () => fractions));
  mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => stacked(section, steps));
}

function pinned(section, steps, fill, getFractions) {
  section.classList.add("process--anim");
  const marks = steps.map((step) => createMark(step.querySelector(".uline")));
  const dots = steps.map((step) => step.querySelector(".step__dot"));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // ---------- Apparition : titre par mots, tag qui se remplit, étapes en cascade ----------
  const label = section.querySelector(".label");
  const title = section.querySelector(".process__title");
  const tags = title.querySelectorAll(".tag");
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  const line = section.querySelector(".process__line");
  gsap.set(label, { opacity: 0, y: 12 });
  gsap.set(split.words, { yPercent: 110 });
  hideTags(tags);
  // Opacité seule : un contenu pas encore révélé reste dans l'arbre d'accessibilité.
  gsap.set(steps, { opacity: 0, y: 36 });
  gsap.set(line, { opacity: 0 });
  const entry = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  entry.to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
    .to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.1)
    .to(line, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.3)
    .to(steps, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.4);
  tags.forEach((tag, i) => fillTag(entry, tag, 0.55 + i * 0.12));
  // end: "max" : si on saute au-delà du titre, l'apparition est quand même jouée.
  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "max",
    onToggle: (self) => (self.isActive ? entry.play() : entry.reverse()),
  });

  // ---------- Progression : ligne et états des étapes ----------
  let index = -1;
  const setIndex = (next, instant = false) => {
    if (next === index) return;
    const previous = index;
    index = next;
    steps.forEach((step, i) => {
      step.classList.toggle("is-reached", i <= next);
      step.classList.toggle("is-current", i === next);
      // Un point qui vient d'être atteint « pop » ; l'étape qui cesse d'être courante retire son soulignement.
      if (!instant && i <= next && i > previous) {
        gsap.fromTo(dots[i], { scale: 1.3 }, { scale: 1, duration: 0.5, ease: "back.out(2)", overwrite: "auto" });
      }
      if (i === next) (instant ? marks[i].set(true) : marks[i].show());
      else if (i === previous) marks[i].hide();
      else if (instant) marks[i].set(false);
    });
  };

  // L'indice vient de la position lissée de la timeline (celle qu'on voit à l'écran), pas du scroll brut.
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => {
        const length = PIN * section.offsetHeight;
        section.dataset.pinLength = length; // lu par le thème du header : la section reste à l'écran pendant son pin
        return `+=${length}`;
      },
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    onUpdate: () => {
      const q = clamp((tl.time() - HOLD) / (1 - 2 * HOLD), 0, 1);
      const fractions = getFractions();
      let next = 0;
      fractions.forEach((f, i) => { if (q >= f - 1e-6) next = i; });
      setIndex(next);
    },
  });
  tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: 1 - 2 * HOLD }, HOLD).set({}, {}, 1); // fixe la durée à 1
  setIndex(0, true);

  return () => {
    section.classList.remove("process--anim");
    delete section.dataset.pinLength;
    marks.forEach((mark) => mark.kill());
    steps.forEach((step) => step.classList.remove("is-reached", "is-current"));
  };
}

// Mobile : les étapes apparaissent en fondu et montée de 24 px, réversible. La ligne est entière (CSS).
function stacked(section, steps) {
  const blocks = [section.querySelector(".process__head"), ...steps];
  gsap.set(blocks, { opacity: 0, y: 24 });
  ScrollTrigger.batch(blocks, {
    start: "top 90%",
    end: "max",
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
    onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 24, duration: 0.4, ease: "power2.in", overwrite: true }),
  });
}
