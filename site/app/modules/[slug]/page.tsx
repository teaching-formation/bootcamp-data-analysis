import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllModules, getModuleBySlug, getNotebookMarkdown } from "@/lib/notebooks";
import { renderMarkdown } from "@/lib/render";
import { addHeadingIds, extractToc } from "@/lib/toc";
import Sidebar from "@/components/Sidebar";
import TableOfContents from "@/components/TableOfContents";
import CopyButtons from "@/components/CopyButtons";
import PrintButton from "@/components/PrintButton";

export async function generateStaticParams() {
  return getAllModules().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getModuleBySlug(slug);
  if (!m) return { title: "Module introuvable" };
  return { title: `${m.title} — DA Bootcamp` };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);
  if (!module) notFound();

  const allModules = getAllModules();
  const idx = allModules.findIndex((m) => m.slug === slug);
  const prev = idx > 0 ? allModules[idx - 1] : null;
  const next = idx < allModules.length - 1 ? allModules[idx + 1] : null;

  const md = getNotebookMarkdown(module.filePath);
  const rawHtml = renderMarkdown(md);
  const html = addHeadingIds(rawHtml);
  const toc = extractToc(html);

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", background: "var(--bg)" }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <Sidebar modules={allModules} currentSlug={slug} />

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0" style={{ background: "var(--bg)" }}>

        {/* Top bar */}
        <header
          className="module-topbar sticky top-14 z-10 flex items-center justify-between px-4 sm:px-6 py-3 text-xs border-b"
          style={{ background: "var(--bg-alt)", borderColor: "var(--border)" }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="transition-colors" style={{ color: "var(--text-muted)" }}>Accueil</Link>
            <span style={{ color: "var(--text-faint)" }}>/</span>
            <span>{module.acteLabel.split(" — ")[0]}</span>
            <span style={{ color: "var(--text-faint)" }}>/</span>
            <span className="font-semibold" style={{ color: "var(--accent)" }}>
              {/^\d+$/.test(module.number) ? `M${module.number.padStart(2, "0")}` : module.number}
            </span>
          </nav>

          {/* Meta */}
          <div className="flex items-center gap-2 sm:gap-4" style={{ color: "var(--text-faint)" }}>
            <PrintButton />
            {module.duration && <span className="hidden sm:inline whitespace-nowrap">⏱ {module.duration}</span>}
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
            >
              {/^\d+$/.test(module.number) ? `M${module.number.padStart(2, "0")}` : module.number}
            </span>
          </div>
        </header>

        {/* Content + ToC */}
        <div className="flex flex-1 gap-8 px-4 sm:px-8 pt-6 sm:pt-8 pb-24 lg:pb-8 w-full max-w-6xl mx-auto">

          {/* Article */}
          <article className="flex-1 min-w-0">
            <div
              className="prose-notebook"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <CopyButtons />

            {/* Prev / Next */}
            <div className="module-nav mt-12 pt-6 flex justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
              {prev ? (
                <a
                  href={`/modules/${prev.slug}/`}
                  className="flex items-center gap-2 text-sm transition-colors group"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span style={{ color: "var(--text-faint)" }}>←</span>
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-faint)" }}>Précédent</p>
                    <p className="font-medium transition-colors" style={{ color: "var(--text)" }}>
                      {/^\d+$/.test(prev.number) ? `M${prev.number.padStart(2, "0")}` : prev.number} — {prev.title.replace(/^[^\wÀ-ɏ]*/, "").split(" — ").slice(-1)[0]}
                    </p>
                  </div>
                </a>
              ) : <div />}

              {next ? (
                <a
                  href={`/modules/${next.slug}/`}
                  className="flex items-center gap-2 text-sm text-right transition-colors group"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-faint)" }}>Suivant</p>
                    <p className="font-medium transition-colors" style={{ color: "var(--text)" }}>
                      {/^\d+$/.test(next.number) ? `M${next.number.padStart(2, "0")}` : next.number} — {next.title.replace(/^[^\wÀ-ɏ]*/, "").split(" — ").slice(-1)[0]}
                    </p>
                  </div>
                  <span style={{ color: "var(--text-faint)" }}>→</span>
                </a>
              ) : <div />}
            </div>
          </article>

          {/* Table of Contents */}
          <TableOfContents items={toc} />
        </div>
      </div>
    </div>
  );
}
