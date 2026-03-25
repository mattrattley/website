const SITE_CONFIG = {
  homeImage: "./assets/home-placeholder.svg",
  aboutImage: "./assets/about-placeholder.svg",
};

const content = document.querySelector("[data-content]");
const navLinks = Array.from(document.querySelectorAll("[data-link]"));
const sidebar = document.querySelector("[data-sidebar]");
const menuButton = document.querySelector("[data-menu-button]");

const routes = {
  "/": renderHome,
  "/about": renderAbout,
  "/services": renderServices,
  "/speaking": renderSpeaking,
};

function navigate(path) {
  if (window.location.pathname !== path) {
    history.pushState({}, "", path);
  }
  renderCurrentRoute();
}

function renderCurrentRoute() {
  const path = window.location.pathname;
  const renderer = routes[path] || renderNotFound;
  renderer();
  highlightCurrentNav(path);
  closeSidebar();
  content.focus();
}

function highlightCurrentNav(path) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === path;
    link.classList.toggle("active", isActive);
  });
}

function attachNavListeners() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });

  window.addEventListener("popstate", renderCurrentRoute);
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
          <h1 id="home-title">Clear, practical support for teaching and learning in higher education.</h1>
          <p>
            Placeholder text for your final hero messaging. Replace with your final copy when ready.
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderAbout() {
  content.innerHTML = `
    <section class="page" aria-labelledby="about-title">
      <h1 id="about-title">About</h1>
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
        This page is scaffolded for expanded service content later. Replace the placeholders below
        with final service descriptions and delivery formats.
      </p>
      <div class="service-grid">
        <article class="service-card">
          <h2>Curriculum Design</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </article>
        <article class="service-card">
          <h2>Assessment Design</h2>
          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </article>
        <article class="service-card">
          <h2>AI in Education</h2>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        </article>
      </div>
    </section>
  `;
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
      <p><a class="speaking-link" href="/" data-link-inline>Return to home</a></p>
    </section>
  `;

  const homeLink = content.querySelector("[data-link-inline]");
  homeLink?.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("/");
  });
}

attachNavListeners();
attachMenuListener();
renderCurrentRoute();
