import Link from "next/link";
import { getAllModules, Module } from "@/lib/notebooks";

function groupByNiveauThenActe(modules: Module[]) {
  const niveaux: Record<string, { label: string; actes: Record<string, { label: string; modules: Module[] }> }> = {};
  for (const m of modules) {
    if (!niveaux[m.niveau]) niveaux[m.niveau] = { label: m.niveauLabel, actes: {} };
    const actes = niveaux[m.niveau].actes;
    if (!actes[m.acte]) actes[m.acte] = { label: m.acteLabel, modules: [] };
    actes[m.acte].modules.push(m);
  }
  return niveaux;
}

const NIVEAU_BADGES: Record<string, string> = {
  "niveau-debutant": "🟦",
  "niveau-intermediaire": "🟩",
};

const NIVEAU_DESC: Record<string, string> = {
  "niveau-debutant": "Excel, SQL, Python, R · Projet final RH ivoirien",
  "niveau-intermediaire": "Git, SQL avancé, Power BI, API, Streamlit · Projet final",
};

const ACTE_ICONS: Record<string, string> = {
  acte1_monde_donnee: "🌍",
  acte2_excel_sheets: "📊",
  acte3_sql_analyst: "🗄️",
  acte4_stats_r_python: "🐍",
  projet_niveau_debutant: "🏆",
  modules: "📚",
};

const TOOLS = [
  { icon: "📊", name: "Excel / Google Sheets", desc: "Analyse, TCD, formules" },
  { icon: "🗄️", name: "SQL", desc: "SQLite · requêtes · reporting" },
  { icon: "🐍", name: "Python", desc: "pandas · matplotlib · seaborn" },
  { icon: "📈", name: "R", desc: "dplyr · ggplot2 · stats" },
  { icon: "🤖", name: "IA Générative", desc: "ChatGPT / Claude pour DA" },
];

export default function Home() {
  const modules = getAllModules();
  const niveaux = groupByNiveauThenActe(modules);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", background: "var(--bg)" }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero-banner">
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="hero-kicker justify-center">
            <span>📈</span> Bootcamp · From Zero to Hero
          </p>
          <div className="flex justify-center">
            <div className="hero-divider" />
          </div>
          <h1
            className="hero-title font-black mb-5"
            style={{ fontSize: "clamp(2.8rem, 8vw, 5rem)" }}
          >
            Data Analyst
          </h1>
          <p className="hero-sub text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Devenez Data Analyst opérationnel, prêt pour le marché africain.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href={`/modules/${modules[0]?.slug}`}
              className="btn-cta px-6 py-3 rounded-xl font-bold text-sm"
            >
              🚀 Commencer le bootcamp
            </Link>
            <a
              href="#programme"
              className="btn-hero-outline px-6 py-3 rounded-xl font-bold text-sm"
            >
              📚 Voir le programme
            </a>
          </div>
        </div>
      </section>

      {/* ── Outils ─────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} className="py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6">
          {TOOLS.map((t) => (
            <div key={t.name} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="text-base">{t.icon}</span>
              <span className="font-medium" style={{ color: "var(--text)" }}>{t.name}</span>
              <span className="text-xs hidden sm:inline">{t.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Programme ──────────────────────────────────────── */}
      <main id="programme" className="flex-1 py-12 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto">

          {Object.entries(niveaux).map(([niveauKey, { label: niveauLabel, actes }]) => {
            const niveauModuleCount = Object.values(actes).reduce((n, a) => n + a.modules.length, 0);
            return (
              <div key={niveauKey} className="mb-12">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{NIVEAU_BADGES[niveauKey] ?? "🟦"}</span>
                    <h2 className="text-2xl font-bold" style={{ color: "var(--text-strong)" }}>{niveauLabel}</h2>
                  </div>
                  <p className="text-sm ml-11" style={{ color: "var(--text-muted)" }}>
                    {niveauModuleCount} module{niveauModuleCount > 1 ? "s" : ""} · {NIVEAU_DESC[niveauKey] ?? ""}
                  </p>
                </div>

                {Object.entries(actes).map(([acteKey, { label, modules: acteModules }]) => (
                  <section key={acteKey} className="mb-8">
                    {/* Acte header */}
                    <div
                      className="flex items-center gap-2 px-4 py-3 rounded-t-lg border-b"
                      style={{ background: "var(--active-bg)", borderColor: "var(--accent-border)" }}
                    >
                      <span className="text-base">{ACTE_ICONS[acteKey] ?? "📁"}</span>
                      <h3 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>{label}</h3>
                      <span className="ml-auto text-xs font-medium" style={{ color: "var(--accent-hover)" }}>{acteModules.length} module{acteModules.length > 1 ? "s" : ""}</span>
                    </div>

                    {/* Module list */}
                    <div
                      className="rounded-b-lg border border-t-0 overflow-hidden"
                      style={{ borderColor: "var(--border)", background: "var(--bg-alt)" }}
                    >
                      {acteModules.map((m, i) => (
                        <Link
                          key={m.slug}
                          href={`/modules/${m.slug}`}
                          className="module-row flex items-center gap-4 px-5 py-3.5 group"
                          style={{ borderBottom: i < acteModules.length - 1 ? "1px solid var(--border-subtle)" : undefined }}
                        >
                          <span
                            className="font-mono text-xs font-bold shrink-0 w-8 text-center py-0.5 rounded"
                            style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
                          >
                            {/^\d+$/.test(m.number) ? `M${m.number.padStart(2, "0")}` : m.number}
                          </span>
                          <span className="flex-1 text-sm font-medium leading-snug transition-colors" style={{ color: "var(--text-soft)" }}>
                            {m.title.replace(/^[📐🧮📊🗄️🌍🐍📈]+\s*/, "")}
                          </span>
                          {m.duration && (
                            <span className="text-xs shrink-0 hidden sm:block" style={{ color: "var(--text-faint)" }}>⏱ {m.duration}</span>
                          )}
                          <span className="shrink-0 transition-colors text-sm" style={{ color: "var(--text-faint)" }}>→</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            );
          })}

          {/* Coming soon */}
          {[
            { border: "var(--danger-border)", text: "var(--danger)", badge: "🟥", label: "Niveau Avancé", desc: "Machine Learning · NLP · Dashboard · Projet capstone" },
          ].map((lvl) => (
            <section key={lvl.label} className="mb-6">
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed"
                style={{ background: "var(--bg-alt)", borderColor: lvl.border }}
              >
                <span className="text-base" style={{ opacity: 0.6 }}>{lvl.badge}</span>
                <h3 className="text-sm font-semibold" style={{ color: lvl.text }}>{lvl.label}</h3>
                <span className="text-xs ml-2" style={{ color: "var(--text-faint)" }}>{lvl.desc}</span>
                <span
                  className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "transparent", color: lvl.text, border: `1px solid ${lvl.border}` }}
                >
                  Bientôt
                </span>
              </div>
            </section>
          ))}
        </div>
      </main>

    </div>
  );
}
