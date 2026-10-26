// Lien d'évitement : le focus passe sur <main> sans toucher à l'URL (un hash serait repris par la mémoire de scroll).
// Sans JavaScript, le lien reste une ancre vers #main.
export function initSkipLink() {
  const link = document.querySelector(".skip-link");
  const main = document.getElementById("main");
  if (!link || !main) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    main.focus({ preventScroll: true });
  });
}
