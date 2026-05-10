// ── Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hamburger / mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() { mobileMenu.classList.remove('open'); }

// ── Intersection Observer for fade-up animations
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
fadeEls.forEach(el => observer.observe(el));

// ── Counter animation for stats
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start.toLocaleString() + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const isK = target >= 1000;
      if (isK) {
        animateCounter(el, target, '+');
      } else {
        animateCounter(el, target);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));

// ── Map pin tooltips
const pins = document.querySelectorAll('.map-pin');
pins.forEach(pin => {
  pin.style.cursor = 'pointer';
  pin.addEventListener('mouseenter', () => {
    const region = pin.dataset.region;
    const tooltip = document.getElementById('mapTooltip');
    const tooltipBg = document.getElementById('tooltipBg');
    const tooltipText = document.getElementById('tooltipText');
    const cx = parseFloat(pin.querySelector('circle:not(.map-pin-pulse)').getAttribute('cx'));
    const cy = parseFloat(pin.querySelector('circle:not(.map-pin-pulse)').getAttribute('cy'));
    tooltipText.textContent = region;
    const w = region.length * 6.5 + 16;
    tooltipBg.setAttribute('x', cx - w / 2);
    tooltipBg.setAttribute('y', cy - 30);
    tooltipBg.setAttribute('width', w);
    tooltipBg.setAttribute('height', 18);
    tooltipText.setAttribute('x', cx - w / 2 + 8);
    tooltipText.setAttribute('y', cy - 16);
    tooltip.style.display = 'block';
  });
  pin.addEventListener('mouseleave', () => {
    document.getElementById('mapTooltip').style.display = 'none';
  });
});

// ── Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Input focus styles
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('focus', () => {
    el.style.borderColor = 'rgba(200,150,12,0.6)';
    el.style.background = 'rgba(255,255,255,0.1)';
  });
  el.addEventListener('blur', () => {
    el.style.borderColor = 'rgba(255,255,255,0.15)';
    el.style.background = 'rgba(255,255,255,0.07)';
  });
});
