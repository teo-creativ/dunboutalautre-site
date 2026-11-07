// FAQ d'une page secondaire : la FAQ de la landing Noël (accordéon de cartes, un seul panneau ouvert), appelée avec les questions de la
// page. Pas de carte d'aide : le copywriting n'en prévoit pas. Le JSON-LD FAQPage est produit par seo.js depuis les mêmes données.
import { faq } from "../noel-faq.js";
import { titleHtml } from "../title.js";

export default ({ label, title, tag, items, variant }) => faq({ label, titleHtml: titleHtml(title, tag), help: null, items, variant });
