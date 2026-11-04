# D'un Bout À L'autre : prototype d'intégration

13 pages : l'accueil (`/`), la landing Décors de Noël (`/decoration-noel-entreprises-paris/`) et 11 pages secondaires (voir plus bas). Prototype codé à la main pour montrer la direction design et le niveau d'animation visé ; il ne remplace pas la future version Webflow.

Stack : Vite (multi-pages), JavaScript ES vanilla, CSS natif, GSAP (ScrollTrigger, SplitText), Lenis. Aucun framework.

## Démarrer
1. `npm install`
2. `npm run dev` (http://localhost:5173). La commande génère d'abord les images WebP responsives (`npm run images`).
3. `npm run build` produit `dist/` sans avertissement, `npm run preview` le sert (http://localhost:4173).

Relire les pages secondaires au clic : `npm run dev:liens`. Tant que `live` n'est pas passé à `true` (`src/data/site.js`), leurs liens valent `#` ; ce mode, réservé au serveur de dev, rend cliquables toutes les pages qui existent (menu, cartes, boutons, fiche projet, article). Les pages légales (hors périmètre) et Facebook restent en `#`. La build ignore ce mode : `dist/` est identique.

Les captures et les tests d'animation se font sur la build : `npm run build` puis `npm run preview`.

Contrôle du site construit : `node scripts/check-site.js` (un seul h1, titres, title et meta, `alt`, ids, tirets longs, textes des pages secondaires comparés au copywriting, JSON-LD, liens internes) ; `node scripts/check-site.js --placeholders` liste les valeurs à compléter, page par page ; `--links` exige en plus qu'aucun lien ne soit `#` (mise en ligne).

## Déployer pour partager un lien
Netlify ou Vercel : commande de build `npm run build`, dossier de publication `dist`. Aucune variable d'environnement n'est nécessaire. Le domaine `https://dunboutalautre.co` utilisé pour le canonical et Open Graph de la landing est supposé (`src/data/noel.js`).

### Preview GitHub Pages (`https://teo-creativ.github.io/dunboutalautre-site/`)
Le workflow `.github/workflows/preview.yml` construit et publie `dist` à chaque push de `feature/pages-secondaires` (ou à la main : onglet Actions, « Preview GitHub Pages », Run workflow). Il ne touche pas à `main`. Trois variables de build, lues seulement par ce workflow ; sans elles, le build et le dev local sont strictement ceux d'avant :

| Variable | Effet |
|---|---|
| `VITE_BASE=/dunboutalautre-site/` | Préfixe toutes les URL (liens internes, images, scripts, CSS). Valeur par défaut : `/`. |
| `VITE_NOINDEX=1` | Ajoute `<meta name="robots" content="noindex, nofollow">` à chaque page et un `robots.txt` « Disallow: / ». |
| `VITE_PREVIEW_LINKS=1` | Rend cliquables les liens vers les pages qui existent (menu, footer, cartes), sans changer `live` dans `src/data/site.js`. |

Essai en local de la preview : `VITE_BASE=/dunboutalautre-site/ VITE_NOINDEX=1 VITE_PREVIEW_LINKS=1 npm run build`, puis `VITE_BASE=/dunboutalautre-site/ npm run preview` et `http://localhost:4173/dunboutalautre-site/`. Le `robots.txt` d'un site de projet GitHub Pages n'est pas lu par les moteurs (il n'est pas à la racine du domaine) : la balise `noindex` est la vraie protection. Le canonical et Open Graph pointent toujours vers `https://dunboutalautre.co`.

## Où est quoi
| Besoin | Fichier |
|---|---|
| Règles de travail, stack | `CLAUDE.md` |
| Design system, composants | `DESIGN.md` |
| Animations, accueil et Noël (V2, flux vertical et survols en V3) | `docs/ANIMATIONS.md` |
| Textes exacts | `docs/CONTENU-ACCUEIL.md`, `docs/CONTENU-NOEL.md`, `retours-v2/docs/` |
| Points à valider avec la cliente | `docs/POINTS-A-VALIDER.md` |
| Retours du fondateur (V2 et V3), références image | `retours-v2/`, `retours-v3/` (en cas de conflit, ces dossiers priment, sauf quand la frame les contredit : voir `docs/POINTS-A-VALIDER.md`, lignes 128 à 142) |
| Contenu éditable | `src/data/` : `site.js` (coordonnées, liens, services, chiffres), `realisations.js`, `noel.js` (univers, étapes, avis, FAQ, SEO), `logos.js` (logos clients), et `src/data/pages/<page>.js` : tous les textes d'une page secondaire (une valeur à fournir est un `todo("…")`, rendu `[À compléter]`) |
| Copywriting des pages secondaires | `docs/copywriting/` (premier jet, à retravailler avec la cliente), `docs/arborescence-et-strategie.md` (URL, title, meta, maillage) |
| Composants HTML (un fichier par bloc) | `src/components/`, injectés dans les pages par `vite-plugins/inject-components.js` avec `<!--@nom attr="valeur"-->` |
| Animations (un fichier par animation) | `src/scripts/`, initialisées dans l'ordre par `main.js` ; une seule instance de Lenis, branchée sur ScrollTrigger (`core.js`) |
| Styles (un fichier par composant) | `src/styles/`, importés par `main.css` ; couleurs et tailles dans `tokens.css`, aucune valeur hexadécimale en dur ailleurs |
| Images | sources dans `public/assets/`, variantes WebP dans `public/assets/optimized/` (`scripts/optimize-images.js`) |

## Pages secondaires
| Page | Fichier de données | URL |
|---|---|---|
| Végétalisation de bureaux | `bureaux.js` | `/vegetalisation-bureaux-paris/` |
| Design végétal sur mesure | `design-vegetal.js` | `/design-vegetal-sur-mesure-paris/` |
| Scénographie et événementiel | `scenographie.js` | `/scenographie-vegetale-evenementiel-paris/` |
| Terrasses | `terrasses.js` | `/amenagement-terrasse-paris/` |
| Décoration saisonnière | `saisonniere.js` | `/decoration-vegetale-saisonniere-paris/` |
| Entretien et abonnements | `entretien.js` | `/entretien-abonnement-plantes-entreprise-paris/` |
| Réalisations | `realisations.js` | `/realisations/` |
| Fiche projet (Floral Fashion Show) | `fiche-floral-fashion-show.js` | `/realisations/floral-fashion-show/` |
| Contact | `contact.js` | `/contact/` |
| Blog | `blog.js` | `/blog/` |
| Article modèle | `article-vegetaliser-bureaux.js` | `/blog/vegetaliser-bureaux-paris-guide/` |

Chaque page est une coquille (`<dossier>/index.html`) qui appelle `page-sections` : les sections viennent de son fichier de données et sont rendues par `src/components/sections/`. Ajouter une page : un fichier de données, une entrée dans `src/data/pages/index.js` et dans `vite.config.js`, une coquille HTML. Les décisions, écarts et contenus à fournir sont aux lignes 144 à 157 de `docs/POINTS-A-VALIDER.md`.

## Points d'attention
- Les liens vers les pages secondaires (menu, footer, CTA, maillage) sont fictifs (`#`) tant que `live` n'est pas `true` dans `src/data/site.js` : un clic dessus ne fait rien. On y accède par leur URL. Passer `live` à `true`, aligner les coordonnées et le compteur du menu (ligne 144 des points à valider) se fait en une seule fois, sur accord du fondateur.
- Les pages secondaires affichent `[À compléter]` partout où une valeur manque (téléphone, e-mail, adresse, logos, photos, citations, articles) : aucun texte n'est inventé.
- Le formulaire de contact valide les champs mais n'envoie rien (aucune requête réseau, aucun stockage) ; sa confirmation le dit (`SUBMIT_NOTICE`).
- Les 4 avis de la page Noël sont fictifs (`fictif: true` dans `src/data/noel.js`) : à remplacer avant toute mise en ligne.
- Avec `prefers-reduced-motion` (et sans JavaScript), il n'y a ni épinglage ni parallaxe : sections empilées, contenu visible, fondus courts.
- Sous 900 px, les animations de l'accueil sont simplifiées (`docs/ANIMATIONS.md` §12). La page Noël garde sa mise en scène, allégée : flux vertical à 3 photos (450 vh), et « Notre fonctionnement » en une colonne, sans épinglage ni titre sticky.
- Sans JavaScript, les 13 pages restent lisibles et complètes (FAQ dépliée, avis visibles) ; le bouton d'envoi du formulaire est désactivé.
- La vérification visuelle se fait avec Chrome piloté par le protocole de débogage ; les outils de non-régression (captures de référence, comparaison du HTML construit, audits) sont dans `.baseline/`, hors dépôt, et n'ajoutent aucune dépendance au projet (`tasks/plan.md` en décrit les portes).
