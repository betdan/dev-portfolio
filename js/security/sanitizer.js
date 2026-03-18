
const SCRIPT_PATTERN = /<\s*\/?\s*script\b[^>]*>/gi;
const EVENT_HANDLER_PATTERN = /\son\w+\s*=\s*["'][^"']*["']/gi;
const JS_PROTOCOL_PATTERN = /javascript:/gi;
const CONTROL_CHARS_PATTERN = /[\u0000-\u001F\u007F]/g;

const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

export function sanitizeInput(value) {
  return String(value ?? "")
    .replace(CONTROL_CHARS_PATTERN, "")
    .replace(SCRIPT_PATTERN, "")
    .replace(EVENT_HANDLER_PATTERN, "")
    .replace(JS_PROTOCOL_PATTERN, "");
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"'`]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

export function sanitizeOutput(value) {



  return sanitizeInput(value);
}
