// Convertit les photos de public/assets/images en WebP responsive dans public/assets/optimized (ignoré par git).
// Les originaux ne sont pas touchés. manifest.json (dimensions et largeurs générées) est lu par src/components/img.js.
import sharp from "sharp";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";

const SRC = "public/assets/images";
const OUT = "public/assets/optimized";
const WIDTHS = [480, 800, 1400, 2200];
// Le grain des photos N&B se compresse mal : qualité plus haute pour éviter l'effet empâté.
const QUALITY = 82;

const isUpToDate = async (src, out) => {
  try {
    return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
  } catch {
    return false;
  }
};

const manifest = {};
let made = 0;

for (const dir of await readdir(SRC)) {
  await mkdir(join(OUT, dir), { recursive: true });
  for (const file of await readdir(join(SRC, dir))) {
    const { name, ext } = parse(file);
    if (!/^\.(png|jpe?g)$/i.test(ext)) continue;

    const src = join(SRC, dir, file);
    const { width, height, hasAlpha } = await sharp(src).metadata();
    // Les PNG exportés sont RGBA mais opaques : on retire le canal alpha pour alléger le WebP.
    const opaque = hasAlpha ? (await sharp(src).stats()).isOpaque : true;
    const widths = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS.at(-1))])];
    manifest[`${dir}/${name}`] = { w: width, h: height, widths };

    await Promise.all(
      widths.map(async (w) => {
        const out = join(OUT, dir, `${name}-${w}.webp`);
        if (await isUpToDate(src, out)) return;
        let img = sharp(src).resize({ width: w, withoutEnlargement: true });
        if (opaque && hasAlpha) img = img.removeAlpha();
        await img.webp({ quality: QUALITY }).toFile(out);
        made++;
      }),
    );
  }
}

await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`images: ${made} fichier(s) généré(s), ${Object.keys(manifest).length} source(s) au manifeste`);
