(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Typed hero roles ----- */
  const roles = [
    "Cybersecurity Enthusiast",
    "Python Developer",
    "Linux Explorer",
    "Web Designer",
  ];
  const typedEl = document.getElementById("typed-text");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const current = roles[roleIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  /* ----- Circular scroll progress + global rotation ----- */
  const scrollPctEl = document.getElementById("scroll-pct");
  const scrollRing = document.getElementById("scroll-ring");
  const CIRCUMFERENCE = 276.46;

  function onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    const pct = Math.round(progress * 100);

    document.documentElement.style.setProperty("--scroll-progress", progress);
    document.documentElement.style.setProperty(
      "--scroll-rotate",
      `${progress * 360}deg`
    );

    if (scrollPctEl) scrollPctEl.textContent = `${pct}%`;
    if (scrollRing) {
      scrollRing.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
    }

    /* Orbit skills ring rotates with scroll in skills section */
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      const rect = skillsSection.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const sectionProgress =
          1 - Math.max(0, Math.min(1, (rect.top + rect.height * 0.5) / vh));
        document.documentElement.style.setProperty(
          "--orbit-rotate",
          `${sectionProgress * 180 + progress * 90}deg`
        );
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Header scroll ----- */
  const header = document.getElementById("header");
  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("scrolled", window.scrollY > 50);
    },
    { passive: true }
  );

  /* ----- Mobile nav ----- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  navToggle?.addEventListener("click", () => {
    const open = navLinks?.classList.toggle("open");
    navToggle.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle?.classList.remove("active");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* ----- Active nav link ----- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const observerNav = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observerNav.observe(s));

  /* ----- Reveal on scroll ----- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----- Circular skills rings ----- */
  const circularSkills = document.getElementById("circular-skills");
  if (circularSkills) {
    circularSkills.querySelectorAll(".circular-skill").forEach((el) => {
      const pct = el.getAttribute("data-skill") || "0";
      el.style.setProperty("--pct", pct);
      const fill = el.querySelector(".c-fill");
      if (fill) fill.style.strokeDashoffset = String(100 - Number(pct));
    });

    const circObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            circObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    circObserver.observe(circularSkills);
  }

  /* ----- Skill bars ----- */
  const skillCards = document.querySelectorAll(".skill-card");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const pct = card.getAttribute("data-skill") || "0";
        const fill = card.querySelector(".skill-fill");
        if (fill) fill.style.width = `${pct}%`;
        skillObserver.unobserve(card);
      });
    },
    { threshold: 0.5 }
  );
  skillCards.forEach((c) => skillObserver.observe(c));

  /* ----- Language bars ----- */
  document.querySelectorAll(".lang-card").forEach((card) => {
    const langObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            langObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    langObserver.observe(card);
  });

  /* ----- Counter animation ----- */
  const statNums = document.querySelectorAll(".stat-num[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 40);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach((n) => counterObserver.observe(n));

  /* ----- Circular 3D project carousel ----- */
  const carouselRing = document.getElementById("carousel-ring");
  const carouselCards = document.querySelectorAll(".carousel-card");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const projectsSection = document.getElementById("projects");

  let carouselIndex = 0;
  const totalCards = carouselCards.length;
  const angleStep = totalCards > 0 ? 360 / totalCards : 120;

  function setCarousel(index) {
    if (!carouselRing || totalCards === 0) return;
    carouselIndex = ((index % totalCards) + totalCards) % totalCards;
    const angle = -carouselIndex * angleStep;
    document.documentElement.style.setProperty("--carousel-angle", `${angle}deg`);
    carouselRing.style.transform = `rotateY(${angle}deg)`;

    carouselCards.forEach((card, i) => {
      card.classList.toggle("active", i === carouselIndex);
    });

    dotsContainer?.querySelectorAll(".carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === carouselIndex);
    });
  }

  if (dotsContainer && totalCards > 0) {
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `Project ${i + 1}`);
      dot.addEventListener("click", () => setCarousel(i));
      dotsContainer.appendChild(dot);
    }
  }

  prevBtn?.addEventListener("click", () => setCarousel(carouselIndex - 1));
  nextBtn?.addEventListener("click", () => setCarousel(carouselIndex + 1));

  setCarousel(0);

  /* Auto-rotate carousel when projects section visible */
  let carouselTimer;
  function startCarouselAuto() {
    if (prefersReduced) return;
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => setCarousel(carouselIndex + 1), 4500);
  }
  function stopCarouselAuto() {
    clearInterval(carouselTimer);
  }

  if (projectsSection) {
    const projObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startCarouselAuto();
          else stopCarouselAuto();
        });
      },
      { threshold: 0.3 }
    );
    projObserver.observe(projectsSection);
  }

  /* Wheel / touch spin on carousel */
  const carouselWrap = document.getElementById("circular-carousel");
  let wheelCooldown = false;
  carouselWrap?.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) < 10 || wheelCooldown) return;
      e.preventDefault();
      wheelCooldown = true;
      setCarousel(carouselIndex + (e.deltaY > 0 ? 1 : -1));
      setTimeout(() => {
        wheelCooldown = false;
      }, 600);
    },
    { passive: false }
  );

  let touchStartX = 0;
  carouselWrap?.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carouselWrap?.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) setCarousel(carouselIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ----- Cursor glow ----- */
  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener(
      "mousemove",
      (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      },
      { passive: true }
    );
  }

  /* ----- Animated grid canvas ----- */
  const canvas = document.getElementById("grid-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, size = 40;
    const dots = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const cols = Math.ceil(w / size) + 1;
      const rows = Math.ceil(h / size) + 1;
      dots.length = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          dots.push({
            x: x * size,
            y: y * size,
            base: 0.15 + Math.random() * 0.2,
          });
        }
      }
    }

    let mouseX = -1000;
    let mouseY = -1000;
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() * 0.001;
      const scrollBoost =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--scroll-progress"
          )
        ) || 0;

      dots.forEach((d) => {
        const dx = d.x - mouseX;
        const dy = d.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = dist < 120 ? (1 - dist / 120) * 0.6 : 0;
        const pulse =
          d.base + boost + Math.sin(t + d.x * 0.01 + scrollBoost * 3) * 0.08;
        ctx.fillStyle = `rgba(0, 255, 170, ${Math.min(1, pulse)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.2 + scrollBoost * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  }
})();
