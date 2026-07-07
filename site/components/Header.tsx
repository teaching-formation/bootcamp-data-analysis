import LogoDA from "@/components/LogoDA";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header
      className="site-header sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        height: "56px",
        background: "var(--bg-header)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
        <LogoDA width={180} height={38} />
      </a>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        <a
          href="/"
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ color: "rgba(255, 255, 255, 0.9)" }}
        >
          Accueil
        </a>
        <a
          href="/#programme"
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ color: "rgba(255, 255, 255, 0.9)" }}
        >
          Programme
        </a>
        <a
          href="https://diakite-data.github.io/data-engineering-bootcamp"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ color: "rgba(255, 255, 255, 0.9)" }}
        >
          Bootcamp DE ↗
        </a>
        <span style={{ color: "rgba(255, 255, 255, 0.3)", margin: "0 6px" }}>|</span>
        <ThemeToggle />
      </nav>
    </header>
  );
}
