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

// ── UK image map pins — pulse rings + tooltips
const ukPins = document.querySelectorAll('.uk-pin');

// Create shared tooltip element
const pinTooltip = document.createElement('div');
pinTooltip.style.cssText = `
  position:fixed; background:#0B1F3A; color:#fff;
  font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600;
  letter-spacing:0.08em; padding:5px 12px; border-radius:6px;
  border:1px solid rgba(200,150,12,0.4); pointer-events:none;
  display:none; z-index:9999; white-space:nowrap;
  box-shadow:0 4px 16px rgba(11,31,58,0.3);
`;
document.body.appendChild(pinTooltip);

ukPins.forEach(pin => {
  // Add pulse ring span
  const pulse = document.createElement('span');
  pulse.className = 'pulse';
  pin.appendChild(pulse);

  // Tooltip on hover
  pin.addEventListener('mouseenter', e => {
    pinTooltip.textContent = pin.dataset.region;
    pinTooltip.style.display = 'block';
  });
  pin.addEventListener('mousemove', e => {
    pinTooltip.style.left = (e.clientX + 14) + 'px';
    pinTooltip.style.top  = (e.clientY - 32) + 'px';
  });
  pin.addEventListener('mouseleave', () => {
    pinTooltip.style.display = 'none';
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

