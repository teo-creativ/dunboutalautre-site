// « Pourquoi végétaliser vos bureaux ? » de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §6, frames bureaux-34 et 35). Pas de pin :
// la section est celle qui monte par-dessus « Trois matières » (marque posée par bureaux-matieres.js). Ici : la ligne active, et les filets.
// Ligne active : celle qu'on survole à la souris, sinon celle qu'on focalise au clavier, sinon celle qui croise 55 % de la hauteur de
// l'écran au scroll. La première est active au chargement. L'état est une classe (.is-active) : bureaux-pourquoi.css fait la transition de
// 0,4 s sur la couleur seulement (et la couleur du soulignement). Filets : scaleX de 0 à 1 depuis la gauche, à l'entrée de leur ligne ; l'entrée
// du titre et des lignes (fondu, y 24 px, cascade de 0,1 s) est celle de reveal.js (data-reveal). Mouvement réduit, JavaScript absent ou sous
// 900 px : toutes les lignes restent lisibles, sans état éteint (la section n'a pas la classe html.bx-why-anim).
import { gsap, ScrollTrigger } from "./core.js";

const LINE = "top 55%"; // la ligne de l'écran où une ligne devient active
const RULE_START = "top 88%";

export function initBureauxPourquoi() {
  const section = document.querySelector('[data-bx="pourquoi"]');
  if (!section) return;
  const rows = [...section.querySelectorAll(".why-row")];
  if (!rows.length) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const root = document.documentElement;
    root.classList.add("bx-why-anim");

    // Trois sources, par ordre de priorité : la ligne survolée à la souris, la ligne focalisée au clavier, la ligne donnée par le scroll.
    let scrolled = 0;
    let over = -1;
    let focused = -1;
    let shown = -1; // la ligne affichée active
    const show = () => {
      const i = over >= 0 ? over : focused >= 0 ? focused : scrolled;
      if (i === shown) return;
      shown = i;
      rows.forEach((row, k) => row.classList.toggle("is-active", k === i));
    };
    show();

    // Une ligne à la fois sous la ligne de 55 % : les lignes se touchent, il y en a toujours une seule (ou aucune hors de la liste).
    const triggers = rows.map((row, i) =>
      ScrollTrigger.create({
        trigger: row,
        start: LINE,
        end: LINE.replace("top", "bottom"),
        onToggle: (self) => {
          if (!self.isActive) return;
          scrolled = i;
          show();
        },
      }),
    );

    // Survol (souris et stylet seulement : un appui au doigt ne doit pas allumer puis éteindre la ligne) et clavier.
    const listeners = rows.map((row, i) => {
      row.tabIndex = 0; // atteignable au clavier : le focus active la ligne (anneau de focus-visible, base.css)
      const on = [
        ["pointerenter", (e) => e.pointerType !== "touch" && ((over = i), show())],
        ["pointerleave", (e) => e.pointerType !== "touch" && ((over = -1), show())],
        ["focusin", () => ((focused = i), show())],
        ["focusout", () => ((focused = -1), show())],
      ];
      on.forEach(([type, fn]) => row.addEventListener(type, fn));
      return () => {
        on.forEach(([type, fn]) => row.removeEventListener(type, fn));
        row.removeAttribute("tabindex");
      };
    });

    // Filets : de la gauche vers la droite, quand leur ligne entre. Le premier trait n'existe pas (les filets sont entre les lignes).
    const rules = rows.map((row) => row.querySelector(".why-row__rule")).filter(Boolean);
    gsap.set(rules, { scaleX: 0, transformOrigin: "0% 50%" });
    // Entrée : le filet se dessine en 1 s ; au scroll arrière il se retire vite (0,4 s), comme les autres révélations (reveal.js).
    rows.forEach((row) => {
      const rule = row.querySelector(".why-row__rule");
      if (!rule) return;
      ScrollTrigger.create({
        trigger: row,
        start: RULE_START,
        end: "max",
        onEnter: () => gsap.to(rule, { scaleX: 1, duration: 1, ease: "expo.out", overwrite: true }),
        onLeaveBack: () => gsap.to(rule, { scaleX: 0, duration: 0.4, ease: "power2.in", overwrite: true }),
      });
    });

    return () => {
      root.classList.remove("bx-why-anim");
      triggers.forEach((trigger) => trigger.kill());
      listeners.forEach((off) => off());
      rows.forEach((row) => row.classList.remove("is-active"));
      gsap.set(rules, { clearProps: "transform" });
    };
  });
}
