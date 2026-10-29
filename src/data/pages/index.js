// Registre des pages secondaires : une entrée par page, importée statiquement (le plugin d'injection est synchrone, ses composants
// tournent dans Node : rien de ce rendu n'entre dans le bundle du navigateur). Les textes vivent dans un fichier par page.
import { terrasses } from "./terrasses.js";
import { bureaux } from "./bureaux.js";
import { designVegetal } from "./design-vegetal.js";

// Domaine final supposé, comme pour la landing Noël (docs/POINTS-A-VALIDER.md).
export const origin = "https://dunboutalautre.co";

export const pages = { terrasses, bureaux, "design-vegetal": designVegetal };
