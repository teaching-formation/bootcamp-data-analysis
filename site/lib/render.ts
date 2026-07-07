import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";

hljs.registerLanguage("sql", sql);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);

marked.setOptions({
  gfm: true,
  breaks: false,
});

const renderer = new marked.Renderer();

// Syntax-highlight fenced code blocks
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
  const highlighted =
    language === "plaintext"
      ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      : hljs.highlight(text, { language }).value;
  const label = lang ? `<span class="code-lang">${lang}</span>` : "";
  return `<pre>${label}<code class="hljs language-${language}">${highlighted}</code></pre>`;
};

// Open external links in new tab
renderer.link = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
  const isExternal = href.startsWith("http");
  const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
  const t = title ? ` title="${title}"` : "";
  return `<a href="${href}"${t}${attrs}>${text}</a>`;
};

marked.use({ renderer });

export function renderMarkdown(md: string): string {
  const processed = md.replace(/---CELL---/g, '<hr class="cell-separator" />');
  const html = marked.parse(processed) as string;
  // Wrap every <table> in a scrollable div
  return html.replace(/<table>/g, '<div class="table-wrapper"><table>').replace(/<\/table>/g, '</table></div>');
}
