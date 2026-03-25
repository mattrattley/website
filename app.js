const SITE_CONFIG = {
  basePath: "/websitetest",
  homeImage: "./assets/home-placeholder.svg",
  aboutImage: "./assets/about-placeholder.svg",
};

const content = document.querySelector("[data-content]");
const navLinks = Array.from(document.querySelectorAll("[data-link]"));
const sidebar = document.querySelector("[data-sidebar]");
const menuButton = document.querySelector("[data-menu-button]");
const USE_HASH_ROUTING = window.location.protocol === "file:";

const routes = {
  "/": renderHome,
  "/about": renderAbout,
  "/services": renderServices,
  "/case-studies": renderCaseStudies,
  "/speaking": renderSpeaking,
};

function normalizePath(rawPath) {
  if (!rawPath) return "/";
  let path = rawPath.trim();
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/+$/, "");
  return path === "" ? "/" : path;
}

function normalizeBasePath(rawBasePath) {
  const normalized = normalizePath(rawBasePath || "/");
  return normalized === "/" ? "" : normalized;
}

const BASE_PATH = USE_HASH_ROUTING ? "" : normalizeBasePath(SITE_CONFIG.basePath);

function toHrefPath(routePath) {
  const route = normalizePath(routePath);
  if (!BASE_PATH) return route;
  return route === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${route}`;
}

function stripBasePath(pathname) {
  const current = normalizePath(pathname);
  if (!BASE_PATH) return current;
  if (current === BASE_PATH) return "/";
  if (current.startsWith(`${BASE_PATH}/`)) {
    return normalizePath(current.slice(BASE_PATH.length));
  }
  return current;
}

function getCurrentPath() {
  if (USE_HASH_ROUTING) {
    const hashPath = window.location.hash.replace(/^#/, "");
    return normalizePath(hashPath || "/");
  }
  return stripBasePath(window.location.pathname || "/");
}

function navigate(path) {
  const targetPath = normalizePath(path);

  if (USE_HASH_ROUTING) {
    const nextHash = `#${targetPath}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
      return;
    }
    renderCurrentRoute();
    return;
  }

  const destination = toHrefPath(targetPath);
  if (window.location.pathname !== destination) {
    history.pushState({}, "", destination);
  }
  renderCurrentRoute();
}

function renderCurrentRoute() {
  const path = getCurrentPath();
  const renderer = routes[path] || renderNotFound;
  renderer();
  highlightCurrentNav(path);
  content.classList.toggle("content-pane-home", path === "/");
  closeSidebar();
  content.focus();
}

function highlightCurrentNav(path) {
  navLinks.forEach((link) => {
    const route = normalizePath(link.getAttribute("data-route") || link.getAttribute("href"));
    link.classList.toggle("active", route === path);
  });
}

function setNavHrefsForCurrentMode() {
  navLinks.forEach((link) => {
    const route = normalizePath(link.getAttribute("href"));
    link.setAttribute("data-route", route);

    if (USE_HASH_ROUTING) {
      link.setAttribute("href", `#${route}`);
    } else {
      link.setAttribute("href", toHrefPath(route));
    }
  });
}

function attachNavListeners() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const route = link.getAttribute("data-route") || "/";
      navigate(route);
    });
  });

  if (USE_HASH_ROUTING) {
    window.addEventListener("hashchange", renderCurrentRoute);
  } else {
    window.addEventListener("popstate", renderCurrentRoute);
  }
}

function attachMenuListener() {
  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.getAttribute("data-open") === "true";
    sidebar.setAttribute("data-open", String(!isOpen));
    menuButton.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
        closeSidebar();
      }
    }
  });
}

function closeSidebar() {
  sidebar.setAttribute("data-open", "false");
  menuButton.setAttribute("aria-expanded", "false");
}

function renderHome() {
  content.innerHTML = `
    <section class="page" aria-labelledby="home-title">
      <div class="home-hero">
        <img
          src="${SITE_CONFIG.homeImage}"
          alt="Portrait placeholder for Matt Rattley"
          class="home-hero-image"
        />
        <div class="home-hero-text">
          <h1 id="home-title">I’m Matt 👋 I work with universities and organisations to improve how learning is designed and delivered</h1>
        </div>
      </div>
    </section>
  `;
}

function renderAbout() {
  content.innerHTML = `
    <section class="page" aria-labelledby="about-title">
      <h1 id="about-title">About Me</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed justo vel libero
        pellentesque ultricies. Donec euismod, justo sed tristique elementum, ipsum mi malesuada
        lacus, vitae varius arcu justo eu sem.
      </p>
      <img
        src="${SITE_CONFIG.aboutImage}"
        alt="Inline placeholder image"
        class="about-inline-photo"
      />
      <p>
        Curabitur posuere, purus et blandit interdum, lorem eros vehicula velit, vitae porta ipsum
        massa et nisl. Suspendisse potenti. Quisque in turpis a urna tristique gravida vitae vitae
        nunc.
      </p>
    </section>
  `;
}

function renderServices() {
  content.innerHTML = `
    <section class="page" aria-labelledby="services-title">
      <h1 id="services-title">Services</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. This placeholder introduction can
        be replaced with your final summary of service approach.
      </p>

      <div class="services-diagram" data-services-diagram aria-label="Interactive services model">
        <div class="services-oval" data-services-boundary>
          <button
            type="button"
            class="diagram-zone outer-zone outer-left"
            data-zone="outer-design"
            aria-label="Teaching and Learning Design"
          >
            Teaching &amp; Learning<br />Design
          </button>
          <button
            type="button"
            class="diagram-zone outer-zone outer-right"
            data-zone="outer-ai"
            aria-label="Digital and AI-enhanced Learning"
          >
            Digital &amp;<br />AI-enhanced Learning
          </button>

          <div class="services-core" aria-label="Core principles">
            <button type="button" class="diagram-zone core-zone core-tl" data-zone="core-evidence">
              <span class="core-label-emoji" aria-hidden="true">🔎</span>
              <span>Evidence-informed</span>
            </button>
            <button type="button" class="diagram-zone core-zone core-tr" data-zone="core-innovative">
              <span class="core-label-emoji" aria-hidden="true">💡</span>
              <span>Innovative</span>
            </button>
            <button type="button" class="diagram-zone core-zone core-bl" data-zone="core-inclusive">
              <span>Inclusive</span>
              <span class="core-label-emoji core-label-emoji-bottom" aria-hidden="true">🤝</span>
            </button>
            <button type="button" class="diagram-zone core-zone core-br" data-zone="core-practical">
              <span>Practical</span>
              <span class="core-label-emoji core-label-emoji-bottom" aria-hidden="true">🛠️</span>
            </button>
          </div>
        </div>

        <aside class="diagram-info-panel" data-diagram-panel hidden aria-live="polite"></aside>
      </div>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. This placeholder sentence can be
        replaced with practical examples and outcomes from your engagements.
      </p>
    </section>
  `;

  setupServicesDiagram();
}

function setupServicesDiagram() {
  const diagram = document.querySelector("[data-services-diagram]");
  const boundary = diagram?.querySelector("[data-services-boundary]");
  const panel = diagram?.querySelector("[data-diagram-panel]");
  const zones = diagram ? Array.from(diagram.querySelectorAll("[data-zone]")) : [];
  if (!diagram || !boundary || !panel || zones.length === 0) return;

  const zoneContent = {
    "core-evidence": {
      title: "Evidence-informed",
      text: "Placeholder text for how decisions are grounded in credible educational evidence.",
      bullets: [],
      panelClass: "panel-pos-br",
    },
    "core-innovative": {
      title: "Innovative",
      text: "Placeholder text for practical innovation that improves teaching and learning design.",
      bullets: [],
      panelClass: "panel-pos-bl",
    },
    "core-inclusive": {
      title: "Inclusive",
      text: "Placeholder text for designing learning that works for diverse student needs.",
      bullets: [],
      panelClass: "panel-pos-tr",
    },
    "core-practical": {
      title: "Practical",
      text: "Placeholder text for implementable solutions that staff teams can apply quickly.",
      bullets: [],
      panelClass: "panel-pos-tl",
    },
    "outer-design": {
      title: "Teaching & Learning Design",
      text: "Placeholder sentence introducing the teaching and learning design strand.",
      bullets: [
        "Programme and module design",
        "Assessment and feedback alignment",
        "Practical implementation support",
      ],
      panelClass: "panel-pos-center",
    },
    "outer-ai": {
      title: "Digital & AI-enhanced Learning",
      text: "Placeholder sentence introducing digital and AI-enhanced learning support.",
      bullets: [
        "AI-informed curriculum adaptation",
        "Staff capability development",
        "Sustainable digital workflows",
      ],
      panelClass: "panel-pos-center",
    },
  };

  let activeZone = null;

  function renderPanel(zoneId) {
    const details = zoneContent[zoneId];
    if (!details) return;

    panel.className = `diagram-info-panel ${details.panelClass}`;
    panel.hidden = false;

    const bulletList = details.bullets.length
      ? `<ul>${details.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`
      : "";

    panel.innerHTML = `
      <h2>${details.title}</h2>
      <p>${details.text}</p>
      ${bulletList}
    `;
  }

  function applyDimming(zoneId) {
    zones.forEach((zone) => {
      const isActive = zone.dataset.zone === zoneId;
      zone.classList.toggle("is-active", isActive);
      zone.classList.toggle("is-dimmed", !isActive);
    });
  }

  function clearSelection() {
    activeZone = null;
    panel.hidden = true;
    panel.innerHTML = "";
    panel.className = "diagram-info-panel";
    zones.forEach((zone) => zone.classList.remove("is-active", "is-dimmed"));
  }

  function setSelection(zoneId) {
    if (!zoneContent[zoneId]) return;
    activeZone = zoneId;
    applyDimming(zoneId);
    renderPanel(zoneId);
  }

  zones.forEach((zone) => {
    const zoneId = zone.dataset.zone;

    zone.addEventListener("mouseenter", () => setSelection(zoneId));
    zone.addEventListener("focus", () => setSelection(zoneId));
    zone.addEventListener("click", () => {
      if (activeZone === zoneId) {
        clearSelection();
      } else {
        setSelection(zoneId);
      }
    });
    zone.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        clearSelection();
      }
    });
  });

  boundary.addEventListener("mouseleave", () => {
    if (!boundary.contains(document.activeElement)) {
      clearSelection();
    }
  });

  diagram.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!diagram.contains(document.activeElement)) {
        clearSelection();
      }
    }, 0);
  });
}


function renderCaseStudies() {
  content.innerHTML = `
    <section class="page" aria-labelledby="case-studies-title">
      <h1 id="case-studies-title">Case Studies</h1>
      <p>
        Click each project title to reveal context, actions, and links to supporting materials.
      </p>

      <div class="accordion" data-accordion>
        ${renderAccordionItem(
          "case-1",
          "Example case: Programme-level assessment redesign",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
          "https://example.com/case-study-1"
        )}
        ${renderAccordionItem(
          "case-2",
          "Example case: Curriculum alignment across core modules",
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
          "https://example.com/case-study-2"
        )}
        ${renderAccordionItem(
          "case-3",
          "Example case: Practical AI integration for teaching teams",
          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
          "https://example.com/case-study-3"
        )}
      </div>
    </section>
  `;

  setupAccordion();
}

function renderSpeaking() {
  content.innerHTML = `
    <section class="page" aria-labelledby="speaking-title">
      <h1 id="speaking-title">Speaking</h1>
      <p>
        Click each event title to reveal details. Add your own events, links, and summaries.
      </p>

      <div class="accordion" data-accordion>
        ${renderAccordionItem(
          "item-1",
          "Example keynote: Assessment design in demanding programmes",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
          "https://example.com/recording"
        )}
        ${renderAccordionItem(
          "item-2",
          "Example workshop: Practical AI policy in everyday teaching",
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
          "https://example.com/slides.pdf"
        )}
        ${renderAccordionItem(
          "item-3",
          "Example panel: Improving student experience through coherent design",
          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
          "https://example.com/event-page"
        )}
      </div>
    </section>
  `;

  setupAccordion();
}

function renderAccordionItem(id, title, text, url) {
  return `
    <div class="accordion-item">
      <h2>
        <button
          class="accordion-trigger"
          type="button"
          id="${id}-trigger"
          aria-expanded="false"
          aria-controls="${id}-panel"
        >
          <span>${title}</span>
        </button>
      </h2>
      <div
        class="accordion-panel"
        id="${id}-panel"
        role="region"
        aria-labelledby="${id}-trigger"
        aria-hidden="true"
      >
        <div class="accordion-panel-inner">
          <p>${text}</p>
          <p>
            <a class="speaking-link" href="${url}" target="_blank" rel="noopener noreferrer">
              External link
            </a>
          </p>
        </div>
      </div>
    </div>
  `;
}

function setupAccordion() {
  const triggers = Array.from(document.querySelectorAll(".accordion-trigger"));
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const willExpand = trigger.getAttribute("aria-expanded") !== "true";

      triggers.forEach((otherTrigger) => {
        const panelId = otherTrigger.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);
        otherTrigger.setAttribute("aria-expanded", "false");
        panel?.setAttribute("aria-hidden", "true");
      });

      if (willExpand) {
        const panelId = trigger.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);
        trigger.setAttribute("aria-expanded", "true");
        panel?.setAttribute("aria-hidden", "false");
      }
    });
  });
}

function renderNotFound() {
  content.innerHTML = `
    <section class="page" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>
      <p>The page you tried to visit doesn’t exist in this draft site.</p>
      <p><a class="speaking-link" href="#" data-link-inline>Return to home</a></p>
    </section>
  `;

  const homeLink = content.querySelector("[data-link-inline]");
  homeLink?.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("/");
  });
}

setNavHrefsForCurrentMode();
attachNavListeners();
attachMenuListener();
renderCurrentRoute();
