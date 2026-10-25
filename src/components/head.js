// Éléments communs du <head> : encodage, viewport, favicon, polices. Title et meta restent propres à chaque page.
const fonts =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500&family=Poppins:wght@300;400;500&display=swap";

export default () => `<meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fonts}" />`;
