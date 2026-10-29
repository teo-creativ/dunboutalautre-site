// Frise de logos clients (DESIGN.md §5.9, docs/ANIMATIONS.md §11 ter) : défilement continu, lent, sur une seule ligne.
// Seulement sur ordinateur et sans préférence de mouvement réduit : sinon la liste reste statique et passe à la ligne (mobile, mouvement
// réduit, JavaScript absent). Rien n'est animé que `transform` : la liste est dupliquée (copies en aria-hidden) puis translatée d'un
// cycle exact, en boucle, sans à-coup. Elle s'arrête au survol et au focus, et quand elle n'est plus à l'écran.
import { gsap, ScrollTrigger } from "./core.js";

const SPEED = 40; // px par seconde : lent, la frise est un décor
const EASE_STOP = 0.5; // s pour s'arrêter ou repartir

function build(section) {
  const list = section.querySelector(".logos__list");
  const originals = list ? [...list.children] : [];
  if (originals.length < 2) return () => {};

  // Cadre qui rogne, à la hauteur qu'avait la liste statique : le passage sur une seule ligne ne décale rien.
  const frame = document.createElement("div");
  frame.className = "logos__frame";
  frame.style.height = `${list.offsetHeight}px`;
  list.before(frame);
  frame.append(list);
  section.classList.add("is-marquee");

  let clones = [];
  let tween = null;
  let width = 0;

  const layout = () => {
    tween?.kill();
    gsap.set(list, { x: 0 });
    clones.forEach((clone) => clone.remove());
    clones = [];
    const first = originals[0];
    const last = originals[originals.length - 1];
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    // Un cycle : du premier logo à la place de sa copie (écart compris).
    const cycle = last.offsetLeft + last.offsetWidth - first.offsetLeft + gap;
    width = frame.offsetWidth;
    const copies = Math.ceil(width / cycle) + 1;
    for (let i = 0; i < copies; i++) {
      originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        list.append(clone);
        clones.push(clone);
      });
    }
    tween = gsap.to(list, { x: -cycle, duration: cycle / SPEED, ease: "none", repeat: -1 });
  };
  layout();

  const slow = (scale) => tween && gsap.to(tween, { timeScale: scale, duration: EASE_STOP, ease: "power2.out", overwrite: true });
  const stop = () => slow(0);
  const go = () => slow(1);
  frame.addEventListener("mouseenter", stop);
  frame.addEventListener("mouseleave", go);
  frame.addEventListener("focusin", stop);
  frame.addEventListener("focusout", go);

  // Hors écran : à l'arrêt (rien à dessiner) ; will-change seulement pendant que la frise défile.
  const trigger = ScrollTrigger.create({
    trigger: frame,
    start: "top bottom",
    end: "bottom top",
    onToggle: ({ isActive }) => {
      list.style.willChange = isActive ? "transform" : "";
      isActive ? tween?.resume() : tween?.pause();
    },
  });

  // Largeur du cadre changée (fenêtre, zoom) : le cycle et le nombre de copies sont à refaire.
  let timer;
  const observer = new ResizeObserver(() => {
    if (frame.offsetWidth === width) return;
    clearTimeout(timer);
    timer = setTimeout(layout, 150);
  });
  observer.observe(frame);

  return () => {
    clearTimeout(timer);
    observer.disconnect();
    trigger.kill();
    tween?.kill();
    clones.forEach((clone) => clone.remove());
    list.style.cssText = "";
    frame.replaceWith(list);
    section.classList.remove("is-marquee");
  };
}

export function initLogos() {
  const sections = [...document.querySelectorAll(".logos")];
  if (!sections.length) return;
  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const cleanups = sections.map(build);
    return () => cleanups.forEach((cleanup) => cleanup());
  });
}
