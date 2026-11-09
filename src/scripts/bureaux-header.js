// Arbitre de l'état du header posé par les scènes épinglées de la page (matières, puis galerie et branding sur Design). header-theme.js n'a qu'un
// seul état imposé (setHeaderOverride) : si deux scènes le posent chacune, la première qui rattrape son retard après un saut de scroll (rechargement
// avec position mémorisée, ancre) l'efface alors que la seconde vient de le poser, et le dégradé de la section reste affiché sur la photo. Chaque scène
// déclare donc sa demande (`claimHeader(scène, "photo" | "off" | null)`) et c'est la dernière scène de la page qui demande quelque chose qui l'emporte ;
// sans aucune demande, la main est rendue aux sections. Avec une seule scène (Bureaux) le comportement est celui de setHeaderOverride.
// Une demande est un dégradé (chaîne : thème sombre) ou un objet { theme, gradient } (Entretien : le disque orange couvre le bord haut avant le logo).
import { setHeaderOverride } from "./header-theme.js";

const ORDER = ["arrivee", "cercle", "matieres", "branding"]; // ordre de la page : la dernière demande l'emporte
const claims = {};

export function claimHeader(scene, gradient) {
  claims[scene] = gradient;
  const winner = ORDER.filter((name) => claims[name]).at(-1);
  const claim = claims[winner];
  setHeaderOverride(winner ? (typeof claim === "string" ? { theme: "dark", gradient: claim } : claim) : null);
}
