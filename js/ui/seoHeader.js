import { t, onLangChange } from "../i18n/i18n.js";

function setHidden(el, hidden) {
  if (!el) return;
  if (hidden) {
    el.setAttribute("hidden", "");
  } else {
    el.removeAttribute("hidden");
  }
}

function safeFocus(el) {
  try {
    el?.focus?.();
  } catch (_e) {

  }
}

export function initSeoHeaderButton() {
  const btn = document.getElementById("seo-header-btn");
  const backdrop = document.getElementById("seo-panel-backdrop");
  const panel = document.getElementById("seo-panel");
  const closeBtn = document.getElementById("seo-panel-close");
  if (!btn || !backdrop || !panel || !closeBtn) return;
  const srOnly = btn.querySelector(".sr-only");
  let lastFocus = null;

  const isOpen = () => !backdrop.hasAttribute("hidden");

  const sync = () => {
    const open = isOpen();
    const label = open ? t("seo.headerClose") : t("seo.headerOpen");
    btn.title = label;
    btn.setAttribute("aria-label", label);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (srOnly) srOnly.textContent = label;
  };

  const openPanel = () => {
    if (isOpen()) return;
    lastFocus = document.activeElement;
    setHidden(backdrop, false);
    requestAnimationFrame(() => {
      backdrop.dataset.open = "true";
      safeFocus(closeBtn);
      sync();
    });
  };

  const closePanel = () => {
    if (!isOpen()) return;
    backdrop.dataset.open = "false";
    window.setTimeout(() => {
      setHidden(backdrop, true);
      safeFocus(lastFocus === document.body ? btn : lastFocus);
      sync();
    }, 160);
  };

  sync();

  btn.addEventListener("click", () => {
    if (isOpen()) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener("click", closePanel);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closePanel();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (isOpen()) closePanel();
  });

  onLangChange(sync);
}
