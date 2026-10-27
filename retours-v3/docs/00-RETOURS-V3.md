# 00. Retours V3

Contexte : la V2 est intégrée. Ces retours sont ceux de la première relecture de l'intégration, avant de présenter une première version à la cliente.

## Tableau des retours

| # | Zone | Retour | Ce qu'on fait |
|---|------|--------|---------------|
| 1 | Page Noël, section "Notre fonctionnement" | Les étapes sont beaucoup trop serrées. La barre de progression plaît, on la garde. Le scroll paraît statique. | Étapes très espacées, qui apparaissent petit à petit comme si elles montaient du bas, pendant que les anciennes disparaissent de façon fluide. Plus de mouvement. Voir `02-FONCTIONNEMENT-TIMELINE.md`. |
| 2 | Page Noël, "Nos univers" | L'apparition des sous-titres au survol est saccadée. La structure convient. | On ne touche qu'à l'animation : une timeline GSAP par item, lecture et retour fluides. Voir `03-UNIVERS-HOVER-FLUIDE.md`. |
| 3 | Page Noël, du bloc "Notre volonté" jusqu'à "Nos univers" | Abandon complet du scroll horizontal. Passage à un scroll vertical, comme dans le PDF `Hero_merged_1.pdf`. | Nouveau flux vertical avec cercle orange progressif. Voir `01-NOEL-SCROLL-VERTICAL.md`. |

## Le PDF de référence

- 10 pages utiles, copiées dans `references/noel-vertical-frames/` (`noel-vertical-01.jpg` à `noel-vertical-10.jpg`).
- **La page 11 du PDF est ignorée** : c'est une section ajoutée par erreur. Elle n'est volontairement pas dans le dossier. Ne rien construire à partir d'elle.

## Ce qui ne change pas

Tout le reste. En particulier, ne pas toucher à :

- l'accueil entier (cercle orange, Réalisations, Services, etc.) ;
- le footer V2 et son animation de révélation ;
- l'animation du CTA et la section CTA finale orange de la page Noël (sans lien téléphone) ;
- l'overlap des Services ;
- les témoignages et la FAQ de la page Noël ;
- le contenu texte de "Notre fonctionnement" et de "Nos univers" (seule l'animation change) ;
- les avis fictifs, toujours marqués `fictif: true`, à remplacer avant toute mise en ligne publique.

## Règles d'écriture

- Français simple.
- Pas de tiret long (" — ") dans les textes ni dans les fichiers.
- Rien de technique en dehors de ce qui est demandé : même stack, mêmes conventions de dossiers, mêmes tokens CSS (`--olive`, `--orange`, `--cream`, etc.).
