



import { t, onLangChange } from "../i18n/i18n.js";

const STORAGE_KEYS = {
  explorerWidth: "devPortfolio.layout.explorerWidth",
  terminalHeight: "devPortfolio.layout.terminalHeight",
  explorerCollapsed: "devPortfolio.layout.explorerCollapsed",
  terminalMax: "devPortfolio.layout.terminalMax",
};

const DEFAULT_TERMINAL_HEIGHT_PX = 270;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function px(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${Math.round(n)}px` : null;
}

function getRootVarPx(name, fallbackPx) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parsed = parseFloat(raw);
  if (!Number.isFinite(parsed)) return fallbackPx;
  return parsed;
}

function setRootVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (_e) {

  }
}

function safeGetLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (_e) {
    return null;
  }
}

function safeRemoveLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (_e) {

  }
}

function createButton(label, title) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "icon-btn";
  btn.textContent = label;
  if (title) btn.title = title;
  return btn;
}

function createSvgIcon(pathD) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("btn-icon");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("d", pathD);
  svg.appendChild(path);
  return svg;
}

function ensureActionsContainer(headerEl) {
  if (!headerEl) return null;
  let actions = headerEl.querySelector(".panel-actions");
  if (actions) return actions;
  actions = document.createElement("div");
  actions.className = "panel-actions";
  headerEl.appendChild(actions);
  return actions;
}

function injectSplitters(osShellEl, workspacePaneEl) {
  if (!osShellEl || !workspacePaneEl) return { vSplitter: null, hSplitter: null };

  osShellEl.classList.add("has-splitters");
  workspacePaneEl.classList.add("has-splitter");


  let vSplitter = document.getElementById("workspace-splitter");
  if (!vSplitter) {
    vSplitter = document.createElement("div");
    vSplitter.id = "workspace-splitter";
    vSplitter.className = "splitter splitter-vertical";
    vSplitter.setAttribute("role", "separator");
    vSplitter.setAttribute("aria-orientation", "vertical");
    vSplitter.tabIndex = 0;
    workspacePaneEl.insertBefore(vSplitter, workspacePaneEl.children[1] || null);
  }


  let hSplitter = document.getElementById("terminal-splitter");
  if (!hSplitter) {
    hSplitter = document.createElement("div");
    hSplitter.id = "terminal-splitter";
    hSplitter.className = "splitter splitter-horizontal";
    hSplitter.setAttribute("role", "separator");
    hSplitter.setAttribute("aria-orientation", "horizontal");
    hSplitter.tabIndex = 0;
    const terminalEl = document.getElementById("terminal");
    if (terminalEl) {
      osShellEl.insertBefore(hSplitter, terminalEl);
    }
  }

  return { vSplitter, hSplitter };
}

function applyExplorerCollapsed(workspacePaneEl, collapsed) {
  if (!workspacePaneEl) return;
  const explorerEl = document.getElementById("file-explorer");
  const explorerTitle = document.getElementById("explorer-title");
  workspacePaneEl.classList.toggle("explorer-collapsed", Boolean(collapsed));
  if (explorerEl) explorerEl.classList.toggle("is-collapsed", Boolean(collapsed));
  if (explorerTitle) explorerTitle.setAttribute("aria-expanded", String(!collapsed));
  safeSetLocalStorage(STORAGE_KEYS.explorerCollapsed, collapsed ? "1" : "0");
}

function applyTerminalMax(osShellEl, enabled) {
  if (!osShellEl) return;
  osShellEl.classList.toggle("terminal-max", Boolean(enabled));
  safeSetLocalStorage(STORAGE_KEYS.terminalMax, enabled ? "1" : "0");
}

function setTerminalMaxWithRestore(osShellEl, enabled) {
  const next = Boolean(enabled);
  const isMax = osShellEl.classList.contains("terminal-max");
  if (next === isMax) return;

  applyTerminalMax(osShellEl, next);


  if (!next) {
    setRootVar("--terminal-height", px(DEFAULT_TERMINAL_HEIGHT_PX));
    safeSetLocalStorage(STORAGE_KEYS.terminalHeight, String(DEFAULT_TERMINAL_HEIGHT_PX));
  }
}

function syncTerminalMaxButton(osShellEl, buttonEl) {
  if (!osShellEl || !buttonEl) return;
  const isMax = osShellEl.classList.contains("terminal-max");
  buttonEl.classList.add("icon-only");


  const maximizePath = "M7 7h10v10H7V7Zm2 2v6h6V9H9Z";
  const restorePath = "M7 9V7h10v10h-2V9H7Zm-2 2h8v8H5v-8Zm2 2v4h4v-4H7Z";

  const icon = isMax ? createSvgIcon(restorePath) : createSvgIcon(maximizePath);
  buttonEl.replaceChildren(icon);

  buttonEl.title = isMax ? t("layout.restoreTerminal") : t("layout.maximizeTerminal");
  buttonEl.setAttribute("aria-label", buttonEl.title);
}

function attachResizeHandlers(vSplitter, hSplitter, workspacePaneEl, osShellEl) {

  if (vSplitter && workspacePaneEl) {
    const onKey = (e) => {
      const step = e.shiftKey ? 40 : 20;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const current = getRootVarPx("--explorer-width", 280);
      const delta = (e.key === "ArrowLeft") ? -step : step;
      const next = clamp(current + delta, 200, Math.max(220, window.innerWidth * 0.6));
      setRootVar("--explorer-width", px(next));
      safeSetLocalStorage(STORAGE_KEYS.explorerWidth, String(next));
    };

    vSplitter.addEventListener("keydown", onKey);
    vSplitter.addEventListener("dblclick", () => {
      setRootVar("--explorer-width", "280px");
      safeSetLocalStorage(STORAGE_KEYS.explorerWidth, "280");
    });

    vSplitter.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      vSplitter.setPointerCapture(e.pointerId);
      vSplitter.classList.add("is-dragging");
      document.body.classList.add("is-resizing", "is-resizing-col");

      const paneRect = workspacePaneEl.getBoundingClientRect();
      const min = 200;
      const max = Math.max(220, paneRect.width * 0.7);

      const onMove = (ev) => {

        const x = clamp(ev.clientX - paneRect.left, min, max);
        setRootVar("--explorer-width", px(x));
      };

      const onUp = () => {
        vSplitter.classList.remove("is-dragging");
        document.body.classList.remove("is-resizing", "is-resizing-col");

        const finalPx = getRootVarPx("--explorer-width", 280);
        safeSetLocalStorage(STORAGE_KEYS.explorerWidth, String(finalPx));
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp, true);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, true);
    });
  }


  if (hSplitter && osShellEl) {
    const onKey = (e) => {
      const step = e.shiftKey ? 40 : 20;
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      const current = getRootVarPx("--terminal-height", 270);
      const delta = (e.key === "ArrowUp") ? step : -step;
      const next = clamp(current + delta, 200, Math.max(220, window.innerHeight * 0.7));
      setRootVar("--terminal-height", px(next));
      safeSetLocalStorage(STORAGE_KEYS.terminalHeight, String(next));
    };

    hSplitter.addEventListener("keydown", onKey);
    hSplitter.addEventListener("dblclick", () => {
      setRootVar("--terminal-height", "270px");
      safeSetLocalStorage(STORAGE_KEYS.terminalHeight, "270");
    });

    hSplitter.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      hSplitter.setPointerCapture(e.pointerId);
      hSplitter.classList.add("is-dragging");
      document.body.classList.add("is-resizing", "is-resizing-row");

      const shellRect = osShellEl.getBoundingClientRect();
      const min = 200;
      const max = Math.max(220, window.innerHeight * 0.7);

      const onMove = (ev) => {

        const yFromBottom = clamp(shellRect.bottom - ev.clientY, min, max);
        setRootVar("--terminal-height", px(yFromBottom));
      };

      const onUp = () => {
        hSplitter.classList.remove("is-dragging");
        document.body.classList.remove("is-resizing", "is-resizing-row");
        const finalPx = getRootVarPx("--terminal-height", 270);
        safeSetLocalStorage(STORAGE_KEYS.terminalHeight, String(finalPx));
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp, true);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, true);
    });
  }
}

function applyStoredSizes() {
  const ew = safeGetLocalStorage(STORAGE_KEYS.explorerWidth);
  const th = safeGetLocalStorage(STORAGE_KEYS.terminalHeight);
  const explorerWidth = ew ? parseFloat(ew) : null;
  const terminalHeight = th ? parseFloat(th) : null;
  if (Number.isFinite(explorerWidth) && explorerWidth > 0) setRootVar("--explorer-width", px(explorerWidth));
  if (Number.isFinite(terminalHeight) && terminalHeight > 0) setRootVar("--terminal-height", px(terminalHeight));
}

export function initLayout() {
  const osShellEl = document.querySelector(".os-shell");
  const workspacePaneEl = document.querySelector(".workspace-pane");
  const explorerHeader = document.querySelector("#file-explorer .panel-header");
  const terminalHeader = document.querySelector("#terminal .panel-header");

  if (!osShellEl || !workspacePaneEl) return;

  applyStoredSizes();

  const { vSplitter, hSplitter } = injectSplitters(osShellEl, workspacePaneEl);


  workspacePaneEl.classList.remove("explorer-right");
  safeRemoveLocalStorage("devPortfolio.layout.explorerSide");


  const collapsed = safeGetLocalStorage(STORAGE_KEYS.explorerCollapsed) === "1";
  applyExplorerCollapsed(workspacePaneEl, collapsed);



  safeRemoveLocalStorage(STORAGE_KEYS.terminalMax);
  applyTerminalMax(osShellEl, false);
  setRootVar("--terminal-height", px(DEFAULT_TERMINAL_HEIGHT_PX));
  safeSetLocalStorage(STORAGE_KEYS.terminalHeight, String(DEFAULT_TERMINAL_HEIGHT_PX));

  attachResizeHandlers(vSplitter, hSplitter, workspacePaneEl, osShellEl);


  const explorerTitle = explorerHeader ? explorerHeader.querySelector("h2") : null;
  if (explorerTitle) {
    explorerTitle.classList.add("explorer-title-toggle");
    explorerTitle.tabIndex = 0;
    explorerTitle.setAttribute("role", "button");
    explorerTitle.setAttribute("aria-label", t("layout.toggleExplorer"));
    explorerTitle.setAttribute("aria-expanded", String(!workspacePaneEl.classList.contains("explorer-collapsed")));


    if (explorerTitle.dataset.toggleBound !== "1") {
      explorerTitle.dataset.toggleBound = "1";
      explorerTitle.addEventListener("click", () => {
        const next = !workspacePaneEl.classList.contains("explorer-collapsed");
        applyExplorerCollapsed(workspacePaneEl, next);
      });
      explorerTitle.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        const next = !workspacePaneEl.classList.contains("explorer-collapsed");
        applyExplorerCollapsed(workspacePaneEl, next);
      });
    }
  }


  const terminalActions = ensureActionsContainer(terminalHeader);
  if (terminalActions && !terminalActions.querySelector("[data-action='max']")) {
    const maxBtn = createButton("", t("layout.maximizeTerminal"));
    maxBtn.dataset.action = "max";
    maxBtn.classList.add("icon-btn--ghost");
    maxBtn.addEventListener("click", () => {
      const next = !osShellEl.classList.contains("terminal-max");
      setTerminalMaxWithRestore(osShellEl, next);

      syncTerminalMaxButton(osShellEl, maxBtn);
    });
    terminalActions.appendChild(maxBtn);
    syncTerminalMaxButton(osShellEl, maxBtn);
  } else if (terminalActions) {
    const existing = terminalActions.querySelector("[data-action='max']");
    if (existing) syncTerminalMaxButton(osShellEl, existing);
  }


  onLangChange(() => {
    if (explorerTitle) explorerTitle.setAttribute("aria-label", t("layout.toggleExplorer"));
    const existing = terminalHeader ? terminalHeader.querySelector("[data-action='max']") : null;
    if (existing) syncTerminalMaxButton(osShellEl, existing);
  });



  document.addEventListener("keydown", (e) => {
    if (!e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.toLowerCase() !== "b") return;
    e.preventDefault();
    const next = !workspacePaneEl.classList.contains("explorer-collapsed");
    applyExplorerCollapsed(workspacePaneEl, next);
  });


  const isDesktop = () =>
    window.matchMedia && window.matchMedia("(min-width: 861px)").matches;




  let userInteracted = false;
  const markInteracted = () => {
    userInteracted = true;
  };
  window.addEventListener("pointerdown", markInteracted, { capture: true, once: true });
  window.addEventListener("keydown", markInteracted, { capture: true, once: true });

  const terminalInput = document.getElementById("terminal-input");
  terminalInput?.addEventListener("focus", () => {
    if (!isDesktop()) return;
    if (!userInteracted) return;
    setTerminalMaxWithRestore(osShellEl, true);
    const existing = terminalHeader ? terminalHeader.querySelector("[data-action='max']") : null;
    if (existing) syncTerminalMaxButton(osShellEl, existing);
  });

  workspacePaneEl?.addEventListener("pointerdown", () => {
    if (!isDesktop()) return;
    setTerminalMaxWithRestore(osShellEl, false);
    const existing = terminalHeader ? terminalHeader.querySelector("[data-action='max']") : null;
    if (existing) syncTerminalMaxButton(osShellEl, existing);
  });
}
