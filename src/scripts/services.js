// Liste des services (ANIMATIONS.md §6) : à l'entrée dans l'écran, les filets se dessinent et les lignes montent en cascade.
// Réversible : en remontant au-dessus de la section, tout se replie. Le survol est en CSS (services.css).
import { gsap, ScrollTrigger } from "./core.js";

export function initServices() {
  const section = document.getElementById("services");
  if (!section) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const label = section.querySelector(".label");
    const rows = [...section.querySelectorAll(".service-row")];
    const rules = rows.map((row) => row.querySelector(".service-row__rule"));
    const texts = rows.flatMap((row) => [...row.querySelectorAll(".service-row__title, .service-row__text")]);

    const tl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        // Les styles inline sont retirés une fois la cascade finie : le survol (opacité des descriptions) reprend la main en CSS.
        // Opacité seule avant l'entrée : un lien invisible reste dans l'arbre d'accessibilité et au clavier.
        onComplete: () => gsap.set(texts, { clearProps: "opacity,transform" }),
      })
      .fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
      .fromTo(rules, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.inOut", stagger: 0.08 }, 0.05)
      .fromTo(texts, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.025 }, 0.1);

    // end: "max" : si on saute au-delà de la section, la cascade est quand même jouée.
    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      end: "max",
      refreshPriority: -1, // après le pin de la scène, qui décale la section
      onToggle: (self) => (self.isActive ? tl.play() : tl.reverse()),
    });
  });
}
