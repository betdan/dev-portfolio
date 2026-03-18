
export class Autocomplete {
  constructor(options = {}) {
    this.getCommands = options.getCommands || (() => []);
    this.getFiles = options.getFiles || (() => []);
    this.fileArgCommands = new Set(["cat", "open", "run"]);
    this.optionArgCommands = new Map([
      ["lang", ["en", "es"]],
      ["download", ["resume"]],
      ["git", ["log", "status", "show", "diff"]],
    ]);
  }

  suggest(rawInput) {
    const input = String(rawInput ?? "");
    const trimmedLeft = input.trimStart();
    const hasTrailingSpace = /\s$/.test(input);
    const tokens = trimmedLeft.split(/\s+/).filter(Boolean);

    if (tokens.length === 0) {
      return { completedLine: input, suggestions: [] };
    }

    const command = tokens[0].toLowerCase();
    if (tokens.length === 1 && !hasTrailingSpace) {
      return this.completeCommand(tokens[0], input, trimmedLeft);
    }

    if (this.fileArgCommands.has(command)) {
      const lastToken = hasTrailingSpace ? "" : tokens[tokens.length - 1];
      return this.completeFile(lastToken, command, tokens, input, hasTrailingSpace);
    }

    if (this.optionArgCommands.has(command)) {
      const lastToken = hasTrailingSpace ? "" : tokens[tokens.length - 1];
      return this.completeOption(lastToken, command, tokens, input, hasTrailingSpace);
    }

    return { completedLine: input, suggestions: [] };
  }

  completeCommand(partial, originalInput, trimmedLeftInput) {
    const commands = this.getCommands();
    const matches = commands.filter((cmd) => cmd.startsWith(partial.toLowerCase()));
    if (matches.length === 0) return { completedLine: originalInput, suggestions: [] };

    if (matches.length === 1) {
      const completed = matches[0];
      const completedLine = originalInput.replace(trimmedLeftInput, completed);
      return { completedLine, suggestions: [] };
    }

    return { completedLine: originalInput, suggestions: matches };
  }

  completeFile(lastToken, command, tokens, originalInput, hasTrailingSpace) {
    const files = this.getFiles();
    const matches = files.filter((file) =>
      file.toLowerCase().startsWith(lastToken.toLowerCase())
    );
    if (matches.length === 0) return { completedLine: originalInput, suggestions: [] };

    if (matches.length === 1) {
      const completedFile = matches[0];
      const base = tokens.slice(0, hasTrailingSpace ? tokens.length : -1);
      const completedLine = `${base.join(" ")} ${completedFile}`.trim();
      return { completedLine, suggestions: [] };
    }

    return {
      completedLine: `${command} ${lastToken}`.trim(),
      suggestions: matches,
    };
  }

  completeOption(lastToken, command, tokens, originalInput, hasTrailingSpace) {
    const options = this.optionArgCommands.get(command) || [];
    const matches = options.filter((opt) => opt.toLowerCase().startsWith(lastToken.toLowerCase()));
    if (matches.length === 0) return { completedLine: originalInput, suggestions: [] };

    if (matches.length === 1) {
      const completedOpt = matches[0];
      const base = tokens.slice(0, hasTrailingSpace ? tokens.length : -1);
      const completedLine = `${base.join(" ")} ${completedOpt}`.trim();
      return { completedLine, suggestions: [] };
    }

    return {
      completedLine: `${command} ${lastToken}`.trim(),
      suggestions: matches,
    };
  }
}
