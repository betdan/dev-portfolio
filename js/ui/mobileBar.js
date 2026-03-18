


import { t, onLangChange } from "../i18n/i18n.js";

const STORAGE_KEY = "devPortfolio.mobileView";

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

function normalizeView(v) {
  return v === "terminal" ? "terminal" : "workspace";
}

function isMobile() {

  return window.matchMedia && window.matchMedia("(max-width: 860px)").matches;
}

export function initMobileBar() {
  const bar = document.querySelector(".mobile-bar");
  if (!bar) return null;

  const buttons = [...bar.querySelectorAll(".mobile-bar-btn[data-view]")];
  const setPressed = (active) => {
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === active)));
  };

  const applyLabels = () => {
    buttons.forEach((b) => {
      const v = b.dataset.view;
      if (v === "workspace") b.textContent = t("mobile.workspace");
      if (v === "terminal") b.textContent = t("mobile.terminal");
    });
  };

  const setView = (view) => {
    const v = normalizeView(view);
    document.documentElement.dataset.mobileView = v;
    safeSet(STORAGE_KEY, v);
    setPressed(v);


    if (v === "terminal") {
      setTimeout(() => document.getElementById("terminal-input")?.focus?.(), 0);
    }
  };

  const stored = normalizeView(safeGet(STORAGE_KEY));


  setView(isMobile() ? stored : "workspace");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });


  window.addEventListener("resize", () => {
    const current = document.documentElement.dataset.mobileView || "workspace";
    if (!isMobile()) {
      document.documentElement.dataset.mobileView = "workspace";
      setPressed("workspace");
      return;
    }
    setPressed(current);
  });

  onLangChange(() => applyLabels());
  applyLabels();

  return { setView };
}
