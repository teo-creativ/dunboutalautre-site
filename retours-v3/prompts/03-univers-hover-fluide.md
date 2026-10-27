# 03. Nos univers : survol fluide

Copier-coller le texte ci-dessous dans Claude Code.

---

Reprends uniquement l'animation de survol de la section "Nos univers" de la page Noël, en suivant `retours-v3/docs/03-UNIVERS-HOVER-FLUIDE.md`. La structure, la mise en page et les contenus ne changent pas (capture de référence : `retours-v3/references/etat-actuel-v2/02-univers-etat-actif-noel-chic.png`).

Le retour : l'apparition des sous-titres au survol est saccadée.

D'abord, lis le code actuel du survol et dis-moi en deux lignes la cause probable de la saccade (hauteur animée en CSS, display none, transitions désynchronisées, SplitText relancé au survol, etc.).

Ensuite, reconstruis l'animation :

1. Une timeline GSAP en pause par univers, créée au chargement après `document.fonts.ready`. Survol : `play()`. Sortie : `reverse()` (avec `timeScale(1.5)` pour une fermeture plus vive). GSAP gère les interruptions sans saut.
2. Séquence d'ouverture d'environ 0,9 s : hauteur du bloc de sous-titre de 0 à `auto` par GSAP (`power3.inOut`, 0,6 s), lignes du sous-titre en masque avec `yPercent` de 100 à 0 (`expo.out`, 0,8 s, `stagger: 0.06`), opacité de 0 à 1 (0,5 s), le tout en parallèle de la mise en avant du nom de l'univers.
3. Plus aucune animation de `height` ni `max-height` en CSS, pas de `display: none` (utilise `autoAlpha`), pas de `transition: all`.
4. Texte découpé en lignes une seule fois au chargement par SplitText (jamais au survol), puis re-découpé au redimensionnement (`revert()` puis nouvelle découpe, ou `autoSplit`).
5. Anti-flicker : intention de survol de 60 ms (`gsap.delayedCall`), annulée à la sortie. En ouvrant un univers, ferme les autres avec leur timeline.
6. Carte photo de gauche : toutes les images déjà dans le DOM, superposées, fondu croisé de 0,6 s avec `scale` de 1,06 à 1. Aucun changement de `src`, aucun flash.
7. Clavier : mêmes timelines sur `focus-visible` et `blur`. Tactile (`(hover: none)`) : un appui ouvre l'item, un appui ailleurs le remplace. `prefers-reduced-motion` : simple fondu de 0,2 s.
8. `will-change` seulement sur les lignes du sous-titre.

Vérification : avec Playwright, simule un survol lent puis rapide d'un item à l'autre, et enregistre une capture à 0 %, 30 %, 60 % et 100 % de l'ouverture. Vérifie qu'il n'y a aucun saut de mise en page ni ligne coincée. Donne la liste des fichiers modifiés.
