// Section Réalisations (retours-v2/docs/02-SECTION-REALISATIONS.md). Desktop avec mouvement : la section remonte par-dessus « Notre
// approche » (marge négative en CSS, comme les services le faisaient), puis s'épingle. Les deux colonnes défilent ensemble dans
// UNE timeline : la liste de titres et la pile de photos montent du même nombre de crans, donc quand le titre i est sur la ligne
// centrale, la photo i est centrée à droite, sans décalage possible. Le titre le plus proche de la ligne centrale est « actif » :
// point orange, texte décalé, soulignement dessiné. Les services remontent ensuite par-dessus (CSS, classe real-anim).
// Positions et durées sont exprimées en écrans de scroll (1 unité = 1 écran), comme la scène de l'accueil.
// Mobile et mouvement réduit : pas de pin, cartes en grille (realisations.css), simple apparition au scroll.
import { gsap, ScrollTrigger, lenis, scrollTo } from "./core.js";

const DESKTOP = {
  move: 0.7, // écrans de scroll entre deux réalisations (≈ 70 vh)
  hold: 0.3, // tenue sur la dernière réalisation avant l'arrivée des services (≈ 30 vh)
  overlap: 1, // les services remontent pendant le dernier écran : même valeur que la marge négative de .services en CSS
  scrub: 0.8,
};
const ENTERED_AT = 0.55; // part de la montée à partir de laquelle le premier titre devient actif
const HYSTERESIS = 0.08; // le titre actif ne change qu'à 0,58 cran de distance : pas de bascule en va-et-vient à mi-chemin

// Aimantation douce : quand le scroll s'arrête entre deux réalisations, la page se pose sur la plus proche. SNAP = false la désactive.
// Faite avec Lenis (scrollTo) et non avec le snap de ScrollTrigger, qui se bat avec le lissage de Lenis.
const SNAP = true;
const SNAP_DELAY = 140; // ms sans défilement avant de s'aimanter
const SNAP_DURATION = 0.5; // s
const SNAP_BIAS = 0.4; // amorce directionnelle : un geste de plus de 10 % d'un cran (0,5 - 0,4) vers l'avant ou l'arrière passe à la suivante ou à la précédente

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function initRealisations() {
  const section = document.getElementById("realisations");
  if (!section) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => desktop(section));
  mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => cards(section));
}

function desktop(section) {
  const root = document.documentElement;
  const pin = section.querySelector(".realisations__pin");
  const label = section.querySelector(".realisations__label");
  const win = section.querySelector(".realisations__window");
  const list = section.querySelector(".realisations__list");
  const media = section.querySelector(".realisations__media");
  const photos = section.querySelector(".realisations__photos");
  const dim = section.querySelector(".realisations__dim");
  const items = [...list.children].map((li) => ({
    link: li.querySelector("a"),
    dot: li.querySelector(".real-title__dot"),
    text: li.querySelector(".real-title__text"),
    line: li.querySelector(".real-title__line"),
    mark: { l: 0, r: 100 }, // bords gauche et droit rognés du trait (%), voir paint() : 0 / 100, trait invisible
    active: false,
    hover: false,
    focus: false,
    shown: false,
  }));
  const N = items.length;
  const moves = (N - 1) * DESKTOP.move;
  const total = moves + DESKTOP.hold + DESKTOP.overlap;

  root.classList.add("real-anim"); // les services remontent par-dessus (stage.css)
  // Les photos de la pile sont toutes chargées d'avance : elles sont hors écran, en dessous, et arriveraient sinon avec retard.
  photos.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });

  // Pas de la liste et de la pile, mesurés dans la mise en page (offsetTop ignore les transformations).
  const step = (parent) => parent.children[1].offsetTop - parent.children[0].offsetTop;

  // État de la section : les fonctions ci-dessous sont appelées par les timelines dès leur création.
  let entered = false; // la montée a dépassé ENTERED_AT
  let index = -1; // titre actif, -1 : aucun

  // ---------- Défilement : une timeline pour les deux colonnes ----------
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${total * pin.offsetHeight}`,
      pin,
      scrub: DESKTOP.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  const st = tl.scrollTrigger;
  const exit = total - DESKTOP.overlap;
  tl.to(list, { y: () => -(N - 1) * step(list), duration: moves }, 0)
    .to(photos, { y: () => -(N - 1) * step(photos), duration: moves }, 0)
    // Sortie : les services recouvrent la section, qui s'assombrit un peu, et la liste rétrécit de 4 % autour du dernier titre.
    .to(dim, { opacity: 0.4, duration: DESKTOP.overlap }, exit)
    .to(list, { scale: 0.96, transformOrigin: () => `0px ${(2 + N - 0.5) * step(list)}px`, duration: DESKTOP.overlap }, exit)
    .set({}, {}, total); // fixe la durée : 1 unité de timeline = 1 écran de scroll
  tl.eventCallback("onUpdate", () => refreshActive());

  // ---------- Entrée : la section remonte par-dessus « Notre approche » ----------
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const now = self.progress >= ENTERED_AT;
          if (now === entered) return;
          entered = now;
          refreshActive();
        },
      },
    })
    .fromTo(media, { y: () => pin.offsetHeight * 0.3 }, { y: 0, duration: 1 }, 0)
    .fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35)
    .fromTo(win, { opacity: 0, y: "3vw" }, { opacity: 1, y: 0, duration: 0.5 }, 0.3);

  // ---------- Titre actif ----------

  // Le trait est animé via un objet simple dont paint() recopie les valeurs dans les variables CSS. GSAP perd la trace d'une variable
  // CSS dont le tween est interrompu (son cache n'est plus à jour : un set final restait sans effet).
  const paint = (item) => {
    item.line.style.setProperty("--l", item.mark.l);
    item.line.style.setProperty("--r", item.mark.r);
  };

  // Les trois états (actif, survolé, focalisé) donnent le même aperçu : le point apparaît, le texte glisse, le trait se dessine.
  // Il se retire en sens inverse : point qui rétrécit, texte qui revient, trait qui part vers la droite. Chaque changement
  // interrompt explicitement les tweens du titre (killTweensOf) : l'overwrite automatique ne voit pas un tween pas encore démarré,
  // et un titre activé puis désactivé dans la même image (scroll rapide) gardait son trait. Le nouveau tween repart de l'état en cours.
  const parts = (item) => [item.dot, item.text, item.mark];
  const show = (item) => {
    gsap.killTweensOf(parts(item));
    gsap.to(item.dot, { scale: 1, duration: 0.35, ease: "back.out(2)" });
    gsap.to(item.text, { x: "2.2vw", duration: 0.45, ease: "power3.out" });
    gsap.to(item.mark, { l: 0, r: 0, duration: 0.45, ease: "power3.out", onUpdate: () => paint(item) });
  };
  const hide = (item) => {
    gsap.killTweensOf(parts(item));
    gsap.to(item.dot, { scale: 0, duration: 0.25, ease: "power2.in" });
    gsap.to(item.text, { x: 0, duration: 0.4, ease: "power3.out" });
    gsap.to(item.mark, {
      l: 100,
      r: 0,
      duration: 0.35,
      ease: "power2.in",
      onUpdate: () => paint(item),
      onComplete: () => {
        // prêt à se redessiner depuis la gauche
        item.mark.l = 0;
        item.mark.r = 100;
        paint(item);
      },
    });
  };
  const sync = (item) => {
    const on = item.active || item.hover || item.focus;
    if (on === item.shown) return;
    item.shown = on;
    if (on) show(item);
    else hide(item);
  };
  const setActive = (next) => {
    if (next === index) return;
    if (index >= 0) { items[index].active = false; sync(items[index]); }
    index = next;
    if (index >= 0) { items[index].active = true; sync(items[index]); }
  };
  // L'indice vient de la position lissée de la timeline (celle que l'on voit à l'écran), pas du scroll brut.
  function refreshActive() {
    if (!entered) return setActive(-1);
    const f = clamp(tl.time() / DESKTOP.move, 0, N - 1);
    let next = index < 0 ? Math.round(f) : index;
    if (Math.abs(f - next) > 0.5 + HYSTERESIS) next = Math.round(f);
    setActive(next);
  }

  // ---------- Clavier, survol ----------
  // Position de scroll où la réalisation i est sur la ligne centrale.
  const scrollOf = (i) => st.start + ((i * DESKTOP.move) / total) * (st.end - st.start);
  const listeners = items.map((item, i) => {
    const on = {
      mouseenter: () => { if (matchMedia("(hover: hover)").matches) { item.hover = true; sync(item); } },
      mouseleave: () => { item.hover = false; sync(item); },
      // Un titre focalisé au clavier peut être hors de la fenêtre : on amène le scroll à sa réalisation, instantanément.
      focus: () => {
        item.focus = true;
        sync(item);
        if (i !== index) scrollTo(scrollOf(i), { immediate: true });
      },
      blur: () => { item.focus = false; sync(item); },
    };
    Object.entries(on).forEach(([type, fn]) => item.link.addEventListener(type, fn));
    return () => Object.entries(on).forEach(([type, fn]) => item.link.removeEventListener(type, fn));
  });

  // ---------- Aimantation ----------
  let timer;
  let rest = window.scrollY; // position où le dernier geste a commencé : sa direction vient de là
  const snap = () => {
    if (lenis.isScrolling) { timer = setTimeout(snap, SNAP_DELAY); return; }
    const from = rest;
    rest = window.scrollY;
    if (!st.isActive) return;
    const p = st.progress;
    const last = moves / total; // progression de la dernière réalisation ; au-delà : tenue puis services, scroll libre
    if (p > last) return;
    const unit = last / (N - 1); // progression d'un cran
    const dir = Math.sign(window.scrollY - from);
    const stop = clamp(Math.round(p / unit + dir * SNAP_BIAS), 0, N - 1) * unit;
    const target = st.start + stop * (st.end - st.start);
    if (Math.abs(target - window.scrollY) < 2) return;
    rest = target;
    lenis.scrollTo(target, { duration: SNAP_DURATION, easing: gsap.parseEase("power2.inOut"), userData: { snap: true } });
  };
  const unsubscribe = SNAP
    ? lenis.on("scroll", (instance) => {
        if (instance.userData?.snap) return; // notre propre défilement
        clearTimeout(timer);
        timer = setTimeout(snap, SNAP_DELAY);
      })
    : null;

  return () => {
    clearTimeout(timer);
    unsubscribe?.();
    listeners.forEach((off) => off());
    root.classList.remove("real-anim");
    gsap.killTweensOf(items.flatMap(parts));
  };
}

// Mobile : les cartes (titre puis photo) apparaissent en fondu et montée de 24 px à l'entrée dans l'écran, réversible.
function cards(section) {
  const blocks = [...section.querySelectorAll(".real-title, .real-photo")];
  gsap.set(blocks, { opacity: 0, y: 24 });
  ScrollTrigger.batch(blocks, {
    start: "top 90%",
    end: "max",
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
    onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 24, duration: 0.4, ease: "power2.in", overwrite: true }),
  });
}
