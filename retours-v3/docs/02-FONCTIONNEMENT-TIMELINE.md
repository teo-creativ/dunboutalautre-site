# 02. "Notre fonctionnement" : une timeline qui respire

Référence de l'état actuel : `references/etat-actuel-v2/08-fonctionnement-etapes-trop-serrees.png` (titre "Du premier échange au démontage.").

## 1. Le problème

- Les étapes sont beaucoup trop collées les unes aux autres.
- Le scroll donne une impression statique : les étapes sont déjà toutes là, la page se contente de défiler.

## 2. Ce qu'on garde

- **La barre de progression et son animation** : Téo l'adore, on n'y touche pas dans son principe (remplissage au scroll, point actif).
- Le titre "Du premier échange au démontage." et tous les textes des étapes, mot pour mot.
- Les couleurs, les typos, les tokens.

## 3. Ce qu'on change

### Un seul focus à la fois

Au lieu d'une liste d'étapes visibles ensemble, la section devient une **scène épinglée** (sticky). Une étape est au centre de l'attention, les autres sont soit pas encore arrivées, soit déjà parties.

### Le mouvement de chaque étape

Chaque étape traverse trois états au fil du scroll :

| État | Position | Opacité | Description |
|------|----------|---------|-------------|
| **À venir** | en bas, `y: +60vh` | 0 | L'étape attend hors champ. |
| **Active** | à sa place (position d'étape active, voir §4) | 1 | Elle monte depuis le bas en douceur et s'installe. |
| **Passée** | en haut, `y: -35vh` | 0 | Elle continue de monter et s'efface. Pendant la sortie, l'étape précédente reste brièvement visible à environ 0,25 pour que l'oeil comprenne le fil. |

Résultat : on a l'impression que les étapes **montent du bas vers le haut**, la nouvelle chassant l'ancienne vers le haut. Chaque étape vit, rien n'est figé.

### Espacement

- Chaque étape dispose de **environ 100vh de scroll** pour elle seule (valeur de départ, voir `04-POINTS-A-VALIDER-V3.md`).
- La hauteur totale de la section est donc `nombre d'étapes x 100vh` plus une marge d'entrée et de sortie de 50vh chacune.
- Dans l'écran, il n'y a jamais plus de deux étapes visibles en même temps (l'active et la précédente en train de s'effacer, ou l'active et la suivante qui arrive).

### La barre de progression

- Elle reste liée à la progression globale de la section (même animation qu'aujourd'hui).
- Les repères ou points de la barre s'allument quand l'étape correspondante devient active, et restent allumés ensuite.
- La barre doit visiblement avancer **en même temps** que les étapes montent : la barre et le contenu ne doivent jamais sembler désynchronisés.
- Garder sa position actuelle dans la mise en page.

## 4. Mise en page de la scène

- La scène occupe tout l'écran (100vh) pendant que la section est épinglée.
- Le titre "Du premier échange au démontage." reste visible en haut (ou à sa place actuelle) pendant toute la durée.
- La zone d'étape active est dans la partie centrale de l'écran, alignée sur la grille actuelle (même colonne que dans la capture V2). Les étapes sont superposées dans cette même zone : elles ne se placent pas côte à côte.
- Le numéro de l'étape, son titre et son texte entrent ensemble, avec un très léger décalage (le numéro d'abord, puis le titre, puis le texte, 0,06 s d'écart entre chacun).

## 5. Mécanisme conseillé

Une seule timeline scrubée, déclencheur sur la section, `start: "top top"`, `end: "+=" + (nbEtapes * innerHeight)`, `pin: true`, `scrub: 0.6` (le léger lissage de scrub donne la fluidité), `anticipatePin: 1`, `invalidateOnRefresh: true`.

Esquisse (à adapter au code existant) :

```js
const steps = gsap.utils.toArray('[data-step]');
const tl = gsap.timeline({
  scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + steps.length * innerHeight, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true }
});

gsap.set(steps, { autoAlpha: 0, yPercent: 0, y: () => innerHeight * 0.6 });

steps.forEach((step, i) => {
  const t = i; // une unité de timeline par étape
  tl.to(step, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, t)
    .to(step, { autoAlpha: 0, y: () => -innerHeight * 0.35, duration: 0.45, ease: 'power2.in' }, t + 0.7);
});
// barre de progression : même timeline, de 0 à 1 sur toute la durée
tl.to(progressFill, { scaleY: 1, ease: 'none', duration: steps.length }, 0);
```

Points d'attention :

- Si la barre de progression actuelle est déjà pilotée par un autre ScrollTrigger, la laisser tel quel et seulement caler son `start` et `end` sur la nouvelle durée de la section.
- Uniquement `transform` et `opacity`. Pas de `top`, pas de `height` animés.
- `autoAlpha` pour que les étapes invisibles ne soient pas cliquables ni lues par les lecteurs d'écran.
- Pas de `ease: "none"` sur les étapes elles-mêmes (sinon le mouvement est mécanique). `none` seulement pour la barre.

## 6. Mobile (moins de 900px)

- Même principe, une étape à la fois.
- 80vh de scroll par étape.
- La barre de progression passe en horizontale en haut si c'est déjà le cas dans la V2, sinon elle reste verticale à gauche, plus fine.

## 7. Mouvement réduit

- Pas d'épinglage ni de montée.
- Les étapes s'affichent en liste classique, espacées généreusement (au moins 96px entre chaque), la barre de progression est affichée pleine.
