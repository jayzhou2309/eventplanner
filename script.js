/* ============================================================
   LUMIÈRE EVENTS — script.js
   Interactions, animations, and polish
   ============================================================ */

'use strict';

/* ── Sticky Navigation ── */
(function initNav() {
  const nav  = document.getElementById('nav');
  const hero = document.getElementById('hero');

  if (!nav) return;

  if (hero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('scrolled', !entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(hero);
  }
})();


/* ── Mobile Hamburger Menu ── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ── Smooth Scroll for Anchor Links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ── Scroll Animations (Intersection Observer) ── */
(function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.animate-up');

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  animatedEls.forEach((el, i) => {
    // Stagger delay based on step-delay CSS variable or auto index within parent
    const stepDelay = el.style.getPropertyValue('--step-delay');
    if (!stepDelay) {
      const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('animate-up'));
      const idx = siblings.indexOf(el);
      if (idx > 0) {
        el.style.transitionDelay = (idx * 120) + 'ms';
      }
    }
    observer.observe(el);
  });
})();


/* ── Hero Background Mesh Animation ── */
(function initHeroMesh() {
  const mesh = document.getElementById('heroBgMesh');
  if (!mesh) return;

  // Subtle parallax shift on mouse move
  document.addEventListener('mousemove', (e) => {
    const xPct = (e.clientX / window.innerWidth  - 0.5) * 20;
    const yPct = (e.clientY / window.innerHeight - 0.5) * 20;
    mesh.style.transform = `translate(${xPct}px, ${yPct}px) scale(1.05)`;
  });
})();


/* ── Hero Scroll Parallax ── */
(function initHeroParallax() {
  const hero    = document.getElementById('hero');
  const content = hero ? hero.querySelector('.hero__content') : null;
  const mesh    = document.getElementById('heroBgMesh');

  if (!hero || !content) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH   = hero.offsetHeight;

        if (scrollY <= heroH) {
          const progress = scrollY / heroH;
          content.style.transform = `translateY(${scrollY * 0.35}px)`;
          content.style.opacity   = 1 - progress * 1.4;
          if (mesh) mesh.style.transform = `translateY(${scrollY * 0.15}px) scale(1.05)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── Scroll Indicator Hide on Scroll ── */
(function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      indicator.style.opacity = entry.isIntersecting ? '1' : '0';
    },
    { threshold: 0.5 }
  );
  observer.observe(document.getElementById('hero'));
})();


/* ── Portfolio Tile Hover Effects ── */
(function initPortfolioTiles() {
  const tiles = document.querySelectorAll('.portfolio-tile');

  tiles.forEach(tile => {
    const overlay = tile.querySelector('.portfolio-tile__overlay');
    if (!overlay) return;

    tile.addEventListener('mouseenter', () => {
      overlay.style.opacity   = '1';
      overlay.style.transform = 'translateY(0)';
    });

    tile.addEventListener('mouseleave', () => {
      overlay.style.opacity   = '0';
      overlay.style.transform = 'translateY(8px)';
    });
  });
})();


/* ── Contact Form Handler ── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  // Gold focus glow on inputs
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('form-group--focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('form-group--focused');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name      = form.querySelector('#name');
    const email     = form.querySelector('#email');
    const eventType = form.querySelector('#eventType');
    const message   = form.querySelector('#message');
    const submitBtn = form.querySelector('[type="submit"]');

    // Basic validation
    let valid = true;

    [name, email, eventType, message].forEach(field => {
      field.classList.remove('form-input--error');
      if (!field.value.trim() || (field.type === 'email' && !field.value.includes('@'))) {
        field.classList.add('form-input--error');
        valid = false;
      }
    });

    if (!valid) {
      // Shake animation on invalid submit
      submitBtn.classList.add('btn--shake');
      setTimeout(() => submitBtn.classList.remove('btn--shake'), 500);
      return;
    }

    // Simulate submission
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      form.style.opacity    = '0';
      form.style.transform  = 'translateY(10px)';
      form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      setTimeout(() => {
        form.style.display = 'none';
        if (success) {
          success.classList.add('show');
        }
      }, 400);
    }, 1200);
  });
})();


/* ── Service Card Hover: Gold Left Border ── */
(function initServiceCards() {
  // CSS handles the hover; JS adds ARIA/focus support here
  document.querySelectorAll('.service-card').forEach(card => {
    card.setAttribute('role', 'article');
  });
})();


/* ── Hero Entrance Animations ── */
(function initHeroEntrance() {
  // Stagger hero elements in on load
  const lines = document.querySelectorAll('.hero__line, .hero__pill, .hero__rule, .hero__subtext, .hero__ctas, .hero__scroll-indicator');

  lines.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${100 + i * 130}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${100 + i * 130}ms`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
})();


/* ── Number Counter Animations (Stats Section) ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat__number');
  if (!stats.length) return;

  function countUp(el, target, suffix, duration) {
    const start     = Date.now();
    const isDecimal = target !== Math.floor(target);

    function tick() {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(target * eased);
      el.textContent = current + suffix;

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    tick();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el      = entry.target;
        const raw     = el.textContent.trim();
        const suffix  = raw.replace(/[\d.]/g, '');
        const numeric = parseFloat(raw.replace(/[^\d.]/g, ''));

        if (!isNaN(numeric)) {
          countUp(el, numeric, suffix, 1800);
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(stat => observer.observe(stat));
})();


/* ── Active Nav Link on Scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('nav__link--active', href === '#' + id);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ── Process Step Stagger ── */
(function initProcessStagger() {
  const steps = document.querySelectorAll('.process__step');
  steps.forEach((step, i) => {
    step.style.setProperty('--step-delay', (i * 160) + 'ms');
  });
})();


/* ── Testimonial Cards Hover Tilt ── */
(function initCardTilt() {
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const xPct   = (e.clientX - rect.left) / rect.width  - 0.5;
      const yPct   = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX   = -(yPct * 6).toFixed(2);
      const rotY   = (xPct * 6).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── Page Load — Remove Loading State ── */
(function initPageReady() {
  document.documentElement.classList.add('js-loaded');
})();
