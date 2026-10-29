# Tâches : pages secondaires de D'un Bout À L'autre

Plan, décisions, risques et définition des portes G1 à G6 : `tasks/plan.md`. Spec : `SPEC.md`.
Chaque tâche = un commit en français (`feat:`, `fix:`, `docs:`), avec les trailers de commit demandés par le harnais. Les chemins `src/...` sont relatifs à la racine.

## Définition de fait commune (toutes les tâches)
- [ ] Textes repris tels quels de `docs/copywriting/` dans `src/data/pages/`, aucun tiret long, aucune valeur inventée ; toute valeur manquante est `{ todo }` (rendu `[À compléter]` + `data-placeholder`).
- [ ] Couleurs et tailles par tokens (`tokens.css`), aucune valeur hexadécimale ; toute nouvelle règle CSS préfixée `body[data-page="page"]` (AD3).
- [ ] G1 (build) et G4 (`check-site.js`) passent ; tâche marquée `[NR]` : G2 et G3 passent avant le commit.
- [ ] Écart ou décision consigné dans `docs/POINTS-A-VALIDER.md` (lignes 145 et suivantes) quand il y en a.
- [ ] Aucun fichier de `.baseline/reference*`, `index.html` d'Accueil ou de Noël, `noel.js`, `noel-seo.js` modifié.

## Critères UI communs (toute tâche dont le titre porte `UI`)
- **UI-C1 États :** repos, survol, focus clavier, ouvert et fermé quand il y a un accordéon, placeholder, JavaScript désactivé ; plus erreur, vide ou succès quand la tâche en a.
- **UI-C2 Largeurs :** 375, 768 et 1280 px sans défilement horizontal (G5 ajoute 1440 et 1728).
- **UI-C3 Clavier seul :** parcours complet, focus visible, ordre logique.
- **UI-C4 Contraste :** AA mesuré, placeholders compris.
- **UI-C5 Mouvement réduit :** contenu visible, animations réduites à des fondus courts.
- **UI-C6 Tokens :** aucune valeur brute ; sélecteurs préfixés (AD3).

---

## Phase 0 : départ

- [x] **T00 : Mesures de départ**
  - **Description :** avant tout changement, mesurer l'accueil et Noël pour fixer les points de comparaison des budgets (SPEC critères 3 et 4).
  - **Critères :** `tasks/metrics.md` contient, pour l'accueil et Noël : Lighthouse desktop (Performance, Accessibilité, Bonnes pratiques, médiane de 3 passes), axe-core (repos, menu ouvert, FAQ ouverte pour Noël), poids gzip de `main-*.css` (8,86 ko attendu) et `main-*.js` (67,30 ko attendu), avertissements console ; budgets calculés : CSS ≤ départ + 6 ko, JS ≤ départ + 4 ko.
  - **Vérification :** deux passes Lighthouse à ±3 points ; chiffres de poids égaux à la sortie de `npm run build`.
  - **Dépendances :** aucune. **Fichiers :** `tasks/metrics.md`. **Taille :** XS. Aucune modification du code. `npm i lighthouse axe-core` dans le scratchpad, pas dans le dépôt.

## Phase 1 : fondation, page pilote Terrasses

- [x] **T01 : Outils de contrôle**
  - **Description :** le marqueur de placeholder, le contrôle statique du site et le script de capture des pages neuves.
  - **Critères :** `placeholder.js` exporte `todo(label)` et `text(valeur)` (chaîne échappée avec `fr()`, marqueur rendu `<span class="placeholder" data-placeholder="libellé">[À compléter]</span>`) ; `check-site.js` contrôle sur `dist/` : un seul `h1`, ordre des titres, `title` et meta, `alt`, ids uniques, tirets longs dans le texte visible, `[À compléter]` sans attribut, tag égal à une sous-chaîne exacte du titre, liens `#` listés, option `--placeholders` (page, libellé, nombre) ; `.baseline/pages.mjs` (ignoré par git) capture une URL à 1728, 1440, 1280, 768 et 375 px et relève la console.
  - **Vérification :** G1 ; `check-site.js` sur la build actuelle (accueil et Noël) : code 0 ; fixture négative dans le scratchpad (deux `h1`, un « — », un `[À compléter]` nu) : code 1 avec un message par défaut.
  - **Dépendances :** T00. **Fichiers :** `src/components/placeholder.js`, `scripts/check-site.js`, `.baseline/pages.mjs`. **Taille :** S. Fichiers neufs : pas de [NR].

- [x] **T02 : Terrasses, squelette, SEO et hero [NR]**
  - **Description :** première tranche verticale : `/amenagement-terrasse-paris/` sort des données (title, meta, hero) de bout en bout.
  - **Critères :** la page porte `<body data-page="page">`, `head`, `seo` (title et meta de l'arborescence, canonical `https://dunboutalautre.co/amenagement-terrasse-paris/`, Open Graph), `header`, `menu current`, `main` rendu par `page-sections`, `footer` ; le H1 et le sous-titre sont ceux de `docs/copywriting/05` ; le tag « votre espace extérieur » est une sous-chaîne exacte du titre ; le CTA « Demander un devis gratuit » pointe vers `#` ; l'intro se termine (classe `js` retirée) sans avertissement console ; contenu complet sans JavaScript.
  - **Vérification :** G1, G2, G3, G4 ; G5 à 1728 px (un H1 trop long non encore mis en forme est accepté, il l'est en T03).
  - **Dépendances :** T01. **Fichiers :** `amenagement-terrasse-paris/index.html`, `src/data/pages/terrasses.js`, `src/components/seo.js`, `src/components/page-sections.js`, `src/components/sections/hero.js` (+ `src/data/pages/index.js`, `vite.config.js`). **Taille :** M. Graphe : `vite.config.js` sans symbole ; fichiers neufs.

- [x] **T03 : UI Terrasses, feuille de page et bandeau final [NR]**
  - **Description :** rendre le hero lisible avec les H1 longs, redéfinir `--pad-y`, styler les placeholders, ajouter le bandeau final.
  - **Critères :** `page.css` définit (scopé) `--pad-y`, `hero--page` (H1 en `--fs-h2`), le style `.placeholder` visible ; `sections/cta-final.js` reprend le balisage de `.cta-final` de Noël avec le titre du copywriting (« Votre terrasse mérite mieux qu'un bac en plastique. »), le CTA `on-orange` et le téléphone en `[À compléter]` ; H1 en 4 lignes au plus de 375 à 1728 px, sans chevauchement ni coupure ; bandeau final de même rendu que Noël ; UI-C.
  - **Vérification :** G1 à G5 ; contraste du placeholder mesuré (AA).
  - **Dépendances :** T02. **Fichiers :** `src/styles/page.css`, `src/components/sections/cta-final.js`, `src/data/pages/terrasses.js` (+ `main.css`, `page-sections.js`). **Taille :** S.

- [x] **T04 : Chemins de `site.js` [NR]**
  - **Description :** donner un `/` final aux 9 chemins de navigation (6 services, Réalisations, Contact, Blog), comme Noël ; la fiche et l'article ne sont pas dans la navigation (écart de comptage avec le SPEC, qui parle de 11 chemins).
  - **Critères :** `href()` renvoie toujours `#` pour tout item non `live` ; `menu current="/amenagement-terrasse-paris/"` correspond au chemin de `site.js` ; le HTML construit d'Accueil et de Noël est identique.
  - **Vérification :** G1, G2, G3.
  - **Dépendances :** T03. **Fichiers :** `src/data/site.js`. **Taille :** XS. Graphe : `site.js` a pour dépendants `cta.js`, `footer.js`, `header.js`, `menu.js`, `noel-seo.js`, `components/realisations.js`, `services-list.js`, `stats-cards.js` : G2 le prouve inchangé.

- [x] **T05 : UI Terrasses, FAQ [NR]**
  - **Description :** paramétrer `noel-faq.js` et afficher la FAQ de Terrasses, avec les données structurées.
  - **Critères :** `noel-faq.js` reçoit libellé, titre, questions, carte d'aide facultative (rendu par défaut = Noël) ; `sections/faq.js` l'appelle avec les 5 questions de `docs/copywriting/05` ; `seo.js` ajoute le JSON-LD FAQPage identique aux questions affichées et la feuille `<noscript>` qui affiche toutes les réponses ; carte d'aide absente si le copywriting n'en a pas ; l'id `faq` est unique ; UI-C (accordéon : première réponse ouverte, `aria-expanded`, `aria-controls`).
  - **Vérification :** G1 à G5 ; HTML de Noël identique ; JSON-LD comparé au HTML par `check-site.js`.
  - **Dépendances :** T04. **Fichiers :** `src/components/noel-faq.js`, `src/components/sections/faq.js`, `src/components/seo.js`, `src/data/pages/terrasses.js`. **Taille :** M. Graphe : `noel-faq.js` n'a aucun dépendant dans le graphe (consommé par le placeholder HTML de Noël) ; `initFaq` est appelé par `main.js` seulement.

- [x] **T06 : UI Terrasses, processus [NR]**
  - **Description :** paramétrer `noel-process.js` et afficher les 4 étapes de la démarche Terrasses.
  - **Critères :** `noel-process.js` reçoit libellé, titre (avec tag), étapes ; l'id `fonctionnement` est unique ; la ligne et les pastilles se remplissent au scroll comme sur Noël ; contenu complet en mouvement réduit et sans JavaScript ; UI-C.
  - **Vérification :** G1 à G5 ; scroll de la page mesuré en CDP (pastilles et remplissage à trois positions).
  - **Dépendances :** T05. **Fichiers :** `src/components/noel-process.js`, `src/components/sections/process.js`, `src/data/pages/terrasses.js`. **Taille :** S. Graphe : mêmes remarques que T05 (`initProcess` appelé par `main.js` seulement).

- [x] **T07 : UI Terrasses, offres (styles d'aménagement) [NR]**
  - **Description :** paramétrer `noel-univers.js` et afficher les 4 styles d'aménagement, avec une photo unique ou une tuile placeholder (E3).
  - **Critères :** `noel-univers.js` reçoit libellé, titre (avec tag), items, photo ou marqueur de tuile ; l'id `univers` est unique ; `universes.js` s'exécute sans erreur avec une photo et sans photo ; survol, focus et tap ouvrent un item à la fois ; `.placeholder-tile` ajouté (scopé) à `page.css` ; UI-C (items ouverts et fermés).
  - **Vérification :** G1 à G5 ; test CDP : survol et Tab sur chaque item, console vide.
  - **Dépendances :** T06. **Fichiers :** `src/components/noel-univers.js`, `src/components/sections/offers.js`, `src/styles/page.css`, `src/data/pages/terrasses.js`. **Taille :** M. Graphe : `noel-univers.js` ambigu (composant et script du même nom) ; vrai dépendant : Noël seulement ; `initUniverses` ← `main.js`.

- [x] **T08 : UI Terrasses, introduction**
  - **Description :** bloc de texte (label, titre, paragraphe) du copywriting.
  - **Critères :** texte « INTRO » de `docs/copywriting/05` repris tel quel ; largeur de lecture bornée ; `data-reveal` ; UI-C.
  - **Vérification :** G1, G4, G5.
  - **Dépendances :** T07. **Fichiers :** `src/components/sections/intro.js`, `src/styles/intro.css`, `src/data/pages/terrasses.js` (+ `main.css`). **Taille :** S.

- [x] **T09 : UI Terrasses, cartes**
  - **Description :** composant de cartes de texte, utilisé pour « L'expertise des terrasses parisiennes » (3 blocs).
  - **Critères :** cartes titre et texte, ligne « Idéal pour » facultative ; 3 colonnes à partir de 1280 px, une colonne sous 900 px ; aucune icône inventée ; UI-C.
  - **Vérification :** G1, G4, G5.
  - **Dépendances :** T08. **Fichiers :** `src/components/sections/cards.js`, `src/styles/cards.css`, `src/data/pages/terrasses.js` (+ `main.css`). **Taille :** S.

- [x] **T10 : UI Terrasses, galerie**
  - **Description :** galerie d'aperçu de 6 tuiles : les 4 photos de terrasses existantes et 2 tuiles `Photo [À compléter]`, plus le bouton « Voir tous nos projets terrasses ».
  - **Critères :** images par le composant `img` (dimensions explicites, `loading="lazy"`, `alt` descriptifs en français) ; légendes en `{ todo }` ; bouton vers `href()` de Réalisations ; UI-C.
  - **Vérification :** G1, G4, G5 ; aucun décalage de mise en page mesuré (CLS).
  - **Dépendances :** T09. **Fichiers :** `src/components/sections/gallery.js`, `src/styles/gallery.css`, `src/data/pages/terrasses.js` (+ `main.css`). **Taille :** S.

- [ ] **Point A : page pilote Terrasses relue avec le fondateur**
  - [ ] G6 sur Terrasses : axe 0 violation dans tous les états ; Lighthouse desktop Performance ≥ 85, Accessibilité ≥ 95, Bonnes pratiques ≥ 95.
  - [ ] Poids : CSS ≤ départ + 6 ko gzip, JS ≤ départ + 4 ko gzip, relevés dans `tasks/metrics.md`.
  - [ ] NR complète : accueil et Noël identiques (G2, G3).
  - [ ] Captures de Terrasses à 5 largeurs, liste `--placeholders` et E1 à E6 présentées au fondateur.
  - [ ] **Décision du fondateur :** apparence des placeholders et des tags acceptée avant de répliquer sur les 5 autres services.

## Phase 2 : services

- [ ] **T11 : UI Bureaux, page [NR]**
  - **Description :** page `/vegetalisation-bureaux-paris/` avec les types de section déjà prêts.
  - **Critères :** hero, « Pourquoi végétaliser vos bureaux ? » (4 cartes), « Ce qu'on installe » (5 cartes avec « Idéal pour »), « Naturel, stabilisé ou artificiel ? » (3 cartes), démarche projet en 5 étapes, galerie de 4 tuiles placeholder, FAQ de 6 questions, bandeau final ; textes de `docs/copywriting/02` ; maillage de l'arborescence aux emplacements indiqués (liens en `#`) ; title et meta de l'arborescence.
  - **Vérification :** G1 à G5.
  - **Dépendances :** T10 et le Point A. **Fichiers :** `vegetalisation-bureaux-paris/index.html`, `src/data/pages/bureaux.js` (+ registre, `vite.config.js`). **Taille :** S.

- [ ] **T12 : UI Bureaux, chiffres clés**
  - **Description :** 4 cartes de chiffres statiques (E1), sans `#stats` ni compteur.
  - **Critères :** « +X projets » en `{ todo }`, les 3 autres cartes du copywriting ; cartes blanches, rayon et ombre des tokens, légère rotation ; `initStats` ne fait rien (id absent) ; UI-C.
  - **Vérification :** G1, G4, G5.
  - **Dépendances :** T11. **Fichiers :** `src/components/sections/figures.js`, `src/styles/figures.css`, `src/data/pages/bureaux.js` (+ `main.css`). **Taille :** S.

- [ ] **T13 : UI Bureaux, témoignages [NR]**
  - **Description :** paramétrer `noel-testimonials.js` et afficher l'emplacement de citation de Bureaux (E4).
  - **Critères :** `noel-testimonials.js` reçoit libellé et avis ; un avis unique en `{ todo }` sans attribut `data-fictif` ; les flèches restent masquées malgré `testimonials.js` (règle scopée dans `page.css`) ; aucune erreur console avec un `[À compléter]` ; l'id `temoignages` est unique ; UI-C.
  - **Vérification :** G1 à G5 ; test CDP : flèches invisibles après l'initialisation.
  - **Dépendances :** T12. **Fichiers :** `src/components/noel-testimonials.js`, `src/components/sections/testimonials.js`, `src/styles/page.css`, `src/data/pages/bureaux.js`. **Taille :** S. Graphe : `initTestimonials` ← `main.js` ; `noel-testimonials.js` sans dépendant dans le graphe.

- [ ] **T14 : UI Bureaux, frise de logos**
  - **Description :** frise de logos du client en niveaux de gris, d'après `docs/copywriting/02` et l'arborescence.
  - **Critères :** `src/data/logos.js` (nom, fichier, largeur, hauteur) mesuré une fois avec `sharp` (déjà dans le projet) ; logos présents en `<img>` aux dimensions explicites, `alt` = nom du client ; logos manquants (Orixa Media pour Bureaux) en tuile nom + `[À compléter]` ; `filter: grayscale(1)` et `mix-blend-mode: multiply` ; UI-C.
  - **Vérification :** G1, G4, G5 ; aucun décalage de mise en page.
  - **Dépendances :** T13. **Fichiers :** `src/data/logos.js`, `src/components/sections/logos.js`, `src/styles/logos.css`, `src/data/pages/bureaux.js` (+ `main.css`). **Taille :** M.

- [ ] **T15 : UI Frise de logos, défilement [NR]**
  - **Description :** marquee GSAP de la frise (décision du fondateur : DESIGN.md §5.9), statique en mouvement réduit.
  - **Critères :** `src/scripts/logos.js` (transform seulement, boucle sans à-coup, pause au survol et au focus, `ctx.revert()`) ; éléments dupliqués en `aria-hidden` ; `init` ajouté à `main.js` ; section documentée dans `docs/ANIMATIONS.md` ; en mouvement réduit la ligne est statique ; UI-C.
  - **Vérification :** G1 à G5 ; mesure CDP de la position à trois instants et de la vitesse ; poids JS relevé dans `tasks/metrics.md`.
  - **Dépendances :** T14. **Fichiers :** `src/scripts/logos.js`, `src/scripts/main.js`, `docs/ANIMATIONS.md`, `src/styles/logos.css`. **Taille :** M. Graphe : `main.js` `boot()` (25 arêtes) reçoit une nouvelle arête indirecte ; tâche séquentielle.

- [ ] **Point B : Bureaux complète**
  - [ ] Axe 0 violation dans tous les états ; Lighthouse sur la page ; poids relevés ; NR complète.
  - [ ] Relevé des placeholders ; aucune relecture fondateur obligatoire.

- [ ] **T16 : UI Design végétal sur mesure [NR]**
  - **Description :** page `/design-vegetal-sur-mesure-paris/` avec tous les types de section prêts.
  - **Critères :** hero, « Nos 5 créations » (offres, tuile placeholder), « Naturel, stabilisé ou artificiel ? » (3 cartes), branding végétal (intro), processus en 4 étapes, références (logos Ecocem et Limonetik en placeholder, Comet, Groupe Rocher et BHV présents) et citation `{ todo }`, galerie, FAQ de 6 questions, bandeau final ; textes de `docs/copywriting/03`.
  - **Vérification :** G1 à G5. **Dépendances :** T15. **Fichiers :** `design-vegetal-sur-mesure-paris/index.html`, `src/data/pages/design-vegetal.js` (+ registre, `vite.config.js`). **Taille :** S.

- [ ] **T17 : UI Scénographie et événementiel [NR]**
  - **Description :** page `/scenographie-vegetale-evenementiel-paris/`.
  - **Critères :** hero, types d'événement (offres, 4), références (Eataly, ONF, Ambassade d'Italie en placeholder), « Notre approche » (processus en 4 étapes), ateliers (3 cartes), galerie (photos Floral Fashion Show et plafond d'Eataly + placeholders), FAQ de 6 questions, bandeau final ; textes de `docs/copywriting/04`.
  - **Vérification :** G1 à G5. **Dépendances :** T16. **Fichiers :** `scenographie-vegetale-evenementiel-paris/index.html`, `src/data/pages/scenographie.js` (+ registre, `vite.config.js`). **Taille :** S.

- [ ] **T18 : UI Décoration saisonnière [NR]**
  - **Description :** page `/decoration-vegetale-saisonniere-paris/`.
  - **Critères :** hero, avantage principal (intro), occasions (offres, 4) avec lien vers la landing Noël (`href()` réel, Noël est `live`), « Un décor qui évolue » (intro), références (Eataly en placeholder ; Hôtel Cluny Square, Hôtel des Grands Boulevards, BHV, Botimyst présents), galerie (5 photos existantes et 1 placeholder), FAQ de 5 questions, bandeau final ; textes de `docs/copywriting/06`.
  - **Vérification :** G1 à G5 ; le lien vers Noël résout vers `/decoration-noel-entreprises-paris/`. **Dépendances :** T17. **Fichiers :** `decoration-vegetale-saisonniere-paris/index.html`, `src/data/pages/saisonniere.js` (+ registre, `vite.config.js`). **Taille :** S.

- [ ] **T19 : UI Entretien et abonnements [NR]**
  - **Description :** page `/entretien-abonnement-plantes-entreprise-paris/`.
  - **Critères :** hero, « Ce qui est inclus » (4 cartes), formules (3 cartes : noms du copywriting, contenus en `{ todo }`), végétaux entretenus (3 cartes), « Comment ça marche » (4 étapes), références (liste en `{ todo }`), FAQ de 6 questions, durée d'engagement en `{ todo }`, bandeau final ; textes de `docs/copywriting/08`.
  - **Vérification :** G1 à G5. **Dépendances :** T18. **Fichiers :** `entretien-abonnement-plantes-entreprise-paris/index.html`, `src/data/pages/entretien.js` (+ registre, `vite.config.js`). **Taille :** S.

- [ ] **Point C : 6 pages de service relues avec le fondateur**
  - [ ] G6 sur les 6 pages ; poids CSS et JS dans le budget ; NR complète ; `check-site.js --placeholders` par page.
  - [ ] Captures des 6 pages présentées ; tags de H1 et association section → motif de la spec (9.2) validés.
  - [ ] **Décision D1 prise** avant la phase 3.

## Phase 3 : Contact

- [ ] **T20 : Garde dans `intro.js` (selon D1, option a) [NR]**
  - **Description :** éviter l'avertissement GSAP quand le hero n'a ni CTA ni feuilles (E6).
  - **Critères :** garde d'une ligne autour des `gsap.set` et `.to` du CTA et des feuilles ; comportement avec CTA strictement inchangé ; diff de `intro.js` de 6 lignes au plus.
  - **Vérification :** G1, G2, G3 ; page de test sans CTA : 0 avertissement console.
  - **Dépendances :** D1. **Fichiers :** `src/scripts/intro.js`. **Taille :** XS. Graphe : `initIntro` n'est appelé que par `main.js`. Si D1 = (b) ou (c), cette tâche est remplacée.

- [ ] **T21 : UI Contact, page, hero compact et coordonnées [NR]**
  - **Description :** page `/contact/` avec le hero compact et les blocs d'information.
  - **Critères :** hero compact (« Parlons de votre projet. » et sous-titre de `docs/copywriting/10`, sans CTA ni ligne de positionnement) ; coordonnées directes en 4 cartes : téléphone, e-mail et adresse en `[À compléter]`, Instagram `@dunboutalautre.co` ; réassurance en frise de logos de la page (Eataly, ONF, Ambassade d'Italie en placeholder) ; intro terminée, console vide.
  - **Vérification :** G1 à G5. **Dépendances :** T20 (ou D1 autre). **Fichiers :** `contact/index.html`, `src/data/pages/contact.js`, `src/styles/page.css`, `src/components/sections/hero.js` (+ registre, `vite.config.js`). **Taille :** M.

- [ ] **T22 : UI Contact, formulaire**
  - **Description :** le formulaire guidé, mis en forme, sans comportement.
  - **Critères :** les champs de la spec 9.3 (7 prestations en cases à cocher, 3 types de projet en pilules radios, lieu, surface, 3 tranches de budget, date, message, prénom, nom, e-mail, téléphone) ; `fieldset` et `legend`, une étiquette par champ, `autocomplete`, `aria-required` ; bouton « Envoyer ma demande » désactivé sans JavaScript ; une colonne sous 900 px ; UI-C.
  - **Vérification :** G1, G4, G5 ; axe 0 violation (repos).
  - **Dépendances :** T21. **Fichiers :** `src/components/sections/form.js`, `src/styles/form.css`, `src/data/pages/contact.js` (+ `main.css`). **Taille :** M.

- [ ] **T23 : UI Contact, validation et envoi simulé [NR]**
  - **Description :** validation côté client, confirmation sans envoi, préremplissage.
  - **Critères :** soumission vide : 7 erreurs, résumé, focus sur la première ; soumission valide : `SUBMIT_NOTICE` (« Formulaire valide. Prototype : aucun message n'a été envoyé. ») dans `role="status"`, lue depuis `data-notice` ; `// TODO` d'envoi réel dans le script ; `?prestation=` coche la prestation ; messages d'erreur en données ; `init` ajouté à `main.js` ; UI-C avec états erreur et succès.
  - **Vérification :** G1 à G5 ; CDP : 0 requête réseau et 0 écriture de stockage à la soumission ; axe 0 violation en états erreur et succès.
  - **Dépendances :** T22. **Fichiers :** `src/scripts/contact-form.js`, `src/scripts/main.js`, `src/data/pages/contact.js`, `src/components/sections/form.js`. **Taille :** M. Graphe : `main.js` `boot()` : tâche séquentielle.

- [ ] **Point D : Contact complète**
  - [ ] G6 ; poids ; NR complète ; messages d'erreur listés dans `POINTS-A-VALIDER.md` pour validation.

## Phase 4 : Réalisations

- [ ] **T24 : UI Réalisations, index [NR]**
  - **Description :** page `/realisations/` : hero compact, grille de 5 cartes, bandeau final.
  - **Critères :** cartes issues de `src/data/realisations.js` (titres et photos de l'accueil, fichier non modifié) ; badge de catégorie seulement pour Floral Fashion Show et Eataly (Scénographie & événementiel), `[À compléter]` pour les trois autres ; titre et photo en un seul lien accessible (la photo en `tabindex="-1"` et `aria-hidden`) ; bandeau « Un projet en tête ? Parlons-en. » ; barre de filtres présente et masquée sans JavaScript ; UI-C.
  - **Vérification :** G1 à G5. **Dépendances :** T23. **Fichiers :** `realisations/index.html`, `src/data/pages/realisations.js`, `src/components/sections/filters-grid.js`, `src/styles/filters-grid.css` (+ registre, `vite.config.js`). **Taille :** M.

- [ ] **T25 : UI Réalisations, filtres [NR]**
  - **Description :** les 7 filtres du copywriting.
  - **Critères :** boutons `aria-pressed`, zone `aria-live` annonçant le décompte ; « Tous les projets » : 5 ; Scénographie : 2 ; autres catégories : état vide avec message (microcopie en données) ; fondu court, aucun mouvement en mouvement réduit ; `init` ajouté à `main.js` ; UI-C avec états actif, vide.
  - **Vérification :** G1 à G5 ; CDP : filtre au clavier, décompte annoncé. **Dépendances :** T24. **Fichiers :** `src/scripts/realisations-filter.js`, `src/scripts/main.js`, `src/data/pages/realisations.js`. **Taille :** S. Graphe : `main.js` `boot()` : séquentielle.

- [ ] **T26 : UI Fiche projet Floral Fashion Show [NR]**
  - **Description :** une fiche pilotée par les données, parcours Avant, Projet, Après.
  - **Critères :** `/realisations/floral-fashion-show/` ; Avant : photo `[À compléter]` et besoin en `{ todo }` ; Projet : contraintes, proposition, matériaux et plantes, mission en `{ todo }` ; Après : photo `real-floral-fashion-show` avec `alt`, surface, durée, budget « à partir de » en `{ todo }` ; l'exemple « Siège social » n'est pas publié ; le rendu accepte un second objet projet sans erreur ; lien depuis la carte (via `href()`) ; UI-C.
  - **Vérification :** G1 à G5 ; appel du renderer avec un second projet fictif en Node (aucune sortie dans le dépôt). **Dépendances :** T25. **Fichiers :** `realisations/floral-fashion-show/index.html`, `src/components/sections/project.js`, `src/styles/project.css`, `src/data/pages/realisations.js` (+ registre, `vite.config.js`). **Taille :** M.

- [ ] **Point E : Réalisations complètes**
  - [ ] G6 ; poids ; NR complète ; compteur du menu (32) face aux 5 cartes noté (ligne 144).

## Phase 5 : Blog

- [ ] **T27 : UI Blog, index [NR]**
  - **Description :** page `/blog/` : hero compact, article mis en avant, grille des 4 articles de lancement, bandeau final.
  - **Critères :** H1 « Le blog de D'un Bout À L'autre » et sous-titre de `docs/copywriting/11` ; titres et URL des 4 articles du copywriting ; photo, date et extrait en `{ todo }` ; l'article 1 est en vedette ; pas de filtres ; bandeau « Vous avez un projet ? On en discute. » ; liens en `#` sauf l'article modèle ; UI-C.
  - **Vérification :** G1 à G5. **Dépendances :** T26. **Fichiers :** `blog/index.html`, `src/data/pages/blog.js`, `src/components/sections/articles.js`, `src/styles/articles.css` (+ registre, `vite.config.js`). **Taille :** M.

- [ ] **T28 : UI Article modèle [NR]**
  - **Description :** `/blog/vegetaliser-bureaux-paris-guide/`, modèle d'article.
  - **Critères :** H1 = titre réel ; auteur, date, temps de lecture, photo et corps en `{ todo }` ; lien vers la page de service liée ; « Demander un devis » en fin d'article ; meta description en `{ todo }` ; élément `article`, un seul `h1` ; UI-C.
  - **Vérification :** G1 à G5. **Dépendances :** T27. **Fichiers :** `blog/vegetaliser-bureaux-paris-guide/index.html`, `src/components/sections/article-body.js`, `src/styles/article.css`, `src/data/pages/blog.js` (+ registre, `vite.config.js`). **Taille :** M.

- [ ] **Point F : 11 pages complètes, relecture du fondateur**
  - [ ] G6 sur les 11 pages ; poids ; NR complète ; `check-site.js --placeholders` complet ; captures de toutes les pages présentées.

## Phase 6 : mise en ligne

- [ ] **T29 : Audit complet des 13 pages**
  - **Description :** vérifier les critères globaux du SPEC (section 10) sur la build de prod.
  - **Critères :** Lighthouse desktop (Performance ≥ 85, Accessibilité ≥ 95, Bonnes pratiques ≥ 95) ; axe 0 violation dans tous les états ; aucun défilement horizontal à 390, 768, 1024, 1440, 1728 et 1920 px ; contenu complet sans JavaScript ; mouvement réduit ; console vide ; accueil et Noël à ≥ 85 et au plus 2 points sous leur départ ; liste des écarts à corriger.
  - **Vérification :** résultats dans `tasks/metrics.md` ; toute correction passe par ses portes. **Dépendances :** Point F. **Fichiers :** `tasks/metrics.md` (+ corrections). **Taille :** M.

- [ ] **T30 : Documentation**
  - **Description :** consigner écarts, microcopie et contenus manquants.
  - **Critères :** `POINTS-A-VALIDER.md` (lignes 145 et suivantes) : E1 à E6, AD3, messages du formulaire et des filtres à valider, catégories des 3 projets, logos manquants, contenus en placeholder par page ; `README.md` (lancer, builder, déployer sur Netlify ou Vercel, liste des pages) ; `.baseline/LISEZMOI.md`.
  - **Vérification :** relecture ; `check-site.js --placeholders` recoupé avec la liste. **Dépendances :** T29. **Fichiers :** `docs/POINTS-A-VALIDER.md`, `README.md`. **Taille :** S. Parallélisable avec T29 (fichiers distincts).

- [ ] **Point G : accord de mise en ligne**
  - [ ] Les 11 pages relues ; coordonnées définitives (téléphone, e-mail, adresse) et compteur fournis ; **accord explicite et écrit du fondateur** avant T31.

- [ ] **T31 : Mise en ligne [NR, accord explicite]**
  - **Description :** passage de `live`, alignement des coordonnées et du compteur en une seule passe (ligne 144), refigeage unique.
  - **Critères :** `live: true` pour les entrées de navigation et de services concernées ; coordonnées et compteur mis à jour dans `site.js` ; `compare-html.mjs` ne montre que des `href`, des coordonnées et le compteur ; liste des écarts présentée et approuvée par écrit ; `.baseline/reference*` refigés une seule fois ; `check-site.js` : 0 lien interne cassé, seuls restent `#` les liens hors périmètre (mentions légales, confidentialité, Facebook).
  - **Vérification :** G1 à G5 sur les 13 pages. **Dépendances :** Point G. **Fichiers :** `src/data/site.js` (+ optionnel, avec accord distinct : CTA de Noël avec `?prestation=saisonniere`, qui modifie le source de Noël). **Taille :** S.

- [ ] **T32 : Clôture**
  - **Description :** vérification finale de la définition de « terminé » de `CLAUDE.md` §6.
  - **Critères :** `npm run dev` et `npm run build` sans erreur ni avertissement ; Lighthouse final sur les 13 pages ; `README.md` à jour ; arbre propre ; aucun fichier ignoré commité ; synthèse des écarts restants.
  - **Vérification :** `tasks/metrics.md` à jour. **Dépendances :** T31. **Fichiers :** `tasks/metrics.md`, `README.md`. **Taille :** XS.
