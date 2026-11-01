# Plan : page Réalisations V4

Spec : `SPEC-realisations.md`. Ce plan est séparé de `tasks/plan.md` et `tasks/todo.md` (travail des pages secondaires, T31 et T32 en attente) : on n'y touche pas.

## Graphe de dépendances
```
T1 données, photos, balisage, CSS de base (page lisible sans JS)
 ├─ T2 hero : scène épinglée, photos qui montent ──► T3 photo plein écran + texte ──► T4 crème qui remonte, header olive
 └─ T5 filtres (Flip) ──► T6 grille : dégradé, « Voir plus »
T2..T6 ──► T7 mobile, mouvement réduit, sans JavaScript ──► T8 vérification, baseline, revue, commit
```
Les pistes T2 à T4 (scène) et T5 à T6 (grille) sont indépendantes après T1 : elles touchent des fichiers différents (`projets-stage.js` et `projets-hero.css` contre `projets-grid.js` et `projets-grid.css`), seuls `main.js` et `main.css` sont communs, donc build séquentiel.

## Impact sur le code partagé (graphify)
- `scripts/intro.js` : lu par `main.js` seulement, mais exécuté sur les 13 pages. Gardes ajoutées (feuilles et tags absents) : sans effet quand ils existent.
- `main.js` : point d'entrée de toutes les pages ; 2 imports et 2 entrées (les modules ne font rien si leurs éléments sont absents).
- `components/page-sections.js` : 21 imports, aucun dépendant dans le graphe (le plugin d'injection le charge) ; seules les pages qui déclarent les nouveaux types sont touchées.
- `sections/filters-grid.js` et `scripts/realisations-filter.js` : propres à cette page (un seul importeur chacun), supprimés ou réécrits.
- Hors graphe (CSS, HTML) : `html.js .hero__title` masque le titre jusqu'à l'intro ; les règles de la page sont préfixées `body[data-page="page"]`.

## Tâches
Chaque tâche UI vérifie : états (sans JS, mouvement réduit), 375, 768 et 1280 de large, clavier seul, contraste AA (exceptions notées), jetons de couleur, `prefers-reduced-motion`.

- [x] **T1 Données, photos, balisage**
  - Acceptation : 13 photos rognées dans `public/assets/images/projets/` (manifeste à jour) ; 32 cartes en données (8 réelles, 24 `todo`, compteurs 12/3/4/5/6/2) ; page rendue complète sans JavaScript (hero, photo, texte, filtres masqués, grille de 32).
  - Vérification : `npm run build` sans avertissement ; `node scripts/check-site.js` (exceptions de la maquette listées) ; ouverture de `dist/realisations/index.html`.
  - Fichiers : `scripts` de copie (hors dépôt), `data/pages/realisations.js`, `sections/projets-hero.js`, `sections/projets-grid.js`, `page-sections.js`, `check-site.js`.
- [x] **T2 UI Hero** : scène épinglée, 4 photos qui montent à 3 vitesses, titre et compteur
  - Acceptation : frames 01 à 04 ; header blanc sur orange ; `translateY` scrubé ; `invalidateOnRefresh` ; reconstruction au changement de largeur.
  - Vérification : captures à 0, 0,5 et 1,2 écran de scroll ; console vide.
  - Fichiers : `scripts/projets-stage.js`, `styles/projets-hero.css`, `main.js`, `main.css`, `intro.js`.
- [x] **T3 UI Photo plein écran et texte** : photo 05 en carte puis plein écran (`clip-path` et `scale`), voile, label, titre à pastille, CTA
  - Acceptation : frames 05 à 11 ; aucune animation de `width` ou `height` ; CTA atteignable au clavier (le scroll l'amène).
  - Vérification : captures aux frames 05, 07, 09, 11.
- [x] **T4 UI Section crème qui remonte** : marge négative, `z-index`, texte qui s'efface, photo qui s'assombrit, header olive
  - Acceptation : frames 12 à 15 ; header olive dès que la crème couvre son centre.
  - Vérification : captures aux frames 12 à 15 ; scroll arrière identique.
- [x] **Point de contrôle A** : scène complète à 1728 x 1030, comparée aux frames 01 à 15 ; build ; `.baseline` en `--fast`.
- [x] **T5 UI Filtres** : 7 boutons `aria-pressed`, compteurs, sortie puis réorganisation (Flip chargé à la demande), annonce `aria-live`
  - Acceptation : un filtre réellement filtrant au clic et au clavier ; compteur cohérent ; mouvement réduit sans animation.
  - Vérification : clic sur « Terrasses » (3) puis « Végétalisation de bureaux » (12), retour à « Tous ».
- [x] **T6 UI Grille, dégradé, « Voir plus »** : 8 cartes, masque sur la dernière rangée, lots de 8 en cascade, bouton retiré à la fin
  - Acceptation : frames 16 à 19 ; dégradé et bouton absents quand le filtre a 8 cartes ou moins ; focus conservé.
  - Vérification : 3 clics sur « Voir plus » (8, 16, 24, 32) ; filtre à 3 cartes sans dégradé.
- [x] **Point de contrôle B** : page entière, footer inchangé, `.baseline` complète.
- [x] **T7 UI Mobile, mouvement réduit, sans JavaScript**
  - Acceptation : moins de 900 px : 3 photos, filtres à 28 px sans coupe, grille à 1 colonne avec dégradé ; mouvement réduit : hero statique, empilement ; aucun débordement horizontal de 320 à 1920.
  - Vérification : captures 390 x 844 et 768 x 1024 ; `emulateMedia` mouvement réduit ; JavaScript coupé.
- [x] **T8 Vérification et livraison**
  - Acceptation : comparaison aux 19 frames, écarts listés ; `node .baseline/gate.mjs` propre (rejeu en cas d'échec isolé) ; `/design:review` traité ; `docs/POINTS-A-VALIDER.md` complété ; un commit.
  - Vérification : sorties collées dans le compte rendu.

## Résultat (2026-11-01)
- T1 à T8 faites, un seul commit. Porte `.baseline` complète propre : build sans avertissement, HTML de l'accueil et de Noël identique octet pour octet, 16 captures, `check-site` à 13 pages sans écart.
- Mesuré : aucun débordement horizontal de 320 à 1920 px, console vide (bureau, mobile, mouvement réduit, après redimensionnement), clavier (le CTA de la scène est atteint en 4 tabulations), 7 filtres et 4 « Voir plus » vérifiés, clics rapides cohérents.
- Écarts connus et points à trancher : `docs/POINTS-A-VALIDER.md`, lignes 158 à 167.
