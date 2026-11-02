# Spec : page Végétalisation de bureaux V5

Sources : `retours-v5/docs/00` à `05`, `retours-v5/references/bureaux-frames/INDEX.md` et les 54 frames (la 40 est un doublon, la 54 est ignorée), état des lieux du 2026-11-02. Cette spec est séparée de `SPEC.md` et `tasks/plan.md` (pages secondaires, T31 et T32 en attente) : on n'y touche pas.

## Objectif
Refondre `/vegetalisation-bureaux-paris/` pour qu'elle suive la maquette V5, au pixel près, avec toutes les animations au scroll : hero olive qui s'efface sous les chiffres, chiffres animés, 5 cartes en défilement horizontal, section orange puis photo plein écran puis slider des 3 matières, « Pourquoi végétaliser » à ligne active, « Notre fonctionnement » (inchangé), logos et avis, galerie orange qui monte, FAQ, footer. Public : entreprises (startups, grands groupes, hôtels, restaurants) qui cherchent à végétaliser leurs bureaux ; la page prouve le savoir-faire et mène au devis. Le design et les textes de la maquette priment sur la page actuelle.

## Carte des capacités (dépendances, ordre de build = ordre de la page)
| Id | Module | Dépend de | Fichiers propres |
|---|---|---|---|
| M0 | Ordre, assets, point d'entrée `bureaux.js` | rien | `bureaux.js` (données), `main.js`, `main.css`, `page-sections.js`, `public/assets/images/bureaux/` |
| M1 | Hero (entrée, sortie sous le crème) | M0 | `sections/hero.js` (props), `bureaux-hero.js`, `bureaux-hero.css` |
| M2 | Chiffres clés (cascade et compteurs) | M0 | `sections/bureaux-chiffres.js`, `bureaux-chiffres.js`, `.css` |
| M3 | Cartes horizontales (pin, vague) | M2 | `sections/bureaux-installe.js`, `bureaux-installe.js`, `.css` |
| M4 | Trois matières : orange puis photo plein écran | M3 | `sections/bureaux-matieres.js`, `bureaux-matieres.js`, `.css` |
| M5 | Slider des 3 matières (même élément que M4) | M4 | mêmes fichiers que M4 |
| M6 | Pourquoi végétaliser (liste à ligne active) | M5 | `sections/bureaux-pourquoi.js`, `bureaux-pourquoi.js`, `.css` |
| M7 | Fonctionnement (inchangé), logos, avis | M6 | `sections/logos.js` et `noel-testimonials.js` (props), `bureaux-clients.css` |
| M8 | Galerie qui monte | M7 | `sections/bureaux-galerie.js`, `bureaux-galerie.js`, `.css` |
| M9 | FAQ, placement final, footer | M8 | données seulement |
Les modules touchent des fichiers différents, mais `main.js`, `main.css` et `page-sections.js` sont communs : build séquentiel.

## Hypothèses retenues (valeurs par défaut validées au lancement)
1. « Notre fonctionnement » n'existe qu'une fois ; l'ordre se corrige en déplaçant « Pourquoi » (3e vers 5e). Le CTA « Découvrir nos abonnements » est omis sur cette page (absent de l'image 37), le label devient « NOTRE FONCTIONNEMENT » (frames 37 et 40).
2. Les 5 cartes horizontales sont un composant neuf (aucune carte « photo + carte blanche tournées » n'existe sur l'accueil), au style des `.stat-card`.
3. Avis Thunes posé avec `fictif: true` tant que son statut n'est pas tranché (contradiction avec `docs/POINTS-A-VALIDER.md` ligne 100) ; flèches visibles et inertes avec un seul avis.
4. Chiffres `+30`, `+10 ans`, `100%` repris du design et signalés à confirmer ; faute « tout types » corrigée en « tous types » ; « transforment » corrigé en « transforme ».
5. `cta-final` retiré de cette page (absent de l'ordre V5 et des frames, le footer porte déjà l'appel).
6. Chiffres : cascade non épinglée avec compteurs lancés une fois, sans toucher à `stats.js` ni `stats-cards.js` (accueil, épinglé et scrubé).
7. FAQ à 5 questions ; la réponse « Peut-on personnaliser aux couleurs de notre marque ? » est `[À compléter]`. Le doc 03 se trompe sur la colonne sticky : les frames 50 à 52 montrent titre et cartes qui montent ensemble, le composant n'est pas modifié.
8. Les mesures des frames priment sur les « environ » des docs (ex. photo de l'image 21 : 852 px, pas 400).
9. Textes absents du copywriting 02 (maquette V5) : déclarés dans `designTexts` de la page, que `check-site` compte au lieu de refuser.

## Commandes
- Dev : `npm run dev` (images optimisées avant) ; relecture des liens : `npm run dev:liens`.
- Build : `npm run build` sans avertissement ; contrôle : `node scripts/check-site.js` (`--placeholders` liste les `[À compléter]`).
- Non-régression : `node .baseline/gate.mjs` (HTML de l'accueil et de Noël identique, 16 captures) ; une panne isolée se rejoue (`capture.mjs` puis `compare.mjs`) avant de conclure.
- Captures : script jetable avec `playwright-core` de `.baseline/node_modules` (Chrome installé), 1728 x 1030, scratchpad de session, jamais dans le dépôt.

## Structure
- `public/assets/images/bureaux/` : 12 PNG fournis, à plat (`fond-01` à `03`, `carte-01` à `05`, `galerie-01` à `04` : le script d'optimisation ne lit qu'un niveau de dossier) ; WebP générés par `scripts/optimize-images.js` (manifeste lu par `components/img.js`). `public/assets/logos-clients/` : 6 SVG tels quels (`thunes`, `chez-simone`, `inato`, `eataly`, `keobiz`, `yves-rocher`), dimensions dans `src/data/logos.js`.
- `src/data/pages/bureaux.js` : toutes les données et tous les textes ; aucun texte en dur dans le HTML ou le JS.
- `src/components/sections/bureaux-*.js` : balisage rendu au build (page complète et lisible sans JavaScript).
- `src/scripts/bureaux.js` : point d'entrée chargé par `import()` dynamique depuis `main.js` quand la page porte `[data-bx]` (chunk à part, bundle commun inchangé ; précédent : Flip dans `projets-grid.js`). Un module par section, chacun avec sa `gsap.matchMedia` (nettoyée par le revert de GSAP).
- `src/styles/bureaux-*.css`, importés par `main.css`, règles préfixées `body[data-page="page"]`, couleurs par variables de `tokens.css`.
- Partagé, modifié avec garde-fous et `/graphify:impact` : `main.js` (un `import()`), `main.css` (imports), `page-sections.js` (types), `sections/hero.js` et `intro.js` (props et gardes, comportement inchangé quand elles sont absentes), `sections/logos.js`, `noel-testimonials.js` (props optionnelles, HTML de Noël identique).
- Thème du header : `data-header-theme="light"` + `data-header-gradient` par section (`cream`, `orange`, `photo`, `olive`), jamais de changement de `header-theme.js`.

## Style de code
Commentaires en français qui expliquent le pourquoi ; aucun tiret long ; aucune valeur hexadécimale dans les composants ; positions en variables CSS (`--x --y --w`), vitesses en `data-speed`, durées en écrans de scroll (1 unité = 1 écran).

```js
// Hero épinglé un écran, la section crème (marge -100svh) monte par-dessus, comme Nos univers sur Noël.
gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "+=100%", pin: true, scrub: true, invalidateOnRefresh: true } })
  .fromTo(content, { opacity: 1 }, { opacity: 0.3, duration: 0.85 }, 0.15); // sans y : les frames 01, 03 et 04 ne montrent aucun déplacement
```

## Tests
Pas de framework de test : vérification par mesures. (1) Build et `check-site` sans écart ni avertissement. (2) Captures 1728 x 1030 aux positions des frames, comparées à l'oeil. (3) Console vide, un seul `h1`, « Notre démarche pour » une seule fois dans le HTML généré. (4) `.baseline` : accueil et Noël identiques. (5) 390, 768, 1440 et 1920 de large : aucun défilement horizontal. (6) Mouvement réduit et sans JavaScript : sections empilées, lisibles, valeurs finales des compteurs. (7) Thème du header relevé à chaque raccord de section (pas de trou ni de clignotement). (8) `/design:review` sur chaque diff.

## Limites
- Toujours : `transform`, `opacity`, `clip-path` seulement ; `invalidateOnRefresh: true` ; `prefers-reduced-motion` ; mobile sous 900 px ; `will-change` seulement pendant l'animation ; `[À compléter]` avec `data-placeholder` pour tout texte manquant.
- Demander avant : toute modification de `core.js`, `site.js`, header, menu, footer, `tag`, `cta`, `stats.js`, `process`, `faq` ; toute dépendance ; tout écart entre une frame et un doc qui change le visuel.
- Jamais : toucher à l'accueil, à Noël, à Services, à l'apparition du footer, à l'animation du CTA ; inventer un témoignage ou un chiffre ; réécrire `.baseline/reference*` ; `live: true` sans feu vert ; commiter `node_modules`, `dist` ou `graphify-out`.
