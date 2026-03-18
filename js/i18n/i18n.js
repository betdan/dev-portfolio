


const STORAGE_KEY = "devPortfolio.lang";

const DICT = {
  en: {
    "app.pageTitle": "Daniel Betancourt | Software Engineer",
    "app.title": "Daniel Betancourt",
    "app.subtitle": "Senior Software Engineer | APIs (REST / SOAP) | Miroservices & Microfrontends | Technical Consultant | Data Engineer (SQL & NoSQL)",
    "seo.about": "About",
    "seo.summary": "Senior software engineer focused on scalable systems, distributed APIs, and cloud-native services.",
    "seo.siteSummary": "Static bilingual technical portfolio built with vanilla JavaScript, featuring a terminal/IDE-style UX to present experience, projects, and skills in a more interactive way.",
    "seo.contact": "Contact",
    "seo.rights": "Copyright {year}. All rights reserved.",
    "seo.email": "Email",
    "seo.linkedin": "LinkedIn",
    "seo.headerOpen": "About",
    "seo.headerClose": "Close About",

    "panel.explorer": "Explorer",
    "panel.editor": "Editor",
    "panel.terminal": "Terminal",
    "editor.noFile": "No file selected",
    "editor.hint": "// Open a file from explorer or terminal.",

    "layout.toggleExplorer": "Toggle Explorer",
    "layout.maximizeTerminal": "Maximize terminal",
    "layout.restoreTerminal": "Restore terminal size",

    "terminal.welcome": "Type 'help' to see available terminal commands.",
    "terminal.commandNotFound": "Command not found: {cmd}",
    "terminal.usage.fileOps": "Usage: cat <file> | open <file> | run <file>",
    "terminal.fileNotFound": "File not found: {file}",
    "terminal.opened": "Opened {path}",
    "terminal.gitUsage": "Usage: git log",
    "terminal.noCommits": "No commits available.",
    "terminal.searchUsage": "Usage: search <term>",
    "terminal.noResults": "No results for: {term}",
    "terminal.permissionDenied": "Permission denied.",
    "terminal.scriptExecuted": "Script executed.",
    "terminal.pySim": "Initializing professional profile... \nName: Daniel Alfonso Betancourt Jiménez\nRole: Software Engineer | Technical Consultant | Data Engineering\nLoading technology stack...\n✔ C# loaded\n✔ .NET loaded\n✔ Java loaded\n✔ Python loaded\n✔ Angular loaded\n✔ React loaded\n✔ AWS loaded\n✔ Docker loaded\n✔ Kubernetes loaded\nInitializing focus areas...\n→ Monoliths\n→ Microservices\n→ Microfrontend\n→ API Design (REST / SOAP / gRPC)\n→ Event-driven Architecture (AMQP)\n→ Object Oriented Programming (OOP)\n→ SQL and NoSQL Databases\nRunning current project...\nActive project:\nHigh Availability Backend\nStatus: RUNNING\nSystem ready.",
    "terminal.csSim": "Initializing professional profile...\n\n[INFO] Fetching learning topics...\n[SUCCESS] Topics loaded successfully.\n\n--- API RESPONSE ---\nSuccess: True\nMessage: Learning topics retrieved\n\nTopics:\n✔ AWS\n✔ Docker\n✔ Kubernetes\n✔ CI/CD\n✔ Infrastructure as Code\n✔ Microservices\n✔ Event-Driven Architecture\n✔ Clean Architecture\n✔ Domain-Driven Design (DDD)\n✔ Scalable Systems Design\n✔ .NET\n✔ Java\n✔ Python\n✔ REST APIs\n✔ SOAP Services\n✔ gRPC\n✔ API Gateway\n✔ Middleware\n✔ WebSocket\n✔ Angular\n✔ Flutter\n✔ Java\n✔ RabbitMQ\n✔ AMQP\n✔ Asynchronous Processing\n✔ Idempotency\n✔ Retries & Circuit Breaker\n✔ Observability\n✔ Structured Logging\n✔ Distributed Tracing\n✔ Health Checks\n✔ Error Handling Strategies\n✔ JWT Authentication\n✔ OAuth2\n✔ Encryption (AES-256)\n✔ Secrets Management\n✔ SQL Server\n✔ PostgreSQL\n✔ ETL Processes\n✔ Performance Optimization\n✔ Angular\n✔ Microfrontends\n✔ AI Integration\n✔ LLM Integration\n✔ Cloud-Native Applications\n\nApplication finished.",
    "terminal.javaSim": "javac portfolio/soap/*.java\njava portfolio.soap.Main\nSOAP Response Generated:\n\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:proj=\"urn:portfolio:projects:v1\">\n  <soap:Header/>\n  <soap:Body>\n    <proj:GetProjectsResponse>\n      <proj:Projects>\n        <proj:Project>\n          <proj:Name>Runtime Authentication Platform</proj:Name>\n          <proj:Highlights>\n            <proj:Item>JWT issuance and JWKS publication service</proj:Item>\n            <proj:Item>API key validation with secure hashing</proj:Item>\n            <proj:Item>Multi-engine persistence (SQL Server / PostgreSQL / DynamoDB)</proj:Item>\n          </proj:Highlights>\n        </proj:Project>\n        <proj:Project>\n          <proj:Name>Event-Driven Billing Engine</proj:Name>\n          <proj:Highlights>\n            <proj:Item>Resilient async workflow processing</proj:Item>\n            <proj:Item>Retry and idempotency strategies for payments</proj:Item>\n            <proj:Item>Service observability and distributed tracing</proj:Item>\n          </proj:Highlights>\n        </proj:Project>\n      </proj:Projects>\n    </proj:GetProjectsResponse>\n  </soap:Body>\n</soap:Envelope>",
    "terminal.execNotSupported": "Execution is not supported for {file}",
    "terminal.matrixInit": "Initializing matrix stream...",
    "terminal.matrixDone": "matrix effect complete.",
    "terminal.game.usage": "Usage: game | game stop",
    "terminal.game.started": "Starting snake...",
    "terminal.game.stopped": "Game stopped.",
    "terminal.game.unavailable": "Game engine not available.",
    "terminal.snake.title": "Snake (hacker mode)",
    "terminal.snake.help": "Controls: Arrow keys / WASD. Press Esc to quit. (Tip: type 'game stop' too.)",
    "terminal.snake.gameOver": "Game over. Score: {score}. Type 'game' to play again.",

    "cmd.help.title": "Available commands:",
    "cmd.help.lang": "  lang <en|es>",
    "cmd.help.tree": "  tree",
    "cmd.help.download": "  download resume",
    "cmd.help.bench": "  bench",
    "cmd.help.gitExtra": "  git status | git show <commit> | git diff",

    "tabs.close": "Close tab",
    "status.text": "{file} | {lines} lines | {bytes} bytes | {theme} | {lang}",

    "search.title": "Search",
    "search.placeholder": "Search skills, projects, experience...",
    "search.hint": "Type to search. Tip: Ctrl+Shift+F toggles this panel.",
    "search.close": "Close search",
    "search.refresh": "Refresh data",
    "search.count": "{count} results",

    "download.ok": "Download started: {name}",
    "download.usage": "Usage: download resume",

    "bench.title": "Benchmark",
    "bench.ms": "{name}: {ms}ms",

    "git.status.clean": "On branch main\\nothing to commit, working tree clean",
    "git.show.usage": "Usage: git show <commit>",
    "git.show.notFound": "Commit not found: {commit}",
    "git.diff.noChanges": "No changes (working tree clean).",

    "reload.start": "Reloading data...",
    "reload.done": "Reload complete.",
    "reload.queued": "Reload started.",

    "mobile.workspace": "Workspace",
    "mobile.terminal": "Terminal",

    "profile.email": "Email",
    "profile.linkedin": "LinkedIn",
    "profile.github": "GitHub",

    "lang.set": "Language set to: {lang}",
  },
  es: {
    "app.pageTitle": "Daniel Betancourt | Ingeniero de Software",
    "app.title": "Daniel Betancourt",
    "app.subtitle": "Ingeriero de Software Senior | APIs (REST / SOAP) | Microservices & Microfrontends | Consultor Técnico | Ingeniero de Datos (SQL & NoSQL)",

    "seo.about": "Acerca",
    "seo.summary": "Ingeniero de software senior enfocado en aplicaciones escalables, APIs distribuidas y servicios cloud-native.",
    "seo.siteSummary": "Portafolio técnico estático, bilingue, hecho en JavaScript vanilla, con una UX tipo terminal/IDE para mostrar experiencia, proyectos y habilidades de una forma más interactiva.",
    "seo.contact": "Contacto",
    "seo.rights": "Derechos reservados {year}.",
    "seo.email": "Correo",
    "seo.linkedin": "LinkedIn",
    "seo.headerOpen": "Acerca",
    "seo.headerClose": "Cerrar acerca",

    "panel.explorer": "Explorador",
    "panel.editor": "Editor",
    "panel.terminal": "Terminal",
    "editor.noFile": "Ningun archivo seleccionado",
    "editor.hint": "// Abre un archivo desde el explorador o el terminal.",

    "layout.toggleExplorer": "Mostrar/ocultar Explorador",
    "layout.maximizeTerminal": "Maximizar terminal",
    "layout.restoreTerminal": "Restaurar tamano del terminal",

    "terminal.welcome": "Escribe 'help' para ver los comandos disponibles.",
    "terminal.commandNotFound": "Comando no encontrado: {cmd}",
    "terminal.usage.fileOps": "Uso: cat <archivo> | open <archivo> | run <archivo>",
    "terminal.fileNotFound": "Archivo no encontrado: {file}",
    "terminal.opened": "Abierto {path}",
    "terminal.gitUsage": "Uso: git log",
    "terminal.noCommits": "No hay commits disponibles.",
    "terminal.searchUsage": "Uso: search <termino>",
    "terminal.noResults": "Sin resultados para: {term}",
    "terminal.permissionDenied": "Permiso denegado.",
    "terminal.scriptExecuted": "Script ejecutado.",
    "terminal.pySim": "Inicializando perfil profesional...\nNombre: Daniel Alfonso Betancourt Jiménez\nRol: Ingeniero de Software Senior | Consultor Técnico | Ingeniero de datos\n\nCargando stack tecnológico...\n✔ C# cargado\n✔ .NET cargado\n✔ Java cargado\n✔ Python cargado\n✔ Angular cargado\n✔ React cargado\n✔ AWS cargado\n✔ Docker cargado\n✔ Kubernetes cargado\n\nInicializando áreas de enfoque...\n→ Monolitos\n→ Microservicios\n→ Microfronend\n→ Diseño de APIs (REST / SOAP / gRPC)\n→ Arquitectura orientada a eventos (AMQP)\n→ Programación orientada a objetos (OOP)\n→ Bases de datos SQL y NoSQL\n\nEjecutando proyecto actual...\nProyecto activo: Plataforma de Modernización en la Nube\nEstado: EN EJECUCIÓN\n\nSistema listo.",
    "terminal.csSim": "Inicializando perfil profesional...\n\n[INFO] Obteniendo temas de aprendizaje...\n[SUCCESS] Temas cargados exitosamente.\n\n--- RESPUESTA API ---\nÉxito: True\nMensaje: Temas de aprendizaje obtenidos\n\nTemas:\n✔ AWS\n✔ Docker\n✔ Kubernetes\n✔ CI/CD\n✔ Infrastructure as Code\n✔ Microservices\n✔ Event-Driven Architecture\n✔ Clean Architecture\n✔ Domain-Driven Design (DDD)\n✔ Scalable Systems Design\n✔ .NET\n✔ Java\n✔ Python\n✔ REST APIs\n✔ SOAP Services\n✔ gRPC\n✔ API Gateway\n✔ Middleware\n✔ WebSocket\n✔ Angular\n✔ Flutter\n✔ Java\n✔ RabbitMQ\n✔ AMQP\n✔ Asynchronous Processing\n✔ Idempotency\n✔ Retries & Circuit Breaker\n✔ Observability\n✔ Structured Logging\n✔ Distributed Tracing\n✔ Health Checks\n✔ Error Handling Strategies\n✔ JWT Authentication\n✔ OAuth2\n✔ Encryption (AES-256)\n✔ Secrets Management\n✔ SQL Server\n✔ PostgreSQL\n✔ ETL Processes\n✔ Performance Optimization\n✔ Angular\n✔ Microfrontends\n✔ AI Integration\n✔ LLM Integration\n✔ Cloud-Native Applications\n\nAplicación finalizada.",
    "terminal.javaSim": "javac Principal.java\njava portafolio.soap.Principal\nRespuesta SOAP generada:\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:proj=\"urn:portafolio:proyectos:v1\">\n  <soap:Header/>\n  <soap:Body>\n    <proj:ObtenerProyectosRespuesta>\n      <proj:Proyectos>\n        <proj:Proyecto>\n          <proj:Nombre>Plataforma de Autenticación en Tiempo de Ejecución</proj:Nombre>\n          <proj:AspectosDestacados>\n            <proj:Elemento>Servicio de emisión de JWT y publicación de JWKS</proj:Elemento>\n            <proj:Elemento>Validación de claves API con hashing seguro</proj:Elemento>\n            <proj:Elemento>Persistencia multi-motor (SQL Server / PostgreSQL / DynamoDB)</proj:Elemento>\n          </proj:AspectosDestacados>\n        </proj:Proyecto>\n        <proj:Proyecto>\n          <proj:Nombre>Motor de Facturación Basado en Eventos</proj:Nombre>\n          <proj:AspectosDestacados>\n            <proj:Elemento>Procesamiento resiliente de flujos asíncronos</proj:Elemento>\n            <proj:Elemento>Estrategias de reintento e idempotencia para pagos</proj:Elemento>\n            <proj:Elemento>Observabilidad del servicio y trazabilidad distribuida</proj:Elemento>\n          </proj:AspectosDestacados>\n        </proj:Proyecto>\n      </proj:Proyectos>\n    </proj:ObtenerProyectosRespuesta>\n  </soap:Body>\n</soap:Envelope>",
    "terminal.execNotSupported": "Ejecucion no soportada para {file}",
    "terminal.matrixInit": "Iniciando flujo matrix...",
    "terminal.matrixDone": "efecto matrix completo.",
    "terminal.game.usage": "Uso: game | game stop",
    "terminal.game.started": "Iniciando snake...",
    "terminal.game.stopped": "Juego detenido.",
    "terminal.game.unavailable": "Motor de juego no disponible.",
    "terminal.snake.title": "Snake (modo hacker)",
    "terminal.snake.help": "Controles: flechas / WASD. Esc para salir. (Tip: tambien puedes escribir 'game stop'.)",
    "terminal.snake.gameOver": "Game over. Puntaje: {score}. Escribe 'game' para jugar de nuevo.",

    "cmd.help.title": "Comandos disponibles:",
    "cmd.help.lang": "  lang <en|es>",
    "cmd.help.tree": "  tree",
    "cmd.help.download": "  download resume",
    "cmd.help.bench": "  bench",
    "cmd.help.gitExtra": "  git status | git show <commit> | git diff",

    "tabs.close": "Cerrar pestana",
    "status.text": "{file} | {lines} lineas | {bytes} bytes | {theme} | {lang}",

    "search.title": "Buscar",
    "search.placeholder": "Buscar en skills, proyectos, experiencia...",
    "search.hint": "Escribe para buscar. Tip: Ctrl+Shift+F abre este panel.",
    "search.close": "Cerrar busqueda",
    "search.refresh": "Actualizar datos",
    "search.count": "{count} resultados",

    "download.ok": "Descarga iniciada: {name}",
    "download.usage": "Uso: download resume",

    "bench.title": "Benchmark",
    "bench.ms": "{name}: {ms}ms",

    "git.status.clean": "En la rama main\\nada para actualizar, arbol de trabajo limpio",
    "git.show.usage": "Uso: git show <commit>",
    "git.show.notFound": "Commit no encontrado: {commit}",
    "git.diff.noChanges": "Sin cambios (arbol de trabajo limpio).",

    "reload.start": "Recargando datos...",
    "reload.done": "Recarga completa.",
    "reload.queued": "Recarga iniciada.",

    "mobile.workspace": "Espacio de trabajo",
    "mobile.terminal": "Terminal",

    "profile.email": "Correo",
    "profile.linkedin": "LinkedIn",
    "profile.github": "GitHub",

    "lang.set": "Idioma configurado: {lang}",
  },
};

let currentLang = "en";
const listeners = new Set();

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (_e) {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (_e) {

  }
}

function normalizeLang(lang) {
  return lang === "es" ? "es" : "en";
}

function interpolate(text, vars) {
  const input = String(text ?? "");
  if (!vars) return input;
  return input.replace(/\{(\w+)\}/g, (_m, key) => {
    const v = vars[key];
    return v === undefined || v === null ? "" : String(v);
  });
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = normalizeLang(lang);
  document.documentElement.dataset.lang = currentLang;
  document.documentElement.lang = currentLang;
  safeSet(STORAGE_KEY, currentLang);
  listeners.forEach((fn) => {
    try { fn(currentLang); } catch (_e) {  }
  });
  return currentLang;
}

export function t(key, vars) {
  const dict = DICT[currentLang] || DICT.en;
  const raw = dict[key] ?? DICT.en[key] ?? key;
  return interpolate(raw, vars);
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n() {
  const saved = safeGet(STORAGE_KEY);
  const initial = normalizeLang(saved || "en");
  setLang(initial);
  return initial;
}
