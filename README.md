# Developer OS Portfolio

Interactive bilingual developer portfolio built with HTML5, CSS3, and vanilla JavaScript. The site simulates a lightweight workstation experience with a boot screen, file explorer, code editor, terminal, search, and language switching.

## Overview

This project presents profile, experience, projects, and skills through a custom UI inspired by a developer desktop:

- Explorer panel for virtual workspace files
- Editor with lightweight syntax highlighting
- Terminal with custom commands
- Search engine for portfolio data
- English and Spanish support
- Mobile panel switcher
- SEO/About panel with contact details and project summary

No frontend framework is used.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript with ES modules
- Static JSON data sources
- Virtual file system loaded from `workspace/manifest.json`

## Run Locally

Use a local HTTP server because the app relies on ES modules and `fetch()`:

```powershell
cd C:\Users\Daniel\Desktop\repo\ATROX\dev-portfolio
python -m http.server 8080
```

Open `http://localhost:8080/`.

## Project Structure

- `index.html`: main shell layout, SEO panel, boot screen
- `css/`: visual theme, layout, terminal, responsive styles
- `js/app.js`: application bootstrap and runtime wiring
- `js/commands/`: terminal command definitions
- `js/filesystem/`: virtual file system and workspace loader
- `js/search/`: portfolio data loading and search engine
- `js/i18n/`: translations and language state
- `data/en`, `data/es`: structured portfolio content
- `workspace/en`, `workspace/es`: editor-visible files

## Workspace Files

Browsers cannot list directories directly, so the app uses a manifest-driven approach:

- `workspace/manifest.json` contains the file list
- `js/filesystem/loader.js` loads the manifest first
- If needed, regenerate the manifest after adding files

### Add a New File to `workspace/`

1. Add the file under `dev-portfolio/workspace/`
2. Regenerate the manifest:

```powershell
pwsh -File .\tools\generate-workspace-manifest.ps1
```

3. Refresh the page

## Terminal Commands

Commands are split into two modules:

- `js/commands/coreCommands.js`
- `js/commands/devCommands.js`

Examples include:

- `help`
- `ls`, `tree`, `pwd`
- `open`, `cat`, `run`
- `search`
- `lang <en|es>`
- `reload`
- `bench`
- `git log`, `git status`, `git show`, `git diff`
- `whoami`, `skills`, `projects`, `experience`, `contact`

## Search

The search system indexes structured portfolio data from `data/en` and `data/es`. It supports:

- shortcut queries such as `search contact` or `search projects`
- field-level matches such as `profile.github`, `experience.company`, or `projects.summary`
- bilingual content switching based on the active language

## Security Notes

- Terminal input/output is sanitized in `js/security/sanitizer.js`
- Terminal output uses `textContent` instead of raw HTML
- The editor uses escaped syntax-highlighted content before rendering
- The site is mostly self-contained and does not rely on external frontend CDNs

## Notes

- This is a static frontend project, not a backend application
- External resources are minimal and mostly limited to contact links such as email and LinkedIn
- The loading screen duration is tied to real bootstrap progress, with a minimum visible time for presentation
