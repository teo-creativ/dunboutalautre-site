# SPEC : pages secondaires de D'un Bout À L'autre

Statut : **approuvé par le fondateur le 2026-10-29** · branche `feature/pages-secondaires` · départ `ecf8e6c` (code source identique à `ed795e5`).
Sources : `CLAUDE.md`, `DESIGN.md`, `docs/copywriting/` (11 fichiers), `docs/arborescence-et-strategie.md`, `docs/POINTS-A-VALIDER.md`, `.baseline/LISEZMOI.md`.
Lecture : **Décidé** = validé par le fondateur. **Proposé** = mon défaut, à corriger à la relecture.

## 1. Objectif

Ajouter au prototype d'intégration (Vite, HTML, CSS et JS à la main) les pages secondaires du site, avec le même design system et le même niveau de finition que l'accueil et la landing Noël, pour que la cliente voie l'ensemble du site avant la version Webflow.

- **Public :** les visiteurs B2B (entreprises, hôtels, restaurants, particuliers) à Paris et en Île-de-France, et la cliente et le fondateur qui relisent le prototype.
- **11 nouvelles pages :** 6 pages de service, Contact, Réalisations, une fiche projet modèle, Blog (index) et un article modèle.
- **Contrainte centrale :** l'accueil et la landing Noël, validés par la cliente, ne changent d'aucune façon. La preuve est mécanique (section 7).
- **Le copywriting est un premier jet :** tous les textes vivent dans des fichiers de données sous `src/data/pages/`, modifiables sans toucher au HTML.

### Décisions du fondateur
| Sujet | Décision |
|---|---|
| Branche de départ | `feat/fonctionnement-sans-pin` : le nouveau « Fonctionnement » est la version à garder |
| Mise en ligne | `live: true` dans `site.js` seulement à la fin, sur accord explicite |
| Coordonnées | Téléphone, e-mail et adresse en `[À compléter]` sur les pages neuves. Le menu partagé garde `site.js` (ligne 144 de `POINTS-A-VALIDER.md`) |
| Budget du formulaire | Les 3 tranches du copywriting : moins de 2000 €, 2 000 à 5 000 €, plus de 5 000 € |
| Formulaire | Validation côté client, envoi simulé, message « Formulaire valide. Prototype : aucun message n'a été envoyé. » dans une constante unique, `TODO` dans le code |
| Périmètre et ordre | Services, Contact, Réalisations et fiche, Blog (index et un article modèle). Pas de `/design:start` |
| Hors périmètre | Mentions légales, politique de confidentialité |
| Contenus manquants | `[À compléter]` + attribut `data-placeholder`. Aucun avis, citation ou article inventé |
| Logos manquants | Placeholder texte pour 6 : Eataly, ONF, Ambassade d'Italie, Orixa Media, Ecocem, Limonetik |
| Fiche projet | Une seule, Floral Fashion Show, pilotée par les données |
| Frise de logos | Marquee GSAP (DESIGN.md §5.9), statique en mouvement réduit |
| Budgets | CSS +6 ko gzip, JS +4 ko gzip, après mesure du Lighthouse de départ |
| Composants | Les 4 composants `noel-faq`, `noel-process`, `noel-testimonials`, `noel-univers` sont modifiables si le HTML construit d'Accueil et de Noël reste identique octet pour octet. Header, footer, menu, cta, tag, img restent intacts |
| Textes | `src/data/pages/` (un fichier par page) |
| Compteur du menu | « Réalisations (32) » reste à 32, aligné avec les coordonnées à la mise en ligne, en une seule passe |

### Hors périmètre
Mentions légales et confidentialité, envoi réel du formulaire, CMS, filtres du blog, vraies photos, vrais avis, vrais articles, nouveau pin ou scrub, framework de test, déploiement.

## 2. Carte des capacités

| Module | Responsabilité | Dépend de |
|---|---|---|
| `fondation` | Coquille de page, `seo`, rendu des sections depuis les données, placeholders, composants paramétrés, sections génériques, 11 entrées Vite, `check-site.js` | rien |
| `services` | 6 pages de service | fondation |
| `contact` | Formulaire guidé, validation, envoi simulé | fondation |
| `realisations` | Index avec filtres, fiche projet modèle | fondation |
| `blog` | Index, article modèle | fondation |
| `mise-en-ligne` | Passage de `live`, alignement des coordonnées et du compteur, refigeage unique de la référence, README | tous, sur accord explicite |

Ordre : `fondation` → `services` → `contact` → `realisations` → `blog` → `mise-en-ligne`. Un module est terminé quand ses critères (section 9) et la non-régression (section 7) passent.

## 3. Design

- **Référence :** `DESIGN.md` et `src/styles/tokens.css`. Pas de `design-system/` ni de `MASTER.md`, et pas de `/design:start` (décision du fondateur).
- **Style :** studio créatif haut de gamme et chaleureux. Olive, orange vermillon, crème. Poppins léger, Playfair Display italique dans les title tags.
- **Thèmes :** sections sombres (olive, orange) et claires (crème), avec le thème du header déclaré par `data-header-theme="light"` et `data-header-gradient`. Pas de mode sombre utilisateur.
- **Accessibilité :** WCAG AA (CLAUDE.md règle 5).
- **Largeurs :** bureau d'abord de 1440 à 1920, mobile propre sous 900 px, aucune barre de défilement horizontale.
- **Langue :** français.
- **Motifs réutilisés tels quels :** hero (variante `hero--noel`), `label`, `tag`, `cta` (4 variantes), `cta-final`, `faq`, `process`, `testi`, `universe`, `stat-card`.
- **Aucune couleur nouvelle.** Aucune icône inventée : le point orange et la feuille existants.

## 4. Commandes

```
Dev            npm run dev                                   (predev : npm run images)
Build          npm run build                                 (prebuild : npm run images ; 13 pages attendues)
Prévisualiser  npx vite preview --port 4173
Contrôle site  node scripts/check-site.js                    (à créer ; lit dist/ et src/data/pages/)
Placeholders   node scripts/check-site.js --placeholders     (liste page par page les [À compléter])
Non-régression node .baseline/compare-html.mjs               (HTML construit : identique octet pour octet)
               node .baseline/capture.mjs --out current      (16 captures, serveur sur 4173)
               node .baseline/compare.mjs --ref reference --cur current --blur 1.2 --tol 0.02
Lighthouse     npm i lighthouse axe-core dans le scratchpad, jamais dans le dépôt ;
               CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" ... --preset=desktop
```
Sous Git Bash, préfixer `MSYS_NO_PATHCONV=1` si un argument commence par `/`.

## 5. Structure du projet

```
vite.config.js                      + 11 entrées, rien d'autre
<slug>/index.html                   11 coquilles : head, seo, header, menu, main, footer, main.js
src/data/site.js                    + chemins avec « / » final ; `live` inchangé jusqu'à la mise en ligne
src/data/pages/<page>.js            textes, SEO et données : 6 services, contact, realisations, blog (fiche et article inclus)
src/data/pages/index.js             registre des pages (import statique : le plugin d'injection est synchrone)
src/components/seo.js               title, description, canonical, Open Graph, JSON-LD FAQPage
src/components/page-sections.js     rend la liste `sections` d'une page ; un renderer par type dans src/components/sections/
src/components/placeholder.js       todo(label), text(valeur) : [À compléter] + data-placeholder
src/components/noel-*.js            les 4 composants paramétrés (rendu par défaut : données de Noël)
src/styles/<composant>.css          un fichier par nouveau composant, importé depuis main.css (aucun fichier CSS existant modifié)
src/scripts/<composant>.js          nouveaux : contact-form, realisations-filter, logos ; init ajoutés à main.js
scripts/check-site.js               contrôle statique sans dépendance (commité)
.baseline/                          ignoré par git : reference/ et reference-html/ figés, pages/ pour les captures des pages neuves
docs/POINTS-A-VALIDER.md            une ligne par écart ou décision, à partir de 145
```

Types de section rendus depuis les données : `hero`, `intro`, `stats`, `cards`, `offers` (motif univers), `process`, `logos`, `testimonials`, `gallery`, `faq`, `cta-final`, `form`, `filters-grid`, `project`, `articles`, `article-body`.

## 6. Style de code

Même idiome que l'existant : modules ES, commentaire d'en-tête en français qui dit pourquoi, composants qui renvoient une chaîne, `esc()` sur toute valeur, `fr()` pour la typographie française, BEM, aucune valeur hexadécimale.

```js
// src/data/pages/terrasses.js (extrait). Une valeur inconnue est un marqueur, jamais un texte inventé.
import { todo } from "../../components/placeholder.js";

export const terrasses = {
  path: "/amenagement-terrasse-paris/",
  title: "Aménagement de terrasse à Paris | D'un Bout À L'autre",
  sections: [
    { type: "hero", title: "Aménagement de terrasse à Paris : votre espace extérieur, de la conception au suivi.", tag: "votre espace extérieur", cta: "Demander un devis gratuit" },
    { type: "testimonials", label: "RÉFÉRENCES CLIENTS", items: [{ quote: todo("citation client"), name: todo("prénom, nom, poste, entreprise") }] },
  ],
};
```

```js
// src/components/sections/cards.js : cartes de texte (label, titre, N cartes), depuis la section de données.
import { text } from "../placeholder.js";

export default ({ label, title, items }) => `<section class="cards" data-header-theme="light" data-header-gradient="cream" aria-labelledby="cards-title">
  <ul class="cards__list">${items.map((card) => `<li class="card"><h3 class="card__title">${text(card.title)}</h3><p class="card__text">${text(card.text)}</p></li>`).join("")}</ul>
</section>`;
```

Règles : classes `bloc__element`, `kebab-case` pour les fichiers, `camelCase` pour les identifiants, couleurs et tailles par variables de `tokens.css`, animations `transform`, `opacity` et `clip-path` seulement, jamais de `will-change` permanent, états de survol doublés par `:focus-visible`, `prefers-reduced-motion` respecté, **aucun tiret long** (« — » ni « – ») dans les textes.

## 7. Stratégie de test et de vérification

Aucun framework de test n'est ajouté (une dépendance se demande d'abord). Les vérifications sont exécutables et se rejouent.

| Niveau | Quoi | Outil | Quand |
|---|---|---|---|
| Non-régression HTML | HTML construit d'Accueil et de Noël identique octet pour octet (noms d'assets hachés normalisés) | `compare-html.mjs` | Avant chaque commit qui touche un composant, `main.js`, `main.css`, `site.js`, `vite.config.js` ou une donnée partagée ; fin de chaque module |
| Non-régression visuelle | 16 captures (haut, 5 scrolls, menu ouvert, survol de CTA) en comparaison tolérante, code de sortie 0 | `capture.mjs` + `compare.mjs` | Mêmes moments |
| Contrôle statique | Un seul `h1`, ordre des titres, `title` et meta, `alt`, ids uniques, pas de tiret long, tag = sous-chaîne exacte du titre, `data-placeholder` sur tout `[À compléter]`, liens internes résolus, liste des liens `#` | `check-site.js` | Chaque tâche |
| Accessibilité | axe-core sur chaque page et dans les états : repos, menu ouvert, FAQ ouverte, erreurs du formulaire, filtre actif ; clavier complet ; focus visible | CDP (`Runtime.evaluate`) | Fin de module |
| Performance | Lighthouse desktop, budgets CSS et JS (voir critères 3 et 4) | Lighthouse dans le scratchpad, build de prod | Départ (tâche 0), fin de module |
| Comportement | Formulaire (erreurs, succès, **0 requête réseau**, 0 écriture de stockage) ; filtres ; marquee à l'arrêt en mouvement réduit | CDP | Fin du module concerné |
| Visuel des pages neuves | Captures à 1728, 1440, 768 et 390 px, relues avec le fondateur | `.baseline/pages/` | Fin de module |
| Sans JavaScript | Contenu complet dans la build de prod, JS désactivé ; bouton d'envoi désactivé | CDP | Fin de module |

Preuve de non-régression : le pixel strict n'est pas mesurable (bruit entre deux passages : 0,0025 % au plus). « Identique » veut dire **HTML identique octet pour octet ET comparaison tolérante à 0**. À la mise en ligne, les `href` de l'accueil et de Noël changent : l'égalité d'octet échoue alors volontairement (module `mise-en-ligne`).

## 8. Limites

**Toujours**
- Reprendre le copywriting tel quel depuis `docs/copywriting/`, dans `src/data/pages/`.
- Lancer la non-régression avant chaque commit sensible (section 7).
- Marquer chaque valeur manquante `[À compléter]` + `data-placeholder`.
- Utiliser uniquement les tokens ; échapper toute valeur injectée.
- Un commit petit et clair en français par tâche (`feat:`, `fix:`, `docs:`).
- Consigner chaque écart ou décision dans `docs/POINTS-A-VALIDER.md` (lignes 145 et suivantes).

**Demander d'abord**
- Toute modification d'un fichier CSS ou script existant, ou d'un composant partagé autre que les 4 `noel-*` ; tout ajout au-delà d'un import dans `main.css`, d'un `init` dans `main.js`, des 11 entrées de `vite.config.js` et des chemins de `site.js`.
- Toute dépendance ; toute couleur ou icône nouvelle ; toute photo ajoutée ou générée.
- `live: true`, l'alignement des coordonnées et du compteur, le refigeage de `.baseline/reference*`.
- Tout écart entre un texte de page et le copywriting ; la microcopie fonctionnelle (messages d'erreur, états du formulaire, libellés d'accessibilité), proposée en données et listée dans `POINTS-A-VALIDER.md`.

**Jamais**
- Modifier `index.html` de l'accueil ou de Noël, `noel.js`, `noel-seo.js`, ou réécrire `.baseline/reference*`.
- Inventer un avis, une citation, un article, un chiffre, un prix, un logo ou une coordonnée.
- Afficher ou laisser croire qu'un e-mail est parti ; envoyer une requête réseau depuis le formulaire.
- Masquer un placeholder ; laisser un `[À compléter]` sans attribut.
- Utiliser un tiret long ; ajouter un `will-change` permanent ; animer `width`, `height`, `top` ou `left` au scroll.
- Pousser, committer `node_modules`, `dist`, `.baseline` ou `graphify-out`.

## 9. Spécification par module

### 9.0 Conventions communes à toutes les pages
- **Coquille :** `head`, `seo`, `header`, `menu current="<chemin>"`, `<main id="main" tabindex="-1">` avec `page-sections`, `footer`, `main.js`. Une seule coquille type pour les 11 pages.
- **Sections :** dans l'ordre des `###` du copywriting. Le label reprend l'intitulé `###` en majuscules, sans « (à redéfinir) ». Le titre `H2` est le « Titre » du copywriting.
- **Hero :** motif de Noël (fond de feuilles, H1, sous-titre, CTA `on-olive`), sans photo. Un title tag par H1, qui est une **sous-chaîne exacte** du titre : la phrase n'est jamais modifiée. Contact, Réalisations et Blog : variante compacte sans ligne de positionnement. Au plus un tag par H2.
- **Placeholders :** marqueur `{ todo: "libellé" }` dans les données, rendu `<span class="placeholder" data-placeholder="libellé">[À compléter]</span>`. Une valeur inconnue n'est jamais une chaîne vide.
- **Liens :** tous passent par `href()` de `site.js` : `#` tant que `live` est faux. Le maillage de `docs/arborescence-et-strategie.md` est appliqué aux emplacements indiqués.
- **Téléphone :** le copywriting l'ajoute en fin de chaque page de service. Il est rendu en `[À compléter]`. Noël l'a retiré parce que son design ne le montre pas (ligne 75 de `POINTS-A-VALIDER.md`).
- **Photos :** une photo existante n'est utilisée que si son sujet correspond (terrasses : 4 ; scénographie : 3 ; saisonnier : 5). Sinon, une tuile `Photo [À compléter]`. Bureaux, design végétal et entretien n'ont aucune photo.
- **Animations :** `data-reveal` (existant) uniquement, plus le marquee. Aucun pin, aucun scrub nouveau. Mobile : une colonne.

### 9.1 `fondation`
**Livre :** les 11 coquilles et entrées Vite ; `seo` (title et description de l'arborescence, canonical `https://dunboutalautre.co` + chemin comme Noël, Open Graph, JSON-LD FAQPage pour les pages à FAQ) ; `placeholder.js` ; `page-sections.js` et les renderers ; les 4 composants `noel-*` paramétrés (FAQ : titre et carte d'aide ; processus : titre ; témoignages ; univers) ; sections génériques (cartes, frise de logos en marquee, galerie, bandeau final) avec leur CSS ; `check-site.js` ; chemins avec « / » final dans `site.js` ; mesure du **Lighthouse de départ** de l'accueil et de Noël (tâche 0, avant tout changement).

**Critères**
- [ ] `npm run build` : 13 pages, aucune erreur ni avertissement.
- [ ] `compare-html.mjs` : accueil et Noël IDENTIQUES ; `compare.mjs` tolérant : code 0.
- [ ] Les ids imposés par les scripts (`#faq`, `#fonctionnement`, `#temoignages`, `#univers`) existent une seule fois par page.
- [ ] `check-site.js --placeholders` liste les marqueurs d'une page d'essai ; un `[À compléter]` sans attribut est une erreur.
- [ ] Budgets mesurés : CSS gzip ≤ 14,9 ko (départ 8,86 ko), JS gzip ≤ 71,3 ko (départ 67,30 ko).

### 9.2 `services`
Six pages (URL, title et meta : `docs/arborescence-et-strategie.md`, textes : `docs/copywriting/02` à `06` et `08`).

| Page | Chemin | Sections, dans l'ordre (type) | Placeholders attendus |
|---|---|---|---|
| Végétalisation de bureaux | `/vegetalisation-bureaux-paris/` | hero · chiffres clés (`stats`, 4) · pourquoi (`cards`, 4) · ce qu'on installe (`cards`, 5) · naturel, stabilisé ou artificiel (`cards`, 3) · démarche projet (`process`, 5) · références (`logos`, `testimonials`) · galerie · FAQ (6) · bandeau final | « +X projets », citation, logos, photos |
| Design végétal sur mesure | `/design-vegetal-sur-mesure-paris/` | hero · nos 5 créations (`offers`) · naturel, stabilisé ou artificiel (`cards`, 3) · branding végétal (`intro`) · processus (`process`, 4) · références · galerie · FAQ (6) · bandeau final | citation, logos (Ecocem, Limonetik), photos |
| Scénographie et événementiel | `/scenographie-vegetale-evenementiel-paris/` | hero · types d'événement (`offers`, 4) · références (`logos`) · notre approche (`process`, 4) · ateliers (`cards`, 3) · galerie · FAQ (6) · bandeau final | logos (Eataly, ONF, Ambassade d'Italie), contenus des ateliers |
| Terrasses | `/amenagement-terrasse-paris/` | hero · intro (`intro`) · styles (`offers`, 4) · expertise (`cards`, 3) · processus (`process`, 4) · galerie · FAQ (5) · bandeau final | photos des styles |
| Décoration saisonnière | `/decoration-vegetale-saisonniere-paris/` | hero · avantage principal (`intro`) · occasions (`offers`, 4) · décor qui évolue (`intro`) · références (`logos`) · galerie · FAQ (5) · bandeau final | logos, photos |
| Entretien et abonnements | `/entretien-abonnement-plantes-entreprise-paris/` | hero · ce qui est inclus (`cards`, 4) · formules (`cards`, 3) · végétaux entretenus (`cards`, 3) · comment ça marche (`process`, 4) · références (`logos`) · FAQ (6) · bandeau final | contenu des formules, liste de clients, durée d'engagement |

Tags proposés pour les H1 : « on s'occupe de tout » (bureaux), « sur mesure » (design), « décors sur mesure » (scénographie), « votre espace extérieur » (terrasses), « avec les saisons » (saisonnière), « toujours belles » (entretien). À corriger à la relecture.

**Critères**
- [ ] Chaque texte visible est dans `src/data/pages/` et identique au copywriting (relecture croisée).
- [ ] Chaque section du tableau existe, dans l'ordre ; chaque page a un H1 et un title et une meta de l'arborescence.
- [ ] Les logos manquants sont des placeholders texte ; les logos présents sont en niveaux de gris.
- [ ] Axe : 0 violation ; Lighthouse : Perf ≥ 85, Accessibilité ≥ 95, Bonnes pratiques ≥ 95 sur chaque page.
- [ ] Accueil et Noël : non-régression OK à la fin du module.

### 9.3 `contact`
`/contact/` · textes : `docs/copywriting/10`.

- **Sections :** hero compact (« Parlons de votre projet. » et sous-titre) ; formulaire guidé ; coordonnées directes ; réassurance (frise de logos du copywriting, placeholders pour Eataly, ONF et Ambassade d'Italie).
- **Champs :**

| Champ | Contrôle | Obligatoire |
|---|---|---|
| Type de prestation | 7 cases à cocher (Végétalisation de bureaux, Design végétal sur mesure, Scénographie végétale & événementiel, Terrasse, Décoration saisonnière (Noël, printemps...), Entretien & abonnement végétal, Autre) | oui, au moins une |
| Type de projet | 3 boutons radio en pilules (Entreprise, Hôtel ou restaurant, Particulier) | oui |
| Lieu d'intervention | texte (adresse) | non |
| Surface approximative | texte | non |
| Budget indicatif | 3 radios (moins de 2000 €, 2 000 à 5 000 €, plus de 5 000 €) | non |
| Date ou délai souhaité | texte | non |
| Message libre | zone de texte | oui |
| Prénom, Nom, E-mail, Téléphone | 4 champs, `autocomplete` adapté | oui |

- **Coordonnées directes :** téléphone, e-mail et adresse en `[À compléter]` ; Instagram `@dunboutalautre.co`.
- **Comportement :** `novalidate` et validation par script, erreurs par champ (`aria-invalid`, `aria-describedby`) et résumé ; focus sur la première erreur. À la validation : confirmation en `role="status"` avec la constante `SUBMIT_NOTICE` (`src/data/pages/contact.js`, écrite par le composant dans `data-notice` et lue par le script), `// TODO` d'envoi réel, **aucune requête réseau, aucun stockage**. `?prestation=` pré-coche la prestation (`bureaux`, `design-vegetal`, `scenographie`, `terrasse`, `saisonniere`, `entretien`, `autre`). Sans JavaScript, le bouton d'envoi est désactivé (le script le réactive).
- **Microcopie fonctionnelle** (erreurs, états) : en données, listée dans `POINTS-A-VALIDER.md` pour validation.

**Critères**
- [ ] Soumission vide : erreurs sur les 7 obligatoires, focus sur la première, aucun envoi.
- [ ] Soumission valide : `SUBMIT_NOTICE` affiché, 0 requête réseau (mesuré), 0 écriture dans `localStorage` et `sessionStorage`.
- [ ] Formulaire utilisable au clavier seul, étiquettes et groupes (`fieldset`, `legend`) corrects, axe : 0 violation dans tous les états.
- [ ] Une colonne sous 900 px, aucun défilement horizontal à 390 px.
- [ ] Le texte de confirmation ne dit jamais qu'un message est parti.

### 9.4 `realisations`
`/realisations/` et `/realisations/floral-fashion-show/` · textes : `docs/copywriting/09`.

- **Index :** hero compact (« Nous travaillons chaque projet avec la même passion. »), 7 filtres (boutons `aria-pressed`, zone `aria-live` pour le décompte), grille de 5 cartes (photo, titre, badge de catégorie) issues de `src/data/realisations.js` (titres et photos de l'accueil, jamais modifiés), bandeau « Un projet en tête ? Parlons-en. ».
- **Catégories :** seules celles du copywriting (Floral Fashion Show et Eataly : Scénographie & événementiel). Les 3 autres projets ont un badge `[À compléter]` et n'apparaissent que sous « Tous les projets ».
- **Fiche (Floral Fashion Show) :** Avant (photo `[À compléter]`, besoin), Projet (contraintes, proposition, matériaux et plantes, mission), Après (photo existante, surface, durée, budget « à partir de »). Tout champ inconnu est un `todo`. L'exemple « Siège social, Paris 8e » ne sert qu'à caler la forme des champs, il n'est pas publié.
- **Compteur du menu :** reste 32 face aux 5 cartes (ligne 144).

**Critères**
- [ ] « Tous les projets » : 5 cartes ; un filtre actif n'en montre que les cartes de sa catégorie ; le décompte est annoncé.
- [ ] La carte et le titre sont un seul lien accessible (comme l'accueil, ligne 90 de `POINTS-A-VALIDER.md`).
- [ ] La fiche s'ouvre depuis la carte (chemin gardé par `live`) et se pilote entièrement par les données.
- [ ] Axe : 0 violation ; aucun défilement horizontal ; non-régression OK.

### 9.5 `blog`
`/blog/` et `/blog/vegetaliser-bureaux-paris-guide/` · textes : `docs/copywriting/11`.

- **Index :** hero compact (H1 « Le blog de D'un Bout À L'autre »), article mis en avant (article 1), grille des 4 articles de lancement (titre et URL du copywriting ; photo, date et extrait `[À compléter]`), bandeau « Vous avez un projet ? On en discute. ». Pas de filtres.
- **Article modèle :** titre réel de l'article 1 ; auteur, date et temps de lecture, photo, corps (titres et paragraphes) tous en placeholder ; lien vers la page de service liée ; « Demander un devis » en fin d'article. La meta description est un placeholder.
- Les 3 autres articles pointent vers `#`.

**Critères**
- [ ] Aucun texte d'article n'est inventé : le corps est entièrement en `[À compléter]`.
- [ ] L'index et l'article respectent la hiérarchie de titres, un seul `h1`.
- [ ] Axe : 0 violation ; non-régression OK.

### 9.6 `mise-en-ligne` (sur accord explicite)
- Passer `live: true` pour les 11 pages et les entrées du menu ; aligner les coordonnées (téléphone, e-mail, adresse) et le compteur (32) dans `site.js`, **en une seule passe** (ligne 144).
- Optionnel, avec accord : `?prestation=saisonniere` sur les CTA de Noël (cela modifie le source de Noël).
- **Liste des écarts :** `compare-html.mjs` doit ne montrer que des changements de `href` et, le cas échéant, des coordonnées et du compteur. Je la présente au fondateur ; après son accord, `.baseline/reference*` est refigé **une seule fois**.
- README à jour (lancer, builder, déployer sur Netlify ou Vercel, liste des pages) ; `docs/POINTS-A-VALIDER.md` à jour.

**Critères**
- [ ] 0 lien interne cassé (`check-site.js`), 0 `#` restant hors liens volontairement fictifs.
- [ ] Liste des écarts approuvée par écrit avant refigeage.
- [ ] Lighthouse final sur les 13 pages : seuils du critère 4.

## 10. Critères de réussite globaux
1. `npm run build` sans erreur ni avertissement, 13 pages HTML.
2. Accueil et Noël : `compare-html` IDENTIQUE 2/2 et `compare.mjs` tolérant à 0, sur 16 captures, avant chaque commit sensible et à la fin de chaque module.
3. Budgets : CSS ≤ 14,9 ko gzip, JS ≤ 71,3 ko gzip.
4. Lighthouse desktop sur chaque nouvelle page : Performance ≥ 85, Accessibilité ≥ 95, Bonnes pratiques ≥ 95 ; accueil et Noël : ≥ 85 et pas plus de 2 points sous leur mesure de départ (**proposé**).
5. axe-core : 0 violation sur les 11 pages, dans tous les états listés en section 7.
6. Un seul `h1` par page, landmarks, lien d'évitement, focus visible, navigation complète au clavier, menu avec `aria-expanded`.
7. Aucun tiret long ; tous les textes identiques au copywriting ; microcopie fonctionnelle validée.
8. `check-site.js --placeholders` liste tous les manques ; aucun `[À compléter]` sans `data-placeholder` ; rien d'inventé.
9. Aucun défilement horizontal à 390, 768, 1024, 1440, 1728 et 1920 px.
10. Mouvement réduit : contenu visible, marquee à l'arrêt. JavaScript désactivé : contenu complet.
11. Console : 0 erreur, 0 avertissement sur chaque page.
12. Git : commits petits en français, aucun fichier ignoré commité, `.baseline/reference*` jamais réécrit hors accord.

## 11. Questions ouvertes

Approbation du 2026-10-29 : les valeurs proposées ci-dessous sont retenues. Elles se rouvrent à la relecture des pages.

1. **Seuil Lighthouse des pages existantes** (critère 4) : « pas plus de 2 points sous la mesure de départ » est ma proposition. Valide ?
2. **Tableau de la section 9.2** : l'association section → type (par exemple « notre approche » de la scénographie en `process`, les ateliers en `cards`) et les tags de H1 sont mes choix. À corriger à la relecture.
3. **Téléphone en fin de page** : le copywriting le demande, je le rends en `[À compléter]` ; Noël l'a retiré. Je le garde ou je l'omets ?
4. **Microcopie fonctionnelle** : messages d'erreur du formulaire, libellés des filtres, libellés d'accessibilité. Je propose les textes en données, vous les validez via `POINTS-A-VALIDER.md`.
5. **Sans JavaScript, bouton d'envoi désactivé** : acceptable pour un prototype sans serveur ?
6. **Meta description de l'article modèle** en placeholder : un `[À compléter]` dans `<head>` est visible dans le code seulement. Accepté ?
