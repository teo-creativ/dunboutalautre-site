// Notre fonctionnement (retours-v2/docs/05-NOEL-ANIMATIONS.md §H, retours-v3/docs/02-FONCTIONNEMENT-TIMELINE.md) : la section est une scène
// épinglée, une seule timeline scrubée, où une seule étape est au centre de l'attention à la fois. Chaque étape attend en bas, monte et
// s'installe, puis continue vers le haut en s'effaçant pendant que la suivante arrive : elles montent du bas vers le haut, la nouvelle
// chassant l'ancienne. La ligne de progression se remplit en même temps, d'un point au suivant, et l'état de chaque étape dépend de
// l'avancée de la timeline :
//   - pas encore atteinte : point sable ;
//   - atteinte (la ligne a atteint son point) : point orange qui « pop » ;
//   - courante (la dernière atteinte) : titre en olive-deep avec soulignement orange qui se dessine, description pleine.
// Les changements d'état sont des classes (couleurs : transitions CSS de 0,35 s, process.css) plus le pop du point et le trait, en GSAP :
// pas de bascule brusque, et tout est réversible, car l'indice courant se déduit de la position de la timeline, pas d'un événement.
// Unités de la timeline : 1 unité = le scroll d'une étape (100 vh sur ordinateur, 80 vh sous 900 px).
// Mouvement réduit : pas d'épinglage, la timeline est statique (toutes les étapes en liste espacée, ligne pleine), sans animation de scroll
// (reduced-motion.js).
import { gsap, ScrollTrigger, SplitText } from "./core.js";
import { createMark } from "./mark.js";
import { fillTag, hideTags } from "./tag.js";

// Calendrier d'une étape, en unités : elle monte pendant ENTER, tient HOLD, puis part et s'efface pendant EXIT. La suivante commence 1
// unité après elle : elle monte donc pendant que la précédente finit de s'effacer (jamais plus de deux étapes à l'écran). LEAD : le scroll
// d'entrée avant la première étape ; TAIL : celui de sortie, pendant lequel la dernière étape reste à l'écran. La timeline dure LEAD plus
// une unité par étape plus TAIL, soit 6 unités pour 5 étapes (600 vh sur ordinateur).
const LEAD = 0.5;
const TAIL = 0.5;
const ENTER = 0.45;
const HOLD = 0.2;
const EXIT = 0.45;
const OFFSET = 0.06; // le titre entre d'abord, puis la description, à 0,06 d'écart
const ACTIVE = 0.1; // une étape devient courante (point allumé) un peu après le début de sa montée
const BELOW = 0.6; // départ d'une étape, en hauteurs d'écran, sous sa place
const ABOVE = 0.35; // arrivée d'une étape qui part, au-dessus de sa place

export function initProcess() {
  const section = document.getElementById("fonctionnement");
  const timeline = section?.querySelector(".process__timeline");
  if (!timeline) return;

  const steps = [...timeline.querySelectorAll(".step")];
  const line = timeline.querySelector(".process__line");

  // Position verticale du point d'une étape dans la timeline (offsetTop : insensible aux transformations).
  const dotY = (step) => {
    const dot = step.querySelector(".step__dot");
    return step.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
  };
  // La ligne va du premier au dernier point, quelle que soit la hauteur du texte de la dernière étape.
  const layout = () => {
    const first = dotY(steps[0]);
    const last = dotY(steps.at(-1));
    line.style.top = `${first}px`;
    line.style.bottom = `${timeline.offsetHeight - last}px`;
  };
  layout();
  // Avant le calcul des positions des triggers : la mise en page d'une nouvelle largeur ou des polices est relue.
  ScrollTrigger.addEventListener("refreshInit", layout);

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => pinned(section, steps, layout, 1));
  mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => pinned(section, steps, layout, 0.8));
}

// perStep : hauteurs d'écran de scroll par étape.
function pinned(section, steps, layout, perStep) {
  section.classList.add("process--anim");
  layout(); // les points ont changé de place : la ligne est relue tout de suite

  const marks = steps.map((step) => createMark(step.querySelector(".uline")));
  const dots = steps.map((step) => step.querySelector(".step__dot"));
  const fill = section.querySelector(".process__fill");
  const line = section.querySelector(".process__line");
  const count = steps.length;
  const duration = LEAD + count + TAIL;

  // ---------- Apparition : label, titre par mots, tag qui se remplit, ligne et points ----------
  const label = section.querySelector(".label");
  const title = section.querySelector(".process__title");
  const tags = title.querySelectorAll(".tag");
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  gsap.set(label, { opacity: 0, y: 12 });
  gsap.set(split.words, { yPercent: 110 });
  hideTags(tags);
  gsap.set([line, ...dots], { opacity: 0 });
  const entry = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  entry.to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
    .to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.1)
    .to([line, ...dots], { opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.05 }, 0.3);
  tags.forEach((tag, i) => fillTag(entry, tag, 0.55 + i * 0.12));
  // end: "max" : si on saute au-delà du titre, l'apparition est quand même jouée.
  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "max",
    onToggle: (self) => (self.isActive ? entry.play() : entry.reverse()),
  });

  // ---------- Progression : ligne, états des étapes ----------
  let index = null;
  const setIndex = (next, instant = false) => {
    if (next === index) return;
    const previous = index ?? -1;
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
        const length = duration * perStep * section.offsetHeight;
        section.dataset.pinLength = length; // lu par le thème du header : la section reste à l'écran pendant son pin
        return `+=${length}`;
      },
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    onUpdate: () => {
      let next = -1;
      steps.forEach((_, i) => { if (tl.time() >= LEAD + i + ACTIVE - 1e-6) next = i; });
      setIndex(next);
    },
  });

  // ---------- Les étapes : un seul groupe visible à la fois ----------
  // Autoalpha (opacité et visibilité) : une étape invisible n'est ni cliquable ni lue par les lecteurs d'écran. Le titre entre avant la
  // description. Ni top ni height : seulement transform et opacité.
  const below = () => window.innerHeight * BELOW;
  const above = () => -window.innerHeight * ABOVE;
  steps.forEach((step, i) => {
    const at = LEAD + i;
    [step.querySelector(".step__title"), step.querySelector(".step__desc")].forEach((part, k) => {
      const delay = k * OFFSET;
      tl.fromTo(part, { autoAlpha: 0, y: below }, { autoAlpha: 1, y: 0, duration: ENTER, ease: "power2.out" }, at + delay);
      // La dernière étape reste à l'écran jusqu'à la fin de la section.
      if (i < count - 1) tl.to(part, { autoAlpha: 0, y: above, duration: EXIT, ease: "power2.in" }, at + ENTER + HOLD + delay);
    });
  });

  // La ligne avance avec les étapes : elle atteint le point de chaque étape quand celle-ci devient courante. Les points sont régulièrement
  // espacés, comme les débuts d'étape : une seule pente, de bout en bout. « none » seulement ici : le mouvement des étapes ne l'est jamais.
  tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: count - 1 }, LEAD + ACTIVE).set({}, {}, duration); // fixe la durée de la timeline
  setIndex(-1, true);

  return () => {
    section.classList.remove("process--anim");
    delete section.dataset.pinLength;
    marks.forEach((mark) => mark.kill());
    steps.forEach((step) => step.classList.remove("is-reached", "is-current"));
    layout(); // retour à la liste : la ligne est relue
  };
}
