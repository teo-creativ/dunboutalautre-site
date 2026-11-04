# Plan : page Design végétal sur mesure V6

Spec : `SPEC-design.md`. Ce plan est séparé de `tasks/plan.md` et de `retours-v5/tasks/` : on n'y touche pas. Direction visuelle : `DESIGN.md`.

## Graphe de dépendances
```
D0 ordre, assets, données ──► D1 hero ──► D2 5 créations + tenue ──► D3 matières ──► D4 galerie ──► D5 branding ──► D6 fin de page ──► D7 revue
```
Chaque section monte par-dessus la précédente (marge négative et `z-index`) : l'ordre est aussi un ordre de dépendance visuelle. Les pins se créent dans l'ordre de la page (hero, tenue, matières, galerie).

## Impact sur le code partagé (graphify, graphe du 2026-11-02, à jour)
- `bureaux-*.js` : importés par `bureaux.js` seulement, chargé en `import()` par `main.js` quand `[data-bx]` existe : seules les pages qui le portent sont touchées (Bureaux, Design).
- `header-theme.js` (importé par `main.js`, `menu.js`, `stage.js`, `projets-stage.js`, `bureaux-matieres.js`), `site.js` (13 importateurs), `main.js`, `footer-reveal.js` : non modifiés.
- `sections/hero.js`, `bureaux-pourquoi.js`, `bureaux-matieres.js`, `bureaux-galerie.js` : importés par `page-sections.js` ; props optionnelles, HTML des autres pages identique (comparé à `dist-before`).
- Hors graphe : sélecteurs CSS `html.bx-*-anim`, attributs `data-*`, `check-site.js` (textes comparés au copywriting).

## Critères communs à toute tâche UI
Sans JavaScript, mouvement réduit, ordinateur, mobile ; 390, 768, 1280 puis 1728 x 1030 ; clavier seul (focus visible) ; contraste AA (exceptions notées) ; jetons de couleur seulement ; `transform`, `opacity`, `clip-path` ; `invalidateOnRefresh: true` ; réversible au scroll arrière ; aucun défilement horizontal ; console vide ; thème du header relevé aux raccords ; Bureaux inchangé.

## Tâches
Prompt 01 = D0 à D3 (commit 5bec96b) ; prompt 02 = D4 à D6 (un commit) ; prompt 03 = D7.

- [x] **D0 Ordre, assets, données** : images copiées et optimisées, sections 1 à 3 avec les textes V6, le reste dans le bon ordre.
  - Acceptation : ordre hero, 5 créations, matières, puis galerie « aperçu », branding, processus, clients, avis, FAQ, CTA (les trois dernières attendent le prompt 02) ; images dans `public/assets/images/design-vegetal/` et manifeste à jour.
  - Vérification : `npm run build`, `check-site`, `gate.mjs --fast`.
  - Fichiers : `data/pages/design-vegetal.js`, `public/assets/images/design-vegetal/*`.
- [x] **D1 Hero** : mots-clés, titre à pastille « sur mesure », sortie sous la section crème.
  - Acceptation : frames 01 à 03 ; le hero reste en place et s'estompe, la liste monte par-dessus ; Bureaux identique.
  - Vérification : captures aux positions des frames, planche frame | capture.
  - Fichiers : `sections/hero.js`, `bureaux-hero.js`, `bureaux-hero.css`, `bureaux-installe.css`.
- [x] **D2 Nos 5 créations** : liste à ligne active, tenue d'un écran, orange par-dessus.
  - Acceptation : frames 04 à 08 ; ligne active au survol, au focus, au scroll ; liste immobile pendant que l'orange monte ; header olive.
  - Vérification : captures, clavier, mouvement réduit.
  - Fichiers : `sections/bureaux-pourquoi.js`, `bureaux-hold.js`, `bureaux.js`, `bureaux-pourquoi.css`.
- [x] **D3 Matières** : orange, photo qui grandit (mesures des frames 10 à 13), voile, slider de titres seuls, trois fonds.
  - Acceptation : frames 09 à 24 ; titres sans pastille, texte blanc lisible sur `fond-01` clair ; header blanc puis `photo` ; la galerie orange monte (24).
  - Vérification : captures par frame, contraste mesuré, console vide.
  - Fichiers : `sections/bureaux-matieres.js`, `bureaux-matieres.js` (profils), `bureaux-matieres.css`.
- [ ] **Checkpoint 1** : `gate.mjs` complet, captures de Bureaux identiques, `/design:review`, un commit.
- [x] **D4 Galerie « logo reconstitué »** : 4 photos qui montent derrière le titre et le bouton, sans étiquette.
  - Acceptation : frames 24 à 27 ; positions, tailles et vitesses mesurées sur les frames (départs 42 px plus haut que la frame 24), dérive vers la droite ; titre de 68 px sur deux lignes ; trois photos sous 900 px ; photos sans effet sur le logo du header ni sur le bouton.
  - Vérification : captures aux instants des frames 24 à 27 ; boîtes des photos et encre du titre comparées aux frames ; mobile 390 x 844.
  - Fichiers : `sections/bureaux-galerie.js` (étiquette facultative, `variant`, `grow`), `bureaux-galerie.css`, données.
- [x] **D5 Grande photo et « Le branding végétal »** : une seule scène épinglée avec D4 (`bureaux-branding.js`).
  - Acceptation : frames 27 à 33 ; photo qui monte du bas à la vitesse du scroll en s'élargissant jusqu'au plein écran (boîtes à 1 px), zoom de l'image en fin de croissance, titre et bouton qui s'estompent dessous ; voile, étiquette, cinq lignes par masque puis deux pastilles ; la section crème monte par-dessus ; header blanc puis dégradé « photo » puis voile.
  - Vérification : captures aux instants des frames 27 à 33 ; boîtes de la photo, encre du texte, inclinaison des pastilles ; balayage du header ; mouvement réduit et sans JavaScript.
  - Fichiers : `scripts/bureaux-branding.js` (nouveau), `bureaux-galerie.js` (garde), `bureaux-matieres.js` (exports, zoom dynamique), `bureaux.js`, `bureaux-galerie.css`.
- [x] **D6 Processus, clients, avis, FAQ, CTA final** : données et variantes de mesures, composants inchangés.
  - Acceptation : processus à 5 étapes ; six logos en couleur sans doublon, titre sur deux lignes ; avis fictif sans épinglage (garde de `bureaux-avis.js` corrigé) ; FAQ de 5 questions, première ouverte ; CTA final sans téléphone, titre de 48 px, bandeau de 559 px ; footer inchangé.
  - Vérification : captures aux instants des frames 34 à 44 ; encre du CTA et des clients comparée aux frames ; HTML des 12 autres pages identique.
  - Fichiers : `data/pages/design-vegetal.js`, `sections/logos.js` et `cta-final.js` (prop `variant`), `bureaux-avis.js`, `bureaux-avis.css`, `page.css`.
- [x] **Checkpoint 2** : `gate.mjs` complet, captures de Bureaux avant/après, `/design:review`, un commit.
- [ ] **D7 Revue** : Lighthouse, axe, 5 largeurs, mouvement réduit, sans JavaScript, Bureaux avant/après.
