# 08 : Landing « Décors de Noël »

```
Lis docs/CONTENU-NOEL.md et docs/copywriting/07-landing-noel.md, DESIGN.md et docs/ANIMATIONS.md. Regarde aussi les photos public/assets/images/photos/noel-*.jpg.

Crée la page `decoration-noel-entreprises-paris/index.html` (URL finale `/decoration-noel-entreprises-paris/`). Cette page n'a pas encore de maquette : propose un design cohérent avec l'accueil (même design system, mêmes title tags, mêmes CTA, même header/menu/footer en révélation), puis implémente-le. Page de campagne : un seul objectif, obtenir une demande de devis Noël.

Sections et textes : suivre exactement docs/CONTENU-NOEL.md (hero avec CTA unique et téléphone, bandeau de confiance en défilement, promesse, 5 univers de Noël en cartes, 5 étapes en timeline, références, galerie, FAQ en accordéon, CTA final, footer). Textes exacts, pas d'invention. Placeholders `[À compléter]` pour ce qui manque (photos Noël naturel, corporate, responsable ; témoignage ; logo Eataly).

Animations (réutilise les composants existants) :
- Hero : intro comme l'accueil (mots depuis un masque, title tag « Noël »), fond photo avec voile olive ou fond olive + feuilles.
- Titres : même révélation par mots que l'accueil, déclenchée à l'entrée dans le viewport.
- Cartes des 5 univers : apparition en cascade, léger survol (zoom de l'image 1.05, soulignement orange du titre).
- Timeline : ligne qui se dessine au scroll, étapes qui apparaissent une à une.
- Frise de logos : défilement continu lent en niveaux de gris, pause au survol.
- FAQ : accordéon accessible (button, aria-expanded, aria-controls), animation d'ouverture fluide (GSAP, hauteur auto gérée proprement), JSON-LD `FAQPage`.
- CTA : composant CTA avec la variante adaptée au fond. CTA persistant « Demander un devis Noël » visible en haut à droite et en fin de page.
- Footer en révélation identique à l'accueil.

SEO : title et meta description de docs/CONTENU-NOEL.md, un seul h1, hiérarchie h2/h3 propre, `alt` en français, balises Open Graph de base, `canonical` vers l'URL finale.

Vérifie : captures desktop et mobile, comparaison de cohérence avec l'accueil, test clavier de la FAQ, Lighthouse. Liste les choix de design que tu as faits pour que le fondateur puisse les valider.
```
