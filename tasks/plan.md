# Plan d'implémentation : pages secondaires de D'un Bout À L'autre

Statut : **brouillon à valider** · 2026-10-29 · branche `feature/pages-secondaires` · spec : `SPEC.md` (approuvée, commit `4970e04`).
Liste des tâches : `tasks/todo.md` (cases à cocher, critères et vérifications). Mesures : `tasks/metrics.md` (créé par T00).

## Vue d'ensemble

33 tâches en 7 phases livrent les 11 pages neuves sans changer l'accueil ni Noël. On construit **une page pilote complète (Terrasses)** section par section, puis on réplique : chaque tâche livre un morceau visible et vérifiable d'une vraie page, jamais une couche abstraite. Les composants partagés à paramétrer (`noel-faq`, `noel-process`, `noel-univers`, `noel-testimonials`) sont modifiés **au moment où une page en a besoin**, derrière la porte de non-régression.

## Décisions d'architecture

- **AD1 : rendu par données.** Chaque `<slug>/index.html` est une coquille (`head`, `seo`, `header`, `menu`, `page-sections`, `footer`). Les sections sortent de `src/data/pages/<page>.js` via des renderers sous `src/components/sections/`. Le registre `src/data/pages/index.js` est importé statiquement : le plugin d'injection (`inject-components.js`) est synchrone et ses composants tournent dans Node, donc rien de ce rendu n'entre dans le bundle navigateur.
- **AD2 : paramétrage des 4 composants `noel-*`.** Chacun devient une fonction de rendu qui reçoit ses données ; l'export par défaut appelle cette fonction avec les données de Noël. Les placeholders `<!--@noel-faq-->` du source de Noël ne changent pas, et la preuve est `compare-html.mjs`.
- **AD3 : isolation CSS par `body[data-page="page"]` (ajout à la spec).** Toute nouvelle règle est préfixée par ce sélecteur : les pages neuves portent `<body data-page="page">`, l'accueil n'a pas d'attribut et Noël porte `noel`. Aucune règle neuve ne peut donc atteindre l'accueil ou Noël. Les CSS existants (FAQ, processus, témoignages, univers, `cta-final`) restent réutilisés tels quels.
- **AD4 : `--pad-y` est défini pour Noël seulement** (`noel.css`, ligne 3) et lu par `.cta-final`. La feuille de page le redéfinit pour `data-page="page"`.
- **AD5 : une feuille par composant**, importée depuis `main.css` (une ligne). Pas de nouveau fichier CSS partagé avec d'anciens sélecteurs.
- **AD6 : tâches séquentielles.** Toutes touchent `page-sections.js`, le registre, `vite.config.js` ou `main.js`. Le seul parallélisme sûr est documentaire (T30). `boot()` de `main.js` est un nœud central du graphe (25 arêtes) : T15, T23 et T25 y ajoutent un `init` chacune, donc jamais en même temps.

### Graphe de dépendances (impact relevé avec graphify, 681 nœuds)

```
site.js ───────── cta.js, footer.js, header.js, menu.js, noel-seo.js, realisations.js (composant), services-list.js, stats-cards.js
                   → toute page change ses href via href() : sans effet tant que live est faux (preuve : compare-html)
noel-faq.js, noel-process.js, noel-testimonials.js, noel-univers.js
                   → 0 dépendant dans le graphe : ils sont consommés par les placeholders HTML de Noël, invisibles au graphe
                   → le vrai dépendant est decoration-noel-entreprises-paris/index.html : compare-html fait foi
initFaq / initProcess / initTestimonials / initUniverses → main.js boot() seulement (aucun script à modifier)
boot() (main.js) ─ nouvel init (logos, contact-form, realisations-filter) = nouvelle arête indirecte
esc(), fr() (utils.js) : 28 arêtes, jamais modifiés
```
Un `graphify update .` est lancé en début de chaque phase si du code a changé.

### Ordre de construction

```
T00 mesures de départ
 └─ T01 outils (placeholder, check-site, captures de pages)
     └─ T02 Terrasses : squelette ─ T03 feuille de page + bandeau final ─ T04 chemins de site.js
         ├─ T05 FAQ ─ T06 processus ─ T07 offres ─ T08 intro ─ T09 cartes ─ T10 galerie
         │      └─ [Point A : pilote Terrasses relu avec le fondateur]
         └─ T11 Bureaux ─ T12 chiffres ─ T13 témoignages ─ T14 logos ─ T15 marquee ─ [Point B]
             └─ T16 Design ─ T17 Scénographie ─ T18 Saisonnière ─ T19 Entretien ─ [Point C : 6 services]
                 └─ D1 (décision intro.js) ─ T20 ─ T21 Contact ─ T22 formulaire ─ T23 validation ─ [Point D]
                     └─ T24 Réalisations ─ T25 filtres ─ T26 fiche ─ [Point E]
                         └─ T27 Blog ─ T28 article ─ [Point F]
                             └─ T29 audit ─ T30 docs ─ [Point G : accord de mise en ligne]
                                 └─ T31 mise en ligne ─ T32 clôture
```

## Portes de vérification (définies une fois, citées par les tâches)

- **G1 Build :** `npm run build`, aucune erreur ni avertissement.
- **G2 HTML :** `node .baseline/compare-html.mjs`, accueil et Noël IDENTIQUES.
- **G3 Pixels :** `npx vite preview --port 4173`, `node .baseline/capture.mjs --out current`, `node .baseline/compare.mjs --ref reference --cur current --blur 1.2 --tol 0.02`, code 0 (16 captures). Dossier `current` écrasable, jamais `reference`.
- **G4 Contrôle statique :** `node scripts/check-site.js`.
- **G5 Visuel :** captures de la page à 1728, 1440, 1280, 768 et 375 px (`.baseline/pages.mjs`), relues ; console sans erreur ni avertissement.
- **G6 Accessibilité et performance (aux points de contrôle) :** axe-core dans tous les états de la page, Lighthouse desktop sur la build de prod ; outils installés dans le scratchpad, jamais dans le dépôt. Résultats consignés dans `tasks/metrics.md`.
- **NR = G1 + G2 + G3.** Obligatoire avant tout commit qui touche un composant, `main.js`, `main.css`, `site.js`, `vite.config.js` ou une donnée partagée (SPEC §7). Les tâches concernées portent `[NR]`.

Taille d'une tâche : les fichiers comptés excluent les lignes d'enregistrement d'une ligne (entrée Vite, registre `index.js`, import dans `main.css`, enregistrement d'un type dans `page-sections.js`).

## Écarts au SPEC à valider (relevés en lisant le code)

| # | Écart | Cause constatée dans le code | Proposition |
|---|---|---|---|
| E1 | « Chiffres clés » de Bureaux : cartes **statiques** (`figures`), pas `#stats` ni `stats.js` | `stats.js` suppose un `#stats` à titre avec tag, 3 cartes (`stat-card--1` à `--3` seulement) et des compteurs numériques ; « +X » n'est pas un nombre | Nouveau composant `figures`, 4 cartes, sans compteur |
| E2 | Entrées Vite ajoutées **page par page**, pas 11 d'un coup | Une coquille vide serait une tranche horizontale | Même état final ; le critère « 13 pages » du SPEC 9.1 se juge au Point G |
| E3 | `offers` : **une photo partagée** ou une tuile placeholder, pas de photo par item | `universes.js` fond les photos par `data-photo` sur des `<img>` uniquement | Photo unique comme Noël ; fondu inerte comme sur Noël |
| E4 | Témoignage unique : flèches masquées par une règle CSS neuve | `testimonials.js` exécute `nav.hidden = false` sans garde sur le nombre d'avis | Règle `body[data-page="page"] .testi__nav { display: none }` quand l'avis est seul |
| E5 | Hero de page : modificateur `hero--page` (H1 plus petit) | Les H1 du copywriting font 60 à 100 caractères, `.hero--noel .hero__title` est réglé à 64 vw pour 48 caractères | Nouvelle règle scopée, même motif visuel |
| E6 | Heroes **sans CTA** (Contact, Réalisations, Blog) : **décision D1** | `intro.js` appelle `gsap.set(cta, ...)` sans garde : sans CTA, GSAP écrit un avertissement console ; et sans `.hero__title` l'intro ne retire jamais la classe `js` (header masqué jusqu'à 6 s) | Voir D1 |

## Décisions à prendre

- **D1 (avant T20) : garde dans `intro.js`.** Option (a) : ajouter une garde d'une ligne `if (cta)` autour des `gsap.set` et `.to` du CTA, et de `leaves` ; `intro.js` est un script existant donc « demander d'abord ». Le comportement avec CTA est inchangé, la preuve est G2 + G3. Option (b) : mettre un CTA dans chaque hero, contre le copywriting (« Pas de CTA ici » pour Réalisations). Option (c) : tolérer l'avertissement, contre le critère 11. **Recommandation : (a).**
- **D2 : valider E1 à E6 et AD3.**
- **D3 : points de relecture avec vous.** Je propose A (pilote), C (6 services), F (pages complètes) et G (avant mise en ligne). B, D et E sont des contrôles automatisés sans relecture obligatoire.

## Risques et parades

| Risque | Impact | Parade |
|---|---|---|
| Une règle CSS neuve change l'accueil ou Noël | Haut | AD3 (préfixe `body[data-page="page"]`) + G3 sur chaque commit [NR] |
| H1 très longs dans le hero (jusqu'à 100 caractères) | Moyen | `hero--page` (E5), contrôle G5 à 4 largeurs dès T03 |
| Pages d'apparence « vide » à cause des `[À compléter]` | Moyen | Relecture au Point A avant de répliquer ; liste par `check-site.js --placeholders` |
| Avertissements console GSAP (CTA absent, cible nulle) | Moyen | D1, et G5 vérifie la console à chaque page |
| Poids CSS et JS au-delà du budget (+6 ko, +4 ko gzip) | Moyen | Mesure à T00, relevé après T10, T15, T23, T25 ; au-delà, arrêt et question |
| `main.js` modifié trois fois | Moyen | Tâches séquentielles, un `init` par tâche, NR à chaque fois |
| Graphe aveugle aux placeholders HTML | Moyen | `compare-html.mjs` est la vraie preuve de dépendance |
| `/slug` sans slash non servi par Vite | Faible | Chemins avec `/` final (T04), comme Noël |
| Ordre des tags dans les H1 jugé à la relecture | Faible | Choix proposés dans la spec ; ajustement en données, sans HTML |

## Questions ouvertes
1. D1 : option (a), (b) ou (c) ?
2. E1 à E6 et AD3 : acceptés ?
3. Points de relecture A, C, F, G : convient-il ?

## Liste des tâches (index ; détail dans `tasks/todo.md`)

**Phase 0 : départ**
- [ ] T00 Mesures de départ

**Phase 1 : fondation, page pilote Terrasses**
- [ ] T01 Outils de contrôle
- [ ] T02 Terrasses : squelette, SEO, hero [NR]
- [ ] T03 UI Terrasses : feuille de page et bandeau final [NR]
- [ ] T04 Chemins de `site.js` [NR]
- [ ] T05 UI Terrasses : FAQ [NR]
- [ ] T06 UI Terrasses : processus [NR]
- [ ] T07 UI Terrasses : offres, styles d'aménagement [NR]
- [ ] T08 UI Terrasses : intro
- [ ] T09 UI Terrasses : cartes
- [ ] T10 UI Terrasses : galerie
- [ ] Point A : pilote Terrasses

**Phase 2 : services**
- [ ] T11 UI Bureaux : page [NR]
- [ ] T12 UI Bureaux : chiffres clés
- [ ] T13 UI Bureaux : témoignages [NR]
- [ ] T14 UI Bureaux : frise de logos
- [ ] T15 UI Frise : marquee [NR]
- [ ] Point B : Bureaux
- [ ] T16 UI Design végétal [NR]
- [ ] T17 UI Scénographie [NR]
- [ ] T18 UI Décoration saisonnière [NR]
- [ ] T19 UI Entretien [NR]
- [ ] Point C : 6 services

**Phase 3 : Contact**
- [ ] T20 Garde dans `intro.js` (selon D1) [NR]
- [ ] T21 UI Contact : page et hero compact [NR]
- [ ] T22 UI Contact : formulaire
- [ ] T23 UI Contact : validation et envoi simulé [NR]
- [ ] Point D : Contact

**Phase 4 : Réalisations**
- [ ] T24 UI Réalisations : index [NR]
- [ ] T25 UI Réalisations : filtres [NR]
- [ ] T26 UI Fiche projet [NR]
- [ ] Point E : Réalisations

**Phase 5 : Blog**
- [ ] T27 UI Blog : index [NR]
- [ ] T28 UI Article modèle [NR]
- [ ] Point F : pages complètes

**Phase 6 : mise en ligne**
- [ ] T29 Audit complet des 13 pages
- [ ] T30 Documentation
- [ ] Point G : accord de mise en ligne
- [ ] T31 Mise en ligne [NR, accord explicite]
- [ ] T32 Clôture
