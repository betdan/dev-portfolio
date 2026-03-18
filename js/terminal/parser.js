import { sanitizeInput } from "../security/sanitizer.js";


export function parseInput(rawInput) {
  const raw = sanitizeInput(rawInput).trim();
  if (!raw) {
    return { raw: "", command: "", args: [] };
  }


  const tokens = raw.match(/"([^"]*)"|'([^']*)'|\S+/g) || [];
  const normalized = tokens.map((token) => {
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      return token.slice(1, -1);
    }
    return token;
  });

  return {
    raw,
    command: (normalized[0] || "").toLowerCase(),
    args: normalized.slice(1),
  };
}
