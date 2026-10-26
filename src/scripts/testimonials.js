// Témoignages (retours-v2/docs/05-NOEL-ANIMATIONS.md §I) : carrousel de quatre avis, sans lecture automatique.
// Entrée (à 70 % de l'écran, réversible) : l'icône de guillemets grandit en pivotant (0,7 → 1, -8° → 0°, back.out), la citation se révèle
// ligne par ligne, puis le nom et le poste en fondu et montée.
// Changement d'avis : la citation sortante part par lignes (montée de 16 px, opacité 0, décalage de 0,03 s), puis la suivante entre par
// lignes ; le nom et le poste font un fondu croisé. Un clic pendant une transition la termine aussitôt avant d'en lancer une autre.
// Clavier : boutons (Tab, Entrée), flèches gauche et droite quand le focus est dans le carrousel. Mouvement réduit : fondu de 200 ms.
// Accessibilité : la zone .testi__slides est aria-live polite, seul l'avis courant est affiché (les autres ont hidden) et chaque avis
// annonce sa position (« Avis 2 sur 4 »). La hauteur du plus haut avis est réservée : rien ne bouge d'un avis à l'autre.
import { gsap, ScrollTrigger, SplitText, reducedMotion } from "./core.js";

const OUT = { y: -16, duration: 0.35, stagger: 0.03, ease: "power2.in" };
const IN = { duration: 0.8, stagger: 0.06, ease: "expo.out" };

export function initTestimonials() {
  const section = document.getElementById("temoignages");
  if (!section) return;

  const slides = [...section.querySelectorAll(".testi__slide")];
  const box = section.querySelector(".testi__slides");
  const nav = section.querySelector(".testi__nav");
  const prev = section.querySelector(".testi__arrow--prev");
  const next = section.querySelector(".testi__arrow--next");
  const icon = section.querySelector(".testi__icon");
  const label = section.querySelector(".testi__main > .label");
  let current = 0;

  nav.hidden = false; // les flèches ne servent à rien sans JavaScript

  const parts = (slide) => ({
    quote: slide.querySelector(".testi__quote p"),
    meta: [slide.querySelector(".testi__name"), slide.querySelector(".testi__role")],
  });
  const split = (el) => SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line", aria: "none" });

  // ---------- Hauteur réservée : celle du plus haut des avis, à la largeur courante ----------
  let busy = false;
  const measure = () => {
    if (busy) return;
    box.style.minHeight = "";
    const heights = slides.map((slide, i) => {
      if (i === current) return slide.offsetHeight;
      slide.hidden = false;
      const h = slide.offsetHeight;
      slide.hidden = true;
      return h;
    });
    box.style.minHeight = `${Math.max(...heights)}px`;
  };
  measure();
  let timer;
  const onResize = () => { clearTimeout(timer); timer = setTimeout(measure, 150); };
  window.addEventListener("resize", onResize);
  window.addEventListener("dbal:relayout", measure);

  // ---------- Changement d'avis ----------
  let running = null; // { finish() } : la transition en cours
  const go = (to) => {
    if (to === current) return;
    running?.finish();
    const from = slides[current];
    const target = slides[to];
    current = to;
    busy = true;

    if (reducedMotion()) {
      from.hidden = true;
      target.hidden = false;
      gsap.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none", clearProps: "opacity", onComplete: () => { busy = false; } });
      return;
    }

    const a = parts(from);
    const b = parts(target);
    const outSplit = split(a.quote);
    let inSplit = null;
    let tlIn = null;

    const enter = () => {
      outSplit.revert();
      from.hidden = true;
      gsap.set(a.meta, { clearProps: "opacity,transform" });
      target.hidden = false;
      inSplit = split(b.quote);
      gsap.set(inSplit.lines, { yPercent: 105 });
      gsap.set(b.meta, { opacity: 0, y: 10 });
      tlIn = gsap
        .timeline({ onComplete: () => { inSplit.revert(); gsap.set(b.meta, { clearProps: "opacity,transform" }); busy = false; running = null; } })
        .to(inSplit.lines, { yPercent: 0, ...IN }, 0)
        .to(b.meta, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0.3);
    };

    // Nom et poste : fondu croisé (le sortant s'efface pendant que la citation part, l'entrant arrive avec la nouvelle citation).
    const tlOut = gsap
      .timeline({ onComplete: enter })
      .to(outSplit.lines, { opacity: 0, ...OUT }, 0)
      .to(a.meta, { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.05);

    running = {
      finish() {
        tlOut.progress(1); // déclenche enter() si la sortie n'était pas finie
        tlIn?.progress(1);
      },
    };
  };

  const step = (delta) => go((current + delta + slides.length) % slides.length);
  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  section.addEventListener("keydown", (e) => {
    if (!section.querySelector(".testi__nav").contains(document.activeElement)) return; // seulement quand le focus est sur les flèches
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  });

  // ---------- Entrée au scroll ----------
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const first = parts(slides[0]);
    const lines = split(first.quote);
    gsap.set(icon, { opacity: 0, scale: 0.7, rotation: -8, transformOrigin: "30% 70%" });
    gsap.set(label, { opacity: 0, y: 12 });
    gsap.set(lines.lines, { yPercent: 105 });
    gsap.set(first.meta, { opacity: 0, y: 12 });
    const entry = gsap
      .timeline({ paused: true })
      .to(icon, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.6)" }, 0)
      .to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.05)
      .to(lines.lines, { yPercent: 0, ...IN, duration: 1 }, 0.15)
      .to(first.meta, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 0.7);

    // end: "max" : si on saute au-delà de la section, l'entrée est quand même jouée.
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "max",
      onToggle: (self) => (self.isActive ? entry.play() : entry.reverse()),
    });

    // Un contrôle focalisé avant la révélation ne reste jamais sur un contenu invisible.
    const reveal = () => entry.progress(1);
    nav.addEventListener("focusin", reveal);
    return () => {
      nav.removeEventListener("focusin", reveal);
      lines.revert();
      gsap.set([icon, label, ...first.meta], { clearProps: "opacity,transform" });
    };
  });
}
