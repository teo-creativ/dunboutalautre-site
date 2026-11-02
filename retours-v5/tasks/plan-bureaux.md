# Plan : page Végétalisation de bureaux V5

Spec : `SPEC-bureaux.md`. Ce plan est séparé de `tasks/plan.md` et `tasks/todo.md` (pages secondaires, T31 et T32 en attente d'accord) : on n'y touche pas. Direction visuelle : `DESIGN.md` du dépôt (pas de `design-system/*/MASTER.md`, donc pas de tâche « Design direction »).

## Graphe de dépendances
```
T0 ordre, assets, point d'entrée ──► T1 hero ──► T2 chiffres ──► T3 cartes horizontales ──► T4 orange + photo plein écran ──► T5 slider
T5 ──► T6 pourquoi ──► T7 fonctionnement (vérifié) + logos + avis ──► T8 galerie ──► T9 FAQ + fin ──► T10 revue
```
Chaque section monte par-dessus la précédente (marge négative et `z-index`) : l'ordre est aussi un ordre de dépendance visuelle. T4 et T5 partagent le même élément (la photo devient le fond du slider).

## Impact sur le code partagé (graphify, 1 037 nœuds, à jour le 2026-11-02)
- `main.js` (58 liens, importé par rien) : un `import()` dynamique gardé par `[data-bx]` ; les 13 pages passent par lui.
- `scripts/intro.js` : lu par `main.js` seulement, mais exécuté sur les 13 pages : gardes pour un hero sans `.hero__tagline`, comportement inchangé quand il existe.
- `sections/hero.js`, `sections/logos.js`, `noel-testimonials.js` : dépendants = `page-sections.js` (et `sections/testimonials.js` pour l'avis) ; `noel-testimonials` sert aussi Noël (HTML identique exigé : G2). Props optionnelles uniquement.
- `components/page-sections.js` : aucun dépendant dans le graphe (chargé par le plugin d'injection) ; touche seulement les pages qui déclarent les nouveaux types.
- `tag.js` : 14 dépendants (footer, menu, faq, process, univers, cards...) : **lu seulement**, jamais modifié.
- `header-theme.js`, `site.js`, `footer-reveal.js`, `process.js`, `faq.js` : non modifiés.
- Hors graphe : CSS (`html.js .hero__title` masque le titre jusqu'à l'intro, `html.stats-anim`, `html.real-anim`), attributs `data-*`, liens par chaîne.

## Critères communs à toute tâche UI
États (sans JavaScript, mouvement réduit, ordinateur, mobile) ; 375, 768 et 1280 de large puis 1728 x 1030 ; clavier seul (focus visible, `:focus-visible` doublant le survol) ; contraste AA (exceptions notées dans `docs/POINTS-A-VALIDER.md`) ; jetons de couleur seulement ; `transform`, `opacity`, `clip-path` ; `invalidateOnRefresh: true` ; réversible au scroll arrière ; aucun défilement horizontal ; console vide ; thème du header relevé au raccord avec la section voisine.

## Tâches
Prompt 01 = T0 à T2 (un commit) ; prompt 02 = T3 ; prompt 03 = T4 et T5 ; prompt 04 = T6 à T9 ; prompt 05 = T10.

- [x] **T0 Ordre, assets, point d'entrée**
  - Acceptation : sections dans l'ordre V5 (hero, chiffres, installe, matières, pourquoi, fonctionnement, clients, avis, galerie, FAQ), `cta-final` retiré, `more` omis ; « Notre démarche pour » une fois dans `dist/` ; 3 fonds, 5 cartes, 4 photos de galerie dans `public/assets/images/bureaux/` (manifeste à jour) ; 6 logos SVG dans `logos-clients/` avec leurs dimensions ; `main.js` charge `bureaux.js` seulement si `[data-bx]`.
  - Vérification : `npm run build` sans avertissement ; `grep -c "Notre démarche pour"` = 1 ; `check-site` ; `gate.mjs --fast` (HTML d'accueil et de Noël identique).
  - Fichiers : `data/pages/bureaux.js`, `data/logos.js`, `page-sections.js`, `main.js`, `main.css`, `public/assets/*`.
- [x] **T1 UI Hero** : mots-clés, titre à pastille « la conception », CTA « Demander un devis », entrée comme les autres hero, sortie sous le crème
  - Acceptation : frames 01 et 02 ; hero épinglé un écran, contenu à 0,3 d'opacité et `y` -40 px, crème qui monte (marge -100svh, `z-index`) comme Nos univers ; header blanc puis olive dès que le crème atteint le haut ; pas de pin sous 900 px.
  - Vérification : captures à 0, mi-sortie et fin ; console vide ; `intro.js` identique sur accueil et Noël (G3).
  - Fichiers : `sections/hero.js` (props), `scripts/intro.js` (gardes), `bureaux-hero.js`, `bureaux-hero.css`.
- [x] **T2 UI Chiffres clés** : cascade des 3 cartes et compteurs
  - Acceptation : frames 03 à 05 ; +30, +10 ans (« ans » en petit), 100% ; « tous types de locaux » ; cartes tournées de -1,5°, +1°, -1° et chevauchées ; compteurs lancés une fois, `+` et `%` fixes ; valeurs finales dans le HTML.
  - Vérification : captures avant et après les compteurs ; mouvement réduit et sans JavaScript : valeurs finales ; `stats.js` non modifié.
  - Fichiers : `sections/bureaux-chiffres.js`, `bureaux-chiffres.js`, `bureaux-chiffres.css`.
- [x] **Checkpoint 1** : `gate.mjs` complet (vert), `/design:review` (aucun Block), un commit. Reste : relecture de l'utilisateur dans le navigateur.
- [ ] **T3 UI Cartes horizontales** : 5 cartes, effet vague, pin
  - Acceptation : frames 06 à 19 ; 5 cartes à vitesses propres (1,00 / 1,08 / 0,96 / 1,06 / 1,0), vague ±40 px et ±2° ; cartes 4 et 5 immobiles au centre ~40vh ; l'orange monte par-dessus ; mobile : une carte à la fois ; mouvement réduit : colonne sans pin ; `data-pin-length` pour le header.
  - Vérification : captures aux positions des frames 06, 10, 14, 17, 19 ; mesures des positions ; console.
- [ ] **T4 UI Trois matières : orange puis photo plein écran**
  - Acceptation : frames 20 à 25 ; `clip-path: inset()` + `scale` de l'image 1,2 vers 1 (largeurs mesurées sur les frames : 852, 1144, 1390, 1616 px puis plein écran) ; titre qui s'estompe ; header blanc, puis gradient `photo`.
  - Vérification : captures par frame ; aucun `width` ni `height` animé.
- [ ] **T5 UI Slider des 3 matières**
  - Acceptation : frames 26 à 33 ; voile ~40 % constant ; rail de 3 titres qui glisse en `x`, opacité 0,4 pour l'inactif ; fondu enchaîné des 3 fonds (`opacity`, `scale` 1,06 vers 1) ; 3 paragraphes superposés dans le DOM ; `aria-roledescription="carousel"`, `h3` par slide ; fonds préchargés ; la crème « Pourquoi » monte par-dessus.
  - Vérification : captures par frame ; aucun flash au changement de fond.
- [ ] **Checkpoint 2** : `gate.mjs`, `/design:review`, commit, relecture.
- [ ] **T6 UI Pourquoi végétaliser** : 4 lignes à état actif
  - Acceptation : frames 34 et 35 ; ligne active au survol, au focus et au passage au centre (`start: "top 55%"`), première active au départ ; transition 0,4 s sur `opacity` et `color` ; filets en `scaleX` ; mobile : tout lisible.
- [ ] **T7 UI Fonctionnement (vérifié), logos et avis**
  - Acceptation : timeline inchangée (frame 37) ; défilé de 6 logos en couleur (36 px, écart 90 px, masque de bords, pause au survol), `logos.css` des services intact ; avis Thunes (`fictif: true`) avec logo, 2 flèches visibles et inertes ; la galerie monte ensuite (frame 42).
  - Vérification : captures frames 37 à 39 et 41 ; page générée à une seule démarche.
- [ ] **T8 UI Galerie « Vos bureaux deviennent vivant »**
  - Acceptation : frames 43 à 48 ; 4 photos à 4 vitesses et 2 profondeurs (scale 1 et 0,85), derrière le titre, sorties par le haut sans jamais cacher le bouton ; mobile : 3 photos ; mouvement réduit : grille statique ; la FAQ monte par-dessus.
- [ ] **T9 UI FAQ et fin de page**
  - Acceptation : frames 49 à 53 ; 5 questions, la première ouverte ; `[À compléter]` pour la réponse 3 ; composant et footer inchangés ; JSON-LD FAQPage à 5 entrées.
  - Vérification : `check-site --placeholders` liste les manques.
- [ ] **Checkpoint 3** : `gate.mjs`, `/design:review`, commit, relecture.
- [ ] **T10 Revue V5** : non-régression, 5 largeurs (390, 768, 1440, 1728, 1920), mouvement réduit, sans JavaScript, raccords de header au pixel, Lighthouse et axe, points à valider mis à jour ; `live: true` seulement sur feu vert.

## Risques
- Raccords de sections (blanc entre deux sections superposées, header qui clignote) : balayer `header.dataset.theme` à chaque scroll, pas seulement des captures.
- Hauteur de page qui change (accordéon, pins) : `ScrollTrigger.refresh()` après deux images.
- Google Fonts coupe parfois la connexion : une panne de porte se rejoue avant de conclure à une régression.
