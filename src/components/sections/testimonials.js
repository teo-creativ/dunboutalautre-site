// Avis clients d'une page secondaire : le carrousel de la landing Noël, appelé avec les avis de la page. Tant que la cliente n'a pas
// fourni de citation, un avis unique en [À compléter] (jamais d'avis inventé) : ses flèches restent cachées (page.css). Le label est
// celui de Noël : le copywriting n'en donne pas (microcopie à valider, docs/POINTS-A-VALIDER.md). L'id « temoignages » est imposé
// par src/scripts/testimonials.js : un seul bloc d'avis par page. `bx` : variante de la page Bureaux V5 (voir noel-testimonials.js).
import { testimonialsSection } from "../noel-testimonials.js";

export default ({ label = "TÉMOIGNAGES", items, bx }) => testimonialsSection({ label, items, bx });
