# 02. Notre fonctionnement : timeline qui respire

Copier-coller le texte ci-dessous dans Claude Code.

---

Reprends la section "Notre fonctionnement" de la page Noël (titre "Du premier échange au démontage.") en suivant `retours-v3/docs/02-FONCTIONNEMENT-TIMELINE.md`. La capture de l'état actuel est `retours-v3/references/etat-actuel-v2/08-fonctionnement-etapes-trop-serrees.png`.

Le retour : les étapes sont beaucoup trop serrées, et le scroll est statique. La barre de progression plaît, il faut la garder.

À faire :

1. Garde la barre de progression et son animation, le titre, les textes et le style actuels. Ne change aucun texte.
2. Transforme la section en scène épinglée (`pin: true`) avec une seule timeline scrubée (`scrub: 0.6`, `anticipatePin: 1`, `invalidateOnRefresh: true`). Durée de scroll : 100vh par étape sur desktop, 80vh sur mobile.
3. Une étape à la fois au centre de l'attention. Chaque étape :
   - attend en bas (`y: +60vh`, invisible),
   - monte en douceur et s'installe (`power2.out`, environ 0,45 s dans la timeline),
   - puis continue vers le haut (`y: -35vh`) et s'efface (`power2.in`), l'étape précédente restant brièvement visible à environ 0,25 pour garder le fil.
   On doit avoir l'impression que les étapes montent du bas vers le haut, la nouvelle chassant l'ancienne. Jamais plus de deux étapes visibles en même temps.
4. Dans chaque étape, le numéro entre en premier, puis le titre, puis le texte, avec 0,06 s d'écart.
5. La barre de progression avance en synchronisation avec les étapes. Ses repères s'allument quand l'étape correspondante devient active et restent allumés.
6. Uniquement `transform` et `opacity` (utilise `autoAlpha` pour que les étapes invisibles ne soient pas cliquables). Pas de `top` ni de `height` animés.
7. Mobile : une étape à la fois, 80vh par étape. `prefers-reduced-motion` : liste classique, espacée d'au moins 96px, barre pleine.

Si la barre de progression actuelle est déjà pilotée par un ScrollTrigger séparé, ne la réécris pas : cale seulement son début et sa fin sur la nouvelle durée de la section.

Vérification : avec Playwright à 1728x1030, capture la section à chaque début d'étape, à mi-transition entre deux étapes, et à la fin. Vérifie qu'on ne voit jamais plus de deux étapes à la fois, que la barre est synchronisée, et qu'aucun texte n'est coupé. Donne la liste des fichiers modifiés.
