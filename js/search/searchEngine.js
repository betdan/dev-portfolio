
function buildDataPaths(lang) {
  const l = (lang === "es") ? "es" : "en";
  const filesByLang = {
    en: {
      profile: ["./data/en/profile.json"],
      skills: ["./data/en/skills.json"],
      experience: ["./data/en/experience.json"],
      projects: ["./data/en/projects.json"],
      learning: ["./data/en/learning.json"],
    },
    es: {
      profile: ["./data/es/perfil.json", "./data/es/profile.json"],
      skills: ["./data/es/habilidades.json", "./data/es/skills.json"],
      experience: ["./data/es/experiencia.json", "./data/es/experience.json"],
      projects: ["./data/es/proyectos.json", "./data/es/projectos.json", "./data/es/projects.json"],
      learning: ["./data/es/learning.json", "./data/es/aprendizaje.json"],
    },
  };

  const entry = filesByLang[l] || filesByLang.en;
  return {
    ...entry,
    legacy: {
      profile: "./data/profile.json",
      skills: "./data/skills.json",
      experience: "./data/experience.json",
      projects: "./data/projects.json",
      learning: "./data/learning.json",
    },
  };
}

const FALLBACK_DATA = {
  profile: {
    name: "Daniel Betancourt",
    role: "Backend Engineer & Software Consultant",
    tagline: "Designing secure, scalable APIs and cloud-native services.",
    contact: {
      email: "daniel@example.com",
      linkedin: "linkedin.com/in/daniel-betancourt",
      github: "github.com/danielbetancourt",
    },
  },
  skills: [
    "C#",
    ".NET",
    "Java",
    "Python",
    "REST",
    "SOAP",
    "gRPC",
    "RabbitMQ (AMQP)",
    "WebSockets",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL Server",
    "PostgreSQL",
    "Oracle",
    "NoSQL",
    "Microservices",
    "Distributed Systems",
  ],
  experience: [],
  projects: [],
  learning: ["AI", "AWS", "Distributed Systems"],
};

function normalizeProjectsData(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const englishYears = value.GetProjectsResponse?.Years;
  if (Array.isArray(englishYears)) {
    return englishYears.flatMap((yearEntry) =>
      (yearEntry?.projects || []).map((project) => ({
        year: yearEntry?.year || "",
        name: project?.name || "",
        summary: project?.summary || "",
        highlights: Array.isArray(project?.highlights) ? project.highlights : [],
      }))
    );
  }

  const spanishYears = value.ObtenerProyectosRespuesta?.Anios;
  if (Array.isArray(spanishYears)) {
    return spanishYears.flatMap((yearEntry) =>
      (yearEntry?.proyectos || []).map((project) => ({
        year: yearEntry?.anio || "",
        name: project?.nombre || "",
        summary: project?.resumen || "",
        highlights: Array.isArray(project?.aspectosDestacados) ? project.aspectosDestacados : [],
      }))
    );
  }

  return [];
}

async function fetchJson(path, fallbackValue, fetchOptions) {
  try {
    const response = await fetch(path, fetchOptions);
    if (!response.ok) return fallbackValue;
    return await response.json();
  } catch (_error) {
    return fallbackValue;
  }
}

export async function loadPortfolioData(options = {}) {
  const fetchOptions = options.fetchOptions || { cache: "no-store" };
  const paths = buildDataPaths(options.lang);

  async function fetchFirstAvailable(primaryPaths, fallback) {
    const list = Array.isArray(primaryPaths) ? primaryPaths : [primaryPaths];
    for (const p of list) {
      const v = await fetchJson(p, null, fetchOptions);
      if (v !== null) return v;
    }
    return fallback;
  }

  async function fetchWithLegacy(primaryPaths, legacyKey, fallback) {
    const v1 = await fetchFirstAvailable(primaryPaths, null);
    if (v1 !== null) return v1;
    return await fetchJson(paths.legacy[legacyKey], fallback, fetchOptions);
  }

  const [profile, skills, experience, projects, learning] = await Promise.all([
    fetchWithLegacy(paths.profile, "profile", FALLBACK_DATA.profile),
    fetchWithLegacy(paths.skills, "skills", FALLBACK_DATA.skills),
    fetchWithLegacy(paths.experience, "experience", FALLBACK_DATA.experience),
    fetchWithLegacy(paths.projects, "projects", FALLBACK_DATA.projects),
    fetchWithLegacy(paths.learning, "learning", FALLBACK_DATA.learning),
  ]);

  return {
    profile,
    skills: Array.isArray(skills) ? skills : [],
    experience: Array.isArray(experience) ? experience : [],
    projects: normalizeProjectsData(projects),
    learning: Array.isArray(learning) ? learning : [],
  };
}

export class SearchEngine {
  constructor(data) {
    this.data = data;
  }

  search(term) {
    const query = String(term || "").trim().toLowerCase();
    if (!query) return [];

    const matches = [];
    const { skills, projects, learning, experience, profile } = this.data;
    const seen = new Set();

    const pushMatch = (label, value) => {
      const text = `${label}: ${String(value || "").trim()}`;
      if (!String(value || "").trim() || seen.has(text)) return;
      seen.add(text);
      matches.push(text);
    };

    const pushIfMatch = (label, value) => {
      const text = String(value || "").trim();
      if (text.toLowerCase().includes(query)) {
        pushMatch(label, text);
      }
    };

    (skills || []).forEach((skill) => {
      pushIfMatch("skills", skill);
    });

    (projects || []).forEach((project) => {
      pushIfMatch("projects.year", project.year);
      pushIfMatch("projects.name", project.name);
      pushIfMatch("projects.summary", project.summary);
      (project.highlights || []).forEach((item) => pushIfMatch("projects.highlights", item));
      (project.stack || []).forEach((item) => pushIfMatch("projects.stack", item));
    });

    (learning || []).forEach((topic) => {
      pushIfMatch("learning", topic);
    });

    (experience || []).forEach((item) => {
      pushIfMatch("experience.period", item.period);
      pushIfMatch("experience.role", item.role);
      pushIfMatch("experience.company", item.company);
      pushIfMatch("experience.location", item.location);
      (item.highlights || []).forEach((highlight) => pushIfMatch("experience.highlights", highlight));
    });

    pushIfMatch("profile.name", profile?.name);
    pushIfMatch("profile.role", profile?.role);
    pushIfMatch("profile.tagline", profile?.tagline);
    pushIfMatch("profile.summary", profile?.summary);
    pushIfMatch("profile.email", profile?.contact?.email);
    pushIfMatch("profile.phone", profile?.contact?.phone);
    pushIfMatch("profile.linkedin", profile?.contact?.linkedin);
    pushIfMatch("profile.github", profile?.contact?.github);

    return matches;
  }
}
