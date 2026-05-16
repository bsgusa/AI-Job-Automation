/* ============================================================
   LEXORA AI — main.js  v2.0
   GSAP + ScrollTrigger + AOS + Canvas particles
   ============================================================ */

/* ── AOS Init ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }
});

/* ── GSAP Hero Animation ────────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge',    { opacity: 0, y: 20, duration: .6 })
    .from('.hero-title',    { opacity: 0, y: 30, duration: .7 }, '-=.3')
    .from('.hero-subtitle', { opacity: 0, y: 20, duration: .6 }, '-=.4')
    .from('.hero-actions',  { opacity: 0, y: 20, duration: .6 }, '-=.3')
    .from('.hero-trust',    { opacity: 0, y: 15, duration: .5 }, '-=.3')
    .from('.hero-card',     { opacity: 0, x: 40, duration: .8 }, '-=.6');

  // Animate progress bars on hero card
  gsap.from('.progress-fill', {
    width: 0,
    duration: 1.5,
    ease: 'power2.out',
    delay: 1,
    stagger: .15
  });

  // ScrollTrigger: fade-slide sections
  gsap.utils.toArray('.tech-feature').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, x: -30, duration: .6, delay: i * .1, ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.sec-feature').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, x: 30, duration: .6, delay: i * .1, ease: 'power2.out'
    });
  });
});

/* ── Navbar scroll ──────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile menu ────────────────────────────────────────── */
const menuBtn   = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

function closeMobileMenu() {
  menuBtn && menuBtn.classList.remove('active');
  mobileMenu && mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}

menuBtn && menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  mobileMenu && mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileClose && mobileClose.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ── WhatsApp float + Back-to-top visibility ────────────── */
const waFloat   = document.querySelector('.whatsapp-float');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 300;
  waFloat   && waFloat.classList.toggle('show', scrolled);
  backToTop && backToTop.classList.toggle('show', scrolled);
}, { passive: true });

backToTop && backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Particle canvas ────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const GOLD = '#C9A84C';
  const N    = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + .5,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      alpha: Math.random() * .5 + .2
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: N }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${(.12 * (1 - dist / 120)).toFixed(3)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  draw();
})();

/* ── Counter animation ──────────────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const isFloat = el.dataset.float === 'true';
  const dur    = 2000;
  const start  = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / dur, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const val      = target * eased;
    el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: .5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── Card tilt effect ───────────────────────────────────── */
document.querySelectorAll('.solution-card,.result-card,.hero-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Cursor glow ────────────────────────────────────────── */
(function initCursorGlow() {
  if (window.innerWidth < 768) return;
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  function loop() {
    cx += (mx - cx) * .08;
    cy += (my - cy) * .08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Smooth scroll for nav links ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
