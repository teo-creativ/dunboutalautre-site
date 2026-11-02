# Revue finale V4 (prompt 04)

Périmètre : `git diff e30eb5c..HEAD` (commits `fbc383b` Réalisations, `15a8d76` fiche projet, `7d4bc43` Contact), sans nouvelle fonctionnalité. Revue de code sur 5 axes (correction, lisibilité, architecture, sécurité, performance), puis revue de design sur les 3 pages, lues et regardées dans un navigateur.

## Non-régression
- `.baseline/gate.mjs` passée deux fois (avant et après les corrections) : build sans avertissement, HTML de l'accueil (36 427 octets) et de Noël (51 267 octets) identiques octet pour octet, 16 captures sur 16, `check-site` à 13 pages sans écart.
- Les 13 pages (intro.js et header-theme.js sont partagés) : intro terminée, console vide, aucun débordement horizontal, à 1440 et à 390 de large.
- `site.js` non modifié depuis `e30eb5c` : `live` intact, coordonnées lues dans `site.js` et non écrites dans les composants.

## Corrigé pendant la revue
| Niveau | Où | Constat | Correction |
|---|---|---|---|
| Fix | `src/scripts/projets-grid.js` | Si le chunk Flip ne se charge pas (réseau coupé, site redéployé pendant la visite), un clic de filtre laissait la grille sur l'ancien état : bouton « Terrasses » enfoncé et annonce « 3 réalisations affichées » devant 8 cartes de toutes catégories, puis le filtre suivant affichait les cartes du précédent. L'échec restait en mémoire (`??=` sur une promesse rejetée) | Le chargement renvoie `null` en cas d'échec et se retente au clic suivant ; le filtre s'applique alors sans mouvement. Rejoué avec le chunk bloqué : 3 puis 6 cartes, états cohérents |
| Fix | `src/scripts/header-theme.js` | Deux sections claires voisines se touchent au pixel près : à cette position précise aucune zone n'était active, donc header sombre (logo crème invisible) sur fond crème. Mesuré par balayage au pixel : 2 positions sur la fiche à 1280, 2 à 1728, 1 sur Contact, 2 sur la fiche à 390. L'arrêt pile sur l'un de ces pixels laissait l'état au repos | La zone d'une section déborde d'1 px sur la suivante si celle-ci déclare un thème ou un dégradé. Même balayage : aucun trou, en descente comme en montée. Accueil et Noël identiques (ligne 185 de `docs/POINTS-A-VALIDER.md`) |
| Fix | `projets-hero.css`, `projets-hero.js`, `realisations.js` | Sous 900 px, les photos du hero ont une largeur en `vw` : en tablette portrait (768 x 1024) elles recouvraient le titre (« (32) » sur le ciel, « Nos » sur le bord de la photo). Même risque sur un écran de 360 x 640 | Largeur plafonnée par un bas maximal en `svh` (`mobile.b`). Mesuré à 9 formats : plus aucun recouvrement (3 px sur 844 x 390, en paysage), téléphone 390 x 844 inchangé au pixel |
| Nettoyage | `projets-hero.css` | Commentaire orphelin sans règle en dessous | Supprimé |

## Conforme, vérifié en lançant
- **Réalisations** : chaque filtre, « Voir plus » jusqu'à épuisement (tous : 3 clics, 32 cartes ; bureaux : 1 clic, 12), avec mouvement et en mouvement réduit ; compteurs des 7 filtres égaux aux cartes réelles (12, 3, 4, 5, 6, 2 ; 32 en tout), `(32)` du hero et du menu égaux à `realisationsCount` ; `check-site` vérifie aussi cette égalité à chaque build. Focus clavier : contour orange de 3 px sur les filtres. Cibles tactiles à 390 : filtres 45 px, « Voir plus » 44 px.
- **Contact** : tabulation complète en 16 arrêts, envoi vide puis invalide puis valide, flèches sur les radios, budget désélectionnable, zone de message qui grandit, état « Envoi en cours... », confirmation, champ piège, `?prestation=`, aucune requête réseau. Liens `mailto:`, `tel:` et Instagram lus dans `site.js`.
- **Mouvement réduit et sans JavaScript** sur les 3 pages, à 1440 et 390 : aucun élément masqué, aucun débordement, console vide ; sans JavaScript, le bouton d'envoi reste désactivé et toutes les cartes de Réalisations s'affichent.
- **Captures** à 1728 x 1030, 1440 x 900, 1280 x 720, 768 x 1024 et 390 x 844 pour les 3 pages : haut, milieu, bas et plusieurs moments des animations, en planches (15 planches regardées, les plans en cause agrandis). Aucun texte coupé, aucune bande vide anormale, aucun débordement.
- **Performance** : aucune propriété de mise en page animée (seulement `transform`, `opacity`, `clip-path`, plus les deux exceptions documentées : `--fade` du masque de la grille et `color` des mots clés de la fiche) ; `will-change` posé seulement pendant la scène ; images avec `width` et `height` ; plus lourde image WebP des 3 pages : 256 Ko.
- **Écriture** : aucun tiret long dans le diff ; 27 `[À compléter]` de Réalisations tous en `data-placeholder` ; aucun témoignage ni chiffre inventé sur les 3 pages.
- **axe** : seules violations restantes = contrastes déjà consignés (sable des filtres inactifs et du lien de retour, `(32)` blanc sur orange, pilule choisie de Contact), aucune structurelle.

## Nit (listés, non traités)
1. `projets-grid.css:7`, `fiche.css:11` : le sable `--idle` (filtres inactifs, catégories, lien de retour) tient 1,67:1 ; une ligne à changer (`var(--olive-soft)`, 4,8:1) quand la décision sera prise (lignes 163 et 170).
2. `projets-grid.css:34,46` : le trait sous le filtre actif (0,45 s en `scaleX`) et le fondu de couleur ne sont pas retirés en mouvement réduit ; les filtres n'ont pas de retour à l'appui (`:active`).
3. `projets-stage.js:34`, `fiche.js:11`, `contact.js:13` : le rayon `14` (`--radius-photo`) est recopié dans 3 scripts.
4. `projets-stage.js:87` : copie inutile de l'objet `arrival` (`{ ...arrival }`).
5. `form.js:81` : `type="submit"` obtenu par un `replace` sur le rendu de `cta()` ; une option `type` dans `cta()` serait plus propre (déjà le cas avant la V4).
6. `fiche.js:155` : l'animation d'en-tête, créée dans `afterIntro`, sort du contexte `matchMedia` : si l'on franchit 900 px après l'intro, elle se rejoue (le résultat reste visible).
7. `realisations.js` : les photos du hero (`realisation-01` à `04`) et de quatre cartes sont les mêmes sujets en deux recadrages, avec leur texte alternatif écrit deux fois.
8. `public/assets/images/` : les PNG sources (15 Mo de plus pour la V4) sont recopiés dans `dist/` alors que les pages n'utilisent que les WebP ; comme les PNG de l'accueil, donc hors périmètre (config de build).
9. `projets-grid.css:89` : le lien du titre d'une carte : 28 px de haut sur mobile (la photo, lien aussi, est la grande cible).

## Non vérifié
60 images par seconde (Chrome sans carte graphique), Safari et Firefox, un vrai téléphone, lecteur d'écran réel. Les animations sont jugées sur captures fixes.
