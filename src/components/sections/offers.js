// Offres d'une page secondaire (créations, styles, occasions) : la section « Nos univers » de la landing Noël (liste de titres qui
// s'ouvrent au survol, au focus ou au tap, photo-carte à côté), appelée avec les offres de la page. Une seule photo partagée par la liste,
// ou, faute de photo, une tuile « Photo [À compléter] » (src/scripts/universes.js ne fond les photos qu'entre plusieurs <img>).
// L'id « univers » est imposé par ce script : une seule liste d'offres par page.
import { universSection } from "../noel-univers.js";
import { titleHtml } from "../title.js";

export default ({ label, title, tag, items, photo = null, initial = 0 }) => universSection({ label, titleHtml: titleHtml(title, tag), photo, items, initial });
