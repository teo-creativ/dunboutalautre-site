# 03. "Nos univers" : un survol fluide

Référence de l'état actuel : `references/etat-actuel-v2/02-univers-etat-actif-noel-chic.png`.

## 1. Le problème

Au survol d'un univers, l'apparition du sous-titre (le petit texte sous le nom) est **saccadée**. Téo veut garder tout ce qui est de la structure et ne reprendre que l'animation d'apparition des textes.

## 2. Ce qu'on garde

- La structure, la mise en page, les contenus, les typos, les couleurs.
- La logique : un univers actif à la fois, la carte photo de gauche change avec l'univers actif.
- L'état par défaut ("Noël immersif" actif au chargement).

## 3. Causes probables d'un survol saccadé

À vérifier dans le code existant avant de modifier :

- `height` ou `max-height` animés en CSS (provoque des recalculs de mise en page à chaque image).
- `display: none` vers `block` qui coupe la transition.
- Plusieurs `transition` CSS différentes qui ne partent pas en même temps (texte, titre, opacité), ou `transition: all`.
- Des animations qui se contredisent quand la souris passe vite d'un item à l'autre.
- Un SplitText relancé à chaque survol.
- Les polices pas encore chargées au moment du découpage du texte.

## 4. Nouvelle animation

### Principe : une timeline GSAP par item

Au chargement (après `document.fonts.ready`), pour chaque univers on construit **une timeline en pause** qui décrit l'ouverture. Au survol on la joue, à la sortie on la rejoue à l'envers. GSAP gère les interruptions proprement : si la souris change d'item en pleine animation, la timeline repart de là où elle en est, sans saut.

Séquence d'ouverture d'un item (durée totale environ 0,9 s) :

| Temps | Élément | Mouvement | Durée | Ease |
|-------|---------|-----------|-------|------|
| 0 | Conteneur du sous-titre | hauteur de `0` à `auto` (via GSAP, `height: 'auto'`) | 0,6 s | `power3.inOut` |
| 0 | Nom de l'univers | légère mise en avant (couleur ou translation de 8px, selon le design actuel) | 0,5 s | `power2.out` |
| 0,10 | Sous-titre, ligne par ligne | `yPercent` de 100 à 0, dans un masque (`overflow: hidden` sur chaque ligne) | 0,8 s | `expo.out`, `stagger: 0.06` |
| 0,15 | Sous-titre, opacité | de 0 à 1 | 0,5 s | `power1.out` |
| 0 | Carte photo | changement d'image (fondu croisé, voir §5) | 0,6 s | `power2.inOut` |

### Principes de fluidité

- **Aucune animation de hauteur en CSS.** La hauteur est animée par GSAP, ou mieux, la zone du sous-titre est réservée à l'avance si le design le permet pour éviter tout décalage de mise en page.
- **Pas de `display: none`.** Utiliser `autoAlpha` (opacité + `visibility`).
- **Sortie plus rapide que l'entrée** : `timeline.timeScale(1.5)` à la fermeture (environ 0,6 s) pour que le menu paraisse réactif.
- **Anti-flicker** : une toute petite intention de survol de 60 ms (`gsap.delayedCall(0.06, open)`, annulée à la sortie) évite d'ouvrir et fermer quand la souris traverse la liste en diagonale.
- **`overwrite: "auto"`** sur les tweens, et `timeline.invalidate()` après un redimensionnement.
- **Un seul item actif à la fois** : en ouvrant un item, on ferme les autres via leur timeline (`reverse()`), jamais en forçant des styles.
- **Une seule découpe de texte** (SplitText en lignes) faite au chargement, refaite seulement au redimensionnement (`autoSplit` ou `revert()` puis nouvelle découpe), jamais au survol.
- `will-change: transform, opacity` uniquement sur les lignes du sous-titre.

## 5. Changement de photo (carte de gauche)

- Superposer les images dans la carte, une par univers, `position: absolute; inset: 0`.
- Entrée de la nouvelle image : `opacity` 0 vers 1 (0,6 s) et `scale` 1,06 vers 1 (0,9 s, `power3.out`). Sortie de l'ancienne : `opacity` vers 0 en même temps. Pas de flash blanc entre les deux.
- Pas de changement de `src` : toutes les images sont déjà dans le DOM.

## 6. Accessibilité et appareils sans souris

- Mêmes timelines sur `focus-visible` et `blur` pour le clavier.
- Sur écran tactile (`(hover: none)`), le premier appui ouvre l'item, un appui sur un autre item le remplace. Même timeline, pas de survol.
- `prefers-reduced-motion` : l'ouverture se fait en simple fondu de 0,2 s, sans mouvement des lignes.

## 7. Critères de réussite

- En passant la souris lentement puis vite sur les items, aucune saccade, aucun saut de mise en page, aucune ligne qui reste coincée à moitié.
- Les textes se révèlent comme une marée qui monte, avec une légère cascade, jamais d'un bloc.
- Pas de point de ressaut visible quand on enchaîne deux items.
