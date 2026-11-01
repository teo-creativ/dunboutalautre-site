# Spec : page Réalisations V4

Sources : `retours-v4/docs/01-REALISATIONS.md`, frames `realisations-01.jpg` à `19.jpg`, réponses du fondateur du 2026-11-01 (photo de 739 px acceptée, textes de la maquette repris, exceptions `check-site` validées).

## Objectif
Remplacer le hero compact et la grille générique de `/realisations/` par la page de la maquette V4 : hero orange « Nos projets. (32) » avec photos qui montent, photo qui grandit en plein écran avec texte et CTA, section crème qui remonte par-dessus, 7 filtres géants, grille de 8 cartes (dégradé et « Voir plus » par lots de 8), footer inchangé. Public : prospects entreprises, hôtels, restaurants, particuliers ; la page prouve le savoir-faire et mène au devis.

## Hypothèses retenues (validées ou par défaut)
1. Textes lus sur la maquette (frames), pas dans le copywriting : exceptions explicites dans `check-site`.
2. Les 7 filtres de la maquette l'emportent sur le copywriting 09 (« Décoration de Noël » séparée, pas d'« Ateliers végétaux »).
3. 32 projets en tout : 8 cartes fournies, 24 cartes `todo` (titre `[À compléter]`, photos réutilisées) ; catégories réparties pour que chaque compteur soit exact (12, 3, 4, 5, 6, 2).
4. `realisation-05.png` (739 x 471) sert en plein écran : flou assumé, noté dans les points à valider.
5. Coins arrondis gravés dans les PNG (rayon 12 px) : rognés de 13 px par bord à la copie ; le rayon vient du CSS.
6. Flip de GSAP (dans le paquet `gsap`, non enregistré) chargé à la demande sur cette page seulement.

## Commandes
- Dev : `npm run dev` (images optimisées avant) ; relecture des liens : `npm run dev:liens`.
- Build : `npm run build` (sans avertissement) ; contrôle : `node scripts/check-site.js`.
- Non-régression : `node .baseline/gate.mjs` (rejouer capture + comparaison avant de conclure à un échec isolé).
- Captures de la page : sonde Playwright (`.baseline/probe.mjs`, Chrome installé), 1728 x 1030.

## Structure
- `public/assets/images/projets/` : 13 photos (hero 01 à 05, cartes 01 à 08), rognées, dimensions lues dans le manifeste.
- `src/data/pages/realisations.js` : données de la page (sections `projets-hero` et `projets-grid`, 32 cartes avec `category`).
- `src/components/sections/projets-hero.js`, `projets-grid.js` : balisage rendu au build (HTML complet sans JavaScript).
- `src/scripts/projets-stage.js` : scène épinglée ; `src/scripts/projets-grid.js` : filtres, Flip, « Voir plus ».
- `src/styles/projets-hero.css`, `projets-grid.css`, importées par `main.css`, règles préfixées `body[data-page="page"]`.
- Partagé, modifié avec garde-fous : `main.js` (2 imports, 2 entrées), `main.css` (imports), `page-sections.js` (types), `intro.js` (gardes sur feuilles et tags absents, comportement inchangé quand ils existent).
- Retiré (propre à cette page) : `sections/filters-grid.js`, `styles/filters-grid.css`, `scripts/realisations-filter.js`.

## Style de code
Commentaires en français qui expliquent le pourquoi ; pas de tiret long ; couleurs par variables CSS ; positions des photos en variables `--x --y --w --ratio` (vw et svh), vitesse en `data-speed`, comme le flux de Noël.

```js
// Photo qui monte : vitesse en svh par écran de scroll (100 = la vitesse de la page).
tl.fromTo(photo, { y: 0 }, { y: () => -(speed / 100) * dur * stage.clientHeight, duration: dur, ease: "none" }, 0);
```

## Tests
Pas de framework de test dans le projet : vérification par mesures. (1) Build et `check-site` sans écart. (2) Captures 1728 x 1030 aux moments des 19 frames, comparées à l'oeil. (3) Un filtre, puis « Voir plus », au clavier aussi ; console vide. (4) `.baseline` : accueil et Noël identiques. (5) 390, 768, 1440 et 1920 de large : aucun débordement horizontal. (6) Mouvement réduit et sans JavaScript : sections empilées lisibles. (7) `/design:review` sur le diff.

## Limites
- Toujours : `transform`, `opacity`, `clip-path` animés (le masque du dégradé est le seul paint animé, demandé par le doc) ; `invalidateOnRefresh: true` ; `prefers-reduced-motion` ; `will-change` seulement pendant la scène.
- Demander avant : `core.js`, `site.js`, header, menu, footer, `tag`, `cta` ; toute dépendance ; `live: true`.
- Jamais : toucher à l'accueil, à Noël, au footer ; inventer un nom de projet ou un chiffre ; réécrire `.baseline/reference*`.

## Critères de réussite
1. Hero conforme aux frames 01 à 05 (5 photos aux positions du doc, vitesses lente/moyenne/rapide, titre et compteur lus dans `site.js`).
2. La photo 05 couvre l'écran sans animer `width` ni `height` ; texte « la même passion » et CTA visibles ; header blanc sur orange et sur photo.
3. La section crème remonte par-dessus (marge négative, `z-index`), header olive dès qu'elle couvre le haut.
4. 7 filtres `aria-pressed`, clavier compris, réellement filtrants ; compteurs exacts ; Flip ou fondu simple.
5. 8 cartes, dégradé sur la dernière rangée, « Voir plus » par 8 en cascade, dégradé et bouton retirés quand il n'y a plus rien ; annonce `aria-live`.
6. Aucun débordement horizontal ; console vide ; footer et `.baseline` inchangés.

## Questions ouvertes
Vrais noms et catégories des cartes 5 à 8 et 9 à 32 ; photo plein écran en haute définition ; contraste des filtres en sable (1,6:1).
