# 01. Page Noël : scroll vertical

Copier-coller le texte ci-dessous dans Claude Code (après le lancement).

---

Chantier principal de la V3 : sur la page Noël, remplace complètement le scroll horizontal par un scroll vertical, du bas vers le haut, en suivant `retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md` et les images `retours-v3/references/noel-vertical-frames/noel-vertical-01.jpg` à `10.jpg`.

Relis d'abord le doc en entier, puis regarde les 10 images dans l'ordre. Lis ensuite le code actuel de la page Noël (HTML, CSS, JS) pour repérer ce qui concerne Notre volonté, le flux horizontal et l'arrivée de "Nos univers".

À faire :

1. Supprime tout le mécanisme horizontal : conteneur à défilement horizontal, pin horizontal, `x` et `xPercent` animés, calcul de largeur, arrivée de "Nos univers" par la droite, photo qui rétrécit vers la gauche. Ne laisse aucun code ni CSS mort.
2. Construis la zone "flux" vertical : une section haute (600vh sur desktop, 450vh sur mobile) avec une scène `position: sticky` de 100vh. Une seule timeline GSAP scrubée pilote tout.
3. Enchaînement, dans cet ordre :
   - Notre volonté (texte sur photo), inchangé, avec ses tags V2.
   - Un cercle orange apparaît progressivement au scroll, centré horizontalement, vers 42 % de la hauteur, grossit en `transform: scale()` et recouvre la photo. Même technique et même ressenti que le cercle de l'accueil (regarde comment il est fait dans le code et réutilise l'approche).
   - La section orange est pleine : titre "Apportons la magie de Noël que méritent vos décors." (le groupe "la magie de Noël" garde son traitement actuel en pastille italique) et CTA "Discutons de votre projet" (même bouton, même animation, pas de lien téléphone). Titre et CTA restent fixes au centre.
   - Les 5 photos de `assets/images/noel-v2/` entrent par le bas et montent vers le haut à des vitesses différentes (voir le tableau du doc), derrière le titre, et sortent par le haut. Elles gardent leur traitement actuel.
   - Le titre s'efface, et "Nos univers" (fond crème) monte depuis le bas par-dessus l'orange, grâce à une marge négative de `-100vh` sur la section suivante et un `z-index` supérieur. Sa structure et son contenu restent exactement les mêmes.
4. Header : garde le dégradé de lisibilité (`data-header-gradient`) cohérent avec le fond visible dans chaque phase (crème, olive ou orange). Aucune photo ne doit gêner le logo.
5. Mobile (moins de 900px) : 3 photos, plus petites, même logique. `prefers-reduced-motion` : rendu statique empilé sans cercle animé ni parallaxe.
6. Performance : seulement `transform`, `opacity` et `clip-path`. `invalidateOnRefresh: true`. Images avec dimensions explicites.
7. Lenis reste branché sur ScrollTrigger comme ailleurs. Pense à `ScrollTrigger.refresh()` après le chargement des images si nécessaire.

Ne touche pas aux sections situées après "Nos univers" (Fonctionnement, témoignages, FAQ, CTA final, footer) : elles viennent dans les prompts suivants ou restent inchangées.

Vérification : lance le site, et avec Playwright prends des captures à 1728x1030 en scrollant à ces moments : Notre volonté lue, cercle à 20 %, cercle à 80 %, orange complet avec photos entrantes, photos au milieu de leur montée, photos qui sortent, arrivée de Nos univers à mi-chemin, Nos univers en place. Compare avec les 10 images de référence. Corrige ce qui diffère nettement (placement des photos, taille du cercle, timing). Termine par la liste des fichiers modifiés et une phrase sur ce que tu as supprimé.
