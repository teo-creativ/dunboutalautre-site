// Contrôle statique du site construit (dist/) et des données de pages (src/data/pages/), sans dépendance.
// Usage : node scripts/check-site.js [--placeholders] [--links]
//   (sans option) structure, texte et cohérence : code de sortie 1 au moindre écart
//   --placeholders  liste, page par page, les valeurs « [À compléter] » (libellé et nombre)
//   --links         exige en plus qu'aucun lien interne ne soit « # » (mise en ligne), hors liens volontairement fictifs
// À lancer après `npm run build`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = process.env.DBAL_DIST ?? join(ROOT, "dist");
const COPY = join(ROOT, "docs", "copywriting");
const ARBO = join(ROOT, "docs", "arborescence-et-strategie.md");
const LISTING = process.argv.includes("--placeholders");
const STRICT_LINKS = process.argv.includes("--links");
const MARK = "[À compléter]";
// Liens fictifs voulus après la mise en ligne : pages hors périmètre et réseau social sans URL confirmée.
const ALLOWED_HASH = ["Facebook", "Mentions légales", "Politique de confidentialité"];

if (!existsSync(DIST)) {
  console.error("dist/ absent : lancer npm run build d'abord.");
  process.exit(2);
}

const errors = [];
const fail = (page, message) => errors.push(`${page} : ${message}`);

// ---------- Lecture du HTML construit ----------
const pagesOf = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "assets" ? [] : pagesOf(path);
    return entry.name === "index.html" ? [path] : [];
  });

const decode = (value) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
const flat = (value) => value.replace(/[\u00a0\u202f]/g, " ").replace(/’/g, "'").replace(/\s+/g, " ").trim();
const visibleText = (html) =>
  decode(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " "));

const listing = [];
const designReport = []; // textes acceptés sur la foi d'une maquette (page.designTexts), affichés en fin de contrôle
const pages = pagesOf(DIST).map((file) => ({ file, name: relative(DIST, file).split("\\").join("/") }));

for (const { file, name } of pages) {
  const html = readFileSync(file, "utf8");
  const text = visibleText(html);

  // Un seul h1 ; pas de saut de niveau vers le bas (h2 puis h4).
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  if (levels.filter((l) => l === 1).length !== 1) fail(name, `${levels.filter((l) => l === 1).length} h1 (un seul attendu)`);
  levels.forEach((level, i) => i && level > levels[i - 1] + 1 && fail(name, `saut de titre h${levels[i - 1]} puis h${level}`));

  // Title, description.
  if (!/<title>[^<]+<\/title>/.test(html)) fail(name, "title absent ou vide");
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(name, "meta description absente ou vide");

  // Images sans alt.
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\salt=/.test(img)) fail(name, `image sans alt : ${img.slice(0, 80)}`);

  // Ids uniques (hors scripts).
  const ids = [...html.replace(/<script[\s\S]*?<\/script>/g, "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of new Set(ids.filter((v, i) => ids.indexOf(v) !== i))) fail(name, `id en double : ${id}`);

  // Tirets longs dans le texte visible.
  const dash = text.match(/.{0,30}[—–].{0,30}/);
  if (dash) fail(name, `tiret long : « ${dash[0].replace(/\s+/g, " ")} »`);

  // Placeholders : chaque « [À compléter] » visible porte un data-placeholder, et inversement.
  const marks = text.split(MARK).length - 1;
  const attrs = [...html.matchAll(/data-placeholder="([^"]*)"/g)].map((m) => decode(m[1]));
  if (marks !== attrs.length) fail(name, `${marks} « ${MARK} » visibles pour ${attrs.length} data-placeholder`);
  for (const label of attrs) listing.push({ name, label });

  // JSON-LD FAQPage : questions et réponses identiques à celles affichées.
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(block[1]);
    } catch {
      fail(name, "JSON-LD invalide");
      continue;
    }
    if (data["@type"] !== "FAQPage") continue;
    const shown = flat(text);
    for (const item of data.mainEntity) {
      if (!shown.includes(flat(item.name))) fail(name, `question du JSON-LD absente de la page : ${item.name.slice(0, 50)}`);
      if (!shown.includes(flat(item.acceptedAnswer.text))) fail(name, `réponse du JSON-LD absente de la page : ${item.acceptedAnswer.text.slice(0, 50)}`);
    }
  }

  // Liens internes : la cible existe dans dist/ ; « # » comptés, interdits avec --links sauf liens voulus.
  const targets = [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
  for (const [, href, inner] of targets) {
    const label = visibleText(inner).replace(/\s+/g, " ").trim();
    if (href === "#") {
      if (STRICT_LINKS && !ALLOWED_HASH.includes(label)) fail(name, `lien « # » restant : « ${label.slice(0, 40)} »`);
      continue;
    }
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const path = href.split(/[?#]/)[0];
    const target = path.startsWith("/assets/") ? join(DIST, path) : join(DIST, path, path.endsWith(".html") ? "" : "index.html");
    if (!existsSync(target)) fail(name, `lien interne cassé : ${href}`);
  }
}

// ---------- Données de pages (si le registre existe) ----------
const registry = join(ROOT, "src", "data", "pages", "index.js");
if (existsSync(registry)) {
  const { pages: data } = await import(pathToFileURL(registry).href);
  const normalize = (value) => flat(String(value).replace(/\\/g, "").replace(/\*+/g, ""));
  const arbo = normalize(readFileSync(ARBO, "utf8"));
  // Clés dont la valeur n'est pas du copywriting : chemins, noms de fichiers, variantes, descriptions d'images, microcopie.
  const SKIP = new Set(["type", "id", "path", "slug", "file", "source", "photo", "src", "alt", "variant", "href", "to", "logo", "kind", "field", "key", "autocomplete", "categories", "category", "links", "micro", "link", "dims", "designTexts", "pageSize"]);
  const strings = (value, trail = []) => {
    if (typeof value === "string") return [{ value, trail }];
    if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, [...trail, i]));
    if (value && typeof value === "object" && !("todo" in value)) {
      return Object.entries(value).flatMap(([k, v]) => (SKIP.has(k) ? [] : strings(v, [...trail, k])));
    }
    return [];
  };
  const tagged = (value, found = []) => {
    if (Array.isArray(value)) value.forEach((v) => tagged(v, found));
    else if (value && typeof value === "object") {
      if (typeof (value.title ?? value.statement) === "string" && typeof value.tag === "string") found.push(value);
      Object.values(value).forEach((v) => tagged(v, found));
    }
    return found;
  };

  for (const [id, page] of Object.entries(data)) {
    const label = `données ${id}`;
    const copy = page.source && existsSync(join(COPY, page.source)) ? normalize(readFileSync(join(COPY, page.source), "utf8")) : "";
    if (page.source && !copy) fail(label, `source introuvable : ${page.source}`);
    // Un tag est une sous-chaîne exacte de son titre : la phrase du copywriting n'est jamais modifiée.
    for (const section of tagged(page.sections ?? [])) {
      const heading = section.title ?? section.statement;
      if (!heading.includes(section.tag)) fail(label, `tag « ${section.tag} » absent du titre « ${heading.slice(0, 50)} »`);
    }
    // Chaque texte est dans le copywriting de la page (ou, pour title et description, dans l'arborescence). Exception explicite : les
    // textes pris sur une maquette (page.designTexts, ex. retours-v4 pour Réalisations) sont acceptés, comptés et affichés ; une exception
    // qui ne correspond plus à aucun texte de la page est périmée et fait échouer le contrôle.
    const design = new Map((page.designTexts ?? []).map((text) => [normalize(text), 0]));
    for (const { value, trail } of strings(page)) {
      const needle = normalize(value);
      if (needle.length < 3) continue;
      if (design.has(needle)) design.set(needle, design.get(needle) + 1);
      if (!copy.includes(needle) && !arbo.includes(needle) && !design.has(needle)) fail(label, `texte absent du copywriting (${trail.join(".")}) : « ${value.slice(0, 60)} »`);
    }
    for (const [needle, uses] of design) if (!uses) fail(label, `exception de maquette sans texte correspondant : « ${needle.slice(0, 60)} »`);
    const outside = [...design.keys()].filter((needle) => !copy.includes(needle) && !arbo.includes(needle));
    if (design.size) designReport.push(`${id} : ${outside.length} texte(s) hors copywriting, pris sur la maquette : ${outside.map((text) => `« ${text} »`).join(", ")}`);
  }

  // Réalisations : le compteur du menu et du hero (site.realisationsCount) est celui de la grille, et les compteurs des filtres s'additionnent.
  const { site } = await import(pathToFileURL(join(ROOT, "src", "data", "site.js")).href);
  const grid = data.realisations?.sections.find((section) => section.type === "projets-grid");
  if (grid) {
    if (grid.items.length !== site.realisationsCount) fail("données realisations", `${grid.items.length} cartes pour realisationsCount = ${site.realisationsCount}`);
    // Aucun état « vide » n'existe : un filtre sans carte afficherait une grille vide, la donnée doit donc toujours en avoir une.
    for (const f of grid.filters.filter((f) => f.key !== "all")) {
      if (!grid.items.some((item) => item.category === f.key)) fail("données realisations", `le filtre « ${f.label} » n'a aucune carte`);
    }
    const sum = grid.filters.filter((f) => f.key !== "all").reduce((n, f) => n + grid.items.filter((item) => item.category === f.key).length, 0);
    if (sum !== grid.items.length) fail("données realisations", `les filtres couvrent ${sum} cartes sur ${grid.items.length} (catégorie inconnue ?)`);
  }
}

// ---------- Sortie ----------
if (LISTING) {
  const byPage = new Map();
  for (const { name, label } of listing) {
    const counts = byPage.get(name) ?? new Map();
    counts.set(label, (counts.get(label) ?? 0) + 1);
    byPage.set(name, counts);
  }
  if (!byPage.size) console.log("Aucun placeholder.");
  for (const [name, counts] of byPage) {
    console.log(`${name}  (${[...counts.values()].reduce((a, b) => a + b, 0)})`);
    for (const [label, n] of counts) console.log(`  ${String(n).padStart(2)} x ${label}`);
  }
  console.log(`\n${listing.length} placeholder(s) dans ${byPage.size} page(s).`);
}
if (errors.length) {
  console.log(`\n${errors.length} écart(s) :`);
  errors.forEach((e) => console.log(`  - ${e}`));
  process.exit(1);
}
designReport.forEach((line) => console.log(`maquette : ${line}`));
console.log(`check-site : ${pages.length} page(s), aucun écart.`);
