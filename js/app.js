import { Terminal } from "./terminal/terminal.js";
import { createCoreCommands } from "./commands/coreCommands.js";
import { createDevCommands } from "./commands/devCommands.js";
import { VirtualFileSystem } from "./filesystem/fs.js";
import { loadWorkspaceFiles } from "./filesystem/loader.js";
import { createEditorBridge } from "./ui/editor.js";
import { createExplorerBridge } from "./ui/explorer.js";
import { initLayout } from "./ui/layout.js";
import { initTheme } from "./ui/theme.js";
import { initI18n, t, setLang, getLang, onLangChange } from "./i18n/i18n.js";
import { initLangToggle } from "./ui/lang.js";
import { initSeoHeaderButton } from "./ui/seoHeader.js";
import { initSearchPanel } from "./ui/searchPanel.js";
import { initMobileBar } from "./ui/mobileBar.js";
import { loadPortfolioData, SearchEngine } from "./search/searchEngine.js";
import { Autocomplete } from "./terminal/autocomplete.js";

function createBootScreenController() {
  const bootEl = document.getElementById("boot-screen");
  const progressEl = document.getElementById("boot-progress-bar");
  const progressLabelEl = document.getElementById("boot-progress-label");
  const stageLabelEl = document.getElementById("boot-stage-label");
  const startedAt = Date.now();
  const minVisibleMs = 2400;

  const setStage = (percent, label) => {
    const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
    if (progressEl) progressEl.style.width = `${safePercent}%`;
    if (progressLabelEl) progressLabelEl.textContent = `${Math.round(safePercent)}%`;
    if (stageLabelEl && label) stageLabelEl.textContent = String(label);
  };

  const finish = () => {
    setStage(100, "Runtime synchronization complete");
    const elapsed = Date.now() - startedAt;
    const waitMs = Math.max(0, minVisibleMs - elapsed);
    window.setTimeout(() => {
      document.body?.setAttribute("data-app-ready", "true");
      if (bootEl) {
        window.setTimeout(() => bootEl.remove(), 560);
      }
    }, waitMs);
  };

  const fail = () => {
    setStage(100, "Bootstrap interrupted");
  };

  return { setStage, finish, fail };
}

async function loadCommits(path = "./commits.json") {
  try {
    const response = await fetch(path);
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload) ? payload : [];
  } catch (_error) {
    return [];
  }
}

function createCommandContext(fs, editor, portfolioData, searchEngine, commits) {
  return {
    currentPath: fs.getPath(),
    workspaceFiles: fs.listFiles(),
    fs,
    editor,
    t,
    setLang,
    profile: portfolioData.profile,
    skills: portfolioData.skills,
    experience: portfolioData.experience,
    projects: portfolioData.projects,
    learning: portfolioData.learning,
    searchEngine,
    commits,
  };
}

async function bootstrap() {
  const boot = createBootScreenController();
  boot.setStage(11, "Mapping interface modules");
  initI18n();
  initLangToggle();
  initSeoHeaderButton();
  initTheme();
  initLayout();
  boot.setStage(26, "Assembling workstation shell");
  const mobileBar = initMobileBar();
  const editor = createEditorBridge();
  const initialLang = getLang();
  let currentWorkspaceLang = initialLang;

  const loadWorkspaceManifestRaw = async () => {
    try {
      const r = await fetch("./workspace/manifest.json", { cache: "no-store" });
      if (!r.ok) return null;
      return await r.json();
    } catch (_e) {
      return null;
    }
  };

  boot.setStage(42, "Reading workspace manifest");
  const manifestRaw = await loadWorkspaceManifestRaw();
  const defaultWorkspaceLang = (manifestRaw && manifestRaw.defaultLang === "es") ? "es" : "en";
  const aliasesByLang = (manifestRaw && manifestRaw.languages) ? manifestRaw.languages : null;

  const toDefaultName = (fileName, lang) => {
    const name = String(fileName || "");
    const l = (lang === "es") ? "es" : "en";
    if (l === defaultWorkspaceLang) return name;
    const aliases = aliasesByLang?.[l]?.aliases;
    if (!aliases || typeof aliases !== "object") return name;
    for (const [k, v] of Object.entries(aliases)) {
      if (String(v) === name) return String(k);
    }
    return name;
  };

  const fromDefaultName = (fileName, lang) => {
    const name = String(fileName || "");
    const l = (lang === "es") ? "es" : "en";
    if (l === defaultWorkspaceLang) return name;
    const aliases = aliasesByLang?.[l]?.aliases;
    if (!aliases || typeof aliases !== "object") return name;
    return String(aliases[name] || name);
  };
  boot.setStage(61, "Loading portfolio graph");
  const [workspaceFiles, portfolioData, commits] = await Promise.all([
    loadWorkspaceFiles("./workspace", initialLang),
    loadPortfolioData({ lang: initialLang, fetchOptions: { cache: "no-store" } }),
    loadCommits("./commits.json"),
  ]);
  boot.setStage(78, "Indexing search and terminal commands");
  let fs = new VirtualFileSystem(workspaceFiles, "/workspace");
  editor?.setFs?.(fs);
  const explorer = createExplorerBridge({ fs, editor, rootLabel: "workspace" });


  if (editor && typeof editor.setFile === "function") {
    const originalSetFile = editor.setFile;
    editor.setFile = (fileName, content) => {
      originalSetFile(fileName, content);
      explorer.selectFile(fileName);
    };
  }

  const searchEngine = new SearchEngine(portfolioData);
  const context = createCommandContext(fs, editor, portfolioData, searchEngine, commits);
  const searchPanel = initSearchPanel(context);


  context.reloadData = async () => {
    try {
      context.terminal?.printSystemLine?.(t("reload.start"));
      const next = await loadPortfolioData({ lang: getLang(), fetchOptions: { cache: "no-store" } });
      context.profile = next.profile;
      context.skills = next.skills;
      context.experience = next.experience;
      context.projects = next.projects;
      context.learning = next.learning;
      searchEngine.data = next;
      searchPanel?.searchNow?.();
      context.terminal?.appendLine?.(t("reload.done"), "line-success");
    } catch (_e) {
      context.terminal?.printError?.("reload failed");
    }
  };

  const commands = {
    ...createCoreCommands(context),
    ...createDevCommands(context),
  };

  const autocomplete = new Autocomplete({
    getCommands: () => Object.keys(commands).sort(),
    getFiles: () => fs.listFiles(),
  });

  boot.setStage(92, "Attaching interactive shell");
  const terminal = new Terminal({
    prompt: "dev@portfolio:~$",
    commands,
    autocomplete,
    t,
    welcomeMessage: t("terminal.welcome"),
  });
  context.terminal = terminal;

  onLangChange(async (lang) => {
    try {
      const prevLang = currentWorkspaceLang;
      const [nextWs, nextData] = await Promise.all([
        loadWorkspaceFiles("./workspace", lang),
        loadPortfolioData({ lang, fetchOptions: { cache: "no-store" } }),
      ]);

      fs = new VirtualFileSystem(nextWs, "/workspace");
      context.fs = fs;
      context.currentPath = fs.getPath();
      context.workspaceFiles = fs.listFiles();
      editor?.setFs?.(fs);
      explorer?.setFs?.(fs);

      context.profile = nextData.profile;
      context.skills = nextData.skills;
      context.experience = nextData.experience;
      context.projects = nextData.projects;
      context.learning = nextData.learning;
      searchEngine.data = nextData;
      searchPanel?.searchNow?.();

      const prevActive = editor?.getActiveTab?.();
      if (prevActive) {
        const canonical = toDefaultName(prevActive, prevLang);
        const nextName = fromDefaultName(canonical, lang);
        if (nextName && nextName !== prevActive) {
          editor?.renameTab?.(prevActive, nextName);
          explorer?.selectFile?.(nextName);
        }
        const activeNow = editor?.getActiveTab?.() || nextName || prevActive;
        const content = activeNow ? fs.readFile(activeNow) : null;
        if (content !== null && content !== undefined) {
          editor?.setFile?.(activeNow, content);
          explorer?.selectFile?.(activeNow);
        }
      }

      currentWorkspaceLang = (lang === "es") ? "es" : "en";
      if (window.devPortfolio) {
        window.devPortfolio.fs = fs;
      }
    } catch (_e) {

    }
  });




  requestAnimationFrame(() => {
    const input = document.getElementById("terminal-input");
    if (!input) return;
    if (document.activeElement !== input) return;
    if (window.location.hash === "#terminal-input") return;
    input.blur();
  });


  window.devPortfolio = {
    terminal,
    commands,
    context,
    fs,
    editor,
    explorer,
    searchPanel,
    mobileBar,
    searchEngine,
    autocomplete,
  };

  boot.finish();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bootstrap().catch((_error) => {
      document.body?.setAttribute("data-app-ready", "true");
    });
  });
} else {
  bootstrap().catch((_error) => {
    document.body?.setAttribute("data-app-ready", "true");
  });
}
