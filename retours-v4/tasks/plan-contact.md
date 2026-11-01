# Plan : page Contact V4

Sources : `retours-v4/docs/03-CONTACT.md`, `contact-full.png`, `contact-01` à `10.jpg`, réponses du fondateur du 2026-11-01 (textes pris sur la maquette). Séparé de `tasks/plan.md` et `tasks/todo.md` (on n'y touche pas).

## Décisions de départ
- La maquette n'a plus de hero, de cartes « COORDONNÉES DIRECTES » ni de frise de logos : la page devient deux sections crème, un bloc formulaire (titre collé à gauche, formulaire à droite) et un bloc photo et coordonnées. Les rendus `hero`, `cards` et `logos` restent intacts (partagés avec d'autres pages), seule la donnée de la page change. Le rendu `form` et `form.css`, propres à Contact, sont réécrits.
- Le h1 est « Parlons de votre projet. » (classe `hero__title` : `intro.js` l'anime comme sur les autres pages, header compris). Toutes les sections portent `data-header-theme="light" data-header-gradient="cream"` : le header reste olive sur crème de bout en bout.
- Mesures prises sur les frames à 1728 px : colonne formulaire de 765 px (x 794 à 1559), pas ~400 px comme dans le doc. Titre 48 px, légendes 24 px, pilules de 45 px de haut (texte ~17 px, pas 12 px), coordonnées ~52 px (pas ~40 px). Les frames font foi, écarts consignés.
- Titre collé (`position: sticky`) : demandé par le doc et le prompt, mais les frames 02 et 03 le montrent qui défile avec la page. Collé, noté dans les points à valider (une ligne CSS pour revenir à la frame).
- Photo : `retours-v4/assets/contact/contact-01.png` (718x622, coins arrondis gravés) rognée de 13 px par bord dans `public/assets/images/contact/`.
- Coordonnées lues dans `src/data/site.js` (e-mail, téléphone, Instagram sans « @ »), jamais écrites en dur ; valeurs à trancher : point 9 du doc V4.

## Graphe de dépendances
```
T1 données, photo, balisage, CSS (page lisible et utilisable sans JS)
 ├─ T2 formulaire : puces, champs, focus (CSS)
 │   └─ T3 validation, envoi simulé, honeypot (JS, a11y)
 ├─ T4 titre collé et cascade d'ouverture
 └─ T5 photo (clip-path, y, scale scrubés) puis coordonnées ligne à ligne
T2..T5 ──► T6 mobile, mouvement réduit, sans JavaScript ──► T7 vérification, baseline, revue, commit
```

## Impact sur le code partagé (graphify, graphe rafraîchi : 945 nœuds)
- `sections/form.js` : un seul importeur (`page-sections.js`), page Contact seule. `scripts/contact-form.js` : un seul importeur (`main.js`). `form.css` : Contact seule. `SUBMIT_NOTICE` : lu par la donnée Contact seule.
- `page-sections.js` : un type ajouté (`contact-coordonnees`). `main.js` : une entrée `initContact`, sans effet hors de la page. `fiche.js` : l'aide `afterIntro` passe dans un module partagé (même comportement).
- `?prestation=` (prévu pour la landing Noël, aucun lien ne l'utilise encore) : conservé, la prestation devient un choix unique.
- Non touchés : `hero`, `cards`, `logos`, `intro.js`, `footer-reveal.js`, `header-theme.js`, `cta.js`.

## Animations
1. **Ouverture** : intro commune (header, titre mot à mot, pastille qui se remplit) ; l'étiquette « • CONTACT » en fondu ; puis les 8 groupes du formulaire en cascade (`opacity`, `y` 24 px, 0,07 s). Ceux sous la ligne de flottaison se révèlent à l'entrée dans l'écran (une fois).
2. **Titre collé** : sticky à 120 px pendant tout le formulaire, libéré à sa fin.
3. **Photo** : scrubée (`scrub: 0.6`) entre l'arrivée du bloc en bas de l'écran et son centrage : `clip-path` de gauche à droite (courbe en `power3.in`, qui reproduit les frames 04 à 07 : 24, 41, 81, 100 % de largeur), `y` 18 vh vers 0, image intérieure `scale` 1,2 vers 1.
4. **Coordonnées** : après la photo, étiquette puis 3 lignes sous masque (`yPercent`), soulignement orange au survol.

## Tâches
Chaque tâche UI vérifie : sans JavaScript et mouvement réduit utilisables, 390 et 1728 de large, clavier, contraste (exceptions notées), jetons de couleur.

- [x] **T1 Données, photo, balisage** : photo rognée, données de la page (2 sections), renderers, `check-site` (`designTexts`), CSS de base. Vérif : `npm run build`, `node scripts/check-site.js`, page lisible.
- [x] **T2 UI Formulaire** : 3 groupes de puces (`fieldset` et `legend`, radios pour les choix obligatoires, `aria-pressed` pour le budget désélectionnable), champs à filet bas, libellés flottants pour les 4 coordonnées, focus orange (`scaleX`). Vérif : positions des frames 01 à 03.
- [x] **T3 UI Validation et envoi simulé** : messages français sous le champ (`aria-live`, `aria-invalid`), focus sur le premier champ en erreur, `submitContactForm(payload)` isolé, « Envoi en cours... » 0,8 s, confirmation, honeypot. Vérif : parcours clavier, envoi invalide puis valide, aucune requête réseau.
- [x] **T4 UI Titre collé et ouverture** : sticky, étiquette, cascade des groupes. Vérif : 3 moments, aucun saut.
- [x] **T5 UI Photo et coordonnées** : scène scrubée, lignes en masque, liens `mailto:`, `tel:`, Instagram. Vérif : photo à 3 moments contre les frames 04 à 07.
- [x] **Point de contrôle A** : page entière comparée à `contact-full.png`, `.baseline --fast`.
- [x] **T6 UI Mobile, mouvement réduit, sans JavaScript** : 390 x 844, une colonne, champs 16 px, photo sans `y`.
- [x] **T7 Vérification et livraison** : captures aux deux largeurs, `.baseline` complète, `/design:review`, points à valider (lignes 176 et suivantes), un commit.

## Résultat (2026-11-01)
- T1 à T7 faites, un seul commit. `.baseline` complète propre : build sans avertissement, HTML de l'accueil et de Noël identique octet pour octet, 16 captures, `check-site` à 13 pages sans écart (2 textes de maquette déclarés).
- Mesuré à 1728 x 1030 : légendes, pilules, filets, bouton à 1 à 2 px des frames 01 à 03 ; photo, étiquette et lignes à 1 à 3 px de la frame 08. Photo scrubée vérifiée à 4 moments (frames 04 à 07). 390 x 844 : une colonne, champs à 16 px minimum, photo sans `y`.
- Parcours clavier complet (skip link, header, 16 arrêts jusqu'à l'envoi), flèches sur les radios, envoi vide puis invalide puis valide, champ piège, `?prestation=`, aucune requête réseau, console vide en mouvement normal, réduit, sans JavaScript, après envoi. Aucun débordement horizontal de 320 à 1920 px. axe : seule la pilule choisie (crème sur orange, 3,06:1).
- Points à trancher : `docs/POINTS-A-VALIDER.md`, lignes 176 à 184 (dont les coordonnées, point 9 du doc V4).
