# CLAUDE.md : D'un Bout À L'autre (DBAL), prototype d'intégration V1

Lis ce fichier en entier avant toute action, puis `DESIGN.md` et `docs/ANIMATIONS.md`.

## 1. Contexte

- **Client :** D'un Bout À L'autre, studio parisien de design végétal, scénographie végétale, décoration saisonnière et entretien de végétaux pour entreprises, hôtels, restaurants et particuliers (Paris et Île-de-France, plus de 10 ans d'expérience).
- **Mission :** refonte du site (ancien site Squarespace, futur site Webflow). Ce dépôt est un **prototype d'intégration codé à la main** (Vite + HTML/CSS/JS), pour montrer à la cliente la direction design **et** le niveau d'animation visé. Il ne remplace pas la future version Webflow, il sert de référence visuelle et d'animation.
- **Livrable de cette V1 :** deux pages, desktop d'abord, mobile propre.
  1. **Accueil** (`/`) : header, menu plein écran, hero, transition orange, section photos en scroll, section « Notre approche », services, chiffres clés, footer en révélation.
  2. **Landing Décors de Noël** (`/decoration-noel-entreprises-paris/`) : page de campagne, un seul objectif : obtenir une demande de devis Noël. Même design system, design à proposer (voir `prompts/08-landing-noel.md`).
- Les autres pages (services, réalisations, contact, blog) seront intégrées plus tard. **Les liens vers elles sont fictifs** pour l'instant (`href="#"` ou URLs finales non fonctionnelles, centralisées dans `src/data/site.js`).

## 2. Stack (ne pas en changer sans demander)

- **Vite** (multi-pages), **JavaScript ES modules** (pas de framework front), **CSS natif** (variables CSS, pas de Tailwind).
- **GSAP 3.13+** (gratuit, avec **ScrollTrigger** et **SplitText**) pour toutes les animations.
- **Lenis** pour le smooth scroll, branché sur ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` et `gsap.ticker`).
- Polices via Google Fonts : **Poppins** (300, 400, 500) et **Playfair Display** (italic 400, 500).
- Commandes : `npm install`, `npm run dev`, `npm run build`, `npm run preview`.

## 3. Où trouver quoi

| Besoin | Fichier |
|---|---|
| Design system (couleurs, typo, composants) | `DESIGN.md` |
| Spécification détaillée de chaque animation | `docs/ANIMATIONS.md` |
| Texte exact de l'accueil (aligné sur le design) | `docs/CONTENU-ACCUEIL.md` |
| Texte exact de la landing Noël | `docs/CONTENU-NOEL.md` |
| Copywriting complet, page par page | `docs/copywriting/` |
| Arborescence, URLs, titles, metas, maillage | `docs/arborescence-et-strategie.md` |
| Points ouverts à valider avec la cliente | `docs/POINTS-A-VALIDER.md` |
| Références visuelles (maquette, frames d'animation, menu) | `references/` |
| Assets (logo, fond, photos, logos clients) | `public/assets/` |
| Prompts d'intégration, à exécuter dans l'ordre | `prompts/` |

**Références visuelles prioritaires** (regarde les images, pas seulement les PDF) :
- `references/frames/home-animation-01.jpg` à `11.jpg` : hero, cercle orange, photos en scroll, photo plein écran, texte « Notre approche ».
- `references/frames/home-transition-1.jpg` à `3.jpg` : superposition de la section services.
- `references/frames/cta-hover-1.png` à `5.png` : animation du CTA au survol.
- `references/menu/*.png` : menu plein écran (états de survol) et services/chiffres clés.
- `references/old-mockup/` : **obsolète** (ancienne palette), uniquement pour l'inspiration de mise en page.
- Les PDF d'origine sont dans `references/animations-pdf/` (identiques aux frames).

## 4. Règles de travail

1. **Fidélité au design.** Les frames de `references/` font foi. Si une frame et un texte de ce dossier se contredisent, suis la frame pour le visuel et signale la contradiction dans `docs/POINTS-A-VALIDER.md`.
2. **Texte :** utilise **exactement** les textes de `docs/CONTENU-*.md`. N'invente aucun texte marketing. Si un texte manque, mets un placeholder visible `[À compléter]`. **N'utilise jamais de tiret long (« — »)** dans les textes du site : utilise « : », une virgule ou un point.
3. **Couleurs :** uniquement les tokens de `DESIGN.md` (variables CSS). Aucune valeur hexadécimale en dur dans les composants.
4. **Animations :** GSAP + ScrollTrigger uniquement, propriétés GPU (`transform`, `opacity`, `clip-path`). Pas d'animation de `width`, `height`, `top`, `left` en scroll. Toujours respecter `prefers-reduced-motion` (contenu visible, animations réduites à des fondus courts). Pas de `will-change` permanent : seulement pendant l'animation.
5. **Accessibilité :** HTML sémantique (`header`, `nav`, `main`, `section`, `footer`), un seul `h1` par page, contrastes AA, focus visibles, menu avec `aria-expanded`, `aria-controls`, focus piégé et fermeture avec Échap, `alt` descriptifs en français, états de survol doublés par `:focus-visible`.
6. **Performance :** images en `loading="lazy"` sauf le hero, dimensions explicites (pas de décalage de mise en page), conversion en WebP/AVIF dans `prompts/09-polish-perf-a11y.md`, une seule instance de Lenis, nettoyage des ScrollTrigger (`ctx.revert()`).
7. **Structure du code :** composants en JS vanilla dans `src/scripts/` (un fichier par animation ou composant), styles dans `src/styles/` (un fichier par composant, importés depuis `main.css`), contenu éditable dans `src/data/`. Pas de logique métier dans le HTML.
8. **Responsive :** desktop d'abord (1440 à 1920). Sous 900 px : menu en une colonne, pins raccourcis ou supprimés, animations simplifiées. Aucune barre de défilement horizontale à aucune largeur.
9. **Méthode :** avant chaque gros chantier, propose un plan court, puis implémente, puis **vérifie visuellement** (lance `npm run dev`, prends des captures avec Playwright si disponible, compare avec les frames de `references/`). Corrige avant de déclarer terminé.
10. **Git :** commits petits et clairs en français (`feat: menu plein écran`, `fix: ...`). Ne commit jamais `node_modules` ni `dist`.

## 5. Données de configuration (à ne pas coder en dur dans le HTML)

À centraliser dans `src/data/site.js` : nom du site, e-mail `hello@dunboutalautre.co`, téléphone (**deux versions existent, voir `docs/POINTS-A-VALIDER.md`**), Instagram `@dunboutalautre.co`, nombre de réalisations (valeur provisoire `32`, à terme dynamique depuis le CMS), liens de navigation (fictifs), liste des services, chiffres clés (`+70`, `+10 ans`, `100%`, valeurs de maquette à confirmer).

## 6. Définition de « terminé » pour la V1

- Accueil et landing Noël fonctionnent en `npm run dev` et `npm run build` sans erreur ni avertissement console.
- Chaque animation décrite dans `docs/ANIMATIONS.md` est implémentée, fluide (aucun saccade visible à 60 fps sur un portable standard) et réversible au scroll arrière.
- Comparaison frame par frame avec `references/` effectuée et écarts listés.
- Lighthouse desktop : Performance ≥ 85, Accessibilité ≥ 95, Bonnes pratiques ≥ 95.
- Un `README.md` à jour explique comment lancer, builder et déployer sur Netlify ou Vercel pour partager un lien à la cliente.
