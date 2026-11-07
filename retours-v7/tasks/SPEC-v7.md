# Spec : pages services V7 (Scénographie, Terrasses, Décoration saisonnière, Entretien et abonnements)

Sources : `retours-v7/docs/00` à `07`, les 4 `INDEX.md` et les frames de `retours-v7/references/`, état des lieux du 2026-11-07 (porte `.baseline` verte sur `0d06fcf`). Cette spec est séparée de `SPEC.md` et `tasks/plan.md` (pages secondaires, T31 et T32 en attente) et des dossiers `retours-v5/tasks/` et `retours-v6/tasks/` : on n'y touche pas.

## Objectif
Refaire quatre pages au pixel près, avec leurs animations au scroll, sur `feature/pages-secondaires` : `/scenographie-vegetale-evenementiel-paris/`, `/amenagement-terrasse-paris/`, `/decoration-vegetale-saisonniere-paris/`, `/entretien-abonnement-plantes-entreprise-paris/`. Elles réutilisent les composants de Bureaux (V5), Design (V6), Noël et Réalisations sans changer leur rendu, et ajoutent cinq briques neuves. Utilisatrice finale : la cliente, qui relit sur la preview GitHub Pages ; le fondateur relit les points à valider.

## Carte des capacités (ordre de build = ordre des pages)
| Id | Module | Dépend de | Fichiers propres |
|---|---|---|---|
| S | Page Scénographie : assemblage, aucune brique neuve (hero, liste active, 2 cartes, processus, FAQ, CTA) | rien | `data/pages/scenographie.js`, `sections/hero.js` et `fiche-autres.js` (props), CSS de variante |
| P | Brique « texte sur photo plein écran » (photo qui monte sur le hero, voile, surtitre, texte, 2 pastilles) | S | `sections/bureaux-photo-texte.js`, `scripts/bureaux-photo-texte.js`, CSS |
| W | Brique « styles » (image fixe, liste, entrée active pilotée par le scroll, une image par entrée) | S | `sections/bureaux-styles.js`, `scripts/bureaux-styles.js`, CSS |
| B | Brique « bande de photos » (2 rangées en sens opposé, puis une seule image qui grandit) | W | `sections/bureaux-bande.js`, `scripts/bureaux-bande.js`, CSS |
| T | Page Terrasses = P + W + B + `bureaux-matieres` (profil « terrasses ») + fin de page | P, W, B | `data/pages/terrasses.js`, `bureaux-matieres.js` (profil) |
| D | Page Décoration = P + W + `bureaux-galerie` (lien du bouton) + cartes + fin de page | P, W | `data/pages/saisonniere.js`, `sections/bureaux-galerie.js` (prop) |
| F | Brique « cartes de formules » (3 cartes, 1 orange) | S | `sections/bureaux-formules.js`, CSS |
| C | Brique « cercle orange » (disque qui grandit depuis un centre, paramétrable) | F | `scripts/bureaux-cercle.js`, CSS |
| E | Page Entretien = liste active + F + C + `bureaux-matieres` (profil « entretien ») + clients + FAQ, sans CTA | F, C | `data/pages/entretien.js`, `bureaux-matieres.js` (profil) |
| R | Revue finale V7 | S, T, D, E | rien |
Un commit et un push par page : S, puis T (avec P, W, B), puis D, puis E (avec F, C), puis R. `main.js` n'est pas modifié : le chunk `bureaux.js` se charge déjà quand la page porte `[data-bx]`. `claimHeader` (`bureaux-header.js`) reçoit les noms des nouvelles scènes, sans changer Bureaux ni Design.

## Hypothèses retenues (défauts annoncés le 2026-11-07, à trancher par l'utilisateur au retour)
1. Les frames priment sur les docs ; chaque écart est listé dans `docs/POINTS-A-VALIDER.md` (section V7).
2. FAQ : on garde les réponses du copywriting existant (18 questions sur 19 en ont une) ; `[À compléter]` + `data-placeholder` seulement sans réponse (Entretien : résiliation). Les questions prennent le libellé des docs V7.
3. Scénographie : 3 entrées et « NOS 3 CRÉATIONS » (doc 07), l'entrée Ateliers disparaît.
4. Timeline : composant `process` de Noël (V3), non épinglé, comme sur Bureaux et Design ; les docs disent « épinglée », les zooms montrent la mise en page V3.
5. `site.js` inchangé (e-mail, téléphone, liens), sinon menu et footer de toutes les pages changent et G2 et G3 échouent.
6. Aucun téléphone dans les CTA finaux (la frame 12 n'en montre pas) ; aucun CTA final sur Entretien.
7. Cartes de formules de même hauteur (le zoom `entretien-06` le montre, le doc dit l'inverse).
8. Textes proposés par l'utilisateur : `proposition: true`, listés au rapport ; textes de la maquette absents du copywriting : `designTexts`.
9. Images : `public/assets/images/<page>/` à plat ; les 14 JPG aux coins noirs cuits de 10 px sont rognés (11 à 12 px) avant le pipeline WebP.
10. `live: true` seulement sur feu vert explicite.

## Commandes
- Dev : `npm run dev` ; liens cliquables : `npm run dev:liens`. Build : `npm run build` (sans avertissement). Contrôle : `node scripts/check-site.js`.
- Non-régression : `node .baseline/gate.mjs` (une panne isolée se rejoue) ; `node .baseline/pages.mjs <chemin>` pour les mesures par largeur.
- Preuve Bureaux et Design : captures du scratchpad (`bx-capture.mjs --out`), HTML de `dist-before/` comparé octet pour octet pour les 9 pages non concernées.
- Preview : `git push origin feature/pages-secondaires`, puis l'API `actions/runs?branch=feature/pages-secondaires&per_page=1`.

## Structure
- Données : `src/data/pages/{scenographie,terrasses,saisonniere,entretien}.js`, aucun texte en dur. Composants : `src/components/sections/*.js`. Animations : `src/scripts/bureaux-*.js`, un module par brique, appelés par `bureaux.js` dans l'ordre de la page. Styles : `src/styles/bureaux-*.css`, importés par `main.css`.
- Partagé, modifié avec garde-fous (props optionnelles, HTML et rendu des autres pages identiques) : `hero.js`, `fiche-autres.js`, `bureaux-galerie.js`, `bureaux-matieres.js` (sections et scripts), `bureaux-hero.js`, `bureaux-header.js`, `bureaux-scene.js` (ajouts seulement), `bureaux.js`.
- Non modifiés : `header-theme.js`, `footer-reveal.js`, `main.js`, `site.js`, `cta.js`, animations de l'accueil, de Noël, de Services, du footer et du CTA.
- Liens et images : `linkTo`, `withBase`, `img` ; jamais de `/chemin` en dur.

## Style de code
Commentaires en français qui expliquent le pourquoi ; aucun tiret long ; aucune valeur hexadécimale dans les composants (jetons de `tokens.css`) ; mesures des frames en constantes nommées d'un profil ; seulement `transform`, `opacity`, `clip-path` animés ; `invalidateOnRefresh: true` ; `will-change` seulement pendant l'animation ; `prefers-reduced-motion` géré ; règles de variante dans `@media (min-width: 901px)` ; sous 900 px, animations simplifiées.

## Tests
Pas de framework de test : vérification par mesures. (1) Build et `check-site` sans écart. (2) Captures 1728 x 1030 aux positions des frames, planches frame | capture, boîtes mesurées. (3) Console vide, un seul `h1`, aucun défilement horizontal de 320 à 1920 px. (4) Bureaux et Design : captures avant/après identiques (bruit mesuré sur deux passes), HTML des autres pages identique à `dist-before`. (5) `gate.mjs` complet avant chaque commit. (6) Sans JavaScript, mouvement réduit, clavier seul, axe. (7) Après le push : workflow vert, page et une image en 200 sur la preview.

## Limites
- **Toujours** : réutiliser avant de créer ; `/graphify:impact` avant un composant partagé ; une page à la fois, build, vérification, commit, push, contrôle de la preview.
- **Demander d'abord** : toute modification de `site.js`, `header-theme.js`, `main.js`, d'une config ou d'une dépendance ; tout `live: true` ; tout texte inventé (sinon `[À compléter]`).
- **Jamais** : `git push --force`, push de `retours-v*`, PDF ou zip, fusion dans `main`, faux témoignage ou faux chiffre, tiret long, valeur hexadécimale en dur, `/chemin` en dur, modification du rendu de Bureaux, Design, accueil, Noël, footer ou CTA.

## Design
Direction visuelle : `DESIGN.md` (olive, orange, crème, sable ; Poppins, Playfair Display Italic pour les pastilles). Pas de `design-system/*/MASTER.md` : le design system du projet est `DESIGN.md`. Largeurs : 1728 x 1030 de référence, 390, 768, 1280. Contraste AA, exceptions notées.

## Questions ouvertes
Aucune bloquante. Écarts docs/frames et propositions de texte : `docs/POINTS-A-VALIDER.md` (section V7).
