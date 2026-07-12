"use client";

/**
 * Ouvre l'aperçu d'impression du navigateur (→ « Enregistrer en PDF »).
 * Déplie toutes les corrections avant impression, puis restaure l'état après.
 * Le rendu propre du PDF est géré par la feuille @media print (globals.css).
 */
export default function PrintButton() {
  const handlePrint = () => {
    const details = Array.from(document.querySelectorAll("details"));
    const previous = details.map((d) => d.open);
    details.forEach((d) => {
      d.open = true;
    });

    const restore = () => {
      details.forEach((d, i) => {
        d.open = previous[i];
      });
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      title="Aperçu et impression — enregistre le cours en PDF depuis la boîte de dialogue"
      className="inline-flex items-center gap-1 font-medium px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
      style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
    >
      🖨<span className="hidden sm:inline"> Imprimer /</span> PDF
    </button>
  );
}
