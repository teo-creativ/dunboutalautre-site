// Logos clients de public/assets/logos-clients/ : clé, nom affiché (alt), fichier et dimensions réelles (largeur et hauteur explicites
// dans le HTML, pas de décalage de mise en page). Un client sans entrée ici (Eataly, ONF, Ambassade d'Italie, Orixa Media, Ecocem,
// Limonetik : logos non fournis) s'affiche en texte avec la mention [À compléter] ; docs/POINTS-A-VALIDER.md. Fichiers volontairement
// absents : non-identifie-couronne.jpg (client inconnu) et les variantes botimyst-fond-bleu.png, un-haircare-2.png, cineum-cannes.png.
export const logos = {
  atscale: { name: "AtScale", file: "atscale.png", w: 500, h: 101 },
  "bhv-marais": { name: "BHV Marais", file: "bhv-marais.png", w: 464, h: 108 },
  botimyst: { name: "Botimyst", file: "botimyst.png", w: 432, h: 117 },
  "chez-simone": { name: "Chez Simone", file: "chez-simone.png", w: 242, h: 100 },
  comet: { name: "Comet", file: "comet.jpg", w: 300, h: 150 },
  "grands-boulevards": { name: "Hôtel des Grands Boulevards", file: "grands-boulevards.jpg", w: 200, h: 200 },
  "groupe-rocher": { name: "Groupe Rocher", file: "groupe-rocher.png", w: 337, h: 150 },
  "hotel-cluny-square": { name: "Hôtel Cluny Square", file: "hotel-cluny-square.png", w: 351, h: 230 },
  inato: { name: "Inato", file: "inato.jpg", w: 800, h: 419 },
  keobiz: { name: "Kéobiz", file: "keobiz.png", w: 300, h: 75 },
  "la-centrif": { name: "La Centrif", file: "la-centrif.png", w: 195, h: 258 },
  "le-club-33": { name: "Le Club 33", file: "le-club-33.png", w: 438, h: 438 },
  solstice: { name: "Solstice", file: "solstice.png", w: 761, h: 139 },
  "un-haircare": { name: "UN Haircare", file: "un-haircare.png", w: 238, h: 212 },
  upe: { name: "UPE", file: "upe.jpg", w: 311, h: 162 },
  witbe: { name: "Witbe", file: "witbe.png", w: 250, h: 250 },
  "yves-rocher": { name: "Yves Rocher", file: "yves-rocher.png", w: 420, h: 342 },
  // Logos en couleur d'origine fournis avec la V5 de la page Bureaux (retours-v5/assets/bureaux/logos), SVG gardés tels quels : dimensions
  // du viewBox. Ce sont d'autres fichiers que les PNG ci-dessus (clés en « -svg ») : les pages de services gardent les leurs.
  // `shown` : largeur d'affichage en px à 1728 de large, relevée sur les frames bureaux-38 et 39 (les logos n'ont pas tous la même échelle :
  // Chez Simone 159, Inato 120, Eataly 276, Kéobiz 158 ; Thunes et Yves Rocher, coupés par le masque, sont estimés à 140 et 300).
  "thunes-svg": { name: "Thunes", file: "thunes.svg", w: 300, h: 67, shown: 140 },
  "chez-simone-svg": { name: "Chez Simone", file: "chez-simone.svg", w: 300, h: 124, shown: 159 },
  "inato-svg": { name: "Inato", file: "inato.svg", w: 300, h: 102, shown: 120 },
  "eataly-svg": { name: "Eataly", file: "eataly.svg", w: 300, h: 36, shown: 276 },
  "keobiz-svg": { name: "Kéobiz", file: "keobiz.svg", w: 300, h: 76, shown: 158 },
  "yves-rocher-svg": { name: "Yves Rocher", file: "yves-rocher.svg", w: 300, h: 28, shown: 300 },
};
