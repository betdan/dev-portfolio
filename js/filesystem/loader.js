
const WORKSPACE_FILES = [
  "about.py",
  "learn.cs",
  "skills.json",
  "experience.log",
  "projects.md",
  "contact.sh",
];

const FALLBACK_CONTENT = {
  "about.py": 'class Developer:\n    name = "Daniel Betancourt"\n',
  "learn.cs": "public class Learning {}\n",
  "skills.json": '["C#", ".NET", "AWS"]\n',
  "experience.log": "2026 | Backend Engineer | Portfolio OS\n",
  "projects.md": "# Projects\n\n- Runtime Authentication Platform\n",
  "contact.sh": '#!/bin/bash\necho "Email: daniel@example.com"\n',
};

async function loadWorkspaceManifest(basePath) {
  try {
    const response = await fetch(`${basePath}/manifest.json`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    if (!payload) return null;

    if (payload.languages && typeof payload.languages === "object") {
      return {
        languages: payload.languages,
        defaultLang: payload.defaultLang || payload.defaultLanguage || "en",
      };
    }


    if (Array.isArray(payload.files)) {
      return {
        baseDir: "",
        files: payload.files.map((f) => String(f)).filter(Boolean),
      };
    }


    if (payload.files && typeof payload.files === "object") {
      return {
        baseDir: "",
        filesByLang: payload.files,
        defaultLang: payload.defaultLang || payload.defaultLanguage || "en",
      };
    }

    return null;
  } catch (_error) {
    return null;
  }
}

export async function loadWorkspaceFiles(basePath = "./workspace", lang = "en") {
  const results = {};
  const manifest = await loadWorkspaceManifest(basePath);
  const l = (lang === "es") ? "es" : "en";

  let baseDir = "";
  let filesToLoad = null;

  if (manifest && manifest.languages && manifest.languages[l]) {
    const entry = manifest.languages[l] || {};
    baseDir = String(entry.baseDir || "").replace(/^\/+|\/+$/g, "");
    const list = Array.isArray(entry.files) ? entry.files : [];
    filesToLoad = list.map((f) => String(f)).filter(Boolean);
  } else if (manifest && manifest.filesByLang && manifest.filesByLang[l]) {
    baseDir = "";
    const list = Array.isArray(manifest.filesByLang[l]) ? manifest.filesByLang[l] : [];
    filesToLoad = list.map((f) => String(f)).filter(Boolean);
  } else if (manifest && manifest.files && Array.isArray(manifest.files)) {
    baseDir = String(manifest.baseDir || "").replace(/^\/+|\/+$/g, "");
    filesToLoad = manifest.files;
  }

  const effectiveFiles = (filesToLoad && filesToLoad.length > 0) ? filesToLoad : WORKSPACE_FILES;
  const prefix = baseDir ? `${basePath}/${baseDir}` : basePath;


  for (const file of effectiveFiles) {
    try {

      const encoded = encodeURIComponent(file);
      const response = await fetch(`${prefix}/${encoded}`, { cache: "no-store" });
      if (!response.ok) {
        results[file] = FALLBACK_CONTENT[file] || "";
        continue;
      }

      const text = await response.text();
      results[file] = text || FALLBACK_CONTENT[file] || "";
    } catch (_error) {
      results[file] = FALLBACK_CONTENT[file] || "";
    }
  }

  return results;
}
