// Appelle `fn` quand l'intro commence : intro.js retire la classe js de <html> à ce moment, et c'est lui qui anime le titre et le header. Une
// séquence d'ouverture propre à une page (fiche projet, Contact) s'y accroche pour partir en même temps que lui, sans le recouvrir. Si la
// classe n'est déjà plus là (intro sautée, page restaurée en milieu de parcours), `fn` part tout de suite.
export const afterIntro = (fn) => {
  const root = document.documentElement;
  if (!root.classList.contains("js")) return fn();
  const observer = new MutationObserver(() => {
    if (root.classList.contains("js")) return;
    observer.disconnect();
    fn();
  });
  observer.observe(root, { attributes: true, attributeFilter: ["class"] });
};
