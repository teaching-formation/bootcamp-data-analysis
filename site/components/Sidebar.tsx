"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Module } from "@/lib/notebooks";

const ACTE_ICONS: Record<string, string> = {
  acte1_monde_donnee: "🌍",
  acte2_excel_sheets: "📊",
  acte3_sql_analyst: "🗄️",
  acte4_stats_r_python: "🐍",
  projet_niveau_debutant: "🏆",
  modules: "📚",
};

const NIVEAU_BADGES: Record<string, string> = {
  "niveau-debutant": "🟦",
  "niveau-intermediaire": "🟩",
};

function groupByActe(modules: Module[]) {
  const groups: Record<string, { label: string; short: string; modules: Module[] }> = {};
  const SHORT: Record<string, string> = {
    acte1_monde_donnee: "Acte I",
    acte2_excel_sheets: "Acte II",
    acte3_sql_analyst: "Acte III",
    acte4_stats_r_python: "Acte IV",
    projet_niveau_debutant: "Projet Final",
    modules: "Modules",
  };
  for (const m of modules) {
    if (!groups[m.acte])
      groups[m.acte] = { label: m.acteLabel, short: SHORT[m.acte] ?? m.acte, modules: [] };
    groups[m.acte].modules.push(m);
  }
  return groups;
}

export default function Sidebar({ modules, currentSlug }: { modules: Module[]; currentSlug: string }) {
  const pathname = usePathname();

  // Scope the sidebar to the niveau of the module currently being viewed.
  const currentModule = modules.find((m) => m.slug === currentSlug);
  const niveauModules = currentModule
    ? modules.filter((m) => m.niveau === currentModule.niveau)
    : modules;

  const groups = groupByActe(niveauModules);

  // Which acte contains the current module?
  const currentActe = currentModule?.acte ?? "";
  const [openActes, setOpenActes] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const key of Object.keys(groups)) init[key] = key === currentActe;
    return init;
  });

  return (
    <aside
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: "260px",
        background: "var(--bg-alt)",
        borderRight: "1px solid var(--border)",
        position: "sticky",
        top: "56px",
        height: "calc(100vh - 56px)",
      }}
    >
      {/* Badge niveau */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: "var(--active-bg)", color: "var(--accent-blue)", border: "1px solid var(--accent-border)" }}
        >
          {NIVEAU_BADGES[currentModule?.niveau ?? ""] ?? "🟦"} {currentModule?.niveauLabel ?? "Niveau Débutant"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {Object.entries(groups).map(([acteKey, { short, modules: acteModules }]) => {
          const isOpen = openActes[acteKey];
          const hasActive = acteModules.some((m) => m.slug === currentSlug);

          return (
            <div key={acteKey}>
              {/* Acte header — clickable to collapse */}
              <button
                onClick={() => setOpenActes((prev) => ({ ...prev, [acteKey]: !prev[acteKey] }))}
                className="w-full flex items-center gap-2 px-5 py-2.5 text-left transition-colors"
                style={{ color: hasActive ? "var(--text)" : "var(--text-muted)" }}
              >
                <span className="text-sm">{ACTE_ICONS[acteKey] ?? "📁"}</span>
                <span className="flex-1 text-xs font-semibold uppercase tracking-widest" style={{ letterSpacing: "0.08em" }}>
                  {short}
                </span>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {isOpen ? "▾" : "▸"}
                </span>
              </button>

              {/* Module list */}
              {isOpen && (
                <ul className="mb-2">
                  {acteModules.map((m) => {
                    const isActive = m.slug === currentSlug;
                    return (
                      <li key={m.slug}>
                        <a
                          href={`/modules/${m.slug}/`}
                          className="sidebar-link flex items-center gap-2.5 px-5 py-2 text-xs leading-snug"
                          style={{
                            background: isActive ? "var(--active-bg)" : undefined,
                            borderLeft: isActive ? "2px solid var(--accent-blue)" : "2px solid transparent",
                            color: isActive ? "var(--accent-blue)" : "var(--text-muted)",
                          }}
                        >
                          <span
                            className="font-mono font-bold shrink-0"
                            style={{ color: isActive ? "var(--accent-blue)" : "var(--text-muted)", fontSize: "0.7rem" }}
                          >
                            {/^\d+$/.test(m.number) ? `M${m.number.padStart(2, "0")}` : m.number}
                          </span>
                          <span className="truncate" style={{ color: isActive ? "var(--text)" : "var(--text-soft)" }}>
                            {m.title
                              .replace(/^[^\wÀ-ɏ]*/, "")
                              .replace(/^Module \d+ — /, "")
                              .split(" — ")
                              .slice(-1)[0]}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="px-5 py-4 border-t text-xs flex flex-col gap-1.5" style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}>
        <a
          href="https://dataprojectlab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors"
        >
          ↗ DataProjectLab
        </a>
        <a
          href="https://diakite-data.github.io/data-engineering-bootcamp"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors"
        >
          ↗ Bootcamp Data Engineering
        </a>
      </div>
    </aside>
  );
}
