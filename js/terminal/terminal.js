import { CommandHistory } from "./history.js";
import { parseInput } from "./parser.js";
import { sanitizeInput, sanitizeOutput } from "../security/sanitizer.js";

export class Terminal {
  constructor(options = {}) {
    this.prompt = options.prompt || "dev@portfolio:~$";
    this.commands = options.commands || {};
    this.autocomplete = options.autocomplete || null;
    this.t = typeof options.t === "function" ? options.t : ((key) => key);
    this.outputEl = document.getElementById("terminal-output");
    this.formEl = document.getElementById("terminal-form");
    this.inputEl = document.getElementById("terminal-input");
    this.history = new CommandHistory();
    this.runningEffects = new Map();

    if (!this.outputEl || !this.formEl || !this.inputEl) {
      throw new Error("Terminal elements not found in DOM.");
    }

    this.bindEvents();


    const welcome = options.welcomeMessage || this.t("terminal.welcome");
    this.printSystemLine(welcome);
  }

  bindEvents() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const raw = sanitizeInput(this.inputEl.value);
      this.execute(raw);
      this.inputEl.value = "";
      this.history.resetCursor();
    });



    this.outputEl.addEventListener("contextmenu", (event) => {
      const sel = window.getSelection ? window.getSelection() : null;
      if (!sel) return;
      if (sel.isCollapsed) return;
      if (sel.rangeCount < 1) return;

      const range = sel.getRangeAt(0);
      const common = range.commonAncestorContainer;
      const commonEl =
        common && common.nodeType === Node.ELEMENT_NODE ? common : common?.parentElement;
      if (!commonEl) return;
      if (!this.outputEl.contains(commonEl)) return;

      const selectedRaw = String(sel.toString() || "");
      const normalized = selectedRaw.replace(/\s+/g, " ").trim();
      if (!normalized) return;

      event.preventDefault();

      const safe = sanitizeInput(normalized);
      const current = sanitizeInput(this.inputEl.value || "");
      this.inputEl.value = current ? `${current} ${safe}` : safe;
      this.inputEl.focus();


      try {
        const end = this.inputEl.value.length;
        this.inputEl.setSelectionRange(end, end);
      } catch (_e) {

      }
    });

    this.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        if (!this.autocomplete) return;
        event.preventDefault();
        const result = this.autocomplete.suggest(sanitizeInput(this.inputEl.value));
        if (typeof result.completedLine === "string") {
          this.inputEl.value = sanitizeInput(result.completedLine);
        }
        if (Array.isArray(result.suggestions) && result.suggestions.length > 0) {
          this.printLines(result.suggestions);
        }
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.inputEl.value = this.history.previous();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.inputEl.value = this.history.next();
      }
    });
  }

  execute(rawInput) {
    this.stopEffect("matrix");
    const parsed = parseInput(rawInput);
    if (!parsed.raw) return;

    this.printCommand(parsed.raw);
    this.history.add(parsed.raw);

    const handler = this.commands[parsed.command];
    if (!handler) {
      this.printError(this.t("terminal.commandNotFound", { cmd: parsed.command }));
      return;
    }

    const result = handler(parsed.command, parsed.args, parsed.raw) || {};
    if (result.clear) this.clear();
    if (Array.isArray(result.systemLines) && result.systemLines.length > 0) {
      result.systemLines.forEach((line) => this.printSystemLine(String(line)));
    }
    if (Array.isArray(result.successLines) && result.successLines.length > 0) {
      result.successLines.forEach((line) => this.appendLine(String(line), "line-success"));
    }
    if (Array.isArray(result.lines) && result.lines.length > 0) {
      this.printLines(result.lines);
    }
    if (result.error) this.printError(String(result.error));
  }

  clear() {

    for (const [name, stopFn] of this.runningEffects.entries()) {
      try { stopFn(); } catch (_e) {  }
      this.runningEffects.delete(name);
    }
    this.outputEl.textContent = "";
  }

  printCommand(command) {
    this.appendLine(`${this.prompt} ${command}`, "line-command");
  }

  printSystemLine(text) {
    this.appendLine(text, "line-system");
  }

  printError(text) {
    this.appendLine(text, "line-error");
  }

  printLines(lines) {
    lines.forEach((line) => this.appendLine(line, "line-output"));
  }

  appendLine(text, className = "") {
    const line = document.createElement("div");
    line.className = `terminal-line ${className}`.trim();
    line.textContent = sanitizeOutput(text);
    this.outputEl.appendChild(line);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  registerEffect(name, stopFn) {
    if (this.runningEffects.has(name)) {
      const previousStop = this.runningEffects.get(name);
      previousStop();
    }
    this.runningEffects.set(name, stopFn);
  }

  stopEffect(name) {
    if (!this.runningEffects.has(name)) return;
    const stopFn = this.runningEffects.get(name);
    stopFn();
    this.runningEffects.delete(name);
  }

  startMatrixEffect(durationMs = 3500) {
    this.stopEffect("matrix");

    let active = true;
    const chars = "01#@$%&*<>[]{}";
    const interval = setInterval(() => {
      if (!active) return;
      const line = Array.from({ length: 48 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
      this.appendLine(line, "line-matrix");
    }, 85);

    const timeout = setTimeout(() => {
      this.stopEffect("matrix");
      this.appendLine(this.t("terminal.matrixDone"), "line-system");
    }, durationMs);

    const stop = () => {
      active = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };

    this.registerEffect("matrix", stop);
  }

  startSnakeGame(options = {}) {
    this.stopEffect("snake");

    const wrapper = document.createElement("div");
    wrapper.className = "terminal-effect terminal-snake";

    const header = document.createElement("div");
    header.className = "terminal-snake-header";

    const title = document.createElement("div");
    title.className = "terminal-snake-title";
    title.textContent = String(options.title || "Snake (hacker mode)");

    const meta = document.createElement("div");
    meta.className = "terminal-snake-meta";
    meta.textContent = "Score: 0";

    header.appendChild(title);
    header.appendChild(meta);

    const help = document.createElement("div");
    help.className = "terminal-snake-help";
    help.textContent = String(
      options.help ||
        "Controls: Arrow keys / WASD. Press Esc to quit. (Tip: type 'game stop' too.)"
    );

    const canvas = document.createElement("canvas");
    canvas.className = "terminal-snake-canvas";
    canvas.setAttribute("aria-label", "Snake game canvas");

    wrapper.appendChild(header);
    wrapper.appendChild(help);
    wrapper.appendChild(canvas);
    this.outputEl.appendChild(wrapper);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      this.appendLine("Canvas not supported.", "line-error");
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const bg = (rootStyles.getPropertyValue("--term-screen-bg") || "#0b1020").trim();
    const grid = (rootStyles.getPropertyValue("--term-screen-border") || "rgba(255,255,255,0.12)").trim();
    const snakeColor = (rootStyles.getPropertyValue("--term-snake-snake") || rootStyles.getPropertyValue("--term-screen-output") || "#35d07f").trim();
    const foodColor = (rootStyles.getPropertyValue("--term-snake-food") || "#ff5c70").trim();
    const textColor = (rootStyles.getPropertyValue("--term-screen-fg") || "#e6edf3").trim();

    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

    let cols = 28;
    let rows = 16;
    let cell = 14;
    let score = 0;
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));

    const resize = () => {
      const w = Math.max(240, wrapper.clientWidth || 320);

      const requestedCols =
        Number.isFinite(options.cols) && Number(options.cols) > 0 ? Number(options.cols) : null;
      const requestedRows =
        Number.isFinite(options.rows) && Number(options.rows) > 0 ? Number(options.rows) : null;

      if (requestedCols) {

        cols = clamp(Math.floor(requestedCols), 10, 60);
        cell = Math.floor(w / cols);
        cell = clamp(cell, 10, 18);
        rows = requestedRows
          ? clamp(Math.floor(requestedRows), 8, 36)
          : clamp(Math.round(cols * 0.58), 12, 22);
      } else {
        cols = 28;
        cell = Math.floor(w / cols);
        while (cols > 16 && cell < 10) {
          cols -= 2;
          cell = Math.floor(w / cols);
        }
        cell = clamp(cell, 10, 18);
        rows = clamp(Math.round(cols * 0.58), 12, 22);
      }

      canvas.width = Math.floor(cols * cell * dpr);
      canvas.height = Math.floor(rows * cell * dpr);
      canvas.style.width = `${cols * cell}px`;
      canvas.style.height = `${rows * cell}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateMeta = () => {
      meta.textContent = `Score: ${score} | ${cols}x${rows}`;
    };

    resize();
    updateMeta();

    const randCell = () => ({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    });

    const same = (a, b) => a && b && a.x === b.x && a.y === b.y;

    const snake = [];
    const start = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
    for (let i = 0; i < 4; i++) snake.push({ x: start.x - i, y: start.y });

    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = randCell();
    let alive = true;

    const isOnSnake = (p) => snake.some((s) => same(s, p));
    while (isOnSnake(food)) food = randCell();

    const setScore = (v) => {
      score = v;
      updateMeta();
    };

    const setDirection = (dx, dy) => {
      if (!alive) return;

      if (dx === -dir.x && dy === -dir.y) return;
      nextDir = { x: dx, y: dy };
    };

    const draw = () => {
      ctx.clearRect(0, 0, cols * cell, rows * cell);


      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cols * cell, rows * cell);


      ctx.strokeStyle = grid;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      for (let x = 1; x < cols; x++) {
        ctx.moveTo(x * cell + 0.5, 0);
        ctx.lineTo(x * cell + 0.5, rows * cell);
      }
      for (let y = 1; y < rows; y++) {
        ctx.moveTo(0, y * cell + 0.5);
        ctx.lineTo(cols * cell, y * cell + 0.5);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;


      ctx.fillStyle = foodColor;
      ctx.fillRect(food.x * cell + 2, food.y * cell + 2, cell - 4, cell - 4);


      ctx.fillStyle = snakeColor;
      snake.forEach((p, idx) => {
        const pad = idx === 0 ? 1 : 2;
        ctx.fillRect(p.x * cell + pad, p.y * cell + pad, cell - pad * 2, cell - pad * 2);
      });

      if (!alive) {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, cols * cell, rows * cell);
        ctx.fillStyle = textColor;
        ctx.font = "600 14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", (cols * cell) / 2, (rows * cell) / 2 - 10);
        ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.fillText(`Score: ${score}`, (cols * cell) / 2, (rows * cell) / 2 + 10);
      }
    };

    const step = () => {
      if (!alive) return;

      dir = nextDir;
      const head = snake[0];
      const next = { x: head.x + dir.x, y: head.y + dir.y };


      if (next.x < 0 || next.x >= cols || next.y < 0 || next.y >= rows) {
        endGame();
        return;
      }


      const tail = snake[snake.length - 1];
      const hitsBody = snake.some((p, idx) => idx !== snake.length - 1 && same(p, next));
      if (hitsBody) {
        endGame();
        return;
      }

      snake.unshift(next);

      if (same(next, food)) {
        setScore(score + 1);
        food = randCell();
        while (isOnSnake(food)) food = randCell();
      } else {

        snake.pop();

        if (same(next, tail)) {

        }
      }

      draw();
    };

    let tickMs = clamp(Number(options.tickMs || 105), 65, 160);
    let interval = setInterval(step, tickMs);
    let gameOverAnnounced = false;

    const endGame = () => {
      if (!alive) return;
      alive = false;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      draw();
      if (!gameOverAnnounced) {
        gameOverAnnounced = true;
        this.appendLine(this.t("terminal.snake.gameOver", { score }), "line-system");
      }
    };
    const onResize = () => {
      resize();
      updateMeta();
      draw();
    };

    const onKey = (e) => {
      const k = (e.key || "").toLowerCase();
      if (k === "escape") {
        e.preventDefault();
        this.stopEffect("snake");
        this.appendLine(`game stopped. score=${score}`, "line-system");
        return;
      }


      if (!alive) return;

      const isArrow =
        e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight";
      const isWASD = k === "w" || k === "a" || k === "s" || k === "d";
      if (!isArrow && !isWASD) return;


      e.preventDefault();

      if (e.key === "ArrowUp" || k === "w") return setDirection(0, -1);
      if (e.key === "ArrowDown" || k === "s") return setDirection(0, 1);
      if (e.key === "ArrowLeft" || k === "a") return setDirection(-1, 0);
      if (e.key === "ArrowRight" || k === "d") return setDirection(1, 0);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey, { capture: true });

    const stop = () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey, { capture: true });
      wrapper.remove();
    };

    this.registerEffect("snake", stop);
    draw();
  }

  focus() {
    this.inputEl.focus();
  }
}
