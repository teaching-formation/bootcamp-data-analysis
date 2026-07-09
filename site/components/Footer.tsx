export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-header)" }} className="py-8 px-6">
      <div
        className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{ color: "rgba(255,255,255,0.9)" }}
      >
        <span>📈 Data Analyst Bootcamp — From Zero to Hero</span>
        <div className="flex items-center gap-4">
          <a
            href="https://dataprojectlab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "var(--sky-100)" }}
          >
            DataProjectLab ↗
          </a>
          <a
            href="https://dataeng.from0tohero.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "var(--sky-100)" }}
          >
            Bootcamp Data Engineering ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
