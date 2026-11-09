// Placement des photos des galeries « qui montent » (retours V8, G5, retours-v8/docs/00-RETOURS-V8-GLOBAL.md) : Bureaux, Design, Décoration, Noël. Aucune photo ne doit en recouvrir une
// autre, au chargement comme pendant le scroll, à toute taille d'écran. Deux règles, qui ne dépendent pas du rapport largeur / hauteur de l'écran :
//  1. des zones : les photos sont rangées en colonnes dont les largeurs (x et w, en vw) ne se recouvrent pas, hors de la place du titre et du bouton. Deux photos de colonnes
//     différentes ne se croisent jamais, quelles que soient leurs vitesses ;
//  2. des piles : deux photos de la même colonne forment une pile. La seconde porte `under` (l'indice de la photo au-dessus d'elle dans la liste) : elle part SOUS elle, à l'écart
//     de la hauteur de celle-ci plus `gap` (en vw : la hauteur d'une photo est sa largeur divisée par son rapport, donc l'écart est le même sur tous les écrans), et elle ne monte jamais plus vite que
//     celle du dessus. L'écart entre elles ne peut donc que croître : elles ne se touchent jamais.
// Une photo décrit sa position d'ordinateur par ses propres champs (x, y, w, ratio, speed, under, gap) et celle des écrans de 900 px et moins par `mobile` (mêmes noms, ratio repris de
// la photo), ou `mobile: null` / absent : photo masquée sur mobile. y est en svh sous le haut de l'écran au début de la scène (la photo du dessus de la pile donne le sien), speed en svh
// par écran de scroll (100 = la vitesse de la page). Renvoie, pour chaque photo, { wide, mobile } : x, w, ratio, y (svh), oy (décalage sous la photo du dessus, en vw), speed.
const GAP = 2.5; // vw : écart par défaut entre deux photos d'une pile

export function placePhotos(photos) {
  const resolve = (key) => {
    const done = [];
    const get = (i) => {
      if (i in done) return done[i];
      const photo = photos[i];
      const own = key === "wide" ? photo : photo.mobile;
      if (!own) return (done[i] = null);
      const placed = { x: own.x, w: own.w, ratio: own.ratio ?? photo.ratio, y: own.y, oy: 0, speed: own.speed ?? photo.speed };
      if (own.under !== undefined) {
        const above = get(own.under);
        if (!above) throw new Error(`galerie : la photo ${i} est sous la photo ${own.under}, qui est absente (${key})`);
        Object.assign(placed, { y: above.y, oy: above.oy + above.w / above.ratio + (own.gap ?? GAP), speed: Math.min(placed.speed, above.speed) });
      }
      return (done[i] = placed);
    };
    return photos.map((_, i) => get(i));
  };
  const wide = resolve("wide");
  const mobile = resolve("mobile");
  return photos.map((_, i) => ({ wide: wide[i], mobile: mobile[i] }));
}

// Variables CSS d'une photo (--x, --w, --y, --oy, --ratio, et --mx, --mw, --my, --moy sous 900 px) : le CSS pose top = y svh + oy vw.
export function photoVars({ wide, mobile }) {
  const vars = { x: wide.x, y: wide.y, oy: +wide.oy.toFixed(3), w: wide.w, ratio: wide.ratio, ...(mobile && { mx: mobile.x, my: mobile.y, moy: +mobile.oy.toFixed(3), mw: mobile.w }) };
  return Object.entries(vars)
    .map(([name, value]) => `--${name}: ${value}`)
    .join("; ");
}
