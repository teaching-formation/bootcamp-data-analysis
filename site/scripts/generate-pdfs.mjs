// Génère un PDF par cours en imprimant les pages du site (export statique)
// via le Chrome local (puppeteer-core). Les corrections repliées sont
// dépliées avant impression. Sortie : public/pdf/<slug>.pdf (commité).
//
// Prérequis : `npm run build` (produit out/) puis servir out/ sur $BASE.
// Usage : BASE=http://localhost:4555 node scripts/generate-pdfs.mjs
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, "..");
const OUT = path.join(SITE, "out");
const PDF_DIR = path.join(SITE, "public", "pdf");
const BASE = process.env.BASE || "http://localhost:4555";
const CHROME =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const modulesDir = path.join(OUT, "modules");
if (!fs.existsSync(modulesDir)) {
  console.error("out/modules introuvable — lance d'abord `npm run build`.");
  process.exit(1);
}
const slugs = fs
  .readdirSync(modulesDir)
  .filter((d) => {
    try {
      return fs.statSync(path.join(modulesDir, d)).isDirectory();
    } catch {
      return false;
    }
  })
  .sort();

fs.mkdirSync(PDF_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const footer = `<div style="width:100%;font-size:8px;color:#9aa0a6;text-align:center;padding:0 10mm;">Data Analyst Bootcamp — From Zero to Hero · <span class="pageNumber"></span>/<span class="totalPages"></span></div>`;

let n = 0;
for (const slug of slugs) {
  const page = await browser.newPage();
  await page.goto(`${BASE}/modules/${slug}/`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  // Déplier toutes les corrections pour qu'elles apparaissent dans le PDF
  await page.evaluate(() => {
    document.querySelectorAll("details").forEach((d) => {
      d.open = true;
    });
  });
  await page.emulateMediaType("print");
  await new Promise((r) => setTimeout(r, 200));
  await page.pdf({
    path: path.join(PDF_DIR, `${slug}.pdf`),
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", bottom: "16mm", left: "12mm", right: "12mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: footer,
  });
  await page.close();
  n++;
  console.log(`PDF ${n}/${slugs.length} — ${slug}`);
}

await browser.close();
console.log(`[generate-pdfs] ${n} PDF générés dans public/pdf/`);
