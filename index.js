  // ── LOADER ──
  const loaderBar = document.getElementById('loaderBar');
  const loader = document.getElementById('loader');
  setTimeout(() => { loaderBar.style.width = '100%'; }, 100);
  setTimeout(() => { loader.classList.add('hidden'); }, 2000);

  // ── HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-nav-link, .mobile-cta, .menu-close').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // ── CUSTOM CURSOR ──
  const cursorOuter = document.getElementById('cursor-outer');
  const cursorInner = document.getElementById('cursor-inner');
  let mouseX = 0, mouseY = 0, outerX = 0, outerY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorInner.style.left = mouseX + 'px';
    cursorInner.style.top = mouseY + 'px';
  });
  (function animateCursor() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top = outerY + 'px';
    requestAnimationFrame(animateCursor);
  })();
  document.querySelectorAll('a, button, .gallery-item, .service-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ── THEME TOGGLE ──
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  let isDark = true;
  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    sunIcon.style.display = isDark ? 'block' : 'none';
    moonIcon.style.display = isDark ? 'none' : 'block';
  });

  // ── AMBIENT LIGHTING — MOUSE FOLLOWING ──
  const ambientMouse = document.getElementById('ambientMouse');
  let ambX = window.innerWidth / 2, ambY = window.innerHeight / 2;
  let targetX = ambX, targetY = ambY;
  
  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth ambient follow with lerp
  function animateAmbient() {
    ambX += (targetX - ambX) * 0.06;
    ambY += (targetY - ambY) * 0.06;
    ambientMouse.style.left = ambX + 'px';
    ambientMouse.style.top = ambY + 'px';
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // Ambient intensity changes on scroll
  window.addEventListener('scroll', () => {
    const scrollFraction = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
    const hue = 42 + scrollFraction * 8; // slight hue shift
    ambientMouse.style.background = `radial-gradient(circle, hsla(${hue}, 65%, 55%, 0.07) 0%, transparent 60%)`;
  });

  // ── SCROLL ANIMATIONS ──
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // ── HERO PARALLAX ──
  const heroBgImg = document.getElementById('heroBg');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroBgImg) heroBgImg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
  });

  // ── NAV SCROLL ──
  const mainNav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.pageYOffset > 60);
  });

  // ── GALLERY LIGHTBOX ──
  // ── GALLERY DATA ──
// Add all your images here.  I've included the ones from your original HTML.
// Add more entries to see pagination in action.
let galleryImages = [
    ...[...Array.from({length:35}).map((a,b)=>{return b?{src:'imgs/n'+b+'.jpeg',title:"Current"}:""})],
  { src: 'imgs/art2.jpg',  title: 'Echoes of Form' },
  { src: 'imgs/art3.jpg',  title: 'Golden Horizon' },
  { src: 'imgs/art4.jpg',  title: 'Silent Depth' },
  { src: 'imgs/art5.jpg',  title: 'Chromatic Study' },
  { src: 'imgs/art6.jpg',  title: 'The Vessel' },
  { src: 'imgs/art7.jpg',  title: 'Midnight Garden' },
  { src: 'imgs/art8.jpg',  title: 'Abstract Reverie' },
  { src: 'imgs/art9.jpg',  title: 'Luminous Path' },
  { src: 'imgs/art10.jpg', title: 'Solstice' },
  { src: 'imgs/art11.jpg', title: 'Contour' },
  { src: 'imgs/art12.jpg', title: 'The Awakening' },
  { src: 'imgs/art2.jpg',  title: 'Pulse' },
  { src: 'imgs/art14.jpg', title: 'Inner Light' },
  { src: 'imgs/art15.jpg', title: 'Terra Firma' },
  { src: 'imgs/art16.jpg', title: 'Celestial' },
  { src: 'imgs/art17.jpg', title: 'Meridian' },
  // Add more entries here — pagination will handle it
];
galleryImages=galleryImages.filter(a=>a)
const ITEMS_PER_PAGE = 8;
let currentPage = 1;
const totalPages = Math.ceil(galleryImages.length / ITEMS_PER_PAGE);

const galleryGrid = document.getElementById('galleryGrid');
const pageNumbers = document.getElementById('pageNumbers');
const pagePrev = document.getElementById('pagePrev');
const pageNext = document.getElementById('pageNext');

// ── RENDER GALLERY ITEM ──
function createGalleryItem(image, index) {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.setAttribute('data-src', image.src);
  div.setAttribute('data-title', image.title);
  div.innerHTML = `
    <img src="${image.src}" alt="${image.title}" loading="lazy"/>
    <div class="gallery-overlay">
      <div class="gallery-overlay-content">
        <span class="gallery-overlay-text">${image.title}</span>
        <div class="gallery-overlay-expand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </div>
      </div>
    </div>
  `;
  
  // Click → open lightbox
  div.addEventListener('click', () => openLightbox(index));
  
  return div;
}

// ── RENDER PAGE ──
function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = galleryImages.slice(start, end);
  
  // Clear grid
  galleryGrid.innerHTML = '';
  
  // Populate grid
  pageItems.forEach((image, i) => {
    const globalIndex = start + i;
    galleryGrid.appendChild(createGalleryItem(image, globalIndex));
  });
  
  // Update pagination controls
  updatePagination();
  
  // Re-observe reveal animations
  galleryGrid.classList.remove('visible');
  requestAnimationFrame(() => {
    galleryGrid.classList.add('visible');
  });
  
  // Scroll to gallery top smoothly
  document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── PAGINATION DOTS ──
function updatePagination() {
  // Build page dots
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const dot = document.createElement('button');
    dot.className = 'page-dot' + (i === currentPage ? ' active' : '');
    dot.setAttribute('aria-label', `Page ${i}`);
    dot.addEventListener('click', () => {
      if (i !== currentPage) renderPage(i);
    });
    pageNumbers.appendChild(dot);
  }
  
  // Update prev/next buttons
  pagePrev.disabled = currentPage === 1;
  pageNext.disabled = currentPage === totalPages;
}

// ── PREV / NEXT HANDLERS ──
pagePrev.addEventListener('click', () => {
  if (currentPage > 1) renderPage(currentPage - 1);
});
pageNext.addEventListener('click', () => {
  if (currentPage < totalPages) renderPage(currentPage + 1);
});

// ── INITIAL RENDER ──
renderPage(1);

// ── LIGHTBOX ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxDotsContainer = document.getElementById('lightboxDots');

let currentLightboxIndex = 0;

function buildLightboxDots() {
  lightboxDotsContainer.innerHTML = '';
  const total = Math.min(galleryImages.length, 12);
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'lightbox-dot' + (i === currentLightboxIndex ? ' active' : '');
    dot.addEventListener('click', () => openLightbox(i));
    lightboxDotsContainer.appendChild(dot);
  }
}

function updateLightboxDots() {
  const dots = lightboxDotsContainer.querySelectorAll('.lightbox-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentLightboxIndex));
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const item = galleryImages[index];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.title;
  lightboxCaption.textContent = item.title;
  lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
  buildLightboxDots();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

function showNext() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
  const item = galleryImages[currentLightboxIndex];
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    lightboxImg.style.opacity = '1';
    updateLightboxDots();
  }, 200);
}

function showPrev() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
  const item = galleryImages[currentLightboxIndex];
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    lightboxImg.style.opacity = '1';
    updateLightboxDots();
  }, 200);
}

// Fade transition
lightboxImg.style.transition = 'opacity 0.2s ease';

// Controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);

// Click outside to close
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

// Touch/swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { diff > 0 ? showNext() : showPrev(); }
});