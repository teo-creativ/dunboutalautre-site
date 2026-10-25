# 07 : Chiffres clés et footer en révélation

```
Lis docs/ANIMATIONS.md §7 et §8, DESIGN.md §5.6 et §5.8, et regarde references/menu/services-rows-et-chiffres-cles.png.

Implémente (src/scripts/stats.js, footer-reveal.js) :

1. **Chiffres clés** : label `• CHIFFRES CLÉS`, titre « Nous transformons vos idées en expérience [inoubliable]. » à gauche, trois cartes blanches à droite (rayon 28 px, légère rotation individuelle, ombre douce). La section est épinglée (~200 vh). Au scroll, les cartes entrent une par une depuis le bas et s'empilent en se chevauchant (rotation qui s'ajuste pendant l'entrée). Les chiffres comptent de 0 à leur valeur (+70, +10 ans, 100%). Le titre apparaît par mots, le title tag se remplit.
2. **Footer en révélation (sous-position)** : la section des chiffres clés est AU-DESSUS du footer, qui apparaît en dessous quand on scrolle. Structure recommandée : `main { position: relative; z-index: 2; margin-bottom: var(--footer-h); background: var(--cream) }` et `footer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1 }`, avec `--footer-h` mesuré en JS et recalculé au resize. Parallaxe douce du contenu du footer (yPercent −20 → 0, opacité .6 → 1) et du wordmark géant. Le footer reste accessible au clavier et aux lecteurs d'écran.
3. Contenu du footer selon docs/CONTENU-ACCUEIL.md §6 : titre avec title tag, CTA, e-mail, téléphone, liens, Paris & Île-de-France, Instagram, copyright, wordmark géant en crème rogné en bas, fond olive.

Contraintes : le footer ne doit pas être visible avant la fin de la section chiffres ; pas de contenu masqué sous le footer fixe ; compatible Lenis ; la hauteur totale de la page doit rester correcte au resize.

Vérifie : captures à la fin du scroll, au milieu de la révélation et au tout début ; test à 1280, 1440, 1728 et 1920 px de large ; test à 390 px (le footer peut être statique si la révélation n'est pas fluide).
```
