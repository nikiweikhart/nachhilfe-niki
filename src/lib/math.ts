import katex from "katex";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Wandelt Text mit \( … \) in HTML um. Text außerhalb wird escaped. */
export function mathHtml(text: string): string {
  let out = "";
  let i = 0;
  while (i < text.length) {
    const start = text.indexOf("\\(", i);
    if (start === -1) {
      out += esc(text.slice(i));
      break;
    }
    const end = text.indexOf("\\)", start + 2);
    if (end === -1) {
      out += esc(text.slice(i));
      break;
    }
    out += esc(text.slice(i, start));
    out += katex.renderToString(text.slice(start + 2, end), { throwOnError: false, output: "html", trust: false });
    i = end + 2;
  }
  return out;
}
