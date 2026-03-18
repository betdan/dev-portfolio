
import { t, onLangChange } from "../i18n/i18n.js";
import { highlightForEditor } from "./syntaxHighlighter.js";

export function createEditorBridge() {
  const labelEl = document.getElementById("active-file-label");
  const codeEl = document.querySelector("#editor-content code");
  const preEl = document.getElementById("editor-content");
  const scrollEl = preEl ? (preEl.closest(".panel-body") || preEl.parentElement) : null;
  let fsRef = null;


  let hasActiveFile = false;
  const openOrder = [];
  const openSet = new Set();
  let activeTab = null;


  const editorPanel = document.getElementById("code-editor");
  const headerEl = editorPanel ? editorPanel.querySelector(".panel-header") : null;
  let tabsEl = editorPanel ? editorPanel.querySelector(".editor-tabs") : null;
  if (editorPanel && !tabsEl) {
    tabsEl = document.createElement("div");
    tabsEl.className = "editor-tabs";
    tabsEl.setAttribute("role", "tablist");
    if (headerEl && headerEl.parentElement) {
      headerEl.insertAdjacentElement("afterend", tabsEl);
    } else {
      editorPanel.prepend(tabsEl);
    }
  }


  let statusEl = editorPanel ? editorPanel.querySelector("#status-bar") : null;
  if (editorPanel && !statusEl) {
    statusEl = document.createElement("footer");
    statusEl.id = "status-bar";
    statusEl.className = "status-bar";
    statusEl.setAttribute("role", "status");
    editorPanel.appendChild(statusEl);
  }

  function updateStatus(fileName, content) {
    if (!statusEl) return;
    const name = fileName || t("editor.noFile");
    const text = String(content ?? "");
    const lines = text ? text.split("\n").length : 0;
    const bytes = new Blob([text]).size;
    const theme = document.documentElement.dataset.theme || "light";
    const lang = document.documentElement.dataset.lang || "en";
    statusEl.textContent = t("status.text", { file: name, lines, bytes, theme, lang });
  }

  function setActiveTab(fileName) {
    activeTab = fileName || null;
    if (!tabsEl) return;
    tabsEl.querySelectorAll(".editor-tab").forEach((tab) => {
      const name = tab.dataset.tab || "";
      const isActive = name === activeTab;
      tab.classList.toggle("is-active", isActive);

      const btn = tab.querySelector("button[data-tab]");
      if (btn) {
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
      }
    });
  }

  function closeTab(fileName) {
    const name = String(fileName || "");
    if (!name) return;
    if (!openSet.has(name)) return;
    openSet.delete(name);
    const idx = openOrder.indexOf(name);
    if (idx >= 0) openOrder.splice(idx, 1);


    if (activeTab === name) {
      const next = openOrder[idx] || openOrder[idx - 1] || null;
      activeTab = next;
      if (next) {
        const content = fsRef?.readFile?.(next);
        if (content !== null && content !== undefined) setFile(next, content);
        else setActiveTab(next);
      } else {

        hasActiveFile = false;
        if (labelEl) labelEl.textContent = t("editor.noFile");
        if (codeEl) codeEl.textContent = t("editor.hint");
      }
    }

    renderTabs();
  }

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.textContent = "";

    openOrder.forEach((fileName) => {
      const tab = document.createElement("div");
      tab.className = "editor-tab";
      tab.dataset.tab = fileName;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "editor-tab-btn";
      btn.dataset.tab = fileName;
      btn.setAttribute("role", "tab");
      btn.textContent = fileName;
      btn.title = fileName;

      btn.addEventListener("click", () => {
        const content = fsRef?.readFile?.(fileName);
        if (content === null || content === undefined) return;
        setFile(fileName, content);
      });

      const x = document.createElement("button");
      x.type = "button";
      x.className = "editor-tab-close";
      x.setAttribute("aria-label", t("tabs.close"));
      x.textContent = "×";
      x.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(fileName);
      });

      tab.appendChild(btn);
      tab.appendChild(x);
      tabsEl.appendChild(tab);
    });

    setActiveTab(activeTab);
  }

  function getActiveTab() {
    return activeTab;
  }

  function getOpenTabs() {
    return [...openOrder];
  }

  function renameTab(fromName, toName) {
    const from = String(fromName || "");
    const to = String(toName || "");
    if (!from || !to) return;
    if (!openSet.has(from)) return;
    if (from === to) return;

    const fromIdx = openOrder.indexOf(from);
    openSet.delete(from);
    if (fromIdx >= 0) openOrder.splice(fromIdx, 1);

    if (!openSet.has(to)) {
      openSet.add(to);
      if (fromIdx >= 0) openOrder.splice(fromIdx, 0, to);
      else openOrder.push(to);
    }

    if (activeTab === from) activeTab = to;
    renderTabs();
  }

  function setFile(fileName, content) {
    hasActiveFile = Boolean(fileName);
    if (labelEl) labelEl.textContent = fileName || t("editor.noFile");
    if (codeEl) {
      const result = highlightForEditor(fileName, content);
      codeEl.innerHTML = result.html;
      codeEl.dataset.lang = result.lang;
    }
    updateStatus(fileName, content);

    if (fileName) {
      const name = String(fileName);
      if (!openSet.has(name)) {
        openSet.add(name);
        openOrder.push(name);
      }
      activeTab = name;
      renderTabs();
    }



    if (scrollEl) {
      scrollEl.scrollTop = 0;
      scrollEl.scrollLeft = 0;
    }
  }


  onLangChange(() => {
    if (!labelEl) return;
    if (hasActiveFile) return;
    labelEl.textContent = t("editor.noFile");
    updateStatus("", "");
  });


  updateStatus("", "");


  try {
    const obs = new MutationObserver(() => {
      if (!hasActiveFile) {
        updateStatus("", "");
        return;
      }
      const current = activeTab;
      const content = current ? fsRef?.readFile?.(current) : "";
      updateStatus(current || "", content || "");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-lang"] });
  } catch (_e) {

  }

  return {
    setFile,
    setFs: (fs) => {
      fsRef = fs;
    },
    getActiveTab,
    getOpenTabs,
    renameTab,
  };
}
