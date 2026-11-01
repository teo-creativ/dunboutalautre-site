# Plan : fiche projet Floral Fashion Show V4

Sources : `retours-v4/docs/02-CASE-STUDY.md`, `case-study-full.png` et `case-study-01.jpg` à `07.jpg`, réponses du fondateur du 2026-11-01 (textes pris sur la maquette). Séparé de `tasks/plan.md` et `tasks/todo.md` (on n'y touche pas).

## Décisions de départ
- Textes lus sur la maquette (le document « Étude de cas » n'existe pas dans le dépôt) : intro, défi, ligne d'infos. Exceptions explicites dans `check-site` (`designTexts`), à valider avec la cliente.
- Même page, même chemin `/realisations/floral-fashion-show/`. Header et footer inchangés ; toutes les sections sont crème : `data-header-theme="light" data-header-gradient="cream"`.
- Réutilisé tel quel : `intro.js` (h1 et header), `tag.js` (`hideTags`, `fillTag`), `reveal.js` (`data-reveal="head"` et `"up"` avec `data-reveal-y`, `data-reveal-step`), cartes `.pcard` de Réalisations.
- Gris `#8C8C8C` de la maquette (paragraphes, libellés) : pas un jeton, 3,0:1 sur crème. Remplacé par `--olive-soft` (4,8:1). Fil d'Ariane inactif et filet : `--sand`.

## Graphe de dépendances
```
T1 données, photos, balisage, CSS (page lisible sans JS)
 ├─ T2 en-tête au chargement ──► T3 photos (clip-path, scale, parallaxe)
 │                                  ├─ T4 textes (pastille, lignes, mots clés)
 │                                  └─ T5 galerie (2 + 1, parallaxes opposées)
 └─ T6 autres projets (reveal.js, cartes, liens)
T2..T6 ──► T7 mobile, mouvement réduit, sans JavaScript ──► T8 vérification, baseline, revue, commit
```
`fiche.js` (T2 à T5) et `projets-grid.js` (T6, pré-sélection du filtre) sont indépendants ; `main.js` et `main.css` sont communs.

## Impact sur le code partagé (graphify, graphe rafraîchi)
- `main.js` : une entrée `initFiche`, sans effet hors de cette page. `page-sections.js` : 5 types ajoutés, `project` retiré (propre à cette page, un seul importeur).
- `intro.js` : non modifié (gardes déjà posées au prompt 01). `projets-grid.js` (composant) : exporte la carte pour la réutiliser. `projets-grid.js` (script) : lit `?categorie=` (filtre pré-sélectionné).
- Hors graphe : CSS global `html.js [data-reveal=…] { opacity: 0 }` (noel.css), valable ici aussi.

## Animations proposées (une seule révélation par élément, jamais de rebond)
1. **En-tête** : après l'intro (le h1 est celui d'`intro.js`) : fil d'Ariane en fondu, filet qui se dessine (`scaleX`, 1 s), 5 infos en cascade (`y` 16 px, 0,08 s), puis la photo héros se découvre du bas vers le haut (`clip-path`, image `scale` 1,15 vers 1).
2. **Photos** : même révélation à l'entrée dans l'écran (`top 85%`, une fois), parallaxe scrubée de l'image (±6 %, ±4 % en galerie, moitié sur mobile), image à 115 % de hauteur pour ne jamais laisser de bande vide.
3. **Textes** : pastille d'abord (`fillTag`), titre mot à mot sous masque, paragraphes ligne par ligne, mots clés qui passent à l'orange en dernier (seule propriété hors transform et opacity : `color`, 0,5 s, une fois, comme le demande le doc).
4. **Galerie** : photo de gauche puis de droite (0,15 s), parallaxes de sens opposés ; la photo large seule, plus lente (1,4 s).
5. **Autres projets** : label et titre comme sur Réalisations (`reveal.js`), 2 cartes en fondu et `y` 40 px (0,12 s), bouton ensuite.

## Tâches
Chaque tâche UI vérifie : sans JavaScript et mouvement réduit lisibles, 390 et 1728 de large, clavier, contraste (exceptions notées), jetons de couleur.

- [x] **T1 Données, photos, balisage** : 5 photos rognées (13 px par bord) dans `public/assets/images/case-study/`, données de la page, 5 renderers, CSS de base, `check-site`. Vérif : `npm run build`, `node scripts/check-site.js`, page lisible.
- [x] **T2 UI En-tête** : fil d'Ariane, h1, filet, infos, photo héros au chargement. Vérif : captures avant, en cours et fini à 1728 x 1030.
- [x] **T3 UI Photos** : révélation `clip-path` et parallaxe. Vérif : pas de bande vide aux deux extrémités de la parallaxe.
- [x] **T4 UI Textes** : intro et défi. Vérif : aucun texte coupé, mots clés orange à la fin.
- [x] **T5 UI Galerie** : 2 photos puis 1 large. Vérif : décalage de 0,15 s, parallaxes opposées.
- [x] **T6 UI Autres projets** : titre, 2 cartes, bouton, liens vers Réalisations (`?categorie=scenographie`). Vérif : cartes en cascade, survol identique à Réalisations, filtre pré-sélectionné.
- [x] **Point de contrôle A** : page entière comparée à `case-study-full.png`, `.baseline --fast`.
- [x] **T7 UI Mobile, mouvement réduit, sans JavaScript** : 390 x 844, infos en grille 2 colonnes, galerie en 1 colonne, parallaxe réduite de moitié.
- [x] **T8 Vérification et livraison** : captures de chaque bloc à 3 moments aux deux largeurs, `.baseline` complète, `/design:review`, points à valider, un commit.

## Résultat (2026-11-01)
- T1 à T8 faites, un seul commit. `.baseline` complète propre : build sans avertissement, HTML de l'accueil et de Noël identique octet pour octet, 16 captures, `check-site` à 13 pages sans écart.
- Mesuré à 1728 x 1030 et 390 x 844 : chaque bloc à 3 moments (avant, en cours, fini), hauteur de page identique avant et après le parcours (0 px de saut), aucun débordement horizontal de 320 à 1920 px, aucune bande vide pendant la parallaxe (marge de sécurité mini 4,7 px et 6 px), console vide en mouvement normal, réduit, sans JavaScript et après redimensionnement.
- Hors périmètre prévu, corrigé en passant : `header-theme.js` (erreur d'initialisation sur une page qui s'ouvre sur une section claire) et la largeur du nom des cartes de Réalisations. Points à trancher : `docs/POINTS-A-VALIDER.md`, lignes 168 à 175.
