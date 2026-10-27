# D'un Bout À L'autre : prototype d'intégration V3

Accueil (`/`) et landing Décors de Noël (`/decoration-noel-entreprises-paris/`). Prototype codé à la main pour montrer la direction design et le niveau d'animation visé ; il ne remplace pas la future version Webflow.

Stack : Vite (multi-pages), JavaScript ES vanilla, CSS natif, GSAP (ScrollTrigger, SplitText), Lenis. Aucun framework.

## Démarrer
1. `npm install`
2. `npm run dev` (http://localhost:5173). La commande génère d'abord les images WebP responsives (`npm run images`).
3. `npm run build` produit `dist/` sans avertissement, `npm run preview` le sert (http://localhost:4173).

Les captures et les tests d'animation se font sur la build : `npm run build` puis `npm run preview`.

## Déployer pour partager un lien
Netlify ou Vercel : commande de build `npm run build`, dossier de publication `dist`. Aucune variable d'environnement. Le domaine `https://dunboutalautre.co` utilisé pour le canonical et Open Graph de la landing est supposé (`src/data/noel.js`).

## Où est quoi
| Besoin | Fichier |
|---|---|
| Règles de travail, stack | `CLAUDE.md` |
| Design system, composants | `DESIGN.md` |
| Animations, accueil et Noël (V2, flux vertical et survols en V3) | `docs/ANIMATIONS.md` |
| Textes exacts | `docs/CONTENU-ACCUEIL.md`, `docs/CONTENU-NOEL.md`, `retours-v2/docs/` |
| Points à valider avec la cliente | `docs/POINTS-A-VALIDER.md` |
| Retours du fondateur (V2 et V3), références image | `retours-v2/`, `retours-v3/` (en cas de conflit, ces dossiers priment, sauf quand la frame les contredit : voir `docs/POINTS-A-VALIDER.md`, lignes 128 à 142) |
| Contenu éditable | `src/data/` : `site.js` (coordonnées, liens, services, chiffres), `realisations.js`, `noel.js` (univers, étapes, avis, FAQ, SEO) |
| Composants HTML (un fichier par bloc) | `src/components/`, injectés dans les pages par `vite-plugins/inject-components.js` avec `<!--@nom attr="valeur"-->` |
| Animations (un fichier par animation) | `src/scripts/`, initialisées dans l'ordre par `main.js` ; une seule instance de Lenis, branchée sur ScrollTrigger (`core.js`) |
| Styles (un fichier par composant) | `src/styles/`, importés par `main.css` ; couleurs et tailles dans `tokens.css`, aucune valeur hexadécimale en dur ailleurs |
| Images | sources dans `public/assets/`, variantes WebP dans `public/assets/optimized/` (`scripts/optimize-images.js`) |

## Points d'attention
- Les liens vers les autres pages (services, réalisations, contact) sont fictifs (`#`) et centralisés dans `src/data/site.js` ; un clic dessus ne fait rien.
- Les 4 avis de la page Noël sont fictifs (`fictif: true` dans `src/data/noel.js`) : à remplacer avant toute mise en ligne.
- Avec `prefers-reduced-motion` (et sans JavaScript), il n'y a ni épinglage ni parallaxe : sections empilées, contenu visible, fondus courts.
- Sous 900 px, les animations de l'accueil sont simplifiées (`docs/ANIMATIONS.md` §12). La page Noël garde sa mise en scène, allégée : flux vertical à 3 photos (450 vh) et « Notre fonctionnement » à 80 vh par étape.
- Sans JavaScript, les deux pages restent lisibles et complètes (FAQ dépliée, avis visibles).
- La vérification visuelle se fait avec Chrome piloté par le protocole de débogage (pas de Playwright, aucune dépendance ajoutée).
