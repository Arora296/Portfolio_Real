
  /* ── CUSTOM CURSOR ── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .achieve-item, .vol-card, .award-row, .exp-item, .footer-name, .hero-name, .standout-item, .leadership-card, .academic-card, .cert-item, .fixly-link, .glance-link, .dark-toggle, .modal-close, #openFixly, [data-exp-role]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '16px';
      dot.style.height = '16px';
      dot.style.background = '#1A56FF';
      ring.style.width  = '56px';
      ring.style.height = '56px';
      ring.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '10px';
      dot.style.height = '10px';
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.opacity = '0.5';
    });
  });

  /* ── SCROLL PROGRESS BAR ── */
  const scrollBar = document.getElementById('scroll-bar');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollBar.style.width = pct + '%';

    // Nav shadow on scroll
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ── REVEAL ON SCROLL ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => observer.observe(r));

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const cObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = target >= 100 ? '+' : '+';
      let count = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + suffix;
        if (count >= target) clearInterval(interval);
      }, 35);
      cObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObserver.observe(c));

  /* ── FLOATING PARTICLES ── */
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 3 + 1;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26, 86, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 55; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(26, 86, 255, ${0.07 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();

  /* ── LOADING SCREEN ── */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      loaderFill.style.width = '100%';
      clearInterval(loadInterval);
      setTimeout(() => loader.classList.add('hidden'), 350);
    } else {
      loaderFill.style.width = progress + '%';
    }
  }, 180);
  window.addEventListener('load', () => {
    loaderFill.style.width = '100%';
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  /* ── DARK MODE TOGGLE ── */
  const darkToggle = document.getElementById('darkToggle');
  function setDarkIcon() {
    darkToggle.innerHTML = document.body.classList.contains('dark') ? '&#9728;' : '&#9789;';
  }
  if (localStorage.getItem('portfolio-theme') === 'dark') {
    document.body.classList.add('dark');
  }
  setDarkIcon();
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    setDarkIcon();
  });

  /* ── SMOOTH PAGE TRANSITION ON INTERNAL ANCHOR LINKS ── */
  const transitionOverlay = document.getElementById('transition-overlay');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      transitionOverlay.classList.remove('active');
      void transitionOverlay.offsetWidth; // restart animation
      transitionOverlay.classList.add('active');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 380);
      setTimeout(() => {
        transitionOverlay.classList.remove('active');
      }, 800);
    });
  });

  /* ── MODAL / DIALOG SYSTEM ── */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalLabel = document.getElementById('modalLabel');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalBody = document.getElementById('modalBody');

  function openModal({ label, title, sub, bodyHTML }) {
    modalLabel.textContent = label;
    modalTitle.textContent = title;
    modalSub.textContent = sub || '';
    modalSub.style.display = sub ? 'block' : 'none';
    modalBody.innerHTML = bodyHTML;
    modalOverlay.classList.add('active');
  }
  function closeModal() {
    modalOverlay.classList.remove('active');
  }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* "At a Glance" full profile dialog */
  document.getElementById('openGlance').addEventListener('click', () => {
    openModal({
      label: 'At a Glance',
      title: 'Full Profile',
      sub: 'Year 13 \u2022 British School of Kuwait \u2022 Aspiring CS & Maths Student',
      bodyHTML: `
        <p>I'm Aarav Arora, a Year 13 student at the British School of Kuwait, looking to pursue Computer Science and Mathematics at degree level. I like building things that actually solve problems &mdash; whether that's leading a club, founding a startup, or chasing a hard problem set just to see if I can crack it.</p>
        <p>Outside the classroom, I was part of the founding team of the Engineering Club, where I designed weekly engineering challenges for students to solve and present. I also founded the Python Coding Club, teaching fellow students the basics of Python and setting practice exercises at the end of each lesson.</p>
        <p>I'm also the founder of Fixly, a worker-first home services platform built to make Kuwait's maintenance industry fairer for technicians and more transparent for customers.</p>
        <p>Academically, I've taken part in UKMT and IPhyC, and I keep building my technical foundation through certifications in Python and machine learning (Kaggle), and linear algebra and machine learning with Python (Imperial College London and IBM, via Coursera).</p>
        <p>I'm currently looking ahead to university, where I want to combine computer science and mathematics with the same hands-on, problem-solving mindset I've brought to my clubs and Fixly.</p>
      `
    });
  });

  /* Volunteer card dialogs */
  document.querySelectorAll('.vol-card').forEach(card => {
    card.addEventListener('click', () => {
      openModal({
        label: 'Volunteer Work',
        title: card.dataset.volTitle,
        sub: card.dataset.volOrg,
        bodyHTML: `<p>${card.dataset.volDesc}</p>`
      });
    });
  });

  /* Leadership card dialogs */
  document.querySelectorAll('.leadership-card').forEach(card => {
    card.addEventListener('click', () => {
      openModal({
        label: 'Leadership',
        title: card.dataset.role,
        sub: card.dataset.club,
        bodyHTML: `<p>${card.dataset.desc}</p>`
      });
    });
  });

  /* Internship dialog */
  document.querySelectorAll('[data-exp-role]').forEach(item => {
    item.addEventListener('click', () => {
      openModal({
        label: 'Internship',
        title: item.dataset.expRole,
        sub: item.dataset.expCompany,
        bodyHTML: `<p>${item.dataset.expDesc}</p>`
      });
    });
  });

  /* Fixly "know more" dialog */
  const fixlyTrigger = document.getElementById('openFixly');
  if (fixlyTrigger) {
    fixlyTrigger.style.cursor = 'pointer';
    fixlyTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal({
        label: 'Startup',
        title: 'Fixly',
        sub: 'Empowering the Hands That Build',
        bodyHTML: `
          <p>Fixly is a worker-first home services platform built to modernize Kuwait's home maintenance industry. We're moving away from the "agency-first" model toward a worker-first ecosystem that prioritizes transparency and economic dignity.</p>
          <p>The current home-service landscape is plagued by predatory intermediaries: agencies typically claim 10&ndash;35% of a technician's gross daily earnings, leaving skilled laborers in a cycle of poverty despite providing essential, high-demand services. There's also no standardized pricing, which leads to overcharging and inconsistent quality, and customers struggle to find verified, background-checked professionals.</p>
          <p>Fixly acts as a direct-to-worker marketplace, connecting customers to technicians directly and removing unnecessary administrative layers. A transparent P2P bidding system lets customers and technicians negotiate directly, while every "Fixly Pro" undergoes a multi-step certification and background check. By reducing our commission to a flat 5%, we effectively give technicians a 30% raise overnight &mdash; funding operations through that fee while maximizing labor income.</p>
          <p>Beyond the marketplace, Fixly is a social movement: we're building digital earnings histories for unbanked workers so they can qualify for formal banking and loans, and diverting 1% of platform fees into a community fund for worker healthcare and emergency insurance. Our service categories span HVAC &amp; climate, electrical &amp; smart home, plumbing &amp; water management, and sanitisation &mdash; the highest-frequency "emergency-need" categories in the Kuwaiti market. We're launching in 2026 as a premier solution for high-frequency maintenance needs across the Middle East.</p>
        `
      });
    });
  }
