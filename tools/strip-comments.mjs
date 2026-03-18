import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "dev-portfolio");

const TEXT_EXTS = new Set([".js", ".mjs", ".css", ".html", ".md"]);
const SKIP_DIRS = new Set(["assets", "fonts", "icons", "ascii", "node_modules", ".git"]);

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      out.push(...walk(full));
      continue;
    }
    out.push(full);
  }
  return out;
}

function detectEol(text) {
  return text.includes("\r\n") ? "\r\n" : "\n";
}

function stripHtmlComments(input) {

  let out = "";
  let i = 0;
  while (i < input.length) {
    if (input.startsWith("<!--", i)) {
      const end = input.indexOf("-->", i + 4);
      const stop = end === -1 ? input.length : end + 3;
      const chunk = input.slice(i, stop);

      out += chunk.replace(/[^\r\n]/g, "");
      i = stop;
      continue;
    }
    out += input[i];
    i += 1;
  }
  return out;
}

function stripCssComments(input) {
  let out = "";
  let i = 0;
  let state = "normal";
  while (i < input.length) {
    const ch = input[i];
    const next = input[i + 1];

    if (state === "block") {
      if (ch === "*" && next === "/") {
        state = "normal";
        i += 2;
        continue;
      }

      if (ch === "\n" || ch === "\r") out += ch;
      i += 1;
      continue;
    }

    if (state === "sq") {
      out += ch;
      if (ch === "\\" && i + 1 < input.length) {
        out += input[i + 1];
        i += 2;
        continue;
      }
      if (ch === "'") state = "normal";
      i += 1;
      continue;
    }

    if (state === "dq") {
      out += ch;
      if (ch === "\\" && i + 1 < input.length) {
        out += input[i + 1];
        i += 2;
        continue;
      }
      if (ch === "\"") state = "normal";
      i += 1;
      continue;
    }


    if (ch === "'" ) { state = "sq"; out += ch; i += 1; continue; }
    if (ch === "\"" ) { state = "dq"; out += ch; i += 1; continue; }
    if (ch === "/" && next === "*") { state = "block"; i += 2; continue; }
    out += ch;
    i += 1;
  }
  return out;
}

function isRegexAllowedAfter(prevToken) {

  if (!prevToken) return true;
  return /^(?:\(|\[|\{|\=|\,|\:|\;|\!|\?|\+|\-|\*|\/|%|&|\||\^|~|<|>|\n|return|case|throw|else|do|in|of)$/.test(prevToken);
}

function stripJsComments(input) {
  let out = "";
  let i = 0;
  let state = "normal";
  let tplDepth = 0;
  let regexInClass = false;
  let escaped = false;
  let lastToken = "";

  const push = (s) => { out += s; };
  const setToken = (tok) => { lastToken = tok; };
  const pushChar = (c) => {
    push(c);
    if (c === "\n") setToken("\n");
  };

  const readWordBack = () => {

    let j = out.length - 1;
    while (j >= 0 && /\s/.test(out[j])) j -= 1;
    let end = j;
    while (j >= 0 && /[A-Za-z_$]/.test(out[j])) j -= 1;
    const word = out.slice(j + 1, end + 1);
    return word;
  };

  while (i < input.length) {
    const ch = input[i];
    const next = input[i + 1];

    if (state === "line") {
      if (ch === "\n") {
        state = "normal";
        pushChar(ch);
      } else if (ch === "\r") {

        pushChar(ch);
      }
      i += 1;
      continue;
    }

    if (state === "block") {
      if (ch === "*" && next === "/") {
        state = "normal";
        i += 2;
        continue;
      }
      if (ch === "\n" || ch === "\r") pushChar(ch);
      i += 1;
      continue;
    }

    if (state === "sq" || state === "dq") {
      pushChar(ch);
      if (ch === "\\" && i + 1 < input.length) {
        pushChar(input[i + 1]);
        i += 2;
        continue;
      }
      if (state === "sq" && ch === "'") state = "normal";
      if (state === "dq" && ch === "\"") state = "normal";
      i += 1;
      continue;
    }

    if (state === "tpl") {
      pushChar(ch);
      if (ch === "\\" && i + 1 < input.length) {
        pushChar(input[i + 1]);
        i += 2;
        continue;
      }
      if (ch === "`") {
        state = "normal";
        i += 1;
        continue;
      }
      if (ch === "$" && next === "{") {
        tplDepth += 1;
        pushChar(next);
        i += 2;
        continue;
      }
      if (ch === "}" && tplDepth > 0) {
        tplDepth -= 1;
        i += 1;
        continue;
      }
      i += 1;
      continue;
    }

    if (state === "regex") {
      pushChar(ch);
      if (escaped) {
        escaped = false;
        i += 1;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        i += 1;
        continue;
      }
      if (ch === "[" && !regexInClass) {
        regexInClass = true;
        i += 1;
        continue;
      }
      if (ch === "]" && regexInClass) {
        regexInClass = false;
        i += 1;
        continue;
      }
      if (ch === "/" && !regexInClass) {

        i += 1;
        while (i < input.length && /[a-z]/i.test(input[i])) {
          pushChar(input[i]);
          i += 1;
        }
        state = "normal";
        setToken(")");
        continue;
      }
      i += 1;
      continue;
    }


    if (ch === "'" ) { state = "sq"; pushChar(ch); i += 1; continue; }
    if (ch === "\"" ) { state = "dq"; pushChar(ch); i += 1; continue; }
    if (ch === "`" ) { state = "tpl"; tplDepth = 0; pushChar(ch); i += 1; continue; }

    if (ch === "/" && next === "/") {
      state = "line";
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      state = "block";
      i += 2;
      continue;
    }
    if (ch === "/") {

      const prevWord = readWordBack();
      const prev = prevWord ? prevWord : lastToken;
      const allowRegex = isRegexAllowedAfter(prev);
      if (allowRegex) {
        state = "regex";
        regexInClass = false;
        escaped = false;
        pushChar(ch);
        i += 1;
        continue;
      }
    }

    pushChar(ch);
    if (!/\s/.test(ch)) {
      if (/[(){}\[\],;:+\-*%&|^~!?=<>]/.test(ch)) setToken(ch);
      else if (/[A-Za-z_$]/.test(ch)) setToken(ch);
    }
    i += 1;
  }
  return out;
}

function normalizeWhitespace(input) {

  const eol = detectEol(input);
  return input
    .split(/\r?\n/)
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join(eol);
}

function transformFile(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html" || ext === ".md") {
    return normalizeWhitespace(stripHtmlComments(content));
  }
  if (ext === ".css") {
    return normalizeWhitespace(stripCssComments(content));
  }
  if (ext === ".js" || ext === ".mjs") {
    return normalizeWhitespace(stripJsComments(content));
  }
  return content;
}

const files = walk(ROOT)
  .filter((p) => TEXT_EXTS.has(path.extname(p).toLowerCase()));

let changed = 0;
for (const filePath of files) {
  const before = fs.readFileSync(filePath, "utf8");
  const after = transformFile(filePath, before);
  if (after !== before) {
    fs.writeFileSync(filePath, after, "utf8");
    changed += 1;
  }
}

process.stdout.write(`strip-comments: ${changed}/${files.length} files updated\n`);

