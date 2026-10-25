# 02 : Design system (tokens, typographie, composants statiques)

```
Lis DESIGN.md en entier, puis implémente le design system statique (sans animation pour l'instant).

À faire :
1. src/styles/tokens.css : toutes les variables de couleur, d'espacement, de rayon et de typographie de DESIGN.md. Typographie fluide avec clamp(), calibrée sur un canvas de 1728 px (ex. H1 ≈ 80 px à 1728, minimum raisonnable à 390 px). Respecte les valeurs exactes : olive #5E530E, orange #FC4C00, crème #FEF1E0, blanc, olive-deep #4C430B, sand #C9BDA0, olive-line #766C2F, grey-line #D2D2D2.
2. src/styles/base.css : reset minimal, `html { scroll-behavior: auto }` (Lenis gère), styles Lenis recommandés, focus visible accessible (anneau orange), `prefers-reduced-motion`, images responsives.
3. Composant **title tag** (`<span class="tag tag--cream">` et `tag--orange`) : pilule inclinée ±2°, Playfair Display Italic, selon DESIGN.md §5.1. Doit s'insérer proprement au milieu d'un titre sur plusieurs lignes (inline-block, hauteur de ligne maîtrisée, pas de décalage de la ligne).
4. Fond du hero : applique public/assets/brand/bg-hero-leaves.svg (4 feuilles aux 4 coins) en fond d'un conteneur pleine hauteur d'écran, en `object-fit: cover` ou `background-size: cover`.
5. Construis le **HTML statique complet de l'accueil** (sans JS d'animation) avec le contenu exact de docs/CONTENU-ACCUEIL.md : header, hero, section orange (titre + CTA), section « Notre approche » sur la photo `bw-lavande-tour-eiffel-large.png`, services (6 lignes), chiffres clés (3 cartes, rotations CSS fixes), footer avec wordmark géant. Les sections doivent déjà ressembler aux frames dans leur état final.
6. Page `src/styles/` : un fichier CSS par composant (header, hero, tag, cta, experience, services, stats, footer).

Vérifie visuellement : lance le dev server, prends des captures desktop 1728x1030 de chaque section (Playwright si disponible) et compare avec references/frames/home-animation-01.jpg (hero), 04.jpg (section orange), 11.jpg (approche) et references/menu/services-rows-et-chiffres-cles.png. Corrige les écarts de tailles, d'espacements, de couleurs et de typographie. Liste les écarts restants.
```
