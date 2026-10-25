# 03 : Composant CTA et animation au survol

```
Lis docs/ANIMATIONS.md §10 et DESIGN.md §5.2, puis regarde references/frames/cta-hover-1.png à cta-hover-5.png.

Construis le composant CTA réutilisable (src/components/cta.js + src/styles/cta.css + src/scripts/cta.js).

Comportement attendu :
- Repos : pilule blanche, point orange à gauche, texte orange (variante on-olive). Hauteur ≈ 50 px, texte 18 à 20 px.
- Survol (et focus clavier) : le point à gauche grossit en cercle jusqu'à remplir toute la pilule. Le fond devient orange, le texte devient blanc, puis le texte réapparaît avec une petite animation (montée depuis un masque, légère opacité, stagger par caractère). Sortie : le cercle se rétracte vers le point, le texte reprend sa couleur avec la même animation, plus discrète.
- Implémentation recommandée : deux couches. Une couche de base (fond blanc, texte orange) et une couche de remplissage (fond orange, texte blanc, même contenu) révélée par `clip-path: circle(r at Xpx 50%)` dont X est la position du centre du point. Animer r de 6 px à la valeur qui couvre toute la pilule, via GSAP, 0,6 s, power3.inOut. Le texte doit rester parfaitement aligné entre les deux couches (pas de saut). Aucune animation de width ou height.
- Variantes via `data-variant` : on-olive (blanc vers orange), on-orange (blanc vers olive avec texte crème), on-cream (olive avec texte crème vers orange avec texte blanc). Tout passe par des variables CSS (--cta-bg, --cta-fg, --cta-fill-bg, --cta-fill-fg).
- Un seul script gère tous les `.cta` de la page, via délégation, et gère les interruptions (survol rapide entrant/sortant) sans saccade : `overwrite: "auto"` et `timeline.reversed()` ou `tween.reverse()` selon ce qui est le plus propre.
- Le bouton « Menu » du header utilise le même composant.
- Accessibilité : vrai lien `<a>` ou `<button>`, nom accessible = le texte, la couche de remplissage est `aria-hidden`, focus visible.
- Mouvement réduit : simple transition de couleur de 150 ms.

Applique le composant à tous les CTA de l'accueil. Page de test : ajoute temporairement (puis retire) `/cta-test.html` avec les trois variantes sur trois fonds. Vérifie à la main (survol rapide, survol lent, focus clavier) et compare avec les frames.
```
