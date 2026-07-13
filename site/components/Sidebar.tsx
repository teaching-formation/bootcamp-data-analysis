"use client";

import { useEffect, useState } from "react";
import { Module } from "@/lib/notebooks";

const ACTE_ICONS: Record<string, string> = {
  acte1_monde_donnee: "🌍",
  acte2_excel_sheets: "📊",
  acte3_sql_analyst: "🗄️",
  acte4_stats_r_python: "🐍",
  projet_niveau_debutant: "🏆",
  modules: "📚",
  projet_niveau_intermediaire: "🏆",
};

const ACTE_SHORT: Record<string, string> = {
  acte1_monde_donnee: "Acte I",
  acte2_excel_sheets: "Acte II",
  acte3_sql_analyst: "Acte III",
  acte4_stats_r_python: "Acte IV",
  projet_niveau_debutant: "Projet Final",
  modules: "Modules",
  projet_niveau_intermediaire: "Projet Final",
};

const NIVEAU_META: Record<string, { badge: string; color: string; label: string }> = {
  "niveau-debutant": { badge: "🟦", color: "#2563eb", label: "Niveau 1 : Débutant" },
  "niveau-intermediaire": { badge: "🟩", color: "#16a34a", label: "Niveau 2 : Intermédiaire" },
};

interface ActeGroup {
  acte: string;
  short: string;
  modules: Module[];
}
interface NiveauGroup {
  niveau: string;
  label: string;
  actes: ActeGroup[];
}

// Regroupe TOUS les modules par niveau, puis par acte (ordre préservé).
function buildTree(modules: Module[]): NiveauGroup[] {
  const order: string[] = [];
  const byNiveau: Record<string, NiveauGroup> = {};
  const acteIndex: Record<string, Record<string, ActeGroup>> = {};

  for (const m of modules) {
    if (!byNiveau[m.niveau]) {
      byNiveau[m.niveau] = {
        niveau: m.niveau,
        label: NIVEAU_META[m.niveau]?.label ?? m.niveauLabel,
        actes: [],
      };
      acteIndex[m.niveau] = {};
      order.push(m.niveau);
    }
    if (!acteIndex[m.niveau][m.acte]) {
      const g: ActeGroup = { acte: m.acte, short: ACTE_SHORT[m.acte] ?? m.acte, modules: [] };
      acteIndex[m.niveau][m.acte] = g;
      byNiveau[m.niveau].actes.push(g);
    }
    acteIndex[m.niveau][m.acte].modules.push(m);
  }
  return order.map((n) => byNiveau[n]);
}

function shortTitle(m: Module): string {
  return m.title
    .replace(/^[^\wÀ-ɏ]*/, "")
    .replace(/^Module \d+ — /, "")
    .split(" — ")
    .slice(-1)[0];
}

export default function Sidebar({ modules, currentSlug }: { modules: Module[]; currentSlug: string }) {
  const currentModule = modules.find((m) => m.slug === currentSlug);
  const tree = buildTree(modules);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Niveaux dépliés : par défaut celui du module courant (ou le premier)
  const [openNiveaux, setOpenNiveaux] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    const cur = currentModule?.niveau ?? tree[0]?.niveau;
    for (const n of tree) init[n.niveau] = n.niveau === cur;
    return init;
  });
  // Actes dépliés : par défaut celui du module courant
  const [openActes, setOpenActes] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const n of tree) for (const a of n.actes) init[a.acte] = a.acte === currentModule?.acte;
    return init;
  });

  // Persistance de l'état "réduit" (desktop)
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("da-sidebar-collapsed") === "1");
    } catch {}
  }, []);
  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem("da-sidebar-collapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  return (
    <>
      {/* Bouton flottant (mobile/tablette) pour ouvrir le sommaire */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu des modules"}
        className="no-print lg:hidden fixed bottom-5 left-5 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-transform active:scale-95"
        style={{ background: "var(--accent)", color: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.28)" }}
      >
        <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
        <span>{mobileOpen ? "Fermer" : "Modules"}</span>
      </button>

      {/* Bouton de ré-ouverture quand le menu est réduit (desktop) */}
      <button
        onClick={toggleCollapsed}
        aria-label="Afficher le menu"
        title="Afficher le menu"
        className={`sidebar-reopen no-print ${collapsed ? "show" : ""}`}
      >
        » <span className="reopen-label">Menu</span>
      </button>

      {/* Fond semi-transparent quand le tiroir est ouvert (mobile) */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`module-sidebar flex flex-col overflow-y-auto ${collapsed ? "is-collapsed" : ""}`}
        style={{
          position: "fixed",
          top: "56px",
          left: 0,
          zIndex: 50,
          width: "280px",
          maxWidth: "85vw",
          height: "calc(100vh - 56px)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          background: "var(--bg-alt)",
          borderRight: "1px solid var(--border)",
          boxShadow: mobileOpen ? "0 0 50px rgba(0,0,0,0.35)" : "none",
        }}
      >
        {/* En-tête : réduire le menu (desktop) */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={toggleCollapsed}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ color: "var(--text-faint)", letterSpacing: "0.06em" }}
            title="Réduire le menu"
          >
            « Réduire le menu
          </button>
          <span className="lg:hidden text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
            Tous les modules
          </span>
        </div>

        {/* Navigation : tous les niveaux, chacun dépliable */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {tree.map((niv) => {
            const meta = NIVEAU_META[niv.niveau];
            const color = meta?.color ?? "var(--accent)";
            const isOpen = openNiveaux[niv.niveau];
            const isCurrent = currentModule?.niveau === niv.niveau;
            return (
              <div key={niv.niveau} className="px-2 mb-1.5">
                {/* En-tête de niveau */}
                <button
                  onClick={() => setOpenNiveaux((p) => ({ ...p, [niv.niveau]: !p[niv.niveau] }))}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors"
                  style={{
                    borderLeft: `4px solid ${color}`,
                    background: isCurrent ? "var(--active-bg)" : "transparent",
                    border: isCurrent ? `1px solid ${color}55` : "1px solid transparent",
                    borderLeftWidth: "4px",
                    borderLeftColor: color,
                  }}
                >
                  <span className="text-sm">{meta?.badge ?? "📘"}</span>
                  <span className="flex-1 text-sm font-bold" style={{ color: "var(--text)" }}>
                    {niv.label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>{isOpen ? "▾" : "▸"}</span>
                </button>

                {/* Actes → modules */}
                {isOpen && (
                  <div className="mt-1">
                    {niv.actes.map((a) => {
                      const acteOpen = openActes[a.acte];
                      const hasActive = a.modules.some((m) => m.slug === currentSlug);
                      return (
                        <div key={a.acte}>
                          <button
                            onClick={() => setOpenActes((p) => ({ ...p, [a.acte]: !p[a.acte] }))}
                            className="w-full flex items-center gap-2 pl-4 pr-3 py-2 text-left transition-colors"
                            style={{ color: hasActive ? "var(--text)" : "var(--text-muted)" }}
                          >
                            <span className="text-xs">{ACTE_ICONS[a.acte] ?? "📁"}</span>
                            <span className="flex-1 text-[0.7rem] font-semibold uppercase tracking-widest" style={{ letterSpacing: "0.07em" }}>
                              {a.short}
                            </span>
                            <span className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>{acteOpen ? "▾" : "▸"}</span>
                          </button>
                          {acteOpen && (
                            <ul className="mb-1">
                              {a.modules.map((m) => {
                                const isActive = m.slug === currentSlug;
                                return (
                                  <li key={m.slug}>
                                    <a
                                      href={`/modules/${m.slug}/`}
                                      className="sidebar-link flex items-center gap-2.5 pl-7 pr-3 py-1.5 text-xs leading-snug"
                                      style={{
                                        background: isActive ? "var(--active-bg)" : undefined,
                                        borderLeft: isActive ? "2px solid var(--accent-blue)" : "2px solid transparent",
                                        color: isActive ? "var(--accent-blue)" : "var(--text-muted)",
                                      }}
                                    >
                                      <span
                                        className="font-mono font-bold shrink-0"
                                        style={{ color: isActive ? "var(--accent-blue)" : "var(--text-muted)", fontSize: "0.68rem" }}
                                      >
                                        {/^\d+$/.test(m.number) ? `M${m.number.padStart(2, "0")}` : m.number}
                                      </span>
                                      <span className="truncate" style={{ color: isActive ? "var(--text)" : "var(--text-soft)" }}>
                                        {shortTitle(m)}
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
                  </div>
                )}
              </div>
            );
          })}

          {/* Niveau 3 — à venir */}
          <div className="px-2 mb-1.5">
            <div
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg"
              style={{ borderLeft: "4px solid #dc2626", opacity: 0.6 }}
            >
              <span className="text-sm">🟥</span>
              <span className="flex-1 text-sm font-bold" style={{ color: "var(--text-muted)" }}>Niveau 3 : Avancé</span>
              <span className="text-[0.6rem] font-medium px-1.5 py-0.5 rounded-full" style={{ border: "1px solid var(--border)", color: "var(--text-faint)" }}>Bientôt</span>
            </div>
          </div>
        </nav>

        {/* Footer sidebar */}
        <div className="px-5 py-4 border-t text-xs flex flex-col gap-2" style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}>
          <a
            href="https://t.me/fromzerotoherodataeng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold mb-1 transition-colors"
            style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
          >
            💬 Une question ? Groupe Telegram
          </a>
          <a href="https://dataprojectlab.com" target="_blank" rel="noopener noreferrer" className="transition-colors">
            ↗ DataProjectLab
          </a>
          <a href="https://dataeng.from0tohero.dev/" target="_blank" rel="noopener noreferrer" className="transition-colors">
            ↗ Bootcamp Data Engineering
          </a>
        </div>
      </aside>
    </>
  );
}
