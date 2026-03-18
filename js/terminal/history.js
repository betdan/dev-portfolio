
export class CommandHistory {
  constructor(limit = 200) {
    this.limit = limit;
    this.items = [];
    this.cursor = 0;
  }

  add(command) {
    const value = String(command || "").trim();
    if (!value) return;

    const last = this.items[this.items.length - 1];
    if (last !== value) {
      this.items.push(value);
      if (this.items.length > this.limit) {
        this.items.shift();
      }
    }

    this.resetCursor();
  }

  previous() {
    if (this.items.length === 0) return "";
    this.cursor = Math.max(0, this.cursor - 1);
    return this.items[this.cursor] || "";
  }

  next() {
    if (this.items.length === 0) return "";

    this.cursor = Math.min(this.items.length, this.cursor + 1);
    if (this.cursor === this.items.length) return "";
    return this.items[this.cursor] || "";
  }

  resetCursor() {
    this.cursor = this.items.length;
  }
}
