// Copie chaque notebook .ipynb dans public/notebooks/<slug>.ipynb pour le
// rendre téléchargeable depuis le site (export statique). Exécuté en `prebuild`.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DIR = path.resolve(__dirname, "..");

function findProjectRoot() {
  let dir = SITE_DIR;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "niveau-debutant"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(SITE_DIR, "..");
}

const ROOT = findProjectRoot();
const NIVEAUX = ["niveau-debutant", "niveau-intermediaire"];
const OUT_DIR = path.join(SITE_DIR, "public", "notebooks");

fs.mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const niveauDir of NIVEAUX) {
  const niveauPath = path.join(ROOT, niveauDir);
  if (!fs.existsSync(niveauPath)) continue;

  const acteDirs = fs
    .readdirSync(niveauPath)
    .filter((d) => fs.statSync(path.join(niveauPath, d)).isDirectory());

  for (const acteDir of acteDirs) {
    const actePath = path.join(niveauPath, acteDir);
    const files = fs
      .readdirSync(actePath)
      .filter((f) => f.endsWith(".ipynb") && !f.startsWith("."));

    for (const file of files) {
      const slug = `${niveauDir}__${acteDir}__${file.replace(".ipynb", "")}`;
      fs.copyFileSync(path.join(actePath, file), path.join(OUT_DIR, `${slug}.ipynb`));
      count++;
    }
  }
}

console.log(`[prepare-downloads] ${count} notebooks copiés vers public/notebooks/`);
