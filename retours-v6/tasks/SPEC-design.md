# Spec : page Design végétal sur mesure V6

Sources : `retours-v6/docs/00` à `03`, `retours-v6/references/design-frames/INDEX.md` et les 44 frames, état des lieux du 2026-11-04. Cette spec est séparée de `SPEC.md` et `tasks/plan.md` (pages secondaires, T31 et T32 en attente) et de `retours-v5/tasks/` : on n'y touche pas.

## Objectif
Refondre `/design-vegetal-sur-mesure-paris/` pour qu'elle suive la maquette V6, au pixel près, avec les animations au scroll, en réutilisant les composants de la page Bureaux V5 sans changer leur rendu : hero olive qui s'efface sous les 5 créations, liste à ligne active (tenue un écran pendant que l'orange monte), section orange puis photo plein écran puis slider Naturel / Stabilisé / Artificiel, galerie orange « logo reconstitué », photo qui grandit et texte « Le branding végétal », processus, clients, avis, FAQ, CTA final, footer. Public : entreprises, hôtels, restaurants et particuliers qui veulent une création végétale sur mesure (tableau, logo, mur, structure, suspension) ; la page mène au devis. Les frames priment sur les docs (leçon de V5).

## Carte des capacités (ordre de build = ordre de la page)
| Id | Module | Dépend de | Fichiers propres |
|---|---|---|---|
| D0 | Ordre, assets, données | rien | `data/pages/design-vegetal.js`, `public/assets/images/design-vegetal/` |
| D1 | Hero (variante de mesures) | D0 | `sections/hero.js` (prop), `bureaux-hero.js` (garde), `bureaux-hero.css` |
| D2 | Nos 5 créations + tenue sous l'orange | D1 | `sections/bureaux-pourquoi.js` (props), `bureaux-hold.js` (nouveau), `bureaux-pourquoi.css` |
| D3 | Matières : orange, photo qui grandit, slider (profil « design ») | D2 | `sections/bureaux-matieres.js`, `bureaux-matieres.js` (profils), `bureaux-matieres.css` |
| D4 | Galerie « logo reconstitué » | D3 | `sections/bureaux-galerie.js` (étiquette optionnelle), `bureaux-galerie.css` |
| D5 | Photo qui grandit + texte « Le branding végétal » | D4 | module neuf, modèle : D3 |
| D6 | Processus, clients, avis, FAQ, CTA final | D5 | données ; `bureaux-avis.js` (garde) |
| D7 | Revue finale | D6 | rien |
`main.js` n'est pas modifié (le chunk `bureaux.js` se charge déjà quand la page porte `[data-bx]`).

## Hypothèses retenues
1. Les frames priment : liste « Nos 5 créations » immobile pendant que l'orange monte (frames 05 à 08, donc une tenue d'un écran comme l'avis, sans fondu) ; titres du slider à 48 à 50 % de la hauteur et non 60 % ; la galerie n'a pas d'étiquette ; « Notre processus » n'est pas épinglé (composant V3).
2. Rien ne change sur Bureaux : chaque généralisation prend en défaut les valeurs actuelles (profil « bureaux »), preuve par captures avant/après, HTML octet pour octet des 12 autres pages, et `.baseline`.
3. Textes : ceux de `00-RETOURS-V6.md`, `01-SECTIONS.md` et `02-DONNEES-ET-ASSETS.md` ; pas de tiret long ; absents du copywriting 03 : déclarés dans `designTexts`.
4. Avis fictif de Bureaux repris avec `fictif: true` ; logos : les 6 clés `-svg` existantes ; `live: true` seulement sur feu vert.
5. Images : `public/assets/images/design-vegetal/` à plat (`fond-01` à `04`, `galerie-01` à `04`) ; le coin transparent de 15 px cuit dans 7 PNG sur 8 est masqué par un dépassement de 0,7 % (comme V5).
6. Durées de scroll : celles de Bureaux, ajustables au ressenti (point 6 des points à valider).

## Commandes
- Dev : `npm run dev` ; liens cliquables : `npm run dev:liens`. Build : `npm run build` (sans avertissement). Contrôle : `node scripts/check-site.js`.
- Non-régression : `node .baseline/gate.mjs` ; une panne isolée se rejoue. Captures : scripts jetables du scratchpad (`playwright-core` de `.baseline/node_modules`), 1728 x 1030.

## Structure
- Données : `src/data/pages/design-vegetal.js` (aucun texte en dur). Composants : `src/components/sections/*.js`. Animations : `src/scripts/bureaux-*.js`, un module par section, appelés par `bureaux.js` (pins dans l'ordre de la page). Styles : `src/styles/bureaux-*.css`, préfixés `body[data-page="page"]`, variantes en `[data-bx-variant="design"]`.
- Partagé, modifié avec garde-fous : `sections/hero.js`, `bureaux-pourquoi.js`, `bureaux-matieres.js` (props optionnelles, HTML des autres pages identique), `bureaux-hero.js`, `bureaux-matieres.js` (scripts : profil par défaut = Bureaux), `bureaux.js` (un appel), `bureaux-installe.css` (sélecteur additif). Jamais modifiés : `header-theme.js`, `site.js`, `main.js`, `footer-reveal.js`, `process.js`, `faq.js`, `logos.js`.
- Header : `data-header-theme` et `data-header-gradient` par section, plus `setHeaderOverride` (existant).

## Style de code
Commentaires en français qui expliquent le pourquoi ; aucun tiret long ; aucune valeur hexadécimale dans les composants ; mesures des frames en constantes nommées d'un profil ; seulement `transform`, `opacity`, `clip-path` animés ; `invalidateOnRefresh: true` ; `will-change` seulement pendant la scène.

## Tests
Pas de framework de test : vérification par mesures. (1) Build et `check-site` sans écart. (2) Captures 1728 x 1030 aux positions des frames, planches frame | capture. (3) Console vide, un seul `h1`. (4) Captures de Bureaux avant/après identiques (bureaux-before) et HTML des autres pages identique (dist-before). (5) `.baseline` vert. (6) 390, 768, 1440 et 1920 de large : aucun défilement horizontal ; mouvement réduit et sans JavaScript : sections lisibles. (7) Thème du header relevé à chaque raccord. (8) `/design:review` sur le diff.

## Questions ouvertes
Aucune bloquante. Écarts docs/frames tranchés par les frames, listés dans `docs/POINTS-A-VALIDER.md` (section V6).
