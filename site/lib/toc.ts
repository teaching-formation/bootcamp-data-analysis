export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (text) items.push({ id, text, level });
  }
  return items;
}

export function addHeadingIds(html: string): string {
  let counters: Record<string, number> = {};
  return html.replace(/<h([23])>(.*?)<\/h[23]>/gi, (_, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const base = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);
    counters[base] = (counters[base] ?? 0) + 1;
    const id = counters[base] > 1 ? `${base}-${counters[base]}` : base;
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}
