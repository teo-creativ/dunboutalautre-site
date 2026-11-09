// Test anti-chevauchement des galeries « photos qui montent » (V8, G5, retours-v8/docs/00-RETOURS-V8-GLOBAL.md).
// Il fait défiler chaque page par pas de 50 px (et regarde aussi la page au chargement) à cinq tailles d'écran, et échoue si :
//   1. deux photos de la galerie se recouvrent (rectangles de getBoundingClientRect, au pixel près) ;
//   2. une photo recouvre le titre, l'étiquette ou le bouton de la section : au-dessus d'eux, ou, sur ordinateur (plus de 900 px), même derrière eux ;
//      sous 900 px le titre prend toute la largeur : une photo peut alors passer derrière lui (halo orange autour du texte), jamais devant ;
//   3. une photo (sa partie visible, après le clip-path de son conteneur) recouvre le logo ou le bouton Menu du header.
// Le test ne lit que la page : aucune dépendance ajoutée au dépôt. Il demande `playwright-core` (le dossier .baseline/ en contient un, ignoré par git) et un Chrome installé.
//
//   npm run build && npx vite preview --port 4173        (dans un autre terminal ; sinon le test le lance lui-même)
//   node tests/galeries.mjs [--pages bureaux,design,decoration,noel,accueil] [--sizes 1728x1030,1440x900,1280x720,768x1024,390x844] [--step 50]
//                           [--settle 120] [--out dossier] [--min-free 700]     (--min-free : arrêt si la mémoire libre passe sous ce nombre de Mo)
// Code de sortie 0 : aucun chevauchement ; 1 : au moins un ; 2 : arrêt (mémoire, page introuvable).
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { freemem } from "node:os";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const loadPlaywright = () => {
  for (const from of [import.meta.url, join(ROOT, ".baseline", "package.json")]) {
    try {
      return createRequire(from)("playwright-core");
    } catch {}
  }
  throw new Error("playwright-core introuvable (ni dans le dépôt, ni dans .baseline/node_modules)");
};
const { chromium } = loadPlaywright();

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback);
const BASE = opt("url", "http://localhost:4173");
const STEP = Number(opt("step", 50));
const SETTLE = Number(opt("settle", 120)); // ms entre deux pas : le scrub lisse (0,6 s) rattrape le défilement, chaque pas voit un état intermédiaire de la même progression
const OUT = opt("out", "");
const MIN_FREE = Number(opt("min-free", 0));
const SIZES = opt("sizes", "1728x1030,1440x900,1280x720,768x1024,390x844")
  .split(",")
  .map((s) => s.split("x").map(Number));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Une entrée par page : les photos, le texte qu'elles ne doivent pas couvrir.
const PAGES = {
  bureaux: { path: "/vegetalisation-bureaux-paris/", photos: ".gal__photo", texts: [".gal__content .label", ".gal__title", ".gal__cta .cta"] },
  design: { path: "/design-vegetal-sur-mesure-paris/", photos: ".gal__photo", texts: [".gal__content .label", ".gal__title", ".gal__cta .cta"] },
  decoration: { path: "/decoration-vegetale-saisonniere-paris/", photos: ".gal__photo", texts: [".gal__content .label", ".gal__title", ".gal__cta .cta"] },
  noel: { path: "/decoration-noel-entreprises-paris/", photos: ".flux__photo", texts: [".flux__title", ".flux__content .cta"] },
  accueil: { path: "/", photos: ".float-photo", texts: [".experience__title", ".experience__content .cta"] },
};
const WANTED = opt("pages", Object.keys(PAGES).join(",")).split(",");

const alive = () => fetch(BASE + "/").then((r) => r.ok, () => false);
async function startPreview() {
  if (await alive()) return null;
  const port = new URL(BASE).port || "4173";
  const child = spawn("npx", ["vite", "preview", "--port", port, "--strictPort"], { cwd: ROOT, shell: true, stdio: "ignore" });
  for (let i = 0; i < 40 && !(await alive()); i++) await sleep(500);
  if (!(await alive())) throw new Error(`vite preview ne répond pas sur ${BASE}`);
  return child;
}

// Exécuté dans la page : l'état de la galerie au défilement courant. Rectangles en px de la fenêtre.
function measure({ photos: photoSel, texts: textSel, wide }) {
  const rect = (r) => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
  const inter = (a, b) => {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return w > 0.5 && h > 0.5 ? { w, h } : null;
  };
  // Partie visible : le rectangle de la photo coupé par les clip-path inset(…px …) de ses ancêtres.
  const visible = (el) => {
    let r = rect(el.getBoundingClientRect());
    for (let p = el.parentElement; p; p = p.parentElement) {
      const m = /^inset\(([^)]*)\)/.exec(getComputedStyle(p).clipPath);
      if (!m) continue;
      const v = m[1].split("round")[0].trim().split(/\s+/).map((s) => parseFloat(s) || 0);
      const [t, rt = t, b = t, l = rt] = v;
      const box = p.getBoundingClientRect();
      r = { left: Math.max(r.left, box.left + l), top: Math.max(r.top, box.top + t), right: Math.min(r.right, box.right - rt), bottom: Math.min(r.bottom, box.bottom - b) };
    }
    return r.right > r.left && r.bottom > r.top ? r : null;
  };
  const photos = [...document.querySelectorAll(photoSel)].filter((el) => el.getClientRects().length && getComputedStyle(el).display !== "none");
  const rects = photos.map((el) => ({ el, r: rect(el.getBoundingClientRect()), seen: visible(el) }));
  const out = { photoPairs: [], text: [], header: [], count: photos.length };

  for (let i = 0; i < rects.length; i++)
    for (let j = i + 1; j < rects.length; j++) {
      const o = inter(rects[i].r, rects[j].r);
      if (o) out.photoPairs.push({ a: i, b: j, w: Math.round(o.w), h: Math.round(o.h) });
    }

  // Texte : les lignes réelles du titre (pas sa boîte, plus large que l'encre), l'étiquette et le bouton.
  const textBoxes = [];
  // Un texte rendu inerte (recouvert par la photo qui grandit : bureaux-branding.js) ou devenu transparent n'est plus lisible ni atteignable : il n'est plus à protéger (et elementsFromPoint ne le voit plus).
  const opacityOf = (el) => {
    let o = 1;
    for (let n = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  };
  for (const sel of textSel)
    for (const el of document.querySelectorAll(sel)) {
      if (!el.getClientRects().length || el.closest("[inert]") || opacityOf(el) < 0.05) continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      const boxes = sel.includes("title") ? [...range.getClientRects()] : [el.getBoundingClientRect()];
      boxes.filter((b) => b.width > 1 && b.height > 1).forEach((b) => textBoxes.push({ sel, el, r: rect(b) }));
    }
  // Qui est au-dessus ? Les photos et le texte passent en pointer-events: auto le temps de la mesure (elementsFromPoint ignore les autres).
  const restore = [];
  [...photos, ...new Set(textBoxes.map((t) => t.el))].forEach((el) => {
    restore.push([el, el.style.pointerEvents]);
    el.style.pointerEvents = "auto";
  });
  // Un mot encore masqué (SplitText : il attend sous son masque, clip) n'est pas visible : sa boîte existe, mais le texte n'est atteignable nulle part à cet endroit.
  textBoxes.forEach((t) => {
    t.hit = document.elementsFromPoint((t.r.left + t.r.right) / 2, (t.r.top + t.r.bottom) / 2).some((n) => t.el.contains(n));
  });
  for (const photo of rects)
    for (const t of textBoxes) {
      const o = t.hit ? inter(photo.r, t.r) : null;
      if (!o) continue;
      const x = (Math.max(photo.r.left, t.r.left) + Math.min(photo.r.right, t.r.right)) / 2;
      const y = (Math.max(photo.r.top, t.r.top) + Math.min(photo.r.bottom, t.r.bottom)) / 2;
      const stack = document.elementsFromPoint(x, y);
      const iPhoto = stack.findIndex((n) => photo.el.contains(n));
      const iText = stack.findIndex((n) => t.el.contains(n));
      const above = iPhoto !== -1 && (iText === -1 || iPhoto < iText); // la photo est peinte devant le texte
      out.text.push({ photo: rects.indexOf(photo), text: t.sel, w: Math.round(o.w), h: Math.round(o.h), above });
    }
  restore.forEach(([el, value]) => (el.style.pointerEvents = value));

  // Header : le logo et le bouton Menu ; seule la partie visible de la photo compte.
  const header = [...document.querySelectorAll("#header a, #header button")].filter((el) => el.getClientRects().length);
  // La scène épinglée est finie quand le haut du conteneur des photos est passé au-dessus de l'écran : la section suivante, par-dessus (z-index), recouvre alors ce qu'il en reste.
  const gone = photos.length > 0 && photos[0].parentElement.getBoundingClientRect().top < -2;
  for (const photo of rects) {
    if (!photo.seen || gone) continue;
    for (const h of header) {
      const o = inter(photo.seen, rect(h.getBoundingClientRect()));
      if (o) out.header.push({ photo: rects.indexOf(photo), el: (h.className || h.tagName).toString().slice(0, 30), w: Math.round(o.w), h: Math.round(o.h) });
    }
  }
  out.sample = rects.map((p) => ({ l: Math.round(p.r.left), t: Math.round(p.r.top), w: Math.round(p.r.right - p.r.left), h: Math.round(p.r.bottom - p.r.top) }));
  return out;
}

async function run(browser, name, [width, height]) {
  const cfg = PAGES[name];
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, locale: "fr-FR", reducedMotion: "no-preference" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BASE + cfg.path, { waitUntil: "load", timeout: 90000 });
  await page.waitForFunction(() => !document.documentElement.classList.contains("js") && !document.documentElement.classList.contains("restoring"), null, { timeout: 20000 });
  await sleep(3300);
  const wide = width > 900;
  const arg = { ...cfg, wide };
  const found = await page.evaluate((c) => document.querySelectorAll(c.photos).length, cfg);
  if (!found) {
    await context.close();
    return { name, size: `${width}x${height}`, error: `aucune photo pour ${cfg.photos}` };
  }

  // Plage de défilement : du début de la page jusqu'à la fin de la scène épinglée qui porte les photos.
  const range = await page.evaluate((c) => {
    const first = document.querySelector(c.photos);
    const spacer = first.closest(".pin-spacer") ?? first.closest("section") ?? first;
    const box = spacer.getBoundingClientRect();
    const top = box.top + window.scrollY;
    return { from: Math.max(0, Math.floor(top - window.innerHeight)), to: Math.ceil(top + box.height), pinned: !!first.closest(".pin-spacer") };
  }, cfg);

  const bad = { photoPairs: [], text: [], header: [] };
  let steps = 0;
  let maxPhotos = 0;
  const record = (kind, y, items) => items.forEach((it) => bad[kind].push({ y, ...it }));
  const positions = [0, ...Array.from({ length: Math.ceil((range.to - range.from) / STEP) + 1 }, (_, i) => range.from + i * STEP)];
  for (const y of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await sleep(y === 0 ? 600 : SETTLE);
    const m = await page.evaluate(measure, arg);
    steps++;
    maxPhotos = Math.max(maxPhotos, m.count);
    record("photoPairs", y, m.photoPairs);
    record("text", y, m.text.filter((t) => wide || t.above));
    record("header", y, m.header);
  }
  await context.close();
  const first = (list) => list.slice(0, 3);
  return {
    name,
    size: `${width}x${height}`,
    steps,
    photos: maxPhotos,
    range,
    pairs: bad.photoPairs.length,
    text: bad.text.length,
    header: bad.header.length,
    errors: errors.slice(0, 3),
    examples: { pairs: first(bad.photoPairs), text: first(bad.text), header: first(bad.header) },
    firstFail: Math.min(...[...bad.photoPairs, ...bad.text, ...bad.header].map((b) => b.y), Infinity),
  };
}

const preview = await startPreview();
let code = 0;
const results = [];
try {
  for (const name of WANTED) {
    if (!PAGES[name]) {
      console.log(`page inconnue : ${name}`);
      code = 2;
      continue;
    }
    const free = Math.round(freemem() / 1048576);
    console.log(`[${new Date().toTimeString().slice(0, 8)}] mémoire libre ${free} Mo, page ${name}`);
    if (MIN_FREE && free < MIN_FREE) {
      console.log(`ARRÊT : mémoire libre sous ${MIN_FREE} Mo, la page ${name} n'est pas testée.`);
      code = 2;
      break;
    }
    // Un Chrome par taille d'écran, refermé entre deux : la mémoire est rendue avant la mesure suivante (un seul navigateur ouvert à la fois).
    for (const size of SIZES) {
      const left = Math.round(freemem() / 1048576);
      if (MIN_FREE && left < MIN_FREE) {
        console.log(`ARRÊT : mémoire libre ${left} Mo, sous ${MIN_FREE} Mo, ${name} ${size.join("x")} n'est pas testé.`);
        code = 2;
        break;
      }
      const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--disable-lcd-text", "--force-color-profile=srgb"] });
      try {
        const r = await run(browser, name, size).catch((e) => ({ name, size: size.join("x"), error: String(e.message).split("\n")[0] }));
        results.push(r);
        const verdict = r.error ? `ERREUR ${r.error}` : r.pairs + r.text + r.header === 0 ? "ok" : `ÉCHEC (premier à ${r.firstFail} px)`;
        console.log(`  ${name} ${r.size} : ${r.error ?? `${r.steps} pas, ${r.photos} photos, photos qui se recouvrent ${r.pairs}, photos sur le texte ${r.text}, photos sous le header ${r.header}`} : ${verdict}`);
        if (r.errors?.length) console.log(`    console : ${r.errors.join(" | ")}`);
        if (r.error || r.pairs + r.text + r.header) code = Math.max(code, 1);
      } finally {
        await browser.close();
      }
      await sleep(1500);
    }
    if (OUT) {
      mkdirSync(OUT, { recursive: true });
      writeFileSync(join(OUT, `galeries-${name}.json`), JSON.stringify(results.filter((r) => r.name === name), null, 1));
    }
  }
} finally {
  if (preview) spawnSync("taskkill", ["/PID", String(preview.pid), "/T", "/F"], { stdio: "ignore" });
}
console.log(code === 0 ? "Aucun chevauchement." : code === 1 ? "Des chevauchements : voir les lignes ÉCHEC." : "Arrêt avant la fin.");
process.exit(code);
