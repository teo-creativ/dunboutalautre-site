# 04. Points à valider (V3)

Les valeurs ci-dessous sont des points de départ. Elles sont écrites pour pouvoir être ajustées à l'oeil, avec Téo puis avec la cliente.

## Page Noël, scroll vertical

| Sujet | Valeur de départ | À regarder |
|-------|------------------|------------|
| Longueur totale du flux (desktop) | 600vh | Trop long ou trop court ? Descendre à 500vh si ça traîne. |
| Longueur du flux (mobile) | 450vh | Même question. |
| Origine du cercle | centre horizontal, 42 % de hauteur | Doit rappeler le cercle de l'accueil. |
| Vitesse d'apparition du cercle | de 10 % à 32 % de la progression | Assez progressif pour qu'on le voit grandir, sans attendre. |
| Nombre de photos | 5 (3 sur mobile) | Équilibre entre richesse et lisibilité du titre. |
| Vitesses des photos | de 130vh à 220vh | Écart assez marqué pour la profondeur, sans effet brouillon. |
| Arrondi en haut de "Nos univers" | 32px | À garder si l'effet de plan qui recouvre plaît. |
| Fondu du titre à l'arrivée de "Nos univers" | opacité vers 0 de "top bottom" à "top 30 %" | Le titre ne doit pas rester visible sous la section crème. |

## Notre fonctionnement

| Sujet | Valeur de départ | À regarder |
|-------|------------------|------------|
| Scroll par étape | 100vh (desktop), 80vh (mobile) | L'espacement doit donner le temps de lire sans ennui. |
| Entrée d'une étape | de +60vh à 0, 0,45 s, `power2.out` | Impression de montée du bas vers le haut. |
| Sortie d'une étape | vers -35vh, opacité à 0 | La disparition doit être fluide et visible, jamais brutale. |
| Opacité de l'étape précédente | 0,25 en fin de sortie | Garde le fil sans encombrer. |
| Lissage du scrub | 0,6 | Plus haut = plus doux mais plus de retard. |

## Nos univers, survol

| Sujet | Valeur de départ | À regarder |
|-------|------------------|------------|
| Durée d'ouverture | environ 0,9 s | Fluide sans paraître lent. |
| Vitesse de fermeture | x 1,5 | Réactif quand on change d'item. |
| Délai anti-flicker | 60 ms | Ne doit pas se sentir comme un retard. |
| Cascade des lignes | 0,06 s | Assez visible pour être élégante. |

## Questions restantes pour Téo

1. Le titre orange doit-il rester **au-dessus** des photos, comme indiqué dans le PDF ? (Cette version le fait. Si une photo gêne la lecture, on peut la décaler sur le côté plutôt que de la faire passer sous le texte.)
2. Souhaites-tu que le cercle orange parte du **même point** que sur l'accueil, ou d'un point un peu plus haut comme sur la frame 02 ? (Cette version suit la frame 02.)
3. Pour mobile, 3 photos conviennent-elles, ou veux-tu conserver les 5 ?

## Rappels avant une mise en ligne publique

- Les avis de la page Noël sont **fictifs** (`fictif: true`) : les remplacer par de vrais avis avant toute publication.
- Vérifier la page à 1728 x 1030, 1440 x 900, 1280 x 720, 768 et 390 de large.
