# 01 : Setup et structure

```
Lis CLAUDE.md puis réalise le setup du projet.

À faire :
1. Initialise le projet Vite en JavaScript vanilla, multi-pages : `index.html` (accueil) et `decoration-noel-entreprises-paris/index.html` (landing Noël). Un squelette existe déjà (package.json, vite.config.js, index.html, src/). Complète-le et corrige-le si besoin.
2. Installe les dépendances : gsap (3.13 ou plus, SplitText et ScrollTrigger inclus, gratuits), lenis. Vérifie que `import { SplitText } from "gsap/SplitText"` fonctionne avec la version installée. Sinon, mets à jour gsap.
3. Charge les polices Poppins (300, 400, 500) et Playfair Display (italic 400, 500) depuis Google Fonts avec `preconnect` et `display=swap`. Prévois une police de repli proche (system-ui pour Poppins, Georgia pour Playfair).
4. Mets en place l'arborescence :
   - src/styles/ : tokens.css, base.css, puis un fichier par composant, tous importés dans main.css
   - src/scripts/ : main.js (initialise Lenis, GSAP, ScrollTrigger), puis un fichier par composant ou animation
   - src/data/site.js : e-mail, téléphone, Instagram, nombre de réalisations, liens de navigation (fictifs), services, chiffres clés (voir docs/CONTENU-ACCUEIL.md)
   - src/components/ : fonctions JS qui rendent le header, le menu, le footer et les CTA en HTML (une seule source pour les deux pages)
5. Initialise Lenis (une seule instance) et branche-le sur ScrollTrigger : `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.
6. Structure sémantique de l'accueil avec les sections vides et leurs `id` : header, main (hero, experience, services, stats), footer. `lang="fr"`, title et meta description (voir docs/CONTENU-ACCUEIL.md), viewport, favicon à partir de public/assets/brand/leaf.svg.
7. Ajoute un `.gitignore` (node_modules, dist), initialise git, fais un premier commit.

Vérifie : `npm install`, `npm run dev` (la page s'affiche sans erreur console), `npm run build` (OK). Résume ce que tu as fait et liste les fichiers créés.
```
