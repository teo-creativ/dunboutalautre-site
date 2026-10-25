// Éléments communs du <head> : encodage, viewport, favicon, polices. Title et meta restent propres à chaque page.
const fonts =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500&family=Poppins:wght@300;400;500&display=swap";

// La classe js masque les éléments de l'intro avant l'initialisation de GSAP (aucun flash). Si le script tarde ou échoue,
// le filet de sécurité la retire au bout de 4 s et tout redevient visible.
const jsFlag = `document.documentElement.classList.add("js");window.__introFailsafe=setTimeout(function(){document.documentElement.classList.remove("js")},4000)`;

export default () => `<meta charset="utf-8" />
    <script>${jsFlag}</script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fonts}" />`;
