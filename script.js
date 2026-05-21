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

// ── Leaflet UK Map
if (document.getElementById('ukMap') && typeof L !== 'undefined') {
  const ukMap = L.map('ukMap', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
    attributionControl: false
  }).setView([54.4, -2.9], 5.4);

  // Carto light-style tiles — clean, minimal, resembles Apple Maps topography
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(ukMap);

  // Custom gold pin icon
  const goldPin = L.divIcon({
    className: '',
    html: `<div style="
      width:14px; height:14px; border-radius:50%;
      background:#C8960C; border:2.5px solid #fff;
      box-shadow:0 2px 10px rgba(200,150,12,0.7);
      position:relative;">
      <div style="
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        width:28px; height:28px; border-radius:50%;
        background:rgba(200,150,12,0.22);
        animation:leaflet-pulse 2.2s ease-out infinite;">
      </div>
    </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    tooltipAnchor: [0, -12]
  });

  const regions = [
    { name: 'Glasgow City',       coords: [55.86, -4.25] },
    { name: 'Edinburgh',          coords: [55.95, -3.19] },
    { name: 'North East England', coords: [54.97, -1.61] },
    { name: 'Merseyside',         coords: [53.41, -2.99] },
    { name: 'Greater Manchester', coords: [53.48, -2.24] },
    { name: 'West Yorkshire',     coords: [53.80, -1.55] },
    { name: 'South Yorkshire',    coords: [53.38, -1.47] },
    { name: 'North Wales',        coords: [53.13, -4.00] },
    { name: 'Staffordshire',      coords: [52.78, -2.01] },
    { name: 'Nottinghamshire',    coords: [52.97, -1.17] },
    { name: 'Leicestershire',     coords: [52.63, -1.13] },
    { name: 'Norfolk',            coords: [52.62,  1.02] },
    { name: 'Cambridgeshire',     coords: [52.20,  0.12] },
    { name: 'Buckinghamshire',    coords: [51.81, -0.83] },
    { name: 'Greater London',     coords: [51.51, -0.12] },
    { name: 'Kent',               coords: [51.27,  0.51] },
    { name: 'Devon',              coords: [50.72, -3.53] }
  ];

  regions.forEach(r => {
    L.marker(r.coords, { icon: goldPin })
      .bindTooltip(r.name, {
        className: 'map-tooltip',
        direction: 'top',
        offset: [0, -10],
        permanent: false
      })
      .addTo(ukMap);
  });

  // Inject pulse keyframe if not already present
  if (!document.getElementById('leaflet-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'leaflet-pulse-style';
    style.textContent = `
      @keyframes leaflet-pulse {
        0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; }
        100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
