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

  // Fully interactive — drag, scroll zoom, touch zoom, zoom controls
  const ukMap = L.map('ukMap', {
    zoomControl: true,
    dragging: true,
    scrollWheelZoom: false,   // disabled so page scrolling still works; enable on map click
    doubleClickZoom: true,
    touchZoom: true,
    boxZoom: false,
    keyboard: false,
    attributionControl: false
  }).setView([54.4, -2.9], 5.4);

  // Enable scroll zoom only when user has clicked into the map
  ukMap.on('click', () => ukMap.scrollWheelZoom.enable());
  ukMap.on('mouseout', () => ukMap.scrollWheelZoom.disable());

  // ESRI Physical Map — green terrain + blue ocean (matches the reference style)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 8,
    minZoom: 4
  }).addTo(ukMap);

  // Style zoom control to match brand
  const zoomStyle = document.createElement('style');
  zoomStyle.textContent = `
    .leaflet-control-zoom a {
      background: #0B1F3A !important;
      color: #C8960C !important;
      border-color: rgba(200,150,12,0.3) !important;
      font-weight: 700 !important;
    }
    .leaflet-control-zoom a:hover {
      background: #C8960C !important;
      color: #0B1F3A !important;
    }
  `;
  document.head.appendChild(zoomStyle);

  // Teardrop pin icon in brand gold
  function makePin(active) {
    const fill = active ? '#E5B93A' : '#C8960C';
    return L.divIcon({
      className: '',
      html: `
        <div class="avg-pin" style="position:relative;width:28px;height:40px;cursor:pointer;">
          <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg"
               style="filter:drop-shadow(0 3px 6px rgba(11,31,58,0.45));">
            <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.268 21.732 0 14 0z"
                  fill="${fill}"/>
            <circle cx="14" cy="14" r="5.5" fill="white"/>
          </svg>
        </div>`,
      iconSize: [28, 40],
      iconAnchor: [14, 40],
      popupAnchor: [0, -44]
    });
  }

  const regions = [
    { name: 'Glasgow City',       coords: [55.86, -4.25], desc: 'Active operator network across Greater Glasgow & Clyde Valley.' },
    { name: 'Edinburgh',          coords: [55.95, -3.19], desc: 'Covering Edinburgh, Lothians and surrounding business districts.' },
    { name: 'North East England', coords: [54.97, -1.61], desc: 'Serving Tyne & Wear, County Durham and Teesside businesses.' },
    { name: 'Merseyside',         coords: [53.41, -2.99], desc: 'Full vending coverage across Liverpool and the wider Mersey region.' },
    { name: 'Greater Manchester', coords: [53.48, -2.24], desc: 'Comprehensive service across all 10 Greater Manchester boroughs.' },
    { name: 'West Yorkshire',     coords: [53.80, -1.55], desc: 'Operators covering Leeds, Bradford, Wakefield and Calderdale.' },
    { name: 'South Yorkshire',    coords: [53.38, -1.47], desc: 'Sheffield, Doncaster, Rotherham and Barnsley coverage.' },
    { name: 'North Wales',        coords: [53.13, -4.00], desc: 'Serving businesses across Gwynedd, Conwy and Denbighshire.' },
    { name: 'Staffordshire',      coords: [52.78, -2.01], desc: 'Covering Stoke-on-Trent, Stafford and surrounding areas.' },
    { name: 'Nottinghamshire',    coords: [52.97, -1.17], desc: 'Full vending solutions across Nottingham and the East Midlands.' },
    { name: 'Leicestershire',     coords: [52.63, -1.13], desc: 'Leicester city and county-wide operator coverage.' },
    { name: 'Norfolk',            coords: [52.62,  1.02], desc: 'Serving Norwich, King\'s Lynn and across East Anglia.' },
    { name: 'Cambridgeshire',     coords: [52.20,  0.12], desc: 'Cambridge and surrounding tech corridor businesses.' },
    { name: 'Buckinghamshire',    coords: [51.81, -0.83], desc: 'Milton Keynes, Aylesbury and Thames Valley coverage.' },
    { name: 'Greater London',     coords: [51.51, -0.12], desc: 'London-wide network spanning all 32 boroughs.' },
    { name: 'Kent',               coords: [51.27,  0.51], desc: 'Maidstone, Canterbury, Folkestone and across the Garden of England.' },
    { name: 'Devon',              coords: [50.72, -3.53], desc: 'Exeter, Plymouth and South West Peninsula coverage.' }
  ];

  regions.forEach(r => {
    const marker = L.marker(r.coords, { icon: makePin(false) });

    // Branded popup on click
    marker.bindPopup(`
      <div style="
        font-family:'Montserrat',sans-serif;
        min-width:200px;
        padding:4px 2px;">
        <div style="
          font-size:10px;font-weight:700;letter-spacing:0.14em;
          text-transform:uppercase;color:#C8960C;margin-bottom:5px;">
          Active Region
        </div>
        <div style="
          font-family:'Fraunces',Georgia,serif;
          font-size:17px;font-weight:700;
          color:#0B1F3A;margin-bottom:8px;line-height:1.2;">
          ${r.name}
        </div>
        <p style="font-size:13px;color:#3A4A60;line-height:1.6;margin:0 0 12px;">
          ${r.desc}
        </p>
        <a href="#join" style="
          display:inline-block;
          background:#C8960C;color:#0B1F3A;
          font-size:11px;font-weight:700;
          letter-spacing:0.06em;text-transform:uppercase;
          padding:7px 14px;border-radius:6px;
          text-decoration:none;">
          Get a Quote &rarr;
        </a>
      </div>`, {
      maxWidth: 260,
      className: 'avg-popup'
    });

    // Swap to bright pin on open, back on close
    marker.on('popupopen',  () => marker.setIcon(makePin(true)));
    marker.on('popupclose', () => marker.setIcon(makePin(false)));

    marker.addTo(ukMap);
  });

  // Inject popup styles
  const popupStyle = document.createElement('style');
  popupStyle.textContent = `
    .avg-popup .leaflet-popup-content-wrapper {
      background: #fff;
      border-radius: 12px;
      border: 1px solid rgba(200,150,12,0.25);
      box-shadow: 0 16px 48px rgba(11,31,58,0.18);
      padding: 20px 22px;
    }
    .avg-popup .leaflet-popup-content { margin: 0; }
    .avg-popup .leaflet-popup-tip { background: #fff; }
    .avg-popup .leaflet-popup-close-button {
      color: #7D8FA8 !important;
      font-size: 18px !important;
      top: 10px !important;
      right: 12px !important;
    }
  `;
  document.head.appendChild(popupStyle);
}
