# Plan : pages services V7

Spec : `SPEC-v7.md`. Ce plan est séparé de `tasks/plan.md` et `tasks/todo.md` (pages secondaires, T31 et T32 en attente), de `SPEC.md` et des dossiers `retours-v5/tasks/` et `retours-v6/tasks/` : on n'y touche pas. Direction visuelle : `DESIGN.md` (pas de `design-system/*/MASTER.md`).

## Graphe de dépendances
```
S Scénographie ──► P texte sur photo ─┐
              ├──► W styles ──────────┼─► B bande ──► T Terrasses ──► D Décoration ──► R revue
              └──► F formules ──► C cercle ─────────────────────────────────► E Entretien ──┘
```
Ordre d'envoi : S, T (P, W, B), D, E (F, C), R. Un commit et un push par page, contrôle de la preview avant la suivante.

## Impact sur le code partagé (graphify, graphe reconstruit le 2026-11-07, 1046 nœuds)
- `bureaux-*.js` : importés par `bureaux.js` seulement, chargé en `import()` par `main.js` quand `[data-bx]` existe : seules Bureaux, Design et les pages V7 sont touchées. `bureaux-scene.js` : 5 importateurs, ajouts seulement. `bureaux-header.js` : importé par `bureaux-matieres.js` et `bureaux-branding.js`, une entrée de plus dans `ORDER`.
- `sections/hero.js` (9 pages), `process.js`, `faq.js`, `cta-final.js` (aussi blog et article), `logos.js`, `fiche-autres.js` : importés par `page-sections.js` ; props optionnelles, HTML des autres pages identique à `dist-before` (13 empreintes sha256 dans le scratchpad).
- `header-theme.js` (8 importateurs), `site.js` (19 importateurs), `main.js`, `footer-reveal.js`, `menu.js`, `footer.js`, `header.js` : non modifiés.
- Hors graphe : sélecteurs CSS `html.bx-*-anim` et `.bx-overlap`, attributs `data-bx*` et `data-header-*`, plugin d'injection HTML, `check-site.js` (textes comparés au copywriting, `designTexts`), JSON-LD de `seo.js`.

## Critères communs à toute tâche UI
Sans JavaScript, mouvement réduit, ordinateur, mobile ; 390, 768, 1280 puis 1728 x 1030 ; clavier seul (focus visible) ; contraste AA (exceptions notées) ; jetons de couleur seulement ; `transform`, `opacity`, `clip-path` ; `invalidateOnRefresh: true` ; réversible au scroll arrière ; aucun défilement horizontal ; console vide ; un seul `h1`.

## Tâches

### Page Scénographie (prompt 01, un commit)
- [x] **S0 Données** : ordre cible, textes V7, entrée Ateliers et sections hors maquette retirées, `designTexts`.
  - Acceptation : hero, créations (3), réalisations, processus, FAQ (5), CTA ; `grep -ri atelier` sur la page générée ne laisse que « Atelier DGE » ; `check-site` sans écart.
  - Vérification : `npm run build`, `check-site`. Fichiers : `data/pages/scenographie.js`.
- [x] **S1 Hero UI** : mots-clés, titre à pastille « vos événements », bouton « Parlons de votre événement », sortie sous la liste.
  - Acceptation : frames 01 à 03 ; le hero reste en place et s'estompe, la liste monte par-dessus ; Bureaux et Design identiques.
  - Vérification : captures, planche frame | capture. Fichiers : `hero.js`, `bureaux-hero.js` (garde), CSS de variante.
- [x] **S2 Nos 3 créations UI** : liste à ligne active sans tenue.
  - Acceptation : frames 03 à 05 ; ligne active au survol, au focus, au scroll ; header olive.
  - Vérification : captures, clavier, mouvement réduit. Fichiers : `bureaux-pourquoi.js` (section), données.
- [x] **S3 Nos réalisations UI** : 2 cartes de la page Réalisations et bouton orange, filet de séparation.
  - Acceptation : frames 05 à 07 ; mêmes photos, catégories et liens que Réalisations. Fichiers : `fiche-autres.js` (props), CSS.
- [x] **S4 Processus UI** : timeline V3, 4 étapes.
  - Acceptation : frames 07 à 09 ; étape active, ligne qui se remplit ; ni lien sous la timeline. Fichiers : données.
- [x] **S5 FAQ et CTA UI** : 5 questions, première ouverte ; CTA « mérite », sans téléphone ; footer.
  - Acceptation : frames 09 à 13 ; animation du CTA inchangée. Fichiers : données, `cta-final.js` (téléphone facultatif déjà géré).
- [x] **Checkpoint 1** : `gate.mjs` complet, captures de Bureaux et Design identiques, HTML des 9 autres pages identique à `dist-before`, `/design:review`, commit, push, workflow vert, page et une image en 200 sur la preview.

### Briques et page Terrasses (prompt 02, un commit)
- [x] **T0 Données et images** : textes V7, 8 images rognées sur 11 livrées dans `public/assets/images/terrasses/`.
- [x] **P Texte sur photo UI** : photo qui monte sur le hero, voile, surtitre, texte, pastilles orange et crème (frames Terrasses 02 à 06). Fichiers : `bureaux-photo-texte.js` (section et script), `bureaux-header.js` (`ORDER`), CSS.
  - Acceptation : header blanc de la photo au crème ; mobile et mouvement réduit lisibles.
- [x] **W Styles UI** : image à gauche, liste, entrée active pilotée par le scroll, `image` par entrée (une seule fournie). Fichiers : `bureaux-styles.js`, CSS. Acceptation : frames 06 à 09 et zoom 07 ; pas de saut de hauteur ni de texte coupé.
- [x] **B Bande de photos UI** : 2 rangées en sens opposé (CSS natif, `translateX`), puis une seule image qui grandit (frames 08 à 20). Acceptation : boucle sans saut, rangées arrêtées en mouvement réduit, pas de défilement horizontal. Fichiers : `bureaux-bande.js`, CSS.
- [x] **T1 Photo qui grandit et slider de 3 contraintes UI** : profil « terrasses » de `bureaux-matieres`, sans pastille (frames 17 à 28). Le profil Bureaux reste le défaut.
- [x] **T2 Processus, FAQ, CTA UI** (frames 28 à 35).
- [x] **Checkpoint 2** : comme le checkpoint 1.

### Page Décoration (prompt 03, un commit)
- [x] **D0 Données et images** (6 images) ; **D1 Texte sur photo** (P) ; **D2 Styles** (W, entrée Printemps active) ; **D3 Galerie orange UI** (`bureaux-galerie.js`, bouton avec lien vers Entretien par `linkTo`, jamais couvert par une photo) ; **D4 Réalisations, FAQ (4), CTA UI**.
- [x] **Checkpoint 3** : comme le checkpoint 1.

### Briques et page Entretien (prompt 04, un commit)
- [x] **E0 Données** ; **E1 Liste active** (4 entrées) ; **F Formules UI** (3 cartes, Confort orange, de même hauteur, empilées sous 900 px) ; **C Cercle orange UI** (disque depuis le centre, fonction paramétrable, `clip-path`, mouvement réduit : simple fond, header lisible pendant la transition) ; **E2 Photo et slider avec pastilles UI** (profil « entretien », frames 09 à 24) ; **E3 Fonctionnement, clients, FAQ (5), footer sans CTA UI**.
- [x] **Checkpoint 4** : comme le checkpoint 1.

### Revue (prompt 05)
- [ ] **R Revue V7** : `gate.mjs`, captures des 6 pages (1728, 1280, 768, 390), Bureaux et Design avant/après, axe, mouvement réduit, sans JS, poids, liste des propositions et écarts dans `docs/POINTS-A-VALIDER.md`, dernier push.

## Risques
1. Transition de la bande vers l'image unique puis le plein écran (Terrasses) : la plus complexe, mesurée sur les frames 08 à 20.
2. Le profil « terrasses » de `bureaux-matieres` part d'une photo déjà à l'écran, pas du bas : à isoler dans le profil.
3. Bruit de rendu de Bureaux à deux états : mesurer le bruit entre deux passes identiques avant de conclure à une régression.
4. La porte `.baseline` peut échouer une fois sans cause de code : rejouer avant de conclure.
