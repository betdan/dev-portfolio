


import { t, onLangChange } from "../i18n/i18n.js";

function mapResultToFile(match) {
  const text = String(match || "");
  const prefix = text.split(":")[0].trim().toLowerCase();
  if (prefix === "skills" || prefix.startsWith("skills.")) return "skills.json";
  if (prefix === "projects" || prefix.startsWith("projects.")) return "projects.md";
  if (prefix === "experience" || prefix.startsWith("experience.")) return "experience.log";
  if (prefix === "learning" || prefix.startsWith("learning.")) return "learn.cs";
  if (prefix === "profile" || prefix.startsWith("profile.")) return "about.py";
  return null;
}

export function initSearchPanel(context) {
  const shell = document.querySelector(".os-shell");
  if (!shell) return null;

  let overlay = document.getElementById("search-overlay");
  if (!overlay) {
    overlay = document.createElement("section");
    overlay.id = "search-overlay";
    overlay.className = "search-overlay";
    overlay.hidden = true;

    overlay.innerHTML = `
      <div class="search-panel" role="dialog" aria-modal="false" aria-label="Search">
        <header class="search-header">
          <h3 class="search-title"></h3>
          <div class="search-actions">
            <button type="button" class="search-refresh" aria-label="Refresh search">R</button>
            <button type="button" class="search-close" aria-label="Close search">Esc</button>
          </div>
        </header>
        <div class="search-body">
          <input class="search-input" type="text" spellcheck="false" autocomplete="off" />
          <div class="search-meta"></div>
          <ul class="search-results" aria-label="Search results"></ul>
        </div>
      </div>
    `;

    shell.appendChild(overlay);
  }

  const titleEl = overlay.querySelector(".search-title");
  const closeBtn = overlay.querySelector(".search-close");
  const refreshBtn = overlay.querySelector(".search-refresh");
  const inputEl = overlay.querySelector(".search-input");
  const metaEl = overlay.querySelector(".search-meta");
  const resultsEl = overlay.querySelector(".search-results");

  function applyI18n() {
    if (titleEl) titleEl.textContent = t("search.title");
    if (inputEl) inputEl.placeholder = t("search.placeholder");
    if (closeBtn) closeBtn.title = t("search.close");
    if (refreshBtn) refreshBtn.title = t("search.refresh");
  }

  function renderResults(matches) {
    if (!resultsEl) return;
    resultsEl.textContent = "";

    (matches || []).forEach((m) => {
      const li = document.createElement("li");
      li.className = "search-result";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "search-result-btn";
      btn.textContent = String(m);

      btn.addEventListener("click", () => {
        const file = mapResultToFile(m);
        if (!file) return;
        const content = context?.fs?.readFile(file);
        if (content === null || content === undefined) return;
        context.editor?.setFile?.(file, content);

        close();
      });

      li.appendChild(btn);
      resultsEl.appendChild(li);
    });
  }

  function searchNow() {
    const term = String(inputEl?.value || "").trim();
    if (!term) {
      if (metaEl) metaEl.textContent = t("search.hint");
      renderResults([]);
      return;
    }

    const matches = context.searchEngine.search(term);
    if (metaEl) metaEl.textContent = t("search.count", { count: matches.length });
    renderResults(matches);
  }

  function open() {
    overlay.hidden = false;
    overlay.classList.add("is-open");
    applyI18n();
    if (metaEl) metaEl.textContent = t("search.hint");
    searchNow();
    setTimeout(() => inputEl?.focus?.(), 0);
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.hidden = true;
  }

  function toggle() {
    if (overlay.hidden) open();
    else close();
  }

  closeBtn?.addEventListener("click", close);
  refreshBtn?.addEventListener("click", async () => {
    if (typeof context.reloadData === "function") {
      await context.reloadData();
    }
    searchNow();
  });
  inputEl?.addEventListener("input", searchNow);


  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && !overlay.hidden) {
      e.preventDefault();
      close();
      return;
    }


    if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === "f") {
      e.preventDefault();
      toggle();
    }
  });

  onLangChange(() => applyI18n());
  applyI18n();

  return { open, close, toggle, searchNow };
}
