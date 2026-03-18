
export function createDevCommands(context) {
  const t = typeof context.t === "function" ? context.t : ((key) => key);
  const profile = () => context.profile || {};
  const contact = () => profile().contact || {};

  const gameHandler = (_command, args) => {
    const a0 = (args || [])[0];
    const action = (a0 || "").toLowerCase();

    if (action === "help" || action === "--help" || action === "-h") {
      return { lines: [t("terminal.game.usage")] };
    }

    if (action === "stop" || action === "off" || action === "quit" || action === "exit") {
      if (context.terminal && typeof context.terminal.stopEffect === "function") {
        context.terminal.stopEffect("snake");
      }
      return { lines: [t("terminal.game.stopped")] };
    }

    if (!context.terminal || typeof context.terminal.startSnakeGame !== "function") {
      return { lines: [t("terminal.game.unavailable")] };
    }






    let cols = null;
    let rows = null;
    if (typeof a0 === "string") {
      const m = a0.trim().toLowerCase().match(/^(\d{1,3})x(\d{1,3})$/);
      if (m) {
        cols = Number(m[1]);
        rows = Number(m[2]);
      } else if (action === "tiny") {
        cols = 10;
        rows = 4;
      } else if (action === "small") {
        cols = 12;
        rows = 6;
      } else if (action === "big") {
        cols = 18;
        rows = 10;
      }
    }

    context.terminal.startSnakeGame({
      title: t("terminal.snake.title"),
      help: t("terminal.snake.help"),
      cols,
      rows,
    });
    return { lines: [t("terminal.game.started")] };
  };

  return {
    whoami: () => ({
      lines: [
        `${profile().name || ""}`,
        `${profile().role || ""}`,
        `${profile().tagline || ""}`,
      ],
    }),

    skills: () => ({
      lines: context.skills.map((skill) => `- ${skill}`),
    }),

    experience: () => ({
      lines: context.experience.map(
        (item) => `${item.period} | ${item.role} @ ${item.company}`
      ),
    }),

    projects: () => ({
      lines: context.projects.map(
        (project) => `${project.name} - ${project.summary}`
      ),
    }),

    contact: () => ({
      lines: [
        `${t("profile.email")}: ${contact().email || ""}`,
        `${t("profile.linkedin")}: ${contact().linkedin || ""}`,
        `${t("profile.github")}: ${contact().github || ""}`,
      ],
    }),

    search: (_command, args) => {
      const rawArgs = Array.isArray(args) ? args : [];
      const termRaw = rawArgs.join(" ").trim();
      const term = termRaw.toLowerCase();
      if (!termRaw) {
        return { lines: [t("terminal.searchUsage")] };
      }

      const shortcuts = {
        profile: () => ({
          lines: [
            `profile: ${profile().name || ""} - ${profile().role || ""}`,
            `${profile().tagline || ""}`,
            `${t("profile.email")}: ${contact().email || ""}`,
            `${t("profile.linkedin")}: ${contact().linkedin || ""}`,
          ],
        }),
        perfil: () => shortcuts.profile(),
        whoami: () => shortcuts.profile(),

        contact: () => ({
          lines: [
            `${t("profile.email")}: ${contact().email || ""}`,
            `${t("profile.linkedin")}: ${contact().linkedin || ""}`,
            `${t("profile.github")}: ${contact().github || ""}`,
          ],
        }),
        contacto: () => shortcuts.contact(),

        email: () => ({ lines: [`${t("profile.email")}: ${contact().email || ""}`] }),
        mail: () => shortcuts.email(),
        correo: () => shortcuts.email(),

        skills: () => ({ lines: context.skills.map((skill) => `skills: ${skill}`) }),
        habilidades: () => shortcuts.skills(),

        experience: () => ({
          lines: context.experience.map((item) => `experience: ${item.period} | ${item.role} @ ${item.company}`),
        }),
        experiencia: () => shortcuts.experience(),

        projects: () => ({
          lines: context.projects.map((project) => `projects: ${project.name} - ${project.summary}`),
        }),
        proyectos: () => shortcuts.projects(),

        learning: () => ({ lines: context.learning.map((topic) => `learning: ${topic}`) }),
        aprendizaje: () => shortcuts.learning(),
        learn: () => shortcuts.learning(),
        conocimientos: () => shortcuts.learning(),
      };

      const first = String(rawArgs[0] || "").trim().toLowerCase();
      const shortcut = shortcuts[term] || shortcuts[first];
      if (typeof shortcut === "function") return shortcut();

      const matches = context.searchEngine.search(term);

      if (matches.length === 0) {
        return { lines: [t("terminal.noResults", { term })] };
      }

      return { lines: matches };
    },

    sudo: (_command, args) => {
      const action = (args || []).join(" ").trim().toLowerCase();
      if (action === "hire-me") {
        return {
          lines: ["Access granted.", "Let's build something amazing."],
        };
      }

      return {
        lines: [t("terminal.permissionDenied")],
      };
    },

    matrix: () => {
      if (context.terminal && typeof context.terminal.startMatrixEffect === "function") {
        context.terminal.startMatrixEffect(3600);
      }

      return {
        lines: [t("terminal.matrixInit")],
      };
    },

    game: gameHandler,
    snake: gameHandler,
    "--game": gameHandler,
  };
}
