


export function createExplorerBridge(options = {}) {
  const treeEl = document.getElementById("explorer-tree");
  let fs = options.fs;
  const editor = options.editor;
  const rootLabel = options.rootLabel || "workspace";

  if (!treeEl) {
    return {
      render: () => {},
      selectFile: () => {},
    };
  }

  let activeFile = null;
  let isExpanded = true;

  function selectFile(fileName) {
    activeFile = fileName || null;
    const buttons = treeEl.querySelectorAll("button[data-file]");
    buttons.forEach((btn) => {
      const isActive = btn.dataset.file === activeFile;
      btn.classList.toggle("is-active", isActive);
      if (isActive) {
        btn.setAttribute("aria-current", "true");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
  }

  function setExpanded(next) {
    isExpanded = Boolean(next);
    const folderBtn = treeEl.querySelector("button.explorer-folder-toggle");
    if (folderBtn) folderBtn.setAttribute("aria-expanded", String(isExpanded));

    const fileLis = treeEl.querySelectorAll("li.explorer-item");
    fileLis.forEach((li) => {

      li.hidden = !isExpanded;
    });
  }

  function openFile(fileName) {
    if (!fs || !editor || !fileName) return;
    const content = fs.readFile(fileName);
    if (content === null) return;
    editor.setFile(fileName, content);
    selectFile(fileName);
  }

  function render() {
    treeEl.textContent = "";

    const folderLi = document.createElement("li");
    folderLi.className = "explorer-folder";

    const folderBtn = document.createElement("button");
    folderBtn.type = "button";
    folderBtn.className = "explorer-folder-toggle";
    folderBtn.setAttribute("aria-expanded", String(isExpanded));
    folderBtn.textContent = `${rootLabel}/`;
    folderBtn.addEventListener("click", () => setExpanded(!isExpanded));

    folderLi.appendChild(folderBtn);
    treeEl.appendChild(folderLi);

    const files = (fs && typeof fs.listFiles === "function") ? fs.listFiles() : [];
    files.forEach((fileName) => {
      const li = document.createElement("li");
      li.className = "explorer-item";
      li.hidden = !isExpanded;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "explorer-file";
      btn.dataset.file = fileName;
      btn.textContent = fileName;
      btn.addEventListener("click", () => openFile(fileName));

      li.appendChild(btn);
      treeEl.appendChild(li);
    });

    if (activeFile) selectFile(activeFile);
  }


  render();

  return {
    render,
    selectFile,
    openFile,
    setExpanded,
    setFs: (nextFs) => {
      fs = nextFs;
      render();
    },
  };
}
