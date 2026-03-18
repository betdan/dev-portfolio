


const STORAGE_KEY = "devPortfolio.theme";

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (_e) {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (_e) {

  }
}

function preferredTheme() {
  try {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch (_e) {
    return "light";
  }
}

function applyTheme(theme) {
  const t = (theme === "dark") ? "dark" : "light";
  document.documentElement.dataset.theme = t;
  safeSet(STORAGE_KEY, t);
  return t;
}

export function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  const saved = safeGet(STORAGE_KEY);
  const initial = saved || preferredTheme();
  const applied = applyTheme(initial);

  if (toggleBtn) {
    const sync = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      toggleBtn.setAttribute("aria-pressed", String(isDark));
      toggleBtn.title = isDark ? "Switch to light theme" : "Switch to dark theme";
      toggleBtn.setAttribute("aria-label", toggleBtn.title);
    };

    sync();
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      sync();
    });
  }
}
