
export function createCoreCommands(context) {
  const t = typeof context.t === "function" ? context.t : ((key) => key);

  function buildResumeMarkdown() {
    const profile = context.profile || {};
    const skills = Array.isArray(context.skills) ? context.skills : [];
    const experience = Array.isArray(context.experience) ? context.experience : [];
    const projects = Array.isArray(context.projects) ? context.projects : [];

    const lines = [];
    lines.push(`# ${profile.name || "Developer"}`);
    lines.push("");
    lines.push(`${profile.role || ""}`.trim());
    if (profile.tagline) lines.push(profile.tagline);
    lines.push("");

    lines.push("## Contact");
    if (profile.contact?.email) lines.push(`- Email: ${profile.contact.email}`);
    if (profile.contact?.linkedin) lines.push(`- LinkedIn: ${profile.contact.linkedin}`);
    if (profile.contact?.github) lines.push(`- GitHub: ${profile.contact.github}`);
    lines.push("");

    if (skills.length > 0) {
      lines.push("## Skills");
      lines.push(skills.map((s) => `- ${s}`).join("\n"));
      lines.push("");
    }

    if (experience.length > 0) {
      lines.push("## Experience");
      experience.forEach((e) => {
        lines.push(`- ${e.period || ""} | ${e.role || ""} @ ${e.company || ""}`.trim());
      });
      lines.push("");
    }

    if (projects.length > 0) {
      lines.push("## Projects");
      projects.forEach((p) => {
        lines.push(`- ${p.name || ""}: ${p.summary || ""}`.trim());
      });
      lines.push("");
    }

    return lines.join("\n");
  }

  const requireFileArg = (args) => {
    const fileName = (args || [])[0];
    if (!fileName) {
      return { error: t("terminal.usage.fileOps") };
    }
    return { fileName };
  };

  const missingFile = (fileName) => ({ error: t("terminal.fileNotFound", { file: fileName }) });

  return {
    help: () => ({
      lines: [
        t("cmd.help.title"),
        "  help",
        "  ls",
        t("cmd.help.tree"),
        "  pwd",
        "  clear",
        "  cat <file>",
        "  open <file>",
        "  run <file>",
        "  git log",
        t("cmd.help.gitExtra"),
        "  log",
        t("cmd.help.download"),
        t("cmd.help.bench"),
        t("cmd.help.lang"),
        "  whoami",
        "  skills",
        "  experience",
        "  projects",
        "  contact",
        "  search <term>",
      ],
    }),

    ls: () => ({
      lines: [...context.workspaceFiles],
    }),

    tree: () => {
      const files = [...context.workspaceFiles];
      const lines = ["workspace/"];
      files.forEach((f) => lines.push(`  ${f}`));
      return { lines };
    },

    pwd: () => ({
      lines: [context.currentPath],
    }),

    clear: () => ({
      clear: true,
      systemLines: [t("terminal.welcome")],
      lines: [],
    }),

    cat: (_command, args) => {
      const check = requireFileArg(args);
      if (check.error) return { lines: [check.error] };

      const content = context.fs.readFile(check.fileName);
      if (content === null) return missingFile(check.fileName);
      return { lines: content.split("\n") };
    },

    open: (_command, args) => {
      const check = requireFileArg(args);
      if (check.error) return { lines: [check.error] };

      const content = context.fs.readFile(check.fileName);
      if (content === null) return missingFile(check.fileName);

      if (context.editor) {
        context.editor.setFile(check.fileName, content);
      }

      return { lines: [t("terminal.opened", { path: context.fs.getPath(check.fileName) })] };
    },

    run: (_command, args) => {
      const check = requireFileArg(args);
      if (check.error) return { lines: [check.error] };

      const fileName = check.fileName;
      const content = context.fs.readFile(fileName);
      if (content === null) return missingFile(fileName);

      if (fileName.endsWith(".sh")) {
        const outputs = content
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("echo "))
          .map((line) =>
            line
              .replace(/^echo\s+/, "")
              .replace(/^["']|["']$/g, "")
          );

        return { lines: outputs.length > 0 ? outputs : [t("terminal.scriptExecuted")] };
      }

      if (fileName.endsWith(".py")) {
        return { lines: String(t("terminal.pySim") || "").split(/\r?\n/) };
      }

      if (fileName.endsWith(".cs")) {
        return { lines: String(t("terminal.csSim") || "").split(/\r?\n/) };
      }

      if (fileName.endsWith(".java")) {
        const pickJavaTypeName = (src) => {
          const s = String(src || "");
          const rxPublic = /\bpublic\s+(?:final\s+|abstract\s+)?(?:class|interface|record|enum)\s+([A-Za-z_]\w*)\b/m;
          const rxAny = /\b(?:class|interface|record|enum)\s+([A-Za-z_]\w*)\b/m;
          return (s.match(rxPublic)?.[1] || s.match(rxAny)?.[1] || "").trim() || null;
        };

        const typeName = pickJavaTypeName(content);
        return {
          lines: String(t("terminal.javaSim", { file: fileName, class: typeName || "Main" }) || "")
            .split(/\r?\n/),
        };
      }

      return { lines: [t("terminal.execNotSupported", { file: fileName })] };
    },

    git: (_command, args) => {
      const action = (args || [])[0]?.toLowerCase();
      const commits = Array.isArray(context.commits) ? context.commits : [];

      if (!action || action === "log") {
        if (commits.length === 0) return { lines: [t("terminal.noCommits")] };
        const lines = [];
        commits.forEach((entry) => {
          lines.push(`commit ${entry.commit}`);
          lines.push(`${entry.message}`);
          lines.push("");
        });
        return { lines };
      }

      if (action === "status") {
        return { lines: [t("git.status.clean")] };
      }

      if (action === "show") {
        const commitId = (args || [])[1];
        if (!commitId) return { lines: [t("git.show.usage")] };
        const found = commits.find((c) => String(c.commit) === String(commitId));
        if (!found) return { lines: [t("git.show.notFound", { commit: commitId })] };
        return {
          lines: [
            `commit ${found.commit}`,
            `${found.message}`,
            "",
          ],
        };
      }

      if (action === "diff") {
        return { lines: [t("git.diff.noChanges")] };
      }


      return { lines: [t("terminal.gitUsage")] };
    },

    log: () => {
      if (!Array.isArray(context.commits) || context.commits.length === 0) {
        return { lines: [t("terminal.noCommits")] };
      }

      const lines = [];
      context.commits.forEach((entry) => {
        lines.push(`commit ${entry.commit}`);
        lines.push(`${entry.message}`);
        lines.push("");
      });

      return { lines };
    },

    lang: (_command, args) => {
      const requested = (args || [])[0]?.toLowerCase();
      const next = requested === "es" ? "es" : requested === "en" ? "en" : null;
      if (!next) return { lines: ["Usage: lang <en|es>"] };
      if (typeof context.setLang === "function") context.setLang(next);
      return {
        lines: [t("lang.set", { lang: next })],
        systemLines: [t("reload.start")],
      };
    },

    download: (_command, args) => {
      const what = (args || [])[0]?.toLowerCase();
      if (what !== "resume") return { lines: [t("download.usage")] };

      const md = buildResumeMarkdown();
      const name = "resume.md";

      try {
        const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2500);
      } catch (_e) {

      }

      return { successLines: [t("download.ok", { name })], lines: [] };
    },

    bench: () => {
      const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
      const results = [];

      const t0 = now();
      const files = context.fs.listFiles();
      const t1 = now();
      results.push(t("bench.ms", { name: "fs.listFiles()", ms: (t1 - t0).toFixed(2) }));

      const t2 = now();
      let bytes = 0;
      files.forEach((f) => {
        const c = context.fs.readFile(f) || "";
        bytes += c.length;
      });
      const t3 = now();
      results.push(t("bench.ms", { name: "fs.readFile(all)", ms: (t3 - t2).toFixed(2) }));
      results.push(`bytes: ${bytes}`);

      const t4 = now();
      const q1 = context.searchEngine.search("aws");
      const q2 = context.searchEngine.search("c#");
      const q3 = context.searchEngine.search("micro");
      const t5 = now();
      results.push(t("bench.ms", { name: "searchEngine.search(x3)", ms: (t5 - t4).toFixed(2) }));
      results.push(`hits: ${q1.length + q2.length + q3.length}`);

      return { successLines: [t("bench.title")], lines: results };
    },

    reload: () => {
      if (typeof context.reloadData === "function") {

        context.reloadData();
        return { successLines: [t("reload.queued")], lines: [] };
      }
      return { lines: ["reload is not available"] };
    },
  };
}
