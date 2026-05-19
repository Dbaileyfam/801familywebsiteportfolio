(function () {
  const grid = document.getElementById("project-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const yearEl = document.getElementById("year");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const cursorGlow = document.querySelector(".cursor-glow");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Render project cards ─── */
  function hostnameFromUrl(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  function renderProjects(filter = "all") {
    if (!grid || typeof PROJECTS === "undefined") return;

    grid.innerHTML = "";

    PROJECTS.forEach((project, index) => {
      if (filter !== "all" && project.type !== filter) return;

      const card = document.createElement("a");
      card.href = project.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "project-card reveal";
      card.dataset.type = project.type;
      card.style.setProperty("--card-accent", project.accent);
      card.setAttribute("aria-label", `Visit ${project.title} — opens in new tab`);

      const typeLabel = project.type === "epk" ? "EPK" : "Website";
      const previewSrc = `assets/previews/${project.id}.jpg?v=20250519`;
      const host = hostnameFromUrl(project.url);

      card.innerHTML = `
        <div class="card-preview">
          <div class="browser-chrome" aria-hidden="true">
            <span class="browser-dots"><i></i><i></i><i></i></span>
            <span class="browser-address">
              <svg class="browser-lock" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span class="browser-url"><span class="browser-url-protocol">https://</span>${host}</span>
            </span>
            <span class="browser-go" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </span>
          </div>
          <div class="card-preview-image">
            <img
              src="${previewSrc}"
              alt="Homepage preview of ${project.title}"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div class="project-card-body">
          <span class="project-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <div class="project-card-inner">
            <span class="project-type">${typeLabel}</span>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-meta">${project.genre} · ${project.location}</p>
            <p class="project-desc">${project.description}</p>
            <div class="project-tags">
              ${project.tags.map((t) => `<span>${t}</span>`).join("")}
            </div>
            <span class="project-visit-btn">
              <span class="project-visit-btn-label">Visit live site</span>
              <span class="project-visit-btn-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </span>
          </div>
        </div>
      `;
      grid.appendChild(card);

      requestAnimationFrame(() => {
        observeReveal(card);
      });
    });

    initCardTilt();
  }

  /* ─── Filters ─── */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      renderProjects(filter);
    });
  });

  /* ─── Scroll reveal ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  function observeReveal(el) {
    revealObserver.observe(el);
  }

  document.querySelectorAll(".reveal").forEach(observeReveal);

  /* ─── 3D tilt on cards ─── */
  function initCardTilt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * -12;
        const tiltY = (x - 0.5) * 12;

        card.style.setProperty("--spot-x", `${x * 100}%`);
        card.style.setProperty("--spot-y", `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ─── Cursor glow ─── */
  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-pointer");
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateGlow() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursorGlow.style.left = `${cx}px`;
      cursorGlow.style.top = `${cy}px`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ─── Mobile menu ─── */
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  renderProjects("all");
})();
