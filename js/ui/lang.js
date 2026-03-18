


import { getLang, setLang, t, onLangChange } from "../i18n/i18n.js";

function updateTerminalWelcomeLine() {
  const outputEl = document.getElementById("terminal-output");
  if (!outputEl) return;

  const firstSystem = outputEl.querySelector(".terminal-line.line-system");
  if (!firstSystem) return;

  const text = firstSystem.textContent || "";
  const looksLikeWelcome =
    text.includes("Type 'help'") ||
    text.includes("Escribe 'help'");

  if (looksLikeWelcome) {
    firstSystem.textContent = t("terminal.welcome");
  }
}

function applyStaticText() {
  document.title = t("app.pageTitle");

  const headerTitle = document.querySelector(".app-header h1");
  const headerSub = document.querySelector(".app-header p");
  if (headerTitle) headerTitle.textContent = t("app.title");
  if (headerSub) headerSub.textContent = t("app.subtitle");

  const explorerTitle = document.getElementById("explorer-title");
  const editorTitle = document.getElementById("editor-title");
  const terminalTitle = document.getElementById("terminal-title");
  if (explorerTitle) explorerTitle.textContent = t("panel.explorer");
  if (editorTitle) editorTitle.textContent = t("panel.editor");
  if (terminalTitle) terminalTitle.textContent = t("panel.terminal");

  const activeFile = document.getElementById("active-file-label");
  if (activeFile && activeFile.textContent.trim() === "No file selected") {
    activeFile.textContent = t("editor.noFile");
  }

  const hintCode = document.querySelector("#editor-content code");
  if (hintCode && hintCode.textContent.includes("Open a file")) {
    hintCode.textContent = t("editor.hint");
  }

  const seoTitle = document.getElementById("seo-details-title");
  const seoSummary = document.getElementById("seo-details-summary");
  const seoContactTitle = document.getElementById("seo-contact-title");
  const seoSiteSummary = document.getElementById("seo-site-summary");
  const seoSiteRights = document.getElementById("seo-site-rights");
  const seoEmailLabel = document.getElementById("seo-email-label");
  const seoLinkedinLabel = document.getElementById("seo-linkedin-label");
  const year = new Date().getFullYear();

  if (seoTitle) seoTitle.textContent = t("seo.about");
  if (seoSummary) seoSummary.textContent = t("seo.summary");
  if (seoContactTitle) seoContactTitle.textContent = t("seo.contact");
  if (seoSiteSummary) seoSiteSummary.textContent = t("seo.siteSummary");
  if (seoSiteRights) seoSiteRights.textContent = t("seo.rights", { year });
  if (seoEmailLabel) seoEmailLabel.textContent = t("seo.email");
  if (seoLinkedinLabel) seoLinkedinLabel.textContent = t("seo.linkedin");
}

function syncButton(btn) {
  const lang = getLang();
  btn.textContent = lang.toUpperCase();
  btn.title = lang === "es" ? "Cambiar a English" : "Switch to Espanol";
  btn.setAttribute("aria-label", btn.title);
}

export function initLangToggle() {
  const btn = document.getElementById("lang-toggle");
  applyStaticText();

  if (!btn) {
    onLangChange(() => applyStaticText());
    return;
  }

  syncButton(btn);
  btn.addEventListener("click", () => {
    const next = getLang() === "es" ? "en" : "es";
    setLang(next);
    syncButton(btn);
  });

  onLangChange(() => {
    applyStaticText();
    syncButton(btn);
    updateTerminalWelcomeLine();
  });
}
