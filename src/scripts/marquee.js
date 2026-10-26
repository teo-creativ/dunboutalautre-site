// Bandeau de confiance (DESIGN.md §5.9) : frise de logos à défilement continu et lent, en pause au survol.
// Le HTML est une rangée statique ; ici elle est copiée (aria-hidden) jusqu'à remplir la largeur, puis la piste glisse
// d'exactement une rangée en boucle. En mouvement réduit, la rangée reste statique.
import { gsap, ScrollTrigger } from "./core.js";

const SPEED = 45; // px par seconde

export function initMarquee() {
  const section = document.querySelector(".trust");
  const viewport = section?.querySelector(".trust__viewport");
  const list = section?.querySelector(".trust__list");
  if (!list) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const track = document.createElement("div");
    track.className = "trust__track";
    list.before(track);
    track.append(list);
    section.classList.add("trust--marquee");

    let clones = [];
    let tween;
    let visibility;
    let alive = true;

    const build = () => {
      if (!alive) return;
      tween?.kill();
      clones.forEach((clone) => clone.remove());
      gsap.set(track, { x: 0 });

      const width = list.offsetWidth; // largeur d'une rangée, vide de fin compris
      const copies = Math.ceil(viewport.offsetWidth / width) + 1;
      clones = Array.from({ length: copies }, () => {
        const clone = list.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.append(clone);
        return clone;
      });
      tween = gsap.to(track, { x: -width, duration: width / SPEED, ease: "none", repeat: -1, paused: !(visibility?.isActive ?? true) });
    };
    build();

    // Survol : la piste ralentit jusqu'à l'arrêt, puis repart.
    const slow = () => gsap.to(tween, { timeScale: 0, duration: 0.6, overwrite: true });
    const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true });
    viewport.addEventListener("mouseenter", slow);
    viewport.addEventListener("mouseleave", resume);

    // Hors écran, la piste est à l'arrêt : rien à animer pour rien.
    visibility = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => tween.paused(!self.isActive),
    });

    // Largeur de l'écran ou polices changées : le nombre de copies et la largeur d'une rangée sont à relire.
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("dbal:relayout", build); // polices arrivées après l'initialisation (réseau lent)

    return () => {
      alive = false;
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("dbal:relayout", build);
      viewport.removeEventListener("mouseenter", slow);
      viewport.removeEventListener("mouseleave", resume);
      visibility.kill();
      tween?.kill();
      clones.forEach((clone) => clone.remove());
      track.before(list);
      track.remove();
      section.classList.remove("trust--marquee");
    };
  });
}
