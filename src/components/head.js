// Éléments communs du <head> : encodage, viewport, favicon, polices. Title et meta restent propres à chaque page.
const fonts =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500&family=Poppins:wght@300;400;500&display=swap";

// La classe js masque les éléments de l'intro avant l'initialisation de GSAP (aucun flash). Si le script tarde ou échoue,
// le filet de sécurité la retire au bout de 6 s et tout redevient visible (l'initialisation attend les polices, 3 s au plus).
// scrollRestoration manuel dès le parsing : les pins ajoutent de la hauteur après coup, scroll-memory.js reprend la position.
// Si une position est à reprendre (rechargement, retour arrière), la page est masquée (restoring) jusqu'à ce que ce soit fait.
// footer-reveal : le footer devient fixe derrière le contenu. Posée ici, avant le premier rendu, avec les mêmes conditions que
// footer-reveal.js (que le JS confirme ou retire) : posée après, la bascule du footer compterait pour 1,0 de décalage de mise en page.
const jsFlag = `var h=document.documentElement,m=function(q){return matchMedia(q).matches};h.classList.add("js");history.scrollRestoration="manual";if(!m("(prefers-reduced-motion: reduce)")&&m("(min-width: 901px)"))h.classList.add("footer-reveal");try{var n=performance.getEntriesByType("navigation")[0];if(n&&(n.type==="reload"||n.type==="back_forward")&&+sessionStorage.getItem("dbal:scroll:"+location.pathname)>0)h.classList.add("restoring")}catch(e){}window.__introFailsafe=setTimeout(function(){h.classList.remove("js","restoring","footer-reveal")},6000)`;

// Preview non indexée : seulement quand VITE_NOINDEX=1 (workflow GitHub Pages). Le build normal n'ajoute rien.
const noindex = typeof process !== "undefined" && process.env?.VITE_NOINDEX === "1" ? '\n    <meta name="robots" content="noindex, nofollow" />' : "";

export default () => `<meta charset="utf-8" />
    <script>${jsFlag}</script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />${noindex}
    <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fonts}" />
    <noscript><style>.header .header__menu { display: none; }</style></noscript>`; // sans JavaScript le menu ne s'ouvre pas : la navigation reste dans le pied de page
