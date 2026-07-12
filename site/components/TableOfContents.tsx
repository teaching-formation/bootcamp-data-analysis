"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/lib/toc";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = items.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="toc-nav hidden xl:block shrink-0" style={{ width: "200px" }}>
      <div className="sticky" style={{ top: "112px" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>
          Sur cette page
        </p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0" }}>
              <a
                href={`#${item.id}`}
                className="block text-xs leading-snug py-0.5 transition-colors truncate"
                style={{
                  color: active === item.id ? "var(--accent)" : "var(--text-faint)",
                  fontWeight: active === item.id ? 600 : 400,
                  borderLeft: active === item.id ? "2px solid var(--accent)" : "2px solid transparent",
                  paddingLeft: "0.5rem",
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
