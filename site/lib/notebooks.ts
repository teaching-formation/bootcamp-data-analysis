import fs from "fs";
import path from "path";

function findProjectRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "niveau-debutant"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.join(process.cwd(), "..");
}

const ROOT = findProjectRoot();

export interface Module {
  slug: string;
  title: string;
  number: string;
  acte: string;
  acteLabel: string;
  niveau: string;
  niveauLabel: string;
  filePath: string;
  duration?: string;
}

const NIVEAUX = [
  { dir: "niveau-debutant", label: "Niveau 1 — Débutant" },
  { dir: "niveau-intermediaire", label: "Niveau 2 — Intermédiaire" },
];

const ACTES: Record<string, string> = {
  acte1_monde_donnee: "Acte I — Le monde de la donnée",
  acte2_excel_sheets: "Acte II — Excel & Google Sheets",
  acte3_sql_analyst: "Acte III — SQL pour l'analyse",
  acte4_stats_r_python: "Acte IV — R & Python",
  projet_niveau_debutant: "Projet Final — Niveau Débutant",
  modules: "Modules — Niveau Intermédiaire",
  projet_niveau_intermediaire: "Projet Final — Niveau Intermédiaire",
};

function extractTitle(nbPath: string): string {
  try {
    const raw = fs.readFileSync(nbPath, "utf-8");
    const nb = JSON.parse(raw);
    for (const cell of nb.cells ?? []) {
      const src = Array.isArray(cell.source)
        ? cell.source.join("")
        : cell.source ?? "";
      const match = src.match(/^#\s+(.+)/m);
      if (match) return match[1].replace(/^[^\w]*/, "").trim();
    }
  } catch {}
  return path.basename(nbPath, ".ipynb");
}

function extractDuration(nbPath: string): string | undefined {
  try {
    const raw = fs.readFileSync(nbPath, "utf-8");
    const nb = JSON.parse(raw);
    for (const cell of nb.cells ?? []) {
      const src = Array.isArray(cell.source)
        ? cell.source.join("")
        : cell.source ?? "";
      const match = src.match(/Durée estimée\s*[:\*]+\s*(.+)/);
      if (match) return match[1].replace(/\*+/g, "").trim();
    }
  } catch {}
  return undefined;
}

export function getAllModules(): Module[] {
  const modules: Module[] = [];

  for (const { dir: niveauDir, label: niveauLabel } of NIVEAUX) {
    const niveauPath = path.join(ROOT, niveauDir);
    if (!fs.existsSync(niveauPath)) continue;

    const acteDirs = fs
      .readdirSync(niveauPath)
      .filter((d) => fs.statSync(path.join(niveauPath, d)).isDirectory())
      .sort();

    for (const acteDir of acteDirs) {
      const actePath = path.join(niveauPath, acteDir);
      const acteLabel = ACTES[acteDir] ?? acteDir;

      const files = fs
        .readdirSync(actePath)
        .filter((f) => f.endsWith(".ipynb") && !f.startsWith("."))
        .sort();

      for (const file of files) {
        const filePath = path.join(actePath, file);
        const slug = `${niveauDir}__${acteDir}__${file.replace(".ipynb", "")}`;
        const numMatch = file.match(/module-0*(\d+)/);
        const projetMatch = file.match(/projet-([a-zA-Z]+)/i);
        const number = numMatch
          ? numMatch[1]
          : projetMatch
          ? `P${projetMatch[1].toUpperCase()}`
          : "0";
        const title = extractTitle(filePath);
        const duration = extractDuration(filePath);

        modules.push({
          slug,
          title,
          number,
          acte: acteDir,
          acteLabel,
          niveau: niveauDir,
          niveauLabel,
          filePath,
          duration,
        });
      }
    }
  }

  return modules;
}

export function getModuleBySlug(slug: string): Module | undefined {
  return getAllModules().find((m) => m.slug === slug);
}

export function getNotebookMarkdown(filePath: string): string {
  const raw = fs.readFileSync(filePath, "utf-8");
  const nb = JSON.parse(raw);
  return (nb.cells ?? [])
    .filter((c: { cell_type: string }) => c.cell_type === "markdown")
    .map((c: { source: string | string[] }) =>
      Array.isArray(c.source) ? c.source.join("") : c.source
    )
    .join("\n\n---CELL---\n\n");
}
