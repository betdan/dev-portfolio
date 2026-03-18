




import { escapeHtml } from "../security/sanitizer.js";

function extOf(fileName) {
  const name = String(fileName || "");
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : "";
}

function languageOf(fileName) {
  const ext = extOf(fileName);
  if (ext === "py") return "python";
  if (ext === "sh" || ext === "bash") return "shell";
  if (ext === "cs") return "csharp";
  if (ext === "java") return "java";
  if (ext === "sql") return "sql";
  if (ext === "json") return "json";
  if (ext === "log") return "log";
  if (ext === "md") return "markdown";
  return "text";
}

function makeHighlighter(def) {
  const rx = def.regex;
  const classify = def.classify;

  return (raw) => {
    const input = String(raw ?? "");
    if (!input) return "";

    let out = "";
    let lastIndex = 0;
    rx.lastIndex = 0;

    let m;
    while ((m = rx.exec(input)) !== null) {
      const start = m.index;
      const token = m[0];
      const end = start + token.length;
      if (start > lastIndex) {
        out += escapeHtml(input.slice(lastIndex, start));
      }

      const cls = classify(token);
      const safe = escapeHtml(token);
      out += cls ? `<span class="tok ${cls}">${safe}</span>` : safe;

      lastIndex = end;

      if (rx.lastIndex === start) rx.lastIndex = start + 1;
    }

    if (lastIndex < input.length) {
      out += escapeHtml(input.slice(lastIndex));
    }

    return out;
  };
}

const PY_KEYWORDS = new Set([
  "def", "class", "import", "from", "as", "return",
  "if", "elif", "else", "for", "while", "break", "continue",
  "try", "except", "finally", "with", "pass", "raise", "yield",
  "lambda", "in", "is", "and", "or", "not",
]);

const CS_KEYWORDS = new Set([
  "using", "namespace", "class", "struct", "interface", "enum",
  "public", "private", "protected", "internal",
  "static", "readonly", "const", "sealed", "virtual", "override",
  "async", "await", "new", "return", "void",
  "var", "string", "int", "long", "double", "decimal", "bool",
  "true", "false", "null",
  "if", "else", "switch", "case", "default",
  "for", "foreach", "while", "do", "break", "continue",
  "try", "catch", "finally", "throw",
]);

const SQL_KEYWORDS = new Set([
  "select", "from", "where", "join", "left", "right", "inner", "outer", "full",
  "on", "as", "and", "or", "not", "null", "is", "in", "exists",
  "insert", "into", "values", "update", "set", "delete",
  "create", "table", "alter", "drop", "index", "view",
  "group", "by", "order", "having", "limit", "offset", "distinct",
  "union", "all",
]);

const JAVA_KEYWORDS = new Set([
  "package", "import",
  "public", "private", "protected",
  "class", "interface", "enum", "record",
  "static", "final", "abstract", "sealed", "permits",
  "void", "var", "new", "return",
  "this", "super",
  "true", "false", "null",
  "if", "else", "switch", "case", "default",
  "for", "while", "do", "break", "continue",
  "try", "catch", "finally", "throw", "throws",
  "extends", "implements",
]);

const highlighters = {
  python: makeHighlighter({

    regex:
      /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#.*?$|\b\d+(?:\.\d+)?\b|\b(?:True|False|None)\b|\b[a-zA-Z_]\w*\b)/gm,
    classify: (tok) => {
      if (tok.startsWith("#")) return "comment";
      if (tok.startsWith('"') || tok.startsWith("'")) return "string";
      if (/^\d/.test(tok)) return "number";
      if (tok === "True" || tok === "False" || tok === "None") return "constant";
      if (PY_KEYWORDS.has(tok)) return "keyword";
      return "";
    },
  }),

  shell: makeHighlighter({
    regex:
      /(#[^\n]*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$\{[^}]+\}|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b(?:echo|export|if|then|fi|for|do|done|case|esac|function)\b)/gmi,
    classify: (tok) => {
      if (tok.startsWith("#")) return "comment";
      if (tok.startsWith('"') || tok.startsWith("'")) return "string";
      if (tok.startsWith("$")) return "variable";
      if (/^\d/.test(tok)) return "number";
      return "keyword";
    },
  }),

  csharp: makeHighlighter({
    regex:
      /(\/\/[^\n]*$|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\[[^\]]+\]|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/gm,
    classify: (tok) => {
      if (tok.startsWith("//") || tok.startsWith("/*")) return "comment";
      if (tok.startsWith('"') || tok.startsWith("'")) return "string";
      if (tok.startsWith("[") && tok.endsWith("]")) return "attribute";
      if (/^\d/.test(tok)) return "number";
      const lower = tok.toLowerCase();
      if (CS_KEYWORDS.has(lower)) return "keyword";

      if (/^[A-Z][A-Za-z0-9_]*$/.test(tok)) return "type";
      return "";
    },
  }),

  java: makeHighlighter({
    regex:
      /(\/\/[^\n]*$|\/\*[\s\S]*?\*\/|"""[\s\S]*?"""|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/gm,
    classify: (tok) => {
      if (tok.startsWith("//") || tok.startsWith("/*")) return "comment";
      if (tok.startsWith('"""') || tok.startsWith('"') || tok.startsWith("'")) return "string";
      if (tok.startsWith("@")) return "attribute";
      if (/^\d/.test(tok)) return "number";

      const lower = tok.toLowerCase();
      if (JAVA_KEYWORDS.has(lower)) return "keyword";
      if (/^[A-Z][A-Za-z0-9_]*$/.test(tok)) return "type";
      return "";
    },
  }),

  sql: makeHighlighter({
    regex:
      /(--[^\n]*$|\/\*[\s\S]*?\*\/|'(?:''|[^'])*'|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_][\w$]*\b)/gmi,
    classify: (tok) => {
      if (tok.startsWith("--") || tok.startsWith("/*")) return "comment";
      if (tok.startsWith("'")) return "string";
      if (/^\d/.test(tok)) return "number";
      if (SQL_KEYWORDS.has(tok.toLowerCase())) return "keyword";
      return "";
    },
  }),

  json: makeHighlighter({

    regex:
      /("(?:\\.|[^"\\])*")(\s*:)?|\b-?\d+(?:\.\d+)?\b|\b(?:true|false|null)\b/gm,
    classify: (tok) => {
      if (tok.startsWith('"')) return "string";
      if (/^\b-?\d/.test(tok)) return "number";
      if (tok === "true" || tok === "false" || tok === "null") return "constant";
      return "";
    },
  }),

  log: makeHighlighter({

    regex:
      /(\b\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}\b|\bINFO\b|\bWARN\b|\bERROR\b|\bDEBUG\b|\bTRACE\b)/gim,
    classify: (tok) => {
      const up = tok.toUpperCase();
      if (/^\d{4}-\d{2}-\d{2}/.test(tok)) return "meta";
      if (up === "ERROR") return "error";
      if (up === "WARN") return "warn";
      if (up === "INFO") return "info";
      if (up === "DEBUG" || up === "TRACE") return "meta";
      return "meta";
    },
  }),

  markdown: makeHighlighter({
    regex:
      /(^#{1,6}\s.*$|`{3}.*$|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\))/gm,
    classify: (tok) => {
      if (tok.startsWith("#")) return "keyword";
      if (tok.startsWith("```") || (tok.startsWith("`") && tok.endsWith("`"))) return "string";
      return "meta";
    },
  }),
};

export function highlightForEditor(fileName, content) {
  const lang = languageOf(fileName);
  const raw = String(content ?? "");
  if (lang === "text") return { html: escapeHtml(raw), lang };
  const fn = highlighters[lang];
  if (!fn) return { html: escapeHtml(raw), lang: "text" };
  return { html: fn(raw), lang };
}
