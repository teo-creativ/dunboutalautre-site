# Retours V3 : D'un Bout À L'autre (DBAL)

Dossier à déposer **à la racine du projet VS Code**, à côté de `CLAUDE.md` (comme pour `retours-v2`).

La stack ne change pas : **Vite (multi-page) + JS vanilla en modules ES + CSS natif + GSAP (ScrollTrigger, SplitText) + Lenis**. Ces retours ne touchent que le design et les animations des sections.

## Ce que contient le dossier

```
retours-v3/
  README.md                          ce fichier
  docs/
    00-RETOURS-V3.md                 tableau des retours et ce qui ne bouge pas
    01-NOEL-SCROLL-VERTICAL.md       le gros chantier : scroll horizontal remplacé par un scroll vertical
    02-FONCTIONNEMENT-TIMELINE.md    "Notre fonctionnement" : étapes espacées, qui montent du bas
    03-UNIVERS-HOVER-FLUIDE.md       "Nos univers" : apparition des sous-titres fluide au survol
    04-POINTS-A-VALIDER-V3.md        valeurs à ajuster à l'oeil avec la cliente
  prompts/
    README.md                        ordre d'envoi
    00-LANCEMENT-V3.md               lecture du contexte (à envoyer en premier)
    01-noel-scroll-vertical.md
    02-fonctionnement-timeline.md
    03-univers-hover-fluide.md
    04-revue-v3.md                   vérification finale avec captures
  references/
    noel-vertical-frames/            les 10 pages utiles du PDF Hero (page 11 volontairement exclue)
    etat-actuel-v2/                  tes 8 captures de la V2 intégrée (ce qui existe aujourd'hui)
```

Aucun nouvel asset n'est nécessaire : les photos de `assets/images/noel-v2/` ajoutées en V2 sont réutilisées.

## Comment l'utiliser

1. Dézipper et déposer le dossier `retours-v3/` à la racine du projet.
2. Ouvrir Claude Code dans le projet.
3. Envoyer les prompts de `prompts/` **dans l'ordre**, un par un (voir `prompts/README.md`). Chaque prompt dit de lire les docs correspondants avant de coder.
4. Après chaque prompt, regarder le rendu dans le navigateur, puis passer au suivant.

## Les 3 changements en une phrase

1. **Page Noël** : on abandonne le scroll horizontal. Tout se passe en vertical, du bas vers le haut : Notre volonté, un cercle orange qui grandit au scroll (écho de l'accueil), la section orange avec le titre et le CTA, les photos qui montent, puis Nos univers qui arrive par le bas par-dessus l'orange.
2. **Notre fonctionnement** : on garde la barre de progression, mais les étapes sont beaucoup plus espacées et arrivent progressivement du bas, pendant que les précédentes s'effacent en douceur.
3. **Nos univers** : même structure, mais l'apparition des sous-titres au survol devient fluide.

Tout le reste du site reste tel quel (footer, CTA, Services, accueil, etc.).
