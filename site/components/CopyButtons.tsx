"use client";

import { useEffect } from "react";

/** Copie un texte dans le presse-papier, avec repli pour les contextes non sécurisés. */
function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (e) {
      reject(e);
    } finally {
      document.body.removeChild(ta);
    }
  });
}

/** Convertit un tableau HTML en TSV (séparé par tabulations) — se colle proprement dans Excel / Google Sheets. */
function tableToTSV(table: HTMLTableElement): string {
  return Array.from(table.querySelectorAll("tr"))
    .map((tr) =>
      Array.from(tr.querySelectorAll("th,td"))
        .map((c) => (c as HTMLElement).innerText.replace(/\s+/g, " ").trim())
        .join("\t")
    )
    .join("\n");
}

/**
 * Enrichit le HTML rendu (côté serveur) du notebook en ajoutant un bouton « Copier »
 * sur chaque bloc de code et chaque tableau. Rendu client, monté après hydratation.
 */
export default function CopyButtons() {
  useEffect(() => {
    const root = document.querySelector(".prose-notebook");
    if (!root) return;

    const makeButton = (getText: () => string): HTMLButtonElement => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copier");
      btn.textContent = "Copier";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        copyText(getText())
          .then(() => {
            btn.classList.add("copied");
            btn.textContent = "Copié ✓";
            window.setTimeout(() => {
              btn.classList.remove("copied");
              btn.textContent = "Copier";
            }, 1800);
          })
          .catch(() => {
            btn.textContent = "Erreur";
            window.setTimeout(() => {
              btn.textContent = "Copier";
            }, 1800);
          });
      });
      return btn;
    };

    // Blocs de code
    root.querySelectorAll("pre").forEach((pre) => {
      const parent = pre.parentElement;
      if (parent && parent.classList.contains("code-block-wrapper")) return; // idempotent
      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      const code = pre.querySelector("code");
      wrapper.appendChild(makeButton(() => (code?.textContent ?? pre.innerText)));
    });

    // Tableaux (déjà enveloppés dans .table-wrapper par le rendu markdown)
    root.querySelectorAll<HTMLElement>(".table-wrapper").forEach((tw) => {
      const parent = tw.parentElement;
      if (parent && parent.classList.contains("table-block-wrapper")) return; // idempotent
      const table = tw.querySelector("table");
      if (!table) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-block-wrapper";
      tw.parentNode?.insertBefore(wrapper, tw);
      wrapper.appendChild(tw);
      wrapper.appendChild(makeButton(() => tableToTSV(table)));
    });
  }, []);

  return null;
}
