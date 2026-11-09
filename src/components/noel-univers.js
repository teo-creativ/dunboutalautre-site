// « Choisissez l'univers de votre Noël. » (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md §4), générée depuis src/data/noel.js. V8 : ce n'est plus une liste au survol, c'est le composant
// « styles » partagé de Terrasses et de Décoration (components/sections/bureaux-styles.js, scripts/bureaux-styles.js) : section épinglée, l'univers actif avance avec le scroll, sa
// description est visible sans survol, l'image change par voile sombre et échange. Les cinq univers, leurs textes et leur ordre sont ceux de src/data/noel.js. Elle garde l'ancre
// #univers : la section suit la scène épinglée dans le flux de la page, remontée d'un écran par une marge négative (noel-stage.css), et c'est le scroll qui la fait monter par-dessus l'orange.
import { noel } from "../data/noel.js";
import styles from "./sections/bureaux-styles.js";

const { label, title, tag, photo, alt, step, items } = noel.univers;

export default () => styles({ label, title, tag, photo, alt, items, step, anchor: "univers" }, { index: 0 });
