
export class VirtualFileSystem {
  constructor(initialFiles = {}, root = "/workspace") {
    this.root = root;
    this.files = new Map();
    this.load(initialFiles);
  }

  load(fileMap) {
    Object.entries(fileMap || {}).forEach(([name, content]) => {
      this.files.set(name, String(content ?? ""));
    });
  }

  listFiles() {
    return [...this.files.keys()].sort();
  }

  hasFile(fileName) {
    return this.files.has(fileName);
  }

  readFile(fileName) {
    if (!this.hasFile(fileName)) return null;
    return this.files.get(fileName);
  }

  getPath(fileName = "") {
    const normalized = String(fileName || "").trim();
    if (!normalized) return this.root;
    return `${this.root}/${normalized}`;
  }
}
